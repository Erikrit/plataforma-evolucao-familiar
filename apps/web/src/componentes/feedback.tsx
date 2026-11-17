"use client";

import { Alert, Loader, Stack, Text } from "@mantine/core";

type PropsMensagem = {
  erro?: string | null;
  sucesso?: string | null;
};

const MSG_REDE =
  "Não foi possível conectar. Verifique a internet e tente de novo.";

/** Normaliza mensagens técnicas de rede/fetch para linguagem familiar (UX-ACC-01). */
export function mensagemErroAmigavel(
  erro: unknown,
  fallback = "Não foi possível concluir",
): string {
  if (!(erro instanceof Error)) return fallback;
  const texto = erro.message.trim();
  if (!texto) return fallback;
  if (
    /failed to fetch|networkerror|load failed|fetch failed|network request failed/i.test(
      texto,
    )
  ) {
    return MSG_REDE;
  }
  return texto;
}

function normalizarTextoErro(texto: string): string {
  if (
    /failed to fetch|networkerror|load failed|fetch failed|network request failed/i.test(
      texto,
    )
  ) {
    return MSG_REDE;
  }
  return texto;
}

/** Feedback local após operação: erro explícito; sucesso só quando o chamador confirmar persistência. */
export function MensagemFeedback({ erro, sucesso }: PropsMensagem) {
  if (!erro && !sucesso) return null;

  return (
    <Stack gap="xs" mt="sm" role="status" aria-live="polite">
      {erro ? (
        <Alert color="red" title="Não foi possível concluir" variant="light">
          {normalizarTextoErro(erro)}
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
