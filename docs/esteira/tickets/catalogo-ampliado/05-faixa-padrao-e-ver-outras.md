# 05: Biblioteca abre na faixa da pessoa

**O que entregar:** A faixa é calculada no servidor pela data de nascimento. Catálogo de jogos e trilhas abrem na faixa da pessoa; Ver outras faixas abre as demais. Mudança de faixa preserva descobertas. Retorno ao catálogo preserva o filtro.

**Bloqueado por:** 03, 04, D1

**Status:** NEEDS_DECISION

**Costura:** smoke:e5 e smoke:authz

**Risco:** alto

## Critérios

- [ ] DEV-CAT-P04 — pessoa de 8 anos abre em Médios e consegue abrir Pequenos e Grandes
- [ ] DEV-CAT-P06 — ao mudar de faixa, descobertas anteriores continuam no Histórico
- [ ] E5-ACE-09 — mesmos limites por família, pessoa e autorização na API direta
