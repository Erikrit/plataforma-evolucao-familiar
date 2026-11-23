# syntax=docker/dockerfile:1.7
# Contexto de build: raiz do monorepo (workspaces + package-lock.json).
FROM node:20.18-bookworm-slim AS base
WORKDIR /app
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

FROM base AS deps
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
RUN npm ci --workspace=@pef/api --include-workspace-root

FROM deps AS build
COPY tsconfig.base.json ./
COPY apps/api ./apps/api
RUN npx prisma generate --schema=apps/api/prisma/schema.prisma \
  && npm run build -w @pef/api

FROM base AS runner
ENV NODE_ENV=production
ENV API_PORT=3001
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
# Prisma CLI fica em devDependency; necessário para `migrate deploy` no alvo.
RUN npm ci --workspace=@pef/api --include-workspace-root --omit=dev \
  && npm install prisma --workspace=@pef/api --no-save \
  && npm cache clean --force

COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/prisma ./apps/api/prisma
COPY deploy/homolog/migrar-e-carregar.sh /app/migrar-e-carregar.sh
RUN chmod +x /app/migrar-e-carregar.sh \
  && npx prisma generate --schema=apps/api/prisma/schema.prisma

EXPOSE 3001
WORKDIR /app/apps/api
CMD ["node", "dist/main.js"]
