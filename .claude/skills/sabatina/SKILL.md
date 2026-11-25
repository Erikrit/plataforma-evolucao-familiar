---
name: sabatina
description: Entrevista para alinhar uma ideia ou plano antes de codar, registrando termos e decisões.
argument-hint: "ideia, demanda ou plano a alinhar"
disable-model-invocation: true
---

# Sabatina

1. Ler o adaptador de domínio em `docs/agents/dominio.md` e o trecho da fonte oficial que a ideia toca.
2. Chamar as skills `interrogatorio` e `modelagem-dominio` e conduzir as rodadas com as duas.
3. Com a **fronteira** vazia, resumir o entendimento: problema, comportamento, limites, decisões, termos novos e o que ficou fora.
4. Pedir a confirmação do humano.

Concluída quando a fronteira está vazia **e** o humano confirmou o resumo. Depois, recomendar `/planejar` ou `/implementar` conforme o tamanho.
