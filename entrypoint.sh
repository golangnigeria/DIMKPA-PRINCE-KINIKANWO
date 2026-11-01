#!/bin/sh
set -e

echo "==> Starting Go Backend on port 8080..."
export GO_PORT=8080
export BACKEND_PORT=8080
/app/portfolio-backend &
BACKEND_PID=$!

echo "==> Starting Next.js frontend on port ${PORT:-3000}..."
export PORT=${PORT:-3000}
export HOSTNAME="0.0.0.0"
export API_BASE_URL="http://127.0.0.1:8080"
node server.js &
FRONTEND_PID=$!

# Forward termination signals to both child processes
trap "kill -TERM $BACKEND_PID $FRONTEND_PID 2>/dev/null || true; exit 0" SIGTERM SIGINT

# Wait for either process to exit
wait -n $BACKEND_PID $FRONTEND_PID
EXIT_CODE=$?

echo "==> A process exited with status $EXIT_CODE, shutting down container..."
kill -TERM $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
exit $EXIT_CODE
