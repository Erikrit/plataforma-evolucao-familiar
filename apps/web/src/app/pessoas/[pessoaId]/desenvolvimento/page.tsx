"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Accordion,
  Button,
  Card,
  Container,
  Drawer,
  Group,
  NumberInput,
  SegmentedControl,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  criarDesafioPersonalizado,
  criarRecompensa,
  guardarDesafio,
  listarDesafios,
  listarRecompensas,
  obterEstrelas,
  obterMe,
  obterPessoa,
  registrarParticipacaoDesafio,
  resgatarRecompensa,
  retirarDesafioGuardado,
  type DesafioResumo,
  type EstrelasResumo,
  type RecompensaResumo,
} from "@/lib/api";
import {
  EstadoCarregando,
  EstadoVazio,
  MensagemFeedback,
} from "@/componentes/feedback";
import {
  IconeBrincadeira,
  IconeConcluiu,
  IconeParticipou,
} from "@/componentes/icones-experiencia";

const ROTULOS_CATEGORIA: Record<string, string> = {
  memoria_atencao: "Memória e atenção",
  raciocinio: "Raciocínio",
  linguagem: "Linguagem",
  criatividade: "Criatividade",
  coordenacao: "Coordenação",
  autonomia: "Autonomia",
};

const ROTULOS_DIFICULDADE: Record<string, string> = {
  simples: "Simples",
  media: "Média",
  desafiadora: "Desafiadora",
};

type FiltroLista = "todas" | "guardadas";

