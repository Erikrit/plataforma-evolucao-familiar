#!/usr/bin/env bash
set -euo pipefail
echo "NODE=$(node -v)"
mkdir -p /app
rm -rf /app/*
tar -C /src \
  --exclude=node_modules \
  --exclude=.git \
  --exclude='apps/*/node_modules' \
  --exclude='.next*' \
  --exclude=backups \
  --exclude='docs/esteira/estado/*.html' \
  --exclude='docs/esteira/estado/*.txt' \
  --exclude='docs/esteira/estado/*.json' \
  -cf - . | tar -C /app -xf -
cd /app
npm config set fetch-timeout 600000
npm config set fetch-retries 5
npm ci --no-fund --no-audit
npm run db:generate
npm run lint
npm run typecheck
npm run build
echo CI_LOCAL_PASS
