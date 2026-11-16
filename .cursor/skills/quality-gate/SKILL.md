---
name: quality-gate
description: >-
  Seleciona verificações QG-1/QG-2/QG-3 por impacto e risco, executa testes
  pertinentes, valida homologação e impede aprovação sem evidência. Use após
  implementação, em demandas individuais, regressão integrada ou homologação.
---

# Quality gate

## Contratos

### QG-1 — Rápido

Typecheck/lint e testes diretamente afetados pelo diff da demanda/incremento.

### QG-2 — Demanda ou incremento

Build pertinente; unitário; integração; API/smoke afetados; E2E se existir;
revisão independente (`verifier`).

### QG-3 — Fechamento

Build integrado e regressões do módulo ou conjunto impactado; fluxos completos;
compatibilidade; critérios do módulo/demanda transversal.

### Homologação — perfil específico

Distinguir:

| Natureza | Status típico | Evidência |
|---|---|---|
| Teste automatizado executável (smoke, typecheck, build) | PASS/FAIL/PENDING/BLOCKED | comando + exit + trecho |
| Validação humana / dispositivos reais / familiares | `PENDING_HUMAN` | checklist; não inventar PASS |
| Segurança em produção / dados reais | fora do escopo da esteira local | não marcar homologado |

Homologação **sem alteração inicial de código** pode rodar só este perfil e
atualizar estado/STATUS com achados — sem forçar implementação.

## Seleção por impacto e risco

1. Mapear arquivos e domínios tocados (auth, authz, privacidade, persistência, UI).
2. Escolher o menor conjunto de checagens que cubra o risco.
3. Não reexecutar a suíte inteira se o impacto for local e as evidências dos
   módulos não afetados permanecerem válidas para o código atual.
4. Se o código coberto por evidência antiga mudou (fingerprint diverge) →
   invalidar essa evidência e reexecutar o pertinente.
5. **Nunca reduzir** checagens críticas de autenticação, autorização, privacidade
   ou persistência quando o diff as toca — exigir smoke/authz aplicável.

## Política de evidência

- App local existe (`apps/api`, `apps/web`): executar tooling real disponível.
- Sem alvo para uma checagem específica: `PENDING` ou `BLOCKED` (motivo).
- `NOT_APPLICABLE` só se a verificação realmente não se aplica.
- Não inventar código nem resultados verdes.
- Aprovação de demanda/incremento exige evidência real das checagens aplicáveis
  + veredicto `PASS` do `verifier` no QG-2 (exceto homologação só-leitura sem
  mudança de código, onde o verifier valida o relatório de achados).

## Procedimento

1. Detectar tooling (`package.json`, smokes em `apps/api/scripts`, lint/typecheck).
2. Selecionar perfil: QG-1 | QG-2 | QG-3 | homologacao (combináveis).
3. Executar só o pertinente; capturar comando, exit code, trecho de saída.
4. Gravar evidências referenciadas no estado (sem dados pessoais reais).
5. Atualizar `docs/esteira/estado/atual.json` (`demanda.verificacao` ou `verificacao`).
6. Impedir `COMPLETED` se houver `FAIL` aplicável, verifier ≠ `PASS` no QG-2,
   ou se marcar homologação humana como concluída sem evidência humana.

## Matriz de saída

```markdown
## Quality Gate
- perfil: QG-1 | QG-2 | QG-3 | homologacao
- demandaId / incremento:
- impacto: local | modulo | transversal
- risco: baixo | medio | alto
- checagens: [{ nome, status, evidência }]
- evidenciasInvalidas: []
- bloqueiaCompletude: true|false
- próxima ação:
```

## Tooling conhecido (referência)

- Typecheck: `npm run typecheck`
- Build: `npm run build`
- Smokes por incremento/módulo: `apps/api` scripts `smoke:*`
- Authz crítico: `npm run smoke:authz -w @pef/api` quando auth/autorização for tocada
