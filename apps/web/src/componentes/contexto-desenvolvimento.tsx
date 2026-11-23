"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Button, Container, Stack } from "@mantine/core";
import { useSessao } from "@/componentes/contexto-sessao";
import {
  EstadoCarregando,
  EstadoVazio,
  mensagemErroAmigavel,
} from "@/componentes/feedback";
import { obterPessoa } from "@/lib/api";
import { rotaFamilia } from "@/lib/rotas-familia";
import { podeOrganizarDesenvolvimento } from "@/lib/rotulos-experiencia";

type Desenvolvimento = {
  pessoaId: string;
  nomePessoa: string;
  caminho: string;
  podeOrganizar: boolean;
};

type Perfil = {
  nome: string;
  areas?: { id: string; disponivel: boolean }[];
};

type Consulta =
  | { estado: "carregando" }
  | { estado: "negado" }
  | { estado: "erro"; mensagem: string }
  | { estado: "liberado"; nome: string };

const Contexto = createContext<Desenvolvimento | null>(null);

export function useDesenvolvimento() {
  const contexto = useContext(Contexto);
  if (!contexto) throw new Error("Contexto de Desenvolvimento indisponível.");
  return contexto;
}

export function GuardaDesenvolvimento({
  slug,
  pessoaId,
  children,
}: {
  slug: string;
  pessoaId: string;
  children: ReactNode;
}) {
  const { usuario, autorizacoes } = useSessao();
  if (!usuario || usuario.familia?.slug !== slug) return null;

  return (
    <DesenvolvimentoAutorizado
      key={JSON.stringify([slug, usuario.id, pessoaId])}
      pessoaId={pessoaId}
      familiaId={usuario.pessoa.familiaId}
      caminho={rotaFamilia(slug, `/pessoas/${pessoaId}/desenvolvimento`)}
      podeOrganizar={podeOrganizarDesenvolvimento(
        pessoaId,
        usuario.pessoa.id,
        autorizacoes,
      )}
    >
      {children}
    </DesenvolvimentoAutorizado>
  );
}

function DesenvolvimentoAutorizado({
  pessoaId,
  familiaId,
  caminho,
  podeOrganizar,
  children,
}: Omit<Desenvolvimento, "nomePessoa"> & {
  familiaId: string;
  children: ReactNode;
}) {
  const [consulta, setConsulta] = useState<Consulta>({ estado: "carregando" });
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let ativa = true;
    void obterPessoa(familiaId, pessoaId)
      .then((perfil: Perfil) => {
        if (!ativa) return;
        const permitido = perfil.areas?.some(
          (area) => area.id === "desenvolvimento" && area.disponivel,
        );
        setConsulta(
          permitido ? { estado: "liberado", nome: perfil.nome } : { estado: "negado" },
        );
      })
      .catch((erro: unknown) => {
        if (!ativa) return;
        setConsulta({
          estado: "erro",
          mensagem: mensagemErroAmigavel(erro, "Não foi possível abrir Desenvolvimento."),
        });
      });
    return () => {
      ativa = false;
    };
  }, [familiaId, pessoaId, tentativa]);

  if (consulta.estado === "liberado") {
    return (
      <Contexto.Provider value={{ pessoaId, nomePessoa: consulta.nome, caminho, podeOrganizar }}>
        {children}
      </Contexto.Provider>
    );
  }

  return (
    <Container size="sm" py="md">
      {consulta.estado === "carregando" ? (
        <EstadoCarregando rotulo="Abrindo Desenvolvimento…" />
      ) : consulta.estado === "negado" ? (
        <EstadoVazio titulo="Acesso indisponível" descricao="Esta área exige acesso a Desenvolvimento." />
      ) : (
        <Stack align="flex-start">
          <EstadoVazio titulo="Não foi possível abrir Desenvolvimento" descricao={consulta.mensagem} />
          <Button onClick={() => {
            setConsulta({ estado: "carregando" });
            setTentativa((atual) => atual + 1);
          }}>
            Tentar novamente
          </Button>
        </Stack>
      )}
    </Container>
  );
}
