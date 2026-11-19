---
name: task-routing
description: >-
  Classifica demandas de evolução contínua (correção, UX, CT, módulo,
  homologação), verifica aprovação/governança e escolhe o fluxo mínimo.
  Use ao receber qualquer demanda nova, CT aprovado, pedido de correção,
  melhoria, refatoração, homologação ou antes de module-planning.
---

# Task routing

Entrada única da esteira de desenvolvimento contínuo. Não implementa produto.
Não cria requisitos novos. Não substitui a autoridade do Produto
(`docs/produto/GOVERNANCA.md`).

## Quando usar

- Qualquer demanda nova (correção, melhoria, CT, módulo, homologação).
- Retomada em que o tipo/fluxo da demanda ainda não está classificado.
- Antes de `module-planning` ou `implementation-workflow`.

## Tipos suportados

| Tipo | Uso típico | Fluxo mínimo |
|---|---|---|
| `correcao` | Bug localizado, regressão pontual | `implementation-workflow` → `quality-gate` |
| `melhoria_funcional` | Mudança funcional já aprovada na especificação | `implementation-workflow` → `quality-gate` (QG-3 se fechar módulo) |
| `melhoria_ux` | Layout/rótulo/interação compatível com regras vigentes | `implementation-workflow` → `quality-gate` |
| `refatoracao` | Mudança técnica sem alterar comportamento | `implementation-workflow` → `quality-gate` (foco regressão) |
| `transversal` | Afeta vários módulos/contratos | impacto L2 → possivelmente `module-planning` parcial → implementação |
| `novo_modulo` | Módulo designado com especificação | `module-planning` → `implementation-workflow` → `quality-gate` |
| `homologacao` | Investigar/validar sem (ou antes de) alterar código | `quality-gate` perfil homologação; implementação só se houver achado aprovado |

## Governança (obrigatório)

Consultar apenas o necessário:

1. `docs/produto/GOVERNANCA.md` — níveis L1/L2/L3 e CT.
2. `docs/produto/STATUS-E-ESCOPO.md` — estado consolidado e pendências.
3. Fonte dona da regra (especificação, guia UX ou ADR) — só o trecho afetado.
4. `docs/esteira/estado/atual.json` — demanda/módulo em voo; não sobrescrever histórico.

Regras:

- L1: decisão local dentro da especialidade.
- L2: análise transversal proporcional ao impacto.
- L3: exigir aprovação explícita do Produto antes de alterar fonte canônica.
- Decisão já `APROVADA`/`DOCUMENTADA` na especificação **não** volta para aprovação sem novo conflito material.
- CT é contrato de transferência, não módulo nem documento obrigatório por demanda.
- Sem aprovação exigida → `BLOCKED` ou `NEEDS_DECISION`; não implementar.

## Passos

1. Ler a demanda do usuário e o estado persistido; reconciliar com `git status` (leitura).
2. Classificar o **tipo** e a **origem** (humano, CT, STATUS, verifier, homologação).
3. Verificar aprovação: status do CT/decisão, nível L1–L3, destino documental.
4. Avaliar escopo, impacto, risco (auth/privacidade/criança/saúde = alto).
5. Listar dependências e decisões pendentes; bloquear se L3 sem aprovação.
6. Selecionar o fluxo mínimo da tabela (não inventar etapas).
7. Definir critérios de aceite rastreáveis (IDs existentes) e testes pertinentes.
8. Atualizar `docs/esteira/estado/atual.json` na seção `demanda` (preservar `modulo`/`incrementosConcluidos`/`demandasConcluidas`).
9. Registrar entrada curta em `docs/esteira/REGISTRO.md`.

## Saída (resumo estruturado)

```markdown
## Triagem
- demandaId:
- tipo: correcao | melhoria_funcional | melhoria_ux | refatoracao | transversal | novo_modulo | homologacao
- origem:
- aprovacao: { nivel, status, referencia }
- escopo:
- impacto:
- risco: baixo | medio | alto
- dependencias:
- bloqueios:
- fluxo: [skills...]
- criteriosAceite: []
- testesPertinentes: []
- proximaAcao:
```

## Encaminhamento

| Condição | Próxima skill |
|---|---|
| `novo_modulo` ou `transversal` complexa | `module-planning` |
| Demanda delimitada e aprovada com código | `implementation-workflow` |
| `homologacao` sem mudança inicial de código | `quality-gate` (perfil homologação) |
| Sem aprovação / ambiguidade material | Parar: `NEEDS_DECISION` |

## Proibições

- Não implementar funcionalidade do produto nesta skill.
- Não duplicar requisitos nem reescrever decisões aprovadas.
- Não criar agente permanente nem CT-arquivo por demanda.
- Sem commit/push/deploy.
