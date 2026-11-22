"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { rotaFamilia } from "@/lib/rotas-familia";
import {
  Accordion,
  Anchor,
  Button,
  Card,
  Chip,
  Container,
  Drawer,
  Group,
  SegmentedControl,
  Stack,
  Text,
  Textarea,
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
  escolherSugestaoDesafio,
  disponibilizarDesafio,
  disponibilizarRecompensa,
  listarDesafios,
  listarRecompensas,
  listarSugestoesDesafio,
  obterEstrelas,
  obterPessoa,
  registrarParticipacaoDesafio,
  renovarSugestoesDesafio,
  resgatarRecompensa,
  type DesafioResumo,
  type EstrelasResumo,
  type RecompensaResumo,
  type SugestaoDesafio,
} from "@/lib/api";
import {
  podeOrganizarDesenvolvimento,
  ROTULOS_CATEGORIA_DESENVOLVIMENTO,
} from "@/lib/rotulos-experiencia";

const ROTULOS_DIFICULDADE: Record<string, string> = {
  simples: "Simples",
  media: "Média",
  desafiadora: "Desafiadora",
};

const TODAS_CATEGORIAS = "todas";

const OPCOES_CATEGORIA = [
  { value: TODAS_CATEGORIAS, label: "Todas" },
  ...Object.entries(ROTULOS_CATEGORIA_DESENVOLVIMENTO).map(
    ([value, label]) => ({ value, label }),
  ),
];

type FiltroBrincadeira = "explorar" | "executadas";
type FiltroRecompensa = "disponiveis" | "resgatadas";

