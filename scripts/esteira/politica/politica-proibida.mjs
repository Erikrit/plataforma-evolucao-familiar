/**
 * Política determinística de operações proibidas na esteira.
 * Fonte única para os hooks de Claude Code, Cursor e Codex.
 *
 * Heurística textual: reduz acidentes, não impede evasão deliberada (script
 * intermediário, alias, codificação). Um texto que apenas cita um comando
 * proibido também é bloqueado — use as ferramentas de busca/edição nesses casos.
 */

const ARG = String.raw`(?:"[^"]*"|'[^']*'|[^\s"';&|]+)`;

// Opções globais antes do subcomando: `git -C dir -c a=b --no-pager <sub>`.
const GIT = String.raw`\bgit(?:\.exe)?["']?(?:\s+(?:-[Cc]\s+${ARG}|--(?:git-dir|work-tree|namespace|exec-path|config-env)\s+${ARG}|--[\w-]+(?:=${ARG})?|-[pP]))*\s+`;
// Opções do gh podem vir antes ou depois do grupo: `gh -R o/r pr -R o/r create`.
const OPCOES_GH = String.raw`(?:\s+-{1,2}[\w-]+(?:(?:=|\s+)${ARG})?)*\s+`;
const gh = (grupo, acoes) =>
  new RegExp(String.raw`\bgh(?:\.exe)?${OPCOES_GH}${grupo}${OPCOES_GH}(?:${acoes})(?![-\w])`, "i");
const git = (resto) => new RegExp(GIT + resto, "i");
const RESTO = String.raw`[^;&|\n]*`;

const REGRAS_GIT = [
  { re: git(String.raw`commit\b`), motivo: "git commit proibido" },
  { re: git(String.raw`push\b`), motivo: "git push proibido" },
  { re: git(String.raw`tag\b`), motivo: "git tag proibido" },
  { re: git(String.raw`release\b`), motivo: "git release proibido" },
  { re: git(String.raw`merge(?![-\w])`), motivo: "git merge proibido" },
  { re: git(String.raw`rebase(?![-\w])`), motivo: "git rebase proibido" },
  { re: git(String.raw`restore(?![-\w])`), motivo: "git restore proibido" },
  { re: git(String.raw`cherry-pick\b`), motivo: "git cherry-pick proibido" },
  { re: git(String.raw`revert(?![-\w])`), motivo: "git revert proibido" },
  { re: git(String.raw`am(?![-\w])`), motivo: "git am proibido" },
  { re: git(String.raw`reset\b[\s\S]*\s--hard\b`), motivo: "git reset --hard proibido" },
  { re: git(String.raw`reset\b${RESTO}\s--(?:keep|merge)\b`), motivo: "git reset que descarta alterações proibido" },
  {
    // `checkout <ref> <arquivo>`: dois posicionais sem criação de branch.
    re: git(
      String.raw`checkout(?!${RESTO}\s(?:-[bBt]|--orphan|--track)\b)(?:[ \t]+-{1,2}[\w-]+)*[ \t]+(?!-)${ARG}[ \t]+(?!-|\d*[<>]|#)${ARG}`,
    ),
    motivo: "git checkout que descarta arquivo proibido",
  },
  {
    re: git(String.raw`checkout\b${RESTO}\s(?:--(?=\s|$)|\.(?=[\s;&|]|$)|-f\b|--force\b)`),
    motivo: "git checkout que descarta alterações proibido",
  },
  {
    re: git(String.raw`switch\b${RESTO}\s(?:-f\b|--force\b|--discard-changes\b)`),
    motivo: "git switch que descarta alterações proibido",
  },
  {
    re: git(String.raw`clean\b${RESTO}\s(?:-[a-zA-Z]*f|--force\b)`),
    motivo: "git clean destrutivo proibido",
  },
  { re: git(String.raw`stash\s+(?:drop|clear)\b`), motivo: "descarte de stash proibido" },
  {
    re: git(String.raw`branch\b${RESTO}\s(?:-[dD]\b|--delete\b)`),
    motivo: "exclusão de branch via agente proibida",
  },
];

