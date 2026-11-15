export const SITUACOES_DOSE = [
  "tomou_conforme_informacao",
  "informou_nao_tomou",
] as const;

export type SituacaoDose = (typeof SITUACOES_DOSE)[number];

export const STATUS_MEDICAMENTO = [
  "rascunho",
  "ativo",
  "suspenso",
  "encerrado",
] as const;

export type StatusMedicamento = (typeof STATUS_MEDICAMENTO)[number];

export function ehSituacaoDose(valor: string): valor is SituacaoDose {
  return (SITUACOES_DOSE as readonly string[]).includes(valor);
}

export function chaveOcorrencia(
  medicamentoId: string,
  dataIso: string,
  horario: string,
): string {
  return `${medicamentoId}|${dataIso}|${horario}`;
}
