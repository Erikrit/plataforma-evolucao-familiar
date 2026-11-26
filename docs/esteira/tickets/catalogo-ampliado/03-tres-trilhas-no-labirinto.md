# 03: Três trilhas, provadas em Caminhos e labirintos

**O que entregar:** Fases numeradas de 1 a 15 com campo editorial `trilha` em `FaseJogoDigital` (migração versionada). Carga oficial sem total fixo de 40: as contagens vêm do catálogo. A API devolve a trilha de cada fase; Escolher fase agrupa por trilha. Caminhos e labirintos é o primeiro jogo com 15 fases aprovadas pela régua. Histórico e Resumo mostram “N de 15 fases” para esse jogo. Progresso das fases 1–5 preservado.

**Bloqueado por:** 02

**Status:** COMPLETED

**Arquivos:** `apps/api/prisma/schema.prisma`, migração nova, `apps/api/prisma/carga-oficial.mjs`, `apps/api/prisma/catalogo-jogos-piloto-e5.mjs`, `apps/api/src/desenvolvimento/jogos/servico-jogos.ts`, `apps/web/src/lib/api.ts`, página de jogos da Biblioteca, `check-e5`, `check-cat-04`, `qg-cat-01`, `smoke-e5`, `regua-jogos.test.mjs`

**Costura:** carga oficial e smoke:e5

**Risco:** alto

## Critérios

- [x] DEV-CAT-P03 — Caminhos e labirintos tem 15 fases em três trilhas, com progressão aprovada pelo verificador
- [x] E5-ACE-01 (substituído) — qualquer fase de 1 a 15 abre desde a primeira visita
- [x] E5-ACE-05 e E5-ACE-12 — conclusões anteriores preservadas após a migração; carga executada duas vezes sem duplicar
- [x] E5-F07 — Histórico e Resumo leem fases concluídas de 15

## Conclusão

- **Fingerprint:** `sha256:372b7d61bd529118852c0d9d6892b98bc68ae4ab4c71f95b30d3b419f508540f` (base `ea5c65d`; a árvore inclui o ticket 02 sem commit)
- **Evidências:** QG-1 PASS (lint, typecheck, authz, check-e4, check-e5, regua-jogos), `qg1-2026-11-26T12-16-09-632Z.json`; QG-2 PASS (build, authz, carga-trilhas, smoke-historico-resumo, smoke-e4, smoke-e5), `qg2-2026-11-26T12-18-52-918Z.json`; verificador PASS; revisão sem violações.
- **Migração:** `20261126120000_trilha_fase_jogo` aplicada no banco local do Docker; a VPS não foi tocada. Na publicação, o responsável roda `prisma migrate deploy` e a carga oficial.
- **Conteúdo:** labirinto v2, 15 fases (passos 6 → 72), duas variantes próprias por fase, mapas de até 15×17; variante 1 das fases 1–5 mantida.
- **Para o responsável:** o Histórico mostra "Fase N concluída", sem "de 15" (só o Resumo mostra "N de 15"; E5-F07 cita o exemplo no Resumo). Mostrar também no Histórico? O rótulo de dificuldade é relativo à trilha (fase 11 "simples").
- **PENDING_HUMAN:** H10 do roteiro de homologação (mapas 11–15 em 320 px; Escolher fase por trilha).

**mensagemCommit:**

```
feat(jogos): três trilhas de fases, provadas em Caminhos e labirintos

Fase ganha trilha editorial (pequenos, médios, grandes) com migração aditiva e
carga sem total fixo; labirinto passa a 15 fases aprovadas pela régua e Escolher
fase agrupa por trilha, com progresso anterior preservado (DEV-CAT-M1, ticket 03).
```

## Correção após H10 (2026-11-26)

- **Retorno:** o jogo funcionou até a fase 15, mas a dificuldade quase não mudava; o mapa só ficava maior. Medição: as decisões no caminho ficavam entre 0 e 4 da fase 1 à 15.
- **Causa:** a régua media o labirinto só por passos; o gerador fazia corredores longos com poucas bifurcações.
- **Decisão do responsável:** a métrica principal do labirinto passa a ser "decisões no caminho", que crescem a cada fase; os passos não podem cair. A mesma regra vale para Entrega no jardim (ticket 09).
- **Feito:**
  - Régua: decisões no caminho como métrica principal; variedade comparada pelas paredes, para que só mover a chegada ou espelhar não conte como variante nova.
  - Labirinto v3: decisões de 1 a 15, passos de 6 a 46, mapas de até 15×23.
  - `check:e5` e `smoke:e5` passam a rodar quando o catálogo muda.
- **Evidências:**
  - `test:regua` 16/16.
  - QG-1 PASS: `qg1-2026-11-26T13-02-13-611Z.json`.
  - QG-2 PASS, com smoke-e5 e carga-trilhas: `qg2-2026-11-26T13-04-53-820Z.json`.
  - Fingerprint `sha256:899fa75dba395fe40996f5116ce8e83d0fafe70ab344632ff6e2f50637af296c` (base `b35587b`).
  - Verificador PASS, depois de um FAIL corrigido (as fases 14 e 15 tinham as mesmas paredes).
- **Risco:** ramo de duas células ainda conta como decisão. Contando só os ramos com 3 células ou mais, a série cresce no geral, mas não a cada fase.
- **H10 (v3):** PASS — homologado pelo responsável em 2026-11-26; a dificuldade evolui conforme o esperado.
- **Histórico com "de 15":** não é necessário (responsável, 2026-11-26).
- **Publicação na VPS:** quando o Marco 1 for atingido (migração e carga oficial nessa ocasião).

**mensagemCommit:**

```
fix(jogos): dificuldade do labirinto medida por decisões no caminho

A homologação mostrou que o mapa crescia sem ficar mais difícil: a régua media
só passos. Agora as decisões no caminho crescem de 1 a 15 e os passos não caem;
variantes são comparadas pelas paredes e o labirinto vai à v3 (DEV-CAT-M1, ticket 03).
```
