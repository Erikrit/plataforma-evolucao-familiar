# Aprofundar

## Dependências

| Categoria | Exemplo | Como testar |
|---|---|---|
| No processo | Cálculo, estado em memória | Direto pela nova interface |
| Substituível localmente | Banco de teste, sistema de arquivos | Com o substituto real; costura interna |
| Remota e própria | Outro serviço nosso | Porta na costura; adaptador em memória no teste |
| Externa | Serviço de terceiros | Porta injetada; substituto no teste |

Introduzir porta só quando dois adaptadores se justificam.

## Testes: trocar, sem empilhar

Testes novos na interface aprofundada substituem os dos módulos rasos. Eles verificam resultado observável e sobrevivem a refatoração interna.

## Desenhar duas vezes

Para interface importante, pedir a subagentes três desenhos bem diferentes: o mínimo de métodos, o mais flexível e o otimizado para o chamador mais comum. Comparar em profundidade, localidade e posição da costura, e recomendar um.
