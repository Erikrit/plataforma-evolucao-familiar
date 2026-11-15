"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  atualizarPessoa,
  obterMe,
  obterPessoa,
  type UsuarioSessao,
} from "@/lib/api";

type Perfil = {
  id: string;
  nome: string;
  vinculo: string | null;
  dataNascimento: string | null;
  possuiConta: boolean;
  areas: { id: string; rotulo: string; disponivel: boolean }[];
};

export default function PaginaPerfil() {
  const params = useParams<{ pessoaId: string }>();
  const router = useRouter();
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [usuario, setUsuario] = useState<UsuarioSessao | null>(null);
  const [vinculo, setVinculo] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    void (async () => {
      setCarregando(true);
      setErro(null);
      try {
        const me = await obterMe();
        if (!me) {
          setErro("Faça login na página inicial.");
          setCarregando(false);
          return;
        }
        setUsuario(me);
        const dados = (await obterPessoa(
          me.pessoa.familiaId,
          params.pessoaId,
        )) as Perfil;
        setPerfil(dados);
        setVinculo(dados.vinculo ?? "");
      } catch (e) {
        setErro(e instanceof Error ? e.message : "Falha ao carregar");
      } finally {
        setCarregando(false);
      }
    })();
  }, [params.pessoaId]);

  async function aoSalvar(evento: FormEvent) {
    evento.preventDefault();
    if (!usuario || !perfil) return;
    setErro(null);
    setSucesso(null);
    try {
      const dados = (await atualizarPessoa(
        usuario.pessoa.familiaId,
        perfil.id,
        { vinculo },
      )) as Perfil;
      setPerfil(dados);
      setVinculo(dados.vinculo ?? "");
      setSucesso("Vínculo salvo.");
    } catch {
      setErro("Não foi possível salvar.");
    }
  }

  const semSessao = !carregando && !usuario;

  return (
    <main>
      <p>
        <Link href="/">← Início</Link>
      </p>
      <h1>Perfil</h1>
      {carregando ? <p className="ajuda">Carregando…</p> : null}
      {erro ? (
        <p className="erro">
          {erro}{" "}
          {semSessao ? (
            <button type="button" className="secundario" onClick={() => router.push("/")}>
              Ir para entrar
            </button>
          ) : null}
        </p>
      ) : null}
      {sucesso ? <p className="sucesso">{sucesso}</p> : null}
      {perfil && usuario ? (
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
                {area.disponivel && area.id === "cuidados" ? (
                  <Link href={`/pessoas/${perfil.id}/cuidados`}>
                    {area.rotulo}
                  </Link>
                ) : area.disponivel && area.id === "historico" ? (
                  <Link href={`/pessoas/${perfil.id}/historico`}>
                    {area.rotulo}
                  </Link>
                ) : (
                  <>
                    {area.rotulo}
                    {area.disponivel ? "" : " · em breve"}
                  </>
                )}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
