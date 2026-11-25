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

**2026-11-25 — DEV-JOG-P01..P03:** demanda `DEV-JOG-P01-P03` implementada na `develop` (base `3becc90`). QG-1/QG-2 e verifier PASS; fingerprint `82436f72…`; evidência em `docs/esteira/estado/evidencia-dev-jog-p01-p03-20261125.json`. Homologação humana da aplicação: **PASS** (aceite do responsável pelo Produto em 2026-11-25).

**2026-11-24 — DEV-JOG-P01..P03:** demanda `DEV-JOG-P01-P03` (`melhoria_funcional`) triada na `develop` @ `3becc90` (protótipo v2 e §12/§14 aprovados). Escopo: Atividades Reais (descoberta sob demanda, limite 10, retirada, curadoria). Homologação humana da implementação permanece pendente. Jogos Digitais fora.

**2026-11-24 — UX-01..05:** demanda `UX-01-05` (`melhoria_ux`) implementada na `develop` em [`9320988`](https://github.com/Erikrit/plataforma-evolucao-familiar/commit/9320988556c6353c99f5fd6556411b8c35548251). QG-1/QG-2 e verifier PASS; fingerprint `e60960a1…`. Homologação humana das cinco correções confirmada pelo responsável pelo Produto na conversa de aprovação, sem detalhamento por aparelho.
