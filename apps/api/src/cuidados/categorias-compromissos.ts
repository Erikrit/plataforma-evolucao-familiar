/** Categorias fixas de consulta (CUI-F05 / UX-01). */
export const CATEGORIAS_CONSULTA = [
  "clinica_geral",
  "cardiologia",
  "oftalmologia",
  "odontologia",
  "outro",
] as const;

export type CategoriaConsulta = (typeof CATEGORIAS_CONSULTA)[number];

export const ROTULOS_CATEGORIA_CONSULTA: Record<CategoriaConsulta, string> = {
  clinica_geral: "Clínica geral",
  cardiologia: "Cardiologia",
  oftalmologia: "Oftalmologia",
  odontologia: "Odontologia",
  outro: "Outro",
};

/** Categorias fixas de exame (CUI-F06 / UX-01). */
export const CATEGORIAS_EXAME = [
  "sangue",
  "urina",
  "imagem",
  "cardiaco",
  "outro",
] as const;

export type CategoriaExame = (typeof CATEGORIAS_EXAME)[number];

export const ROTULOS_CATEGORIA_EXAME: Record<CategoriaExame, string> = {
  sangue: "Sangue",
  urina: "Urina",
  imagem: "Imagem",
  cardiaco: "Cardíaco",
  outro: "Outro",
};

export function ehCategoriaConsulta(
  valor: string | null | undefined,
): valor is CategoriaConsulta {
  return (
    typeof valor === "string" &&
    (CATEGORIAS_CONSULTA as readonly string[]).includes(valor)
  );
}

export function ehCategoriaExame(
  valor: string | null | undefined,
): valor is CategoriaExame {
  return (
    typeof valor === "string" &&
    (CATEGORIAS_EXAME as readonly string[]).includes(valor)
  );
}

/** Título legível; preserva texto de registros sem categoria. */
export function tituloConsulta(registro: {
  categoria?: string | null;
  especialidadeOuDescricao?: string | null;
}): string {
  const complemento = (registro.especialidadeOuDescricao ?? "").trim();
  if (ehCategoriaConsulta(registro.categoria)) {
    const rotulo = ROTULOS_CATEGORIA_CONSULTA[registro.categoria];
    return complemento ? `${rotulo} — ${complemento}` : rotulo;
  }
  return complemento || "Consulta";
}

export function tituloExame(registro: {
  categoria?: string | null;
  descricao?: string | null;
}): string {
  const complemento = (registro.descricao ?? "").trim();
  if (ehCategoriaExame(registro.categoria)) {
    const rotulo = ROTULOS_CATEGORIA_EXAME[registro.categoria];
    return complemento ? `${rotulo} — ${complemento}` : rotulo;
  }
  return complemento || "Exame";
}
