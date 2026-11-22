"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Container,
  Progress,
  SegmentedControl,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { useDesenvolvimento } from "@/componentes/contexto-desenvolvimento";
import { NavegacaoBiblioteca } from "@/componentes/desenvolvimento/navegacao-biblioteca";
import { CatalogoJogosAutorizado } from "@/componentes/desenvolvimento/jogos/catalogo-jogos";
import estilosJogos from "@/componentes/desenvolvimento/jogos/jogos.module.css";
import { EstadoCarregando, EstadoVazio } from "@/componentes/feedback";
import { coresPef } from "@/tema/mantine";
import type { FaseJogoResumo, JogoResumo } from "@/lib/api";
import { ROTULOS_CATEGORIA_DESENVOLVIMENTO } from "@/lib/rotulos-experiencia";
import {
  categoriaDosJogos,
  consultaCatalogoJogos,
  faseCorrespondeAoFiltro,
  filtroFasesDosJogos,
  TODAS_CATEGORIAS_JOGOS,
  type FiltroFasesJogos,
} from "@/lib/filtros-jogos";

const CATEGORIAS = [
  { value: TODAS_CATEGORIAS_JOGOS, label: "Todas" },
  ...Object.entries(ROTULOS_CATEGORIA_DESENVOLVIMENTO).map(([value, label]) => ({
    value,
    label,
  })),
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

function faseInicial(fases: FaseJogoResumo[]) {
  return (
    fases.find((fase) => fase.estado !== "concluida")?.numero ??
    fases[0]?.numero ??
    null
  );
}

function BarraProgressoFases({
  concluidas,
  total,
}: {
  concluidas: number;
  total: number;
}) {
  const percentual = total > 0 ? (concluidas / total) * 100 : 0;
  const rotulo = `${concluidas} de ${total} fases concluídas`;
  return (
    <Stack gap={4} className={estilosJogos.barraProgressoJogo}>
      <Progress
        value={percentual}
        size="md"
        radius="xl"
        aria-label={`Progresso do jogo: ${rotulo}`}
        styles={{
          root: { backgroundColor: "#E6F6EA" },
          section: { backgroundColor: "#8FD6A0" },
        }}
      />
      <Text size="xs" c="dimmed">
        {concluidas} de {total}
      </Text>
    </Stack>
  );
}

function SeletorFases({
  jogoNome,
  fases,
  faseNumero,
  onChange,
}: {
  jogoNome: string;
  fases: FaseJogoResumo[];
  faseNumero: number;
  onChange: (numero: number) => void;
}) {
  return (
    <Stack gap={6}>
      <Text size="sm" fw={500} component="span" id={`rotulo-fases-${jogoNome}`}>
        Fase
      </Text>
      <div
        role="radiogroup"
        aria-labelledby={`rotulo-fases-${jogoNome}`}
        className={estilosJogos.seletorFases}
        style={{
          gridTemplateColumns: `repeat(${Math.min(fases.length, 5)}, minmax(0, 1fr))`,
        }}
      >
        {fases.map((fase) => {
          const selecionada = fase.numero === faseNumero;
          const rotuloEstado = ROTULOS_FASE[fase.estado];
          return (
            <UnstyledButton
              key={fase.numero}
              type="button"
              role="radio"
              aria-checked={selecionada}
              aria-label={`Fase ${fase.numero}, ${fase.titulo}, ${rotuloEstado}`}
              className={estilosJogos.opcaoFase}
              data-selecionada={selecionada}
              data-estado={fase.estado}
              onClick={() => onChange(fase.numero)}
            >
              <IconeEstadoFase estado={fase.estado} />
              <span className={estilosJogos.numeroFase}>{fase.numero}</span>
              <span className={estilosJogos.rotuloEstadoFase}>{rotuloEstado}</span>
            </UnstyledButton>
          );
        })}
      </div>
    </Stack>
  );
}

function CartaoJogo({
  jogo,
  filtroFases,
  consulta,
  biblioteca,
}: {
  jogo: JogoResumo;
  filtroFases: FiltroFasesJogos;
  consulta: string;
  biblioteca: string;
}) {
  const fases = useMemo(
    () => fasesVisiveis(jogo, filtroFases),
    [jogo, filtroFases],
  );
  const [faseNumero, setFaseNumero] = useState<number | null>(() =>
    faseInicial(fases),
  );

  useEffect(() => {
    setFaseNumero(faseInicial(fases));
  }, [fases]);

  const concluidas = jogo.fases.filter((fase) => fase.estado === "concluida")
    .length;

  if (!fases.length || faseNumero == null) {
    return null;
  }

  return (
    <Card withBorder padding="md" radius="md" bg={coresPef.superficie}>
      <Stack gap="sm" align="stretch">
        <Stack gap={4}>
          <Title order={3} size="h4">
            {jogo.nome}
          </Title>
          <Badge variant="light" color="azul" w="fit-content">
            {ROTULOS_CATEGORIA_DESENVOLVIMENTO[
              jogo.categoria as keyof typeof ROTULOS_CATEGORIA_DESENVOLVIMENTO
            ] ?? jogo.categoria}
          </Badge>
          <BarraProgressoFases
            concluidas={concluidas}
            total={jogo.fases.length}
          />
          <Text size="sm">{jogo.descricao}</Text>
        </Stack>
        <SeletorFases
          jogoNome={jogo.id}
          fases={fases}
          faseNumero={faseNumero}
          onChange={setFaseNumero}
        />
        <Button
          component={Link}
          href={`${biblioteca}/${jogo.id}/fases/${faseNumero}/jogar${consulta}`}
          aria-label={`Jogar ${jogo.nome}, fase ${faseNumero}`}
        >
          Jogar
        </Button>
      </Stack>
    </Card>
  );
}

function ListaJogos() {
  const { caminho, nomePessoa } = useDesenvolvimento();
  const router = useRouter();
  const busca = useSearchParams();
  const filtroCategoria = categoriaDosJogos(busca.get("categoria"));
  const filtroFases = filtroFasesDosJogos(busca.get("fases"));
  const biblioteca = caminho + "/biblioteca/jogos";
  const consulta = consultaCatalogoJogos({
    categoria: filtroCategoria,
    fases: filtroFases,
  });

  function atualizarConsulta(parcial: {
    categoria?: string;
    fases?: string;
  }) {
    router.replace(
      biblioteca +
        consultaCatalogoJogos({
          categoria: parcial.categoria ?? filtroCategoria,
          fases: parcial.fases ?? filtroFases,
        }),
      { scroll: false },
    );
  }

  return (
    <Container size="md" px={0}>
      <Stack gap="lg">
        <Stack gap={4}>
          <Title order={1}>Jogos digitais</Title>
          <Text c="dimmed" size="sm">
            Biblioteca · {nomePessoa}. Escolha a fase e jogue. Ajuda fica na
            partida.
          </Text>
        </Stack>
        <NavegacaoBiblioteca atual="jogos" />
        <CatalogoJogosAutorizado>
          {({ jogos, destaques }) => {
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
                  <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                    {filtrados.map((jogo) => (
                      <CartaoJogo
                        key={jogo.id}
                        jogo={jogo}
                        filtroFases={filtroFases}
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
