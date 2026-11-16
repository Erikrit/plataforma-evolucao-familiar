---
name: module-planning
description: >-
  Valida especificação, dependências, riscos, arquitetura e critérios de
  aceitação; planeja incrementos verticais pequenos e testáveis. Use para novo
  módulo, mudança transversal complexa, ou replanejamento após
  BLOCKED/NEEDS_DECISION — não para correções pequenas já triadas.
---

# Module planning

## Quando usar

- Novo módulo designado (`task-routing` → tipo `novo_modulo`).
- Mudança transversal/complexa que exija decomposição em incrementos.
- Replanejamento após `BLOCKED` / `NEEDS_DECISION`.

**Não usar** para correção localizada, melhoria UX pontual, refatoração delimitada
ou demanda já triada com escopo claro — nesses casos ir direto a
`implementation-workflow` após `task-routing`.

Não implementar nesta skill.

## Entradas

- Saída de `task-routing` (quando houver) ou caminho da especificação.
- `docs/produto/STATUS-E-ESCOPO.md`, `docs/arquitetura/DECISOES.md`, `docs/arquitetura/ARQUITETURA.md`
- Estado: `docs/esteira/estado/atual.json`
- Governança: `docs/produto/GOVERNANCA.md` (só se houver dúvida de autoridade)

## Passos

1. Confirmar versão/status da especificação e o que está aprovado vs preliminar vs pendente.
2. Extrair requisitos e critérios de aceitação com IDs rastreáveis.
3. Mapear dependências (outros módulos, auth, DB, contratos API).
4. Classificar riscos (segurança/dados de saúde/criança = alto; UX mobile = médio; cosmético = baixo).
5. Consultar especialistas (Produto/Arquitetura/UX) só se houver ambiguidade material — ver `AGENTS.md`.
6. Partir em incrementos **verticais**, pequenos, testáveis, ordenados por dependência.
7. Atualizar `docs/esteira/estado/atual.json` (`READY` ou `BLOCKED`/`PENDING` com motivo); preservar histórico de módulos/demandas.
8. Registrar resumo em `docs/esteira/REGISTRO.md` (entrada curta).

## Saída (resumo estruturado)

```markdown
## Planejamento
- módulo / demandaId:
- riscos:
- dependências:
- incrementos: [{ id, requisitos, aceite, arquivosPrevistos, qg }]
- bloqueios:
- próxima ação:
```

## Regras

- Não alterar requisitos funcionais.
- Não criar código de aplicação aqui.
- Preferir o menor primeiro incremento apto a gerar valor verificável.
- Decisão já documentada na especificação não volta para aprovação sem conflito material.
