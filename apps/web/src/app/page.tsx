"use client";

import { Container, Title } from "@mantine/core";
import { PainelFundacao } from "@/componentes/painel-fundacao";
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
    <Container component="main" size="sm" px={0}>
      <Title order={1} mb="md">
        Nossa família
      </Title>
      <PainelFundacao />
    </Container>
  );
}
