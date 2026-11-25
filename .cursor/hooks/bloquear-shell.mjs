#!/usr/bin/env node
import { stdin } from "node:process";
import {
  avaliarComandoShell,
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
  // failClosed no hooks.json: saída inválida bloqueia. Emitir deny explícito.
  process.stdout.write(
    JSON.stringify(
      respostaNegar("entrada JSON inválida no hook beforeShellExecution", ""),
    ),
  );
  process.exit(0);
}

const comando = entrada.command ?? entrada.tool_input?.command ?? "";
const veredito = avaliarComandoShell(comando);

if (!veredito.permitido) {
  process.stdout.write(
    JSON.stringify(respostaNegar(veredito.motivo, veredito.detalhe)),
  );
  process.exit(0);
}

process.stdout.write(JSON.stringify(respostaPermitir()));
process.exit(0);