const REGRAS_PUBLICACAO = [
  {
    re: gh("pr", "create|new|merge|close|reopen|edit|ready|review|comment|update-branch|lock|unlock|revert"),
    motivo: "escrita em PR via gh proibida",
  },
  {
    re: gh("issue", "create|new|close|reopen|edit|delete|comment|transfer|lock|unlock|pin|unpin|develop"),
    motivo: "escrita em issue via gh proibida",
  },
  { re: gh("release", "create|new|delete|delete-asset|edit|upload"), motivo: "escrita em release via gh proibida" },
  {
    re: gh("repo", "create|new|delete|edit|fork|rename|archive|unarchive|sync"),
    motivo: "escrita em repositório via gh proibida",
  },
  { re: gh("workflow", "run|enable|disable"), motivo: "acionar workflow via gh proibido" },
  { re: gh("run", "rerun|cancel|delete"), motivo: "alterar execução via gh proibido" },
  { re: gh("(?:secret|variable)", "set|delete|remove"), motivo: "alterar segredo/variável via gh proibido" },
  { re: gh("label", "create|delete|edit|clone"), motivo: "escrita em label via gh proibida" },
  {
    re: gh("project", "create|copy|close|delete|edit|link|unlink|mark-template|field-create|field-delete|item-[a-z]+(?<!item-list)"),
    motivo: "escrita em projeto via gh proibida",
  },
  { re: gh("cache", "delete"), motivo: "exclusão de cache via gh proibida" },
  { re: gh("gist", "create|new|delete|edit|rename"), motivo: "escrita em gist via gh proibida" },
  { re: /\b(?:npm|pnpm|yarn)(?:\s+-{1,2}[\w-]+(?:=\S+)?)*\s+publish\b/i, motivo: "publicação de pacote proibida" },
  { re: /\bvercel\s+deploy\b/i, motivo: "deploy Vercel proibido" },
  { re: /\bvercel\b[^;&|\n]*\s--prod\b/i, motivo: "deploy Vercel prod proibido" },
  { re: /\bdocker\s+(?:image\s+)?push\b/i, motivo: "docker push proibido" },
  { re: /\bagent-sdk\s+deploy\b/i, motivo: "agent-sdk deploy proibido" },
  { re: /\bfly\s+deploy\b/i, motivo: "fly deploy proibido" },
  { re: /\brailway\s+up\b/i, motivo: "railway up proibido" },
  { re: /\bkubectl\s+apply\b/i, motivo: "kubectl apply proibido na esteira" },
  { re: /\bterraform\s+apply\b/i, motivo: "terraform apply proibido" },
];

const REGRAS_DADOS = [
  {
    re: /\bdocker(?:\s+|-)compose\b[^;&|\n]*\bdown\b[^;&|\n]*\s(?:-v\b|--volumes\b)/i,
    motivo: "remoção de volumes do Compose proibida",
  },
  { re: /\bdocker\s+volume\s+(?:rm|remove|prune)\b/i, motivo: "remoção de volume Docker proibida" },
  { re: /\bdocker\s+system\s+prune\b[^;&|\n]*\s--volumes\b/i, motivo: "remoção de volumes Docker proibida" },
  { re: /\bdb:reset\b/i, motivo: "reset de banco proibido" },
  { re: /\breset-db[\w-]*\.mjs\b/i, motivo: "reset de banco proibido" },
  { re: /\bprisma\b[^;&|\n]*\bmigrate\s+reset\b/i, motivo: "prisma migrate reset proibido" },
  { re: /\bprisma\b[^;&|\n]*\s--force-reset\b/i, motivo: "prisma --force-reset proibido" },
];

const REGRAS_SHELL = [...REGRAS_GIT, ...REGRAS_PUBLICACAO, ...REGRAS_DADOS];

