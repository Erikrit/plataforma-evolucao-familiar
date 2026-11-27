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

export type EstadoContaPessoa =
  | "sem_conta"
  | "convite_pendente"
  | "convite_expirado"
  | "conta_ativa";

export type CartaoInicio = {
  pessoaId: string;
  nome: string;
  vinculo: string | null;
  possuiConta: boolean;
  /** Presente só para administrador (ADR-014); nunca para não-admin. */
  usuarioId?: string;
  /** Metadado administrativo de conta/convite (E2-ACE-05). */
  estadoConta?: EstadoContaPessoa;
  /** Só para administrador: se a pessoa já tem data de nascimento (M01 §16). */
  possuiDataNascimento?: boolean;
  resumo: string;
  areasAutorizadas?: AreasAutorizadasCartao;
};

export type EstadoConvite = "pendente" | "expirado" | "ativado";

export type ConviteResumo = {
  id: string;
  email: string;
  nomeConvidado?: string | null;
  responsabilidade?: string | null;
  pessoaAlvoId?: string | null;
  pessoaAlvoNome?: string | null;
  pessoaContaId?: string | null;
  pessoaContaNome?: string | null;
  expiraEm: string;
  usadoEm?: string | null;
  criadoEm: string;
  estado: EstadoConvite;
};

export type ConviteCriado = {
  id?: string;
  token: string;
  email: string;
  pessoaContaId?: string | null;
  expiraEm?: string;
  estado?: EstadoConvite;
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
  /** Conta do participante; distingue homônimos (ADR-014 / consulta por participante). */
  participanteUsuarioId?: string;
  papel: "Administrador" | "Responsável" | "Colaborador";
  /** Cuidados | Desenvolvimento | null (administrador). ADR-014. */
  area?: "Cuidados" | "Desenvolvimento" | null;
  pessoaAcompanhadaNome: string | null;
  pessoaAcompanhadaId: string | null;
  ativo: boolean;
};

/** Combinações contextuais concedíveis (ADR-014); espelha o catálogo da API. */
export const COMBINACOES_ACESSO_CONCEDIVEIS = [
  {
    area: "Cuidados" as const,
    rotulo: "Responsável" as const,
    responsabilidade: "responsavel_cuidados" as const,
  },
  {
    area: "Cuidados" as const,
    rotulo: "Integrante" as const,
    responsabilidade: "colaboradora_cuidados" as const,
  },
  {
    area: "Desenvolvimento" as const,
    rotulo: "Responsável" as const,
    responsabilidade: "responsavel_desenvolvimento" as const,
  },
] as const;

export type CombinacaoAcessoConcedivel =
  (typeof COMBINACOES_ACESSO_CONCEDIVEIS)[number];

/** Textos de referência da especificação de correção M01 (ações prometidas). */
export function resumoAcoesCombinacao(
  responsabilidade: CombinacaoAcessoConcedivel["responsabilidade"],
  nomePessoa: string,
): string {
  const pessoa = nomePessoa.trim() || "a pessoa selecionada";
  if (responsabilidade === "responsavel_cuidados") {
    return `Pode ver a rotina, registrar cuidados, programar, consultar anexos e exportar informações de Cuidados de ${pessoa}.`;
  }
  if (responsabilidade === "colaboradora_cuidados") {
    return `Pode ver a rotina e registrar apoio e doses de ${pessoa}. Programação, anexos clínicos e exportação ficam disponíveis ao Responsável.`;
  }
  return `Pode acompanhar, participar, organizar e exportar informações de Desenvolvimento de ${pessoa}.`;
}

export function textoRevisaoAcesso(entrada: {
  participanteNome: string;
  area: CombinacaoAcessoConcedivel["area"];
  responsabilidade: CombinacaoAcessoConcedivel["responsabilidade"];
  nomePessoa: string;
  convite?: boolean;
}): string {
  const participante =
    entrada.participanteNome.trim() ||
    (entrada.convite ? "a pessoa convidada" : "o participante");
  const pessoa = entrada.nomePessoa.trim() || "a pessoa selecionada";
  const combinacao = COMBINACOES_ACESSO_CONCEDIVEIS.find(
    (c) => c.responsabilidade === entrada.responsabilidade,
  );
  const papel = combinacao?.rotulo ?? "Responsável";
  const frase = `${participante} acompanhará ${pessoa} em ${entrada.area} como ${papel}.`;
  const prefixo = entrada.convite ? `Após a ativação: ${frase}` : frase;
  const resumo = resumoAcoesCombinacao(
    entrada.responsabilidade,
    pessoa,
  ).replace(/^Pode /, "Poderá ");
  return `${prefixo} ${resumo}`;
}

