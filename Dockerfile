FROM node:22.20-bookworm-slim AS base

ENV NODE_ENV=production \
  NEXT_TELEMETRY_DISABLED=1 \
  PNPM_HOME=/pnpm \
  PATH=/pnpm:$PATH

RUN corepack enable && corepack prepare pnpm@10.6.1 --activate

WORKDIR /app

FROM base AS build

ENV NODE_ENV=development \
  NODE_OPTIONS=--max-old-space-size=4096 \
  MAIN_URL=http://localhost:4200 \
  FRONTEND_URL=http://localhost:4200 \
  NEXT_PUBLIC_BACKEND_URL=http://localhost:3000 \
  BACKEND_INTERNAL_URL=http://localhost:3000 \
  DATABASE_URL=postgresql://postiz-user:postiz-password@postiz-postgres:5432/postiz-db-local \
  JWT_SECRET=build-secret \
  STORAGE_PROVIDER=local \
  UPLOAD_DIRECTORY=/uploads \
  NEXT_PUBLIC_UPLOAD_STATIC_DIRECTORY=/uploads \
  POSTIZ_ENABLE_HEAVY_FEATURES=false \
  POSTIZ_ENABLE_SWAGGER=false \
  IS_GENERAL=true \
  DISABLE_REGISTRATION=false

COPY . .

RUN pnpm install --frozen-lockfile --ignore-scripts
RUN ./node_modules/.bin/prisma generate --schema ./libraries/nestjs-libraries/src/database/prisma/schema.prisma

# Build both apps in production mode so Next.js generates the same output as the
# local runtime build instead of using development server internals.
RUN NODE_ENV=production pnpm run build:backend && NODE_ENV=production pnpm run build:frontend

FROM base AS runtime

RUN apt-get update && apt-get install -y --no-install-recommends bash \
  && rm -rf /var/lib/apt/lists/*

COPY --from=build /app /app

RUN chmod +x /app/var/docker/start-lite.sh

EXPOSE 3000 4200

CMD ["/app/var/docker/start-lite.sh"]
