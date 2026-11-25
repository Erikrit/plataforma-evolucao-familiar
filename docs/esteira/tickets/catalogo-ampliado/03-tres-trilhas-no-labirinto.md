# 03: Três trilhas, provadas em Caminhos e labirintos

**O que entregar:** Fases numeradas de 1 a 15 com campo editorial `trilha` em `FaseJogoDigital` (migração versionada). Carga oficial sem total fixo de 40: as contagens vêm do catálogo. A API devolve a trilha de cada fase; Escolher fase agrupa por trilha. Caminhos e labirintos é o primeiro jogo com 15 fases aprovadas pela régua. Histórico e Resumo mostram “N de 15 fases” para esse jogo. Progresso das fases 1–5 preservado.

**Bloqueado por:** 02

**Status:** PENDING

**Costura:** carga oficial e smoke:e5

**Risco:** alto

## Critérios

- [ ] DEV-CAT-P03 — Caminhos e labirintos tem 15 fases em três trilhas, com progressão aprovada pelo verificador
- [ ] E5-ACE-01 (substituído) — qualquer fase de 1 a 15 abre desde a primeira visita
- [ ] E5-ACE-05 e E5-ACE-12 — conclusões anteriores preservadas após a migração; carga executada duas vezes sem duplicar
- [ ] E5-F07 — Histórico e Resumo leem fases concluídas de 15
