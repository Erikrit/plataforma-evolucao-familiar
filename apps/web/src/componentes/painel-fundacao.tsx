"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  criarPessoa,
  entrar,
  listarPessoas,
  type PessoaResumo,
  type SessaoResposta,
} from "@/lib/api";

const CHAVE_SESSAO = "pef.sessao.ff02";

type SessaoLocal = SessaoResposta;

function lerSessao(): SessaoLocal | null {
  if (typeof window === "undefined") return null;
  const bruto = window.localStorage.getItem(CHAVE_SESSAO);
  if (!bruto) return null;
  try {
    return JSON.parse(bruto) as SessaoLocal;
  } catch {
    return null;
  }
}

export function PainelFundacao() {
  const [sessao, setSessao] = useState<SessaoLocal | null>(() => lerSessao());
  const [email, setEmail] = useState("admin@pef.local");
  const [senha, setSenha] = useState("admin-local");
  const [nome, setNome] = useState("");
  const [pessoas, setPessoas] = useState<PessoaResumo[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (!sessao) return;
    void carregarPessoas(sessao).catch((e) => {
      setErro(e instanceof Error ? e.message : "Falha ao carregar pessoas");
    });
  }, [sessao]);

  async function carregarPessoas(atual: SessaoLocal) {
    const lista = await listarPessoas(atual.usuario.pessoa.familiaId, atual.token);
    setPessoas(lista);
  }

  async function aoEntrar(evento: FormEvent) {
    evento.preventDefault();
    setCarregando(true);
    setErro(null);
    try {
      const nova = await entrar(email, senha);
      window.localStorage.setItem(CHAVE_SESSAO, JSON.stringify(nova));
      setSessao(nova);
      await carregarPessoas(nova);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Falha ao entrar");
    } finally {
      setCarregando(false);
    }
  }

  async function aoCadastrar(evento: FormEvent) {
    evento.preventDefault();
    if (!sessao) return;
    setCarregando(true);
    setErro(null);
    try {
      await criarPessoa(sessao.usuario.pessoa.familiaId, sessao.token, nome);
      setNome("");
      await carregarPessoas(sessao);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Falha ao cadastrar");
    } finally {
      setCarregando(false);
    }
  }

  function aoSair() {
    window.localStorage.removeItem(CHAVE_SESSAO);
    setSessao(null);
    setPessoas([]);
  }

  if (!sessao) {
    return (
      <section className="status">
        <h2>Entrar (sessão provisória)</h2>
        <form onSubmit={aoEntrar} className="formulario">
          <label>
            E-mail
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </label>
          <label>
            Senha
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          <button type="submit" disabled={carregando}>
            Entrar
          </button>
        </form>
        {erro ? <p className="erro">{erro}</p> : null}
      </section>
    );
  }

  return (
    <section className="status">
      <header className="cabecalho-sessao">
        <p>
          Olá, <strong>{sessao.usuario.pessoa.nome}</strong>
        </p>
        <button type="button" onClick={aoSair}>
          Sair
        </button>
      </header>

      <form onSubmit={aoCadastrar} className="formulario">
        <h2>Adicionar pessoa</h2>
        <p className="ajuda">Só o nome é necessário (ACE-01 / ACE-09).</p>
        <label>
          Nome
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex.: Vovó"
            required
            autoComplete="off"
          />
        </label>
        <button type="submit" disabled={carregando || !nome.trim()}>
          Salvar
        </button>
      </form>

      <div>
        <h2>Pessoas</h2>
        <ul className="lista-pessoas">
          {pessoas.map((pessoa) => (
            <li key={pessoa.id}>
              <strong>{pessoa.nome}</strong>
              {pessoa.possuiConta ? " · com conta" : " · sem conta"}
            </li>
          ))}
        </ul>
        {pessoas.length === 0 ? (
          <p className="ajuda">Nenhuma pessoa além do carregamento inicial.</p>
        ) : null}
      </div>
      {erro ? <p className="erro">{erro}</p> : null}
    </section>
  );
}
