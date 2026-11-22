"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Anchor, Button, Card, Container, Select, Stack, Text, Title } from "@mantine/core";
import { useDesenvolvimento } from "@/componentes/contexto-desenvolvimento";
import { NavegacaoBiblioteca } from "@/componentes/desenvolvimento/navegacao-biblioteca";
import { CatalogoJogosAutorizado } from "@/componentes/desenvolvimento/jogos/catalogo-jogos";
import { EstadoCarregando, EstadoVazio } from "@/componentes/feedback";
import { ROTULOS_CATEGORIA_DESENVOLVIMENTO } from "@/lib/rotulos-experiencia";
import { categoriaDosJogos, consultaCategoriaJogos, TODAS_CATEGORIAS_JOGOS } from "@/lib/filtros-jogos";

const CATEGORIAS = [
  { value: TODAS_CATEGORIAS_JOGOS, label: "Todas" },
  ...Object.entries(ROTULOS_CATEGORIA_DESENVOLVIMENTO).map(([value, label]) => ({ value, label })),
];

function ListaJogos() {
  const { caminho, nomePessoa } = useDesenvolvimento();
  const router = useRouter();
  const filtro = categoriaDosJogos(useSearchParams().get("categoria"));
  const biblioteca = caminho + "/biblioteca/jogos";
  const consulta = consultaCategoriaJogos(filtro);

  return (
    <Container size="sm" px={0}>
      <Stack gap="lg">
        <Title order={1}>Biblioteca · {nomePessoa}</Title>
        <NavegacaoBiblioteca atual="jogos" />
        <CatalogoJogosAutorizado>
          {({ jogos, destaques }) => {
            if (jogos.length === 0) return <EstadoVazio titulo="Nenhum jogo disponível" />;
            const filtrados = filtro === TODAS_CATEGORIAS_JOGOS
              ? jogos
              : jogos.filter((jogo) => jogo.categoria === filtro);
            const porId = new Map(filtrados.map((jogo) => [jogo.id, jogo]));
            const emDestaque = (destaques ?? []).map((id) => porId.get(id)).filter((jogo) => jogo !== undefined);

            return (
              <>
                <Select
                  label="Categoria"
                  allowDeselect={false}
                  value={filtro}
                  data={CATEGORIAS}
                  onChange={(valor) => router.replace(biblioteca + consultaCategoriaJogos(valor), { scroll: false })}
                />
                {emDestaque.length ? (
                  <Card withBorder padding="md">
                    <Stack gap="xs">
                      <Title order={2} size="h4">Em destaque</Title>
                      {emDestaque.map((jogo) => {
                        const concluidas = jogo.fases.filter((fase) => fase.estado === "concluida").length;
                        return (
                          <Stack key={jogo.id} gap={0} align="flex-start">
                            <Anchor
                              component={Link}
                              href={`${biblioteca}/${jogo.id}${consulta}`}
                              fw={600}
                              style={{ minHeight: 44, display: "inline-flex", alignItems: "center" }}
                            >
                              {jogo.nome}
                            </Anchor>
                            {concluidas ? (
                              <Text size="xs" c="dimmed">{concluidas} de {jogo.fases.length} fases concluídas</Text>
                            ) : null}
                          </Stack>
                        );
                      })}
                    </Stack>
                  </Card>
                ) : null}
                <Stack gap="sm">
                  <Title order={2} size="h3">Catálogo de jogos</Title>
                  {filtrados.length === 0 ? (
                    <EstadoVazio titulo="Nenhum jogo nesta categoria" descricao="Use Todas para ver o catálogo completo." />
                  ) : filtrados.map((jogo) => (
                    <Card key={jogo.id} withBorder padding="md">
                      <Stack gap="xs" align="flex-start">
                        <Title order={3} size="h4">{jogo.nome}</Title>
                        <Text size="sm" c="dimmed">{ROTULOS_CATEGORIA_DESENVOLVIMENTO[jogo.categoria]}</Text>
                        <Text size="sm">{jogo.descricao}</Text>
                        <Button component={Link} href={`${biblioteca}/${jogo.id}${consulta}`} aria-label={`Ver fases de ${jogo.nome}`}>
                          Ver fases
                        </Button>
                      </Stack>
                    </Card>
                  ))}
                </Stack>
              </>
            );
          }}
        </CatalogoJogosAutorizado>
      </Stack>
    </Container>
  );
}

export default function PaginaJogos() {
  return (
    <Suspense fallback={<EstadoCarregando rotulo="Abrindo biblioteca…" />}>
      <ListaJogos />
    </Suspense>
  );
}