export function rotuloEstadoConta(estado?: EstadoContaPessoa): string {
  switch (estado) {
    case "conta_ativa":
      return "conta ativa";
    case "convite_pendente":
      return "convite pendente";
    case "convite_expirado":
      return "convite expirado";
    case "sem_conta":
      return "sem conta";
    default:
      return "";
  }
}

export function rotuloEstadoConvite(estado: EstadoConvite): string {
  switch (estado) {
    case "pendente":
      return "pendente";
    case "expirado":
      return "expirado";
    case "ativado":
      return "ativado";
    default:
      return estado;
  }
}

export function formatarValidadeConvite(expiraEm?: string | null): string {
  if (!expiraEm) return "";
  const data = new Date(expiraEm);
  if (Number.isNaN(data.getTime())) return "";
  return data.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export const TEXTO_ADMINISTRACAO_FAMILIA =
  "Gerencia pessoas, convites e acessos da família. O acesso a Cuidados e Desenvolvimento depende das responsabilidades de cada pessoa.";

export type AcessosResposta = {
  modo: "administracao" | "proprios_dados";
  somenteLeitura: boolean;
  itens: AcessoResumo[];
};

export type ContextoOperacional = {
  pessoaId: string;
  nome: string;
  area: "cuidados" | "desenvolvimento";
  href: string;
};

export type InicioResposta = {
  familiaId: string;
  familiaSlug?: string;
  cartoes: CartaoInicio[];
  destaques?: DestaqueInicio[];
  autorizacoes: AutorizacaoResumo[];
  acessos?: AcessosResposta;
  /** Capacidades efetivas por pessoa/área (M01 v1.5 §11). */
  contextos?: ContextoOperacional[];
  /** Destino único pós-login; null quando há escolha ou nenhum. */
  destinoEntrada?: string | null;
  filtradoPorAutorizacao: boolean;
};

export type FamiliaContexto = {
  id: string;
  nome: string;
  slug: string;
};

export type FamiliaCriada = {
  familia: FamiliaContexto;
  pessoa: { id: string; nome: string };
  usuario: { id: string; email: string };
  caminhoEntrada: string;
};

export type UsuarioSessao = {
  id: string;
  email: string;
  pessoa: { id: string; nome: string; familiaId: string };
  familia?: FamiliaContexto;
};

export type SessaoResposta = {
  autenticacao?: string;
  expiraEm?: string;
  usuario: UsuarioSessao;
  familia?: FamiliaContexto;
};

export class ErroApi extends Error {
  codigo?: string;
  alternativa?: string;
  status?: number;

  constructor(
    mensagem: string,
    extras?: { codigo?: string; alternativa?: string; status?: number },
  ) {
    super(mensagem);
    this.name = "ErroApi";
    this.codigo = extras?.codigo;
    this.alternativa = extras?.alternativa;
    this.status = extras?.status;
  }
}

/** Erro com código estável da API, para a tela reagir (ex.: pedir a data de nascimento). */
async function erroComCodigo(resposta: Response): Promise<ErroApi> {
  const detalhe = await lerErroDetalhado(resposta);
  return new ErroApi(detalhe.mensagem, {
    codigo: detalhe.codigo,
    alternativa: detalhe.alternativa,
    status: resposta.status,
  });
}

async function lerErro(resposta: Response): Promise<string> {
  const detalhe = await lerErroDetalhado(resposta);
  return detalhe.mensagem;
}

async function lerErroDetalhado(resposta: Response): Promise<{
  mensagem: string;
  codigo?: string;
  alternativa?: string;
  categoria?: string;
}> {
  const texto = await resposta.text();
  try {
    const json = JSON.parse(texto) as {
      message?:
        | string
        | string[]
        | {
            message?: string;
            mensagem?: string;
            codigo?: string;
            alternativa?: string;
            categoria?: string;
          };
      codigo?: string;
      alternativa?: string;
      categoria?: string;
      mensagem?: string;
    };
    if (Array.isArray(json.message)) {
      return { mensagem: json.message.join("; ") };
    }
    if (json.message && typeof json.message === "object") {
      return {
        mensagem:
          json.message.mensagem ?? json.message.message ?? texto,
        codigo: json.message.codigo ?? json.codigo,
        alternativa: json.message.alternativa ?? json.alternativa,
        categoria: json.message.categoria ?? json.categoria,
      };
    }
    return {
      mensagem:
        (json.message as string | undefined) ?? json.mensagem ?? texto,
      codigo: json.codigo,
      alternativa: json.alternativa,
      categoria: json.categoria,
    };
  } catch {
    return { mensagem: texto || `HTTP ${resposta.status}` };
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

export async function obterContextoFamilia(
  slug: string,
): Promise<FamiliaContexto> {
  const resposta = await fetchApi(
    `/familias/contexto/${encodeURIComponent(slug)}`,
  );
  if (!resposta.ok) throw new Error(await lerErro(resposta));
  return (await resposta.json()) as FamiliaContexto;
}

export async function sugerirEnderecoFamilia(
  nome: string,
): Promise<{ slug: string }> {
  const resposta = await fetchApi(
    `/familias/sugerir-endereco?nome=${encodeURIComponent(nome)}`,
  );
  if (!resposta.ok) throw new Error(await lerErro(resposta));
  return (await resposta.json()) as { slug: string };
}

export async function cadastrarFamilia(entrada: {
  nomeFamilia: string;
  nomeTitular: string;
  email: string;
  senha: string;
  slug: string;
}): Promise<FamiliaCriada> {
  const resposta = await fetchApi("/familias", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      nomeFamilia: entrada.nomeFamilia,
      nomeTitular: entrada.nomeTitular,
      email: entrada.email,
      senha: entrada.senha,
      slug: entrada.slug,
    }),
  });
  if (!resposta.ok) {
    const detalhe = await lerErroDetalhado(resposta);
    throw new ErroApi(detalhe.mensagem, {
      codigo: detalhe.codigo,
      alternativa: detalhe.alternativa,
    });
  }
  return (await resposta.json()) as FamiliaCriada;
}

