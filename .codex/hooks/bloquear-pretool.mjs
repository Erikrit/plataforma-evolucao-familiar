#!/usr/bin/env node
// PreToolUse do Codex: bloqueia operações proibidas pela esteira (exit 2 = bloqueio).
let avaliarFerramenta;
try {
  ({ avaliarFerramenta } = await import("../../scripts/esteira/politica/politica-proibida.mjs"));
} catch {
  console.error("Esteira: política de bloqueio indisponível — bloqueando por segurança.");
  process.exit(2);
}

const partes = [];
for await (const parte of process.stdin) partes.push(parte);

let resultado;
try {
  const evento = JSON.parse(Buffer.concat(partes).toString("utf8"));
  resultado = avaliarFerramenta({ toolName: evento.tool_name, toolInput: evento.tool_input ?? {} });
} catch {
  console.error("Esteira: entrada do hook ilegível — bloqueando por segurança.");
  process.exit(2);
}

if (!resultado.permitido) {
  console.error(
    `Bloqueado pela esteira: ${resultado.motivo}. ${resultado.detalhe ?? ""} Não contorne; peça intervenção humana se necessário.`,
  );
  process.exit(2);
}
