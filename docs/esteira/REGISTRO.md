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

**Nenhuma demanda de código em andamento neste checkpoint.** Ao receber nova demanda, iniciar por `task-routing`, `STATUS-E-ESCOPO.md` e o trecho da especificação correspondente.
