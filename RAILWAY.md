# Railway Deployment Guide

Deploy the backend API and the Vite frontend as two Railway services. The backend already listens on `PORT` and now understands both `DB_*` and Railway's `MYSQL*` variables, so the MySQL add-on works without extra wiring.

## Services
- **Backend (`backend/`)**
  - Build: `npm ci && npm run build`
  - Start: `npm run start`
  - Healthcheck: `GET /health`
  - Optional seed: `npm run db:seed` (run once after the MySQL database is attached)
- **Frontend (`frontend/`)**
  - Build: `npm ci && npm run build`
  - Start (preview/static runner): `npm run preview -- --host 0.0.0.0 --port $PORT`

## Environment
- **Backend**
  - `JWT_SECRET` (required)
  - `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` (required for real auth; keep `\n` escapes in the private key)
  - `APP_NAME` (optional)
  - Database: either set `DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME` **or** rely on Railway's `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE` from the MySQL add-on (automatically picked up).
  - `PORT` is injected by Railway; no change needed.
- **Frontend**
  - `VITE_API_URL` pointing to the backend (e.g., `https://<backend>.up.railway.app/api`)
  - Firebase web keys: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID`

## One-pass Deploy Steps
1) Create a Railway project with two services: point one at `backend/`, another at `frontend/`.
2) For the backend, attach the MySQL add-on, set `JWT_SECRET` and Firebase Admin keys, then deploy (build + start commands above). Verify `/health`.
3) For the frontend, set `VITE_API_URL` to the backend's public URL and provide the Firebase web keys, then deploy. The Vite preview command will bind to `$PORT`.
4) (Optional) Run `npm run db:seed` on the backend service to load schema + demo data after the DB is provisioned.
