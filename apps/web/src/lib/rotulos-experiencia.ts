import type { AutorizacaoResumo } from "@/lib/api";

/** Rótulo de experiência (FUN-04); não altera enum/contrato da API. */
export function rotuloPapelExperiencia(papel: string): string {
  if (papel === "Colaborador" || papel.toLowerCase() === "colaborador") {
    return "Integrante";
  }
  return papel;
}

export function podeGerenciarProgramacaoCuidados(
  pessoaId: string,
  autorizacoes: AutorizacaoResumo[],
): boolean {
  return autorizacoes.some(
    (a) =>
      a.responsabilidade === "responsavel_cuidados" &&
      (a.pessoaAlvoId === pessoaId || a.pessoaAlvoId == null),
  );
}

/** Espelha `podeRegistrarRelatoCuidados` do backend (própria pessoa, responsável ou integrante). */
export function podeRegistrarRelatoCuidados(
  pessoaId: string,
  usuarioPessoaId: string | null | undefined,
  autorizacoes: AutorizacaoResumo[],
): boolean {
  if (usuarioPessoaId && usuarioPessoaId === pessoaId) return true;
  return autorizacoes.some(
    (a) =>
      (a.responsabilidade === "responsavel_cuidados" ||
        a.responsabilidade === "colaboradora_cuidados") &&
      (a.pessoaAlvoId === pessoaId || a.pessoaAlvoId == null),
  );
}

/** Espelha `podeOrganizarConsultasExames` (= responsável de cuidados). */
export function podeOrganizarConsultasExames(
  pessoaId: string,
  autorizacoes: AutorizacaoResumo[],
): boolean {
  return podeGerenciarProgramacaoCuidados(pessoaId, autorizacoes);
}

/** Espelha `podeConsultarAnexosCuidados` (própria pessoa ou responsável). */
export function podeVerAnexosCuidados(
  pessoaId: string,
  usuarioPessoaId: string | null | undefined,
  autorizacoes: AutorizacaoResumo[],
): boolean {
  if (usuarioPessoaId && usuarioPessoaId === pessoaId) return true;
  return podeGerenciarProgramacaoCuidados(pessoaId, autorizacoes);
}

/**
 * Espelha `podeVerDesenvolvimento` do backend (própria pessoa ou
 * responsavel_desenvolvimento).
 */
export function podeAcompanharDesenvolvimento(
  pessoaId: string,
  usuarioPessoaId: string | null | undefined,
  autorizacoes: AutorizacaoResumo[],
): boolean {
  if (usuarioPessoaId && usuarioPessoaId === pessoaId) return true;
  return autorizacoes.some(
    (a) =>
      a.responsabilidade === "responsavel_desenvolvimento" &&
      (a.pessoaAlvoId === pessoaId || a.pessoaAlvoId == null),
  );
}

/** Códigos de `CATEGORIAS_BIBLIOTECA` da API com rótulos de experiência. */
export const ROTULOS_CATEGORIA_DESENVOLVIMENTO: Record<string, string> = {
  raciocinio: "Raciocínio lógico",
  coordenacao: "Coordenação motora",
  memoria_atencao: "Memória e atenção",
  linguagem: "Linguagem",
  criatividade: "Criatividade",
  autonomia: "Autonomia",
};

/**
 * Espelha a organização do backend (sugerir/escolher/retirar/cadastros):
 * exige `responsavel_desenvolvimento` — não basta ser a própria pessoa.
 */
export function podeOrganizarDesenvolvimento(
  pessoaId: string,
  _usuarioPessoaId: string | null | undefined,
  autorizacoes: AutorizacaoResumo[],
): boolean {
  return autorizacoes.some(
    (a) =>
      a.responsabilidade === "responsavel_desenvolvimento" &&
      (a.pessoaAlvoId === pessoaId || a.pessoaAlvoId == null),
  );
}
