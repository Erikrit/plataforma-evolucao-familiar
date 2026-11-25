"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Alert,
  Button,
  Card,
  Drawer,
  Group,
  SegmentedControl,
  Select,
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
  ErroLimiteAtivas,
  escolherSugestaoDesafio,
  disponibilizarDesafio,
  listarDesafios,
  registrarParticipacaoDesafio,
  renovarSugestoesDesafio,
  retirarAtividadeAtiva,
  type DesafioResumo,
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

function faixaEtariaTexto(desafio: {
  faixaEtariaMin?: number | null;
  faixaEtariaMax?: number | null;
}) {
  if (desafio.faixaEtariaMin == null && desafio.faixaEtariaMax == null) return null;
  if (desafio.faixaEtariaMin != null && desafio.faixaEtariaMax != null) {
    return `${desafio.faixaEtariaMin}–${desafio.faixaEtariaMax} anos`;
  }
  if (desafio.faixaEtariaMin != null) return `a partir de ${desafio.faixaEtariaMin} anos`;
  return `até ${desafio.faixaEtariaMax} anos`;
}

function duracaoTexto(minutos: number | null | undefined) {
  if (minutos == null || minutos <= 0) return null;
  return `${minutos} min`;
}

export function BibliotecaAtividades({
  aoSaldoAlterado,
}: {
  aoSaldoAlterado?: () => void;
} = {}) {
  const { pessoaId, caminho, podeOrganizar } = useDesenvolvimento();
  const router = useRouter();
  const parametros = useSearchParams();
  const filtro: FiltroBrincadeira =
    parametros.get("lista") === "executadas" ? "executadas" : "explorar";
  const categoriaUrl = parametros.get("categoria");
  const categoria =
    OPCOES_CATEGORIA.find((opcao) => opcao.value === categoriaUrl)?.value ??
    TODAS_CATEGORIAS;
  const chaveLista = filtro + "/" + categoria;
  const [lista, setLista] = useState<{ chave: string; dados: DesafioResumo[] } | null>(null);
  const [erroLista, setErroLista] = useState<{ chave: string; mensagem: string } | null>(null);
  const desafios = lista?.chave === chaveLista ? lista.dados : null;
  const erroDesafios = erroLista?.chave === chaveLista ? erroLista.mensagem : null;
  const [sugestoesAbertas, setSugestoesAbertas] = useState(false);
  const [sugestoes, setSugestoes] = useState<SugestaoDesafio[] | null>(null);
  const [mensagemSugestoes, setMensagemSugestoes] = useState<string | null>(null);
  const [erroSugestoes, setErroSugestoes] = useState<string | null>(null);
  const [statusRenovacao, setStatusRenovacao] = useState<string | null>(null);
  const [carregandoSugestoes, setCarregandoSugestoes] = useState(false);
  const [renovando, setRenovando] = useState(false);
  const [escolhendoId, setEscolhendoId] = useState<string | null>(null);
  const [retirando, setRetirando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [avisoLimite, setAvisoLimite] = useState<{
    mensagem: string;
    categoria: string | null;
  } | null>(null);
  const [selecionado, setSelecionado] = useState<DesafioResumo | null>(null);
  const [observacao, setObservacao] = useState("");
  const [chaveExecucao, setChaveExecucao] = useState("");
  const [registrando, setRegistrando] = useState(false);
  const [disponibilizando, setDisponibilizando] = useState(false);
  const requisicaoDesafios = useRef(0);
  const requisicaoSugestoes = useRef(0);
  const sugerindoTrava = useRef(false);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const tituloCatalogo = useRef<HTMLHeadingElement>(null);
  const focarCatalogoAoFechar = useRef(false);
  const pessoaAnterior = useRef(pessoaId);
  const ehCelular = useMediaQuery("(max-width: 47.99em)", true);

  function anunciarFeedback() {
    window.requestAnimationFrame(() => {
      feedbackRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      feedbackRef.current?.focus();
    });
  }

  function sugestaoParaDesafio(item: SugestaoDesafio): DesafioResumo {
    return {
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
      escolhida: false,
      disponivelParaNovaParticipacao: true,
      estadoDisponibilidade: "explorar",
    };
  }

  const carregarDesafios = useCallback(async () => {
    const requisicao = ++requisicaoDesafios.current;
    setErroLista(null);
    try {
      const lista = await listarDesafios(pessoaId, {
        disponibilidade: filtro,
        categoria: categoria === TODAS_CATEGORIAS ? undefined : categoria,
      });
      if (requisicao === requisicaoDesafios.current) {
        setLista({ chave: chaveLista, dados: lista.desafios });
      }
    } catch (erro) {
      if (requisicao === requisicaoDesafios.current) {
        setErroLista({
          chave: chaveLista,
          mensagem: mensagemErroAmigavel(erro, "Não foi possível carregar atividades."),
        });
      }
    }
  }, [pessoaId, filtro, categoria, chaveLista]);

  useEffect(() => {
    void carregarDesafios();
    return () => {
      requisicaoDesafios.current += 1;
    };
  }, [carregarDesafios]);

  useEffect(() => {
    if (pessoaAnterior.current !== pessoaId) {
      pessoaAnterior.current = pessoaId;
      setSugestoesAbertas(false);
      setSugestoes(null);
      setMensagemSugestoes(null);
      setStatusRenovacao(null);
      setErroSugestoes(null);
      setAvisoLimite(null);
      setSucesso(null);
      setErro(null);
    }
  }, [pessoaId]);

  function atualizarFiltros(
    proximoFiltro: FiltroBrincadeira,
    proximaCategoria: string,
    fecharSugestoes = true,
  ) {
    const consulta = new URLSearchParams(parametros.toString());
    if (proximoFiltro === "explorar") consulta.delete("lista");
    else consulta.set("lista", proximoFiltro);
    if (proximaCategoria === TODAS_CATEGORIAS) consulta.delete("categoria");
    else consulta.set("categoria", proximaCategoria);
    const query = consulta.toString();
    router.replace(caminho + "/biblioteca" + (query ? "?" + query : ""), {
      scroll: false,
    });
    if (fecharSugestoes) {
      setSugestoesAbertas(false);
      setSugestoes(null);
      setMensagemSugestoes(null);
      setStatusRenovacao(null);
      setAvisoLimite(null);
    }
  }

  const filtrandoCategoria = categoria !== TODAS_CATEGORIAS;
  const tituloLista =
    filtro === "executadas" ? "Executadas" : "Atividades ativas";

  async function pedirSugestoes(renovar: boolean) {
    if (!podeOrganizar) {
      setErro(
        "É necessário ser responsável de desenvolvimento para sugerir brincadeiras.",
      );
      anunciarFeedback();
      return;
    }
    if (sugerindoTrava.current || escolhendoId) return;
    sugerindoTrava.current = true;
    const requisicao = ++requisicaoSugestoes.current;
    setRenovando(true);
    setCarregandoSugestoes(true);
    setErro(null);
    setSucesso(null);
    setErroSugestoes(null);
    setStatusRenovacao(null);
    setAvisoLimite(null);
    // Abre a área de sugestões já na tentativa, para o erro/sucesso ficar visível.
    setSugestoesAbertas(true);
    try {
      const resp = await renovarSugestoesDesafio(pessoaId, {
        categoria: categoria === TODAS_CATEGORIAS ? undefined : categoria,
      });
      if (requisicao !== requisicaoSugestoes.current) return;
      setSugestoes(resp.sugestoes);
      setMensagemSugestoes(resp.mensagem);
      if (resp.trocadas === 0) {
        setStatusRenovacao(
          resp.mensagem ?? "Não há novas sugestões disponíveis por agora",
        );
      } else if (renovar) {
        setStatusRenovacao(
          resp.mensagem ??
            `Renovamos ${resp.trocadas} sugest${resp.trocadas === 1 ? "ão" : "ões"}.`,
        );
      }
      anunciarFeedback();
    } catch (e) {
      if (requisicao === requisicaoSugestoes.current) {
        const mensagem = mensagemErroAmigavel(e, "Não foi possível sugerir");
        setErroSugestoes(mensagem);
        setErro(mensagem);
        setStatusRenovacao(null);
        setSugestoes([]);
        anunciarFeedback();
      }
    } finally {
      sugerindoTrava.current = false;
      setRenovando(false);
      setCarregandoSugestoes(false);
    }
  }

  async function aoDisponibilizarDesafio() {
    if (!selecionado || !podeOrganizar || disponibilizando) return;
    setDisponibilizando(true);
    setErro(null);
    setSucesso(null);
    try {
      await disponibilizarDesafio(pessoaId, selecionado.id);
      setSucesso(
        `“${selecionado.nome}” voltou a ficar disponível. Adicione às ativas se quiser experimentar de novo.`,
      );
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
      await carregarDesafios();
      aoSaldoAlterado?.();
    } catch (e) {
      setErro(
        mensagemErroAmigavel(e, "Não foi possível registrar. Tente de novo."),
      );
    } finally {
      setRegistrando(false);
    }
  }

  async function aoRetirarDasAtivas() {
    if (!selecionado || !podeOrganizar || retirando || registrando) return;
    setRetirando(true);
    setErro(null);
    setSucesso(null);
    try {
      await retirarAtividadeAtiva(pessoaId, selecionado.id);
      setSucesso("Atividade retirada. A vaga foi liberada.");
      focarCatalogoAoFechar.current = true;
      setSelecionado(null);
      await carregarDesafios();
    } catch (e) {
      setErro(mensagemErroAmigavel(e, "Não foi possível retirar"));
    } finally {
      setRetirando(false);
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
    abrirDesafio(sugestaoParaDesafio(item));
  }

  async function aoEscolherSugestao(item: SugestaoDesafio) {
    if (!podeOrganizar) {
      setErro("É necessário ser responsável de desenvolvimento para escolher.");
      anunciarFeedback();
      return;
    }
    if (escolhendoId || renovando || sugerindoTrava.current) return;
    setEscolhendoId(item.id);
    setErro(null);
    setSucesso(null);
    setStatusRenovacao(null);
    setAvisoLimite(null);
    try {
      const resp = await escolherSugestaoDesafio(pessoaId, item.id);
      setErroSugestoes(null);
      setSugestoes(resp.sugestoes ?? []);
      const mensagem = resp.jaEstavaEscolhida
        ? `“${item.nome}” já estava nas atividades ativas.`
        : `“${item.nome}” está nas atividades ativas.`;
      setSucesso(mensagem);
      // Atualização imediata da lista Ativas (não depende só do refetch).
      if (filtro === "explorar") {
        const ativo = {
          ...sugestaoParaDesafio(item),
          escolhida: true,
        };
        const entraNoFiltro =
          categoria === TODAS_CATEGORIAS || ativo.categoria === categoria;
        if (entraNoFiltro) {
          setLista((atual) => {
            const base = atual?.chave === chaveLista ? atual.dados : [];
            if (base.some((d) => d.id === ativo.id)) {
              return { chave: chaveLista, dados: base };
            }
            return { chave: chaveLista, dados: [ativo, ...base] };
          });
        }
      }
      anunciarFeedback();
      await carregarDesafios();
    } catch (e) {
      if (e instanceof ErroLimiteAtivas) {
        setAvisoLimite({
          mensagem: e.message,
          categoria: e.categoria,
        });
      } else {
        setErro(mensagemErroAmigavel(e, "Não foi possível escolher"));
      }
      anunciarFeedback();
    } finally {
      setEscolhendoId(null);
    }
  }

  function verAtividadesAtivasDaCategoria() {
    const cat = avisoLimite?.categoria;
    setAvisoLimite(null);
    setSugestoesAbertas(false);
    setSugestoes(null);
    setMensagemSugestoes(null);
    setStatusRenovacao(null);
    if (cat && OPCOES_CATEGORIA.some((o) => o.value === cat)) {
      atualizarFiltros("explorar", cat, true);
    } else {
      atualizarFiltros("explorar", categoria, true);
    }
  }

  const metaSelecionado = selecionado
    ? [
        ROTULOS_DIFICULDADE[selecionado.dificuldade] ?? selecionado.dificuldade,
        selecionado.categoria
          ? ROTULOS_CATEGORIA_DESENVOLVIMENTO[selecionado.categoria] ??
            selecionado.categoria
          : null,
        faixaEtariaTexto(selecionado),
        duracaoTexto(selecionado.duracaoMinutos),
      ]
        .filter(Boolean)
        .join(" · ")
    : "";

  const sugestaoSelecionada =
    selecionado &&
    sugestoesAbertas &&
    (sugestoes ?? []).some((item) => item.id === selecionado.id)
      ? selecionado
      : null;

  return (
    <Stack gap="lg">
      <div ref={feedbackRef} tabIndex={-1} style={{ outline: "none" }}>
        <MensagemFeedback
          erro={selecionado ? null : erro}
          sucesso={sucesso}
          duracaoSucessoMs={8000}
        />
      </div>
      {avisoLimite && !selecionado ? (
        <Alert
          color="yellow"
          variant="light"
          role="status"
          aria-live="polite"
          title="Limite de ativas"
        >
          <Stack gap="sm">
            <Text size="sm">{avisoLimite.mensagem}</Text>
            <Button variant="light" size="sm" onClick={verAtividadesAtivasDaCategoria}>
              Ver atividades ativas
            </Button>
          </Stack>
        </Alert>
      ) : null}
      <SegmentedControl
        fullWidth
        aria-label="Lista de atividades"
        value={filtro}
        onChange={(valor) =>
          atualizarFiltros(valor as FiltroBrincadeira, categoria)
        }
        data={[
          { label: "Ativas", value: "explorar" },
          { label: "Executadas", value: "executadas" },
        ]}
      />
      <Stack gap="sm" id="catalogo-atividades" style={{ scrollMarginTop: "5rem" }}>
        <Title order={2} ref={tituloCatalogo} tabIndex={-1}>
          {tituloLista}
        </Title>
        <Select
          label="Categoria"
          allowDeselect={false}
          value={categoria}
          data={OPCOES_CATEGORIA}
          onChange={(valor) =>
            atualizarFiltros(filtro, valor || TODAS_CATEGORIAS)
          }
        />
        {erroDesafios ? (
          <Stack align="flex-start">
            <EstadoVazio titulo="Atividades indisponíveis" descricao={erroDesafios} />
            <Button variant="light" onClick={() => void carregarDesafios()}>
              Tentar novamente
            </Button>
          </Stack>
        ) : desafios === null ? (
          <EsqueletoLista rotulo="Carregando brincadeiras…" linhas={4} />
        ) : desafios.length === 0 ? (
          <EstadoVazio
            titulo={
              filtrandoCategoria
                ? "Nenhuma atividade ativa nesta categoria"
                : filtro === "executadas"
                  ? "Nenhuma executada ainda"
                  : "Vocês ainda não escolheram uma brincadeira."
            }
            descricao={
              filtrandoCategoria
                ? "Escolha outra categoria ou Todas."
                : filtro === "executadas"
                  ? "Depois de registrar uma participação, ela aparece aqui."
                  : podeOrganizar
                    ? "Toque em Sugerir brincadeiras para ver opções."
                    : "Quando houver brincadeiras escolhidas, elas aparecem aqui."
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
                    {ROTULOS_DIFICULDADE[desafio.dificuldade] ?? desafio.dificuldade}
                    {desafio.categoria
                      ? ` · ${ROTULOS_CATEGORIA_DESENVOLVIMENTO[desafio.categoria] ?? desafio.categoria}`
                      : " · Sem categoria"}
                    {desafio.origem === "personalizada" ? " · Sua família" : ""}
                    {filtro === "executadas" && desafio.ultimaParticipacao
                      ? ` · Última: ${desafio.ultimaParticipacao.resultado}`
                      : ""}
                  </Text>
                </Stack>
              </Group>
            </Card>
          ))
        )}
        {filtro === "explorar" && podeOrganizar && !sugestoesAbertas ? (
          <Button
            loading={renovando}
            disabled={Boolean(escolhendoId)}
            onClick={() => void pedirSugestoes(false)}
          >
            Sugerir brincadeiras
          </Button>
        ) : null}
      </Stack>

      {filtro === "explorar" && sugestoesAbertas ? (
        <Stack gap="sm" id="sugestoes-pessoa">
          <Group justify="space-between" align="center" gap="xs">
            <Title order={2}>Sugestões</Title>
            {podeOrganizar ? (
              <Button
                variant="light"
                size="sm"
                loading={renovando}
                disabled={Boolean(escolhendoId) || carregandoSugestoes}
                onClick={() => void pedirSugestoes(true)}
              >
                Renovar sugestões
              </Button>
            ) : null}
          </Group>
          {mensagemSugestoes ? (
            <Text size="sm" c="dimmed">
              {mensagemSugestoes}
            </Text>
          ) : null}
          {statusRenovacao ? (
            <Alert
              color="azul"
              variant="light"
              role="status"
              aria-live="polite"
              title="Sugestões"
            >
              <Text size="sm">{statusRenovacao}</Text>
            </Alert>
          ) : null}
          {erroSugestoes ? (
            <Stack align="flex-start">
              <EstadoVazio titulo="Sugestões indisponíveis" descricao={erroSugestoes} />
              <Button variant="light" onClick={() => void pedirSugestoes(true)}>
                Tentar novamente
              </Button>
            </Stack>
          ) : carregandoSugestoes && sugestoes === null ? (
            <EsqueletoLista rotulo="Carregando sugestões…" linhas={2} />
          ) : !sugestoes || sugestoes.length === 0 ? (
            <EstadoVazio
              titulo="Nenhuma sugestão nesta lista"
              descricao="Toque em Renovar sugestões para procurar outra."
            />
          ) : (
            sugestoes.map((item) => (
              <Card key={item.id} withBorder padding="md" radius="md">
                <Stack gap="sm">
                  <UnstyledButton onClick={() => abrirSugestao(item)}>
                    <Group gap="sm" wrap="nowrap" align="flex-start">
                      <IconeBrincadeira />
                      <Stack gap={4}>
                        <Text fw={600}>{item.nome}</Text>
                        <Text size="sm" c="dimmed">
                          {ROTULOS_DIFICULDADE[item.dificuldade] ?? item.dificuldade}
                          {item.categoria
                            ? " · " +
                              (ROTULOS_CATEGORIA_DESENVOLVIMENTO[item.categoria] ??
                                item.categoria)
                            : ""}
                          {duracaoTexto(item.duracaoMinutos)
                            ? " · " + duracaoTexto(item.duracaoMinutos)
                            : ""}
                        </Text>
                        {item.instrucao ? (
                          <Text size="sm" lineClamp={ehCelular ? 2 : 3}>
                            {item.instrucao}
                          </Text>
                        ) : null}
                      </Stack>
                    </Group>
                  </UnstyledButton>
                  {podeOrganizar ? (
                    <Button
                      type="button"
                      size="sm"
                      loading={escolhendoId === item.id}
                      disabled={
                        renovando ||
                        (escolhendoId !== null && escolhendoId !== item.id)
                      }
                      onClick={(evento) => {
                        evento.preventDefault();
                        evento.stopPropagation();
                        void aoEscolherSugestao(item);
                      }}
                    >
                      Quero experimentar
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
          if (!registrando && !disponibilizando && !retirando) setSelecionado(null);
        }}
        position={ehCelular ? "bottom" : "right"}
        size={ehCelular ? "auto" : "md"}
        title={selecionado?.nome ?? "Brincadeira"}
        padding="md"
        closeOnEscape={!registrando && !disponibilizando && !retirando}
        closeOnClickOutside={!registrando && !disponibilizando && !retirando}
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
            {avisoLimite ? (
              <Alert color="yellow" variant="light" role="status">
                <Stack gap="sm">
                  <Text size="sm">{avisoLimite.mensagem}</Text>
                  <Button
                    variant="light"
                    size="sm"
                    onClick={verAtividadesAtivasDaCategoria}
                  >
                    Ver atividades ativas
                  </Button>
                </Stack>
              </Alert>
            ) : null}
            <Text size="sm" c="dimmed">
              {metaSelecionado}
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
                    disabled={registrando || retirando}
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
            ) : sugestaoSelecionada && podeOrganizar ? (
              <>
                <Text size="sm" c="dimmed">
                  Ainda não está nas ativas. Escolha para experimentar ou feche a ficha.
                </Text>
                <Button
                  type="button"
                  loading={escolhendoId === selecionado.id}
                  disabled={renovando || (escolhendoId !== null && escolhendoId !== selecionado.id)}
                  onClick={() => {
                    const item = (sugestoes ?? []).find((s) => s.id === selecionado.id);
                    if (!item) return;
                    void aoEscolherSugestao(item).then(() => {
                      focarCatalogoAoFechar.current = true;
                      setSelecionado(null);
                    });
                  }}
                >
                  Quero experimentar
                </Button>
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
                  disabled={registrando || retirando}
                />

                <Button
                  loading={registrando}
                  disabled={retirando}
                  leftSection={<IconeConcluiu compacto />}
                  onClick={() => void aoRegistrar("concluiu")}
                >
                  Concluiu
                </Button>
                <Button
                  variant="light"
                  loading={registrando}
                  disabled={retirando}
                  leftSection={<IconeParticipou compacto />}
                  onClick={() => void aoRegistrar("participou")}
                >
                  Participou
                </Button>
                {podeOrganizar && selecionado.escolhida ? (
                  <Button
                    variant="subtle"
                    loading={retirando}
                    disabled={registrando}
                    onClick={() => void aoRetirarDasAtivas()}
                  >
                    Retirar das ativas
                  </Button>
                ) : null}
              </>
            )}
            <Button
              variant="subtle"
              disabled={registrando || disponibilizando || retirando}
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
