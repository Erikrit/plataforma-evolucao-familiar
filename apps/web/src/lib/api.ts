const base = () => process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export type PessoaResumo = {
  id: string;
  nome: string;
  vinculo: string | null;
  possuiConta: boolean;
  emailConta?: string | null;
};

export type SessaoResposta = {
  token: string;
  usuario: {
    id: string;
    email: string;
    pessoa: { id: string; nome: string; familiaId: string };
  };
};

export async function entrar(
  email: string,
  senha: string,
): Promise<SessaoResposta> {
  const resposta = await fetch(`${base()}/sessoes`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });
  if (!resposta.ok) {
    throw new Error("Não foi possível entrar.");
  }
  return (await resposta.json()) as SessaoResposta;
}

export async function listarPessoas(
  familiaId: string,
  token: string,
): Promise<PessoaResumo[]> {
  const resposta = await fetch(`${base()}/familias/${familiaId}/pessoas`, {
    headers: { "x-sessao-token": token },
    cache: "no-store",
  });
  if (!resposta.ok) {
    throw new Error("Falha ao listar pessoas.");
  }
  return (await resposta.json()) as PessoaResumo[];
}

export async function criarPessoa(
  familiaId: string,
  token: string,
  nome: string,
): Promise<PessoaResumo> {
  const resposta = await fetch(`${base()}/familias/${familiaId}/pessoas`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-sessao-token": token,
    },
    body: JSON.stringify({ nome }),
  });
  if (!resposta.ok) {
    const corpo = await resposta.text();
    throw new Error(corpo || "Falha ao cadastrar pessoa.");
  }
  return (await resposta.json()) as PessoaResumo;
}
