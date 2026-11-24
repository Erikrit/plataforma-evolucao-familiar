# Procedimento — primeiro pacote de homologação (VPS)

**Demanda:** `DEM-OPS-HOMOLOG-DEPLOY-20261123`  
**Escopo:** imagens GHCR + Compose de homologação + migrate/carga oficial. Sem deploy automático. Dados fictícios.

## Pré-requisitos

1. Workflow `Publicar imagens homolog` presente na **branch padrão** (`master`) para aparecer em Actions.
2. Disparo manual (`workflow_dispatch`) na ref desejada (ex.: `develop`), informando `NEXT_PUBLIC_API_URL` pública da API.
3. VPS com Docker + Compose; hello-world já validado.
4. Diretório `/opt/pef-homolog` com `docker-compose.homolog.yml` e `.env` (a partir de `deploy/homolog/env.example`).
5. Reverse proxy (fora deste pacote) expondo UI e API a partir de `127.0.0.1:3000` e `127.0.0.1:3001`.

## NEXT_PUBLIC_API_URL

Embutida no **build** da web. O navegador chama essa origem. Não use `http://api:3001`.

Exemplos:

- `https://api-homolog.exemplo.com`
- ensaio local: `http://127.0.0.1:3001`

## Variáveis no `.env` da VPS (exemplos)

| Variável | Exemplo |
|---|---|
| `PEF_IMAGE_REGISTRY` | `ghcr.io/erikrit/plataforma-evolucao-familiar` |
| `PEF_IMAGE_SHA` | SHA completo do commit publicado |
| `POSTGRES_USER` | `pef_homolog` |
| `POSTGRES_PASSWORD` | senha forte (não versionar) |
| `POSTGRES_DB` | `pef_homolog` |
| `WEB_ORIGIN` | `https://homolog.exemplo.com` |
| `COOKIE_SECURE` | `true` (HTTPS) |

Anexos: persistidos no PostgreSQL (`conteudoBase64`). Volume `pef_homolog_pg` preserva banco e anexos. Sem volume de uploads em disco.

## Comandos em `/opt/pef-homolog`

```bash
cd /opt/pef-homolog

# 1) Autenticar no GHCR (PAT com read:packages) — uma vez por host/usuário
echo "$GHCR_TOKEN" | docker login ghcr.io -u SEU_USUARIO_GITHUB --password-stdin

# 2) Ajustar SHA no .env
# PEF_IMAGE_SHA=<sha do workflow>

# 3) Pull das duas imagens (mesmo SHA)
set -a && . ./.env && set +a
docker pull "${PEF_IMAGE_REGISTRY}/api:${PEF_IMAGE_SHA}"
docker pull "${PEF_IMAGE_REGISTRY}/web:${PEF_IMAGE_SHA}"

# 4) Validar Compose
docker compose -f docker-compose.homolog.yml --env-file .env config >/dev/null

# 5) Subir (migrate + carga oficial rodam antes da API)
docker compose -f docker-compose.homolog.yml --env-file .env up -d

# 6) Acompanhar migrate/carga
docker compose -f docker-compose.homolog.yml --env-file .env logs migrate

# 7) Checagens
curl -sS http://127.0.0.1:3001/saude
curl -sS -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3000/
```

`/saude` esperado com banco ok: JSON com `"status":"ok"`, `"banco":"ok"`.

## Carga

`prisma migrate deploy` + `carga-oficial.mjs` (24 E4 + 8 jogos / 40 fases). **Não** executa `seed.mjs` (contas/fixtures de desenvolvimento).

## Fora deste pacote

- Deploy automático CI → VPS
- Publicação para uso real
- Rate-limit de login e endurecimento residual EST-02 além de `WEB_ORIGIN`/`COOKIE_SECURE`
