# The admin inbox

A private page at `/admin` listing everything sent through the contact form.

Sign-in is managed by the Go backend server using bcrypt password hashing and JWT sessions.

## Database setup

- **Development**: The Go backend defaults to SQLite (`dev.db`), creating the tables and default admin account automatically on first boot.
- **Production**: Set `APP_ENV=production` and provide `DATABASE_URL`. The Go backend connects via PostgreSQL, automatically runs migrations, and seeds the admin user if one doesn't exist.

## Running the backend

To run the backend server:

```bash
cd backend
go run main.go
```

By default, the server runs on port `8080` (configurable with `PORT=...`).

## Default admin credentials

- **Email**: `admin@gmail.com`
- **Password**: `Admin@inUS2`

These can be configured via environment variables in `.env`:
```bash
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=Admin@inUS2
JWT_SECRET=your-secret-key
```

## Admin protection

1. **`proxy.ts`**: Next.js middleware checks for the `admin_session` cookie and redirects unauthenticated users to `/admin/login`.
2. **`lib/admin/auth.ts`**: Revalidates the token with `GET /api/auth/me`.
3. **Go backend**: Endpoints under `/api/admin/*` require a valid JWT header or cookie.
