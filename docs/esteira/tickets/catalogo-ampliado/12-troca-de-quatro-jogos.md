# 12: Troca de quatro jogos fáceis por jogos novos

**O que entregar:** Ache o intruso, Complete a sequência, Pares de sombras e Palavra e figura saem da Biblioteca (arquivados, conquistas preservadas no Histórico). Entram, com 15 fases em três trilhas aprovadas pela régua: **Sudoku de figuras** (Raciocínio; motor novo, grade 4×4 a 6×6), **Forme a palavra** (Linguagem; ordenar letras), **Do menor ao maior** (Números; ordenar números) e **Robô com setas** (Raciocínio; planejar as setas antes de o robô andar). Pedido do responsável em 2026-11-26 na homologação do ticket 09 ("muito fáceis"), conjunto "Desafio misto" escolhido por ele. Sudoku de figuras, Do menor ao maior e Robô com setas estão na proposta do M03 §15; Forme a palavra é escolha nova de Linguagem, no lugar de Letra inicial e Adivinha pela pista.

**Bloqueado por:** 09

**Status:** COMPLETED

**Costura:** régua (test:regua), check:e5, carga oficial e smoke:e5

**Risco:** medio

## Critérios

- [x] DEV-CAT-P01 — os quatro jogos novos têm regra e objetivo distintos dos demais e 15 fases aprovadas pela régua
- [x] E5-ACE-12 — jogos arquivados somem da Biblioteca e as conquistas continuam no Histórico e no Resumo
- [x] Régua de qualidade (Solução) — cada sudoku tem solução única; cada ordenação tem uma só ordem
- [x] E5-HOM — homologação no celular pelas três faixas (PASS, responsável, 2026-11-26)

## Implementação (2026-11-26)

- Motores novos `sudoku` e `robo`; tabuleiros `tabuleiro-sudoku.tsx` e `tabuleiro-robo.tsx`; Forme a palavra e Do menor ao maior usam a ordenação (peças de letra e número); os 4 jogos antigos ficam com `ativo: false`. Verificador PASS após FAIL corrigido (palavras com figura errada, texto de peças, fila sem limite, teste de jogo arquivado).
- **Evidências:** QG-1 PASS `qg1-2026-11-26T17-08-05-400Z.json`; QG-2 PASS (build, authz, carga-trilhas com 12 jogos e 180 fases, smoke-e5 com jogos novos e conquista de jogo arquivado, smoke-e4, histórico) `qg2-2026-11-26T17-10-46-774Z.json`; régua estrita 12 jogos, 0 falhas; fingerprint `sha256:94895ba3563d051fd050e278367d78798b80612f5d65fe39bb1fd04743530b4f`.
- **PENDING_HUMAN:** E5-HOM (H13).

- **Homologação (2026-11-26):** aprovada pelo responsável; commit `33af7ea`.
