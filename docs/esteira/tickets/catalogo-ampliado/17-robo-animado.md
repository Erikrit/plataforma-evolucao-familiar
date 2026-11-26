# 17: Robô anda passo a passo

**O que entregar:** pedido da homologação de 2026-11-26. Ao tocar Executar, o robô percorre cada casa do programa, uma de cada vez, à vista da criança.

**Decisão (2026-11-26):** a explosão 💥 na parede foi testada e retirada a pedido do responsável. Num teste, a fase não terminou depois de uma explosão, e ele preferiu não correr o risco. Na parede ou antes da chegada, o robô fica onde parou, como antes, e volta ao início quando o programa muda.

**Bloqueado por:** nenhum

**Status:** COMPLETED

**Costura:** typecheck, check:e5 e homologação no celular

**Risco:** baixo

## Critérios

- [x] O robô anda uma casa por vez, num ritmo que se acompanha com os olhos (mais rápido com "reduzir movimento"). Homologado pelo responsável em 2026-11-26.
- [x] Sem explosão: na parede ou antes da chegada, o robô para onde está e mostra a mensagem de sempre.
- [x] Durante a animação, os botões de programa ficam bloqueados.

## Implementação (2026-11-26)

- `executar` calcula o caminho, anima o robô uma casa a cada 350 ms (120 ms com "reduzir movimento") e usa um único temporizador final, que libera os botões e, se o robô chegou, conclui a fase. Os temporizadores são limpos se o tabuleiro sair da tela.
- A figura 💥 baixada no primeiro teste foi apagada.
- **Evidências:** QG-1 PASS `qg1-2026-11-26T23-23-57-659Z.json`; QG-2 PASS `qg2-2026-11-26T23-26-04-161Z.json`; fingerprint `sha256:6e3eb0294f57aaf92301009ba3688ce60724998b70c7012529be104bf3f39c9d`. Verificador PASS: nenhum caminho deixa a fase sem terminar, inclusive uma chegada depois de colisão, clique duplo e Dica durante a animação.
- **PENDING_HUMAN:** H22 (reteste curto).

**mensagemCommit (tickets 11, 14 e 17, juntos na árvore):**

```
feat(jogos,acesso): robô anda passo a passo, Histórias no leitor de tela e ordem dos campos

O robô percorre o programa casa por casa à vista da criança; em Histórias com nomes
ocultos o leitor de tela diz o objeto da figura; na concessão e no convite a data
vem logo após a área (DEV-CAT-M1, tickets 11, 14 e 17).
```

- **Homologação (2026-11-26):** H22 aprovado no reteste.
