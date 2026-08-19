# Deploying to Hostinger Business Hosting

This app is one Node.js process (Express) that serves the API, the admin
panel, and the built React site all from the same origin — no VPS, Docker,
or separate API domain required.

## 1. Create the MySQL database (Hostinger hPanel)

1. hPanel → **Databases → MySQL Databases** → create a new database + user.
2. Note the host, port (usually `localhost` from inside Hostinger, port `3306`), database name, username, password.
3. No manual schema import needed — the app creates any missing tables itself on first boot (see `src/scripts/initDb.js`). It only ever *adds* tables, never alters/drops existing ones, so it's safe to redeploy repeatedly.

## 2. Create the Node.js Web App (hPanel)

1. hPanel → **Advanced → Node.js** → create application.
2. **Application root**: the repo root (or wherever `frontend/` and `backend/` live side by side).
3. **Application startup file**: `backend/server.js`.
4. **Node version**: 18 LTS or newer.
5. **Install command**:
   ```bash
   cd backend && npm install --omit=dev && cd ../frontend && npm install && npm run build
   ```
   (Builds the React app into `frontend/build/`, which `server.js` serves as static files + SPA fallback for every non-API route.)
6. **Start command**: `node backend/server.js` (or just use the Node app's default start button once the startup file above is set).

## 3. Environment variables

Set these in hPanel's Node.js app → Environment Variables (copy `backend/.env.example` for the full list with comments):

```env
NODE_ENV=production
APP_URL=https://yourdomain.com.au
DB_HOST=localhost
DB_PORT=3306
DB_NAME=<from step 1>
DB_USER=<from step 1>
DB_PASSWORD=<from step 1>
JWT_SECRET=<random 48+ byte hex string>
SESSION_SECRET=<random 48+ byte hex string>
ADMIN_USERNAME=admin
ADMIN_INITIAL_PASSWORD=admin123
```

Generate the two secrets with:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

`ADMIN_USERNAME`/`ADMIN_INITIAL_PASSWORD` are only read the very first time the app boots against an empty `admin_users` table — they seed one admin account (password bcrypt-hashed before it touches the database). Change the password from **Admin → Account** after your first login; the env vars aren't consulted again after that.

## 4. Uploaded media

Images uploaded through Admin → Media are written to `backend/uploads/<category>/` and served at `/uploads/...`. This directory must **persist between deploys** — if Hostinger's deploy step replaces the whole application directory, point `UPLOAD_DIR` (env var) at a path outside that directory instead (e.g. a persistent storage mount, if your plan includes one) so uploads survive redeploys.

## 5. Domain / SSL

Connect your domain to the Node.js app in hPanel and issue the free SSL certificate there. Once done:
- `https://yourdomain.com.au/` — public site
- `https://yourdomain.com.au/admin` — admin login
- `https://yourdomain.com.au/api/...` — backend API

All same origin — no CORS configuration needed in production beyond `APP_URL` matching your real domain (`server.js` restricts CORS to exactly that origin).

## 6. First boot checklist

- [ ] App starts without errors (check hPanel's Node.js app logs)
- [ ] `https://yourdomain.com.au/api/health` returns `{"status":"ok"}`
- [ ] `/admin` redirects to `/admin/login`
- [ ] Log in with `admin` / `admin123` (or your configured initial password)
- [ ] **Change the password immediately** from Admin → Account
- [ ] Submit the homepage lead form → confirm it appears in Admin → Leads
- [ ] Upload an image in Admin → Media → confirm it displays
- [ ] Public site loads services/packages/reviews/FAQs correctly

## 7. Seeding existing content (first deploy only)

If this is a brand new database, run once (via SSH/terminal if your Hostinger plan includes it, or as a one-off Node.js app "run command" if hPanel offers one):

```bash
cd backend
npm run db:seed-admin   # creates the initial admin user (idempotent - safe to re-run)
npm run db:seed         # migrates the site's existing real content in (idempotent)
```

Both scripts check for existing rows before inserting, so re-running them later is harmless.

## Local development

```bash
# Terminal 1 - backend, against a local MySQL instance
cd backend
cp .env.example .env   # fill in local DB credentials
npm install
npm run db:init && npm run db:seed-admin && npm run db:seed
npm run dev             # nodemon, http://localhost:3001

# Terminal 2 - frontend
cd frontend
echo "REACT_APP_API_BASE=http://localhost:3001" > .env.local
npm install
npm start                # http://localhost:3000
```
