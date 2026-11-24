"use client";

import { Suspense, useState } from "react";
import { Container, Stack } from "@mantine/core";
import { BibliotecaAtividades } from "@/componentes/desenvolvimento/biblioteca-atividades";
import { CabecalhoBiblioteca } from "@/componentes/desenvolvimento/cabecalho-biblioteca";
import { NavegacaoBiblioteca } from "@/componentes/desenvolvimento/navegacao-biblioteca";
import { EstadoCarregando } from "@/componentes/feedback";

export default function PaginaBiblioteca() {
  const [atualizacaoSaldo, setAtualizacaoSaldo] = useState(0);

  return (
    <Container size="sm" px={0}>
      <Stack gap="lg">
        <CabecalhoBiblioteca atualizacaoSaldo={atualizacaoSaldo} />
        <NavegacaoBiblioteca atual="atividades" />
        <Suspense fallback={<EstadoCarregando rotulo="Abrindo biblioteca…" />}>
          <BibliotecaAtividades
            aoSaldoAlterado={() => setAtualizacaoSaldo((n) => n + 1)}
          />
        </Suspense>
      </Stack>
    </Container>
  );
}