export async function entrar(
  email: string,
  senha: string,
  familiaSlug: string,
): Promise<SessaoResposta> {
  limparSessaoLegada();
  const resposta = await fetchApi("/sessoes", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, senha, familiaSlug }),
  });
  if (!resposta.ok) throw new Error(await lerErro(resposta));
  const corpo = (await resposta.json()) as SessaoResposta & { token?: string };
  return {
    autenticacao: corpo.autenticacao,
    expiraEm: corpo.expiraEm,
    usuario: corpo.usuario,
    familia: corpo.familia,
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
  corpo: { vinculo?: string; dataNascimento?: string | null },
) {
  const resposta = await fetchApi(
    `/familias/${familiaId}/pessoas/${pessoaId}`,
    {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(corpo),
    },
  );
  if (!resposta.ok) throw await erroComCodigo(resposta);
  return resposta.json();
}

export async function listarConvites(familiaId: string): Promise<ConviteResumo[]> {
  const resposta = await fetchApi(`/familias/${familiaId}/convites`);
  if (!resposta.ok) throw new Error(await lerErro(resposta));
  return (await resposta.json()) as ConviteResumo[];
}

export async function criarConvite(
  familiaId: string,
  corpo: {
    email: string;
    nomeConvidado?: string;
    responsabilidade?: string;
    pessoaAlvoId?: string;
    /** Habilita conta na pessoa já cadastrada (sem criar segunda pessoa). */
    pessoaContaId?: string;
    /** M01 §16: data da pessoa acompanhada, pedida quando falta. */
    dataNascimentoAlvo?: string;
  },
): Promise<ConviteCriado> {
  const resposta = await fetchApi(`/familias/${familiaId}/convites`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(corpo),
  });
  if (!resposta.ok) throw await erroComCodigo(resposta);
  return (await resposta.json()) as ConviteCriado;
}

