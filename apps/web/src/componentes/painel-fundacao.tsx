"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import {
  concederAutorizacao,
  criarConvite,
  criarPessoa,
  entrar,
  obterInicio,
  type AutorizacaoResumo,
  type CartaoInicio,
  type SessaoResposta,
} from "@/lib/api";

const CHAVE_SESSAO = "pef.sessao.ff03";

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
  const [cartoes, setCartoes] = useState<CartaoInicio[]>([]);
  const [autorizacoes, setAutorizacoes] = useState<AutorizacaoResumo[]>([]);
  const [filtrado, setFiltrado] = useState(false);
  const [emailConvite, setEmailConvite] = useState("nova.colab@pef.local");
  const [tokenConvite, setTokenConvite] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (!sessao) return;
    void carregarInicio(sessao).catch((e) => {
      setErro(e instanceof Error ? e.message : "Falha ao carregar início");
    });
  }, [sessao]);

  async function carregarInicio(atual: SessaoLocal) {
    const inicio = await obterInicio(atual.usuario.pessoa.familiaId, atual.token);
    setCartoes(inicio.cartoes);
    setAutorizacoes(inicio.autorizacoes);
    setFiltrado(inicio.filtradoPorAutorizacao);
  }

  async function aoEntrar(evento: FormEvent) {
    evento.preventDefault();
    setCarregando(true);
    setErro(null);
    try {
      const nova = await entrar(email, senha);
      window.localStorage.setItem(CHAVE_SESSAO, JSON.stringify(nova));
      setSessao(nova);
      await carregarInicio(nova);
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
      await carregarInicio(sessao);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Falha ao cadastrar");
    } finally {
      setCarregando(false);
    }
  }

  async function aoConvidarColaboradora() {
    if (!sessao) return;
    const vovo = cartoes.find((c) => c.nome === "Vovó");
    if (!vovo) {
      setErro("Cadastre Vovó antes de convidar colaboradora.");
      return;
    }
    setCarregando(true);
    setErro(null);
    try {
      const convite = await criarConvite(
        sessao.usuario.pessoa.familiaId,
        sessao.token,
        {
          email: emailConvite,
          nomeConvidado: "Colaboradora Convidada",
          responsabilidade: "colaboradora_cuidados",
          pessoaAlvoId: vovo.pessoaId,
        },
      );
      setTokenConvite(convite.token);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Falha no convite");
    } finally {
      setCarregando(false);
    }
  }

  async function aoAcumularDesenvolvimento() {
    if (!sessao) return;
    const laurinha = cartoes.find((c) => c.nome === "Laurinha");
    if (!laurinha) {
      setErro("Cadastre Laurinha antes de acumular responsabilidade.");
      return;
    }
    setCarregando(true);
    setErro(null);
    try {
      await concederAutorizacao(sessao.usuario.pessoa.familiaId, sessao.token, {
        usuarioId: sessao.usuario.id,
        responsabilidade: "responsavel_desenvolvimento",
        pessoaAlvoId: laurinha.pessoaId,
      });
      await carregarInicio(sessao);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Falha ao conceder");
    } finally {
      setCarregando(false);
    }
  }

  function aoSair() {
    window.localStorage.removeItem(CHAVE_SESSAO);
    setSessao(null);
    setCartoes([]);
    setAutorizacoes([]);
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

      {!filtrado ? (
        <form onSubmit={aoCadastrar} className="formulario">
          <h2>Adicionar pessoa</h2>
          <p className="ajuda">Só o nome é necessário.</p>
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
      ) : null}

      <div className="bloco">
        <h2>Início — cartões autorizados</h2>
        <p className="ajuda">
          {filtrado
            ? "Lista filtrada pela sua autorização (FAM-R10)."
            : "Visão de administrador da família."}
        </p>
        <ul className="grade-cartoes">
          {cartoes.map((cartao) => (
            <li key={cartao.pessoaId} className="cartao-pessoa">
              <strong>{cartao.nome}</strong>
              <span>{cartao.resumo}</span>
              <Link href={`/pessoas/${cartao.pessoaId}`}>Abrir perfil</Link>
            </li>
          ))}
        </ul>
      </div>

      {!filtrado ? (
        <div className="bloco">
          <h2>Convidar colaboradora (FF-04)</h2>
          <form
            className="formulario"
            onSubmit={(e) => {
              e.preventDefault();
              void aoConvidarColaboradora();
            }}
          >
            <label>
              E-mail
              <input
                value={emailConvite}
                onChange={(e) => setEmailConvite(e.target.value)}
                type="email"
                required
              />
            </label>
            <button type="submit" disabled={carregando}>
              Gerar convite para Vovó
            </button>
          </form>
          {tokenConvite ? (
            <p className="ajuda">
              Token: <code>{tokenConvite}</code>
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="bloco">
        <h2>Autorizações ativas</h2>
        <ul className="lista-pessoas">
          {autorizacoes.map((a) => (
            <li key={a.id}>
              <code>{a.responsabilidade}</code>
              {a.pessoaAlvo ? ` → ${a.pessoaAlvo.nome}` : " → família"}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => void aoAcumularDesenvolvimento()}
          disabled={carregando}
        >
          Acumular responsabilidade de desenvolvimento (ACE-05)
        </button>
      </div>

      {erro ? <p className="erro">{erro}</p> : null}
    </section>
  );
}
