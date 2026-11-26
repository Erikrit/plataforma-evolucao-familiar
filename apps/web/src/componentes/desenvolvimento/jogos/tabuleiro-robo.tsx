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
  const concluiu = useRef(false);
  const programaAtual = useRef(programa);
  programaAtual.current = programa;
  const pedidosDica = useRef({ chave: "", nivel: 0 });
  const foco = useRef<HTMLDivElement>(null);

  useEffect(() => {
    foco.current?.focus();
  }, []);

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
    if (concluiu.current) return;
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
    if (concluiu.current) return;
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
    if (concluiu.current) return;
    setRobo(conteudo.inicio);
    setMensagem(`Comando ${indice + 1} removido.`);
    setPrograma((atual) => atual.filter((_, i) => i !== indice));
  }

  function executar() {
    if (concluiu.current || programa.length === 0) return;
    let { linha, coluna } = conteudo.inicio;
    for (const [indice, comando] of programa.entries()) {
      const [dl, dc] = DESLOCAMENTOS[comando.direcao];
      for (let passo = 0; passo < comando.passos; passo += 1) {
        const celula = conteudo.mapa[linha + dl]?.[coluna + dc];
        if (!celula || celula === "#") {
          setRobo({ linha, coluna });
          setMensagem(`O robô bateu na parede no comando ${indice + 1}. Ajuste e execute de novo.`);
          return;
        }
        linha += dl;
        coluna += dc;
      }
    }
    setRobo({ linha, coluna });
    if (linha === conteudo.chegada.linha && coluna === conteudo.chegada.coluna) {
      concluiu.current = true;
      aoConcluir();
      return;
    }
    setMensagem("O robô parou antes da chegada. Acrescente ou ajuste comandos.");
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
            >
              {indice + 1}) {ICONE[comando.direcao]} {comando.passos}
            </Button>
          ))}
        </Group>
      </Stack>
      <Group gap="xs">
        <Button variant="default" onClick={apagar} disabled={programa.length === 0}>
          Apagar
        </Button>
        <Button onClick={executar} disabled={programa.length === 0}>
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
