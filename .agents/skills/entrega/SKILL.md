---
name: entrega
description: Entrega — texto da mensagemCommit e do corpo de PR para o humano usar. Use ao concluir demanda ou ticket, ou quando o humano pedir texto de commit ou PR.
---

# Entrega

Produz **texto**. O humano faz commit e publicação.

## `mensagemCommit`

```
<tipo>(<escopo>): <porquê em uma linha, até ~72 caracteres>

<1 a 2 frases com valor entregue e escopo, se preciso>
```

Seguir o estilo de `git log`. Foco no porquê; a lista de arquivos já está no diff. Em correção, citar a causa confirmada. Trabalho incompleto: `N/A` com motivo.

## Corpo de PR

```markdown
## Resumo
<a menor visão que mostra a mudança: pseudocódigo, árvore, diagrama ou diff curto>

## Evidência
- **Antes:** <saída, captura ou teste vermelho>
  **Depois:** <saída, captura ou teste verde>
- Portões: <perfil → status → fingerprint>
- Pendências humanas: <itens PENDING_HUMAN>

## Risco de merge
**Porta:** mão única | mão dupla — <como reverter>
**Alcance:** <uma palavra> — <o que pode ser afetado>
```

Usar termos do glossário e dados fictícios. Migração destrutiva e mudança difícil de reverter são mão única.

Concluída quando cada afirmação do texto tem evidência real ou está marcada como pendente.
