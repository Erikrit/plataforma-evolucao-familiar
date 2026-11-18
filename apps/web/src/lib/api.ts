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

export type AreasAutorizadasCartao = {
  cuidados: boolean;
  desenvolvimento: boolean;
  historico: boolean;
};

export type CartaoInicio = {
  pessoaId: string;
  nome: string;
  vinculo: string | null;
  possuiConta: boolean;
  resumo: string;
  areasAutorizadas?: AreasAutorizadasCartao;
};

export type DestaqueInicio = {
  tipo: "consulta_proxima" | "experiencia_recente";
  pessoaId: string;
  pessoaNome: string;
  titulo: string;
  quando: string;
};

export type AutorizacaoResumo = {
  id: string;
  responsabilidade: string;
  pessoaAlvoId: string | null;
  pessoaAlvo?: { id: string; nome: string } | null;
};

export type AcessoResumo = {
  id: string;
  participanteNome: string;
  participantePessoaId: string;
  papel: "Administrador" | "Responsável" | "Colaborador";
  pessoaAcompanhadaNome: string | null;
  pessoaAcompanhadaId: string | null;
  ativo: boolean;
};

export type AcessosResposta = {
  modo: "administracao" | "proprios_dados";
  somenteLeitura: boolean;
  itens: AcessoResumo[];
};

