---
name: portao-qualidade
description: Portão de qualidade (QG-1, QG-2, QG-3, homologação) com evidência gerada por script. Use após implementar, antes de declarar conclusão ou ao homologar.
---

# Portão de qualidade

O script gera o status; você executa e interpreta.

## Perfis

| Perfil | Quando | Cobre |
|---|---|---|
| `qg1` | A cada fatia pronta | Verificação rápida e testes afetados |
| `qg2` | Demanda ou ticket, depois do verificador | Build, testes e áreas tocadas |
| `qg3` | Fechamento de módulo ou transversal | Regressão integrada |
| homologação | Validação, com ou sem código | [homologacao.md](homologacao.md) |

## Passos

1. Escolher o perfil por impacto e risco. As checagens, os padrões **críticos** e os requisitos vêm de `esteira.config.json`.
2. Executar:

   ```bash
   node scripts/esteira/qg.mjs --perfil <qg1|qg2|qg3> --demanda <id>
   ```

3. Ler o JSON de evidência indicado na saída. Cada status relatado é copiado dele.
4. Interpretar: para `FAIL`, apontar a causa na saída capturada; para `BLOCKED`, o requisito ausente e quem pode supri-lo.
5. Decidir se bloqueia a conclusão.

Concluído quando toda checagem do JSON aparece no relatório com status, comando e exit code, e o fingerprint registrado confere com a árvore.

## Política de evidência

- `PASS` / `FAIL`: houve execução com exit code.
- `BLOCKED`: requisito indisponível. `PENDING`: ainda não executado.
- `PENDING_HUMAN`: depende de pessoa, aparelho ou família; só evidência humana muda esse status.
- `NOT_APPLICABLE`: a verificação não se aplica, com motivo.
- Checagem **crítica** selecionada é obrigatória em todo perfil que a declara.
- Fingerprint divergente invalida a evidência; reexecutar o pertinente.
- Áreas intocadas com fingerprint válido mantêm sua evidência.
- O estado versionado recebe resumo que se sustenta sozinho; a saída bruta fica local.

`COMPLETED` exige obrigatórias em `PASS`, `verificador` em `PASS` e nenhum item humano dado como feito sem evidência. Homologação sem código usa o `verificador` para validar o relatório de achados.

## Saída

```markdown
## Portão de qualidade
- perfil:
- demandaId:
- impacto / risco:
- checagens: [{ nome, status, comando, exit }]
- evidencia:
- fingerprint:
- evidenciasInvalidas: []
- bloqueiaCompletude:
- próxima ação:
```
