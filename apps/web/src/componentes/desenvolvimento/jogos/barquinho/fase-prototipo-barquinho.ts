import type { FaseBarquinho } from "./simulacao-barquinho";

/**
 * Fase única do teste técnico do 2D (ticket 10): curvas, pedras e folhas num rio de
 * 35 linhas, com correnteza lenta (cerca de 30 s de descida). As 15 fases do jogo
 * vêm do servidor no ticket 11.
 */
export const FASE_PROTOTIPO_BARQUINHO: FaseBarquinho = {
  correnteza: 1.2,
  rio: [
    "##..B..##",
    "##.....##",
    "##..f..##",
    "##.....##",
    "##..o..##",
    "##.....##",
    "###.....#",
    "###..f..#",
    "###.o...#",
    "###.....#",
    "####....#",
    "###...o.#",
    "###.....#",
    "##.....##",
    "##.o..f##",
    "##.....##",
    "#.....###",
    "#..o..###",
    "#.....###",
    "#.f...###",
    "##.....##",
    "##..o..##",
    "##.....##",
    "##..f..##",
    "##.o.o.##",
    "##.....##",
    "###...###",
    "###.o.###",
    "###...###",
    "##.....##",
    "##..f..##",
    "##o...o##",
    "##.....##",
    "##.....##",
    "##.....##",
  ],
};
