/**
 * Regras do Caminho de cores (DEV-CAT-M1-CONTEUDO, ticket 05), sem interface: testadas no check:e5.
 *
 * Só se pisa na cor indicada (a azul, v verde, m amarelo, r vermelho). Letra maiúscula é casa de
 * troca: sempre pode ser pisada e muda a cor indicada. I partida, F chegada, # parede.
 * Cada cor tem nome e símbolo, para não depender só de enxergar a cor (E5-ACE-10).
 */

import type { ConteudoCores, PosicaoLabirinto } from "@/lib/api";

export type CorCaminho = ConteudoCores["cor"];
export type Posicao = Readonly<PosicaoLabirinto>;

export const CORES_CAMINHO: Record<CorCaminho, Readonly<{ nome: string; simbolo: string }>> = {
  a: { nome: "azul", simbolo: "●" },
  v: { nome: "verde", simbolo: "▲" },
  m: { nome: "amarelo", simbolo: "■" },
  r: { nome: "vermelho", simbolo: "♦" },
};

export const DIRECOES_CORES = [
  { id: "cima", tecla: "ArrowUp", nome: "cima", icone: "↑", linha: -1, coluna: 0 },
  { id: "esquerda", tecla: "ArrowLeft", nome: "a esquerda", icone: "←", linha: 0, coluna: -1 },
  { id: "baixo", tecla: "ArrowDown", nome: "baixo", icone: "↓", linha: 1, coluna: 0 },
  { id: "direita", tecla: "ArrowRight", nome: "a direita", icone: "→", linha: 0, coluna: 1 },
] as const;
export type DirecaoCores = (typeof DIRECOES_CORES)[number];

export function ehCor(valor: string | undefined): valor is CorCaminho {
  return valor === "a" || valor === "v" || valor === "m" || valor === "r";
}

/** Casa de troca (letra maiúscula de uma cor). */
export function ehTroca(casa: string | undefined) {
  return casa != null && casa !== casa.toLowerCase() && ehCor(casa.toLowerCase());
}

/** Cor da casa (de troca ou comum), ou null para partida, chegada e parede. */
export function corDaCasa(casa: string | undefined): CorCaminho | null {
  const minuscula = casa?.toLowerCase();
  return ehCor(minuscula) ? minuscula : null;
}

/** Cor indicada depois de pisar na casa, ou null se não pode pisar nela. */
export function pisar(mapa: readonly string[], posicao: Posicao, cor: CorCaminho): CorCaminho | null {
  const casa = mapa[posicao.linha]?.[posicao.coluna];
  if (casa == null || casa === "#") return null;
  if (casa === "I" || casa === "F") return cor;
  if (ehTroca(casa)) return casa.toLowerCase() as CorCaminho;
  return casa === cor ? cor : null;
}

export function andar(posicao: Posicao, direcao: DirecaoCores): Posicao {
  return { linha: posicao.linha + direcao.linha, coluna: posicao.coluna + direcao.coluna };
}

/** Primeira direção do menor caminho até a chegada, pelo par (casa, cor); null se não houver. */
export function dicaCores(mapa: readonly string[], origem: Posicao, cor: CorCaminho): DirecaoCores | null {
  type No = { posicao: Posicao; cor: CorCaminho; primeira: DirecaoCores | null };
  const chave = (p: Posicao, c: CorCaminho) => `${p.linha}/${p.coluna}/${c}`;
  const fila: No[] = [{ posicao: origem, cor, primeira: null }];
  const vistos = new Set([chave(origem, cor)]);
  for (let i = 0; i < fila.length; i += 1) {
    const no = fila[i];
    if (mapa[no.posicao.linha]?.[no.posicao.coluna] === "F") return no.primeira;
    for (const direcao of DIRECOES_CORES) {
      const destino = andar(no.posicao, direcao);
      const proxima = pisar(mapa, destino, no.cor);
      if (proxima == null || vistos.has(chave(destino, proxima))) continue;
      vistos.add(chave(destino, proxima));
      fila.push({ posicao: destino, cor: proxima, primeira: no.primeira ?? direcao });
    }
  }
  return null;
}

function nomeDaCasa(casa: string | undefined) {
  if (casa == null || casa === "#") return "parede";
  if (casa === "F") return "chegada";
  if (casa === "I") return "partida";
  const cor = corDaCasa(casa);
  if (!cor) return "parede";
  return ehTroca(casa) ? `troca para ${CORES_CAMINHO[cor].nome}` : CORES_CAMINHO[cor].nome;
}

/** O que há em volta, em texto, para o leitor de tela. */
export function descreverArredores(mapa: readonly string[], posicao: Posicao) {
  return DIRECOES_CORES.map((direcao) => {
    const destino = andar(posicao, direcao);
    return `${direcao.nome}: ${nomeDaCasa(mapa[destino.linha]?.[destino.coluna])}`;
  }).join("; ");
}
