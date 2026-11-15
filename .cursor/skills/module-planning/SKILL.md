---
name: module-planning
description: >-
  Valida especificação, dependências, riscos, arquitetura e critérios de
  aceitação; planeja incrementos verticais pequenos e testáveis. Use ao receber
  um módulo, antes de implementar, ou ao replanejar após BLOCKED/NEEDS_DECISION.
---

# Module planning

## Quando usar

Início de módulo ou replanejamento. Não implementar nesta skill.

## Entradas

- Caminho da especificação (ex.: `docs/modulos/01-fundacao-familiar/ESPECIFICACAO.md`)
- `docs/produto/STATUS-E-ESCOPO.md`, `docs/arquitetura/DECISOES.md`, `docs/arquitetura/ARQUITETURA.md`
- Estado: `docs/esteira/estado/atual.json`

## Passos

1. Confirmar versão/status da especificação e o que está aprovado vs preliminar vs pendente.
2. Extrair requisitos e critérios de aceitação com IDs rastreáveis.
3. Mapear dependências (outros módulos, auth, DB, contratos API ainda não finalizados).
4. Classificar riscos (segurança/dados de saúde/criança = alto; UX mobile = médio; cosmético = baixo).
5. Consultar especialistas (Produto/Arquitetura/UX) só se houver ambiguidade material — ver `AGENTS.md`.
6. Partir em incrementos **verticais**, pequenos, testáveis, ordenados por dependência.
7. Atualizar `docs/esteira/estado/atual.json` (`READY` ou `BLOCKED`/`PENDING` com motivo).
8. Registrar resumo em `docs/esteira/REGISTRO.md` (entrada curta).

## Saída (resumo estruturado)

```markdown
## Planejamento
- módulo:
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
