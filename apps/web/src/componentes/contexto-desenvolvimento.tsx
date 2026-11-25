"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { Button, Container, Stack, Text, Title } from "@mantine/core";
import { CampoDataNascimento } from "@/componentes/campo-data-nascimento";
import { useSessao } from "@/componentes/contexto-sessao";
import {
  EstadoCarregando,
  EstadoVazio,
  mensagemErroAmigavel,
} from "@/componentes/feedback";
import { atualizarPessoa, obterPessoa } from "@/lib/api";
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
  dataNascimento?: string | null;
  areas?: { id: string; disponivel: boolean }[];
};

type Consulta =
  | { estado: "carregando" }
  | { estado: "negado" }
  | { estado: "erro"; mensagem: string }
  | { estado: "liberado"; nome: string }
  | { estado: "semNascimento"; nome: string };

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
          !permitido
            ? { estado: "negado" }
            : perfil.dataNascimento
              ? { estado: "liberado", nome: perfil.nome }
              : { estado: "semNascimento", nome: perfil.nome },
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

  if (consulta.estado === "semNascimento") {
    return (
      <InformarNascimento
        familiaId={familiaId}
        pessoaId={pessoaId}
        nome={consulta.nome}
        aoSalvar={() => setConsulta({ estado: "liberado", nome: consulta.nome })}
      />
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

/** M01 §16: Desenvolvimento abre depois que a data de nascimento é informada. */
function InformarNascimento({
  familiaId,
  pessoaId,
  nome,
  aoSalvar,
}: {
  familiaId: string;
  pessoaId: string;
  nome: string;
  aoSalvar: () => void;
}) {
  const [data, setData] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function salvar(evento: FormEvent) {
    evento.preventDefault();
    if (!data) return;
    setSalvando(true);
    setErro(null);
    try {
      await atualizarPessoa(familiaId, pessoaId, { dataNascimento: data });
      aoSalvar();
    } catch (falha) {
      setErro(mensagemErroAmigavel(falha, "Não foi possível salvar a data."));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Container size="sm" py="md">
      <form onSubmit={(evento) => void salvar(evento)}>
        <Stack align="flex-start">
          <Title order={1} size="h3">
            Antes de continuar
          </Title>
          <Text size="sm">
            Informe a data de nascimento de {nome}. Ela organiza os jogos e as brincadeiras pela faixa
            de idade. Nada do que já foi registrado muda.
          </Text>
          <CampoDataNascimento nomePessoa={nome} valor={data} aoMudar={setData} disabled={salvando} />
          {erro ? (
            <Text size="sm" c="red.8" role="alert">
              {erro}
            </Text>
          ) : null}
          <Button type="submit" loading={salvando} disabled={!data}>
            Salvar e abrir Desenvolvimento
          </Button>
        </Stack>
      </form>
    </Container>
  );
}
