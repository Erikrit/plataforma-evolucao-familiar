import { Container, Text, Title } from "@mantine/core";
import { PainelFundacao } from "@/componentes/painel-fundacao";

export default function PaginaInicial() {
  return (
    <Container component="main" size="sm" px={0}>
      <Title order={1}>Nossa família</Title>
      <Text c="dimmed" mb="md">
        Pessoas que você pode acompanhar, com acesso conforme sua autorização.
      </Text>
      <PainelFundacao />
    </Container>
  );
}
