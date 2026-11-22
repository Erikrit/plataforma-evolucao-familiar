import Link from "next/link";
import { Anchor, Container, Stack, Text, Title } from "@mantine/core";

export default function PaginaNaoEncontrada() {
  return (
    <Container component="main" size="sm" py="xl" px="md">
      <Stack gap="md">
        <Title order={1}>Página não encontrada</Title>
        <Text c="dimmed" size="sm">
          Esse endereço não existe nesta aplicação.
        </Text>
        <Anchor component={Link} href="/">
          Voltar ao início
        </Anchor>
      </Stack>
    </Container>
  );
}
