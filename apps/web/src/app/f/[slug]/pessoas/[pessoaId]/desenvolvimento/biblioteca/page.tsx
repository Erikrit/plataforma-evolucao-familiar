"use client";

import { Suspense } from "react";
import { Container, Stack, Title } from "@mantine/core";
import { useDesenvolvimento } from "@/componentes/contexto-desenvolvimento";
import { BibliotecaAtividades } from "@/componentes/desenvolvimento/biblioteca-atividades";
import { NavegacaoBiblioteca } from "@/componentes/desenvolvimento/navegacao-biblioteca";
import { EstadoCarregando } from "@/componentes/feedback";

export default function PaginaBiblioteca() {
  const { nomePessoa } = useDesenvolvimento();

  return (
    <Container size="sm" px={0}>
      <Stack gap="lg">
        <Title order={1}>Biblioteca · {nomePessoa}</Title>
        <NavegacaoBiblioteca atual="atividades" />
        <Suspense fallback={<EstadoCarregando rotulo="Abrindo biblioteca…" />}>
          <BibliotecaAtividades />
        </Suspense>
      </Stack>
    </Container>
  );
}
