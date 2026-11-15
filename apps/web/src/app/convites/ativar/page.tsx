"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { ativarConvite } from "@/lib/api";

export default function PaginaAtivarConvite() {
  const [token, setToken] = useState("");
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inicial = params.get("token");
    if (inicial) setToken(inicial);
  }, []);

  async function aoAtivar(evento: FormEvent) {
    evento.preventDefault();
    setCarregando(true);
    setErro(null);
    setSucesso(null);
    try {
      await ativarConvite(token.trim(), {
        senha,
        nome: nome.trim() || undefined,
      });
      setSenha("");
      setSucesso("Convite ativado. Você já pode entrar na página inicial.");
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Falha ao ativar");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main>
      <p>
        <Link href="/">← Início</Link>
      </p>
      <h1>Ativar convite</h1>
      <section className="status">
        <form onSubmit={aoAtivar} className="formulario">
          <label>
            Token
            <input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
              autoComplete="off"
            />
          </label>
          <label>
            Nome (opcional)
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              autoComplete="name"
            />
          </label>
          <label>
            Senha
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              autoComplete="new-password"
            />
          </label>
          <button type="submit" disabled={carregando}>
            Ativar conta
          </button>
        </form>
        {erro ? <p className="erro">{erro}</p> : null}
        {sucesso ? <p className="sucesso">{sucesso}</p> : null}
      </section>
    </main>
  );
}