function novaChaveExecucao() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `exec-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function PaginaDesenvolvimento() {
  const params = useParams<{ slug: string; pessoaId: string }>();
  const router = useRouter();
  const { usuario, autorizacoes, pronto } = useSessao();
  const [nomePessoa, setNomePessoa] = useState("");
  const [acessoLiberado, setAcessoLiberado] = useState(false);
  const [desafios, setDesafios] = useState<DesafioResumo[] | null>(null);
  const [sugestoes, setSugestoes] = useState<SugestaoDesafio[] | null>(null);
  const [mensagemSugestoes, setMensagemSugestoes] = useState<string | null>(
    null,
  );
  const [renovando, setRenovando] = useState(false);
  const [escolhendoId, setEscolhendoId] = useState<string | null>(null);
  const [estrelas, setEstrelas] = useState<EstrelasResumo | null>(null);
  const [recompensas, setRecompensas] = useState<RecompensaResumo[] | null>(
    null,
  );
  const [filtro, setFiltro] = useState<FiltroBrincadeira>("explorar");
  const [categoria, setCategoria] = useState(TODAS_CATEGORIAS);
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
  const [resgatandoId, setResgatandoId] = useState<string | null>(null);
  const [disponibilizandoRecId, setDisponibilizandoRecId] = useState<
    string | null
  >(null);
  const [confirmacaoResgate, setConfirmacaoResgate] =
    useState<RecompensaResumo | null>(null);
  const requisicaoDesafios = useRef(0);
  const requisicaoRecompensas = useRef(0);
  const ehCelular = useMediaQuery("(max-width: 47.99em)", true);

  const podeOrganizar = podeOrganizarDesenvolvimento(
    params.pessoaId,
    usuario?.pessoa.id,
    autorizacoes,
  );

  const carregarSugestoes = useCallback(async () => {
    const lista = await listarSugestoesDesafio(params.pessoaId);
    setSugestoes(lista.sugestoes);
    setMensagemSugestoes(lista.mensagem);
  }, [params.pessoaId]);

  // Respostas de uma aba/categoria anterior não podem sobrescrever a lista atual.
  const carregarDesafios = useCallback(async () => {
    const requisicao = ++requisicaoDesafios.current;
    const lista = await listarDesafios(params.pessoaId, {
      disponibilidade: filtro,
      categoria: categoria === TODAS_CATEGORIAS ? undefined : categoria,
    });
    if (requisicao === requisicaoDesafios.current) {
      setDesafios(lista.desafios);
    }
  }, [params.pessoaId, filtro, categoria]);

  const carregarSaldoERecompensas = useCallback(async () => {
    const requisicao = ++requisicaoRecompensas.current;
    const [saldo, lista] = await Promise.all([
      obterEstrelas(params.pessoaId),
      listarRecompensas(params.pessoaId, { disponibilidade: filtroRecompensa }),
    ]);
    if (requisicao !== requisicaoRecompensas.current) return;
    setEstrelas(saldo);
    setRecompensas(lista.filter((r) => r.ativa !== false));
  }, [params.pessoaId, filtroRecompensa]);

  useEffect(() => {
    if (!pronto) return;
    void (async () => {
      setCarregando(true);
      setErro(null);
      setAcessoLiberado(false);
      setDesafios(null);
      setEstrelas(null);
      setRecompensas(null);
      try {
        if (!usuario) {
          setErro("Entre na página inicial para ver o desenvolvimento.");
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
          return;
        }
        setAcessoLiberado(true);
      } catch (e) {
        const msg = mensagemErroAmigavel(e, "Não foi possível carregar");
        setErro(
          msg.toLowerCase().includes("acesso")
            ? msg.startsWith("Acesso")
              ? msg
              : `Acesso negado: ${msg}`
            : msg,
        );
      } finally {
        setCarregando(false);
      }
    })();
  }, [pronto, usuario, params.pessoaId]);

  useEffect(() => {
    if (!acessoLiberado) return;
    setSugestoes(null);
    carregarSugestoes().catch((e) =>
      setErro(mensagemErroAmigavel(e, "Não foi possível carregar sugestões")),
    );
  }, [acessoLiberado, carregarSugestoes]);

  useEffect(() => {
    if (!acessoLiberado) return;
    setDesafios(null);
    carregarDesafios().catch((e) =>
      setErro(mensagemErroAmigavel(e, "Não foi possível carregar")),
    );
  }, [acessoLiberado, carregarDesafios]);

  useEffect(() => {
    if (!acessoLiberado) return;
    setRecompensas(null);
    carregarSaldoERecompensas().catch((e) =>
      setErro(mensagemErroAmigavel(e, "Não foi possível carregar")),
    );
  }, [acessoLiberado, carregarSaldoERecompensas]);

  const podeVer = Boolean(usuario) && !carregando && acessoLiberado;
  const filtrandoCategoria = categoria !== TODAS_CATEGORIAS;

  const tituloLista = useMemo(
    () =>
      filtro === "executadas"
        ? "Brincadeiras executadas"
        : "Brincadeiras para explorar",
    [filtro],
  );

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
      await carregarSaldoERecompensas();
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
      await carregarSaldoERecompensas();
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
      await carregarDesafios();
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
      await Promise.all([
        carregarDesafios(),
        carregarSaldoERecompensas(),
        carregarSugestoes(),
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

  function abrirSugestao(item: SugestaoDesafio) {
    abrirDesafio({
      id: item.id,
      nome: item.nome,
      instrucao: item.instrucao,
      categoria: item.categoria,
      dificuldade: item.dificuldade,
      materiais: item.materiais,
      duracaoMinutos: item.duracaoMinutos,
      faixaEtariaMin: item.faixaEtariaMin,
      faixaEtariaMax: item.faixaEtariaMax,
      origemConteudo: item.origemConteudo,
      versaoConteudo: item.versaoConteudo,
      adaptacoes: item.adaptacoes,
      supervisao: item.supervisao,
      origem: item.origem,
      familiaId: null,
      guardado: false,
      disponivelParaNovaParticipacao: true,
      estadoDisponibilidade: "explorar",
    });
  }

  async function aoEscolherSugestao(item: SugestaoDesafio) {
    if (!podeOrganizar || escolhendoId) return;
    setEscolhendoId(item.id);
    setErro(null);
    setSucesso(null);
    try {
      const resp = await escolherSugestaoDesafio(params.pessoaId, item.id);
      setSugestoes(resp.sugestoes);
      setSucesso(
        resp.jaEstavaEscolhida
          ? `“${item.nome}” já estava escolhida.`
          : `“${item.nome}” marcada para experimentar.`,
      );
    } catch (e) {
      setErro(mensagemErroAmigavel(e, "Não foi possível escolher"));
    } finally {
      setEscolhendoId(null);
    }
  }

  async function aoRenovarSugestoes() {
    if (!podeOrganizar || renovando) return;
    setRenovando(true);
    setErro(null);
    setSucesso(null);
    try {
      const resp = await renovarSugestoesDesafio(params.pessoaId);
      setSugestoes(resp.sugestoes);
      setMensagemSugestoes(resp.mensagem);
      if (resp.trocadas === 0) {
        setSucesso(
          resp.mensagem ?? "Não há novas sugestões disponíveis no momento",
        );
      } else {
        setSucesso(
          resp.mensagem ??
            `Renovamos ${resp.trocadas} sugestão${resp.trocadas === 1 ? "" : "ões"}. Escolhas mantidas.`,
        );
      }
    } catch (e) {
      setErro(mensagemErroAmigavel(e, "Não foi possível renovar"));
    } finally {
      setRenovando(false);
    }
  }

  function irParaBiblioteca() {
    setFiltro("explorar");
    setCategoria(TODAS_CATEGORIAS);
    const ancora = document.getElementById("biblioteca-brincadeiras");
    ancora?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const semSessao = pronto && !carregando && !usuario;
  const saldo = estrelas?.saldoDisponivel ?? 0;
  const linkCadastros = rotaFamilia(String(params.slug ?? ""), `/pessoas/${params.pessoaId}/desenvolvimento/cadastros`);

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
          <Button variant="light" onClick={() => router.push(rotaFamilia(String(params.slug ?? ""), "/entrar"))}>
            Ir para entrar
          </Button>
        ) : null}

        {podeVer ? (
          <Stack gap="lg">
            <Stack gap="sm">
              <Group justify="space-between" align="center" wrap="wrap" gap="xs">
                <Title order={2}>Sugestões para esta pessoa</Title>
                <Group gap="xs">
                  <Button
                    variant="subtle"
                    size="compact-sm"
                    onClick={irParaBiblioteca}
                  >
                    Ver biblioteca
                  </Button>
                  {podeOrganizar ? (
                    <Button
                      variant="light"
                      size="compact-sm"
                      loading={renovando}
                      onClick={() => void aoRenovarSugestoes()}
                    >
                      Renovar sugestões
                    </Button>
                  ) : null}
                </Group>
              </Group>
              {mensagemSugestoes ? (
                <Text size="sm" c="dimmed">
                  {mensagemSugestoes}
                </Text>
              ) : null}
              {sugestoes === null ? (
                <EstadoCarregando rotulo="Carregando sugestões…" />
              ) : sugestoes.length === 0 ? (
                <EstadoVazio
                  titulo="Sem sugestões agora"
                  descricao="Quando houver atividades elegíveis na biblioteca, elas aparecem aqui. Sem cobrança."
                />
              ) : (
                sugestoes.map((item) => (
                  <Card key={item.id} withBorder padding="md" radius="md">
                    <Stack gap="sm">
                      <Group
                        gap="sm"
                        wrap="nowrap"
                        align="flex-start"
                        justify="space-between"
                      >
                        <Group
                          gap="sm"
                          wrap="nowrap"
                          align="flex-start"
                          style={{ flex: 1, cursor: "pointer" }}
                          onClick={() => abrirSugestao(item)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              abrirSugestao(item);
                            }
                          }}
                          role="button"
                          tabIndex={0}
                          aria-label={`Abrir ${item.nome}`}
                        >
                          <IconeBrincadeira />
                          <Stack gap={4}>
                            <Text fw={600}>
                              {item.nome}
                              {item.escolhida ? " · Escolhida" : ""}
                            </Text>
                            <Text size="sm" c="dimmed">
                              {ROTULOS_DIFICULDADE[item.dificuldade] ??
                                item.dificuldade}
                              {item.categoria
                                ? ` · ${ROTULOS_CATEGORIA_DESENVOLVIMENTO[item.categoria] ?? item.categoria}`
                                : ""}
                            </Text>
                            {item.instrucao ? (
                              <Text size="sm" lineClamp={ehCelular ? 3 : 4}>
                                {item.instrucao}
                              </Text>
                            ) : null}
                            {item.materiais ? (
                              <Text size="xs" c="dimmed">
                                Materiais: {item.materiais}
                              </Text>
                            ) : null}
                          </Stack>
                        </Group>
                      </Group>
                      {podeOrganizar && !item.escolhida ? (
                        <Button
                          variant="light"
                          size="sm"
                          loading={escolhendoId === item.id}
                          onClick={() => void aoEscolherSugestao(item)}
                        >
                          Escolher para experimentar
                        </Button>
                      ) : null}
                    </Stack>
                  </Card>
                ))
              )}
            </Stack>

            <SegmentedControl
              id="biblioteca-brincadeiras"
              fullWidth
              value={filtro}
              onChange={(v) => setFiltro(v as FiltroBrincadeira)}
              data={[
                { label: "Explorar", value: "explorar" },
                { label: "Executadas", value: "executadas" },
              ]}
            />

            <Chip.Group
              multiple={false}
              value={categoria}
              onChange={(v) => setCategoria(v || TODAS_CATEGORIAS)}
            >
              <Group gap="xs" role="radiogroup" aria-label="Categoria">
                {OPCOES_CATEGORIA.map((opcao) => (
                  <Chip key={opcao.value} value={opcao.value} size="sm">
                    {opcao.label}
                  </Chip>
                ))}
              </Group>
            </Chip.Group>

            <Stack gap="sm">
              <Title order={2}>{tituloLista}</Title>
              {desafios === null ? (
                <EstadoCarregando rotulo="Carregando brincadeiras…" />
              ) : desafios.length === 0 ? (
                <EstadoVazio
                  titulo={
                    filtrandoCategoria
                      ? "Nada nesta categoria"
                      : filtro === "executadas"
                        ? "Nenhuma executada ainda"
                        : "Nenhuma brincadeira disponível"
                  }
                  descricao={
                    filtrandoCategoria
                      ? "Escolha outra categoria ou Todas."
                      : filtro === "executadas"
                        ? "Depois de registrar uma participação, ela aparece aqui."
                        : podeOrganizar
                          ? "Crie uma em Cadastros ou aguarde a biblioteca da família."
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
                            ? ` · ${ROTULOS_CATEGORIA_DESENVOLVIMENTO[desafio.categoria] ?? desafio.categoria}`
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
                    {recompensas === null ? (
                      <EstadoCarregando rotulo="Carregando recompensas…" />
                    ) : recompensas.length === 0 ? (
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
                              ? "Opcional. Cadastre em Cadastros se a família quiser."
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
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>

            <Text size="sm" c="dimmed">
              Evolução no{" "}
              <Anchor
                component={Link}
                href={rotaFamilia(String(params.slug ?? ""), `/pessoas/${params.pessoaId}/historico`)}
                size="sm"
              >
                histórico
              </Anchor>
              .
              {podeOrganizar ? (
                <>
                  {" "}
                  Novas brincadeiras e recompensas em{" "}
                  <Anchor component={Link} href={linkCadastros} size="sm">
                    Cadastros
                  </Anchor>
                  .
                </>
              ) : null}
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
                ? ` · ${ROTULOS_CATEGORIA_DESENVOLVIMENTO[selecionado.categoria] ?? selecionado.categoria}`
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
            {selecionado.adaptacoes ? (
              <Text size="sm" c="dimmed">
                Adaptações: {selecionado.adaptacoes}
              </Text>
            ) : null}
            {selecionado.supervisao ? (
              <Text size="sm" c="dimmed">
                Supervisão: {selecionado.supervisao}
              </Text>
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