/** `gh api` só é leitura com método GET explícito ou sem método e sem campos. */
function ghApiEscreve(texto) {
  for (const trecho of texto.split(/[;&|\n]/)) {
    if (!/\bgh(?:\.exe)?\b[^\n]*?\sapi\s/i.test(trecho)) continue;
    const metodo = trecho.match(/\s(?:-X|--method)[=\s]*["']?([a-z]+)/i)?.[1];
    if (metodo) {
      if (metodo.toUpperCase() !== "GET") return true;
      continue;
    }
    if (/\s(?:-[fF]|--field|--raw-field|--input)(?=[\s=\w])/.test(trecho)) return true;
  }
  return false;
}

/** Une continuações de linha (sh, PowerShell e cmd). */
const unirLinhas = (t) => t.replace(/[\\`^][ \t]*\r?\n/g, " ");
/** Separadores dentro de aspas não encerram o comando. */
const neutralizarAspas = (t) =>
  t.replace(/"[^"]*"|'[^']*'/g, (trecho) => trecho.replace(/[;&|\r\n]/g, " "));

export function avaliarComandoShell(comando) {
  const texto = Array.isArray(comando) ? comando.join(" ") : String(comando ?? "");
  if (!texto.trim()) return { permitido: true };

  const unido = unirLinhas(texto);
  const neutro = neutralizarAspas(unido);
  for (const regra of REGRAS_SHELL) {
    if (regra.re.test(unido) || regra.re.test(neutro)) return negar(regra.motivo, texto);
  }
  if (ghApiEscreve(unido) || ghApiEscreve(neutro)) return negar("escrita via gh api proibida", texto);
  return { permitido: true };
}

const VERBOS_LEITURA = new Set(["list", "get", "read", "search", "grep", "view", "describe"]);
const PALAVRAS_PROIBIDAS = [
  [/^commit/, "MCP de commit bloqueado"],
  [/^push/, "MCP de push bloqueado"],
  [/publish/, "MCP de publicação bloqueado"],
  [/deploy/, "MCP de deploy bloqueado"],
];
const CAMPOS_COMANDO = /^(?:command|cmd|script|shell_command)$/i;
const CAMPOS_ACAO = /^(?:action|operation|method|tool|tool_name)$/i;

const VERBOS_ESCRITA = new Set([
  "create", "update", "delete", "write", "add", "edit", "close", "reopen", "remove", "submit", "dismiss", "upload",
  "reply", "resolve", "unresolve", "assign", "unassign", "transfer", "lock", "unlock",
]);
const ALVOS_REMOTOS = /^(?:issues?|reviews?|releases?)$/;

/** Servidor do nome `mcp__servidor__acao`; vazio quando o formato não o informa. */
const servidorMcp = (nome) => (/^mcp__/i.test(nome) ? (nome.split("__")[1] ?? "") : "");

/** `mcp__github__create_pull_request`, `MCP:create_release` → palavras da ação. */
function palavrasDaAcao(nome) {
  const acao = String(nome ?? "").split(/__|:/).pop();
  return acao
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

function motivoAcao(nome) {
  const palavras = palavrasDaAcao(nome);
  const leitura =
    VERBOS_LEITURA.has(palavras[0]) || ["read", "get"].includes(palavras.at(-1));
  if (leitura) return null;
  for (const p of palavras) {
    const regra = PALAVRAS_PROIBIDAS.find(([re]) => re.test(p));
    if (regra) return regra[1];
  }
  const tem = (...ps) => ps.every((p) => palavras.includes(p));
  if (tem("merge") || (tem("pull", "request") && (tem("create") || tem("update")))) {
    return "MCP de PR/merge bloqueado";
  }
  if (palavras[0] === "request" || palavras.some((p) => VERBOS_ESCRITA.has(p))) {
    if (tem("pull", "request")) return "MCP de PR/merge bloqueado";
    if (palavras.some((p) => ALVOS_REMOTOS.test(p))) return "MCP de escrita remota bloqueado";
    // Arquivo só é remoto em servidor Git; em servidor desconhecido, bloqueia.
    const servidor = servidorMcp(String(nome));
    if (palavras.some((p) => /^files?$/.test(p)) && (!servidor || /git|bitbucket/i.test(servidor))) {
      return "MCP de escrita remota bloqueado";
    }
  }
  return null;
}

function* campos(valor, chave = "") {
  if (Array.isArray(valor) && valor.every((v) => typeof v === "string")) {
    yield [chave, valor.join(" ")];
  } else if (valor && typeof valor === "object") {
    for (const [k, v] of Object.entries(valor)) {
      yield* campos(v, Array.isArray(valor) ? chave : k);
    }
  } else if (typeof valor === "string") {
    yield [chave, valor];
  }
}

/** Avalia a ação pelo nome e por campos que carregam comando; texto livre não conta. */
export function avaliarMcp({ toolName, toolInput }) {
  const nome = String(toolName ?? "");
  const motivo = motivoAcao(nome);
  if (motivo) return negar(`${motivo}: ${nome || "(mcp)"}`, nome);

  let entrada = toolInput;
  if (typeof entrada === "string") {
    try {
      entrada = JSON.parse(entrada);
    } catch {
      return avaliarComandoShell(entrada);
    }
  }
  for (const [chave, valor] of campos(entrada)) {
    if (CAMPOS_COMANDO.test(chave)) {
      const veredito = avaliarComandoShell(valor);
      if (!veredito.permitido) return veredito;
    }
    if (CAMPOS_ACAO.test(chave)) {
      const motivoCampo = motivoAcao(valor);
      if (motivoCampo) return negar(`${motivoCampo}: ${nome || "(mcp)"}`, valor);
    }
  }
  return { permitido: true };
}

const FERRAMENTAS_SHELL = /^(?:shell|bash|powershell|monitor|local_shell|shell_command|exec_command|unified_exec)$/i;

/** Entrada única para eventos no formato PreToolUse (Claude Code, Codex e Cursor). */
export function avaliarFerramenta({ toolName, toolInput }) {
  const nome = String(toolName ?? "");
  if (FERRAMENTAS_SHELL.test(nome)) {
    return avaliarComandoShell(toolInput?.command ?? toolInput?.cmd);
  }
  if (/^mcp(?:__|:)/i.test(nome)) return avaliarMcp({ toolName: nome, toolInput });
  return { permitido: true };
}

export function respostaNegar(motivo, detalhe) {
  const msg = `Operação bloqueada pela esteira: ${motivo}.${detalhe ? ` Comando/alvo: ${detalhe}` : ""}`;
  return {
    permission: "deny",
    user_message: msg,
    agent_message: `${msg} Não contorne via scripts, MCP ou indirection. Peça intervenção humana se necessário.`,
  };
}

export function respostaPermitir() {
  return { permission: "allow" };
}

function negar(motivo, detalhe) {
  return { permitido: false, motivo, detalhe: truncar(detalhe, 240) };
}

function truncar(s, n) {
  return s.length <= n ? s : `${s.slice(0, n)}…`;
}
