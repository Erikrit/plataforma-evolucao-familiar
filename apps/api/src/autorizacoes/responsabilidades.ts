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

export function ehResponsabilidade(
  valor: string,
): valor is Responsabilidade {
  return (RESPONSABILIDADES as readonly string[]).includes(valor);
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
