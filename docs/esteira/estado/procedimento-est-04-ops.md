# Procedimento operacional EST-04 (local/controlado)

**Demanda:** `ESTABILIZACAO-PRE-USO-20261122` · **Incremento:** EST-04  
**Escopo:** banco/schema, backup + restore descartável, Docker Postgres, `GET /saude`. Sem deploy.

## Estratégia de schema / migrations

| Item | Estado vigente |
|---|---|
| Pasta `apps/api/prisma/migrations` | **Ausente** |
| Comando local de estrutura | `npm run db:push` (`prisma db push`) |
| Fase pré-uso | Documento Mestre §13 — cadastros de desenvolvimento podem ser recriados; `db push` é aceitável localmente |
| Produção / uso real | **Bloqueio:** sem histórico migrate versionado no ambiente alvo; restore local não prova a VPS futura |

Não executar `db reset` / `TRUNCATE` no banco compartilhado durante esta validação. `npm run db:reset` permanece só para desenvolvimento consciente com dados fictícios.

## Pré-requisitos

1. `.env` local apontando para `localhost:5433` / banco `pef` (credenciais de desenvolvimento).
2. `npm run docker:up` — container `pef-postgres` healthy.
3. API em `http://localhost:3001` (para checagens de `/saude`).

## Comandos

```bash
# Conferência rápida
npm run docker:up
npm run db:ping
npm run db:generate
# Conferência somente leitura (Prisma 6; exit 0 = schema alinhado ao banco):
# cd apps/api && npx prisma migrate diff --from-schema-datasource prisma/schema.prisma --to-schema-datamodel prisma/schema.prisma --exit-code

# Smoke operacional (backup + restore descartável + /saude up/down)
npm run smoke:est-04-ops -w @pef/api
```

O smoke:

1. Confirma health do container e ausência de `prisma/migrations`.
2. Roda `prisma db push --dry-run` (sem aplicar mudanças).
3. Valida `GET /saude` com banco disponível (`200`, `banco: ok`).
4. Faz `pg_dump` no container e copia para `backups/pef-est04-local.dump` (gitignored).
5. Cria banco descartável `pef_restore_est04`, restaura o dump e compara contagem de tabelas públicas.
6. Remove o banco descartável.
7. Para o container temporariamente, exige `503` / `banco: indisponivel` em `/saude`, reinicia e exige `/saude` ok de novo.

## Limites (bloqueios operacionais)

- Cópia local descartável **não** comprova recuperação na VPS/alvo.
- Sem HTTPS + `COOKIE_SECURE` + `WEB_ORIGIN` no alvo (gap EST-02).
- Sem proteção básica a tentativas repetidas de login no alvo (gap EST-02).
- Homologações humanas E3-HOM, EST-03, E4 residual e COR-UX-HOM permanecem `PENDING_HUMAN`.
- `docker-compose.yml` cobre apenas PostgreSQL; não há workflows CI versionados nesta branch.
- Publicação para uso real **não autorizada**.

## Evidência

- Script: `apps/api/scripts/smoke-est-04-ops.mjs`
- Saída tipicamente em `docs/esteira/estado/qg2-smoke-est-04-ops.txt`
- Resumo: `docs/esteira/estado/evidencia-est-04-20261122.json`
