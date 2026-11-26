"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import {
  Button,
  Card,
  Container,
  Drawer,
  Progress,
  SegmentedControl,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useDesenvolvimento } from "@/componentes/contexto-desenvolvimento";
import { CabecalhoBiblioteca } from "@/componentes/desenvolvimento/cabecalho-biblioteca";
import { IconeJogoCatalogo } from "@/componentes/desenvolvimento/icone-jogo-catalogo";
import { NavegacaoBiblioteca } from "@/componentes/desenvolvimento/navegacao-biblioteca";
import { CatalogoJogosAutorizado } from "@/componentes/desenvolvimento/jogos/catalogo-jogos";
import estilosJogos from "@/componentes/desenvolvimento/jogos/jogos.module.css";
import { EstadoCarregando, EstadoVazio } from "@/componentes/feedback";
import { coresPef } from "@/tema/mantine";
import type { FaseJogoResumo, JogoResumo } from "@/lib/api";
import { agruparPorTrilha } from "@/lib/trilhas-jogos";
import {
  jogoComTodasFasesConcluidas,
  nomeCurtoJogo,
  primeiraFasePendente,
} from "@/lib/catalogo-visual-jogos";
import { ROTULOS_CATEGORIA_DESENVOLVIMENTO } from "@/lib/rotulos-experiencia";
import {
  categoriaDosJogos,
  consultaCatalogoJogos,
  faseCorrespondeAoFiltro,
  filtroFasesDosJogos,
  TODAS_CATEGORIAS_JOGOS,
  type FiltroFasesJogos,
  faixaDosJogos,
} from "@/lib/filtros-jogos";

const CATEGORIAS = [
  { value: TODAS_CATEGORIAS_JOGOS, label: "Todas" },
  ...Object.entries(ROTULOS_CATEGORIA_DESENVOLVIMENTO).map(([value, label]) => ({
    value,
    label,
  })),
];

/** Ticket 05 (D1, 2026-11-26). */
const OPCOES_FAIXA = [
  { value: "pequenos", label: "Pequenos (5 a 6 anos)" },
  { value: "medios", label: "Médios (7 a 9 anos)" },
  { value: "grandes", label: "Grandes (10 a 12 anos)" },
  { value: "todas", label: "Todas as faixas" },
];

const ROTULOS_FASE: Record<FaseJogoResumo["estado"], string> = {
  nao_explorada: "Não explorada",
  experimentada: "Experimentada",
  concluida: "Concluída",
};

