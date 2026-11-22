"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Alert, Button, Card, Group, Stack, Text, Title } from "@mantine/core";
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
import { TabuleiroMemoria } from "./tabuleiro-memoria";
import { TabuleiroSequencia } from "./tabuleiro-sequencia";
import { TabuleiroLabirinto } from "./tabuleiro-labirinto";
import estilos from "./jogos.module.css";

type Mesa = InicioPartida & { chave: string };
type Etapa =
  | { tipo: "instrucoes"; erro?: string }
  | { tipo: "abrindo" | "salvando" }
  | { tipo: "jogando"; mesa: Mesa }
  | { tipo: "pendente"; mesa: Mesa; erro: string }
  | { tipo: "salva"; descoberta: boolean }
  | { tipo: "indisponivel" };

function Tabuleiro({ conteudo, aoConcluir }: { conteudo: ConteudoPartida; aoConcluir: () => void }) {
  switch (conteudo.tipo) {
    case "memoria":
      return <TabuleiroMemoria cartas={conteudo.cartas} aoConcluir={aoConcluir} />;
    case "sequencia":
      return <TabuleiroSequencia conteudo={conteudo} aoConcluir={aoConcluir} />;
    case "labirinto":
      return <TabuleiroLabirinto conteudo={conteudo} aoConcluir={aoConcluir} />;
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
  const { pessoaId } = useDesenvolvimento();
  const [etapa, setEtapa] = useState<Etapa>({ tipo: "instrucoes" });
  const requisicao = useRef<AbortController | null>(null);
  const titulo = useRef<HTMLHeadingElement>(null);
  const focoEstado = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    titulo.current?.focus();
    return () => requisicao.current?.abort();
  }, []);

  useEffect(() => {
    if (etapa.tipo === "salva" || etapa.tipo === "pendente" || etapa.tipo === "indisponivel") {
      focoEstado.current?.focus();
    }
  }, [etapa.tipo]);

  function acessoIndisponivel(erro: unknown) {
    return erro instanceof ErroApi && [401, 403, 404].includes(erro.status ?? 0);
  }

  async function comecar() {
    if (requisicao.current) return;
    const controle = new AbortController();
    requisicao.current = controle;
    setEtapa({ tipo: "abrindo" });
    try {
      const partida = await iniciarJogo(pessoaId, jogo.id, fase.numero, controle.signal);
      if (!controle.signal.aborted) {
        setEtapa({ tipo: "jogando", mesa: { ...partida, chave: novaChaveOperacao() } });
      }
    } catch (erro) {
      if (controle.signal.aborted) return;
      setEtapa(acessoIndisponivel(erro)
        ? { tipo: "indisponivel" }
        : { tipo: "instrucoes", erro: mensagemErroAmigavel(erro, "Não foi possível abrir a fase.") });
    } finally {
      requisicao.current = null;
    }
  }

  async function salvar(mesa: Mesa) {
    if (requisicao.current) return;
    const controle = new AbortController();
    requisicao.current = controle;
    setEtapa({ tipo: "salvando" });
    try {
      const resposta = await concluirJogo(
        pessoaId, jogo.id, fase.numero, { versao: mesa.versao, chave: mesa.chave }, controle.signal,
      );
      if (!controle.signal.aborted) setEtapa({ tipo: "salva", descoberta: resposta.primeiraDescoberta });
    } catch (erro) {
      if (controle.signal.aborted) return;
      if (acessoIndisponivel(erro)) {
        setEtapa({ tipo: "indisponivel" });
      } else if (erro instanceof ErroApi && erro.status === 409) {
        setEtapa({ tipo: "instrucoes", erro: erro.message });
      } else {
        setEtapa({
          tipo: "pendente",
          mesa,
          erro: mensagemErroAmigavel(erro, "Tente confirmar o registro desta fase novamente."),
        });
      }
    } finally {
      requisicao.current = null;
    }
  }

  return (
    <Stack gap="lg">
      <Title order={1} ref={titulo} tabIndex={-1} size="h2">{jogo.nome} · Fase {fase.numero}</Title>
      {etapa.tipo === "instrucoes" ? (
        <Card withBorder padding="lg">
          <Stack align="flex-start">
            <Title order={2} size="h4">{fase.objetivo}</Title>
            <Text>{jogo.instrucoes}</Text>
            {etapa.erro ? <Alert color="red" role="alert">{etapa.erro}</Alert> : null}
            <Button onClick={() => void comecar()}>Começar</Button>
          </Stack>
        </Card>
      ) : null}
      {etapa.tipo === "abrindo" ? <EstadoCarregando rotulo="Preparando a fase…" /> : null}
      {etapa.tipo === "jogando" ? (
        <Tabuleiro conteudo={etapa.mesa.conteudo} aoConcluir={() => void salvar(etapa.mesa)} />
      ) : null}
      {etapa.tipo === "salvando" ? <EstadoCarregando rotulo="Confirmando a conclusão…" /> : null}
      {etapa.tipo === "pendente" ? (
        <Alert color="orange" role="alert">
          <Stack align="flex-start">
            <Title order={2} size="h4" ref={focoEstado} tabIndex={-1}>Salvamento pendente</Title>
            <Text>Você terminou a fase. O registro ainda precisa ser confirmado.</Text>
            <Text size="sm">{etapa.erro}</Text>
            <Button onClick={() => void salvar(etapa.mesa)}>Tentar salvar novamente</Button>
          </Stack>
        </Alert>
      ) : null}
      {etapa.tipo === "salva" ? (
        <Alert color="teal" className={etapa.descoberta ? estilos.descoberta : undefined}>
          <Stack align="flex-start">
            <Title order={2} size="h4" ref={focoEstado} tabIndex={-1}>Fase concluída</Title>
            <Text role="status">{etapa.descoberta ? "Primeira descoberta registrada!" : "Progresso confirmado."}</Text>
            <Group>
              <Button onClick={() => void comecar()}>Jogar novamente</Button>
              <Button component={Link} href={retorno} variant="light">Escolher outra fase</Button>
            </Group>
          </Stack>
        </Alert>
      ) : null}
      {etapa.tipo === "indisponivel" ? (
        <Alert color="orange">
          <Title order={2} size="h4" ref={focoEstado} tabIndex={-1}>Acesso à fase indisponível</Title>
        </Alert>
      ) : null}
    </Stack>
  );
}
