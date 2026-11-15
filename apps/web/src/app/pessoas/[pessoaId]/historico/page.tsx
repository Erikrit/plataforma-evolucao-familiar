"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Sessao = {
  token: string;
  usuario: { pessoa: { familiaId: string } };
};

type Evento = {
  tipo: string;
  quando: string;
  resumo: string;
  origemId: string;
};

const CHAVE = "pef.sessao.ff03";
const base = () => process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export default function PaginaHistorico() {
  const params = useParams<{ pessoaId: string }>();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const bruto = window.localStorage.getItem(CHAVE);
    if (!bruto) {
      setErro("Faça login na página inicial.");
      return;
    }
    const s = JSON.parse(bruto) as Sessao;
    void (async () => {
      const resposta = await fetch(
        `${base()}/pessoas/${params.pessoaId}/historico`,
        { headers: { "x-sessao-token": s.token }, cache: "no-store" },
      );
      if (!resposta.ok) {
        setErro(
          resposta.status === 403
            ? "Acesso negado ao histórico."
            : `Erro ${resposta.status}`,
        );
        return;
      }
      const dados = (await resposta.json()) as { eventos: Evento[] };
      setEventos(dados.eventos);
    })();
  }, [params.pessoaId]);

  return (
    <main className="cuidados-mobile">
      <p>
        <Link href={`/pessoas/${params.pessoaId}/cuidados`}>← Cuidados</Link>
      </p>
      <h1>Histórico</h1>
      <p className="ajuda">Derivado dos registros de origem (ADR-009).</p>
      {erro ? <p className="erro">{erro}</p> : null}
      <ul className="lista-pessoas">
        {eventos.map((e) => (
          <li key={`${e.tipo}-${e.origemId}-${e.quando}`}>
            <strong>{e.tipo}</strong> — {e.resumo}
          </li>
        ))}
      </ul>
    </main>
  );
}
