#!/usr/bin/env node
/**
 * Validação não destrutiva do bootstrap da esteira.
 * Não executa commit/push/deploy.
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const erros = [];
const avisos = [];
const ok = [];

function exigir(caminhoRel, rotulo) {
  const p = join(raiz, caminhoRel);
  if (!existsSync(p)) {
    erros.push(`Ausente: ${caminhoRel} (${rotulo})`);
    return null;
  }
  ok.push(`Presente: ${caminhoRel}`);
  return p;
}

function lerJson(caminhoRel) {
  const p = exigir(caminhoRel, "JSON");
  if (!p) return null;
  try {
    return JSON.parse(readFileSync(p, "utf8"));
  } catch (e) {
    erros.push(`JSON inválido: ${caminhoRel} — ${e.message}`);
    return null;
  }
}

function lerMdFrontmatter(caminhoRel) {
  const p = exigir(caminhoRel, "Markdown");
  if (!p) return null;
  const texto = readFileSync(p, "utf8");
  if (!texto.startsWith("---")) {
    avisos.push(`Sem frontmatter YAML: ${caminhoRel}`);
    return { texto };
  }
  const fim = texto.indexOf("\n---", 3);
  if (fim < 0) {
    erros.push(`Frontmatter não fechado: ${caminhoRel}`);
    return null;
  }
  const fm = texto.slice(3, fim).trim();
  const campos = {};
  for (const linha of fm.split("\n")) {
    const m = linha.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (m) campos[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return { texto, campos };
}

// Arquivos obrigatórios
exigir("AGENTS.md", "instruções");
exigir(".cursor/rules/engineering.mdc", "regra permanente");
exigir(".cursor/agents/verifier.md", "subagente");
exigir(".cursor/skills/module-planning/SKILL.md", "skill");
exigir(".cursor/skills/implementation-workflow/SKILL.md", "skill");
exigir(".cursor/skills/quality-gate/SKILL.md", "skill");
exigir("docs/esteira/REGISTRO.md", "registro");
exigir("docs/esteira/estado/atual.json", "estado");
exigir(".cursor/hooks/bloquear-shell.mjs", "hook");
exigir(".cursor/hooks/bloquear-mcp.mjs", "hook");
exigir(".cursor/hooks/bloquear-pretool.mjs", "hook");
exigir(".cursor/hooks/lib/politica-proibida.mjs", "política");

const hooks = lerJson(".cursor/hooks.json");
if (hooks) {
  if (hooks.version !== 1) erros.push("hooks.json: version deve ser 1");
  for (const ev of ["beforeShellExecution", "beforeMCPExecution", "preToolUse"]) {
    if (!hooks.hooks?.[ev]?.length) erros.push(`hooks.json: falta evento ${ev}`);
    else {
      const h = hooks.hooks[ev][0];
      if (!h.failClosed) avisos.push(`${ev}: failClosed não true`);
      if (!String(h.command || "").includes("node ")) {
        avisos.push(`${ev}: comando esperado via node no Windows`);
      }
      ok.push(`Hook configurado: ${ev}`);
    }
  }
}

const verifier = lerMdFrontmatter(".cursor/agents/verifier.md");
if (verifier?.campos) {
  if (verifier.campos.name !== "verifier") erros.push("verifier.md: name != verifier");
  if (!/true/i.test(String(verifier.campos.readonly ?? ""))) {
    avisos.push("verifier.md: readonly deveria ser true");
  } else ok.push("verifier readonly=true");
}

for (const skill of [
  "module-planning",
  "implementation-workflow",
  "quality-gate",
]) {
  const s = lerMdFrontmatter(`.cursor/skills/${skill}/SKILL.md`);
  if (s?.campos) {
    if (s.campos.name !== skill) {
      erros.push(`${skill}: name frontmatter != pasta`);
    } else ok.push(`Skill OK: ${skill}`);
    if (!s.campos.description) erros.push(`${skill}: description vazia`);
  }
}

const regra = lerMdFrontmatter(".cursor/rules/engineering.mdc");
if (regra?.campos && !/true/i.test(String(regra.campos.alwaysApply ?? ""))) {
  erros.push("engineering.mdc: alwaysApply deveria ser true");
} else if (regra) ok.push("engineering.mdc alwaysApply");

const estado = lerJson("docs/esteira/estado/atual.json");
if (estado) {
  for (const campo of [
    "moduloId",
    "incrementoId",
    "estado",
    "requisitos",
    "dependencias",
    "arquivos",
    "verificacao",
    "fingerprint",
    "proximaAcao",
  ]) {
    if (!(campo in estado)) erros.push(`estado/atual.json sem campo ${campo}`);
  }
  const permitidos = [
    "PENDING",
    "READY",
    "IN_PROGRESS",
    "IN_VALIDATION",
    "BLOCKED",
    "COMPLETED",
  ];
  if (estado.estado && !permitidos.includes(estado.estado)) {
    erros.push(`estado inválido: ${estado.estado}`);
  } else if (estado.estado) ok.push(`Estado esteira: ${estado.estado}`);
}

// Não deve existir app inventada nesta fase
for (const suspeito of ["apps", "src", "frontend", "backend", "packages"]) {
  const p = join(raiz, suspeito);
  if (existsSync(p) && statSync(p).isDirectory()) {
    const filhos = readdirSync(p);
    if (filhos.length) avisos.push(`Diretório de código presente: ${suspeito}/ (não esperado no bootstrap puro)`);
  }
}

const resumo = {
  ok: erros.length === 0,
  erros,
  avisos,
  checagensOk: ok.length,
};

console.log(JSON.stringify(resumo, null, 2));
process.exit(erros.length === 0 ? 0 : 1);
