#!/usr/bin/env node
/**
 * Camada extra: preToolUse para Shell e ferramentas cujo nome sugere publicação.
 * Complementa beforeShellExecution / beforeMCPExecution (não substitui).
 */
import { stdin } from "node:process";
import {
  avaliarComandoShell,
  avaliarMcp,
  respostaNegar,
  respostaPermitir,
} from "../../scripts/esteira/politica/politica-proibida.mjs";

async function lerStdin() {
  const chunks = [];
  for await (const c of stdin) chunks.push(c);
  return Buffer.concat(chunks).toString("utf8");
}

const bruto = await lerStdin();
let entrada = {};
try {
  entrada = bruto.trim() ? JSON.parse(bruto) : {};
} catch {
  process.stdout.write(
    JSON.stringify(respostaNegar("entrada JSON inválida no preToolUse", "")),
  );
  process.exit(0);
}

const toolName = String(entrada.tool_name ?? entrada.toolName ?? "");
const toolInput = entrada.tool_input ?? entrada.arguments ?? entrada.input ?? {};

if (/^(?:shell|bash|powershell)$/i.test(toolName)) {
  const comando = toolInput.command ?? entrada.command ?? "";
  const veredito = avaliarComandoShell(comando);
  if (!veredito.permitido) {
    process.stdout.write(
      JSON.stringify(respostaNegar(veredito.motivo, veredito.detalhe)),
    );
    process.exit(0);
  }
}

if (/^MCP:/i.test(toolName) || /commit|push|deploy|publish|pull_request|release/i.test(toolName)) {
  const veredito = avaliarMcp({ toolName, toolInput });
  if (!veredito.permitido) {
    process.stdout.write(
      JSON.stringify(respostaNegar(veredito.motivo, veredito.detalhe)),
    );
    process.exit(0);
  }
}

process.stdout.write(JSON.stringify(respostaPermitir()));
process.exit(0);
