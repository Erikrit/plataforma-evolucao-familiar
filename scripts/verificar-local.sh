#!/usr/bin/env bash
# Portões de qualidade com banco e API locais (Docker), para a esteira registrar
# authz e smokes com fingerprint. Não faz commit, push nem merge.
#
# Uso (no Claude Code ou no terminal, na raiz do repositório):
#   bash scripts/verificar-local.sh <DEMANDA> <BASE> [perfis...]
# Exemplo:
#   bash scripts/verificar-local.sh DEV-CAT-M1 514b0494ddf31548966dc1d68a328488471b0cd2 qg1 qg2
#
# Segurança: só aceita banco em localhost/127.0.0.1 (PostgreSQL do docker compose,
# dados fictícios). Nunca apaga nem recria banco; o banco da VPS não é tocado.
set -euo pipefail

DEMANDA="${1:?informe a demanda, ex.: DEV-CAT-M1}"
BASE="${2:?informe o commit base do diff da demanda}"
shift 2
if [ "$#" -eq 0 ]; then PERFIS=(qg1 qg2); else PERFIS=("$@"); fi

[ -f esteira.config.json ] || { echo "Rode na raiz do repositório."; exit 1; }
git rev-parse --verify --quiet "$BASE^{commit}" >/dev/null || { echo "Base $BASE não encontrada; rode git fetch."; exit 1; }

export DATABASE_URL="${DATABASE_URL:-postgresql://pef:pef_dev_local@localhost:5433/pef?schema=public}"
export API_URL="${API_URL:-http://localhost:3001}"
export API_PORT="${API_PORT:-3001}"
case "$DATABASE_URL" in
  *@localhost:*|*@127.0.0.1:*) ;;
  *) echo "DATABASE_URL não é local. Recusado."; exit 1 ;;
esac
case "$API_URL" in
  http://localhost:*|http://127.0.0.1:*) ;;
  *) echo "API_URL não é local. Recusado."; exit 1 ;;
esac

echo "== Banco local (docker compose)"
docker compose up -d postgres
for _ in $(seq 1 60); do
  docker compose exec -T postgres pg_isready -U pef -d pef >/dev/null 2>&1 && break
  sleep 1
done
docker compose exec -T postgres pg_isready -U pef -d pef >/dev/null

echo "== Dependências, migrações versionadas e carga oficial (idempotente)"
[ -d node_modules ] || npm ci
npm run -s prisma:generate -w @pef/api
npm run -s prisma:migrate:deploy -w @pef/api
npm run -s db:carga-oficial -w @pef/api

echo "== Build e API local"
npm run -s build
API_PID=""
if curl -fs "$API_URL/saude" >/dev/null 2>&1; then
  echo "API já respondendo em $API_URL; usando a existente."
else
  # `exec` faz o PID do subshell ser o da API, para o trap encerrá-la.
  ( cd apps/api && exec node dist/main.js > ../../.esteira-api.local.log 2>&1 ) &
  API_PID=$!
  trap '[ -n "$API_PID" ] && kill "$API_PID" 2>/dev/null || true' EXIT
  for _ in $(seq 1 60); do curl -fs "$API_URL/saude" >/dev/null 2>&1 && break; sleep 1; done
  curl -fs "$API_URL/saude" >/dev/null || { echo "API não subiu; veja .esteira-api.local.log"; exit 1; }
fi

STATUS=0
for perfil in "${PERFIS[@]}"; do
  echo "== Portão $perfil ($DEMANDA, base $BASE)"
  node scripts/esteira/qg.mjs --perfil "$perfil" --demanda "$DEMANDA" --base "$BASE" || STATUS=$?
done

echo "== Fingerprint"
node scripts/esteira/qg.mjs --verificar-fingerprint --demanda "$DEMANDA" || true
echo "Evidências em docs/esteira/evidencias/$DEMANDA/ (locais, ignoradas pelo Git)."
exit "$STATUS"
