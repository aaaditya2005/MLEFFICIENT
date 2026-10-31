# MLEfficient

## Secure admin setup

1. Copy `.env.example` to `.env`.
2. Generate a bcrypt password hash:
   ```powershell
   npm run hash-password -- "your-new-password"
   ```
3. Set `ADMIN_PASSWORD_HASH` in `.env` to that hash.
4. Generate a session secret and set it in `SESSION_SECRET`:
   ```powershell
   node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"
   ```
5. Start both the Vite app and backend with `npm run dev`.

The password must not be stored in `.env` or source code; only its bcrypt hash is used. This app uses an HttpOnly, same-site session cookie and never trusts browser storage for authentication.

For production, run `npm run build`, then `NODE_ENV=production npm run server`. Keep `.env` and the `data/` directory outside the public build. When running more than one server instance or restarting frequently, replace the in-memory session store with a shared server-side session store or database.

