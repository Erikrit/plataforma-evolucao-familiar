"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Anchor, Button, Card, Container, Group, Stack, Text, Title } from "@mantine/core";
import { useDesenvolvimento } from "@/componentes/contexto-desenvolvimento";
import { CatalogoJogosAutorizado } from "@/componentes/desenvolvimento/jogos/catalogo-jogos";
import { EstadoCarregando, EstadoVazio } from "@/componentes/feedback";
import type { FaseJogoResumo } from "@/lib/api";
import { consultaCategoriaJogos } from "@/lib/filtros-jogos";

const ROTULOS_FASE: Record<FaseJogoResumo["estado"], string> = {
  nao_explorada: "Não explorada",
  experimentada: "Experimentada",
  concluida: "Concluída",
};

function DetalheJogo() {
  const { jogoId } = useParams<{ jogoId: string }>();
  const { caminho } = useDesenvolvimento();
  const biblioteca = caminho + "/biblioteca/jogos";
  const consulta = consultaCategoriaJogos(useSearchParams().get("categoria"));

  return (
    <Container size="sm" px={0}>
      <Stack gap="lg">
        <Anchor component={Link} href={biblioteca + consulta} size="sm">Voltar para Jogos digitais</Anchor>
        <CatalogoJogosAutorizado>
          {({ jogos }) => {
            const jogo = jogos.find((item) => item.id === jogoId);
            if (!jogo) return <EstadoVazio titulo="Jogo indisponível" />;

            return (
              <Stack gap="md">
                <Title order={1}>{jogo.nome}</Title>
                <Text>{jogo.instrucoes}</Text>
                <Title order={2} size="h4">Escolha uma fase</Title>
                {jogo.fases.map((fase) => (
                  <Card key={fase.numero} withBorder padding="md">
                    <Stack gap="xs" align="flex-start">
                      <Group justify="space-between" align="baseline" w="100%">
                        <Title order={3} size="h5">Fase {fase.numero} · {fase.titulo}</Title>
                        <Text size="sm" c="dimmed">{ROTULOS_FASE[fase.estado]}</Text>
                      </Group>
                      <Text size="sm">{fase.objetivo}</Text>
                      <Button
                        component={Link}
                        href={`${biblioteca}/${jogo.id}/fases/${fase.numero}/jogar${consulta}`}
                        aria-label={`Jogar fase ${fase.numero}`}
                        variant="light"
                      >
                        Jogar
                      </Button>
                    </Stack>
                  </Card>
                ))}
              </Stack>
            );
          }}
        </CatalogoJogosAutorizado>
      </Stack>
    </Container>
  );
}

export default function PaginaJogo() {
  return (
    <Suspense fallback={<EstadoCarregando rotulo="Abrindo jogo…" />}>
      <DetalheJogo />
    </Suspense>
  );
}
