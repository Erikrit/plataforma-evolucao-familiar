#!/bin/sh
set -eu
cd /app/apps/api
echo "[pef-homolog] prisma migrate deploy"
npx prisma migrate deploy
echo "[pef-homolog] carga oficial (catálogos; sem contas/fixtures)"
node prisma/carga-oficial.mjs
echo "[pef-homolog] migrate + carga concluídos"
