---
name: implementation-workflow
description: >-
  Implementa incremento de módulo ou demanda delimitada já triada, com contexto
  mínimo, correção localizada e verificação independente. Use após
  task-routing/module-planning, durante IN_PROGRESS, ou ao retomar trabalho
  interrompido.
---

# Implementation workflow

## Pré-condições

Aceitar **uma** das entradas:

1. **Incremento de módulo** definido por `module-planning`.
2. **Demanda delimitada e aprovada** por `task-routing` (tipos `correcao`,
   `melhoria_funcional`, `melhoria_ux`, `refatoracao`, ou `transversal` já
   decomposta).

Também:

- Estado lido de `docs/esteira/estado/atual.json` e reconciliado com o workspace.
- Fontes oficiais referenciadas por caminho — não colar Documento Mestre inteiro.
- Sem aprovação exigida (L3 / CT pendente) → não implementar; reportar `NEEDS_DECISION`.

## Contexto mínimo

Carregar apenas:

1. Trechos da especificação/critérios da demanda ou incremento.
2. ADRs relevantes.
3. Arquivos já existentes tocados pela demanda.
4. Esta skill + `quality-gate` quando for verificar.
5. `task-routing` só se a classificação ainda estiver ambígua.

## Ciclo

1. Marcar estado `IN_PROGRESS` na demanda/incremento ativo; listar arquivos alvo.
2. Implementar o menor slice que avance os critérios.
3. Rodar QG-1 (`quality-gate`, perfil rápido / por impacto).
4. Se falhar: corrigir só a causa; incrementar contador da causa raiz (máx. 3 → `BLOCKED`).
5. Em sucesso QG-1: estado `IN_VALIDATION`; acionar subagente `verifier`.
6. Rodar QG-2 conforme aplicabilidade e risco.
7. Se verifier = `PASS` e QG-2 ok: marcar `COMPLETED`, gravar **fingerprint hash**
   verificável dos arquivos afetados e evidências; arquivar em `demandasConcluidas`
   ou `incrementosConcluidos` sem apagar histórico anterior; **incluir `mensagemCommit`
   no resumo** (pronta para o humano colar — sem executar commit).
8. Caso contrário: `FAIL` → correção localizada; `BLOCKED`/`NEEDS_DECISION` → parar e reportar.

## Saída (resumo estruturado)

Emitir ao fechar o ciclo (ou ao reportar bloqueio). Em `COMPLETED`, `mensagemCommit` é obrigatória.

```markdown
## Implementação
- demandaId / incrementoId:
- estado: IN_PROGRESS | IN_VALIDATION | COMPLETED | BLOCKED | NEEDS_DECISION
- arquivos:
- criteriosOk: []
- fingerprint:
- qg1 / qg2 / verifier:
- evidencias: []
- mensagemCommit: |
    <assunto convencional: porquê em 1 linha>

    <corpo opcional: 1–2 frases com o porquê / escopo fechado>
- proximaAcao:
```

### `mensagemCommit` (obrigatória em `COMPLETED`)

- Texto pronto para o humano usar no commit; **não** executar `git commit`.
- Estilo alinhado ao histórico do repositório (ex.: `tipo(escopo): resumo`).
- Foco no **porquê** e no valor entregue, não na lista de arquivos.
- 1 linha de assunto (≤ ~72 chars); corpo curto só se precisar de contexto.
- Em `BLOCKED` / `NEEDS_DECISION` / ciclo incompleto: omitir ou marcar `N/A`.

## Retomada

1. Ler `atual.json` (`demanda` ativa ou incremento de módulo).
2. `git status` (leitura) + arquivos não rastreados.
3. Recalcular fingerprint hash dos arquivos listados; se divergir do registrado,
   **não** reutilizar evidência antiga — revalidar.
4. Se fingerprint e critérios ainda válidos: não reimplementar.
5. Continuar na `proximaAcao`.

## Fingerprint

- Formato futuro: hash SHA-256 (ou prefixo estável) do conteúdo dos arquivos
  afetados + revisão (`branch`/`commit` de referência).
- Evidências históricas simbólicas permanecem como registro; não reescrever
  artificialmente. Novas conclusões usam hash real.

## Proibições

Sem commit/push/deploy. Sem expandir escopo além da triagem/planejamento.
Sem dados reais/segredos. Não implementar CT ou melhoria sem aprovação vigente.
