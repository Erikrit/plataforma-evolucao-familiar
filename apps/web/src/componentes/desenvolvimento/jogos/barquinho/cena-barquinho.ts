/**
 * O que o renderizador 2D (PixiJS, ADR-018) recebe e devolve. A cena só desenha:
 * as regras ficam na simulação e o estado no controlador.
 */
import type { ControladorBarquinho } from "./controlador-barquinho";
import { ultimaLinha } from "./simulacao-barquinho";

export type CenaBarquinho = Readonly<{
  alvo: HTMLElement;
  controlador: ControladorBarquinho;
  largura: number;
  altura: number;
  /** Chamado no primeiro quadro desenhado, para medir o tempo para abrir. */
  aoPrimeiroQuadro: () => void;
}>;

export type RenderizadorBarquinho = Readonly<{ destruir: () => void }>;

export type MontarCena = (cena: CenaBarquinho) => Promise<RenderizadorBarquinho>;

export const CORES_BARQUINHO = {
  agua: 0x5aa9e6,
  aguaClara: 0x8cc8f2,
  margem: 0x6fb36f,
  margemEscura: 0x4f8f4f,
  pedra: 0x7d7d86,
  pedraClara: 0xa9a9b2,
  folha: 0x2e8b3a,
  casco: 0x8a4b22,
  vela: 0xffffff,
  contorno: 0x1b2a41,
  chegada: 0xffd23f,
} as const;

/** Medidas da cena: tamanho da célula e posição da câmera. */
export function geometria(cena: CenaBarquinho) {
  const { fase } = cena.controlador;
  const colunas = fase.rio[0].length;
  const celula = cena.largura / colunas;
  return {
    celula,
    colunas,
    alturaRio: fase.rio.length * celula,
    /** Topo visível: o barco fica no terço de cima, para a criança ver o que vem rio abaixo. */
    camera(linhaBarco: number) {
      const topo = (linhaBarco + 0.5) * celula - cena.altura / 3;
      return Math.max(0, Math.min(topo, fase.rio.length * celula - cena.altura));
    },
    ultima: ultimaLinha(fase),
  };
}
