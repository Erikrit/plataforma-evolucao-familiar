# 03: Atividades Reais — lote 2 (20 novas)

**O que entregar:** Mais vinte atividades novas, fechando 60 ativas com cerca de 20 por faixa e as sete áreas cobertas. O teto editorial de 24 modelos (E4-ACE-01) deixa de valer, conforme P09.

**Bloqueado por:** 02

**Status:** COMPLETED — homologado pelo responsável em 2026-11-27

**Costura:** régua de atividades, carga oficial e smoke:e4

**Risco:** medio

**Conta por faixa (decisão de 2026-11-27):** cada atividade conta em todas as faixas que cobre, como na oferta de sugestões. Por isso “cerca de 20 por faixa” (M03 §15, Marco 1) passa a significar oferta mínima de 20 por faixa, com equilíbrio entre faixas, e não 18 a 22: esse critério ficava impossível com atividades de 5 a 12 anos. Depois do lote 1 a conta está em Pequenos 34, Médios 40 e Grandes 33. O lote 2 deve priorizar atividades só para Pequenos ou só para Grandes, e Pequenos × Raciocínio e Pequenos × Linguagem, que têm 3 cada. O teto de 60 ativas foi aprovado pelo responsável em 2026-11-27.

## Critérios

- [x] Régua de atividades aprova as 60 ativas; cada faixa com pelo menos 20 ativas e pelo menos 3 em cada área, e diferença de no máximo 10 entre a faixa com mais e a com menos oferta
- [x] Carga oficial idempotente com 60 ativas e as arquivadas preservadas
- [x] E5-HOM — amostra de 5 atividades homologada pelo responsável (2026-11-27)

## Conclusão técnica (2026-11-27)

- **Entregue:** 20 atividades novas no fim de `catalogo-biblioteca-e4.mjs`: 9 só para Pequenos, 9 só para Grandes e 2 de 5 a 12 anos. Catálogo com 64 modelos: 60 ativos e 4 arquivados. Conta por faixa: Pequenos 45, Médios 42 e Grandes 44. A menor célula faixa × área tem 5.
- **Régua:** `COBERTURA_FAIXA` (mínimo de 20 por faixa, 3 por faixa × área e diferença de até 10) gera `pendenciasDeFaixa`; o campo `catalogoAprovado` é usado pela CLI e pelo `check-e4`.
- **Carga:** `qg-cat-trilhas` (QG-2, banco descartável) confere 60 ativas e 4 arquivadas após carga ×2. Contadores: `carga-oficial` 64, `check-e4` 64/60 e `qg-cat-01` 60 ativas; o 44 do ticket 02 ali estava errado.
- **Portões (base `917ab27`):**
  - QG-1 PASS: lint, typecheck, authz, check-e4 14/14 e régua 21/21.
  - QG-2 PASS: build, authz, carga-trilhas e smoke-e4.
  - Verificador PASS, incluindo o delta pós-revisão.
- **Fingerprint:** `sha256:5a5abd971cf142b499d9afc537b2e5c249e3cac83de699f05251a5c92ade7b57`.
- **Revisão:**
  - Corda em dupla: o passo que exigia 4 pessoas virou variação.
  - Amarelinha sem a variação "de olhos fechados".
  - Percurso de células unificado e aprovação do catálogo num campo só.
  - Duplicações levadas ao ticket 13.
- **Homologação (2026-11-27):** E5-HOM aprovado pelo responsável, com a amostra Sombra de quem?, Lavar as mãos cantando, Pular corda em dupla, Planta da casa e Amarelinha.

**mensagemCommit:**

```
feat(desenvolvimento): lote 2 fecha 60 Atividades Reais

Vinte fichas novas (9 só para Pequenos, 9 só para Grandes e 2 para
todas as faixas), chegando a 60 ativas com 45/42/44 por faixa. A régua
passa a exigir mínimo de 20 por faixa, 3 por faixa × área e diferença
até 10; qg-cat-trilhas confere 60 ativas e 4 arquivadas após carga ×2.
```
