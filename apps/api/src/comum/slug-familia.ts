import { BadRequestException } from "@nestjs/common";

const PADRAO_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TAMANHO_MIN = 2;
const TAMANHO_MAX = 48;

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
  return slug;
}
