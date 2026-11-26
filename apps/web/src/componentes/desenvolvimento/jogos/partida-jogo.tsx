"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Button,
  Drawer,
  Group,
  Modal,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useDesenvolvimento } from "@/componentes/contexto-desenvolvimento";
import { EstadoCarregando, mensagemErroAmigavel } from "@/componentes/feedback";
import {
  concluirJogo,
  ErroApi,
  iniciarJogo,
  type ConteudoPartida,
  type FaseJogoResumo,
  type InicioPartida,
  type JogoResumo,
} from "@/lib/api";
import { novaChaveOperacao } from "@/lib/chave-operacao";
import { consultaCatalogoJogos } from "@/lib/filtros-jogos";
import { agruparPorTrilha } from "@/lib/trilhas-jogos";
import { TabuleiroMemoria } from "./tabuleiro-memoria";
import { TabuleiroSequencia } from "./tabuleiro-sequencia";
import { TabuleiroEscolha } from "./tabuleiro-escolha";
import { TabuleiroOrdenacao } from "./tabuleiro-ordenacao";
import { TabuleiroLabirinto } from "./tabuleiro-labirinto";
import { TabuleiroSudoku } from "./tabuleiro-sudoku";
import { TabuleiroRobo } from "./tabuleiro-robo";
import type { ContratoTabuleiro, ObterDica } from "./contrato-tabuleiro";
import estilos from "./jogos.module.css";

const ROTULOS_ESTADO_FASE: Record<FaseJogoResumo["estado"], string> = {
  nao_explorada: "Não explorada",
  experimentada: "Experimentada",
  concluida: "Concluída",
};

type Mesa = InicioPartida & { chave: string };
type Etapa =
  | { tipo: "erro"; mensagem: string }
  | { tipo: "abrindo" | "salvando" }
  | { tipo: "jogando"; mesa: Mesa }
  | { tipo: "pendente"; mesa: Mesa; erro: string }
  | { tipo: "salva"; descoberta: boolean }
  | { tipo: "indisponivel" };

function Tabuleiro({
  conteudo,
  aoConcluir,
  registrarObterDica,
}: {
  conteudo: ConteudoPartida;
} & ContratoTabuleiro) {
  switch (conteudo.tipo) {
    case "memoria":
      return (
        <TabuleiroMemoria
          cartas={conteudo.cartas}
          aoConcluir={aoConcluir}
          registrarObterDica={registrarObterDica}
        />
      );
    case "sequencia":
      return (
        <TabuleiroSequencia
          conteudo={conteudo}
          aoConcluir={aoConcluir}
          registrarObterDica={registrarObterDica}
        />
      );
    case "escolha":
      return (
        <TabuleiroEscolha
          conteudo={conteudo}
          aoConcluir={aoConcluir}
          registrarObterDica={registrarObterDica}
        />
      );
    case "ordenacao":
      return (
        <TabuleiroOrdenacao
          conteudo={conteudo}
          aoConcluir={aoConcluir}
          registrarObterDica={registrarObterDica}
        />
      );
    case "labirinto":
      return (
        <TabuleiroLabirinto
          conteudo={conteudo}
          aoConcluir={aoConcluir}
          registrarObterDica={registrarObterDica}
        />
      );
    case "sudoku":
      return (
        <TabuleiroSudoku
          conteudo={conteudo}
          aoConcluir={aoConcluir}
          registrarObterDica={registrarObterDica}
        />
      );
    case "robo":
      return (
        <TabuleiroRobo
          conteudo={conteudo}
          aoConcluir={aoConcluir}
          registrarObterDica={registrarObterDica}
        />
      );
  }
}

