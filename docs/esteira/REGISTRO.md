# Registro da esteira

Separado da especificação funcional do produto. Atualizar com entradas curtas.

## Estado atual (2026-11-15)

- **Correção auth/autorização:** COMPLETED (SA-01..SA-04, QG-3 PASS, verifier PASS)
- **Módulo 02 Cuidados da Vovó:** COMPLETED (CV-01..CV-06, QG-3 PASS)
- **Módulo 01 Fundação Familiar:** COMPLETED (FF-01..FF-06, QG-3 PASS)
- **Estado persistido:** `docs/esteira/estado/atual.json`
- **Evidência authz:** `docs/esteira/estado/evidencia-correcao-authz.json`
- **App local:** `apps/api` + `apps/web` + Compose (Postgres `:5433`)
- **Auth:** sessão MVP (hash SHA-256 + cookie httpOnly); IdP definitivo ainda em DECISOES.md
- **ACE-C12:** PENDING (lembretes/PWA em dispositivos reais)
- **Próximo produto:** módulo 03 — Desenvolvimento Laurinha (`module-planning`)
- **Commit/push/deploy:** sob decisão humana; não feitos pela esteira

## 2026-11-15 — Correção auth/autorização COMPLETED (SA-01..SA-04)

- **Causas corrigidas:** admin com clínica automática; `podeVerCuidados`≡visão de pessoa; anexos amplos; token em claro
- **QG-1/QG-2/QG-3:** PASS · Verifier PASS ([verifier](e313a9af-9b15-4051-8b94-18f1737e38d1))
- **Evidências:** `smoke-authz-critico-saida.json`, `smoke-modulo-01-pos-authz.json`, `smoke-modulo-02-pos-authz.json`
- **Fingerprint:** `2d79762e2e65ffba`
- **Commit/push:** não executados

## 2026-11-15 — Planejamento correção auth/autorização

- **Skill:** `module-planning` + execução via `implementation-workflow`
- **Causas:** admin com acesso clínico automático; cuidados≡visão de pessoa; anexos amplos; token em texto puro
- **Incrementos:** SA-01 (permissões) → SA-02 (anexos/áreas) → SA-03 (sessão) → SA-04 (testes/QG)
- **Commit/push:** não executados

## 2026-11-15 — Módulo 02 COMPLETED (CV-01..CV-06 + QG-3)

- **Módulo:** `02-cuidados-vovo` — COMPLETED
- **Entrega:** medicamentos/programação/doses, rotina do dia, consultas/exames/apoio, anexos privados, histórico derivado, resumo/PDF, lembretes derivados, UI mobile
- **Aceites ACE-C01..C11:** PASS (`npm run smoke:modulo-02`); **ACE-C12:** PENDING documentado
- **QG-1/QG-2/QG-3:** PASS · Verifier PASS ([verifier](79d9223b-e8e7-4c44-91f6-e68e5987e49c))
- **Evidência:** `docs/esteira/estado/evidencia-modulo-02.json`
- **Fingerprint:** `803f9fc3c906f5f2`
- **Commit/push:** não executados
- **Próximo produto:** módulo 03 — Desenvolvimento Laurinha (após `module-planning`)

## 2026-11-15 — Planejamento módulo 02 Cuidados da Vovó

- **Skill:** `module-planning`
- **Fonte:** `docs/modulos/02-cuidados-vovo/ESPECIFICACAO.md` v1.0
- **Incrementos:** CV-01..CV-06
- **Riscos altos:** dados de saúde/anexos; colaboradora vs prescrição/Laurinha
- **ACE-C12:** PENDING até dispositivos reais
- **Código de cuidados:** ainda não criado neste passo
- **Commit/push:** não executados

## 2026-11-15 — Módulo 01 COMPLETED (FF-04..FF-06 + QG-3)

- **Módulo:** `01-fundacao-familiar` — COMPLETED
- **FF-04:** convites + ativação + ACE-03/04 (colaboradora→Vovó; 403 Laurinha)
- **FF-05:** revogação com invalidação de sessão + ACE-06/10 (isolamento famílias)
- **FF-06:** perfil `/pessoas/[id]` + CSS mobile + regressão QG-3
- **Aceites ACE-01..10:** PASS (`npm run smoke:modulo-01`)
- **Verifier QG-3:** PASS ([verifier](7aaefaf1-f0fa-43ef-81ce-e3923a1fbd38))
- **Evidência:** `docs/esteira/estado/evidencia-modulo-01.json`
- **Auth:** ainda provisória (DECISOES.md)
- **Commit/push:** não executados
- **Próximo produto:** módulo 02 — Cuidados da Vovó (após `module-planning`)

