# Registro da esteira — ciclo atual

**Marco:** 2026-11-24 — V1 aprovada e homologada funcionalmente, em testes restritos à equipe na VPS com HTTPS, conforme o responsável pelo Produto. **Sem autorização de uso público ou de dados familiares reais.**

O estado vigente, o escopo homologado e as pendências estão em [Status e Escopo](../produto/STATUS-E-ESCOPO.md). As regras funcionais ficam nas quatro especificações e as regras de orquestração em [AGENTS.md](../../AGENTS.md).

## Histórico anterior à consolidação

Os registros detalhados de demandas, logs, resultados intermediários e roteiros até 24/11/2026 foram preservados no histórico Git:

- [Árvore do histórico da esteira na revisão anterior](https://github.com/Erikrit/plataforma-evolucao-familiar/tree/f58d029658499bdfc3807c0488662c0bc4557dae/docs/esteira)
- [Registro histórico completo](https://github.com/Erikrit/plataforma-evolucao-familiar/blob/f58d029658499bdfc3807c0488662c0bc4557dae/docs/esteira/REGISTRO.md)
- [Estado completo da última execução anterior](https://github.com/Erikrit/plataforma-evolucao-familiar/blob/f58d029658499bdfc3807c0488662c0bc4557dae/docs/esteira/estado/atual.json)

Essa referência é para auditoria histórica, **não** para reutilizar um QG-3 como evidência de código novo. Reexecutar checagens pertinentes quando os arquivos afetados mudarem.

## Próximas entradas

Registrar **somente transições materiais** de demandas novas: ID, tipo, branch/commit, decisão de Produto quando necessária, estado, testes pertinentes, resultado do verificador, aceite humano quando houver e próximo passo. Máximo uma entrada concisa por transição significativa; não colar saídas brutas de npm, builds e smokes.

**2026-11-27 — DEV-CAT-M1-CONTEUDO, ticket 01:** COMPLETED. Ficha padrão e régua de atividades na `develop` (base `4a5bfc5`), reaproveitando a execução paralela descartada. QG-1, QG-2 e verificador PASS (`sha256:0cf06943…`); revisão em dois eixos aplicada; E5-HOM (320 px) homologado pelo responsável. Decisões: DROP das colunas antigas confirmado, termos no glossário, ticket 13 (refatoração geral) criado antes do encerramento no 12.

**2026-11-26 — DEV-CAT-M1-CONTEUDO:** divisão em 12 tickets aprovada pelo responsável; todos `READY`.

**2026-11-26 — DEV-CAT-M1-CONTEUDO:** planejada. Correção da conferência: DEV-CAT-M1 entregou a fundação, não o Marco 1 do M03 §15. O responsável manteve o Marco 1 em 20 jogos e 60 atividades e acrescentou o jogo 2D Barquinho no rio como fechamento; escolheu os 12 jogos novos (M03 §15 v1.9). Decidiu também que o banco da VPS de testes pode ser limpo e recriado por ele na publicação. Spec e 12 tickets `PENDING` em `docs/esteira/tickets/catalogo-marco1-conteudo/`. Base `3dd147f`.

**2026-11-26 — DEV-CAT-M1:** COMPLETED (fundação do Marco 1). Tickets 01–04 e 06–17 homologados; 05 descartado (jogos sem faixa, P04 revisto). QG-3 PASS sobre `master..1cbe2b9` (`sha256:dc49fe59…`). `master` continua em `dcf901d`; publicação a cargo do responsável.

**2026-11-25 — DEV-CAT-M1 (tickets 01, 08, 04):** divisão aprovada pelo Produto; `EST-V2-CLAUDE-CODE` movida para `demandasConcluidas` aguardando aceite. Ticket 01 COMPLETED; 04 e 08 IN_VALIDATION. lint, typecheck, build e checks PASS; `authz` e smokes BLOCKED no `qg.mjs` (sem Docker no agente) e PASS em ambiente alternativo (ff-nasc 16/16, e2 16/16, e4 20/20, e5 40/40, est-03 15/15, authz e e1-03 exit 0). Verificador: sem defeito objetivo; achados corrigidos. Pendente: qg com Docker e homologação no celular. Falhas anteriores: check:e2 e smoke:e1-ent.

**2026-11-25 — DEV-CAT-M1:** direção do catálogo ampliado aprovada pelo responsável pelo Produto (L3, DEV-CAT-P01 a P09) e registrada no Módulo 03 §15 e no Módulo 01 §16. Spec e dez tickets propostos em `docs/esteira/tickets/catalogo-ampliado/`, `PENDING` até aprovação da divisão e das decisões D1 a D3. ADR-017 em proposta na spec. Base `3af08c0`. Triagem no `atual.json` após o encerramento de `EST-V2-CLAUDE-CODE`. Nada implementado.

**2026-11-25 — EST-V2-CLAUDE-CODE:** esteira v2 (`transversal`, origem humano) em `chore/esteira-claude-code`, base `a07f830`. Núcleo de skills, adaptador, política única, QG determinístico e kit. QG-1, QG-2 e verificador PASS (`sha256:6f01b39e…`); revisão em dois eixos feita. Pendentes: Fase 5.2 (runner de testes), `check:e2` (falha anterior), aceite humano, ADR-016 e glossário (`PROPOSTA`). Estado em `atual.json`.

**2026-11-25 — DEV-JOG-P01..P03:** demanda `DEV-JOG-P01-P03` implementada na `develop` (base `3becc90`). QG-1/QG-2 e verifier PASS; fingerprint `82436f72…`; evidência em `docs/esteira/estado/evidencia-dev-jog-p01-p03-20261125.json`. Homologação humana da aplicação: **PASS** (aceite do responsável pelo Produto em 2026-11-25).

**2026-11-24 — DEV-JOG-P01..P03:** demanda `DEV-JOG-P01-P03` (`melhoria_funcional`) triada na `develop` @ `3becc90` (protótipo v2 e §12/§14 aprovados). Escopo: Atividades Reais (descoberta sob demanda, limite 10, retirada, curadoria). Homologação humana da implementação permanece pendente. Jogos Digitais fora.

**2026-11-24 — UX-01..05:** demanda `UX-01-05` (`melhoria_ux`) implementada na `develop` em [`9320988`](https://github.com/Erikrit/plataforma-evolucao-familiar/commit/9320988556c6353c99f5fd6556411b8c35548251). QG-1/QG-2 e verifier PASS; fingerprint `e60960a1…`. Homologação humana das cinco correções confirmada pelo responsável pelo Produto na conversa de aprovação, sem detalhamento por aparelho.

**2026-11-27 — DEV-CAT-M1-CONTEUDO, ticket 02:** lote 1 com 20 Atividades Reais novas (40 ativas, 7 de Números, sem buraco de faixa × área) na `develop` @ `a9e9e9f`, sem commit. QG-1/QG-2 e verificador PASS; fingerprint `sha256:d6669f8d…`. Teto do catálogo 24 → 60. `PENDING_HUMAN`: E5-HOM da amostra de 5.