function IconeEstadoFase({ estado }: { estado: FaseJogoResumo["estado"] }) {
  const comum = {
    width: 14,
    height: 14,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className: estilosJogos.iconeEstadoFase,
  };

  if (estado === "concluida") {
    return (
      <svg {...comum}>
        <path d="M20 6 9 17l-5-5" />
      </svg>
    );
  }
  if (estado === "experimentada") {
    return (
      <svg {...comum}>
        <circle cx="12" cy="12" r="7" />
        <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  return (
    <svg {...comum}>
      <circle cx="12" cy="12" r="7" />
    </svg>
  );
}

function fasesVisiveis(jogo: JogoResumo, filtro: FiltroFasesJogos) {
  return jogo.fases.filter((fase) => faseCorrespondeAoFiltro(fase, filtro));
}

function ItemCatalogoJogo({
  jogo,
  consulta,
  biblioteca,
}: {
  jogo: JogoResumo;
  consulta: string;
  biblioteca: string;
}) {
  const router = useRouter();
  const ehCelular = useMediaQuery("(max-width: 47.99em)", true);
  const [escolhaAberta, setEscolhaAberta] = useState(false);
  const concluidas = jogo.fases.filter((fase) => fase.estado === "concluida")
    .length;
  const total = jogo.fases.length;
  const completo = jogoComTodasFasesConcluidas(jogo.fases);
  const pendente = primeiraFasePendente(jogo.fases);
  const nomeCurto = nomeCurtoJogo(jogo.id, jogo.nome);
  const percentual = total > 0 ? (concluidas / total) * 100 : 0;
  const trilhas = agruparPorTrilha(jogo.fases);

  function aoTocarIcone() {
    if (completo || pendente == null) {
      setEscolhaAberta(true);
      return;
    }
    router.push(
      `${biblioteca}/${jogo.id}/fases/${pendente}/jogar${consulta}`,
    );
  }

  return (
    <Stack gap={6} className={estilosJogos.itemCatalogo}>
      <UnstyledButton
        type="button"
        className={estilosJogos.miniaturaJogo}
        aria-label={jogo.nome}
        onClick={aoTocarIcone}
      >
        <span className={estilosJogos.miniaturaIcone}>
          <IconeJogoCatalogo jogoId={jogo.id} />
        </span>
        <Text
          component="span"
          size="xs"
          fw={600}
          ta="center"
          lineClamp={2}
          className={estilosJogos.miniaturaNome}
        >
          {nomeCurto}
        </Text>
      </UnstyledButton>
      <Text size="xs" c="dimmed" ta="center" aria-live="polite">
        {concluidas} de {total}
      </Text>
      <Progress
        value={percentual}
        size="sm"
        radius="xl"
        aria-label={`${concluidas} de ${total} fases concluídas`}
        styles={{
          root: { backgroundColor: "#E6F6EA" },
          section: { backgroundColor: "#8FD6A0" },
        }}
      />
      <Button
        type="button"
        variant="light"
        size="compact-sm"
        fullWidth
        style={{ minHeight: 40 }}
        onClick={() => setEscolhaAberta(true)}
      >
        Escolher fase
      </Button>

      <Drawer
        opened={escolhaAberta}
        onClose={() => setEscolhaAberta(false)}
        position={ehCelular ? "bottom" : "right"}
        title={jogo.nome}
        padding="md"
        size={ehCelular ? "auto" : "md"}
      >
        <Stack gap="sm">
          <Text size="sm" c="dimmed">
            {concluidas} de {total} fases concluídas
          </Text>
          {trilhas.map((grupo) => (
            <Stack key={grupo.trilha} gap={6}>
              {trilhas.length > 1 ? (
                <Title order={3} size="sm" id={`trilha-${jogo.id}-${grupo.trilha}`}>
                  {grupo.nome}
                </Title>
              ) : null}
              <div
                role="list"
                aria-labelledby={
                  trilhas.length > 1 ? `trilha-${jogo.id}-${grupo.trilha}` : undefined
                }
                className={estilosJogos.seletorFases}
                style={{
                  gridTemplateColumns: `repeat(${Math.min(grupo.fases.length, 5)}, minmax(0, 1fr))`,
                }}
              >
                {grupo.fases.map((fase) => {
                  const rotuloEstado = ROTULOS_FASE[fase.estado];
                  return (
                    <UnstyledButton
                      key={fase.numero}
                      type="button"
                      role="listitem"
                      component={Link}
                      href={`${biblioteca}/${jogo.id}/fases/${fase.numero}/jogar${consulta}`}
                      aria-label={`Fase ${fase.numero}, ${fase.titulo}, ${rotuloEstado}`}
                      className={estilosJogos.opcaoFase}
                      data-estado={fase.estado}
                    >
                      <IconeEstadoFase estado={fase.estado} />
                      <span className={estilosJogos.numeroFase}>{fase.numero}</span>
                      <span className={estilosJogos.rotuloEstadoFase}>
                        {rotuloEstado}
                      </span>
                    </UnstyledButton>
                  );
                })}
              </div>
            </Stack>
          ))}
        </Stack>
      </Drawer>
    </Stack>
  );
}

function ListaJogos() {
  const { caminho } = useDesenvolvimento();
  const router = useRouter();
  const busca = useSearchParams();
  const filtroCategoria = categoriaDosJogos(busca.get("categoria"));
  const filtroFases = filtroFasesDosJogos(busca.get("fases"));
  const filtroFaixa = faixaDosJogos(busca.get("faixa"));
  const biblioteca = caminho + "/biblioteca/jogos";
  const consulta = consultaCatalogoJogos({
    categoria: filtroCategoria,
    fases: filtroFases,
    faixa: filtroFaixa,
  });

  function atualizarConsulta(parcial: {
    categoria?: string;
    fases?: string;
    faixa?: string;
  }) {
    router.replace(
      biblioteca +
        consultaCatalogoJogos({
          categoria: parcial.categoria ?? filtroCategoria,
          fases: parcial.fases ?? filtroFases,
          faixa: parcial.faixa ?? filtroFaixa,
        }),
      { scroll: false },
    );
  }

  return (
    <Container size="sm" px={0}>
      <Stack gap="lg">
        <CabecalhoBiblioteca />
        <NavegacaoBiblioteca atual="jogos" />
        <CatalogoJogosAutorizado faixa={filtroFaixa}>
          {({ jogos, destaques, faixa, faixaPadrao }) => {
            if (jogos.length === 0) {
              return <EstadoVazio titulo="Nenhum jogo disponível" />;
            }

            const porCategoria =
              filtroCategoria === TODAS_CATEGORIAS_JOGOS
                ? jogos
                : jogos.filter((jogo) => jogo.categoria === filtroCategoria);
            const filtrados = porCategoria.filter(
              (jogo) => fasesVisiveis(jogo, filtroFases).length > 0,
            );
            const porId = new Map(porCategoria.map((jogo) => [jogo.id, jogo]));
            const emDestaque = (destaques ?? [])
              .map((id) => porId.get(id))
              .filter((jogo): jogo is JogoResumo => jogo !== undefined);

            return (
              <Stack gap="md">
                {faixaPadrao ? (
                  <Select
                    label="Ver outras faixas"
                    description={
                      faixa === faixaPadrao
                        ? "Mostrando a faixa desta pessoa. Escolha outra para ver mais jogos."
                        : "Ver outras faixas: a faixa desta pessoa continua marcada como padrão."
                    }
                    allowDeselect={false}
                    value={faixa}
                    data={OPCOES_FAIXA.map((opcao) => ({
                      ...opcao,
                      label: opcao.value === faixaPadrao ? `${opcao.label} (desta pessoa)` : opcao.label,
                    }))}
                    onChange={(valor) => atualizarConsulta({ faixa: valor ?? faixaPadrao })}
                  />
                ) : null}
                <Select
                  label="Categoria"
                  allowDeselect={false}
                  value={filtroCategoria}
                  data={CATEGORIAS}
                  onChange={(valor) =>
                    atualizarConsulta({
                      categoria: valor ?? TODAS_CATEGORIAS_JOGOS,
                    })
                  }
                />
                <SegmentedControl
                  fullWidth
                  value={filtroFases}
                  onChange={(valor) =>
                    atualizarConsulta({ fases: valor })
                  }
                  data={[
                    { label: "Todas", value: "todas" },
                    { label: "Concluídas", value: "concluidas" },
                    { label: "Não concluídas", value: "pendentes" },
                  ]}
                  aria-label="Filtro de fases"
                />
                {emDestaque.length ? (
                  <Card
                    withBorder
                    padding="md"
                    radius="md"
                    style={{
                      background: `linear-gradient(180deg, ${coresPef.primariaSuave}, #F8FBFF)`,
                      borderColor: "#C9D8F2",
                    }}
                  >
                    <Stack gap="xs">
                      <Title order={2} size="h4">
                        Em destaque
                      </Title>
                      {emDestaque.map((jogo) => {
                        const concluidas = jogo.fases.filter(
                          (fase) => fase.estado === "concluida",
                        ).length;
                        return (
                          <Text key={jogo.id} size="sm">
                            <Text span fw={600}>
                              {jogo.nome}
                            </Text>
                            {" · "}
                            {concluidas} de {jogo.fases.length} fases
                          </Text>
                        );
                      })}
                    </Stack>
                  </Card>
                ) : null}
                {filtrados.length === 0 ? (
                  <EstadoVazio
                    titulo="Nenhum jogo neste filtro"
                    descricao="Ajuste a categoria ou o filtro de fases."
                  />
                ) : (
                  <SimpleGrid
                    cols={4}
                    spacing={{ base: 8, sm: "md" }}
                    verticalSpacing="md"
                    className={estilosJogos.gradeCatalogo}
                  >
                    {filtrados.map((jogo) => (
                      <ItemCatalogoJogo
                        key={jogo.id}
                        jogo={jogo}
                        consulta={consulta}
                        biblioteca={biblioteca}
                      />
                    ))}
                  </SimpleGrid>
                )}
              </Stack>
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
