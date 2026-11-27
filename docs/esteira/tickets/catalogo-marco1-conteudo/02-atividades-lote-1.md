# 02: Atividades Reais — lote 1 (20 novas)

**O que entregar:** Vinte atividades novas pela ficha padrão, priorizando os buracos da matriz: pelo menos 6 de Números e as faixas com menos oferta. Conteúdo próprio, revisado por humano, com segurança mais rígida para Pequenos (5–6).

**Bloqueado por:** 01

**Status:** PENDING_HUMAN — parte automática concluída; falta E5-HOM (amostra de 5)

**Costura:** régua de atividades, carga oficial e smoke:e4

**Risco:** medio

## Critérios

- [x] Régua de atividades aprova as 40 ativas; matriz sem buraco nas áreas
- [x] DEV-CAT-P08 — pelo menos 6 atividades de Números (7)
- [ ] E5-HOM — amostra de 5 atividades homologada pelo responsável

## Conclusão técnica (2026-11-27)

- **Entregue:** 20 atividades novas no fim de `catalogo-biblioteca-e4.mjs` (7 de Números, 3 de Memória e atenção, 2 de cada outra área), conteúdo autoral fictício e segurança mais rígida para Pequenos. Catálogo com 44 modelos: 40 ativos e 4 arquivados.
- **Régua:** `buracosDeArea` (faixa × área e área) no relatório; `regua:atividades` sai 1 se houver buraco de área. Menor célula faixa × área: 3. Fica relatado sem reprovar: `pessoas: individual` (todas com mínimo de 2).
- **Teto do catálogo:** `LIMITE_CATALOGO_ATIVO` 24 → 60, porque 40 ativas são incompatíveis com 24 e o Marco 1 aprovado tem 60 (DEV-CAT-P09). Contadores fixos atualizados em `carga-oficial`, `check-e4`, `smoke-e4` e `qg-cat-01`.
- **Portões (base `a9e9e9f`):** QG-1 PASS (lint, typecheck, authz, check-e4 14/14, check-e5, regua-atividades 18/18); QG-2 PASS (build, authz, carga-trilhas, smoke-historico-resumo, smoke-e4, smoke-e5); verificador PASS, incluindo o delta pós-revisão.
- **Fingerprint:** `sha256:d6669f8dbd8666675f6566b790d30f4e877fb6368e381a9eff9cd11e3f0ed077`.
- **Revisão:** achados objetivos de Padrões corrigidos (buracos de área calculados pela matriz, `FAIXAS` no teste, JSDoc e comentários); duplicações de contadores levadas ao ticket 13. Perguntas de Especificação levadas ao responsável.
- **Pendente (humano):** E5-HOM com a amostra Feira de mentirinha, Quantos cabem no pote?, Salada de frutas medida, Detetive da janela e Bichos de massinha caseira.

**mensagemCommit:**

```
feat(desenvolvimento): lote 1 com 20 Atividades Reais novas

Vinte fichas novas pela ficha padrão, sete de Números, chegando a
40 ativas sem buraco de faixa × área; a régua passa a reprovar buraco
de área. Teto do catálogo sobe de 24 para 60 (Marco 1, DEV-CAT-P09)
e contadores da carga, check-e4, smoke-e4 e qg-cat-01 atualizados.
```
