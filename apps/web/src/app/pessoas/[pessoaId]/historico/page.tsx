"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Anchor,
  Button,
  Card,
  Container,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  obterHistorico,
  obterMe,
  type EventoHistorico,
} from "@/lib/api";
import {
  EstadoCarregando,
  EstadoVazio,
  MensagemFeedback,
} from "@/componentes/feedback";

const rotulosTipo: Record<string, string> = {
  dose: "Medicamento",
  registro_dose: "Medicamento",
  correcao_dose: "Correção de relato",
  medicamento: "Medicamento",
  consulta: "Consulta",
  exame: "Exame",
  atividade_apoio: "Apoio",
  apoio: "Apoio",
  programacao: "Programação",
  encerramento: "Encerramento",
  suspensao: "Suspensão",
  anexo: "Documento",
  participacao: "Brincadeira",
  correcao_participacao: "Correção de brincadeira",
  resgate_recompensa: "Resgate",
};

function rotuloTipo(tipo: string) {
  return rotulosTipo[tipo] ?? tipo.replaceAll("_", " ");
}

function formatarQuando(iso: string) {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return iso;
  return data.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

type DominioFiltro = "todos" | "cuidados" | "desenvolvimento";

export default function PaginaHistorico() {
  const params = useParams<{ pessoaId: string }>();
  const router = useRouter();
  const [eventos, setEventos] = useState<EventoHistorico[]>([]);
  const [dominios, setDominios] = useState<{
    cuidados: boolean;
    desenvolvimento: boolean;
  } | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [autenticado, setAutenticado] = useState(false);
  const [dominio, setDominio] = useState<DominioFiltro>("todos");
  const [de, setDe] = useState("");
  const [ate, setAte] = useState("");

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const me = await obterMe();
      if (!me) {
        setAutenticado(false);
        setErro("Entre na página inicial para ver o histórico.");
        return;
      }
      setAutenticado(true);
      const dados = await obterHistorico(params.pessoaId, {
        de: de || undefined,
        ate: ate || undefined,
        dominio: dominio === "todos" ? undefined : dominio,
      });
      setEventos(dados.eventos);
      setDominios(dados.dominios ?? null);
    } catch (e) {
      setErro(
        e instanceof Error ? e.message : "Não foi possível carregar o histórico",
      );
      setEventos([]);
    } finally {
      setCarregando(false);
    }
  }, [params.pessoaId, de, ate, dominio]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const ordenados = useMemo(
    () =>
      [...eventos].sort(
        (a, b) => new Date(b.quando).getTime() - new Date(a.quando).getTime(),
      ),
    [eventos],
  );

  const opcoesDominio = useMemo(() => {
    const ops: { label: string; value: DominioFiltro }[] = [
      { label: "Todos", value: "todos" },
    ];
    if (!dominios || dominios.cuidados) {
      ops.push({ label: "Cuidados", value: "cuidados" });
    }
    if (!dominios || dominios.desenvolvimento) {
      ops.push({ label: "Brincadeiras", value: "desenvolvimento" });
    }
    return ops;
  }, [dominios]);

  const podeVer =
    autenticado && !carregando && !erro?.startsWith("Acesso");

  return (
    <Container
      component="main"
      size="sm"
      py="lg"
      px="md"
      className="cuidados-mobile"
    >
      <Stack gap="lg">
        <Stack gap={4}>
          <Anchor component={Link} href={`/pessoas/${params.pessoaId}`} size="sm">
            ← Perfil
          </Anchor>
          {dominios?.cuidados ? (
            <Anchor
              component={Link}
              href={`/pessoas/${params.pessoaId}/cuidados`}
              size="sm"
            >
              Ver cuidados
            </Anchor>
          ) : null}
          {dominios?.desenvolvimento ? (
            <Anchor
              component={Link}
              href={`/pessoas/${params.pessoaId}/desenvolvimento`}
              size="sm"
            >
              Ver desenvolvimento
            </Anchor>
          ) : null}
        </Stack>

        <Stack gap={4}>
          <Title order={1}>Histórico</Title>
          <Text c="dimmed" size="sm">
            Linha do tempo a partir dos registros já feitos — sem cadastro
            extra.
          </Text>
        </Stack>

        {carregando ? <EstadoCarregando rotulo="Carregando histórico…" /> : null}
        <MensagemFeedback erro={erro} />

        {!autenticado && !carregando ? (
          <Button variant="light" onClick={() => router.push("/")}>
            Ir para entrar
          </Button>
        ) : null}

        {podeVer ? (
          <Stack gap="md">
            {opcoesDominio.length > 2 ? (
              <SegmentedControl
                fullWidth
                value={dominio}
                onChange={(v) => setDominio(v as DominioFiltro)}
                data={opcoesDominio}
              />
            ) : null}

            <Stack gap="xs">
              <Text size="sm" fw={600}>
                Período (opcional)
              </Text>
              <TextInput
                type="date"
                label="De"
                value={de}
                onChange={(e) => setDe(e.currentTarget.value)}
              />
              <TextInput
                type="date"
                label="Até"
                value={ate}
                onChange={(e) => setAte(e.currentTarget.value)}
              />
              {(de || ate) && (
                <Button
                  variant="subtle"
                  size="compact-sm"
                  onClick={() => {
                    setDe("");
                    setAte("");
                  }}
                >
                  Limpar período
                </Button>
              )}
            </Stack>

            {ordenados.length === 0 ? (
              <EstadoVazio
                titulo="Nenhum acontecimento neste período"
                descricao="Quando houver relatos ou brincadeiras registradas, eles aparecem aqui — sem cobrança."
              />
            ) : (
              <Stack gap="sm">
                {ordenados.map((e) => (
                  <Card
                    key={`${e.tipo}-${e.origemId}-${e.quando}`}
                    withBorder
                    padding="md"
                    radius="md"
                  >
                    <Text size="sm" c="dimmed">
                      {formatarQuando(e.quando)}
                      {e.dominio === "desenvolvimento"
                        ? " · Brincadeiras"
                        : e.dominio === "cuidados"
                          ? " · Cuidados"
                          : ""}
                    </Text>
                    <Text fw={600}>{rotuloTipo(e.tipo)}</Text>
                    <Text size="sm">{e.resumo}</Text>
                  </Card>
                ))}
              </Stack>
            )}
          </Stack>
        ) : null}
      </Stack>
    </Container>
  );
}
