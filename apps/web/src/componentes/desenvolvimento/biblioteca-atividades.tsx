"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Alert,
  Button,
  Card,
  Chip,
  Drawer,
  Group,
  SegmentedControl,
  Stack,
  Text,
  Textarea,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useDesenvolvimento } from "@/componentes/contexto-desenvolvimento";
import {
  EsqueletoLista,
  EstadoVazio,
  MensagemFeedback,
  mensagemErroAmigavel,
} from "@/componentes/feedback";
import { IconeBrincadeira, IconeConcluiu, IconeParticipou } from "@/componentes/icones-experiencia";
import {
  escolherSugestaoDesafio,
  disponibilizarDesafio,
  listarDesafios,
  listarSugestoesDesafio,
  obterEstrelas,
  registrarParticipacaoDesafio,
  renovarSugestoesDesafio,
  type DesafioResumo,
  type EstrelasResumo,
  type SugestaoDesafio,
} from "@/lib/api";
import { novaChaveOperacao } from "@/lib/chave-operacao";
import { ROTULOS_CATEGORIA_DESENVOLVIMENTO } from "@/lib/rotulos-experiencia";

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

export function BibliotecaAtividades() {
  const { pessoaId, caminho, podeOrganizar } = useDesenvolvimento();
  const router = useRouter();
  const parametros = useSearchParams();
  const filtro: FiltroBrincadeira = parametros.get("lista") === "executadas" ? "executadas" : "explorar";
  const categoriaUrl = parametros.get("categoria");
  const categoria = OPCOES_CATEGORIA.find((opcao) => opcao.value === categoriaUrl)?.value ?? TODAS_CATEGORIAS;
  const chaveLista = filtro + "/" + categoria;
  const [lista, setLista] = useState<{ chave: string; dados: DesafioResumo[] } | null>(null);
  const [erroLista, setErroLista] = useState<{ chave: string; mensagem: string } | null>(null);
  const desafios = lista?.chave === chaveLista ? lista.dados : null;
  const erroDesafios = erroLista?.chave === chaveLista ? erroLista.mensagem : null;
  const [sugestoes, setSugestoes] = useState<SugestaoDesafio[] | null>(null);
  const [mensagemSugestoes, setMensagemSugestoes] = useState<string | null>(null);
  const [erroSugestoes, setErroSugestoes] = useState<string | null>(null);
  const [statusRenovacao, setStatusRenovacao] = useState<string | null>(null);
  const [carregandoSugestoes, setCarregandoSugestoes] = useState(true);
  const [renovando, setRenovando] = useState(false);
  const [escolhendoId, setEscolhendoId] = useState<string | null>(null);
  const [estrelas, setEstrelas] = useState<EstrelasResumo | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [selecionado, setSelecionado] = useState<DesafioResumo | null>(null);
  const [observacao, setObservacao] = useState("");
  const [chaveExecucao, setChaveExecucao] = useState("");
  const [registrando, setRegistrando] = useState(false);
  const [disponibilizando, setDisponibilizando] = useState(false);
  const requisicaoDesafios = useRef(0);
  const requisicaoSugestoes = useRef(0);
  const tituloCatalogo = useRef<HTMLHeadingElement>(null);
  const focarCatalogoAoFechar = useRef(false);
  const ehCelular = useMediaQuery("(max-width: 47.99em)", true);

  const carregarSugestoes = useCallback(async () => {
    const requisicao = ++requisicaoSugestoes.current;
    setCarregandoSugestoes(true);
    setErroSugestoes(null);
    try {
      const lista = await listarSugestoesDesafio(pessoaId);
      if (requisicao !== requisicaoSugestoes.current) return;
      setSugestoes(lista.sugestoes);
      setMensagemSugestoes(lista.mensagem);
    } catch (erro) {
      if (requisicao === requisicaoSugestoes.current) {
        setErroSugestoes(mensagemErroAmigavel(erro, "Não foi possível carregar sugestões."));
      }
    } finally {
      if (requisicao === requisicaoSugestoes.current) setCarregandoSugestoes(false);
    }
  }, [pessoaId]);

  const carregarDesafios = useCallback(async () => {
    const requisicao = ++requisicaoDesafios.current;
    setErroLista(null);
    try {
      const lista = await listarDesafios(pessoaId, {
        disponibilidade: filtro,
        categoria: categoria === TODAS_CATEGORIAS ? undefined : categoria,
      });
      if (requisicao === requisicaoDesafios.current) setLista({ chave: chaveLista, dados: lista.desafios });
    } catch (erro) {
      if (requisicao === requisicaoDesafios.current) {
        setErroLista({ chave: chaveLista, mensagem: mensagemErroAmigavel(erro, "Não foi possível carregar atividades.") });
      }
    }
  }, [pessoaId, filtro, categoria, chaveLista]);

  const carregarSaldo = useCallback(async () => {
    try {
      setEstrelas(await obterEstrelas(pessoaId));
    } catch {
      setEstrelas(null);
    }
  }, [pessoaId]);

  useEffect(() => {
    void carregarSugestoes();
    void carregarSaldo();
  }, [carregarSugestoes, carregarSaldo]);

  useEffect(() => {
    void carregarDesafios();
    return () => { requisicaoDesafios.current += 1; };
  }, [carregarDesafios]);

  function atualizarFiltros(proximoFiltro: FiltroBrincadeira, proximaCategoria: string) {
    const consulta = new URLSearchParams(parametros.toString());
    if (proximoFiltro === "explorar") consulta.delete("lista");
    else consulta.set("lista", proximoFiltro);
    if (proximaCategoria === TODAS_CATEGORIAS) consulta.delete("categoria");
    else consulta.set("categoria", proximaCategoria);
    const query = consulta.toString();
    router.replace(caminho + "/biblioteca" + (query ? "?" + query : ""), { scroll: false });
  }

  const filtrandoCategoria = categoria !== TODAS_CATEGORIAS;
  const tituloLista = filtro === "executadas" ? "Brincadeiras executadas" : "Brincadeiras para explorar";

  async function aoDisponibilizarDesafio() {
    if (!selecionado || !podeOrganizar || disponibilizando) return;
    setDisponibilizando(true);
    setErro(null);
    setSucesso(null);
    try {
      await disponibilizarDesafio(pessoaId, selecionado.id);
      setSucesso(`“${selecionado.nome}” voltou para Explorar.`);
      focarCatalogoAoFechar.current = true;
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
      const registro = await registrarParticipacaoDesafio(pessoaId, {
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
      setChaveExecucao(novaChaveOperacao());
      focarCatalogoAoFechar.current = true;
      setSelecionado(null);
      await Promise.all([
        carregarDesafios(),
        carregarSaldo(),
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
    setChaveExecucao(novaChaveOperacao());
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
    if (!podeOrganizar || escolhendoId || renovando || carregandoSugestoes) return;
    setEscolhendoId(item.id);
    setErro(null);
    setSucesso(null);
    setStatusRenovacao(null);
    try {
      const resp = await escolherSugestaoDesafio(pessoaId, item.id);
      requisicaoSugestoes.current += 1;
      setCarregandoSugestoes(false);
      setErroSugestoes(null);
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
    if (!podeOrganizar || renovando || escolhendoId || carregandoSugestoes) return;
    setRenovando(true);
    setErro(null);
    setSucesso(null);
    setStatusRenovacao(null);
    try {
      const resp = await renovarSugestoesDesafio(pessoaId);
      requisicaoSugestoes.current += 1;
      setCarregandoSugestoes(false);
      setErroSugestoes(null);
      setSugestoes(resp.sugestoes);
      setMensagemSugestoes(resp.mensagem);
      // Feedback junto da seção (não no topo), para permanecer visível após o catálogo.
      if (resp.trocadas === 0) {
        setStatusRenovacao(
          resp.mensagem ?? "Não há novas sugestões disponíveis no momento",
        );
      } else {
        setStatusRenovacao(
          resp.mensagem ??
            `Renovamos ${resp.trocadas} sugest${resp.trocadas === 1 ? "ão" : "ões"}. Escolhas mantidas.`,
        );
      }
    } catch (e) {
      setErro(mensagemErroAmigavel(e, "Não foi possível renovar"));
      setStatusRenovacao(null);
    } finally {
      setRenovando(false);
    }
  }

  return (
    <Stack gap="lg">
      {estrelas ? (
        <Text size="sm" fw={600} c="azul" aria-live="polite">
          Saldo: {estrelas.saldoDisponivel} {estrelas.saldoDisponivel === 1 ? "estrela" : "estrelas"}
        </Text>
      ) : null}
      <MensagemFeedback erro={selecionado ? null : erro} sucesso={sucesso} />
      <SegmentedControl
        fullWidth
        aria-label="Lista de atividades"
        value={filtro}
        onChange={(valor) => atualizarFiltros(valor as FiltroBrincadeira, categoria)}
        data={[
          { label: "Explorar", value: "explorar" },
          { label: "Executadas", value: "executadas" },
        ]}
      />
      <Stack gap="sm" id="catalogo-atividades" style={{ scrollMarginTop: "5rem" }}>
        <Title order={2} ref={tituloCatalogo} tabIndex={-1}>{tituloLista}</Title>
        <Chip.Group
          multiple={false}
          value={categoria}
          onChange={(valor) => atualizarFiltros(filtro, valor || TODAS_CATEGORIAS)}
        >
          <Group gap="xs" role="radiogroup" aria-label="Categoria">
            {OPCOES_CATEGORIA.map((opcao) => (
              <Chip key={opcao.value} value={opcao.value} size="sm">
                {opcao.label}
              </Chip>
            ))}
          </Group>
        </Chip.Group>
        {erroDesafios ? (
          <Stack align="flex-start">
            <EstadoVazio titulo="Atividades indisponíveis" descricao={erroDesafios} />
            <Button variant="light" onClick={() => void carregarDesafios()}>Tentar novamente</Button>
          </Stack>
        ) : desafios === null ? (
          <EsqueletoLista rotulo="Carregando brincadeiras…" linhas={4} />
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
      {filtro === "explorar" ? (
        <Stack gap="sm" id="sugestoes-pessoa">
          <Group justify="space-between" align="center" gap="xs">
            <Title order={2}>Sugestões para esta pessoa</Title>
            {podeOrganizar ? (
              <Button
                variant="light"
                size="sm"
                loading={renovando}
                disabled={Boolean(escolhendoId) || carregandoSugestoes}
                onClick={() => void aoRenovarSugestoes()}
              >
                Renovar sugestões
              </Button>
            ) : null}
          </Group>
          {mensagemSugestoes ? <Text size="sm" c="dimmed">{mensagemSugestoes}</Text> : null}
          {statusRenovacao ? (
            <Alert color="azul" variant="light" role="status" aria-live="polite" title="Sugestões">
              <Text size="sm">{statusRenovacao}</Text>
            </Alert>
          ) : null}
          {erroSugestoes ? (
            <Stack align="flex-start">
              <EstadoVazio titulo="Sugestões indisponíveis" descricao={erroSugestoes} />
              <Button variant="light" onClick={() => void carregarSugestoes()}>Tentar novamente</Button>
            </Stack>
          ) : sugestoes === null || carregandoSugestoes ? (
            <EsqueletoLista rotulo="Carregando sugestões…" linhas={3} />
          ) : sugestoes.length === 0 ? (
            <EstadoVazio titulo="Sem sugestões agora" />
          ) : (
            sugestoes.map((item) => (
              <Card key={item.id} withBorder padding="md" radius="md">
                <Stack gap="sm">
                  <UnstyledButton onClick={() => abrirSugestao(item)}>
                    <Group gap="sm" wrap="nowrap" align="flex-start">
                      <IconeBrincadeira />
                      <Stack gap={4}>
                        <Text fw={600}>{item.nome}{item.escolhida ? " · Escolhida" : ""}</Text>
                        <Text size="sm" c="dimmed">
                          {ROTULOS_DIFICULDADE[item.dificuldade] ?? item.dificuldade}
                          {item.categoria ? " · " + (ROTULOS_CATEGORIA_DESENVOLVIMENTO[item.categoria] ?? item.categoria) : ""}
                        </Text>
                        {item.instrucao ? <Text size="sm" lineClamp={ehCelular ? 2 : 3}>{item.instrucao}</Text> : null}
                      </Stack>
                    </Group>
                  </UnstyledButton>
                  {podeOrganizar && !item.escolhida ? (
                    <Button
                      variant="light"
                      size="sm"
                      loading={escolhendoId === item.id}
                      disabled={carregandoSugestoes || renovando || (escolhendoId !== null && escolhendoId !== item.id)}
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
      ) : null}

    <Drawer
      opened={Boolean(selecionado)}
      onClose={() => {
        if (!registrando && !disponibilizando) setSelecionado(null);
      }}
      position={ehCelular ? "bottom" : "right"}
      size={ehCelular ? "auto" : "md"}
      title={selecionado?.nome ?? "Brincadeira"}
      padding="md"
      closeOnEscape={!registrando && !disponibilizando}
      closeOnClickOutside={!registrando && !disponibilizando}
        returnFocus={!focarCatalogoAoFechar.current}
        onExitTransitionEnd={() => {
          if (focarCatalogoAoFechar.current) {
            tituloCatalogo.current?.focus();
            focarCatalogoAoFechar.current = false;
          }
        }}
    >
      {selecionado ? (
        <Stack gap="md" pb="md">
          <MensagemFeedback erro={erro} />
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
    </Stack>
  );
}
