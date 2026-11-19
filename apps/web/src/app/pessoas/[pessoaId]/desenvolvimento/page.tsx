"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Accordion,
  Anchor,
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
import { useSessao } from "@/componentes/contexto-sessao";
import {
  EstadoCarregando,
  EstadoVazio,
  MensagemFeedback,
  mensagemErroAmigavel,
} from "@/componentes/feedback";
import {
  IconeBrincadeira,
  IconeConcluiu,
  IconeParticipou,
} from "@/componentes/icones-experiencia";
import {
  criarDesafioPersonalizado,
  criarRecompensa,
  disponibilizarDesafio,
  disponibilizarRecompensa,
  listarDesafios,
  listarRecompensas,
  obterEstrelas,
  obterPessoa,
  registrarParticipacaoDesafio,
  resgatarRecompensa,
  type DesafioResumo,
  type EstrelasResumo,
  type RecompensaResumo,
} from "@/lib/api";
import { podeOrganizarDesenvolvimento } from "@/lib/rotulos-experiencia";

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

type FiltroBrincadeira = "explorar" | "executadas";
type FiltroRecompensa = "disponiveis" | "resgatadas";

function novaChaveExecucao() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `exec-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function PaginaDesenvolvimento() {
  const params = useParams<{ pessoaId: string }>();
  const router = useRouter();
  const { usuario, autorizacoes, pronto } = useSessao();
  const [nomePessoa, setNomePessoa] = useState("");
  const [desafios, setDesafios] = useState<DesafioResumo[]>([]);
  const [estrelas, setEstrelas] = useState<EstrelasResumo | null>(null);
  const [recompensas, setRecompensas] = useState<RecompensaResumo[]>([]);
  const [filtro, setFiltro] = useState<FiltroBrincadeira>("explorar");
  const [filtroRecompensa, setFiltroRecompensa] =
    useState<FiltroRecompensa>("disponiveis");
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [selecionado, setSelecionado] = useState<DesafioResumo | null>(null);
  const [observacao, setObservacao] = useState("");
  const [chaveExecucao, setChaveExecucao] = useState(novaChaveExecucao);
  const [registrando, setRegistrando] = useState(false);
  const [disponibilizando, setDisponibilizando] = useState(false);
  const [nomeNova, setNomeNova] = useState("");
  const [dificuldadeNova, setDificuldadeNova] = useState("simples");
  const [instrucaoNova, setInstrucaoNova] = useState("");
  const [enviandoCriacao, setEnviandoCriacao] = useState(false);
  const [nomeRecompensa, setNomeRecompensa] = useState("");
  const [custoRecompensa, setCustoRecompensa] = useState<number | string>(5);
  const [enviandoRecompensa, setEnviandoRecompensa] = useState(false);
  const [resgatandoId, setResgatandoId] = useState<string | null>(null);
  const [disponibilizandoRecId, setDisponibilizandoRecId] = useState<
    string | null
  >(null);
  const [confirmacaoResgate, setConfirmacaoResgate] =
    useState<RecompensaResumo | null>(null);
  const ehCelular = useMediaQuery("(max-width: 47.99em)", true);

  const podeOrganizar = podeOrganizarDesenvolvimento(
    params.pessoaId,
    usuario?.pessoa.id,
    autorizacoes,
  );

  const carregarDesafios = useCallback(
    async (pessoaId: string, disponibilidade: FiltroBrincadeira) => {
      const lista = await listarDesafios(pessoaId, { disponibilidade });
      setDesafios(lista.desafios);
    },
    [],
  );

  const carregarSaldoERecompensas = useCallback(
    async (pessoaId: string, disponibilidade: FiltroRecompensa) => {
      const [saldo, lista] = await Promise.all([
        obterEstrelas(pessoaId),
        listarRecompensas(pessoaId, { disponibilidade }),
      ]);
      setEstrelas(saldo);
      setRecompensas(lista.filter((r) => r.ativa !== false));
    },
    [],
  );

  useEffect(() => {
    if (!pronto) return;
    void (async () => {
      setCarregando(true);
      setErro(null);
      try {
        if (!usuario) {
          setErro("Entre na página inicial para ver o desenvolvimento.");
          setDesafios([]);
          setEstrelas(null);
          setRecompensas([]);
          return;
        }
        const perfil = (await obterPessoa(
          usuario.pessoa.familiaId,
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
          carregarDesafios(params.pessoaId, filtro),
          carregarSaldoERecompensas(params.pessoaId, filtroRecompensa),
        ]);
      } catch (e) {
        const msg = mensagemErroAmigavel(e, "Não foi possível carregar");
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
    pronto,
    usuario,
    params.pessoaId,
    filtro,
    filtroRecompensa,
    carregarDesafios,
    carregarSaldoERecompensas,
  ]);

  const podeVer =
    Boolean(usuario) && !carregando && !erro?.startsWith("Acesso");

  const tituloLista = useMemo(
    () =>
      filtro === "executadas"
        ? "Brincadeiras executadas"
        : "Brincadeiras para explorar",
    [filtro],
  );

  async function aoCriar(evento: FormEvent) {
    evento.preventDefault();
    if (!podeOrganizar) return;
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
      setFiltro("explorar");
      await carregarDesafios(params.pessoaId, "explorar");
    } catch (e) {
      setErro(mensagemErroAmigavel(e, "Não foi possível salvar"));
    } finally {
      setEnviandoCriacao(false);
    }
  }

  async function aoCriarRecompensa(evento: FormEvent) {
    evento.preventDefault();
    if (!podeOrganizar) return;
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
      setFiltroRecompensa("disponiveis");
      await carregarSaldoERecompensas(params.pessoaId, "disponiveis");
    } catch (e) {
      setErro(mensagemErroAmigavel(e, "Não foi possível salvar"));
    } finally {
      setEnviandoRecompensa(false);
    }
  }

  async function confirmarResgate() {
    if (!confirmacaoResgate || resgatandoId) return;
    const recompensa = confirmacaoResgate;
    setResgatandoId(recompensa.id);
    setErro(null);
    setSucesso(null);
    try {
      await resgatarRecompensa(
        params.pessoaId,
        recompensa.id,
        novaChaveExecucao(),
      );
      setSucesso(
        `Resgate de “${recompensa.nome}” confirmado (−${recompensa.custo} estrelas).`,
      );
      setConfirmacaoResgate(null);
      setFiltroRecompensa("resgatadas");
      await carregarSaldoERecompensas(params.pessoaId, "resgatadas");
    } catch (e) {
      setErro(mensagemErroAmigavel(e, "Não foi possível resgatar"));
    } finally {
      setResgatandoId(null);
    }
  }

  async function aoDisponibilizarRecompensa(recompensa: RecompensaResumo) {
    if (!podeOrganizar || disponibilizandoRecId) return;
    setDisponibilizandoRecId(recompensa.id);
    setErro(null);
    setSucesso(null);
    try {
      await disponibilizarRecompensa(params.pessoaId, recompensa.id);
      setSucesso(`“${recompensa.nome}” disponível para novo resgate.`);
      setFiltroRecompensa("disponiveis");
      await carregarSaldoERecompensas(params.pessoaId, "disponiveis");
    } catch (e) {
      setErro(mensagemErroAmigavel(e, "Não foi possível disponibilizar"));
    } finally {
      setDisponibilizandoRecId(null);
    }
  }

  async function aoDisponibilizarDesafio() {
    if (!selecionado || !podeOrganizar || disponibilizando) return;
    setDisponibilizando(true);
    setErro(null);
    setSucesso(null);
    try {
      await disponibilizarDesafio(params.pessoaId, selecionado.id);
      setSucesso(`“${selecionado.nome}” voltou para Explorar.`);
      setSelecionado(null);
      setFiltro("explorar");
      await carregarDesafios(params.pessoaId, "explorar");
    } catch (e) {
      setErro(mensagemErroAmigavel(e, "Não foi possível disponibilizar"));
    } finally {
      setDisponibilizando(false);
    }
  }

  async function aoRegistrar(resultado: "concluiu" | "participou") {
    if (!selecionado || registrando) return;
    const nomeBrincadeira = selecionado.nome;
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
      const estrelasTxt =
        registro.estrelasConcedidas === 1
          ? "1 estrela"
          : `${registro.estrelasConcedidas} estrelas`;
      setSucesso(
        registro.idempotente
          ? `${verbo} “${nomeBrincadeira}”: já estava registrado (+${estrelasTxt}).`
          : `${verbo} “${nomeBrincadeira}”: +${estrelasTxt}. Saldo: ${registro.saldoAtual}.`,
      );
      setObservacao("");
      setChaveExecucao(novaChaveExecucao());
      setSelecionado(null);
      setFiltro("executadas");
      await Promise.all([
        carregarDesafios(params.pessoaId, "executadas"),
        carregarSaldoERecompensas(params.pessoaId, filtroRecompensa),
      ]);
    } catch (e) {
      setErro(
        mensagemErroAmigavel(e, "Não foi possível registrar. Tente de novo."),
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

  const semSessao = pronto && !carregando && !usuario;
  const saldo = estrelas?.saldoDisponivel ?? 0;

  return (
    <Container component="main" size="sm" px={0}>
      <Stack gap="lg">
        <Group justify="space-between" align="flex-end" wrap="nowrap" gap="sm">
          <Title order={1} style={{ flex: 1 }}>
            Desenvolvimento{nomePessoa ? ` · ${nomePessoa}` : ""}
          </Title>
          {podeVer && estrelas ? (
            <Text
              size="sm"
              fw={600}
              c="azul"
              aria-live="polite"
              style={{ whiteSpace: "nowrap" }}
            >
              ★ {saldo}
            </Text>
          ) : null}
        </Group>

        {!pronto || carregando ? (
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
              onChange={(v) => setFiltro(v as FiltroBrincadeira)}
              data={[
                { label: "Explorar", value: "explorar" },
                { label: "Executadas", value: "executadas" },
              ]}
            />

            <Stack gap="sm">
              <Title order={2}>{tituloLista}</Title>
              {desafios.length === 0 ? (
                <EstadoVazio
                  titulo={
                    filtro === "executadas"
                      ? "Nenhuma executada ainda"
                      : "Nenhuma brincadeira disponível"
                  }
                  descricao={
                    filtro === "executadas"
                      ? "Depois de registrar uma participação, ela aparece aqui."
                      : podeOrganizar
                        ? "Crie uma ou aguarde a biblioteca da família."
                        : "Quando houver brincadeiras disponíveis, elas aparecem aqui."
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
                          {desafio.origem === "personalizada"
                            ? " · Sua família"
                            : ""}
                          {filtro === "executadas" &&
                          desafio.ultimaParticipacao
                            ? ` · Última: ${desafio.ultimaParticipacao.resultado}`
                            : ""}
                        </Text>
                      </Stack>
                    </Group>
                  </Card>
                ))
              )}
            </Stack>

            <Accordion variant="contained" radius="md">
              <Accordion.Item value="recompensas">
                <Accordion.Control>
                  <Text fw={600}>Recompensas</Text>
                </Accordion.Control>
                <Accordion.Panel>
                  <Stack gap="md">
                    <SegmentedControl
                      fullWidth
                      value={filtroRecompensa}
                      onChange={(v) =>
                        setFiltroRecompensa(v as FiltroRecompensa)
                      }
                      data={[
                        { label: "Disponíveis", value: "disponiveis" },
                        { label: "Resgatadas", value: "resgatadas" },
                      ]}
                    />
                    {recompensas.length === 0 ? (
                      <EstadoVazio
                        titulo={
                          filtroRecompensa === "resgatadas"
                            ? "Nenhuma resgatada"
                            : "Nenhuma disponível"
                        }
                        descricao={
                          filtroRecompensa === "resgatadas"
                            ? "Resgates confirmados aparecem aqui."
                            : podeOrganizar
                              ? "Opcional. Cadastre abaixo se a família quiser."
                              : "Opcional — nada a resgatar por enquanto."
                        }
                      />
                    ) : (
                      recompensas.map((r) => {
                        const insuficiente = saldo < r.custo;
                        const confirmando = confirmacaoResgate?.id === r.id;
                        const emDisponiveis = filtroRecompensa === "disponiveis";
                        return (
                          <Card key={r.id} withBorder padding="sm" radius="md">
                            <Stack gap="xs">
                              <Text fw={600}>{r.nome}</Text>
                              <Text size="sm" c="dimmed">
                                {r.custo} estrelas
                                {r.ultimoResgate
                                  ? ` · Último: −${r.ultimoResgate.custoAplicado}`
                                  : ""}
                              </Text>
                              {emDisponiveis ? (
                                confirmando ? (
                                  <Stack gap="xs">
                                    <Text size="sm">
                                      Confirmar resgate de “{r.nome}” (−{r.custo}
                                      )?
                                    </Text>
                                    <Group gap="xs">
                                      <Button
                                        size="sm"
                                        loading={resgatandoId === r.id}
                                        onClick={() => void confirmarResgate()}
                                      >
                                        Confirmar
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="subtle"
                                        disabled={Boolean(resgatandoId)}
                                        onClick={() =>
                                          setConfirmacaoResgate(null)
                                        }
                                      >
                                        Cancelar
                                      </Button>
                                    </Group>
                                  </Stack>
                                ) : (
                                  <Button
                                    size="sm"
                                    disabled={insuficiente}
                                    onClick={() => setConfirmacaoResgate(r)}
                                  >
                                    {insuficiente
                                      ? "Saldo insuficiente"
                                      : "Resgatar"}
                                  </Button>
                                )
                              ) : podeOrganizar ? (
                                <Button
                                  size="sm"
                                  variant="light"
                                  loading={disponibilizandoRecId === r.id}
                                  onClick={() =>
                                    void aoDisponibilizarRecompensa(r)
                                  }
                                >
                                  Disponibilizar novamente
                                </Button>
                              ) : null}
                            </Stack>
                          </Card>
                        );
                      })
                    )}

                    {podeOrganizar ? (
                      <form onSubmit={aoCriarRecompensa}>
                        <Stack gap="sm">
                          <Text size="sm" fw={600}>
                            Cadastros · Nova recompensa
                          </Text>
                          <TextInput
                            label="Nome"
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
                    ) : null}
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>

              {podeOrganizar ? (
                <Accordion.Item value="criar">
                  <Accordion.Control>
                    <Text fw={600}>Cadastros · Nova brincadeira</Text>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <form onSubmit={aoCriar}>
                      <Stack gap="sm">
                        <TextInput
                          label="Nome"
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
              ) : null}
            </Accordion>

            <Text size="sm" c="dimmed">
              Evolução no{" "}
              <Anchor
                component={Link}
                href={`/pessoas/${params.pessoaId}/historico`}
                size="sm"
              >
                histórico
              </Anchor>
              .
            </Text>
          </Stack>
        ) : null}
      </Stack>

      <Drawer
        opened={Boolean(podeVer && selecionado)}
        onClose={() => {
          if (!registrando) setSelecionado(null);
        }}
        position={ehCelular ? "bottom" : "right"}
        size={ehCelular ? "auto" : "md"}
        title={selecionado?.nome ?? "Brincadeira"}
        padding="md"
        closeOnEscape={!registrando}
        closeOnClickOutside={!registrando}
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

            {filtro === "executadas" ||
            selecionado.disponivelParaNovaParticipacao === false ? (
              <>
                {selecionado.ultimaParticipacao ? (
                  <Text size="sm" c="dimmed">
                    Última: {selecionado.ultimaParticipacao.resultado} ·{" "}
                    {selecionado.ultimaParticipacao.estrelasConcedidas} estrelas
                  </Text>
                ) : null}
                {podeOrganizar ? (
                  <Button
                    loading={disponibilizando}
                    disabled={registrando}
                    onClick={() => void aoDisponibilizarDesafio()}
                  >
                    Disponibilizar novamente
                  </Button>
                ) : (
                  <Text size="sm" c="dimmed">
                    Já registrada. Um responsável pode disponibilizar de novo.
                  </Text>
                )}
              </>
            ) : (
              <>
                <Textarea
                  label="Observação"
                  description="Opcional"
                  value={observacao}
                  onChange={(e) => setObservacao(e.currentTarget.value)}
                  minRows={2}
                  autosize
                  disabled={registrando}
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
              </>
            )}
            <Button
              variant="subtle"
              disabled={registrando || disponibilizando}
              onClick={() => setSelecionado(null)}
            >
              Fechar
            </Button>
          </Stack>
        ) : null}
      </Drawer>
    </Container>
  );
}
