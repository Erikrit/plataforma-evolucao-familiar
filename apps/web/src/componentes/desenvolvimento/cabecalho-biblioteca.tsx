"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Group, Stack, Text, Title } from "@mantine/core";
import { useDesenvolvimento } from "@/componentes/contexto-desenvolvimento";
import { obterEstrelas } from "@/lib/api";

type Props = {
  /** Incrementar após participação confirmada para atualizar o saldo. */
  atualizacaoSaldo?: number;
};

export function CabecalhoBiblioteca({ atualizacaoSaldo = 0 }: Props) {
  const { pessoaId, nomePessoa } = useDesenvolvimento();
  const [saldo, setSaldo] = useState<number | null>(null);
  const [carregando, setCarregando] = useState(true);
  const pessoaCarregada = useRef<string | null>(null);

  const carregar = useCallback(async (id: string) => {
    setCarregando(true);
    if (pessoaCarregada.current !== id) {
      setSaldo(null);
      pessoaCarregada.current = id;
    }
    try {
      const resumo = await obterEstrelas(id);
      if (pessoaCarregada.current === id) {
        setSaldo(resumo.saldoDisponivel);
      }
    } catch {
      if (pessoaCarregada.current === id) {
        setSaldo(null);
      }
    } finally {
      if (pessoaCarregada.current === id) {
        setCarregando(false);
      }
    }
  }, []);

  useEffect(() => {
    void carregar(pessoaId);
  }, [pessoaId, atualizacaoSaldo, carregar]);

  const rotuloSaldo =
    saldo == null
      ? "Carregando estrelas disponíveis"
      : `${saldo} ${saldo === 1 ? "estrela disponível" : "estrelas disponíveis"}`;

  return (
    <Group justify="space-between" align="flex-start" wrap="nowrap" gap="sm">
      <Title order={1} style={{ flex: "1 1 auto", minWidth: 0 }}>
        Biblioteca · {nomePessoa}
      </Title>
      <Stack
        gap={0}
        align="center"
        aria-busy={carregando || saldo == null}
        aria-live="polite"
        style={{ flex: "0 0 auto" }}
      >
        <Group
          gap={4}
          wrap="nowrap"
          aria-label={rotuloSaldo}
          title={rotuloSaldo}
        >
          <IconeEstrela />
          <Text
            component="span"
            fw={700}
            size="lg"
            c="azul"
            style={{ fontVariantNumeric: "tabular-nums", minWidth: "1.5ch" }}
          >
            {saldo == null ? "—" : saldo}
          </Text>
        </Group>
      </Stack>
    </Group>
  );
}

function IconeEstrela() {
  return (
    <svg
      width={22}
      height={22}
      viewBox="0 0 24 24"
      aria-hidden
      focusable="false"
    >
      <path
        fill="#E6A817"
        d="M12 2.5 14.9 9l6.9.6-5.2 4.4 1.6 6.7L12 17.8 5.8 20.7l1.6-6.7L2.2 9.6 9.1 9 12 2.5z"
      />
    </svg>
  );
}
