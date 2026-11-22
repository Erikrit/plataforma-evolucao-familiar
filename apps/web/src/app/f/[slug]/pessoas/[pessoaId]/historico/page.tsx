"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { rotaFamilia } from "@/lib/rotas-familia";
import {
  Button,
  Collapse,
  Container,
  Group,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
  Title,
  UnstyledButton,
} from "@mantine/core";
import {
  obterHistorico,
  obterMe,
  obterPessoa,
  type EventoHistorico,
} from "@/lib/api";
import {
  EstadoCarregando,
  EstadoVazio,
  MensagemFeedback,
} from "@/componentes/feedback";
import { MarcadorEventoHistorico } from "@/componentes/icones-experiencia";

const rotulosTipo: Record<string, string> = {
  dose: "Medicamento",
  registro_dose: "Medicamento",
  correcao_dose: "Correção de relato",
  medicamento: "Medicamento",
  consulta: "Consulta",
  exame: "Exame",
  atividade_apoio: "Observação",
  apoio: "Observação",
  programacao: "Programação",
  encerramento: "Encerramento",
  suspensao: "Suspensão",
  anexo: "Documento",
  participacao: "Brincadeira",
  correcao_participacao: "Correção de brincadeira",
  resgate_recompensa: "Resgate",
};

type DominioFiltro = "todos" | "cuidados" | "desenvolvimento";
type PresetPeriodo = "7" | "30" | "personalizado";

function rotuloTipo(tipo: string) {
  return rotulosTipo[tipo] ?? tipo.replaceAll("_", " ");
}

