"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Sessao = {
  token: string;
  usuario: { pessoa: { familiaId: string } };
};

type CartaoDose = {
  medicamentoId: string;
  nome: string;
  horario: string;
  situacao: string;
  registroId: string | null;
  confirmaAoTocar: false;
};

type Rotina = {
  data: string;
  proximoCuidado: CartaoDose | null;
  secoes: {
    medicamentos: CartaoDose[];
    consultas: { id: string; especialidadeOuDescricao: string; dataHora: string }[];
    atividadesApoio: { id: string; descricao: string }[];
  };
  regra: string;
};

const CHAVE = "pef.sessao.ff03";
const base = () => process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export default function PaginaCuidados() {
  const params = useParams<{ pessoaId: string }>();
  const [sessao, setSessao] = useState<Sessao | null>(null);
  const [rotina, setRotina] = useState<Rotina | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [nomeMed, setNomeMed] = useState("");
  const [horarios, setHorarios] = useState("08:00");
  const [selecionado, setSelecionado] = useState<CartaoDose | null>(null);
  const [atividade, setAtividade] = useState("");

  const carregar = useCallback(async (s: Sessao, pessoaId: string) => {
    const resposta = await fetch(
      `${base()}/pessoas/${pessoaId}/cuidados/hoje`,
      { headers: { "x-sessao-token": s.token }, cache: "no-store" },
    );
    if (!resposta.ok) {
      throw new Error(
        resposta.status === 403
          ? "Acesso negado aos cuidados."
          : `Erro ${resposta.status}`,
      );
    }
    setRotina((await resposta.json()) as Rotina);
  }, []);

  useEffect(() => {
    const bruto = window.localStorage.getItem(CHAVE);
    if (!bruto) {
      setErro("Faça login na página inicial.");
      return;
    }
    const s = JSON.parse(bruto) as Sessao;
    setSessao(s);
    void carregar(s, params.pessoaId).catch((e) =>
      setErro(e instanceof Error ? e.message : "Falha ao carregar"),
    );
  }, [params.pessoaId, carregar]);

  async function cadastrarMedicamento(evento: FormEvent) {
    evento.preventDefault();
    if (!sessao) return;
    setErro(null);
    const resposta = await fetch(
      `${base()}/pessoas/${params.pessoaId}/medicamentos`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-sessao-token": sessao.token,
        },
        body: JSON.stringify({
          nome: nomeMed,
          horarios: horarios.split(",").map((h) => h.trim()),
          ativar: true,
        }),
      },
    );
    if (!resposta.ok) {
      setErro("Não foi possível cadastrar o medicamento.");
      return;
    }
    setNomeMed("");
    await carregar(sessao, params.pessoaId);
  }

  async function confirmarRelato(situacao: string) {
    if (!sessao || !selecionado) return;
    setErro(null);
    const resposta = await fetch(
      `${base()}/medicamentos/${selecionado.medicamentoId}/doses/registros`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-sessao-token": sessao.token,
        },
        body: JSON.stringify({
          data: rotina?.data,
          horario: selecionado.horario,
          situacao,
        }),
      },
    );
    if (!resposta.ok) {
      setErro("Não foi possível registrar o relato.");
      return;
    }
    setSelecionado(null);
    await carregar(sessao, params.pessoaId);
  }

  async function registrarApoio(evento: FormEvent) {
    evento.preventDefault();
    if (!sessao) return;
    const resposta = await fetch(
      `${base()}/pessoas/${params.pessoaId}/atividades-apoio`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-sessao-token": sessao.token,
        },
        body: JSON.stringify({ descricao: atividade }),
      },
    );
    if (!resposta.ok) {
      setErro("Não foi possível registrar a atividade.");
      return;
    }
    setAtividade("");
    await carregar(sessao, params.pessoaId);
  }

  return (
    <main className="cuidados-mobile">
      <p>
        <Link href={`/pessoas/${params.pessoaId}`}>← Perfil</Link>
      </p>
      <h1>Cuidados</h1>
      <p className="ajuda">
        Organize medicamentos e apoio. Toque no cartão abre opções — não confirma
        sozinho.
      </p>
      {erro ? <p className="erro">{erro}</p> : null}

      {rotina?.proximoCuidado ? (
        <section className="status destaque-proximo">
          <h2>Próximo cuidado</h2>
          <p>
            <strong>{rotina.proximoCuidado.nome}</strong> ·{" "}
            {rotina.proximoCuidado.horario}
          </p>
        </section>
      ) : null}

      <section className="bloco">
        <h2>Medicamentos de hoje</h2>
        <ul className="grade-cartoes">
          {(rotina?.secoes.medicamentos ?? []).map((c) => (
            <li key={`${c.medicamentoId}-${c.horario}`}>
              <button
                type="button"
                className="cartao-pessoa cartao-dose"
                onClick={() => setSelecionado(c)}
              >
                <strong>{c.nome}</strong>
                <span>
                  {c.horario} · {rotuloSituacao(c.situacao)}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <p className="ajuda">{rotina?.regra}</p>
      </section>

      {selecionado ? (
        <section className="status painel-confirmacao" role="dialog">
          <h2>Relato da Vovó</h2>
          <p>
            {selecionado.nome} às {selecionado.horario}
          </p>
          <div className="acoes-relato">
            <button
              type="button"
              onClick={() => void confirmarRelato("tomou_conforme_informacao")}
            >
              Informou que tomou
            </button>
            <button
              type="button"
              className="secundario"
              onClick={() => void confirmarRelato("informou_nao_tomou")}
            >
              Informou que não tomou
            </button>
            <button
              type="button"
              className="secundario"
              onClick={() => setSelecionado(null)}
            >
              Cancelar
            </button>
          </div>
        </section>
      ) : null}

      <section className="bloco">
        <h2>Novo medicamento</h2>
        <form onSubmit={cadastrarMedicamento} className="formulario">
          <label>
            Nome
            <input
              value={nomeMed}
              onChange={(e) => setNomeMed(e.target.value)}
              required
            />
          </label>
          <label>
            Horários (HH:MM, separados por vírgula)
            <input
              value={horarios}
              onChange={(e) => setHorarios(e.target.value)}
              required
            />
          </label>
          <button type="submit">Cadastrar e ativar</button>
        </form>
      </section>

      <section className="bloco">
        <h2>Atividade de apoio</h2>
        <form onSubmit={registrarApoio} className="formulario">
          <label>
            Descrição
            <input
              value={atividade}
              onChange={(e) => setAtividade(e.target.value)}
              required
            />
          </label>
          <button type="submit">Registrar</button>
        </form>
        <ul className="lista-pessoas">
          {(rotina?.secoes.atividadesApoio ?? []).map((a) => (
            <li key={a.id}>{a.descricao}</li>
          ))}
        </ul>
      </section>

      <section className="bloco">
        <h2>Consultas de hoje</h2>
        <ul className="lista-pessoas">
          {(rotina?.secoes.consultas ?? []).map((c) => (
            <li key={c.id}>{c.especialidadeOuDescricao}</li>
          ))}
        </ul>
        <p>
          <Link href={`/pessoas/${params.pessoaId}/historico`}>
            Ver histórico →
          </Link>
        </p>
      </section>
    </main>
  );
}

function rotuloSituacao(situacao: string) {
  if (situacao === "tomou_conforme_informacao") return "tomou (informado)";
  if (situacao === "informou_nao_tomou") return "não tomou (informado)";
  return "sem confirmação";
}
