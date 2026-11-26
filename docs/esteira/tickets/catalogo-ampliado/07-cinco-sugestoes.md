# 07: Até cinco sugestões de Atividades Reais

**O que entregar:** As Atividades Reais para adultos e idosos saem do catálogo (arquivadas, participações preservadas). `Sugerir brincadeiras` e `Renovar sugestões` passam a oferecer até cinco opções, priorizando a faixa da pessoa (Pequenos 5–6, Médios 7–9, Grandes 10–12, pela data de nascimento). Demais regras da §12 permanecem. Testes que exigem duas sugestões são atualizados.

**Bloqueado por:** 04 (D2 decidida em 2026-11-26: atividades de adultos e idosos arquivadas; ficam só as de 5 a 12 anos)

**Status:** IN_VALIDATION

**Costura:** smoke:e4 e smoke:authz

**Risco:** alto

## Critérios

- [x] DEV-CAT-P09 — pedir sugestões mostra até cinco opções elegíveis da faixa
- [x] E4-ACE-03 — renovação parcial, esgotamento e exclusão de ativas e executadas continuam corretos
- [x] E4-ACE-08 — limite de dez por categoria e concorrência na décima vaga continuam corretos

## Implementação (2026-11-26)

- Até 5 sugestões e 5 renovações; a ordem prioriza as atividades cuja faixa se sobrepõe à faixa da pessoa (5–6, 7–9, 10–12) e completa com as demais elegíveis.
- D2: "Lembrete em três fotos", "Alongar ombros sentados", "Lista mental da feira" e "Semana em ordem" arquivadas (`ativo: false`, participações preservadas); as outras 20 ajustadas para 5–12. A carga respeita `ativo`; ficam 20 modelos ativos (teto de 24 mantido até o Marco 1 ser publicado).
- **Evidências:** QG-1 PASS `qg1-2026-11-26T20-24-25-071Z.json`; QG-2 PASS (authz, smoke-e4 com até 5 sugestões e sem arquivadas, concorrência da décima vaga) `qg2-2026-11-26T20-26-49-936Z.json`; fingerprint `sha256:999e48ae60e4fd94715b9e26133f2b480650d49293a8f0c8ebab3a79513582b8`. Verificador PASS.
- **Observações:** quem já tinha uma das 4 arquivadas escolhida a vê sumir de "ativas" (histórico preservado). Uma atividade inédita fora da faixa ainda vem antes de uma repetida da faixa; com o catálogo atual o efeito é mínimo.
- **PENDING_HUMAN:** H17.

**mensagemCommit:**

```
feat(atividades): até cinco sugestões priorizando a faixa da pessoa

Sugerir e renovar oferecem até cinco Atividades Reais, primeiro as da faixa
(5–6, 7–9, 10–12); as quatro atividades de adultos e idosos ficam arquivadas e
as demais passam a 5–12 anos, com o histórico preservado (DEV-CAT-M1, ticket 07).
```