export async function ativarConvite(
  token: string,
  corpo: { senha: string; nome?: string; familiaSlug: string },
): Promise<{
  ok?: boolean;
  pessoaId?: string;
  reutilizouPessoa?: boolean;
  familiaSlug?: string;
  destinoEntrada?: string;
}> {
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
    /** M01 §16: data da pessoa acompanhada, pedida quando falta. */
    dataNascimentoAlvo?: string;
  },
) {
  const resposta = await fetchApi(`/familias/${familiaId}/autorizacoes`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(corpo),
  });
  if (!resposta.ok) throw await erroComCodigo(resposta);
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
  categoria?: string | null;
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
  categoria?: string | null;
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
  corpo: {
    categoria: string;
    especialidadeOuDescricao?: string;
    dataHora: string;
  },
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
    categoria: string;
    descricao?: string;
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

export type AnexoPrivado = {
  id: string;
  nomeArquivo: string;
  mimeTipo: string;
  tamanhoBytes: number;
  conteudoBase64: string | null;
  acesso: string;
};

export async function obterAnexoPrivado(anexoId: string): Promise<AnexoPrivado> {
  const resposta = await fetchApi(`/anexos/${anexoId}`);
  if (!resposta.ok) {
    if (resposta.status === 401) {
      throw new Error("Faça login na página inicial para baixar o arquivo.");
    }
    if (resposta.status === 403) {
      throw new Error("Sem permissão para baixar este documento.");
    }
    if (resposta.status === 404) {
      throw new Error("Arquivo indisponível.");
    }
    throw new Error(await lerErro(resposta));
  }
  return (await resposta.json()) as AnexoPrivado;
}

/** Dispara download local e libera a URL temporária; não persiste o conteúdo. */
export function baixarBytesBase64(
  base64: string,
  mimeTipo: string,
  nomeArquivo: string,
) {
  const binario = atob(base64);
  const bytes = new Uint8Array(binario.length);
  for (let i = 0; i < binario.length; i += 1) {
    bytes[i] = binario.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: mimeTipo || "application/octet-stream" });
  const url = URL.createObjectURL(blob);
  try {
    const link = document.createElement("a");
    link.href = url;
    link.download = nomeArquivo || "documento";
    link.rel = "noopener";
    link.click();
  } finally {
    URL.revokeObjectURL(url);
  }
}

