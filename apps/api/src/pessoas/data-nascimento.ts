import { BadRequestException } from "@nestjs/common";

/** M01 §16 / DEV-CAT-P05: Desenvolvimento exige data de nascimento da pessoa acompanhada. */
export const CODIGO_DATA_NASCIMENTO_OBRIGATORIA = "DATA_NASCIMENTO_OBRIGATORIA";
export const RESPONSABILIDADE_DESENVOLVIMENTO = "responsavel_desenvolvimento";

const ANO_MINIMO = 1900;

/** Converte "AAAA-MM-DD" em data UTC válida, não futura e não anterior a 1900. */
export function validarDataNascimento(valor: unknown, agora: Date = new Date()): Date {
  if (typeof valor !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(valor.trim())) {
    throw new BadRequestException("Data de nascimento inválida. Informe dia, mês e ano.");
  }
  const texto = valor.trim();
  const data = new Date(`${texto}T00:00:00.000Z`);
  if (Number.isNaN(data.getTime()) || data.toISOString().slice(0, 10) !== texto) {
    throw new BadRequestException("Data de nascimento inválida. Informe dia, mês e ano.");
  }
  if (data.getTime() > agora.getTime()) {
    throw new BadRequestException("A data de nascimento não pode estar no futuro.");
  }
  if (data.getUTCFullYear() < ANO_MINIMO) {
    throw new BadRequestException("Confira o ano da data de nascimento.");
  }
  return data;
}

/**
 * Resolve a data a gravar quando Desenvolvimento é concedido.
 * Retorna `null` se a pessoa já tem data; a data validada se foi informada;
 * caso contrário, recusa com código estável para a interface pedir a data.
 */
export function resolverDataParaDesenvolvimento(
  pessoa: { nome: string; dataNascimento: Date | null },
  informada: unknown,
): Date | null {
  if (pessoa.dataNascimento) return null;
  if (informada == null || informada === "") {
    throw new BadRequestException({
      statusCode: 400,
      message: `Informe a data de nascimento de ${pessoa.nome} para liberar Desenvolvimento.`,
      codigo: CODIGO_DATA_NASCIMENTO_OBRIGATORIA,
    });
  }
  return validarDataNascimento(informada);
}
