# 01: O verificador de jogos lê o catálogo carregado

**O que entregar:** `check:e5` passa a validar `prisma/catalogo-jogos-piloto-e5.mjs` (o que a carga oficial usa) e confere que a cópia antiga em `src/desenvolvimento/jogos/catalogo-jogos.ts` é idêntica ou deixa de ser usada. Comportamento da aplicação não muda.

**Bloqueado por:** nenhum

**Status:** COMPLETED

**Costura:** verificador de catálogo

**Risco:** baixo

## Critérios

- [x] E5-ACE-03 — editar o catálogo carregado e quebrar uma fase faz `check:e5` falhar
- [x] E5-ACE-12 — jogo, fase e versão continuam rastreáveis; `check:cat-03` e `check:cat-04` continuam PASS
