"use client";

import Link from "next/link";
import { Button, Container, Stack, Title } from "@mantine/core";
import { useDesenvolvimento } from "@/componentes/contexto-desenvolvimento";

export default function PaginaDesenvolvimento() {
  const { caminho, nomePessoa } = useDesenvolvimento();

  return (
    <Container size="sm" px={0}>
      <Stack align="flex-start" gap="lg">
        <Title order={1}>Desenvolvimento · {nomePessoa}</Title>
        <Button component={Link} href={caminho + "/biblioteca"}>
          Ver biblioteca
        </Button>
      </Stack>
    </Container>
  );
}
