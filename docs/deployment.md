# Deployment

The frontend deploys as a Next.js application (e.g. Vercel, Railway, Docker, or any Node.js host).
The backend is a lightweight Go server that can run on any server, container, or VM.

---

## 1. Go Backend

The Go backend resides in `backend/`.

### Configuration (Environment Variables)

| Variable | Description |
| --- | --- |
| `PORT` | Port to listen on (default `8080`) |
| `APP_ENV` | `development` (uses SQLite `dev.db`) or `production` (uses PostgreSQL) |
| `DATABASE_URL` | PostgreSQL connection URL |
| `JWT_SECRET` | Secret string used for signing JWT admin session tokens |
| `ADMIN_EMAIL` | Default admin email address (seeded on first boot) |
| `ADMIN_PASSWORD` | Default admin password (seeded on first boot) |
| `CORS_ORIGINS` | Allowed frontend origins (e.g., `http://localhost:3000,https://yourdomain.com`) |
| `SMTP_HOST` | (Optional) SMTP host for email alerts |
| `SMTP_PORT` | (Optional) SMTP port (default `465`) |
| `SMTP_USER` | (Optional) SMTP username |
| `SMTP_PASS` | (Optional) SMTP password / app password |
| `CONTACT_RECIPIENT_EMAIL` | (Optional) Email address to receive notifications |

### Building and Running

```bash
cd backend
go build -o server .
./server
```

---

## 2. Next.js Frontend

### Configuration (`.env`)

```bash
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
API_BASE_URL=https://api.yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Build

```bash
npm run build
npm start
```

---

## Production Checklist

- [ ] Go backend running and connected to PostgreSQL
- [ ] Admin password changed from default
- [ ] Next.js `API_BASE_URL` points to the Go backend
- [ ] `/admin` redirects to `/admin/login` when not authenticated
- [ ] Submitting contact form saves record into PostgreSQL database
