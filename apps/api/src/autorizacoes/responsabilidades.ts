export const RESPONSABILIDADES = [
  "administrador",
  "responsavel_cuidados",
  "responsavel_desenvolvimento",
  "colaboradora_cuidados",
  "participante_limitado",
] as const;

export type Responsabilidade = (typeof RESPONSABILIDADES)[number];

export function ehResponsabilidade(
  valor: string,
): valor is Responsabilidade {
  return (RESPONSABILIDADES as readonly string[]).includes(valor);
}

export function escopoFamilia(responsabilidade: Responsabilidade): boolean {
  return responsabilidade === "administrador";
}
