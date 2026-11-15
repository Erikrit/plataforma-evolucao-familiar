"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { obterHistorico, obterMe } from "@/lib/api";

type Evento = {
  tipo: string;
  quando: string;
  resumo: string;
  origemId: string;
};

export default function PaginaHistorico() {
  const params = useParams<{ pessoaId: string }>();
  const router = useRouter();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [autenticado, setAutenticado] = useState(false);

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
        const dados = await obterHistorico(params.pessoaId);
        setEventos(dados.eventos);
      } catch (e) {
        setErro(e instanceof Error ? e.message : "Falha ao carregar");
      } finally {
        setCarregando(false);
      }
    })();
  }, [params.pessoaId]);

  return (
    <main className="cuidados-mobile">
      <p>
        <Link href={`/pessoas/${params.pessoaId}/cuidados`}>← Cuidados</Link>
      </p>
      <h1>Histórico</h1>
      <p className="ajuda">Derivado dos registros de origem (ADR-009).</p>
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
      {!carregando && autenticado && eventos.length === 0 ? (
        <p className="ajuda">Nenhum evento registrado ainda.</p>
      ) : null}
      {autenticado ? (
        <ul className="lista-pessoas">
          {eventos.map((e) => (
            <li key={`${e.tipo}-${e.origemId}-${e.quando}`}>
              <strong>{e.tipo}</strong> — {e.resumo}
            </li>
          ))}
        </ul>
      ) : null}
    </main>
  );
}
