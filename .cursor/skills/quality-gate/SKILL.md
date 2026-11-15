---
name: quality-gate
description: >-
  Seleciona verificações aplicáveis (QG-1/QG-2/QG-3), executa testes, produz
  evidências e impede aprovação sem validação. Use antes de promover incremento
  ou módulo, após implementação, ou quando o verifier solicitar rechecagem.
---

# Quality gate

## Contratos

### QG-1 — Rápido

Typecheck, lint e testes diretamente afetados pelo diff do incremento.

### QG-2 — Incremento

Build pertinente; unitário; integração; API; E2E; revisão independente (`verifier`), conforme existirem no repo.

### QG-3 — Módulo

Build integrado, regressões, fluxos completos, compatibilidade entre componentes, critérios do módulo.

## Política (fase sem aplicação)

- Não criar app fictícia para “passar” gates.
- Sem alvo executável: status `PENDING` (ainda não há código) ou `BLOCKED` (esperado mas indisponível).
- `NOT_APPLICABLE` somente se a verificação não se aplica ao incremento.
- Aprovação de incremento exige evidência real das checagens aplicáveis + veredicto do `verifier` quando em QG-2.

## Procedimento

1. Detectar tooling real (`package.json`, configs de lint/test/e2e). Se ausente, registrar matriz com `PENDING`/`BLOCKED`.
2. Selecionar perfil QG-1, QG-2 ou QG-3.
3. Executar só o que existir; capturar comando, exit code, trecho de saída.
4. Gravar evidências em caminhos referenciados no estado (não commitar logs sensíveis).
5. Atualizar `docs/esteira/estado/atual.json` (`verificacao`).
6. Impedir `COMPLETED` se houver `FAIL` aplicável ou se o verifier não for `PASS` no QG-2.

## Matriz de saída

```markdown
## Quality Gate
- perfil: QG-1 | QG-2 | QG-3
- checagens: [{ nome, status, evidência }]
- bloqueiaCompletude: true|false
- próxima ação:
```

## Skills candidatas (avaliação posterior)

- Vercel React Best Practices
- Web Design Guidelines

Não instalar nesta fase.
