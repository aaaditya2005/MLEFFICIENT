import "dotenv/config";
import express from "express";
import session from "express-session";
import bcrypt from "bcryptjs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const app = express();
app.set("trust proxy", 1);
const port = Number(process.env.PORT || 4173);
const production = process.env.NODE_ENV === "production";
const username = process.env.ADMIN_USERNAME || "admin";
const passwordHash = process.env.ADMIN_PASSWORD_HASH;
const sessionSecret = process.env.SESSION_SECRET;

if (!passwordHash) throw new Error("ADMIN_PASSWORD_HASH is required");
if (!sessionSecret || sessionSecret.length < 32) throw new Error("SESSION_SECRET must be at least 32 characters");

const dataDirectory = path.resolve("data");
const configFile = path.join(dataDirectory, "site-config.json");
await mkdir(dataDirectory, { recursive: true });

async function loadConfig() {
  try {
    return JSON.parse(await readFile(configFile, "utf8"));
  } catch {
    return {};
  }
}

async function requireAdmin(req, res, next) {
  if (req.session?.adminAuthenticated) return next();
  return res.status(401).json({ error: "Authentication required" });
}

const loginAttempts = new Map();
app.use(express.json({ limit: "2mb" }));
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: production, sameSite: "strict", maxAge: 8 * 60 * 60 * 1000 },
  name: "ml_efficient_admin",
}));

app.get("/api/config", async (_req, res) => {
  res.json(await loadConfig());
});

app.get("/api/auth/me", requireAdmin, (_req, res) => {
  res.json({ authenticated: true });
});

app.post("/api/auth/login", async (req, res) => {
  const now = Date.now();
  const ip = req.ip;
  const attempts = loginAttempts.get(ip) || { count: 0, retryAfter: 0 };
  if (attempts.retryAfter > now) return res.status(429).json({ error: "Too many attempts" });

  const valid = req.body?.username === username &&
    typeof req.body?.password === "string" &&
    await bcrypt.compare(req.body.password, passwordHash);

  if (!valid) {
    attempts.count += 1;
    if (attempts.count >= 5) attempts.retryAfter = now + 60_000;
    loginAttempts.set(ip, attempts);
    return res.status(401).json({ error: "Incorrect credentials" });
  }

  loginAttempts.delete(ip);
  req.session.regenerate((error) => {
    if (error) return res.status(500).json({ error: "Session error" });
    req.session.adminAuthenticated = true;
    req.session.save((saveError) => {
      if (saveError) return res.status(500).json({ error: "Session error" });
      res.json({ authenticated: true });
    });
  });
});

app.post("/api/auth/logout", (req, res) => {
  req.session.destroy(() => res.status(204).end());
});

app.put("/api/config", requireAdmin, async (req, res) => {
  await writeFile(configFile, `${JSON.stringify(req.body, null, 2)}\n`, "utf8");
  res.json({ saved: true });
});

if (production) {
  app.use(express.static(path.resolve("dist")));
  app.get("/{*path}", (_req, res) => res.sendFile(path.resolve("dist/index.html")));
}

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
