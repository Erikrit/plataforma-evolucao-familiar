import { Container, Title } from "@mantine/core";
import { PainelFundacao } from "@/componentes/painel-fundacao";

export default function PaginaInicial() {
  return (
    <Container component="main" size="sm" px={0}>
      <Title order={1} mb="md">
        Nossa família
      </Title>
      <PainelFundacao />
    </Container>
  );
}
