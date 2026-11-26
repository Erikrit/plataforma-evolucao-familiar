"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Group, Stack, Text } from "@mantine/core";
import type { ConteudoRobo } from "@/lib/api";
import type { ContratoTabuleiro } from "./contrato-tabuleiro";
import { DESLOCAMENTOS, dicaRobo, type Comando, type Direcao } from "./dicas-jogos";
import { Figura } from "./figura";
import estilos from "./jogos.module.css";

const SETAS: readonly { id: Direcao; nome: string; icone: string }[] = [
  { id: "cima", nome: "cima", icone: "↑" },
  { id: "esquerda", nome: "esquerda", icone: "←" },
  { id: "baixo", nome: "baixo", icone: "↓" },
  { id: "direita", nome: "direita", icone: "→" },
];
const ICONE: Record<Direcao, string> = { cima: "↑", baixo: "↓", esquerda: "←", direita: "→" };
/** Ticket 17: ritmo da animação, por casa (mais rápido com "reduzir movimento"). */
const PASSO_MS = 350;
const PASSO_REDUZIDO_MS = 120;

/**
 * Robô com setas (DEV-CAT-M1, ticket 12): a criança monta o programa inteiro
 * e só depois o robô anda. Tocar a mesma seta de novo soma uma casa ao último comando.
 */
