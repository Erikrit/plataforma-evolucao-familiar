import { BadRequestException } from "@nestjs/common";

/**
 * Faixas etárias dos jogos (DEV-CAT-P02/P04; D1 decidida em 2026-11-26):
 * Pequenos 5–6, Médios 7–9 e Grandes 10–12. A faixa orienta a oferta e não
 * representa capacidade; "Ver outras faixas" abre as demais.
 */
export const FAIXAS = ["pequenos", "medios", "grandes"] as const;
export type Faixa = (typeof FAIXAS)[number];
export type FaixaPedida = Faixa | "todas";

/** Idade em anos completos na data `hoje` (datas em UTC, como a data de nascimento gravada). */
export function idadeEm(nascimento: Date, hoje: Date): number {
  let idade = hoje.getUTCFullYear() - nascimento.getUTCFullYear();
  const antesDoAniversario =
    hoje.getUTCMonth() < nascimento.getUTCMonth()
    || (hoje.getUTCMonth() === nascimento.getUTCMonth() && hoje.getUTCDate() < nascimento.getUTCDate());
  if (antesDoAniversario) idade -= 1;
  return idade;
}

/** Faixa padrão pela data de nascimento; sem data, não há faixa (catálogo completo). */
export function faixaPadrao(nascimento: Date | null, hoje: Date = new Date()): Faixa | null {
  if (!nascimento) return null;
  const idade = idadeEm(nascimento, hoje);
  if (idade <= 6) return "pequenos";
  if (idade <= 9) return "medios";
  return "grandes";
}

/** Valida a faixa pedida pela consulta; ausente devolve `undefined` (usa a padrão). */
export function lerFaixaPedida(valor: unknown): FaixaPedida | undefined {
  if (valor == null || valor === "") return undefined;
  if (valor === "todas" || (FAIXAS as readonly unknown[]).includes(valor)) return valor as FaixaPedida;
  throw new BadRequestException("Faixa inválida. Use pequenos, medios, grandes ou todas.");
}
