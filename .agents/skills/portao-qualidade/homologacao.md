# Perfil de homologação

| Natureza | Status possível | Evidência |
|---|---|---|
| Automatizada executável | `PASS`, `FAIL`, `PENDING`, `BLOCKED` | JSON do `qg.mjs` |
| Pessoa, aparelho real, família | `PENDING_HUMAN` até haver retorno | Quem, quando, aparelho, resultado |
| Produção ou dados reais | Fora da esteira local | Declarar o limite |

Comando: `node scripts/esteira/qg.mjs --perfil qg3 --integral --demanda <id>`. O `--integral` inclui críticos e áreas mesmo com diff vazio.

Sem alteração de código, rodar só este perfil e relatar achados. Achado vira demanda pela `triagem`; a implementação depende de aprovação.

A evidência humana registrada precisa de origem citável, como a confirmação do responsável na conversa. Ausência de resposta mantém `PENDING_HUMAN`.
