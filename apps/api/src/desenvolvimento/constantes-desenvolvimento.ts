export const DIFICULDADES = ["simples", "media", "desafiadora"] as const;
export type Dificuldade = (typeof DIFICULDADES)[number];

export const CATEGORIAS_BIBLIOTECA = [
  "memoria_atencao",
  "raciocinio",
  "linguagem",
  "criatividade",
  "coordenacao",
  "autonomia",
  // DEV-CAT-P08: contagem, quantidades, formas e ordem.
  "numeros",
] as const;
export type CategoriaBiblioteca = (typeof CATEGORIAS_BIBLIOTECA)[number];

/** Limites E4 (Módulo 03 §12), aplicados no servidor. Teto do catálogo global: as 60 Atividades Reais do Marco 1 (M03 §15); o de 24 (E4-ACE-01) cai com o Marco 1 (DEV-CAT-P09). */
export const LIMITE_CATALOGO_ATIVO = 60;
/** DEV-CAT-P09: até cinco sugestões e cinco renovações. */
export const LIMITE_SUGESTOES_PESSOA = 5;
export const LIMITE_RENOVAR_SUGESTOES = 5;
export const LIMITE_ATIVAS_POR_CATEGORIA = 10;
export const ORIGEM_CONTEUDO_AUTORAL = "autoral_pef";

export const MENSAGEM_LIMITE_ATIVAS =
  "Você já tem 10 atividades ativas nesta categoria. Para adicionar outra, finalize ou retire uma delas.";
export const MENSAGEM_SEM_NOVAS_SUGESTOES =
  "Não há novas sugestões disponíveis por agora";

export const RESULTADOS_PARTICIPACAO = ["concluiu", "participou"] as const;
export type ResultadoParticipacao = (typeof RESULTADOS_PARTICIPACAO)[number];

/** Tabela aprovada DEV-F05 (2026-11-15). */
export const ESTRELAS_POR_DIFICULDADE: Record<
  Dificuldade,
  Record<ResultadoParticipacao, number>
> = {
  simples: { concluiu: 5, participou: 3 },
  media: { concluiu: 10, participou: 5 },
  desafiadora: { concluiu: 15, participou: 8 },
};

export function ehDificuldade(valor: string): valor is Dificuldade {
  return (DIFICULDADES as readonly string[]).includes(valor);
}

export function ehCategoriaBiblioteca(
  valor: string,
): valor is CategoriaBiblioteca {
  return (CATEGORIAS_BIBLIOTECA as readonly string[]).includes(valor);
}

export function ehResultadoParticipacao(
  valor: string,
): valor is ResultadoParticipacao {
  return (RESULTADOS_PARTICIPACAO as readonly string[]).includes(valor);
}

export function estrelasPara(
  dificuldade: Dificuldade,
  resultado: ResultadoParticipacao,
): number {
  return ESTRELAS_POR_DIFICULDADE[dificuldade][resultado];
}
