import type { FaseJogoResumo } from "./api";

/** Trilhas dos jogos (DEV-CAT-P03), na ordem em que aparecem em Escolher fase. */
const NOMES_TRILHA: Record<FaseJogoResumo["trilha"], string> = {
  pequenos: "Pequenos",
  medios: "Médios",
  grandes: "Grandes",
};

export type GrupoTrilha<T extends Pick<FaseJogoResumo, "trilha">> = {
  trilha: FaseJogoResumo["trilha"];
  nome: string;
  fases: T[];
};

/** Agrupa as fases por trilha, preservando a ordem recebida da API. */
export function agruparPorTrilha<T extends Pick<FaseJogoResumo, "trilha">>(
  fases: readonly T[],
): GrupoTrilha<T>[] {
  const grupos: GrupoTrilha<T>[] = [];
  for (const fase of fases) {
    let grupo = grupos.find((item) => item.trilha === fase.trilha);
    if (!grupo) {
      grupo = { trilha: fase.trilha, nome: NOMES_TRILHA[fase.trilha], fases: [] };
      grupos.push(grupo);
    }
    grupo.fases.push(fase);
  }
  return grupos;
}