## 2026-11-15 — FF-03 COMPLETED (autorizações + cartões)

- **Incremento:** FF-03
- **Entrega:** modelo `autorizacao`; `GET/POST .../autorizacoes`; `GET .../inicio` com cartões filtrados; UI home
- **Aceite:** ACE-05, ACE-07 via `npm run smoke:ff03`
- **QG-1/QG-2:** PASS · Verifier PASS ([verifier](70579d37-5ad4-49df-a8a2-bd9bb91d72f8))
- **Evidência:** `docs/esteira/estado/evidencia-ff-03.json`
- **Commit/push:** não executados

## 2026-11-14 — FF-02 COMPLETED (pessoa + sessão provisória)

- **Incremento:** FF-02
- **Entrega:** Prisma `familia`/`pessoa`/`usuario`/`sessao_provisoria`; `POST /sessoes`, `GET /me`, `GET|POST /familias/:id/pessoas`; UI cadastro só com nome; seed admin fictício
- **Aceite:** ACE-01, ACE-02, ACE-09 via `npm run smoke:ff02`
- **QG-1/QG-2:** PASS · Verifier PASS ([verifier](a295fba1-32a1-47b1-a94f-6087213c6231))
- **Evidência:** `docs/esteira/estado/evidencia-ff-02.json`
- **Commit/push:** não executados

## 2026-11-14 — FF-01 COMPLETED (bootstrap)

- **Incremento:** FF-01 bootstrap monólito modular
- **Entrega:** `apps/api` (NestJS+Prisma), `apps/web` (Next.js), `docker-compose.yml` (Postgres `:5433`), health `GET /saude`
- **QG-1/QG-2:** PASS · Verifier PASS ([verifier](55c34b52-0254-4227-a5c5-f62c3de159a4))
- **Evidência:** `docs/esteira/estado/evidencia-ff-01.json`
- **Commit/push:** não executados

## 2026-11-14 — Planejamento módulo 01 Fundação Familiar

- **Skill:** `module-planning`
- **Fonte:** `docs/modulos/01-fundacao-familiar/ESPECIFICACAO.md` v1.0
- **Na época:** `READY` · próximo incremento `FF-01`
- **Código de produto:** ainda não criado nesse passo
- **Commit/push:** não executados

## 2026-11-14 — Bootstrap da esteira v1.0

- **Decisão:** ADR-012 — esteira no mesmo repositório, isolada logicamente.
- **Agente principal:** chat Cursor (orquestrador/desenvolvedor).
- **Subagente:** `verifier` (readonly).
- **Skills:** `module-planning`, `implementation-workflow`, `quality-gate`.
- **Hooks:** `beforeShellExecution`, `beforeMCPExecution`, `preToolUse` com `failClosed`.
- **Na época:** app de produto inexistente; esteira `READY` após validação estrutural.
- **Validação:** `validar-bootstrap.mjs`, `testar-hooks.mjs` (10/10), `simular-retomada.mjs`.
- **Candidatas (avaliar depois):** Vercel React Best Practices; Web Design Guidelines.

## Quality Gates — contratos

| Gate | Escopo | Estado atual |
|---|---|---|
| QG-1 | typecheck, lint, testes do diff | PASS nos módulos 01 e 02 |
| QG-2 | build, smokes, verifier | PASS FF-01..06 e CV-01..06 |
| QG-3 | módulo completo | PASS módulo 01 e 02 (`smoke:modulo-02` + verifier) |

## Limitações conhecidas

- Hooks usam heurística textual; ofuscação pode contornar — não é garantia absoluta.
- Auth definitiva e validação com usuários reais ainda pendentes.
- ACE-08 coberto por checagem estrutural mobile-first; teste em dispositivo real pendente.
- Sem deploy; alterações permanecem no workspace local até commit/push humanos.
