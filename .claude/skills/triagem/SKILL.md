---
name: triagem
description: Triagem de demanda — classifica tipo, origem, aprovação, risco e fluxo mínimo. Use ao receber demanda nova ou ao retomar uma demanda sem classificação.
---

# Triagem

Classifica sem implementar. Autoridade, estados e caminhos vêm de `docs/agents/projeto.md`.

## Tipos

| Tipo | Uso típico | Fluxo mínimo |
|---|---|---|
| `correcao` | Bug localizado, regressão pontual | `diagnosticar` se a causa é desconhecida → `implementar` → `portao-qualidade` |
| `melhoria_funcional` | Mudança funcional já aprovada na especificação | `implementar` → `portao-qualidade` (QG-3 se fechar módulo) |
| `melhoria_ux` | Layout, rótulo ou interação compatível com as regras vigentes | `implementar` → `portao-qualidade` |
| `refatoracao` | Mudança técnica que preserva o comportamento | `implementar` → `portao-qualidade` (foco em regressão) |
| `transversal` | Afeta vários módulos ou contratos | análise de impacto L2 → `planejar` se complexa → `implementar` |
| `novo_modulo` | Módulo designado com especificação | `sabatina` → `planejar` → `implementar` → `portao-qualidade` |
| `homologacao` | Validar sem, ou antes de, alterar código | `homologar`; implementação só para achado aprovado |

## Passos

1. Ler a demanda e só a parte ativa do estado; reconciliar com branch, commit e `git status`. Concluído quando cada divergência está listada.
2. Definir **tipo** e **origem** (humano, CT, estado, verificador, homologação).
3. Verificar a **aprovação**: nível L1–L3, status da decisão ou CT, fonte dona da regra. Concluído quando há referência citável ou a demanda está em `NEEDS_DECISION`.
4. Avaliar escopo, impacto e **risco** pela lista de risco alto do adaptador.
5. Listar dependências e decisões pendentes.
6. Escolher o **fluxo mínimo** da tabela.
7. Definir critérios de aceite com IDs existentes e as verificações pertinentes.
8. Gravar a seção `demanda` do estado (`id`, `tipo`, `origem`, `estado`, `fluxo`, `aprovacao`, `risco`, `criteriosAceite`, `arquivos`, `proximaAcao`), preservando os demais campos e o limite de demandas concluídas.
9. Registrar entrada curta no registro se houve transição material.

Concluída quando todos os campos da saída estão preenchidos e o estado gravado confere com eles.

## Regras

- L3 exige aprovação explícita antes de mudar a fonte canônica; sem ela, `NEEDS_DECISION`.
- Decisão aprovada ou documentada segue valendo até conflito material novo.
- Requisitos vêm da fonte oficial, citados por ID.
- Demanda encerrada em ciclo anterior fica no histórico do Git.

## Saída

```markdown
## Triagem
- demandaId:
- tipo:
- origem:
- aprovacao: { nivel, status, referencia }
- escopo:
- impacto:
- risco: baixo | medio | alto
- dependencias:
- bloqueios:
- fluxo: []
- criteriosAceite: []
- testesPertinentes: []
- proximaAcao:
```
