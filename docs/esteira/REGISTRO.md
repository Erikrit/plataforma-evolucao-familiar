# Registro da esteira

Separado da especificação funcional do produto. Atualizar com entradas curtas.

## 2026-11-14 — Bootstrap v1.0

- **Decisão:** ADR-012 — esteira no mesmo repositório, isolada logicamente.
- **Agente principal:** chat Cursor (orquestrador/desenvolvedor).
- **Subagente:** `verifier` (readonly).
- **Skills:** `module-planning`, `implementation-workflow`, `quality-gate`.
- **Hooks:** `beforeShellExecution`, `beforeMCPExecution`, `preToolUse` com `failClosed`.
- **Estados:** `docs/esteira/estado/atual.json`.
- **App:** inexistente — QG de aplicação não aprovados.
- **Candidatas (avaliar depois):** Vercel React Best Practices; Web Design Guidelines.
- **Validação estrutural:** `node scripts/esteira/validar-bootstrap.mjs` → OK (28 checagens).
- **Hooks (simulação):** `node scripts/esteira/testar-hooks.mjs` → 10/10 (commit/push/reset/publish/PR/MCP bloqueados; leitura permitida).
- **Retomada (simulação):** `node scripts/esteira/simular-retomada.mjs` → OK.
- **Estado da esteira:** `READY` em `docs/esteira/estado/atual.json`.
- **Não executado:** `git commit`, `git push`, deploy, testes de aplicação (app inexistente).
- **Não comprovado nesta sessão:** UI Customize do Cursor listando rules/skills/agents (requer reload visual pelo operador).

## 2026-11-14 — FF-02 COMPLETED (pessoa + sessão provisória)

- **Incremento:** FF-02
- **Entrega:** Prisma `familia`/`pessoa`/`usuario`/`sessao_provisoria`; `POST /sessoes`, `GET /me`, `GET|POST /familias/:id/pessoas`; UI cadastro só com nome; seed admin fictício
- **Aceite:** ACE-01, ACE-02, ACE-09 via `npm run smoke:ff02`
- **QG-1/QG-2:** PASS · Verifier PASS ([verifier](a295fba1-32a1-47b1-a94f-6087213c6231))
- **Auth:** provisória (pendente em DECISOES.md)
- **Evidência:** `docs/esteira/estado/evidencia-ff-02.json`
- **Próximo:** FF-03
- **Commit/push:** não executados

## 2026-11-14 — FF-01 COMPLETED (bootstrap)

- **Incremento:** FF-01 bootstrap monólito modular
- **Entrega:** `apps/api` (NestJS+Prisma), `apps/web` (Next.js), `docker-compose.yml` (Postgres `:5433`), health `GET /saude`
- **QG-1/QG-2:** PASS (typecheck, lint, db:ping, builds, `/saude`)
- **Verifier:** PASS ([verifier](55c34b52-0254-4227-a5c5-f62c3de159a4))
- **Evidência:** `docs/esteira/estado/evidencia-ff-01.json`
- **Próximo:** FF-02
- **Commit/push:** não executados

## 2026-11-14 — Planejamento módulo 01 Fundação Familiar

- **Skill:** `module-planning`
- **Fonte:** `docs/modulos/01-fundacao-familiar/ESPECIFICACAO.md` v1.0
- **Estado:** `READY` · próximo incremento `FF-01`
- **Incrementos:** FF-01…FF-06 (ver `docs/esteira/planejamento/01-fundacao-familiar.md`)
- **Riscos altos:** autorização contextual / isolamento; revogação de sessão
- **Auth:** mecanismo ainda pendente em DECISOES.md — sessão provisória a partir de FF-02
- **Código de produto:** não criado neste passo
- **Commit/push:** não executados

## Quality Gates — contratos

| Gate | Escopo | Nesta fase |
|---|---|---|
| QG-1 | typecheck, lint, testes do diff | Preparado; app ausente → N/A no bootstrap |
| QG-2 | build, testes, verifier | Preparado; PENDING até haver incremento |
| QG-3 | módulo completo | PENDING |

## Limitações conhecidas

- Hooks usam heurística textual; ofuscação pode contornar — não é garantia absoluta.
- Reconhecimento de rules/skills/subagents pelo Cursor IDE depende do reload do workspace; validação estrutural via `scripts/esteira/validar-bootstrap.mjs`.
- Node.js e Docker disponíveis no ambiente de bootstrap; suítes de teste da app ainda não existem.
