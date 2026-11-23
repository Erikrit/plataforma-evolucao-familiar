# Agentes — Plataforma de Evolução Familiar

Esteira inteligente de desenvolvimento contínuo (ADR-012). Não altera requisitos funcionais aprovados.

## Fontes oficiais (não duplicar)

| Papel | Caminho |
|---|---|
| Documento Mestre | `docs/produto/DOCUMENTO-MESTRE.md` |
| Status e escopo | `docs/produto/STATUS-E-ESCOPO.md` |
| Governança | `docs/produto/GOVERNANCA.md` |
| Arquitetura | `docs/arquitetura/ARQUITETURA.md` |
| Decisões (ADRs) | `docs/arquitetura/DECISOES.md` |
| Módulo (quando aplicável) | `docs/modulos/<id>/ESPECIFICACAO.md` |
| UX | `docs/ux-ui/GUIA-DE-EXPERIENCIA.md` |
| Segurança do repositório | `.github/SECURITY.md` |
| Registro da esteira | `docs/esteira/REGISTRO.md` |
| Estado persistido | `docs/esteira/estado/atual.json` |

## Agente principal (este chat)

Orquestra evolução contínua: **triagem** → (planejar se necessário) → implementar → QG-1 → verificador → QG-2 → corrigir (máx. 3 tentativas/causa) → QG-3 ao fechar módulo/conjunto → homologação quando solicitada.

Skills: `task-routing`, `module-planning`, `implementation-workflow`, `quality-gate`.

## Subagente

- **verifier** (`.cursor/agents/verifier.md`): validação independente, somente leitura. Acionar após QG-1 e antes de declarar demanda/incremento COMPLETED.

## Especialistas consultivos (não são agentes permanentes)

Acionar sob demanda, via leitura das fontes oficiais + resumo estruturado:

1. **Produto** — ambiguidade funcional, critérios de aceite, escopo MVP, aprovações L3.
2. **Arquitetura** — ADRs, monólito modular, contratos preliminares vs. aprovados.
3. **UX/UI** — mobile-first, esforço mínimo, organização sem cobrança.

## Context Engineering (4 camadas)

1. Este arquivo + `.cursor/rules/engineering.mdc` (permanente).
2. Governança + especificação/ADR/UX do assunto (sob demanda).
3. Código/testes da demanda ou incremento (quando existirem).
4. Skills e referências técnicas (sob demanda).

Não copiar o Documento Mestre para prompts. Referenciar o caminho e ler só o necessário.

## Fase vigente e dados de desenvolvimento

Consultar `docs/produto/STATUS-E-ESCOPO.md` para a baseline V1 homologada e a fase de evolução pré-uso. Aplicar `docs/produto/DOCUMENTO-MESTRE.md` §13 nas próximas demandas: cadastros atuais de desenvolvimento podem ser recriados, com dispensa de migrações de preservação/compatibilidade desses dados. Regras funcionais, testes e autorização continuam regidos pelas especificações.

## Fluxo de entrada

1. `task-routing` — classificar, verificar aprovação, escolher fluxo mínimo.
2. `module-planning` — só novo módulo ou mudança complexa que exija decomposição.
3. `implementation-workflow` — incremento planejado **ou** demanda delimitada aprovada.
4. `quality-gate` — QG-1/QG-2/QG-3 e perfil de homologação, por impacto/risco.

## Proibições absolutas

Sem `git commit`, `git push`, tags, releases, PRs, deploy ou publicação. Sem credenciais ou dados pessoais reais. Hooks em `.cursor/hooks.json` reforçam isso; não contornar via scripts/MCP.

## Estados

`PENDING` → `READY` → `IN_PROGRESS` → `IN_VALIDATION` → `COMPLETED` | `BLOCKED`

Demanda ativa vive em `atual.json` → `demanda` (histórico de módulos e `demandasConcluidas` preservados).

Retomada: comparar `docs/esteira/estado/atual.json` com o workspace real (incluindo não rastreados) e recalcular fingerprint dos arquivos afetados. Não confiar só no histórico do chat. Evidência antiga não valida código alterado.
