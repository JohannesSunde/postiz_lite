#!/usr/bin/env bash

set -euo pipefail

cd /app

if [[ "${POSTIZ_RUN_DB_PUSH:-true}" == "true" ]]; then
  echo "Syncing Prisma schema to Postgres..."
  until ./node_modules/.bin/prisma db push --accept-data-loss --schema ./libraries/nestjs-libraries/src/database/prisma/schema.prisma; do
    echo "Waiting for Postgres to become ready..."
    sleep 5
  done
fi

echo "Starting Postiz frontend on :4200 and backend on :3000..."

./node_modules/.bin/next start -p 4200 -H 0.0.0.0 &
FRONTEND_PID=$!

node --experimental-require-module ./dist/apps/backend/src/main.js &
BACKEND_PID=$!

shutdown() {
  kill "${FRONTEND_PID}" "${BACKEND_PID}" 2>/dev/null || true
  wait "${FRONTEND_PID}" "${BACKEND_PID}" 2>/dev/null || true
}

trap shutdown INT TERM

wait -n "${FRONTEND_PID}" "${BACKEND_PID}"
status=$?
shutdown
exit "${status}"
