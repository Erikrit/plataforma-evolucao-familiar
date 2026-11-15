"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Perfil = {
  id: string;
  nome: string;
  vinculo: string | null;
  dataNascimento: string | null;
  possuiConta: boolean;
  areas: { id: string; rotulo: string; disponivel: boolean }[];
};

type Sessao = {
  token: string;
  usuario: { pessoa: { familiaId: string } };
};

const CHAVE = "pef.sessao.ff03";
const base = () => process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export default function PaginaPerfil() {
  const params = useParams<{ pessoaId: string }>();
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [vinculo, setVinculo] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [sessao, setSessao] = useState<Sessao | null>(null);

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
  }, [params.pessoaId]);

  async function carregar(s: Sessao, pessoaId: string) {
    const resposta = await fetch(
      `${base()}/familias/${s.usuario.pessoa.familiaId}/pessoas/${pessoaId}`,
      { headers: { "x-sessao-token": s.token }, cache: "no-store" },
    );
    if (!resposta.ok) {
      throw new Error(
        resposta.status === 403
          ? "Acesso negado a esta pessoa."
          : `Erro ${resposta.status}`,
      );
    }
    const dados = (await resposta.json()) as Perfil;
    setPerfil(dados);
    setVinculo(dados.vinculo ?? "");
  }

  async function aoSalvar(evento: FormEvent) {
    evento.preventDefault();
    if (!sessao || !perfil) return;
    setErro(null);
    const resposta = await fetch(
      `${base()}/familias/${sessao.usuario.pessoa.familiaId}/pessoas/${perfil.id}`,
      {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          "x-sessao-token": sessao.token,
        },
        body: JSON.stringify({ vinculo }),
      },
    );
    if (!resposta.ok) {
      setErro("Não foi possível salvar.");
      return;
    }
    await carregar(sessao, perfil.id);
  }

  return (
    <main>
      <p>
        <Link href="/">← Início</Link>
      </p>
      <h1>Perfil</h1>
      {erro ? <p className="erro">{erro}</p> : null}
      {perfil ? (
        <section className="status">
          <h2>{perfil.nome}</h2>
          <p className="ajuda">
            {perfil.possuiConta ? "Possui conta" : "Sem conta (FAM-R01)"}
          </p>
          <form onSubmit={aoSalvar} className="formulario">
            <label>
              Vínculo (opcional)
              <input
                value={vinculo}
                onChange={(e) => setVinculo(e.target.value)}
              />
            </label>
            <button type="submit">Salvar</button>
          </form>
          <h2>Áreas</h2>
          <ul className="lista-pessoas">
            {perfil.areas.map((area) => (
              <li key={area.id}>
                {area.rotulo}
                {area.disponivel ? "" : " · em breve"}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