export type EventoHistorico = {
  tipo: string;
  dominio?: "cuidados" | "desenvolvimento";
  quando: string;
  resumo: string;
  origemId: string;
  categoria?: string | null;
  versaoAtiva?: boolean;
  detalhe?: string;
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

/** Ficha padrão das Atividades Reais (M03 §15); personalizadas vêm sem ficha. */
export type FichaPadraoAtividade = {
  passos: string[];
  variacaoFacil: string | null;
  variacaoDificil: string | null;
  adaptacaoSentado: string | null;
  seguranca: Partial<Record<"pequenos" | "medios" | "grandes", string[]>> | null;
  lugar: "dentro_de_casa" | "area_externa" | "ambos" | null;
  pessoasMin: number | null;
  pessoasMax: number | null;
};

export type DesafioResumo = Partial<FichaPadraoAtividade> & {
  id: string;
  nome: string;
  instrucao: string | null;
  categoria: string | null;
  dificuldade: string;
  materiais: string | null;
  duracaoMinutos: number | null;
  faixaEtariaMin?: number | null;
  faixaEtariaMax?: number | null;
  origemConteudo?: string | null;
  versaoConteudo?: number;
  origem: string;
  familiaId: string | null;
  guardado: boolean;
  escolhida?: boolean;
  disponivelParaNovaParticipacao?: boolean;
  estadoDisponibilidade?: "explorar" | "executadas";
  ultimaParticipacao?: {
    id: string;
    resultado: string;
    registradoEm: string;
    estrelasConcedidas: number;
  } | null;
};

export class ErroLimiteAtivas extends Error {
  codigo = "LIMITE_ATIVAS_CATEGORIA";
  categoria: string | null;

  constructor(mensagem: string, categoria: string | null) {
    super(mensagem);
    this.name = "ErroLimiteAtivas";
    this.categoria = categoria;
  }
}

export type SugestaoDesafio = FichaPadraoAtividade & {
  id: string;
  nome: string;
  instrucao: string | null;
  categoria: string | null;
  dificuldade: string;
  materiais: string | null;
  duracaoMinutos: number | null;
  faixaEtariaMin: number | null;
  faixaEtariaMax: number | null;
  origemConteudo: string | null;
  versaoConteudo: number;
  origem: string;
  escolhida: boolean;
  atualizadoEm: string;
};

export type ListaSugestoes = {
  pessoaId: string;
  limite: number;
  total: number;
  mensagem: string | null;
  sugestoes: SugestaoDesafio[];
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
  disponivelParaResgate?: boolean;
  geracaoDisponibilidade?: number;
  estadoDisponibilidade?: "disponiveis" | "resgatadas";
  totalResgates?: number;
  ultimoResgate?: {
    id: string;
    custoAplicado: number;
    resgatadoEm: string;
    geracaoDisponibilidade: number;
  } | null;
};

function erroDesenvolvimento(status: number, fallback: string) {
  if (status === 403) return "Acesso negado ao desenvolvimento.";
  if (status === 401) return "Faça login na página inicial.";
  return fallback;
}

export type ListagemMeta = {
  totalNoPeriodo: number;
  exibidos: number;
  limitada: boolean;
};

export type ResumoCuidados = {
  pessoaId: string;
  pessoaNome?: string;
  tipo: string;
  periodo: { de: string; ate: string };
  diasNoPeriodo?: number;
  doses: {
    previstos: number;
    tomadasInformadas: number;
    naoTomadasInformadas: number;
    semConfirmacao: number;
  };
  esclarecimento: string;
  consultas: {
    id: string;
    categoria?: string | null;
    especialidadeOuDescricao: string;
    titulo?: string;
    dataHora: string;
    status: string;
  }[];
  exames: {
    id: string;
    categoria?: string | null;
    descricao: string;
    titulo?: string;
    data?: string | null;
    criadoEm: string;
    temDocumento?: boolean;
  }[];
  observacoes?: {
    id: string;
    descricao: string;
    observacao: string | null;
    concluidaEm: string;
  }[];
  mudancasProgramacao?: {
    id: string;
    medicamento: string;
    horarios: string;
    vigenciaInicio: string;
    vigenciaFim: string | null;
    criadoEm: string;
  }[];
  listagens?: {
    registros: ListagemMeta;
    consultas: ListagemMeta;
    exames: ListagemMeta;
    observacoes: ListagemMeta;
    mudancasProgramacao: ListagemMeta;
  };
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
  pessoaNome?: string;
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
  jogos?: {
    id: string;
    nome: string;
    totalFases: number | null;
    concluidasAte: number;
    concluidasNoPeriodo: number;
    experimentadoNoPeriodo: boolean;
  }[];
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
  listagens?: {
    experiencias: ListagemMeta;
    observacoes: ListagemMeta;
  };
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
  pessoaNome?: string;
  periodo: { de: string; ate: string };
  geradoEm: string;
  dominios: { cuidados: boolean; desenvolvimento: boolean };
  podeExportar?: boolean;
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
  paginas?: number;
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

export async function listarSugestoesDesafio(
  pessoaId: string,
): Promise<ListaSugestoes> {
  const resposta = await fetchApi(`/pessoas/${pessoaId}/sugestoes`);
  if (!resposta.ok) {
    throw new Error(
      erroDesenvolvimento(resposta.status, await lerErro(resposta)),
    );
  }
  return (await resposta.json()) as ListaSugestoes;
}

export async function escolherSugestaoDesafio(
  pessoaId: string,
  desafioId: string,
) {
  const resposta = await fetchApi(
    `/pessoas/${pessoaId}/sugestoes/${desafioId}/escolher`,
    { method: "POST" },
  );
  if (!resposta.ok) {
    const detalhe = await lerErroDetalhado(resposta);
    if (
      resposta.status === 409 &&
      detalhe.codigo === "LIMITE_ATIVAS_CATEGORIA"
    ) {
      throw new ErroLimiteAtivas(
        detalhe.mensagem,
        detalhe.categoria ?? null,
      );
    }
    throw new Error(
      erroDesenvolvimento(resposta.status, detalhe.mensagem),
    );
  }
  return resposta.json() as Promise<{
    escolhida: boolean;
    jaEstavaEscolhida?: boolean;
    categoria?: string | null;
    sugestoes: SugestaoDesafio[];
  }>;
}

export async function renovarSugestoesDesafio(
  pessoaId: string,
  filtro?: { categoria?: string },
) {
  const resposta = await fetchApi(`/pessoas/${pessoaId}/sugestoes/renovar`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      categoria:
        filtro?.categoria && filtro.categoria !== "todas"
          ? filtro.categoria
          : undefined,
    }),
  });
  if (!resposta.ok) {
    throw new Error(
      erroDesenvolvimento(resposta.status, await lerErro(resposta)),
    );
  }
  return resposta.json() as Promise<{
    trocadas: number;
    mensagem: string | null;
    preservadas: number;
    sugestoes: SugestaoDesafio[];
  }>;
}

