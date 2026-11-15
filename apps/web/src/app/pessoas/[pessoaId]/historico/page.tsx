"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Anchor,
  Button,
  Card,
  Container,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { obterHistorico, obterMe } from "@/lib/api";
import {
  EstadoCarregando,
  EstadoVazio,
  MensagemFeedback,
} from "@/componentes/feedback";

type Evento = {
  tipo: string;
  quando: string;
  resumo: string;
  origemId: string;
};

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

export default function PaginaHistorico() {
  const params = useParams<{ pessoaId: string }>();
  const router = useRouter();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [autenticado, setAutenticado] = useState(false);

  useEffect(() => {
    void (async () => {
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
        const dados = await obterHistorico(params.pessoaId);
        setEventos(dados.eventos);
      } catch (e) {
        setErro(e instanceof Error ? e.message : "Não foi possível carregar o histórico");
      } finally {
        setCarregando(false);
      }
    })();
  }, [params.pessoaId]);

  const ordenados = useMemo(
    () =>
      [...eventos].sort(
        (a, b) => new Date(b.quando).getTime() - new Date(a.quando).getTime(),
      ),
    [eventos],
  );

  return (
    <Container component="main" size="sm" py="lg" px="md" className="cuidados-mobile">
      <Stack gap="lg">
        <GroupLinks pessoaId={params.pessoaId} />

        <Stack gap={4}>
          <Title order={1}>Histórico</Title>
          <Text c="dimmed" size="sm">
            Acontecimentos registrados, do mais recente ao mais antigo.
          </Text>
        </Stack>

        {carregando ? <EstadoCarregando rotulo="Carregando histórico…" /> : null}
        <MensagemFeedback erro={erro} />

        {!autenticado && !carregando ? (
          <Button variant="light" onClick={() => router.push("/")}>
            Ir para entrar
          </Button>
        ) : null}

        {!carregando && autenticado && ordenados.length === 0 ? (
          <EstadoVazio
            titulo="Nenhum acontecimento ainda"
            descricao="Quando houver relatos, consultas ou apoios, eles aparecem aqui."
          />
        ) : null}

        {autenticado ? (
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
                </Text>
                <Text fw={600}>{rotuloTipo(e.tipo)}</Text>
                <Text size="sm">{e.resumo}</Text>
              </Card>
            ))}
          </Stack>
        ) : null}
      </Stack>
    </Container>
  );
}

function GroupLinks({ pessoaId }: { pessoaId: string }) {
  return (
    <Stack gap={4}>
      <Anchor component={Link} href={`/pessoas/${pessoaId}`} size="sm">
        ← Perfil
      </Anchor>
      <Anchor component={Link} href={`/pessoas/${pessoaId}/cuidados`} size="sm">
        Ver cuidados
      </Anchor>
    </Stack>
  );
}
