# 02: Régua de qualidade automática para jogos

**O que entregar:** Verificador comum, com métricas por motor (passos, becos e junções no labirinto; pares na memória; opções na escolha; período e lacuna na sequência; cenas na ordenação). Confere solução, resposta única, progressão crescente, nome × figura, rótulo que entrega a resposta e variantes repetidas. Roda primeiro em modo relatório sobre os 8 jogos atuais e lista as falhas conhecidas (Entrega 4→14→8→14→33, rótulos de Ache o intruso e Palavra e figura, libélula 🪰, toalha 🧺).

**Bloqueado por:** 01

**Status:** COMPLETED

**Arquivos:** `apps/api/scripts/lib-regua-jogos.mjs`, `apps/api/scripts/regua-jogos.mjs`, `apps/api/scripts/regua-jogos.test.mjs`, `apps/api/package.json`, `esteira.config.json`

**Costura:** verificador de catálogo

**Risco:** baixo

## Critérios

- [x] Régua de qualidade (M03 §15) — relatório reproduz as falhas conhecidas
- [x] E5-ACE-03 — fase sem solução ou com duas respostas reprova o catálogo

## Conclusão

- **Fingerprint:** `sha256:90515d994760d4af7e8b10ab3cccb5943639747621d7ba40e79447967a1fa34a` (base `ea5c65d`)
- **Evidências:** `test:regua` 12/12; QG-1 PASS (`qg1-2026-11-26T11-37-48-385Z.json`); QG-2 PASS (`qg2-2026-11-26T11-41-57-422Z.json`); verificador PASS após um FAIL corrigido (rótulo nas sombras).
- **Relatório atual:** 8 jogos, 46 falhas (progressão 7, variedade 10, rótulo 24, nome × figura 5), catálogo REPROVADO. É a meta do ticket 09; `npm run regua:jogos -w @pef/api -- --estrito` passa a valer quando ele terminar.
- **Decisão do responsável (2026-11-26):** empate da métrica principal sem secundária crescer é falha.
- **Para revisão humana no ticket 09:** achados além da lista conhecida: “Poça na rua” 💦, “Abrir a torneira” e “Regar” 🚿, “Sombra: X” em Pares de sombras, mapas espelhados em labirinto e Entrega.
- **Limitações:** ordem ambígua semântica em Histórias e rotação de mapa não são detectadas; lacuna é binária; o ESLint ignora `apps/api/scripts/`.

**mensagemCommit:**

```
feat(jogos): régua de qualidade automática do catálogo de jogos

Verificador sem banco mede cada motor e reprova fase sem solução, com duas
respostas, progressão que não cresce, rótulo que entrega, nome × figura
divergente e variante repetida; roda em modo relatório (DEV-CAT-M1, ticket 02).
```
