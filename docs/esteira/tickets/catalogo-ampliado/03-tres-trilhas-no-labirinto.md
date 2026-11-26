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
