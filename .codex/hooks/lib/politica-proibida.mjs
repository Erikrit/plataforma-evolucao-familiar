/**
 * Política determinística de operações proibidas na esteira.
 * Heurística por tokens — documentar limitações; não afirmar segurança absoluta.
 */

const TOKENS_GIT_PROIBIDOS = [
  { re: /\bgit(?:\.exe)?\s+commit\b/i, motivo: "git commit proibido" },
  { re: /\bgit(?:\.exe)?\s+push\b/i, motivo: "git push proibido" },
  { re: /\bgit(?:\.exe)?\s+tag\b/i, motivo: "git tag proibido" },
  { re: /\bgit(?:\.exe)?\s+release\b/i, motivo: "git release proibido" },
  {
    re: /\bgit(?:\.exe)?\s+reset\b[\s\S]*\s--hard\b/i,
    motivo: "git reset --hard proibido",
  },
  {
    re: /\bgit(?:\.exe)?\s+clean\b[\s\S]*\s-[a-zA-Z]*f/i,
    motivo: "git clean destrutivo proibido",
  },
  {
    re: /\bgit(?:\.exe)?\s+push\b[\s\S]*\s--force\b|\bgit(?:\.exe)?\s+push\b[\s\S]*\s-f\b/i,
    motivo: "git push --force proibido",
  },
  {
    re: /\bgit(?:\.exe)?\s+branch\b[\s\S]*\s-[dD]\b|\bgit(?:\.exe)?\s+branch\b[\s\S]*--delete\b/i,
    motivo: "exclusão de branch via agente proibida neste bootstrap",
  },
];

const TOKENS_PUBLICACAO = [
  { re: /\bgh\s+pr\s+create\b/i, motivo: "criar PR via agente proibido" },
  { re: /\bgh\s+release\s+create\b/i, motivo: "criar release proibido" },
  { re: /\bnpm\s+publish\b/i, motivo: "npm publish proibido" },
  { re: /\bpnpm\s+publish\b/i, motivo: "pnpm publish proibido" },
  { re: /\byarn\s+publish\b/i, motivo: "yarn publish proibido" },
  { re: /\bvercel\s+deploy\b/i, motivo: "deploy Vercel proibido" },
  { re: /\bvercel\s+--prod\b/i, motivo: "deploy Vercel prod proibido" },
  { re: /\bnpx\s+vercel\b[\s\S]*\s--prod\b/i, motivo: "deploy Vercel prod proibido" },
  { re: /\bdocker\s+push\b/i, motivo: "docker push proibido" },
  { re: /\bagent-sdk\s+deploy\b/i, motivo: "agent-sdk deploy proibido" },
  { re: /\bfly\s+deploy\b/i, motivo: "fly deploy proibido" },
  { re: /\brailway\s+up\b/i, motivo: "railway up proibido" },
  { re: /\bkubectl\s+apply\b/i, motivo: "kubectl apply proibido na esteira" },
  { re: /\bterraform\s+apply\b/i, motivo: "terraform apply proibido" },
];

const TOKENS_MCP_PROIBIDOS = [
  { re: /commit/i, motivo: "MCP de commit bloqueado" },
  { re: /push/i, motivo: "MCP de push bloqueado" },
  { re: /create_pull_request|createPullRequest|merge_pull_request/i, motivo: "MCP de PR/merge bloqueado" },
  { re: /create_release|publish/i, motivo: "MCP de publicação bloqueado" },
  { re: /deploy/i, motivo: "MCP de deploy bloqueado" },
];

export function avaliarComandoShell(comando) {
  const texto = String(comando ?? "");
  if (!texto.trim()) {
    return { permitido: true };
  }

  for (const regra of [...TOKENS_GIT_PROIBIDOS, ...TOKENS_PUBLICACAO]) {
    if (regra.re.test(texto)) {
      return {
        permitido: false,
        motivo: regra.motivo,
        detalhe: truncar(texto, 240),
      };
    }
  }

  return { permitido: true };
}

export function avaliarMcp({ toolName, toolInput }) {
  const nome = String(toolName ?? "");
  const payload = safeJson(toolInput);
  const blob = `${nome}\n${payload}`;

  for (const regra of TOKENS_MCP_PROIBIDOS) {
    if (regra.re.test(blob)) {
      // Evita falso positivo em ferramentas só de leitura com "commit" no texto de ajuda.
      if (/^list_|^get_|^read_|^search_|^grep_|^pull_request_read|^checks_read/i.test(nome)) {
        continue;
      }
      return {
        permitido: false,
        motivo: `${regra.motivo}: ${nome || "(mcp)"}`,
        detalhe: truncar(blob, 240),
      };
    }
  }

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

function truncar(s, n) {
  return s.length <= n ? s : `${s.slice(0, n)}…`;
}

function safeJson(v) {
  try {
    return typeof v === "string" ? v : JSON.stringify(v ?? {});
  } catch {
    return String(v);
  }
}