export function PartidaJogo({
  jogo,
  fase,
  retorno,
}: {
  jogo: JogoResumo;
  fase: FaseJogoResumo;
  retorno: string;
}) {
  const { pessoaId, caminho } = useDesenvolvimento();
  const busca = useSearchParams();
  const ehCelular = useMediaQuery("(max-width: 47.99em)", true);
  const [etapa, setEtapa] = useState<Etapa>({ tipo: "abrindo" });
  const [modalDicaAberto, setModalDicaAberto] = useState(false);
  const [escolhaFaseAberta, setEscolhaFaseAberta] = useState(false);
  const [dicaDaPartida, setDicaDaPartida] = useState<string | null>(null);
  const [dicaPronta, setDicaPronta] = useState(false);
  const requisicao = useRef<AbortController | null>(null);
  const obterDicaRef = useRef<ObterDica | null>(null);
  const titulo = useRef<HTMLHeadingElement>(null);
  const focoEstado = useRef<HTMLHeadingElement>(null);
  const focoCelebracao = useRef<HTMLHeadingElement>(null);

  const consultaCatalogo = consultaCatalogoJogos({
    categoria: busca.get("categoria"),
    fases: busca.get("fases"),
  });
  const proximaFase = useMemo(
    () => jogo.fases.find((item) => item.numero === fase.numero + 1) ?? null,
    [jogo.fases, fase.numero],
  );
  const hrefProximaFase = proximaFase
    ? `${caminho}/biblioteca/jogos/${jogo.id}/fases/${proximaFase.numero}/jogar${consultaCatalogo}`
    : null;
  /** Celebra conclusão do jogo só quando todas as fases estão confirmadas (E5-ACE-13). */
  const jogoCompletoAposEstaFase = useMemo(
    () =>
      jogo.fases.length > 0 &&
      jogo.fases.every(
        (item) =>
          item.numero === fase.numero || item.estado === "concluida",
      ),
    [jogo.fases, fase.numero],
  );

  const registrarObterDica = useCallback((obter: ObterDica | null) => {
    obterDicaRef.current = obter;
    setDicaPronta(obter != null);
  }, []);

  useEffect(() => {
    titulo.current?.focus();
    return () => requisicao.current?.abort();
  }, []);

  useEffect(() => {
    if (etapa.tipo === "salva") {
      focoCelebracao.current?.focus();
      return;
    }
    if (
      etapa.tipo === "pendente" ||
      etapa.tipo === "indisponivel" ||
      etapa.tipo === "erro"
    ) {
      focoEstado.current?.focus();
    }
  }, [etapa.tipo]);

  function acessoIndisponivel(erro: unknown) {
    return erro instanceof ErroApi && [401, 403, 404].includes(erro.status ?? 0);
  }

  const comecar = useCallback(async () => {
    if (requisicao.current) return;
    const controle = new AbortController();
    requisicao.current = controle;
    setModalDicaAberto(false);
    setDicaDaPartida(null);
    setDicaPronta(false);
    obterDicaRef.current = null;
    setEtapa({ tipo: "abrindo" });
    try {
      const partida = await iniciarJogo(
        pessoaId,
        jogo.id,
        fase.numero,
        controle.signal,
      );
      if (!controle.signal.aborted) {
        setEtapa({
          tipo: "jogando",
          mesa: { ...partida, chave: novaChaveOperacao() },
        });
      }
    } catch (erro) {
      if (controle.signal.aborted) return;
      setEtapa(
        acessoIndisponivel(erro)
          ? { tipo: "indisponivel" }
          : {
              tipo: "erro",
              mensagem: mensagemErroAmigavel(
                erro,
                "Não foi possível abrir a fase.",
              ),
            },
      );
    } finally {
      if (requisicao.current === controle) requisicao.current = null;
    }
  }, [pessoaId, jogo.id, fase.numero]);

  useEffect(() => {
    const inicio = window.setTimeout(() => void comecar(), 0);
    return () => {
      window.clearTimeout(inicio);
      requisicao.current?.abort();
      requisicao.current = null;
    };
  }, [comecar]);

  async function salvar(mesa: Mesa) {
    if (requisicao.current) return;
    const controle = new AbortController();
    requisicao.current = controle;
    setEtapa({ tipo: "salvando" });
    try {
      const resposta = await concluirJogo(
        pessoaId,
        jogo.id,
        fase.numero,
        { versao: mesa.versao, chave: mesa.chave },
        controle.signal,
      );
      if (!controle.signal.aborted) {
        setEtapa({ tipo: "salva", descoberta: resposta.primeiraDescoberta });
      }
    } catch (erro) {
      if (controle.signal.aborted) return;
      if (acessoIndisponivel(erro)) {
        setEtapa({ tipo: "indisponivel" });
      } else if (erro instanceof ErroApi && erro.status === 409) {
        setEtapa({ tipo: "erro", mensagem: erro.message });
      } else {
        setEtapa({
          tipo: "pendente",
          mesa,
          erro: mensagemErroAmigavel(
            erro,
            "Tente confirmar o registro desta fase novamente.",
          ),
        });
      }
    } finally {
      if (requisicao.current === controle) requisicao.current = null;
    }
  }

  function abrirDica() {
    // Recalcula a cada pedido: no labirinto, na entrega e na memória a dica
    // depende da posição atual (E5-F04). Sem dica nova, mantém a anterior.
    if (etapa.tipo === "jogando" && obterDicaRef.current) {
      const gerada = obterDicaRef.current();
      if (gerada) setDicaDaPartida(gerada);
      else if (dicaDaPartida == null) return;
    } else if (dicaDaPartida == null) {
      return;
    }
    setModalDicaAberto(true);
  }

  const podeAbrirDica =
    dicaDaPartida != null || (etapa.tipo === "jogando" && dicaPronta);

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-start" wrap="wrap">
        <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
          <Title order={1} ref={titulo} tabIndex={-1} size="h2">
            {jogo.nome} · Fase {fase.numero}
          </Title>
          <Text size="sm" c="dimmed">
            {fase.titulo}
          </Text>
        </Stack>
        <Group gap="xs" wrap="wrap">
          <Button
            variant="light"
            onClick={() => setEscolhaFaseAberta(true)}
            style={{ minHeight: 44 }}
          >
            Escolher fase
          </Button>
          <Button
            variant="default"
            onClick={abrirDica}
            disabled={!podeAbrirDica}
            style={{ minHeight: 44 }}
          >
            Dica
          </Button>
        </Group>
      </Group>

      <Drawer
        opened={escolhaFaseAberta}
        onClose={() => setEscolhaFaseAberta(false)}
        position={ehCelular ? "bottom" : "right"}
        title="Escolher fase"
        padding="md"
        size={ehCelular ? "auto" : "md"}
      >
        <Stack gap="md">
          {agruparPorTrilha(jogo.fases).map((grupo, _indice, grupos) => (
            <Stack key={grupo.trilha} gap="xs">
              {grupos.length > 1 ? (
                <Title order={3} size="sm">
                  {grupo.nome}
                </Title>
              ) : null}
              {grupo.fases.map((item) => {
                const atual = item.numero === fase.numero;
                const href = `${caminho}/biblioteca/jogos/${jogo.id}/fases/${item.numero}/jogar${consultaCatalogo}`;
                const conteudo = (
                  <>
                    <Text fw={600} size="sm">
                      Fase {item.numero} · {item.titulo}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {ROTULOS_ESTADO_FASE[item.estado]}
                      {atual ? " · atual" : ""}
                    </Text>
                  </>
                );
                const estilo = {
                  display: "block" as const,
                  minHeight: 44,
                  padding: "0.65rem 0.75rem",
                  borderRadius: 8,
                  border: "1px solid #C9D8F2",
                  opacity: atual ? 0.7 : 1,
                };
                if (atual) {
                  return (
                    <div
                      key={item.numero}
                      aria-current="page"
                      aria-label={`Fase ${item.numero}, ${item.titulo}, ${ROTULOS_ESTADO_FASE[item.estado]}`}
                      style={estilo}
                    >
                      {conteudo}
                    </div>
                  );
                }
                return (
                  <UnstyledButton
                    key={item.numero}
                    type="button"
                    component={Link}
                    href={href}
                    aria-label={`Fase ${item.numero}, ${item.titulo}, ${ROTULOS_ESTADO_FASE[item.estado]}`}
                    onClick={() => setEscolhaFaseAberta(false)}
                    style={estilo}
                  >
                    {conteudo}
                  </UnstyledButton>
                );
              })}
            </Stack>
          ))}
        </Stack>
      </Drawer>

      <Modal
        opened={modalDicaAberto}
        onClose={() => setModalDicaAberto(false)}
        title={jogo.nome}
        centered
        radius="md"
        size="md"
        padding="md"
        overlayProps={{ backgroundOpacity: 0.45, blur: 1 }}
        transitionProps={{ transition: "fade", duration: 150 }}
        aria-describedby="conteudo-dica-partida"
      >
        <Stack id="conteudo-dica-partida" gap="md">
          <Stack gap={4}>
            <Text fw={600}>Como jogar</Text>
            <Text size="sm">{jogo.instrucoes}</Text>
          </Stack>
          <Stack gap={4}>
            <Text fw={600}>Dica desta fase</Text>
            <Text size="sm" role="status">
              {dicaDaPartida ?? fase.objetivo}
            </Text>
          </Stack>
          <Button onClick={() => setModalDicaAberto(false)}>Fechar</Button>
        </Stack>
      </Modal>

      {etapa.tipo === "erro" ? (
        <Alert color="red" role="alert">
          <Stack align="flex-start">
            <Title order={2} size="h4" ref={focoEstado} tabIndex={-1}>
              Não foi possível continuar
            </Title>
            <Text size="sm">{etapa.mensagem}</Text>
            <Button onClick={() => void comecar()}>Tentar novamente</Button>
          </Stack>
        </Alert>
      ) : null}

      {etapa.tipo === "abrindo" ? (
        <EstadoCarregando rotulo="Preparando a fase…" />
      ) : null}

      {etapa.tipo === "jogando" ? (
        <Tabuleiro
          conteudo={etapa.mesa.conteudo}
          aoConcluir={() => void salvar(etapa.mesa)}
          registrarObterDica={registrarObterDica}
        />
      ) : null}

      {etapa.tipo === "salvando" ? (
        <EstadoCarregando rotulo="Confirmando a conclusão…" />
      ) : null}

      {etapa.tipo === "pendente" ? (
        <Alert color="orange" role="alert">
          <Stack align="flex-start">
            <Title order={2} size="h4" ref={focoEstado} tabIndex={-1}>
              Salvamento pendente
            </Title>
            <Text>
              Você terminou a fase. O registro ainda precisa ser confirmado.
            </Text>
            <Text size="sm">{etapa.erro}</Text>
            <Button onClick={() => void salvar(etapa.mesa)}>
              Tentar salvar novamente
            </Button>
          </Stack>
        </Alert>
      ) : null}

      <Modal
        opened={etapa.tipo === "salva"}
        onClose={() => undefined}
        withCloseButton={false}
        closeOnClickOutside={false}
        closeOnEscape={false}
        centered
        radius="md"
        size="md"
        padding="md"
        overlayProps={{ backgroundOpacity: 0.45, blur: 1 }}
        transitionProps={{ transition: "fade", duration: 150 }}
        aria-labelledby="titulo-celebracao-fase"
        aria-describedby="texto-celebracao-fase"
      >
        {etapa.tipo === "salva" ? (
          <Stack
            gap="md"
            className={etapa.descoberta ? estilos.descoberta : undefined}
          >
            <Title
              order={2}
              size="h3"
              id="titulo-celebracao-fase"
              ref={focoCelebracao}
              tabIndex={-1}
            >
              {jogoCompletoAposEstaFase
                ? "Parabéns — todas as fases!"
                : "Fase concluída!"}
            </Title>
            <Text id="texto-celebracao-fase" role="status">
              {jogoCompletoAposEstaFase
                ? etapa.descoberta
                  ? "Você concluiu todas as fases deste jogo. Primeira descoberta registrada!"
                  : "Você concluiu todas as fases deste jogo. Progresso confirmado."
                : etapa.descoberta
                  ? "Primeira descoberta registrada. Que tal outra fase?"
                  : "Progresso confirmado. Você pode seguir ou escolher outra fase."}
            </Text>
            <Stack gap="sm">
              {hrefProximaFase ? (
                <Button component={Link} href={hrefProximaFase}>
                  Ir para próxima fase
                </Button>
              ) : null}
              <Button component={Link} href={retorno} variant="light">
                Voltar ao catálogo
              </Button>
              <Button variant="subtle" onClick={() => void comecar()}>
                Jogar esta fase de novo
              </Button>
            </Stack>
          </Stack>
        ) : null}
      </Modal>

      {etapa.tipo === "indisponivel" ? (
        <Alert color="orange">
          <Title order={2} size="h4" ref={focoEstado} tabIndex={-1}>
            Acesso à fase indisponível
          </Title>
        </Alert>
      ) : null}
    </Stack>
  );
}