function formatarHorario(iso: string) {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return "";
  return data.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function chaveDia(iso: string) {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return iso.slice(0, 10);
  const y = data.getFullYear();
  const m = String(data.getMonth() + 1).padStart(2, "0");
  const d = String(data.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function rotuloDia(chave: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(chave);
  if (!m) return chave;
  const data = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return data.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

function isoHoje() {
  const hoje = new Date();
  const y = hoje.getFullYear();
  const m = String(hoje.getMonth() + 1).padStart(2, "0");
  const d = String(hoje.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isoDiasAtras(dias: number) {
  const data = new Date();
  data.setDate(data.getDate() - dias);
  const y = data.getFullYear();
  const m = String(data.getMonth() + 1).padStart(2, "0");
  const d = String(data.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function ItemHistorico({ evento }: { evento: EventoHistorico }) {
  const [aberto, setAberto] = useState(false);
  const temDetalhe = Boolean(evento.detalhe) || evento.versaoAtiva === false;
  return (
    <Stack
      gap={4}
      p="sm"
      style={{
        borderBottom: "1px solid var(--mantine-color-gray-2)",
      }}
    >
      <Group align="flex-start" gap="sm" wrap="nowrap">
        <MarcadorEventoHistorico tipo={evento.tipo} />
        <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
          <Group justify="space-between" gap="xs" wrap="nowrap">
            <Text size="sm" fw={600}>
              {rotuloTipo(evento.tipo)}
            </Text>
            <Text size="xs" c="dimmed">
              {formatarHorario(evento.quando)}
            </Text>
          </Group>
          <Text size="sm">{evento.resumo}</Text>
          {evento.versaoAtiva === false ? (
            <Text size="xs" c="orange">
              Relato substituído por correção posterior.
            </Text>
          ) : null}
          {temDetalhe ? (
            <UnstyledButton
              onClick={() => setAberto((v) => !v)}
              aria-expanded={aberto}
            >
              <Text size="xs" c="dimmed" td="underline">
                {aberto ? "Ocultar detalhes" : "Ver detalhes"}
              </Text>
            </UnstyledButton>
          ) : null}
          <Collapse in={aberto}>
            {evento.detalhe ? (
              <Text size="sm" c="dimmed">
                {evento.detalhe}
              </Text>
            ) : null}
          </Collapse>
        </Stack>
      </Group>
    </Stack>
  );
}

export default function PaginaHistorico() {
  const params = useParams<{ slug: string; pessoaId: string }>();
  const router = useRouter();
  const [nomePessoa, setNomePessoa] = useState("");
  const [eventos, setEventos] = useState<EventoHistorico[]>([]);
  const [dominios, setDominios] = useState<{
    cuidados: boolean;
    desenvolvimento: boolean;
  } | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [acessoNegado, setAcessoNegado] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [autenticado, setAutenticado] = useState(false);
  const [dominio, setDominio] = useState<DominioFiltro>("todos");
  const [preset, setPreset] = useState<PresetPeriodo>("7");
  const [de, setDe] = useState(isoDiasAtras(7));
  const [ate, setAte] = useState(isoHoje());
  const pedidoRef = useRef(0);

  const aplicarPreset = useCallback((valor: PresetPeriodo) => {
    setPreset(valor);
    if (valor === "7") {
      setDe(isoDiasAtras(7));
      setAte(isoHoje());
    } else if (valor === "30") {
      setDe(isoDiasAtras(30));
      setAte(isoHoje());
    }
  }, []);

  const carregar = useCallback(async () => {
    const pedido = ++pedidoRef.current;
    setCarregando(true);
    setErro(null);
    setAcessoNegado(false);
    try {
      const me = await obterMe();
      if (pedido !== pedidoRef.current) return;
      if (!me) {
        setAutenticado(false);
        setErro("Entre na página inicial para ver o histórico.");
        setEventos([]);
        return;
      }
      setAutenticado(true);
      const perfil = (await obterPessoa(
        me.pessoa.familiaId,
        params.pessoaId,
      )) as { nome: string };
      if (pedido !== pedidoRef.current) return;
      setNomePessoa(perfil.nome);

      const dados = await obterHistorico(params.pessoaId, {
        de: de || undefined,
        ate: ate || undefined,
        dominio: dominio === "todos" ? undefined : dominio,
      });
      if (pedido !== pedidoRef.current) return;
      setEventos(dados.eventos);
      setDominios(dados.dominios ?? null);
    } catch (e) {
      if (pedido !== pedidoRef.current) return;
      const mensagem =
        e instanceof Error ? e.message : "Não foi possível carregar o histórico";
      setAcessoNegado(
        mensagem === "Acesso negado ao histórico." ||
          mensagem === "Acesso negado a esta pessoa.",
      );
      setErro(mensagem);
      setEventos([]);
    } finally {
      if (pedido === pedidoRef.current) setCarregando(false);
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

  const grupos = useMemo(() => {
    const mapa = new Map<string, EventoHistorico[]>();
    for (const e of ordenados) {
      const chave = chaveDia(e.quando);
      const lista = mapa.get(chave) ?? [];
      lista.push(e);
      mapa.set(chave, lista);
    }
    return [...mapa.entries()];
  }, [ordenados]);

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

  const podeVer = autenticado && !carregando && !acessoNegado && !erro;

  return (
    <Container
      component="main"
      size="sm"
      px={0}
      className="cuidados-mobile"
    >
      <Stack gap="lg">
        <Stack gap={4}>
          <Title order={1}>
            Histórico{nomePessoa ? ` · ${nomePessoa}` : ""}
          </Title>
          <Text c="dimmed" size="sm">
            Acontecimentos do período, dos mais recentes aos mais antigos.
          </Text>
        </Stack>

        {carregando ? <EstadoCarregando rotulo="Carregando histórico…" /> : null}
        <MensagemFeedback erro={erro} />

        {!autenticado && !carregando ? (
          <Button variant="light" onClick={() => router.push(rotaFamilia(String(params.slug ?? ""), "/entrar"))}>
            Ir para entrar
          </Button>
        ) : null}

        {autenticado && !acessoNegado ? (
          <Stack gap="md">
            <SegmentedControl
              fullWidth
              size="xs"
              value={preset}
              onChange={(v) => aplicarPreset(v as PresetPeriodo)}
              data={[
                { label: "Últimos 7 dias", value: "7" },
                { label: "Últimos 30 dias", value: "30" },
                { label: "Personalizado", value: "personalizado" },
              ]}
            />

            {preset === "personalizado" ? (
              <Group grow align="flex-end">
                <TextInput
                  type="date"
                  label="De"
                  value={de}
                  onChange={(e) => {
                    setPreset("personalizado");
                    setDe(e.currentTarget.value);
                  }}
                />
                <TextInput
                  type="date"
                  label="Até"
                  value={ate}
                  onChange={(e) => {
                    setPreset("personalizado");
                    setAte(e.currentTarget.value);
                  }}
                />
              </Group>
            ) : null}

            {opcoesDominio.length > 2 ? (
              <SegmentedControl
                fullWidth
                value={dominio}
                onChange={(v) => setDominio(v as DominioFiltro)}
                data={opcoesDominio}
              />
            ) : null}

            {podeVer && grupos.length === 0 ? (
              <EstadoVazio
                titulo="Nenhum acontecimento neste período"
                descricao="Quando houver relatos ou brincadeiras registradas, eles aparecem aqui."
              />
            ) : null}

            {podeVer
              ? grupos.map(([dia, itens]) => (
                  <Stack key={dia} gap={0}>
                    <Text size="sm" fw={700} px="sm" pt="xs">
                      {rotuloDia(dia)}
                    </Text>
                    {itens.map((e) => (
                      <ItemHistorico
                        key={`${e.tipo}-${e.origemId}-${e.quando}`}
                        evento={e}
                      />
                    ))}
                  </Stack>
                ))
              : null}
          </Stack>
        ) : null}
      </Stack>
    </Container>
  );
}
