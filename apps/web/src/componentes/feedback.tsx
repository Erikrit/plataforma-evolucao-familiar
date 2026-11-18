"use client";

import { useEffect, useState } from "react";
import { Alert, CloseButton, Group, Loader, Stack, Text } from "@mantine/core";

type PropsMensagem = {
  erro?: string | null;
  sucesso?: string | null;
  /** Duração do sucesso transitório em ms (padrão 4s). Erros não expiram sozinhos. */
  duracaoSucessoMs?: number;
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

/**
 * Feedback local após operação (UX-HOM-04):
 * sucesso transitório e dispensável; erro crítico permanece até resolução ou dispensa.
 */
export function MensagemFeedback({
  erro,
  sucesso,
  duracaoSucessoMs = 4000,
}: PropsMensagem) {
  const [sucessoVisivel, setSucessoVisivel] = useState<string | null>(null);
  const [erroDispensado, setErroDispensado] = useState(false);

  useEffect(() => {
    setErroDispensado(false);
  }, [erro]);

  useEffect(() => {
    if (!sucesso) {
      setSucessoVisivel(null);
      return;
    }
    setSucessoVisivel(sucesso);
    const timer = window.setTimeout(() => {
      setSucessoVisivel(null);
    }, duracaoSucessoMs);
    return () => window.clearTimeout(timer);
  }, [sucesso, duracaoSucessoMs]);

  const erroAtivo = erro && !erroDispensado ? erro : null;
  if (!erroAtivo && !sucessoVisivel) return null;

  return (
    <Stack gap="xs" mt="sm">
      {erroAtivo ? (
        <Alert
          color="red"
          title="Não foi possível concluir"
          variant="light"
          role="alert"
          aria-live="assertive"
          withCloseButton={false}
        >
          <Group justify="space-between" align="flex-start" wrap="nowrap" gap="sm">
            <Text size="sm" style={{ flex: 1 }}>
              {normalizarTextoErro(erroAtivo)}
            </Text>
            <CloseButton
              aria-label="Dispensar aviso de erro"
              onClick={() => setErroDispensado(true)}
            />
          </Group>
        </Alert>
      ) : null}
      {sucessoVisivel ? (
        <Alert
          color="azul"
          title="Pronto"
          variant="light"
          role="status"
          aria-live="polite"
          withCloseButton={false}
        >
          <Group justify="space-between" align="flex-start" wrap="nowrap" gap="sm">
            <Text size="sm" style={{ flex: 1 }}>
              {sucessoVisivel}
            </Text>
            <CloseButton
              aria-label="Dispensar confirmação"
              onClick={() => setSucessoVisivel(null)}
            />
          </Group>
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
