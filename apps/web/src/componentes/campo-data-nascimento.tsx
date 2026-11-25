"use client";

import { TextInput } from "@mantine/core";

/** Código devolvido pela API quando Desenvolvimento exige a data (M01 §16). */
export const CODIGO_DATA_NASCIMENTO_OBRIGATORIA = "DATA_NASCIMENTO_OBRIGATORIA";

function hojeIso() {
  const agora = new Date();
  const local = new Date(agora.getTime() - agora.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

/** Campo nativo de data: no celular abre o seletor do próprio aparelho. */
export function CampoDataNascimento({
  nomePessoa,
  valor,
  aoMudar,
  disabled,
}: {
  nomePessoa: string;
  valor: string;
  aoMudar: (valor: string) => void;
  disabled?: boolean;
}) {
  return (
    <TextInput
      type="date"
      label={`Data de nascimento de ${nomePessoa}`}
      description="Usada para mostrar jogos e brincadeiras da faixa de idade."
      value={valor}
      max={hojeIso()}
      min="1900-01-01"
      required
      disabled={disabled}
      onChange={(evento) => aoMudar(evento.currentTarget.value)}
    />
  );
}
