# syntax=docker/dockerfile:1.7
# Contexto de build: raiz do monorepo (workspaces + package-lock.json).
#
# NEXT_PUBLIC_API_URL é embutido no bundle do navegador no `next build`.
# Deve ser a URL pública que o browser usa para alcançar a API de homologação
# (ex.: https://api-homolog.exemplo.com), nunca o hostname Docker interno.
FROM node:20.18-bookworm-slim AS base
WORKDIR /app
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/*

FROM base AS deps
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
RUN npm ci --workspace=@pef/web --include-workspace-root

FROM deps AS build
ARG NEXT_PUBLIC_API_URL=http://127.0.0.1:3001
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
COPY apps/web ./apps/web
RUN test -n "$NEXT_PUBLIC_API_URL" \
  && echo "NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}" \
  && npm run build -w @pef/web

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
WORKDIR /app

COPY --from=build /app/apps/web/public ./apps/web/public
COPY --from=build /app/apps/web/.next/standalone ./
COPY --from=build /app/apps/web/.next/static ./apps/web/.next/static

EXPOSE 3000
WORKDIR /app/apps/web
CMD ["node", "server.js"]
