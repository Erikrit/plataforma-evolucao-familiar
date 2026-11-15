"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ativarConvite,
  concederAutorizacao,
  criarConvite,
  criarPessoa,
  entrar,
  limparSessaoLegada,
  obterInicio,
  obterMe,
  sair,
  type AutorizacaoResumo,
  type CartaoInicio,
  type UsuarioSessao,
} from "@/lib/api";

export function PainelFundacao() {
  const [usuario, setUsuario] = useState<UsuarioSessao | null>(null);
  const [pronto, setPronto] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [cartoes, setCartoes] = useState<CartaoInicio[]>([]);
  const [autorizacoes, setAutorizacoes] = useState<AutorizacaoResumo[]>([]);
  const [filtrado, setFiltrado] = useState(false);
  const [emailConvite, setEmailConvite] = useState("nova.colab@pef.local");
  const [pessoaAlvoConviteId, setPessoaAlvoConviteId] = useState("");
  const [pessoaAlvoDesenvId, setPessoaAlvoDesenvId] = useState("");
  const [tokenConvite, setTokenConvite] = useState<string | null>(null);
  const [tokenAtivar, setTokenAtivar] = useState("");
  const [senhaAtivar, setSenhaAtivar] = useState("");
  const [nomeAtivar, setNomeAtivar] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const pessoasUnicas = useMemo(() => {
    const mapa = new Map<string, CartaoInicio>();
    for (const c of cartoes) mapa.set(c.pessoaId, c);
    return [...mapa.values()].sort((a, b) => a.nome.localeCompare(b.nome, "pt"));
  }, [cartoes]);

  useEffect(() => {
    limparSessaoLegada();
    void (async () => {
      try {
        const me = await obterMe();
        if (me) {
          setUsuario(me);
          await carregarInicio(me);
        }
      } catch (e) {
        setErro(e instanceof Error ? e.message : "Falha ao verificar sessão");
      } finally {
        setPronto(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!pessoaAlvoConviteId && pessoasUnicas.length > 0) {
      const preferida =
        pessoasUnicas.find((p) => /vovó|vovo/i.test(p.nome)) ?? pessoasUnicas[0];
      setPessoaAlvoConviteId(preferida.pessoaId);
    }
    if (!pessoaAlvoDesenvId && pessoasUnicas.length > 0) {
      const preferida =
        pessoasUnicas.find((p) => /laurinha/i.test(p.nome)) ?? pessoasUnicas[0];
      setPessoaAlvoDesenvId(preferida.pessoaId);
    }
  }, [pessoasUnicas, pessoaAlvoConviteId, pessoaAlvoDesenvId]);

  async function carregarInicio(atual: UsuarioSessao) {
    const inicio = await obterInicio(atual.pessoa.familiaId);
    setCartoes(inicio.cartoes);
    setAutorizacoes(inicio.autorizacoes);
    setFiltrado(inicio.filtradoPorAutorizacao);
  }

  async function aoEntrar(evento: FormEvent) {
    evento.preventDefault();
    setCarregando(true);
    setErro(null);
    setSucesso(null);
    try {
      const nova = await entrar(email, senha);
      setUsuario(nova.usuario);
      await carregarInicio(nova.usuario);
      setSucesso("Sessão iniciada.");
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Falha ao entrar");
    } finally {
      setCarregando(false);
    }
  }

  async function aoCadastrar(evento: FormEvent) {
    evento.preventDefault();
    if (!usuario) return;
    setCarregando(true);
    setErro(null);
    setSucesso(null);
    try {
      const criada = await criarPessoa(usuario.pessoa.familiaId, nome);
      setNome("");
      await carregarInicio(usuario);
      setSucesso(`Pessoa “${criada.nome}” cadastrada.`);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Falha ao cadastrar");
    } finally {
      setCarregando(false);
    }
  }

  async function aoConvidarColaboradora() {
    if (!usuario || !pessoaAlvoConviteId) {
      setErro("Selecione a pessoa-alvo do convite.");
      return;
    }
    setCarregando(true);
    setErro(null);
    setSucesso(null);
    try {
      const alvo = pessoasUnicas.find((p) => p.pessoaId === pessoaAlvoConviteId);
      const convite = await criarConvite(usuario.pessoa.familiaId, {
        email: emailConvite,
        nomeConvidado: "Colaboradora Convidada",
        responsabilidade: "colaboradora_cuidados",
        pessoaAlvoId: pessoaAlvoConviteId,
      });
      setTokenConvite(convite.token);
      setTokenAtivar(convite.token);
      setSucesso(
        `Convite gerado para ${alvo?.nome ?? "pessoa selecionada"}.`,
      );
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Falha no convite");
    } finally {
      setCarregando(false);
    }
  }

  async function aoAtivarConvite(evento: FormEvent) {
    evento.preventDefault();
    setCarregando(true);
    setErro(null);
    setSucesso(null);
    try {
      await ativarConvite(tokenAtivar.trim(), {
        senha: senhaAtivar,
        nome: nomeAtivar.trim() || undefined,
      });
      setSenhaAtivar("");
      setSucesso("Convite ativado. A colaboradora já pode entrar.");
      if (usuario) await carregarInicio(usuario);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Falha ao ativar convite");
    } finally {
      setCarregando(false);
    }
  }

  async function aoAcumularDesenvolvimento() {
    if (!usuario || !pessoaAlvoDesenvId) {
      setErro("Selecione a pessoa para desenvolvimento.");
      return;
    }
    setCarregando(true);
    setErro(null);
    setSucesso(null);
    try {
      await concederAutorizacao(usuario.pessoa.familiaId, {
        usuarioId: usuario.id,
        responsabilidade: "responsavel_desenvolvimento",
        pessoaAlvoId: pessoaAlvoDesenvId,
      });
      await carregarInicio(usuario);
      setSucesso("Responsabilidade de desenvolvimento concedida.");
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Falha ao conceder");
    } finally {
      setCarregando(false);
    }
  }

  async function aoSair() {
    setCarregando(true);
    setErro(null);
    setSucesso(null);
    try {
      await sair();
    } catch {
      /* limpeza local mesmo se a API falhar */
    } finally {
      setUsuario(null);
      setCartoes([]);
      setAutorizacoes([]);
      setTokenConvite(null);
      setCarregando(false);
    }
  }

  if (!pronto) {
    return (
      <section className="status" aria-busy="true">
        <p className="ajuda">Verificando sessão…</p>
      </section>
    );
  }

  if (!usuario) {
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
        {sucesso ? <p className="sucesso">{sucesso}</p> : null}
      </section>
    );
  }

  return (
    <section className="status">
      <header className="cabecalho-sessao">
        <p>
          Olá, <strong>{usuario.pessoa.nome}</strong>
        </p>
        <button type="button" onClick={() => void aoSair()} disabled={carregando}>
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
              <span className="ajuda mono">id: {cartao.pessoaId.slice(0, 8)}…</span>
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
            <label>
              Pessoa-alvo dos cuidados
              <select
                value={pessoaAlvoConviteId}
                onChange={(e) => setPessoaAlvoConviteId(e.target.value)}
                required
              >
                {pessoasUnicas.map((p) => (
                  <option key={p.pessoaId} value={p.pessoaId}>
                    {p.nome} ({p.pessoaId.slice(0, 8)}…)
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" disabled={carregando || !pessoaAlvoConviteId}>
              Gerar convite
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
        <h2>Ativar convite</h2>
        <form onSubmit={aoAtivarConvite} className="formulario">
          <label>
            Token
            <input
              value={tokenAtivar}
              onChange={(e) => setTokenAtivar(e.target.value)}
              required
              autoComplete="off"
            />
          </label>
          <label>
            Nome (opcional)
            <input
              value={nomeAtivar}
              onChange={(e) => setNomeAtivar(e.target.value)}
              autoComplete="name"
            />
          </label>
          <label>
            Senha da nova conta
            <input
              type="password"
              value={senhaAtivar}
              onChange={(e) => setSenhaAtivar(e.target.value)}
              required
              autoComplete="new-password"
            />
          </label>
          <button type="submit" disabled={carregando}>
            Ativar
          </button>
        </form>
        <p className="ajuda">
          Também em <Link href="/convites/ativar">/convites/ativar</Link>.
        </p>
      </div>

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
        <form
          className="formulario"
          onSubmit={(e) => {
            e.preventDefault();
            void aoAcumularDesenvolvimento();
          }}
        >
          <label>
            Pessoa (desenvolvimento)
            <select
              value={pessoaAlvoDesenvId}
              onChange={(e) => setPessoaAlvoDesenvId(e.target.value)}
            >
              {pessoasUnicas.map((p) => (
                <option key={p.pessoaId} value={p.pessoaId}>
                  {p.nome} ({p.pessoaId.slice(0, 8)}…)
                </option>
              ))}
            </select>
          </label>
          <button type="submit" disabled={carregando || !pessoaAlvoDesenvId}>
            Acumular responsabilidade de desenvolvimento (ACE-05)
          </button>
        </form>
      </div>

      {erro ? <p className="erro">{erro}</p> : null}
      {sucesso ? <p className="sucesso">{sucesso}</p> : null}
    </section>
  );
}
