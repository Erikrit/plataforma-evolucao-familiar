---
name: esteira
description: Ponto de entrada — lê o estado, classifica a demanda e recomenda a próxima skill.
argument-hint: "descrição da demanda (opcional ao retomar)"
disable-model-invocation: true
---

# Esteira

Roteador: recomenda o caminho e o humano decide percorrê-lo.

## Passos

1. **Conferir o adaptador.** Ler `esteira.config.json` e `docs/agents/projeto.md`. Se faltarem, recomendar `/configurar-esteira` e encerrar.
2. **Ler o estado** no caminho `estado` da configuração: demanda ativa, `proximaAcao` e fingerprint. Reconciliar com `git status` e a branch. Concluído quando cada divergência foi listada ou declarada inexistente.
3. **Classificar.** Com demanda nova ou sem tipo, chamar a skill `triagem`. Em retomada já classificada, usar o registro.
4. **Recomendar** pelo mapa abaixo. Antes de citar uma skill ou sugerir pular uma etapa, ler o `SKILL.md` dela.

Concluída quando a recomendação cita **estado, tipo, fluxo mínimo e motivo**.

## Mapa

| Situação | Caminho |
|---|---|
| Ideia com decisões em aberto | `/sabatina` → `/planejar` → `/implementar` por ticket |
| Novo módulo ou transversal complexa | `/sabatina` → `/planejar` → `/implementar` por ticket |
| Demanda delimitada e aprovada | `/implementar` |
| Correção com causa desconhecida | `diagnosticar` → `/implementar` |
| Validar sem mudar código | `/homologar` |
| Ticket em andamento | `/implementar` na `proximaAcao` |
| Aprovação ausente ou ambiguidade material | parar em `NEEDS_DECISION` com a pergunta ao humano |
| Código difícil de mudar ou testar | `/melhorar-arquitetura` |
| Sessão terminando | `/passagem`; se houve tropeço, `/retro` antes |

Da sabatina aos tickets, manter a mesma janela de contexto. Cada ticket começa em sessão limpa.

## Saída

```markdown
## Próximo passo
- estado:
- demanda / tipo:
- fluxo mínimo:
- recomendação: /<skill> — <motivo>
- divergências ou bloqueios:
```