export type InicioResposta = {
  familiaId: string;
  cartoes: CartaoInicio[];
  destaques?: DestaqueInicio[];
  autorizacoes: AutorizacaoResumo[];
  acessos?: AcessosResposta;
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

export async function obterAcessos(familiaId: string) {
  const resposta = await fetchApi(`/familias/${familiaId}/acessos`);
  if (!resposta.ok) throw new Error(await lerErro(resposta));
  return (await resposta.json()) as AcessosResposta;
}

export async function revogarAutorizacao(
  familiaId: string,
  autorizacaoId: string,
) {
  const resposta = await fetchApi(
    `/familias/${familiaId}/autorizacoes/${autorizacaoId}`,
    { method: "DELETE" },
  );
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

export type MedicamentoLista = {
  id: string;
  nome: string;
  status: string;
  programacoes?: {
    horarios: string[] | unknown;
    duracaoTipo?: string | null;
    duracaoDias?: number | null;
    vigenciaInicio?: string;
  }[];
};

export async function listarMedicamentos(pessoaId: string) {
  const resposta = await fetchApi(`/pessoas/${pessoaId}/medicamentos`);
  if (!resposta.ok) {
    throw new Error(
      resposta.status === 403
        ? "Acesso negado aos medicamentos."
        : `Erro ${resposta.status}`,
    );
  }
  return resposta.json() as Promise<MedicamentoLista[]>;
}

export type ConsultaLista = {
  id: string;
  especialidadeOuDescricao: string;
  dataHora: string;
  status: string;
  profissional?: string | null;
  local?: string | null;
  observacao?: string | null;
};

export async function listarConsultas(pessoaId: string) {
  const resposta = await fetchApi(`/pessoas/${pessoaId}/consultas`);
  if (!resposta.ok) {
    throw new Error(
      resposta.status === 403
        ? "Acesso negado às consultas."
        : `Erro ${resposta.status}`,
    );
  }
  return resposta.json() as Promise<ConsultaLista[]>;
}

export type ExameLista = {
  id: string;
  descricao: string;
  data: string | null;
  consultaId?: string | null;
  anexoId?: string | null;
  criadoEm?: string;
};

export async function listarExames(pessoaId: string) {
  const resposta = await fetchApi(`/pessoas/${pessoaId}/exames`);
  if (!resposta.ok) {
    throw new Error(
      resposta.status === 403
        ? "Acesso negado aos exames."
        : `Erro ${resposta.status}`,
    );
  }
  return resposta.json() as Promise<ExameLista[]>;
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

export async function encerrarOuSuspenderMedicamento(
  medicamentoId: string,
  acao: "suspender" | "encerrar",
) {
  const resposta = await fetchApi(
    `/medicamentos/${medicamentoId}/encerramento`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ acao }),
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

export async function atualizarConsulta(
  consultaId: string,
  corpo: {
    status?: "agendada" | "realizada" | "cancelada";
    dataHora?: string;
    especialidadeOuDescricao?: string;
  },
) {
  const resposta = await fetchApi(`/consultas/${consultaId}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(corpo),
  });
  if (!resposta.ok) throw new Error(await lerErro(resposta));
  return resposta.json();
}

export async function criarExame(
  pessoaId: string,
  corpo: {
    descricao: string;
    data?: string | null;
    consultaId?: string | null;
    anexoId?: string | null;
  },
) {
  const resposta = await fetchApi(`/pessoas/${pessoaId}/exames`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(corpo),
  });
  if (!resposta.ok) throw new Error(await lerErro(resposta));
  return resposta.json();
}

export async function criarAnexo(
  familiaId: string,
  corpo: {
    pessoaId: string;
    nomeArquivo: string;
    mimeTipo: string;
    conteudoBase64: string;
  },
) {
  const resposta = await fetchApi(`/familias/${familiaId}/anexos`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(corpo),
  });
  if (!resposta.ok) throw new Error(await lerErro(resposta));
  return resposta.json() as Promise<{ id: string; nomeArquivo: string }>;
}

export type EventoHistorico = {
  tipo: string;
  dominio?: "cuidados" | "desenvolvimento";
  quando: string;
  resumo: string;
  origemId: string;
  categoria?: string | null;
};

export type HistoricoResposta = {
  pessoaId: string;
  derivadoDeRegistrosOrigem?: boolean;
  dominios?: { cuidados: boolean; desenvolvimento: boolean };
  filtro?: { de: string | null; ate: string | null; dominio: string | null };
  eventos: EventoHistorico[];
};

export async function obterHistorico(
  pessoaId: string,
  filtro?: { de?: string; ate?: string; dominio?: string },
): Promise<HistoricoResposta> {
  const params = new URLSearchParams();
  if (filtro?.de) params.set("de", filtro.de);
  if (filtro?.ate) params.set("ate", filtro.ate);
  if (filtro?.dominio) params.set("dominio", filtro.dominio);
  const q = params.toString();
  const resposta = await fetchApi(
    `/pessoas/${pessoaId}/historico${q ? `?${q}` : ""}`,
  );
  if (!resposta.ok) {
    throw new Error(
      resposta.status === 403
        ? "Acesso negado ao histórico."
        : resposta.status === 401
          ? "Faça login na página inicial."
          : `Erro ${resposta.status}`,
    );
  }
  return (await resposta.json()) as HistoricoResposta;
}

export type DesafioResumo = {
  id: string;
  nome: string;
  instrucao: string | null;
  categoria: string | null;
  dificuldade: string;
  materiais: string | null;
  duracaoMinutos: number | null;
  origem: string;
  familiaId: string | null;
  guardado: boolean;
};

export type ListaDesafios = {
  pessoaId: string;
  total: number;
  desafios: DesafioResumo[];
};

export type ParticipacaoRegistrada = {
  id: string;
  pessoaId: string;
  desafioId: string;
  resultado: string;
  observacao: string | null;
  execucaoChave: string;
  dificuldadeAplicada: string;
  estrelasConcedidas: number;
  registradoEm: string;
  idempotente: boolean;
  saldoAtual: number;
};

export type EstrelasResumo = {
  pessoaId: string;
  saldoDisponivel: number;
  totalConquistado: number;
  totalResgatado: number;
  movimentosRecentes: {
    id: string;
    tipo: string;
    quantidade: number;
    saldoApos: number;
    criadoEm: string;
  }[];
  resgatesRecentes: {
    id: string;
    recompensaId: string;
    nome: string;
    custoAplicado: number;
    resgatadoEm: string;
  }[];
};

export type RecompensaResumo = {
  id: string;
  nome: string;
  custo: number;
  ativa: boolean;
};

function erroDesenvolvimento(status: number, fallback: string) {
  if (status === 403) return "Acesso negado ao desenvolvimento.";
  if (status === 401) return "Faça login na página inicial.";
  return fallback;
}

export type ResumoCuidados = {
  pessoaId: string;
  tipo: string;
  periodo: { de: string; ate: string };
  doses: {
    previstos: number;
    tomadasInformadas: number;
    naoTomadasInformadas: number;
    semConfirmacao: number;
  };
  esclarecimento: string;
  consultas: {
    id: string;
    especialidadeOuDescricao: string;
    dataHora: string;
    status: string;
  }[];
  exames: { id: string; descricao: string; criadoEm: string }[];
  inferenciaClinica: boolean;
};

export async function obterResumoCuidados(
  pessoaId: string,
  periodo: { de: string; ate: string },
): Promise<ResumoCuidados> {
  const params = new URLSearchParams({
    de: periodo.de,
    ate: periodo.ate,
  });
  const resposta = await fetchApi(
    `/pessoas/${pessoaId}/resumo-cuidados?${params}`,
  );
  if (!resposta.ok) {
    throw new Error(
      resposta.status === 403
        ? "Acesso negado ao resumo."
        : resposta.status === 401
          ? "Faça login na página inicial."
          : await lerErro(resposta),
    );
  }
  return (await resposta.json()) as ResumoCuidados;
}

export type ResumoDesenvolvimento = {
  pessoaId: string;
  tipo: string;
  periodo: { de: string; ate: string };
  experiencias: {
    id: string;
    nome: string;
    categoria: string;
    origem: string;
    resultado: string;
    estrelasConcedidas: number;
    observacao: string | null;
    registradoEm: string;
  }[];
  categoriasExploradas: { categoria: string; quantidade: number }[];
  estrelas: {
    concedidasNoPeriodo: number;
    esclarecimento: string;
  };
  observacoes: {
    experienciaId: string;
    nome: string;
    texto: string;
    registradoEm: string;
  }[];
  inferenciaClinica: boolean;
  ranking: boolean;
};

export async function obterResumoDesenvolvimento(
  pessoaId: string,
  periodo: { de: string; ate: string },
): Promise<ResumoDesenvolvimento> {
  const params = new URLSearchParams({
    de: periodo.de,
    ate: periodo.ate,
  });
  const resposta = await fetchApi(
    `/pessoas/${pessoaId}/resumo-desenvolvimento?${params}`,
  );
  if (!resposta.ok) {
    throw new Error(
      resposta.status === 403
        ? "Acesso negado ao resumo."
        : resposta.status === 401
          ? "Faça login na página inicial."
          : await lerErro(resposta),
    );
  }
  return (await resposta.json()) as ResumoDesenvolvimento;
}

export type ResumoPrevia = {
  pessoaId: string;
  periodo: { de: string; ate: string };
  geradoEm: string;
  dominios: { cuidados: boolean; desenvolvimento: boolean };
  cuidados: ResumoCuidados | null;
  desenvolvimento: ResumoDesenvolvimento | null;
  anexosIncluidos: boolean;
  inferenciaClinica: boolean;
  avisoPrivacidade: string;
  previa: boolean;
};

export type RelatorioPdf = {
  previa: ResumoPrevia;
  pdfBase64: string;
  mimeTipo: string;
  anexosIncluidos: boolean;
};

export async function obterResumoPrevia(
  pessoaId: string,
  periodo: { de: string; ate: string },
): Promise<ResumoPrevia> {
  const params = new URLSearchParams({
    de: periodo.de,
    ate: periodo.ate,
  });
  const resposta = await fetchApi(
    `/pessoas/${pessoaId}/resumo-previa?${params}`,
  );
  if (!resposta.ok) {
    throw new Error(
      resposta.status === 403
        ? "Acesso negado ao resumo."
        : resposta.status === 401
          ? "Faça login na página inicial."
          : await lerErro(resposta),
    );
  }
  return (await resposta.json()) as ResumoPrevia;
}

export async function obterRelatorioPdf(
  pessoaId: string,
  periodo: { de: string; ate: string },
): Promise<RelatorioPdf> {
  const params = new URLSearchParams({
    de: periodo.de,
    ate: periodo.ate,
  });
  const resposta = await fetchApi(
    `/pessoas/${pessoaId}/relatorio.pdf?${params}`,
  );
  if (!resposta.ok) {
    throw new Error(
      resposta.status === 403
        ? "Sem permissão para exportar o PDF completo."
        : resposta.status === 401
          ? "Faça login na página inicial."
          : await lerErro(resposta),
    );
  }
  return (await resposta.json()) as RelatorioPdf;
}

export async function listarDesafios(
  pessoaId: string,
  filtro?: { categoria?: string; guardados?: boolean },
): Promise<ListaDesafios> {
  const params = new URLSearchParams();
  if (filtro?.categoria) params.set("categoria", filtro.categoria);
  if (filtro?.guardados) params.set("guardados", "1");
  const q = params.toString();
  const resposta = await fetchApi(
    `/pessoas/${pessoaId}/desafios${q ? `?${q}` : ""}`,
  );
  if (!resposta.ok) {
    throw new Error(
      erroDesenvolvimento(resposta.status, await lerErro(resposta)),
    );
  }
  return (await resposta.json()) as ListaDesafios;
}

export async function criarDesafioPersonalizado(
  pessoaId: string,
  corpo: {
    nome: string;
    dificuldade?: string;
    instrucao?: string | null;
    categoria?: string | null;
    materiais?: string | null;
  },
): Promise<DesafioResumo> {
  const resposta = await fetchApi(`/pessoas/${pessoaId}/desafios`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(corpo),
  });
  if (!resposta.ok) {
    throw new Error(
      erroDesenvolvimento(resposta.status, await lerErro(resposta)),
    );
  }
  return (await resposta.json()) as DesafioResumo;
}

export async function guardarDesafio(pessoaId: string, desafioId: string) {
  const resposta = await fetchApi(
    `/pessoas/${pessoaId}/desafios/${desafioId}/guardar`,
    { method: "POST" },
  );
  if (!resposta.ok) {
    throw new Error(
      erroDesenvolvimento(resposta.status, await lerErro(resposta)),
    );
  }
  return resposta.json();
}

export async function retirarDesafioGuardado(
  pessoaId: string,
  desafioId: string,
) {
  const resposta = await fetchApi(
    `/pessoas/${pessoaId}/desafios/${desafioId}/guardar`,
    { method: "DELETE" },
  );
  if (!resposta.ok) {
    throw new Error(
      erroDesenvolvimento(resposta.status, await lerErro(resposta)),
    );
  }
  return resposta.json();
}

export async function registrarParticipacaoDesafio(
  pessoaId: string,
  corpo: {
    desafioId: string;
    resultado: "concluiu" | "participou";
    observacao?: string | null;
    execucaoChave?: string;
  },
): Promise<ParticipacaoRegistrada> {
  const resposta = await fetchApi(`/pessoas/${pessoaId}/participacoes`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(corpo),
  });
  if (!resposta.ok) {
    throw new Error(
      erroDesenvolvimento(resposta.status, await lerErro(resposta)),
    );
  }
  return (await resposta.json()) as ParticipacaoRegistrada;
}

export async function obterEstrelas(pessoaId: string): Promise<EstrelasResumo> {
  const resposta = await fetchApi(`/pessoas/${pessoaId}/estrelas`);
  if (!resposta.ok) {
    throw new Error(
      erroDesenvolvimento(resposta.status, await lerErro(resposta)),
    );
  }
  return (await resposta.json()) as EstrelasResumo;
}

export async function listarRecompensas(
  pessoaId: string,
): Promise<RecompensaResumo[]> {
  const resposta = await fetchApi(`/pessoas/${pessoaId}/recompensas`);
  if (!resposta.ok) {
    throw new Error(
      erroDesenvolvimento(resposta.status, await lerErro(resposta)),
    );
  }
  const corpo = (await resposta.json()) as
    | RecompensaResumo[]
    | { recompensas: RecompensaResumo[] };
  return Array.isArray(corpo) ? corpo : corpo.recompensas;
}

export async function criarRecompensa(
  pessoaId: string,
  corpo: { nome: string; custo: number },
): Promise<RecompensaResumo> {
  const resposta = await fetchApi(`/pessoas/${pessoaId}/recompensas`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(corpo),
  });
  if (!resposta.ok) {
    throw new Error(
      erroDesenvolvimento(resposta.status, await lerErro(resposta)),
    );
  }
  return (await resposta.json()) as RecompensaResumo;
}

export async function resgatarRecompensa(
  pessoaId: string,
  recompensaId: string,
) {
  const resposta = await fetchApi(`/pessoas/${pessoaId}/resgates`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ recompensaId }),
  });
  if (!resposta.ok) {
    throw new Error(
      erroDesenvolvimento(resposta.status, await lerErro(resposta)),
    );
  }
  return resposta.json();
}
