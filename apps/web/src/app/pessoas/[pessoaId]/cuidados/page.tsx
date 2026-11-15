"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useId, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  cadastrarMedicamento,
  criarConsulta,
  obterCuidadosHoje,
  obterMe,
  obterPessoa,
  registrarAtividadeApoio,
  registrarDose,
} from "@/lib/api";

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

export default function PaginaCuidados() {
  const params = useParams<{ pessoaId: string }>();
  const router = useRouter();
  const tituloDialogId = useId();
  const dialogRef = useRef<HTMLSectionElement | null>(null);
  const [autenticado, setAutenticado] = useState(false);
  const [nomePessoa, setNomePessoa] = useState<string>("");
  const [rotina, setRotina] = useState<Rotina | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [nomeMed, setNomeMed] = useState("");
  const [horarios, setHorarios] = useState("08:00");
  const [selecionado, setSelecionado] = useState<CartaoDose | null>(null);
  const [atividade, setAtividade] = useState("");
  const [consultaDesc, setConsultaDesc] = useState("");
  const [consultaQuando, setConsultaQuando] = useState("");

  const carregar = useCallback(async (pessoaId: string) => {
    setRotina((await obterCuidadosHoje(pessoaId)) as Rotina);
  }, []);

  useEffect(() => {
    void (async () => {
      setCarregando(true);
      setErro(null);
      try {
        const me = await obterMe();
        if (!me) {
          setAutenticado(false);
          setErro("Faça login na página inicial.");
          return;
        }
        setAutenticado(true);
        const perfil = (await obterPessoa(
          me.pessoa.familiaId,
          params.pessoaId,
        )) as { nome: string };
        setNomePessoa(perfil.nome);
        await carregar(params.pessoaId);
      } catch (e) {
        setErro(e instanceof Error ? e.message : "Falha ao carregar");
      } finally {
        setCarregando(false);
      }
    })();
  }, [params.pessoaId, carregar]);

  useEffect(() => {
    if (!selecionado || !dialogRef.current) return;
    const primeiro = dialogRef.current.querySelector<HTMLButtonElement>("button");
    primeiro?.focus();
  }, [selecionado]);

  async function aoCadastrarMedicamento(evento: FormEvent) {
    evento.preventDefault();
    if (!autenticado) return;
    setErro(null);
    setSucesso(null);
    try {
      await cadastrarMedicamento(params.pessoaId, {
        nome: nomeMed,
        horarios: horarios.split(",").map((h) => h.trim()),
        ativar: true,
      });
      setNomeMed("");
      await carregar(params.pessoaId);
      setSucesso("Medicamento cadastrado e ativado.");
    } catch {
      setErro("Não foi possível cadastrar o medicamento.");
    }
  }

  async function confirmarRelato(situacao: string) {
    if (!selecionado || !autenticado) return;
    setErro(null);
    setSucesso(null);
    try {
      await registrarDose(selecionado.medicamentoId, {
        data: rotina?.data,
        horario: selecionado.horario,
        situacao,
      });
      setSelecionado(null);
      await carregar(params.pessoaId);
      setSucesso("Relato registrado.");
    } catch {
      setErro("Não foi possível registrar o relato.");
    }
  }

  async function aoRegistrarApoio(evento: FormEvent) {
    evento.preventDefault();
    if (!autenticado) return;
    setErro(null);
    setSucesso(null);
    try {
      await registrarAtividadeApoio(params.pessoaId, atividade);
      setAtividade("");
      await carregar(params.pessoaId);
      setSucesso("Atividade de apoio registrada.");
    } catch {
      setErro("Não foi possível registrar a atividade.");
    }
  }

  async function aoCriarConsulta(evento: FormEvent) {
    evento.preventDefault();
    if (!autenticado) return;
    setErro(null);
    setSucesso(null);
    try {
      const dataHora = new Date(consultaQuando);
      if (Number.isNaN(dataHora.getTime())) {
        setErro("Informe data e hora válidas da consulta.");
        return;
      }
      await criarConsulta(params.pessoaId, {
        especialidadeOuDescricao: consultaDesc,
        dataHora: dataHora.toISOString(),
      });
      setConsultaDesc("");
      setConsultaQuando("");
      await carregar(params.pessoaId);
      setSucesso("Consulta agendada.");
    } catch {
      setErro("Não foi possível agendar a consulta.");
    }
  }

  const podeEditar = autenticado && !carregando && !erro?.startsWith("Acesso");

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
      {carregando ? <p className="ajuda">Carregando…</p> : null}
      {erro ? (
        <p className="erro">
          {erro}{" "}
          {!autenticado ? (
            <button
              type="button"
              className="secundario"
              onClick={() => router.push("/")}
            >
              Ir para entrar
            </button>
          ) : null}
        </p>
      ) : null}
      {sucesso ? <p className="sucesso">{sucesso}</p> : null}

      {podeEditar && rotina?.proximoCuidado ? (
        <section className="status destaque-proximo">
          <h2>Próximo cuidado</h2>
          <p>
            <strong>{rotina.proximoCuidado.nome}</strong> ·{" "}
            {rotina.proximoCuidado.horario}
          </p>
        </section>
      ) : null}

      {podeEditar ? (
        <>
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
            <section
              ref={dialogRef}
              className="status painel-confirmacao"
              role="dialog"
              aria-modal="true"
              aria-labelledby={tituloDialogId}
            >
              <h2 id={tituloDialogId}>
                Relato{nomePessoa ? ` de ${nomePessoa}` : ""}
              </h2>
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
            <form onSubmit={aoCadastrarMedicamento} className="formulario">
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
            <form onSubmit={aoRegistrarApoio} className="formulario">
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
            <h2>Consultas</h2>
            <ul className="lista-pessoas">
              {(rotina?.secoes.consultas ?? []).map((c) => (
                <li key={c.id}>{c.especialidadeOuDescricao}</li>
              ))}
            </ul>
            <form onSubmit={aoCriarConsulta} className="formulario">
              <label>
                Especialidade ou descrição
                <input
                  value={consultaDesc}
                  onChange={(e) => setConsultaDesc(e.target.value)}
                  required
                />
              </label>
              <label>
                Data e hora
                <input
                  type="datetime-local"
                  value={consultaQuando}
                  onChange={(e) => setConsultaQuando(e.target.value)}
                  required
                />
              </label>
              <button type="submit">Agendar consulta</button>
            </form>
            <p>
              <Link href={`/pessoas/${params.pessoaId}/historico`}>
                Ver histórico →
              </Link>
            </p>
          </section>
        </>
      ) : null}
    </main>
  );
}

function rotuloSituacao(situacao: string) {
  if (situacao === "tomou_conforme_informacao") return "tomou (informado)";
  if (situacao === "informou_nao_tomou") return "não tomou (informado)";
  return "sem confirmação";
}
