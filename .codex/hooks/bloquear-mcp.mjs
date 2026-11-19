#!/usr/bin/env node
import { stdin } from "node:process";
import {
  avaliarMcp,
  respostaNegar,
  respostaPermitir,
} from "./lib/politica-proibida.mjs";

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
    JSON.stringify(respostaNegar("entrada JSON inválida no hook MCP", "")),
  );
  process.exit(0);
}

const toolName = entrada.tool_name ?? entrada.toolName ?? entrada.name ?? "";
const toolInput = entrada.tool_input ?? entrada.arguments ?? entrada.input ?? {};
const veredito = avaliarMcp({ toolName, toolInput });

if (!veredito.permitido) {
  process.stdout.write(
    JSON.stringify(respostaNegar(veredito.motivo, veredito.detalhe)),
  );
  process.exit(0);
}

process.stdout.write(JSON.stringify(respostaPermitir()));
process.exit(0);
