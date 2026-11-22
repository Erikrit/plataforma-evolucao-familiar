import { ROTULOS_CATEGORIA_DESENVOLVIMENTO } from "./rotulos-experiencia";

export const TODAS_CATEGORIAS_JOGOS = "todas";

export function categoriaDosJogos(entrada: string | null) {
  return entrada && Object.hasOwn(ROTULOS_CATEGORIA_DESENVOLVIMENTO, entrada)
    ? entrada
    : TODAS_CATEGORIAS_JOGOS;
}

export function consultaCategoriaJogos(entrada: string | null) {
  const categoria = categoriaDosJogos(entrada);
  return categoria === TODAS_CATEGORIAS_JOGOS ? "" : `?categoria=${encodeURIComponent(categoria)}`;
}
