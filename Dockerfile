# ==========================================
# 1. Build Go Backend Binary
# ==========================================
FROM golang:1.24-alpine AS go-builder
WORKDIR /backend
RUN apk add --no-cache git ca-certificates
COPY backend/go.mod backend/go.sum ./
RUN go mod download
COPY backend/ ./
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /app/portfolio-backend .

# ==========================================
# 2. Build Next.js Standalone Frontend
# ==========================================
FROM node:22-alpine AS next-builder
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

# ==========================================
# 3. Final Production Runner Container
# ==========================================
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV APP_ENV=production
ENV API_BASE_URL=http://127.0.0.1:8080

RUN apk add --no-cache ca-certificates

# Copy Go backend binary
COPY --from=go-builder /app/portfolio-backend /app/portfolio-backend

# Copy Next.js standalone build and static assets
COPY --from=next-builder /app/public ./public
COPY --from=next-builder /app/.next/standalone ./
COPY --from=next-builder /app/.next/static ./.next/static

# Copy startup script
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh /app/portfolio-backend

EXPOSE 3000

CMD ["/app/entrypoint.sh"]