function novaChaveExecucao() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `exec-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function PaginaDesenvolvimento() {
  const params = useParams<{ pessoaId: string }>();
  const router = useRouter();
  const [autenticado, setAutenticado] = useState(false);
  const [nomePessoa, setNomePessoa] = useState("");
  const [desafios, setDesafios] = useState<DesafioResumo[]>([]);
  const [estrelas, setEstrelas] = useState<EstrelasResumo | null>(null);
  const [recompensas, setRecompensas] = useState<RecompensaResumo[]>([]);
  const [filtro, setFiltro] = useState<FiltroLista>("todas");
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [selecionado, setSelecionado] = useState<DesafioResumo | null>(null);
  const [observacao, setObservacao] = useState("");
  const [chaveExecucao, setChaveExecucao] = useState(novaChaveExecucao);
  const [registrando, setRegistrando] = useState(false);
  const [alternandoGuardado, setAlternandoGuardado] = useState(false);
  const [nomeNova, setNomeNova] = useState("");
  const [dificuldadeNova, setDificuldadeNova] = useState("simples");
  const [instrucaoNova, setInstrucaoNova] = useState("");
  const [enviandoCriacao, setEnviandoCriacao] = useState(false);
  const [nomeRecompensa, setNomeRecompensa] = useState("");
  const [custoRecompensa, setCustoRecompensa] = useState<number | string>(5);
  const [enviandoRecompensa, setEnviandoRecompensa] = useState(false);
  const [resgatandoId, setResgatandoId] = useState<string | null>(null);
  const ehCelular = useMediaQuery("(max-width: 47.99em)", true);

  const carregarDesafios = useCallback(
    async (pessoaId: string, apenasGuardados: boolean) => {
      const lista = await listarDesafios(pessoaId, {
        guardados: apenasGuardados || undefined,
      });
      setDesafios(lista.desafios);
    },
    [],
  );

  const carregarSaldoERecompensas = useCallback(async (pessoaId: string) => {
    const [saldo, lista] = await Promise.all([
      obterEstrelas(pessoaId),
      listarRecompensas(pessoaId),
    ]);
    setEstrelas(saldo);
    setRecompensas(lista.filter((r) => r.ativa));
  }, []);

  useEffect(() => {
    void (async () => {
      setCarregando(true);
      setErro(null);
      try {
        const me = await obterMe();
        if (!me) {
          setAutenticado(false);
          setErro("Entre na página inicial para ver o desenvolvimento.");
          return;
        }
        setAutenticado(true);
        const perfil = (await obterPessoa(
          me.pessoa.familiaId,
          params.pessoaId,
        )) as { nome: string; areas?: { id: string; disponivel: boolean }[] };
        setNomePessoa(perfil.nome);
        const area = perfil.areas?.find((a) => a.id === "desenvolvimento");
        if (!area?.disponivel) {
          setErro("Acesso negado ao desenvolvimento desta pessoa.");
          setDesafios([]);
          setEstrelas(null);
          setRecompensas([]);
          return;
        }
        await Promise.all([
          carregarDesafios(params.pessoaId, filtro === "guardadas"),
          carregarSaldoERecompensas(params.pessoaId),
        ]);
      } catch (e) {
        const msg =
          e instanceof Error ? e.message : "Não foi possível carregar";
        setErro(
          msg.toLowerCase().includes("acesso")
            ? msg.startsWith("Acesso")
              ? msg
              : `Acesso negado: ${msg}`
            : msg,
        );
        setDesafios([]);
        setEstrelas(null);
        setRecompensas([]);
      } finally {
        setCarregando(false);
      }
    })();
  }, [
    params.pessoaId,
    filtro,
    carregarDesafios,
    carregarSaldoERecompensas,
  ]);

  const podeVer =
    autenticado && !carregando && !erro?.startsWith("Acesso");

  const tituloLista = useMemo(
    () =>
      filtro === "guardadas"
        ? "Guardadas para depois"
        : "Brincadeiras disponíveis",
    [filtro],
  );

  async function aoCriar(evento: FormEvent) {
    evento.preventDefault();
    if (!nomeNova.trim()) {
      setErro("Informe o nome da brincadeira.");
      return;
    }
    setEnviandoCriacao(true);
    setErro(null);
    setSucesso(null);
    try {
      await criarDesafioPersonalizado(params.pessoaId, {
        nome: nomeNova.trim(),
        dificuldade: dificuldadeNova,
        instrucao: instrucaoNova.trim() || null,
      });
      setNomeNova("");
      setInstrucaoNova("");
      setDificuldadeNova("simples");
      setSucesso("Brincadeira salva.");
      await carregarDesafios(params.pessoaId, filtro === "guardadas");
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível salvar");
    } finally {
      setEnviandoCriacao(false);
    }
  }

  async function aoCriarRecompensa(evento: FormEvent) {
    evento.preventDefault();
    const custo = Number(custoRecompensa);
    if (!nomeRecompensa.trim()) {
      setErro("Informe o nome da recompensa.");
      return;
    }
    if (!Number.isInteger(custo) || custo <= 0) {
      setErro("Informe um custo em estrelas (número inteiro positivo).");
      return;
    }
    setEnviandoRecompensa(true);
    setErro(null);
    setSucesso(null);
    try {
      await criarRecompensa(params.pessoaId, {
        nome: nomeRecompensa.trim(),
        custo,
      });
      setNomeRecompensa("");
      setCustoRecompensa(5);
      setSucesso("Recompensa adicionada.");
      await carregarSaldoERecompensas(params.pessoaId);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível salvar");
    } finally {
      setEnviandoRecompensa(false);
    }
  }

  async function aoResgatar(recompensa: RecompensaResumo) {
    setResgatandoId(recompensa.id);
    setErro(null);
    setSucesso(null);
    try {
      await resgatarRecompensa(params.pessoaId, recompensa.id);
      setSucesso(
        `Resgate de “${recompensa.nome}” confirmado (−${recompensa.custo} estrelas).`,
      );
      await carregarSaldoERecompensas(params.pessoaId);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível resgatar");
    } finally {
      setResgatandoId(null);
    }
  }

  async function aoAlternarGuardado() {
    if (!selecionado) return;
    setAlternandoGuardado(true);
    setErro(null);
    setSucesso(null);
    try {
      if (selecionado.guardado) {
        await retirarDesafioGuardado(params.pessoaId, selecionado.id);
        setSucesso("Retirada das guardadas.");
        setSelecionado({ ...selecionado, guardado: false });
      } else {
        await guardarDesafio(params.pessoaId, selecionado.id);
        setSucesso("Guardada para depois — sem prazo.");
        setSelecionado({ ...selecionado, guardado: true });
      }
      await carregarDesafios(params.pessoaId, filtro === "guardadas");
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível atualizar");
    } finally {
      setAlternandoGuardado(false);
    }
  }

  async function aoRegistrar(resultado: "concluiu" | "participou") {
    if (!selecionado) return;
    setRegistrando(true);
    setErro(null);
    setSucesso(null);
    try {
      const registro = await registrarParticipacaoDesafio(params.pessoaId, {
        desafioId: selecionado.id,
        resultado,
        observacao: observacao.trim() || null,
        execucaoChave: chaveExecucao,
      });
      const verbo = resultado === "concluiu" ? "Concluiu" : "Participou";
      setSucesso(
        registro.idempotente
          ? `${verbo}: já estava registrado (+${registro.estrelasConcedidas} estrelas).`
          : `${verbo}: +${registro.estrelasConcedidas} estrelas. Saldo: ${registro.saldoAtual}.`,
      );
      setObservacao("");
      setChaveExecucao(novaChaveExecucao());
      setSelecionado(null);
      await carregarSaldoERecompensas(params.pessoaId);
    } catch (e) {
      setErro(
        e instanceof Error
          ? e.message
          : "Não foi possível registrar. Tente de novo.",
      );
    } finally {
      setRegistrando(false);
    }
  }

  function abrirDesafio(desafio: DesafioResumo) {
    setSelecionado(desafio);
    setObservacao("");
    setChaveExecucao(novaChaveExecucao());
    setErro(null);
    setSucesso(null);
  }

  const semSessao = !carregando && !autenticado;
  const saldo = estrelas?.saldoDisponivel ?? 0;

  return (
    <Container component="main" size="sm" px={0}>
      <Stack gap="lg">
        <Stack gap={4}>
          <Title order={1}>
            Desenvolvimento{nomePessoa ? ` · ${nomePessoa}` : ""}
          </Title>
        </Stack>

        {carregando ? (
          <EstadoCarregando rotulo="Carregando brincadeiras…" />
        ) : null}

        <MensagemFeedback erro={erro} sucesso={sucesso} />

        {semSessao ? (
          <Button variant="light" onClick={() => router.push("/")}>
            Ir para entrar
          </Button>
        ) : null}

        {podeVer ? (
          <Stack gap="lg">
            <SegmentedControl
              fullWidth
              value={filtro}
              onChange={(v) => setFiltro(v as FiltroLista)}
              data={[
                { label: "Explorar", value: "todas" },
                { label: "Guardadas", value: "guardadas" },
              ]}
            />

            <Stack gap="sm">
              <Title order={2}>{tituloLista}</Title>
              {desafios.length === 0 ? (
                <EstadoVazio
                  titulo={
                    filtro === "guardadas"
                      ? "Nenhuma guardada"
                      : "Nenhuma brincadeira ainda"
                  }
                  descricao={
                    filtro === "guardadas"
                      ? "Toque em Guardar numa brincadeira para vê-la aqui. Sem prazos."
                      : "Crie uma ou aguarde a biblioteca da família."
                  }
                />
              ) : (
                desafios.map((desafio) => (
                  <Card
                    key={desafio.id}
                    component="button"
                    type="button"
                    withBorder
                    padding="md"
                    radius="md"
                    onClick={() => abrirDesafio(desafio)}
                    style={{
                      cursor: "pointer",
                      textAlign: "left",
                      width: "100%",
                      font: "inherit",
                      color: "inherit",
                      background: "var(--mantine-color-body)",
                    }}
                  >
                    <Group gap="sm" wrap="nowrap" align="flex-start">
                      <IconeBrincadeira />
                      <Stack gap={4}>
                        <Text fw={600}>{desafio.nome}</Text>
                        <Text size="sm" c="dimmed">
                          {ROTULOS_DIFICULDADE[desafio.dificuldade] ??
                            desafio.dificuldade}
                          {desafio.categoria
                            ? ` · ${ROTULOS_CATEGORIA[desafio.categoria] ?? desafio.categoria}`
                            : ""}
                          {desafio.guardado ? " · Guardada" : ""}
                          {desafio.origem === "personalizada"
                            ? " · Sua família"
                            : ""}
                        </Text>
                        <Text size="sm" c="azul">
                          Abrir
                        </Text>
                      </Stack>
                    </Group>
                  </Card>
                ))
              )}
            </Stack>

            <Card withBorder padding="md" radius="md">
              <Stack gap="xs">
                <Text fw={600}>Estrelas</Text>
                <Text size="xl" fw={700}>
                  {saldo}
                </Text>
                <Text size="sm" c="dimmed">
                  Disponíveis · conquistadas {estrelas?.totalConquistado ?? 0} ·
                  usadas {estrelas?.totalResgatado ?? 0}
                </Text>
              </Stack>
            </Card>

            <Card
              component={Link}
              href={`/pessoas/${params.pessoaId}/historico`}
              withBorder
              padding="md"
              radius="md"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Text fw={600}>Ver evolução no histórico</Text>
              <Text size="sm" c="dimmed">
                Linha do tempo familiar — sem segundo cadastro.
              </Text>
              <Text size="sm" c="azul">
                Abrir histórico
              </Text>
            </Card>

            <Accordion variant="contained" radius="md">
              <Accordion.Item value="criar">
                <Accordion.Control>
                  <Text fw={600}>Nova brincadeira</Text>
                </Accordion.Control>
                <Accordion.Panel>
                  <form onSubmit={aoCriar}>
                    <Stack gap="sm">
                      <TextInput
                        label="Nome"
                        description="Obrigatório"
                        value={nomeNova}
                        onChange={(e) => setNomeNova(e.currentTarget.value)}
                        required
                      />
                      <SegmentedControl
                        fullWidth
                        value={dificuldadeNova}
                        onChange={setDificuldadeNova}
                        data={[
                          { label: "Simples", value: "simples" },
                          { label: "Média", value: "media" },
                          { label: "Desafiadora", value: "desafiadora" },
                        ]}
                      />
                      <Textarea
                        label="Como brincar"
                        description="Opcional"
                        value={instrucaoNova}
                        onChange={(e) =>
                          setInstrucaoNova(e.currentTarget.value)
                        }
                        minRows={2}
                        autosize
                      />
                      <Button type="submit" loading={enviandoCriacao}>
                        Salvar brincadeira
                      </Button>
                    </Stack>
                  </form>
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="recompensas">
                <Accordion.Control>
                  <Text fw={600}>Recompensas</Text>
                </Accordion.Control>
                <Accordion.Panel>
                  <Stack gap="md">
                    <form onSubmit={aoCriarRecompensa}>
                      <Stack gap="sm">
                        <TextInput
                          label="Nome"
                          description="Opcional criar — só nome e custo"
                          value={nomeRecompensa}
                          onChange={(e) =>
                            setNomeRecompensa(e.currentTarget.value)
                          }
                        />
                        <NumberInput
                          label="Custo em estrelas"
                          min={1}
                          step={1}
                          value={custoRecompensa}
                          onChange={setCustoRecompensa}
                        />
                        <Button type="submit" loading={enviandoRecompensa}>
                          Adicionar recompensa
                        </Button>
                      </Stack>
                    </form>

                    {recompensas.length === 0 ? (
                      <EstadoVazio
                        titulo="Nenhuma recompensa ainda"
                        descricao="Quando quiser, crie uma com nome e custo. Não é obrigatório."
                      />
                    ) : (
                      recompensas.map((r) => {
                        const insuficiente = saldo < r.custo;
                        return (
                          <Card key={r.id} withBorder padding="sm" radius="md">
                            <Stack gap="xs">
                              <Text fw={600}>{r.nome}</Text>
                              <Text size="sm" c="dimmed">
                                {r.custo} estrelas
                              </Text>
                              <Button
                                size="sm"
                                disabled={insuficiente}
                                loading={resgatandoId === r.id}
                                onClick={() => void aoResgatar(r)}
                              >
                                {insuficiente
                                  ? "Saldo insuficiente"
                                  : "Resgatar"}
                              </Button>
                            </Stack>
                          </Card>
                        );
                      })
                    )}
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </Stack>
        ) : null}
      </Stack>

      <Drawer
        opened={Boolean(podeVer && selecionado)}
        onClose={() => setSelecionado(null)}
        position={ehCelular ? "bottom" : "right"}
        size={ehCelular ? "auto" : "md"}
        title={selecionado?.nome ?? "Brincadeira"}
        padding="md"
      >
        {selecionado ? (
          <Stack gap="md" pb="md">
            <Text size="sm" c="dimmed">
              {ROTULOS_DIFICULDADE[selecionado.dificuldade] ??
                selecionado.dificuldade}
              {selecionado.categoria
                ? ` · ${ROTULOS_CATEGORIA[selecionado.categoria] ?? selecionado.categoria}`
                : ""}
            </Text>
            {selecionado.instrucao ? (
              <Text size="sm">{selecionado.instrucao}</Text>
            ) : (
              <Text size="sm" c="dimmed">
                Sem instrução escrita — brinquem do jeito que fizer sentido.
              </Text>
            )}
            {selecionado.materiais ? (
              <Text size="sm">Materiais: {selecionado.materiais}</Text>
            ) : null}

            <Button
              variant="light"
              loading={alternandoGuardado}
              onClick={() => void aoAlternarGuardado()}
            >
              {selecionado.guardado
                ? "Retirar das guardadas"
                : "Guardar para depois"}
            </Button>

            <Textarea
              label="Observação"
              description="Opcional"
              value={observacao}
              onChange={(e) => setObservacao(e.currentTarget.value)}
              minRows={2}
              autosize
            />

            <Button
              loading={registrando}
              leftSection={<IconeConcluiu compacto />}
              onClick={() => void aoRegistrar("concluiu")}
            >
              Concluiu
            </Button>
            <Button
              variant="light"
              loading={registrando}
              leftSection={<IconeParticipou compacto />}
              onClick={() => void aoRegistrar("participou")}
            >
              Participou
            </Button>
            <Button variant="subtle" onClick={() => setSelecionado(null)}>
              Fechar
            </Button>
          </Stack>
        ) : null}
      </Drawer>
    </Container>
  );
}
