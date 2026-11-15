const base = () => process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

/** Chave legada (token em localStorage) — removida na migração cookie-only. */
export const CHAVE_SESSAO_LEGADA = "pef.sessao.ff03";

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

export type UsuarioSessao = {
  id: string;
  email: string;
  pessoa: { id: string; nome: string; familiaId: string };
};

export type SessaoResposta = {
  autenticacao?: string;
  expiraEm?: string;
  usuario: UsuarioSessao;
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

export function limparSessaoLegada() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CHAVE_SESSAO_LEGADA);
}

const fetchApi = (caminho: string, init: RequestInit = {}) => {
  const headers = new Headers(init.headers);
  return fetch(`${base()}${caminho}`, {
    ...init,
    headers,
    credentials: "include",
    cache: init.cache ?? "no-store",
  });
};

export async function entrar(
  email: string,
  senha: string,
): Promise<SessaoResposta> {
  limparSessaoLegada();
  const resposta = await fetchApi("/sessoes", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });
  if (!resposta.ok) throw new Error(await lerErro(resposta));
  const corpo = (await resposta.json()) as SessaoResposta & { token?: string };
  return {
    autenticacao: corpo.autenticacao,
    expiraEm: corpo.expiraEm,
    usuario: corpo.usuario,
  };
}

export async function sair(): Promise<void> {
  limparSessaoLegada();
  await fetchApi("/sessoes", { method: "DELETE" });
}

export async function obterMe(): Promise<UsuarioSessao | null> {
  limparSessaoLegada();
  const resposta = await fetchApi("/me");
  if (resposta.status === 401) return null;
  if (!resposta.ok) throw new Error(await lerErro(resposta));
  return (await resposta.json()) as UsuarioSessao;
}

export async function obterInicio(
  familiaId: string,
): Promise<InicioResposta> {
  const resposta = await fetchApi(`/familias/${familiaId}/inicio`);
  if (!resposta.ok) throw new Error(await lerErro(resposta));
  return (await resposta.json()) as InicioResposta;
}

export async function criarPessoa(
  familiaId: string,
  nome: string,
): Promise<PessoaResumo> {
  const resposta = await fetchApi(`/familias/${familiaId}/pessoas`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ nome }),
  });
  if (!resposta.ok) throw new Error(await lerErro(resposta));
  return (await resposta.json()) as PessoaResumo;
}

export async function obterPessoa(familiaId: string, pessoaId: string) {
  const resposta = await fetchApi(
    `/familias/${familiaId}/pessoas/${pessoaId}`,
  );
  if (!resposta.ok) {
    throw new Error(
      resposta.status === 403
        ? "Acesso negado a esta pessoa."
        : resposta.status === 401
          ? "Faça login na página inicial."
          : `Erro ${resposta.status}`,
    );
  }
  return resposta.json();
}

export async function atualizarPessoa(
  familiaId: string,
  pessoaId: string,
  corpo: { vinculo?: string },
) {
  const resposta = await fetchApi(
    `/familias/${familiaId}/pessoas/${pessoaId}`,
    {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(corpo),
    },
  );
  if (!resposta.ok) throw new Error(await lerErro(resposta));
  return resposta.json();
}

export async function criarConvite(
  familiaId: string,
  corpo: {
    email: string;
    nomeConvidado?: string;
    responsabilidade: string;
    pessoaAlvoId: string;
  },
) {
  const resposta = await fetchApi(`/familias/${familiaId}/convites`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(corpo),
  });
  if (!resposta.ok) throw new Error(await lerErro(resposta));
  return (await resposta.json()) as { token: string; email: string };
}

export async function ativarConvite(
  token: string,
  corpo: { senha: string; nome?: string },
) {
  const resposta = await fetchApi(`/convites/${encodeURIComponent(token)}/ativar`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(corpo),
  });
  if (!resposta.ok) throw new Error(await lerErro(resposta));
  return resposta.json();
}

export async function concederAutorizacao(
  familiaId: string,
  corpo: {
    usuarioId: string;
    responsabilidade: string;
    pessoaAlvoId?: string | null;
  },
) {
  const resposta = await fetchApi(`/familias/${familiaId}/autorizacoes`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(corpo),
  });
  if (!resposta.ok) throw new Error(await lerErro(resposta));
  return resposta.json();
}

export async function obterCuidadosHoje(pessoaId: string) {
  const resposta = await fetchApi(`/pessoas/${pessoaId}/cuidados/hoje`);
  if (!resposta.ok) {
    throw new Error(
      resposta.status === 403
        ? "Acesso negado aos cuidados."
        : resposta.status === 401
          ? "Faça login na página inicial."
          : `Erro ${resposta.status}`,
    );
  }
  return resposta.json();
}

export type CadastroMedicamento = {
  nome: string;
  horarios: string[];
  ativar?: boolean;
  primeiroHorario?: string;
  dosesPorDia?: number;
  duracaoTipo?: "continua" | "dias";
  duracaoDias?: number | null;
  horariosConferidos?: boolean;
  intervaloHoras?: number | null;
  instrucoes?: string;
};

export async function cadastrarMedicamento(
  pessoaId: string,
  corpo: CadastroMedicamento,
) {
  const resposta = await fetchApi(`/pessoas/${pessoaId}/medicamentos`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(corpo),
  });
  if (!resposta.ok) throw new Error(await lerErro(resposta));
  return resposta.json();
}

export type AlteracaoProgramacaoMedicamento = {
  horarios: string[];
  frequencia?: string;
  primeiroHorario?: string;
  dosesPorDia?: number;
  duracaoTipo?: "continua" | "dias";
  duracaoDias?: number | null;
  horariosConferidos?: boolean;
  intervaloHoras?: number | null;
};

export async function alterarProgramacaoMedicamento(
  medicamentoId: string,
  corpo: AlteracaoProgramacaoMedicamento,
) {
  const resposta = await fetchApi(
    `/medicamentos/${medicamentoId}/programacao`,
    {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(corpo),
    },
  );
  if (!resposta.ok) throw new Error(await lerErro(resposta));
  return resposta.json();
}

export async function registrarDose(
  medicamentoId: string,
  corpo: { data?: string; horario: string; situacao: string },
) {
  const resposta = await fetchApi(
    `/medicamentos/${medicamentoId}/doses/registros`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(corpo),
    },
  );
  if (!resposta.ok) throw new Error(await lerErro(resposta));
  return resposta.json();
}

export async function registrarAtividadeApoio(
  pessoaId: string,
  descricao: string,
) {
  const resposta = await fetchApi(`/pessoas/${pessoaId}/atividades-apoio`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ descricao }),
  });
  if (!resposta.ok) throw new Error(await lerErro(resposta));
  return resposta.json();
}

export async function criarConsulta(
  pessoaId: string,
  corpo: { especialidadeOuDescricao: string; dataHora: string },
) {
  const resposta = await fetchApi(`/pessoas/${pessoaId}/consultas`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(corpo),
  });
  if (!resposta.ok) throw new Error(await lerErro(resposta));
  return resposta.json();
}

export async function obterHistorico(pessoaId: string) {
  const resposta = await fetchApi(`/pessoas/${pessoaId}/historico`);
  if (!resposta.ok) {
    throw new Error(
      resposta.status === 403
        ? "Acesso negado ao histórico."
        : resposta.status === 401
          ? "Faça login na página inicial."
          : `Erro ${resposta.status}`,
    );
  }
  return (await resposta.json()) as {
    eventos: {
      tipo: string;
      quando: string;
      resumo: string;
      origemId: string;
    }[];
  };
}
