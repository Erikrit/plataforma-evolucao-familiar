"use client";

import Link from "next/link";
import { Button, Group } from "@mantine/core";
import { useDesenvolvimento } from "@/componentes/contexto-desenvolvimento";

export function NavegacaoBiblioteca({ atual }: { atual: "atividades" | "jogos" }) {
  const { caminho } = useDesenvolvimento();
  const biblioteca = caminho + "/biblioteca";

  return (
    <Group component="nav" aria-label="Modalidades da Biblioteca" gap="xs">
      <Button
        component={Link} href={biblioteca}
        variant={atual === "atividades" ? "filled" : "light"}
        aria-current={atual === "atividades" ? "page" : undefined}
      >
        Atividades reais
      </Button>
      <Button
        component={Link} href={biblioteca + "/jogos"}
        variant={atual === "jogos" ? "filled" : "light"}
        aria-current={atual === "jogos" ? "page" : undefined}
      >
        Jogos digitais
      </Button>
    </Group>
  );
}
