import { BadRequestException } from "@nestjs/common";

const PADRAO_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TAMANHO_MIN = 2;
const TAMANHO_MAX = 48;

/** Segmentos de rota pública sob /f que não podem ser slug de família. */
export const SLUGS_RESERVADOS = new Set([
  "criar",
  "entrar",
  "acessar",
  "convites",
  "pessoas",
  "gerenciar-familia",
]);

export function ehSlugReservado(slug: string): boolean {
  return SLUGS_RESERVADOS.has(slug.trim().toLowerCase());
}

/** Normaliza e valida slug de família (URL /f/{slug}). */
export function normalizarSlugFamilia(valor: string): string {
  const slug = valor.trim().toLowerCase();
  if (
    slug.length < TAMANHO_MIN ||
    slug.length > TAMANHO_MAX ||
    !PADRAO_SLUG.test(slug)
  ) {
    throw new BadRequestException(
      "Endereço de família inválido. Use letras minúsculas, números e hífens.",
    );
  }
  if (ehSlugReservado(slug)) {
    throw new BadRequestException(
      "Este endereço é reservado. Escolha outro identificador.",
    );
  }
  return slug;
}

/** Sugere endereço a partir do nome familiar (sem garantir unicidade). */
export function sugerirSlugAPartirDoNome(nome: string): string {
  const base = nome
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, TAMANHO_MAX);
  if (base.length >= TAMANHO_MIN && !ehSlugReservado(base) && PADRAO_SLUG.test(base)) {
    return base;
  }
  const fallback = (base || "familia").slice(0, TAMANHO_MAX - 4);
  const candidato = `${fallback || "familia"}-1`.replace(/^-+|-+$/g, "");
  return candidato.slice(0, TAMANHO_MAX);
}

export function proximoSlugAlternativo(slugBase: string, tentativa: number): string {
  const sufixo = `-${tentativa}`;
  const corte = Math.max(TAMANHO_MIN, TAMANHO_MAX - sufixo.length);
  const raiz = slugBase.slice(0, corte).replace(/-+$/g, "") || "familia";
  return `${raiz}${sufixo}`;
}
