import type { Prisma } from "@prisma/client";

/**
 * Ficha padrão das Atividades Reais (M03 §15; DEV-CAT-M1-CONTEUDO, ticket 01).
 * Conteúdo editorial vindo só da carga oficial; personalizadas ficam sem ficha.
 */
export const FAIXAS_FICHA = ["pequenos", "medios", "grandes"] as const;
export type FaixaFicha = (typeof FAIXAS_FICHA)[number];
export type SegurancaPorFaixa = Partial<Record<FaixaFicha, string[]>>;

export const SELECT_FICHA_PADRAO = {
  passos: true,
  variacaoFacil: true,
  variacaoDificil: true,
  adaptacaoSentado: true,
  seguranca: true,
  lugar: true,
  pessoasMin: true,
  pessoasMax: true,
} as const;

type LinhaFicha = {
  passos: string[];
  variacaoFacil: string | null;
  variacaoDificil: string | null;
  adaptacaoSentado: string | null;
  seguranca: Prisma.JsonValue | null;
  lugar: string | null;
  pessoasMin: number | null;
  pessoasMax: number | null;
};

/** Lê o JSON de segurança aceitando só faixas conhecidas e listas de texto. */
function lerSeguranca(valor: Prisma.JsonValue | null): SegurancaPorFaixa | null {
  if (!valor || typeof valor !== "object" || Array.isArray(valor)) return null;
  const seguranca: SegurancaPorFaixa = {};
  for (const faixa of FAIXAS_FICHA) {
    const itens = valor[faixa];
    if (Array.isArray(itens)) {
      const textos = itens.filter((item): item is string => typeof item === "string");
      if (textos.length) seguranca[faixa] = textos;
    }
  }
  return Object.keys(seguranca).length ? seguranca : null;
}

/** Valores aceitos pelo CHECK `desafio_lugar_check` da migração da ficha padrão. */
export const LUGARES_FICHA = ["dentro_de_casa", "area_externa", "ambos"] as const;
export type LugarFicha = (typeof LUGARES_FICHA)[number];

function lerLugar(valor: string | null): LugarFicha | null {
  return (LUGARES_FICHA as readonly string[]).includes(valor ?? "") ? (valor as LugarFicha) : null;
}

export function fichaPadrao(linha: LinhaFicha) {
  return {
    passos: linha.passos,
    variacaoFacil: linha.variacaoFacil,
    variacaoDificil: linha.variacaoDificil,
    adaptacaoSentado: linha.adaptacaoSentado,
    seguranca: lerSeguranca(linha.seguranca),
    lugar: lerLugar(linha.lugar),
    pessoasMin: linha.pessoasMin,
    pessoasMax: linha.pessoasMax,
  };
}
