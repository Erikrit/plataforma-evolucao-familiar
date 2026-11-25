---
name: interrogatorio
description: Interrogatório em rodadas sobre a árvore de decisões de um plano. Use quando o humano pedir para ser questionado ou testar uma ideia, ou quando outra skill precisar resolver decisões em aberto.
---

# Interrogatório

Entreviste o humano até o entendimento compartilhado. Trate o assunto como uma **árvore de decisões**: cada decisão abre as que dependem dela.

## Rodadas

A **fronteira** é o conjunto de decisões cujos pré-requisitos já estão resolvidos. Em cada rodada:

1. Pergunte a fronteira inteira, numerada, cada item com sua resposta recomendada, redigido para que "sim" aceite a recomendação.
2. Espere as respostas.
3. Recalcule a fronteira. Uma pergunta que depende de outra ainda aberta vai para a rodada seguinte.

```
❓ **Q1 - <título>:** <pergunta>

➡️ <resposta recomendada e o porquê>

---
```

## Fatos e decisões

- **Fatos são seus.** Busque no repositório, em documentos ou ferramentas; use um subagente de leitura quando a busca for ampla. Enquanto ele trabalha, siga com as perguntas que não dependem do resultado.
- **Decisões são do humano.** Apresente cada uma e espere. Silêncio mantém a decisão aberta.
- Decisão já aprovada na fonte oficial é fato: cite-a.
- Decisão acima da autoridade de quem responde vira `NEEDS_DECISION`, conforme `docs/agents/projeto.md`.

Concluído quando a fronteira está vazia, cada ramo foi visitado, nenhuma suposição ficou implícita e o humano confirmou o entendimento. Agir sobre o plano só depois disso.
