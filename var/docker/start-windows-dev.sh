#!/usr/bin/env bash

set -euo pipefail

cd /app

# The app scripts expect /app/.env to exist, even if Compose is already
# providing the actual values through the container environment.
touch .env

if [[ ! -d node_modules/.pnpm ]]; then
  echo "Installing dependencies..."
  pnpm install --frozen-lockfile
fi

if [[ "${POSTIZ_RUN_DB_PUSH:-true}" == "true" ]]; then
  echo "Syncing Prisma schema to Postgres..."
  until pnpm prisma-db-push; do
    echo "Waiting for Postgres to become ready..."
    sleep 5
  done
fi

echo "Starting Postiz backend and frontend in watch mode..."
pnpm dev-backend
