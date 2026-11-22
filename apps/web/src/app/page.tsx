"use client";

import { Container } from "@mantine/core";
import { BoasVindasFamilia } from "@/componentes/boas-vindas-familia";
import { RedirecionarRotaLegada } from "@/componentes/redirecionar-rota-legada";
import { useSessao } from "@/componentes/contexto-sessao";
import { EstadoCarregando } from "@/componentes/feedback";

export default function PaginaInicial() {
  const { pronto, usuario } = useSessao();

  if (!pronto) {
    return (
      <Container component="main" size="sm" px={0}>
        <EstadoCarregando rotulo="Verificando sessão…" />
      </Container>
    );
  }

  if (usuario?.familia?.slug) {
    return <RedirecionarRotaLegada />;
  }

  return (
    <Container component="main" size="sm" px={0} py="md">
      <BoasVindasFamilia />
    </Container>
  );
}
