# 06: Área Números

**O que entregar:** `numeros` entra nas categorias de jogos e atividades, nos filtros da web e nas leituras do Módulo 04. Atividades personalizadas sem categoria continuam funcionando.

**Bloqueado por:** nenhum

**Status:** COMPLETED

**Arquivos:** `apps/api/src/desenvolvimento/constantes-desenvolvimento.ts`, `apps/api/src/desenvolvimento/servico-sugestoes.ts`, `apps/web/src/lib/rotulos-experiencia.ts`, Resumo e Histórico da pessoa (web), `apps/api/scripts/check-e4.mjs`, `apps/api/scripts/smoke-e4.mjs`

**Costura:** check:e4, smoke:e4 e smoke de Histórico

**Risco:** medio

## Critérios

- [x] DEV-CAT-P08 — filtro Números aparece em Jogos e em Atividades Reais
- [x] E5-ACE-11 — Histórico e Resumo mostram a categoria registrada na conclusão

## Conclusão

- **Fingerprint:** `sha256:fd0c8342b3ab0b0ce7c16fec5e34f3b94d4b07eefb7da8063ff7894be781459f` (base `a056711`)
- **Evidências:**
  - QG-1 PASS (lint, typecheck, authz, check-e4, check-e5): `qg1-2026-11-26T13-39-39-034Z.json`
  - QG-2 PASS (build, authz, smoke-historico-resumo, smoke-e4 com três checagens novas de Números, smoke-e5): `qg2-2026-11-26T13-42-34-525Z.json`
  - verificador PASS
  - revisão: nenhuma violação; dois julgamentos de estilo (linhas longas no check e no smoke; possível helper único de rótulo de categoria)
- **Também corrigido:** o Resumo mostrava o código cru da área (ex.: "memoria atencao") e agora mostra o rótulo. A contagem por área nas sugestões usava uma lista fixa de seis áreas e passou a usar `CATEGORIAS_BIBLIOTECA`.
- **Para o responsável:** o texto exportado do Resumo ainda mostra o código da área (`[numeros]`), como antes para todas as áreas. Ajustar?
- **PENDING_HUMAN:** H11 do roteiro. O filtro Números aparece vazio até a demanda de conteúdo.

**mensagemCommit:**

```
feat(desenvolvimento): área Números em jogos, atividades e leituras

Números entra nas categorias, nos filtros de Jogos e Atividades Reais e no
Histórico e Resumo, que passam a mostrar o rótulo da área registrada na
conclusão; personalizadas sem categoria seguem iguais (DEV-CAT-M1, ticket 06).
```
