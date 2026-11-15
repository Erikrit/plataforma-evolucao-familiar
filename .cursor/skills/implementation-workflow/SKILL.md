---
name: implementation-workflow
description: >-
  Implementa um incremento vertical de forma incremental, com contexto mínimo,
  verificações rápidas e correções localizadas. Use após o planejamento do
  módulo, durante IN_PROGRESS, ou ao retomar um incremento interrompido.
---

# Implementation workflow

## Pré-condições

- Incremento definido por `module-planning`.
- Estado lido de `docs/esteira/estado/atual.json` e reconciliado com o workspace.
- Fontes oficiais referenciadas por caminho — não colar Documento Mestre inteiro.

## Contexto mínimo

Carregar apenas:

1. Trechos da especificação do incremento (requisitos + aceite).
2. ADRs relevantes.
3. Arquivos já existentes tocados pelo incremento.
4. Esta skill + `quality-gate` quando for verificar.

## Ciclo

1. Marcar estado `IN_PROGRESS`; listar arquivos alvo.
2. Implementar o menor slice que avance os critérios do incremento.
3. Rodar QG-1 (`quality-gate`, perfil rápido).
4. Se falhar: corrigir só a causa; incrementar contador da causa raiz (máx. 3 → `BLOCKED`).
5. Em sucesso QG-1: estado `IN_VALIDATION`; acionar subagente `verifier`.
6. Rodar QG-2 conforme aplicabilidade.
7. Se verifier = `PASS` e QG-2 ok: marcar incremento `COMPLETED`, gravar fingerprint e evidências.
8. Caso contrário: `FAIL` → correção localizada; `BLOCKED`/`NEEDS_DECISION` → parar e reportar.

## Retomada

1. Ler `atual.json`.
2. `git status` (leitura) + arquivos não rastreados.
3. Se fingerprint e critérios ainda válidos: não reimplementar.
4. Continuar na `proximaAcao`.

## Proibições

Sem commit/push/deploy. Sem expandir escopo. Sem dados reais/segredos.
