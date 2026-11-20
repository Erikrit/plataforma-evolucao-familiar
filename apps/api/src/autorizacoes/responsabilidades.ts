export const RESPONSABILIDADES = [
  "administrador",
  "responsavel_cuidados",
  "responsavel_desenvolvimento",
  "colaboradora_cuidados",
  "participante_limitado",
] as const;

export type Responsabilidade = (typeof RESPONSABILIDADES)[number];

/** Perfis simples exibidos no MVP (FUN-04 / CT-20261116-001). */
export const PAPEIS_APRESENTACAO = [
  "Administrador",
  "Responsável",
  "Colaborador",
] as const;

export type PapelApresentacao = (typeof PAPEIS_APRESENTACAO)[number];

export type AreaApresentacao = "Cuidados" | "Desenvolvimento";

/**
 * Catálogo fechado concedível (ADR-014): área + rótulo ↔ responsabilidade técnica.
 * Administrador e participante_limitado ficam fora do seletor genérico.
 */
export const COMBINACOES_CONCEDIVEIS = [
  {
    area: "Cuidados" as const,
    rotulo: "Responsável" as const,
    responsabilidade: "responsavel_cuidados" as const,
  },
  {
    area: "Cuidados" as const,
    rotulo: "Integrante" as const,
    responsabilidade: "colaboradora_cuidados" as const,
  },
  {
    area: "Desenvolvimento" as const,
    rotulo: "Responsável" as const,
    responsabilidade: "responsavel_desenvolvimento" as const,
  },
] as const;

export type ResponsabilidadeConcedivel =
  (typeof COMBINACOES_CONCEDIVEIS)[number]["responsabilidade"];

export const RESPONSABILIDADES_CONCEDIVEIS = COMBINACOES_CONCEDIVEIS.map(
  (c) => c.responsabilidade,
) as ResponsabilidadeConcedivel[];

export function ehResponsabilidade(
  valor: string,
): valor is Responsabilidade {
  return (RESPONSABILIDADES as readonly string[]).includes(valor);
}

export function ehResponsabilidadeConcedivel(
  valor: string,
): valor is ResponsabilidadeConcedivel {
  return (RESPONSABILIDADES_CONCEDIVEIS as readonly string[]).includes(valor);
}

export function escopoFamilia(responsabilidade: Responsabilidade): boolean {
  return responsabilidade === "administrador";
}

export function papelApresentacao(
  responsabilidade: string,
): PapelApresentacao {
  if (responsabilidade === "administrador") return "Administrador";
  if (
    responsabilidade === "responsavel_cuidados" ||
    responsabilidade === "responsavel_desenvolvimento"
  ) {
    return "Responsável";
  }
  return "Colaborador";
}

/** Área de apresentação derivada da responsabilidade técnica (ADR-014). */
export function areaApresentacao(
  responsabilidade: string,
): AreaApresentacao | null {
  if (
    responsabilidade === "responsavel_cuidados" ||
    responsabilidade === "colaboradora_cuidados"
  ) {
    return "Cuidados";
  }
  if (responsabilidade === "responsavel_desenvolvimento") {
    return "Desenvolvimento";
  }
  return null;
}

export function combinacoesPorArea(area: AreaApresentacao) {
  return COMBINACOES_CONCEDIVEIS.filter((c) => c.area === area);
}
