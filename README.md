<div align="center">

# DIMKPA-PRINCE-KINIKANWO

An interactive, responsive 3D portfolio template with a custom Go backend, Next.js 16, TypeScript, Tailwind CSS v4, Three.js, and WebGL shader effects.

</div>

## What you get

- **3D portfolio**: Animated GLTF hero, a GPU shader globe that travels with scroll, pinned horizontal showcase, and scroll-driven reveals.
- **Go Backend**: High-performance Go REST API. Uses SQLite for zero-friction local development, and PostgreSQL in production.
- **Admin panel**: Inquiries save to your database and appear in a private inbox at `/admin` with search, pagination and delete.
- **SEO ready**: `sitemap.xml`, `robots.txt`, canonical URLs, Open Graph, Twitter cards, and JSON-LD structured data.

## Tech stack

- **Frontend**: Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Three.js + React Three Fiber · Motion
- **Backend**: Go (Golang) · SQLite (dev) / PostgreSQL (production) · JWT authentication · Bcrypt

## Quick start

### 1. Frontend
```bash
npm install
npm run dev
```
Runs at <http://localhost:3000>.

### 2. Backend
```bash
cd backend
go run main.go
```
Runs at <http://localhost:8080>.
- In **development**, automatically uses SQLite (`backend/dev.db`).
- In **production**, set `APP_ENV=production` and `DATABASE_URL` for PostgreSQL.

## Environment Variables

Configured in `.env`:

| Variable | Purpose |
| --- | --- |
| `API_BASE_URL` | Go backend URL (e.g. `http://localhost:8080`) |
| `NEXT_PUBLIC_SITE_URL` | Live website domain |
| `DATABASE_URL` | PostgreSQL connection string (production) |
| `APP_ENV` | `development` (SQLite) or `production` (PostgreSQL) |
| `ADMIN_EMAIL` | Default admin email (`admin@gmail.com`) |
| `ADMIN_PASSWORD` | Default admin password (`Admin@inUS2`) |
| `JWT_SECRET` | Secret key for JWT sessions |

## Documentation

| Document | Description |
| --- | --- |
| [`docs/customization.md`](docs/customization.md) | Making it your own |
| [`docs/deployment.md`](docs/deployment.md) | Deployment instructions |
| [`docs/admin.md`](docs/admin.md) | Admin panel and auth model |
| [`docs/architecture.md`](docs/architecture.md) | Project architecture |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Conventions and PR flow |
