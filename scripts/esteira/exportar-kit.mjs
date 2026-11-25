#!/usr/bin/env node
/**
 * Copia o núcleo da esteira para outro repositório, sem adaptador, estado ou evidências.
 *
 *   node scripts/esteira/exportar-kit.mjs <destino> [--forcar]
 *
 * Arquivo existente e diferente no destino interrompe a cópia; --forcar o substitui.
 */
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, realpathSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const NUCLEO = [
  ".claude/skills",
  ".claude/agents",
  ".claude/hooks",
  "scripts/esteira/politica",
  "scripts/esteira/templates",
  "scripts/esteira/qg.mjs",
  "scripts/esteira/qg.test.mjs",
  "scripts/esteira/validar-esteira.mjs",
  "scripts/esteira/validar-esteira.test.mjs",
  "scripts/esteira/sincronizar-agentes.mjs",
  "scripts/esteira/testar-hooks.mjs",
  "scripts/esteira/exportar-kit.mjs",
];

function listar(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? listar(join(dir, e.name)) : [join(dir, e.name)],
  );
}

function manifestoPlugin() {
  const agentes = readdirSync(join(RAIZ, ".claude/agents")).filter((a) => a.endsWith(".md")).sort();
  return `${JSON.stringify(
    {
      name: "esteira",
      version: "2.0.0",
      description: "Esteira de desenvolvimento com skills componíveis em português e portões de qualidade determinísticos.",
      license: "MIT",
      skills: ["./.claude/skills/"],
      agents: agentes.map((a) => `./.claude/agents/${a}`),
    },
    null,
    2,
  )}\n`;
}

export function exportarKit(destino, { forcar = false } = {}) {
  const alvo = resolve(destino);
  const origem = realpathSync(RAIZ);
  const real = existsSync(alvo) ? realpathSync(alvo) : alvo;
  if (real === origem || real.startsWith(origem + sep)) throw new Error("destino não pode ficar dentro deste repositório");

  const arquivos = NUCLEO.flatMap((item) => {
    const caminho = join(RAIZ, item);
    return /\.mjs$/.test(item) ? [caminho] : listar(caminho);
  }).map((c) => relative(RAIZ, c));
  const gerados = new Map([[join(".claude-plugin", "plugin.json"), manifestoPlugin()]]);

  const igual = (caminho, bytes) => readFileSync(caminho).equals(Buffer.from(bytes));
  const conflitos = [...arquivos.map((r) => [r, readFileSync(join(RAIZ, r))]), ...gerados].filter(
    ([r, bytes]) => existsSync(join(alvo, r)) && !igual(join(alvo, r), bytes),
  );
  if (conflitos.length && !forcar) {
    throw new Error(`arquivos diferentes no destino (use --forcar):\n${conflitos.map(([r]) => `  ${r}`).join("\n")}`);
  }

  for (const r of arquivos) {
    mkdirSync(dirname(join(alvo, r)), { recursive: true });
    cpSync(join(RAIZ, r), join(alvo, r));
  }
  for (const [r, conteudo] of gerados) {
    mkdirSync(dirname(join(alvo, r)), { recursive: true });
    writeFileSync(join(alvo, r), conteudo, "utf8");
  }
  return { destino: alvo, arquivos: arquivos.length + gerados.size, substituidos: conflitos.length, proximoPasso: "/configurar-esteira" };
}

if (process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))) {
  const args = process.argv.slice(2);
  const destino = args.find((a) => !a.startsWith("--"));
  try {
    if (!destino) throw new Error("informe o destino");
    console.log(JSON.stringify(exportarKit(destino, { forcar: args.includes("--forcar") }), null, 2));
  } catch (e) {
    console.error(`exportar-kit: ${e.message}`);
    process.exit(1);
  }
}
