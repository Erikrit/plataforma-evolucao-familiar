import { ROTULOS_CATEGORIA_DESENVOLVIMENTO } from "./rotulos-experiencia";
import type { FaseJogoResumo } from "./api";

export const TODAS_CATEGORIAS_JOGOS = "todas";

export type FiltroFasesJogos = "todas" | "concluidas" | "pendentes";

export function categoriaDosJogos(entrada: string | null) {
  return entrada && Object.hasOwn(ROTULOS_CATEGORIA_DESENVOLVIMENTO, entrada)
    ? entrada
    : TODAS_CATEGORIAS_JOGOS;
}

export function filtroFasesDosJogos(entrada: string | null): FiltroFasesJogos {
  if (entrada === "concluidas" || entrada === "pendentes") return entrada;
  return "todas";
}

export function faseCorrespondeAoFiltro(
  fase: FaseJogoResumo,
  filtro: FiltroFasesJogos,
) {
  if (filtro === "concluidas") return fase.estado === "concluida";
  if (filtro === "pendentes") return fase.estado !== "concluida";
  return true;
}

/** Ticket 05: faixa escolhida em "Ver outras faixas"; ausente, a da pessoa. */
export function faixaDosJogos(entrada: string | null): "pequenos" | "medios" | "grandes" | "todas" | undefined {
  return entrada === "pequenos" || entrada === "medios" || entrada === "grandes" || entrada === "todas"
    ? entrada
    : undefined;
}

export function consultaCatalogoJogos(opcoes: {
  categoria?: string | null;
  fases?: string | null;
  faixa?: string | null;
}) {
  const parametros = new URLSearchParams();
  const faixa = faixaDosJogos(opcoes.faixa ?? null);
  if (faixa) parametros.set("faixa", faixa);
  const categoria = categoriaDosJogos(opcoes.categoria ?? null);
  if (categoria !== TODAS_CATEGORIAS_JOGOS) {
    parametros.set("categoria", categoria);
  }
  const fases = filtroFasesDosJogos(opcoes.fases ?? null);
  if (fases !== "todas") {
    parametros.set("fases", fases);
  }
  const texto = parametros.toString();
  return texto ? `?${texto}` : "";
}

/** @deprecated Preferir consultaCatalogoJogos — mantido para links legados. */
export function consultaCategoriaJogos(entrada: string | null) {
  return consultaCatalogoJogos({ categoria: entrada });
}
