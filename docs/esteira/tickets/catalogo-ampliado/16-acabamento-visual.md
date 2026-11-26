# 16: Acabamento visual — licença discreta, ícones e peças de seleção

**O que entregar:** pedidos da homologação H18 (2026-11-26): (1) o crédito da licença em letra bem menor; (2) ícones melhores nos cartões da Biblioteca e nas figuras dos jogos (o responsável liberou propor algo novo); (3) as peças de seleção dos jogos (Escolha, Sequência, Sudoku, Histórias, Forme a palavra, Do menor ao maior) deixam de ficar espremidas e mostram a figura inteira.

**Bloqueado por:** nenhum

**Status:** IN_VALIDATION

**Costura:** typecheck, check:e5 e homologação no celular

**Risco:** baixo

## Critérios

- [ ] Crédito da licença em letra bem menor, ainda legível e com o link
- [ ] Cartões da Biblioteca com figura Twemoji grande sobre placa colorida, uma por jogo
- [ ] Peças de seleção em grade com tamanho mínimo; a figura aparece inteira a 320 px, mesmo com 10 opções

## Implementação (2026-11-26)

- Crédito da licença em 0.625rem, com o link "Ver licença".
- Cartões da Biblioteca: figura Twemoji grande sobre placa colorida (🧠 Memória, 🧭 Labirinto, 🚚 Entrega, 📖 Histórias, 🔢 Sudoku, 🔤 Forme a palavra, 📊 Do menor ao maior, 🤖 Robô); 6 SVGs novos da versão 17.0.3.
- Peças de seleção em grade (mínimo de 4.75rem por peça, quebra de linha) em Escolha, Sequência, Sudoku e Ordenação; figuras e casas do sudoku maiores. A causa do aperto era o `Group grow`, que dividia a largura igualmente.
- **Evidências:** QG-1 PASS `qg1-2026-11-26T21-35-20-669Z.json`; QG-2 PASS `qg2-2026-11-26T21-37-42-147Z.json`; fingerprint `sha256:2a67dc3e06ab7f67e63fa200d60f445a018c426a29efff45404ce8f6a017d481`. Verificador PASS.
- **PENDING_HUMAN:** H19.

**mensagemCommit (tickets 10 e 16, juntos na árvore):**

```
feat(jogos): ilustrações Twemoji, ícones novos e peças de seleção legíveis

As figuras usam os SVGs do Twemoji 17.0.3 (CC-BY 4.0) servidos pela plataforma,
com crédito discreto e link para a licença; os cartões ganham figura sobre placa
colorida e as peças de seleção passam a uma grade que não espreme a figura
(DEV-CAT-M1, tickets 10 e 16).
```
