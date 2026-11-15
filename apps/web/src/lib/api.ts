const base = () => process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export type PessoaResumo = {
  id: string;
  nome: string;
  vinculo: string | null;
  possuiConta: boolean;
  emailConta?: string | null;
};

export type CartaoInicio = {
  pessoaId: string;
  nome: string;
  vinculo: string | null;
  possuiConta: boolean;
  resumo: string;
};

export type AutorizacaoResumo = {
  id: string;
  responsabilidade: string;
  pessoaAlvoId: string | null;
  pessoaAlvo?: { id: string; nome: string } | null;
};

export type InicioResposta = {
  familiaId: string;
  cartoes: CartaoInicio[];
  autorizacoes: AutorizacaoResumo[];
  filtradoPorAutorizacao: boolean;
};

export type SessaoResposta = {
  token: string;
  usuario: {
    id: string;
    email: string;
    pessoa: { id: string; nome: string; familiaId: string };
  };
};

async function lerErro(resposta: Response) {
  const texto = await resposta.text();
  try {
    const json = JSON.parse(texto) as { message?: string | string[] };
    if (Array.isArray(json.message)) return json.message.join("; ");
    return json.message ?? texto;
  } catch {
    return texto || `HTTP ${resposta.status}`;
  }
}

export async function entrar(
  email: string,
  senha: string,
): Promise<SessaoResposta> {
  const resposta = await fetch(`${base()}/sessoes`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });
  if (!resposta.ok) throw new Error(await lerErro(resposta));
  return (await resposta.json()) as SessaoResposta;
}

export async function obterInicio(
  familiaId: string,
  token: string,
): Promise<InicioResposta> {
  const resposta = await fetch(`${base()}/familias/${familiaId}/inicio`, {
    headers: { "x-sessao-token": token },
    cache: "no-store",
  });
  if (!resposta.ok) throw new Error(await lerErro(resposta));
  return (await resposta.json()) as InicioResposta;
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
  if (!resposta.ok) throw new Error(await lerErro(resposta));
  return (await resposta.json()) as PessoaResumo;
}

export async function criarConvite(
  familiaId: string,
  token: string,
  corpo: {
    email: string;
    nomeConvidado?: string;
    responsabilidade: string;
    pessoaAlvoId: string;
  },
) {
  const resposta = await fetch(`${base()}/familias/${familiaId}/convites`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-sessao-token": token,
    },
    body: JSON.stringify(corpo),
  });
  if (!resposta.ok) throw new Error(await lerErro(resposta));
  return (await resposta.json()) as { token: string; email: string };
}

export async function concederAutorizacao(
  familiaId: string,
  token: string,
  corpo: {
    usuarioId: string;
    responsabilidade: string;
    pessoaAlvoId?: string | null;
  },
) {
  const resposta = await fetch(`${base()}/familias/${familiaId}/autorizacoes`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-sessao-token": token,
    },
    body: JSON.stringify(corpo),
  });
  if (!resposta.ok) throw new Error(await lerErro(resposta));
  return resposta.json();
}
