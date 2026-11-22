"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Button, Stack } from "@mantine/core";
import { useDesenvolvimento } from "@/componentes/contexto-desenvolvimento";
import { EstadoCarregando, EstadoVazio, mensagemErroAmigavel } from "@/componentes/feedback";
import { ErroApi, listarJogos, type CatalogoJogos } from "@/lib/api";

type Consulta =
  | { estado: "carregando" }
  | { estado: "erro"; mensagem: string; acessoNegado: boolean }
  | { estado: "pronta"; catalogo: CatalogoJogos };

export function CatalogoJogosAutorizado({
  children,
}: {
  children: (catalogo: CatalogoJogos) => ReactNode;
}) {
  const { pessoaId } = useDesenvolvimento();
  const [consulta, setConsulta] = useState<Consulta>({ estado: "carregando" });
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    const controle = new AbortController();
    void listarJogos(pessoaId, controle.signal)
      .then((catalogo) => {
        if (!controle.signal.aborted) setConsulta({ estado: "pronta", catalogo });
      })
      .catch((erro: unknown) => {
        if (controle.signal.aborted) return;
        const acessoNegado = erro instanceof ErroApi && [401, 403, 404].includes(erro.status ?? 0);
        setConsulta({
          estado: "erro",
          acessoNegado,
          mensagem: acessoNegado
            ? "Confira a sessão e o acesso ao Desenvolvimento desta pessoa."
            : mensagemErroAmigavel(erro, "Não foi possível carregar os jogos."),
        });
      });
    return () => controle.abort();
  }, [pessoaId, tentativa]);

  if (consulta.estado === "pronta") return children(consulta.catalogo);

  if (consulta.estado === "carregando") {
    return <EstadoCarregando rotulo="Carregando jogos…" />;
  }

  return (
    <Stack align="flex-start">
      <EstadoVazio titulo="Jogos indisponíveis" descricao={consulta.mensagem} />
      {consulta.acessoNegado ? null : (
        <Button variant="light" onClick={() => {
          setConsulta({ estado: "carregando" });
          setTentativa((atual) => atual + 1);
        }}>
          Tentar novamente
        </Button>
      )}
    </Stack>
  );
}
