"use client";

import { Alert, Loader, Stack, Text } from "@mantine/core";

type PropsMensagem = {
  erro?: string | null;
  sucesso?: string | null;
};

/** Feedback local após operação: erro explícito; sucesso só quando o chamador confirmar persistência. */
export function MensagemFeedback({ erro, sucesso }: PropsMensagem) {
  if (!erro && !sucesso) return null;

  return (
    <Stack gap="xs" mt="sm" role="status" aria-live="polite">
      {erro ? (
        <Alert color="red" title="Não foi possível concluir" variant="light">
          {erro}
        </Alert>
      ) : null}
      {sucesso ? (
        <Alert color="azul" title="Pronto" variant="light">
          {sucesso}
        </Alert>
      ) : null}
    </Stack>
  );
}

export function EstadoCarregando({
  rotulo = "Carregando…",
}: {
  rotulo?: string;
}) {
  return (
    <Stack align="center" gap="sm" py="xl" role="status" aria-live="polite">
      <Loader color="azul" size="md" />
      <Text c="dimmed" size="sm">
        {rotulo}
      </Text>
    </Stack>
  );
}

export function EstadoVazio({
  titulo,
  descricao,
}: {
  titulo: string;
  descricao?: string;
}) {
  return (
    <Alert color="azul" title={titulo} variant="light">
      {descricao ? <Text size="sm">{descricao}</Text> : null}
    </Alert>
  );
}
