import bcrypt from "bcryptjs";
import crypto from "node:crypto";

const cookieName = "ml_efficient_admin";

function send(response, status, value, extraHeaders = {}) {
  response.status(status);
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  for (const [name, headerValue] of Object.entries(extraHeaders)) {
    response.setHeader(name, headerValue);
  }
  response.end(JSON.stringify(value));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 2_000_000) reject(new Error("Request body too large"));
    });
    request.on("end", () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    request.on("error", reject);
  });
}

function sign(value, secret) {
  return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}

function adminCookie(request) {
  const cookies = Object.fromEntries((request.headers.cookie || "").split(";").map((part) => {
    const separator = part.indexOf("=");
    return separator === -1 ? [part.trim(), ""] : [part.slice(0, separator).trim(), part.slice(separator + 1).trim()];
  }));
  return cookies[cookieName];
}

function isAuthenticated(request) {
  const secret = process.env.SESSION_SECRET;
  const token = adminCookie(request);
  if (!secret || !token) return false;
  const separator = token.lastIndexOf(".");
  if (separator === -1) return false;
  const payload = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  try {
    const validSignature = crypto.timingSafeEqual(Buffer.from(sign(payload, secret)), Buffer.from(signature));
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return validSignature && decoded.admin === true && decoded.expiresAt > Date.now();
  } catch {
    return false;
  }
}

export default async function handler(request, response) {
  const url = new URL(request.url, "http://localhost");
  const path = url.pathname.replace(/^\/api\/?/, "").replace(/\/$/, "") || "root";

  if (path === "config" && request.method === "GET") {
    return send(response, 200, {});
  }

  if (path === "auth/me" && request.method === "GET") {
    return isAuthenticated(request)
      ? send(response, 200, { authenticated: true })
      : send(response, 401, { authenticated: false });
  }

  if (path === "auth/login" && request.method === "POST") {
    try {
      const body = await readBody(request);
      const passwordHash = process.env.ADMIN_PASSWORD_HASH;
      const validUsername = body.username === (process.env.ADMIN_USERNAME || "admin");
      const validPassword = passwordHash && typeof body.password === "string" && await bcrypt.compare(body.password, passwordHash);
      if (!validUsername || !validPassword) return send(response, 401, { error: "Incorrect credentials" });

      const expiresAt = Date.now() + 8 * 60 * 60 * 1000;
      const payload = Buffer.from(JSON.stringify({ admin: true, expiresAt })).toString("base64url");
      const token = `${payload}.${sign(payload, process.env.SESSION_SECRET || "")}`;
      return send(response, 200, { authenticated: true }, {
        "Set-Cookie": `${cookieName}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800`,
      });
    } catch (error) {
      return send(response, 400, { error: error.message });
    }
  }

  if (path === "auth/logout" && request.method === "POST") {
    return send(response, 204, undefined, {
      "Set-Cookie": `${cookieName}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`,
    });
  }

  if (path === "config" && request.method === "PUT") {
    if (!isAuthenticated(request)) return send(response, 401, { error: "Authentication required" });
    try {
      await readBody(request);
      return send(response, 503, { error: "Persistent configuration storage is not configured." });
    } catch (error) {
      return send(response, 400, { error: error.message });
    }
  }

  return send(response, 404, { error: "Not found" });
}