export function TabuleiroRobo({
  conteudo,
  aoConcluir,
  registrarObterDica,
}: {
  conteudo: ConteudoRobo;
} & ContratoTabuleiro) {
  const [programa, setPrograma] = useState<Comando[]>([]);
  const [robo, setRobo] = useState(conteudo.inicio);
  const [mensagem, setMensagem] = useState("");
  const [animando, setAnimando] = useState(false);
  const concluiu = useRef(false);
  const temporizadores = useRef<number[]>([]);
  const programaAtual = useRef(programa);
  programaAtual.current = programa;
  const pedidosDica = useRef({ chave: "", nivel: 0 });
  const foco = useRef<HTMLDivElement>(null);

  useEffect(() => {
    foco.current?.focus();
  }, []);

  useEffect(() => () => temporizadores.current.forEach((id) => window.clearTimeout(id)), []);

  function agendar(acao: () => void, atrasoMs: number) {
    temporizadores.current.push(window.setTimeout(acao, atrasoMs));
  }

  useEffect(() => {
    registrarObterDica(() => {
      const chave = JSON.stringify(programaAtual.current);
      const pedidos = pedidosDica.current;
      pedidos.nivel = pedidos.chave === chave ? pedidos.nivel + 1 : 1;
      pedidos.chave = chave;
      const texto = dicaRobo(conteudo, programaAtual.current, pedidos.nivel);
      setMensagem(texto);
      return texto;
    });
    return () => registrarObterDica(null);
  }, [conteudo, registrarObterDica]);

  function acrescentar(direcao: Direcao) {
    if (concluiu.current || animando) return;
    setRobo(conteudo.inicio);
    setMensagem("");
    setPrograma((atual) => {
      const ultimo = atual[atual.length - 1];
      if (ultimo?.direcao === direcao) {
        return [...atual.slice(0, -1), { direcao, passos: ultimo.passos + 1 }];
      }
      return [...atual, { direcao, passos: 1 }];
    });
  }

  function apagar() {
    if (concluiu.current || animando) return;
    setRobo(conteudo.inicio);
    setMensagem("");
    setPrograma((atual) => {
      const ultimo = atual[atual.length - 1];
      if (!ultimo) return atual;
      return ultimo.passos > 1
        ? [...atual.slice(0, -1), { ...ultimo, passos: ultimo.passos - 1 }]
        : atual.slice(0, -1);
    });
  }

  /** Tira um comando do meio do programa sem desmontar o resto. */
  function remover(indice: number) {
    if (concluiu.current || animando) return;
    setRobo(conteudo.inicio);
    setMensagem(`Comando ${indice + 1} removido.`);
    setPrograma((atual) => atual.filter((_, i) => i !== indice));
  }

  /**
   * Ticket 17: o robô anda casa por casa. Ao bater ou parar antes da chegada, fica onde
   * parou (sem explosão, decisão de 2026-11-26) e volta ao início quando o programa muda.
   */
  function executar() {
    if (concluiu.current || animando || programa.length === 0) return;
    const caminho: { linha: number; coluna: number }[] = [];
    let bateuNoComando: number | null = null;
    let { linha, coluna } = conteudo.inicio;
    percurso: for (const [indice, comando] of programa.entries()) {
      const [dl, dc] = DESLOCAMENTOS[comando.direcao];
      for (let passo = 0; passo < comando.passos; passo += 1) {
        const celula = conteudo.mapa[linha + dl]?.[coluna + dc];
        if (!celula || celula === "#") {
          bateuNoComando = indice;
          break percurso;
        }
        linha += dl;
        coluna += dc;
        caminho.push({ linha, coluna });
      }
    }
    const chegou =
      bateuNoComando === null && linha === conteudo.chegada.linha && coluna === conteudo.chegada.coluna;
    const reduzido = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const ritmo = reduzido ? PASSO_REDUZIDO_MS : PASSO_MS;
    setAnimando(true);
    setRobo(conteudo.inicio);
    setMensagem("O robô está andando…");
    caminho.forEach((posicao, i) => agendar(() => setRobo(posicao), (i + 1) * ritmo));
    agendar(() => {
      setAnimando(false);
      if (chegou) {
        concluiu.current = true;
        setMensagem("");
        aoConcluir();
        return;
      }
      setMensagem(
        bateuNoComando !== null
          ? `O robô bateu na parede no comando ${bateuNoComando + 1}. Ajuste e execute de novo.`
          : "O robô parou antes da chegada. Acrescente ou ajuste comandos.",
      );
    }, (caminho.length + 1) * ritmo);
  }

  return (
    <Stack gap="md" ref={foco} tabIndex={-1}>
      <Text fw={600}>Monte as setas e depois toque em Executar.</Text>
      <div
        className={estilos.mapa}
        style={{ gridTemplateColumns: `repeat(${conteudo.mapa[0].length}, minmax(0, 1fr))` }}
        aria-hidden="true"
      >
        {conteudo.mapa.flatMap((linha, i) =>
          [...linha].map((celula, j) => {
            const aqui = robo.linha === i && robo.coluna === j;
            const tipo = aqui ? "jogador" : celula === "#" ? "parede" : celula === "F" ? "chegada" : "caminho";
            return (
              <span className={estilos.celula} key={`${i}/${j}`} data-tipo={tipo}>
                {aqui ? <Figura simbolo="🤖" /> : celula === "F" ? "⚑" : ""}
              </span>
            );
          }),
        )}
      </div>
      <div className={estilos.direcoes} role="group" aria-label="Acrescentar seta ao programa">
        {SETAS.map((seta) => (
          <Button
            key={seta.id}
            className={estilos.seta}
            style={{ gridArea: seta.id }}
            variant="light"
            aria-label={`Acrescentar seta para ${seta.nome}`}
            onClick={() => acrescentar(seta.id)}
            disabled={animando}
          >
            <span aria-hidden="true">{seta.icone}</span>
          </Button>
        ))}
      </div>
      <Stack gap={4}>
        <Text size="sm" fw={600}>
          Programa {programa.length ? "(toque num comando para tirá-lo)" : "vazio"}
        </Text>
        <Group gap={6} role="list" aria-label="Comandos do programa">
          {programa.map((comando, indice) => (
            <Button
              key={`${indice}-${comando.direcao}`}
              role="listitem"
              size="compact-sm"
              variant="outline"
              aria-label={`Comando ${indice + 1}: ${comando.direcao}, ${comando.passos} ${comando.passos === 1 ? "casa" : "casas"}. Tocar para tirar.`}
              onClick={() => remover(indice)}
              disabled={animando}
            >
              {indice + 1}) {ICONE[comando.direcao]} {comando.passos}
            </Button>
          ))}
        </Group>
      </Stack>
      <Group gap="xs">
        <Button variant="default" onClick={apagar} disabled={programa.length === 0 || animando}>
          Apagar
        </Button>
        <Button onClick={executar} disabled={programa.length === 0 || animando} loading={animando}>
          Executar
        </Button>
      </Group>
      <Text size="sm" role="status">
        Chegada na linha {conteudo.chegada.linha + 1}, coluna {conteudo.chegada.coluna + 1}.
        {mensagem ? ` ${mensagem}` : ""}
      </Text>
    </Stack>
  );
}
