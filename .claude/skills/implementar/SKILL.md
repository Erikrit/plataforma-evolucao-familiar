---
name: implementar
description: Implementa um ticket ou demanda aprovada, com TDD, portões de qualidade, verificação e revisão.
argument-hint: "ticket ou demanda"
disable-model-invocation: true
---

# Implementar

Um ticket da **fronteira** por vez. Estados, limites e caminhos: `docs/agents/projeto.md` e `docs/agents/rastreador.md`.

## Entrada

Aceitar ticket do rastreador ou demanda delimitada e aprovada pela `triagem`. Aprovação ausente: `NEEDS_DECISION` e parar.

Em retomada, seguir [retomada.md](retomada.md) antes do ciclo.

## Ciclo

1. **Assumir.** Dizer o título do ticket; gravar `IN_PROGRESS` e os arquivos previstos. Ticket `READY` com aprovação registrada dispensa reler status e governança. Localizar cada requisito e ADR pelo ID com `grep -n` e ler só o trecho (offset e limite); guardar os trechos como ID + `arquivo:linha`. Glossário só para termo novo. Arquivos de dados grandes (catálogos) são inspecionados pelos scripts que o adaptador indica, nunca lidos inteiros.
2. **Construir.** Chamar `tdd` nas **costuras** acordadas, uma **fatia vertical** por vez. Bug de causa desconhecida: chamar `diagnosticar` antes. Concluído quando todo critério de aceite tem teste verde ou justificativa escrita para não ter.
3. **QG-1.** Chamar `portao-qualidade`. Falha: corrigir a causa e repetir, contando tentativas **por causa raiz**; esgotado o limite do adaptador, `BLOCKED` com diagnóstico.
4. **Verificar.** Gravar `IN_VALIDATION` e acionar o subagente `verificador` com demanda, critérios como trechos citados (ID + `arquivo:linha` + texto), arquivos, fingerprint, evidências e risco; não passar caminho de documento inteiro como critério. Seguir só com `PASS`; `FAIL` volta ao passo 2; `BLOCKED` ou `NEEDS_DECISION` param e são relatados.
5. **QG-2**, e QG-3 se fechar módulo ou a triagem pedir.
6. **Revisar.** Chamar `revisao-codigo`. Corrigir violação objetiva e requisito ausente; levar julgamentos ao humano. Código mudou: repetir do passo 3.
7. **Concluir.** Confirmar com `node scripts/esteira/qg.mjs --verificar-fingerprint --demanda <id>`; gravar `COMPLETED`, fingerprint e resumo de evidências no estado e no ticket. Chamar `entrega` para a `mensagemCommit` e gravá-la no ticket. Encerrada a demanda inteira, incluir em `demandasConcluidas` um resumo com id, fingerprint e `mensagemCommit`, dentro do limite da configuração.

Validação humana pendente fica `PENDING_HUMAN` e segue para `/homologar`.

Concluída quando o estado gravado, o ticket e o fingerprint conferem com a árvore de trabalho, e a `mensagemCommit` foi entregue ao humano.

## Guarda-corpos

- Escopo é o do ticket; descoberta nova vira ticket proposto.
- Requisito ambíguo vira `NEEDS_DECISION`.
- O humano faz o commit, com o texto entregue.

## Saída

```markdown
## Implementação
- demandaId / ticket:
- estado:
- arquivos:
- criteriosOk: []
- fingerprint:
- qg1 / verificador / qg2 / revisão:
- evidencias: []
- mensagemCommit: |
- proximaAcao:
```
