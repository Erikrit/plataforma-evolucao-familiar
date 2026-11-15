# Agentes — Plataforma de Evolução Familiar

Esteira inteligente de desenvolvimento (ADR-012). Não altera requisitos funcionais aprovados.

## Fontes oficiais (não duplicar)

| Papel | Caminho |
|---|---|
| Documento Mestre | `docs/produto/DOCUMENTO-MESTRE.md` |
| Status e escopo | `docs/produto/STATUS-E-ESCOPO.md` |
| Arquitetura | `docs/arquitetura/ARQUITETURA.md` |
| Decisões (ADRs) | `docs/arquitetura/DECISOES.md` |
| Módulo atual (quando designado) | `docs/modulos/<id>/ESPECIFICACAO.md` |
| Segurança do repositório | `.github/SECURITY.md` |
| Registro da esteira | `docs/esteira/REGISTRO.md` |
| Estado persistido | `docs/esteira/estado/atual.json` |

## Agente principal (este chat)

Orquestra: validar especificação → planejar incrementos → implementar → QG-1 → verificador → QG-2 → corrigir (máx. 3 tentativas/causa) → próximo incremento → QG-3 no módulo completo.

Skills: `module-planning`, `implementation-workflow`, `quality-gate`.

## Subagente

- **verifier** (`.cursor/agents/verifier.md`): validação independente, somente leitura. Acionar após QG-1 e antes de declarar incremento COMPLETED.

## Especialistas consultivos (não são agentes permanentes)

Acionar sob demanda, via leitura das fontes oficiais + resumo estruturado:

1. **Produto** — ambiguidade funcional, critérios de aceite, escopo MVP.
2. **Arquitetura** — ADRs, monólito modular, contratos preliminares vs. aprovados.
3. **UX/UI** — mobile-first, esforço mínimo, organização sem cobrança.

## Context Engineering (4 camadas)

1. Este arquivo + `.cursor/rules/engineering.mdc` (permanente).
2. Especificação e ADRs do módulo atual (sob demanda).
3. Código/testes do incremento (quando existirem).
4. Skills e referências técnicas (sob demanda).

Não copiar o Documento Mestre para prompts. Referenciar o caminho e ler só o necessário.

## Proibições absolutas

Sem `git commit`, `git push`, tags, releases, PRs, deploy ou publicação. Sem credenciais ou dados pessoais reais. Hooks em `.cursor/hooks.json` reforçam isso; não contornar via scripts/MCP.

## Estados

`PENDING` → `READY` → `IN_PROGRESS` → `IN_VALIDATION` → `COMPLETED` | `BLOCKED`

Retomada: comparar `docs/esteira/estado/atual.json` com o workspace real (incluindo não rastreados). Não confiar só no histórico do chat.