export async function retirarAtividadeAtiva(
  pessoaId: string,
  desafioId: string,
) {
  const resposta = await fetchApi(
    `/pessoas/${pessoaId}/sugestoes/${desafioId}/retirar`,
    { method: "POST" },
  );
  if (!resposta.ok) {
    throw new Error(
      erroDesenvolvimento(resposta.status, await lerErro(resposta)),
    );
  }
  return resposta.json() as Promise<{
    escolhida: boolean;
    jaEstavaRetirada?: boolean;
    sugestoes: SugestaoDesafio[];
  }>;
}

export async function listarDesafios(
  pessoaId: string,
  filtro?: {
    categoria?: string;
    guardados?: boolean;
    disponibilidade?: "explorar" | "executadas";
  },
): Promise<ListaDesafios> {
  const params = new URLSearchParams();
  if (filtro?.categoria) params.set("categoria", filtro.categoria);
  if (filtro?.guardados) params.set("guardados", "1");
  if (filtro?.disponibilidade) {
    params.set("disponibilidade", filtro.disponibilidade);
  }
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

export async function disponibilizarDesafio(
  pessoaId: string,
  desafioId: string,
) {
  const resposta = await fetchApi(
    `/pessoas/${pessoaId}/desafios/${desafioId}/disponibilizar`,
    { method: "POST" },
  );
  if (!resposta.ok) {
    throw new Error(
      erroDesenvolvimento(resposta.status, await lerErro(resposta)),
    );
  }
  return resposta.json();
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
  filtro?: { disponibilidade?: "disponiveis" | "resgatadas" },
): Promise<RecompensaResumo[]> {
  const params = new URLSearchParams();
  if (filtro?.disponibilidade) {
    params.set("disponibilidade", filtro.disponibilidade);
  }
  const q = params.toString();
  const resposta = await fetchApi(
    `/pessoas/${pessoaId}/recompensas${q ? `?${q}` : ""}`,
  );
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

export async function disponibilizarRecompensa(
  pessoaId: string,
  recompensaId: string,
) {
  const resposta = await fetchApi(
    `/pessoas/${pessoaId}/recompensas/${recompensaId}/disponibilizar`,
    { method: "POST" },
  );
  if (!resposta.ok) {
    throw new Error(
      erroDesenvolvimento(resposta.status, await lerErro(resposta)),
    );
  }
  return resposta.json();
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

export type FaseJogoResumo = {
  numero: number;
  /** Ticket 15: só a próxima fase pendente abre até a trilha terminar. */
  liberada: boolean;
  trilha: "pequenos" | "medios" | "grandes";
  titulo: string;
  objetivo: string;
  estado: "nao_explorada" | "experimentada" | "concluida";
};

export type JogoResumo = {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  instrucoes: string;
  versao: number;
  tipoMecanica?: string;
  fases: FaseJogoResumo[];
};

export type CatalogoJogos = { jogos: JogoResumo[]; destaques: string[] };

export type FiguraMemoria = {
  id: string;
  nome: string;
  simbolo: string;
  face?: "objeto" | "sombra";
};
export type FiguraSequencia = {
  id: string;
  forma: "circulo" | "quadrado" | "triangulo" | "losango";
  cor: "azul" | "dourado" | "verde" | "roxo";
  nome: string;
};
export type FiguraEscolha = { id: string; nome: string; simbolo: string };
export type CenaOrdenacao = { id: string; nome: string; simbolo: string };
export type ConteudoSequencia = {
  tipo: "sequencia";
  sequencia: (FiguraSequencia | null)[];
  alternativas: FiguraSequencia[];
  resposta: string;
};
export type ConteudoEscolha = {
  tipo: "escolha";
  enunciado: string;
  opcoes: FiguraEscolha[];
  resposta: string;
  dica?: string;
  /** Ticket 09: nomes só aparecem depois do acerto. */
  ocultarNomes?: boolean;
};
export type ConteudoOrdenacao = {
  tipo: "ordenacao";
  enunciado: string;
  cenas: CenaOrdenacao[];
  ordemCorreta: string[];
  dica?: string;
  /** Ticket 13: só a figura, sem o nome. */
  ocultarNomes?: boolean;
  /** Ticket 13: quantas peças ficam de fora. */
  intrusas?: number;
};
export type PosicaoLabirinto = { linha: number; coluna: number };
/** Ticket 12: Sudoku de figuras. */
export type ConteudoSudoku = {
  tipo: "sudoku";
  tamanho: 4 | 6;
  caixa: { linhas: number; colunas: number };
  simbolos: FiguraEscolha[];
  inicial: number[][];
  solucao: number[][];
};
/** DEV-CAT-M1-CONTEUDO, ticket 11: Barquinho no rio (2D, PixiJS pela ADR-018). */
export type ConteudoBarquinho = {
  tipo: "barquinho";
  /** De cima (B, partida) para baixo (margem final): # margem, . água, o pedra, f folha. */
  rio: string[];
  /** Linhas por segundo. */
  correnteza: number;
};
/** Ticket 12: Robô com setas. */
export type ConteudoRobo = {
  tipo: "robo";
  mapa: string[];
  inicio: PosicaoLabirinto;
  chegada: PosicaoLabirinto;
};
export type ConteudoLabirinto = {
  tipo: "labirinto";
  mapa: string[];
  inicio: PosicaoLabirinto;
  chegada: PosicaoLabirinto;
  pontos?: PosicaoLabirinto[];
};
export type ConteudoPartida =
  | { tipo: "memoria"; cartas: FiguraMemoria[] }
  | ConteudoSequencia
  | ConteudoEscolha
  | ConteudoOrdenacao
  | ConteudoLabirinto
  | ConteudoSudoku
  | ConteudoRobo
  | ConteudoBarquinho;
export type InicioPartida = {
  versao: number;
  tipoMecanica?: string;
  conteudo: ConteudoPartida;
};

export type ConclusaoPartida = {
  concluidaEm: string;
  versaoConclusao: number;
  primeiraDescoberta: boolean;
};

async function requisitarJogo<T>(caminho: string, init: RequestInit): Promise<T> {
  const resposta = await fetchApi(caminho, init);
  if (!resposta.ok) throw new ErroApi(await lerErro(resposta), { status: resposta.status });
  return resposta.json() as Promise<T>;
}

export function listarJogos(pessoaId: string, signal: AbortSignal) {
  return requisitarJogo<CatalogoJogos>(`/pessoas/${encodeURIComponent(pessoaId)}/jogos`, { signal });
}

function caminhoFaseJogo(pessoaId: string, jogoId: string, fase: number) {
  return `/pessoas/${encodeURIComponent(pessoaId)}/jogos/${encodeURIComponent(jogoId)}/fases/${fase}`;
}

export function iniciarJogo(pessoaId: string, jogoId: string, fase: number, signal: AbortSignal) {
  return requisitarJogo<InicioPartida>(caminhoFaseJogo(pessoaId, jogoId, fase) + "/iniciar", {
    method: "POST",
    signal,
  });
}

export function concluirJogo(
  pessoaId: string, jogoId: string, fase: number,
  confirmacao: { versao: number; chave: string }, signal: AbortSignal,
) {
  return requisitarJogo<ConclusaoPartida>(caminhoFaseJogo(pessoaId, jogoId, fase) + "/concluir", {
    method: "POST",
    signal,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(confirmacao),
  });
}

export async function resgatarRecompensa(
  pessoaId: string,
  recompensaId: string,
  solicitacaoChave?: string,
) {
  const resposta = await fetchApi(`/pessoas/${pessoaId}/resgates`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ recompensaId, solicitacaoChave }),
  });
  if (!resposta.ok) {
    throw new Error(
      erroDesenvolvimento(resposta.status, await lerErro(resposta)),
    );
  }
  return resposta.json();
}
