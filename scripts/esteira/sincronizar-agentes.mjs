#!/usr/bin/env node
/**
 * Gera os espelhos de skills e subagentes a partir de `.claude/`.
 *
 *   node scripts/esteira/sincronizar-agentes.mjs [--verificar] [--raiz <dir>]
 *
 * Só remove o que ele próprio gerou (lista em `.gerado.json` do destino).
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ_PADRAO = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const MANIFESTO = ".gerado.json";
const normal = (t) => t.replace(/\r\n/g, "\n");
const ler = (caminho) => normal(readFileSync(caminho, "utf8"));

function listar(dir, base = dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const caminho = join(dir, e.name);
    return e.isDirectory() ? listar(caminho, base) : [relative(base, caminho).replaceAll("\\", "/")];
  });
}

/** Frontmatter de uma linha por campo, sem aspas obrigatórias. */
export function lerFrontmatter(texto) {
  const m = normal(texto).match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return null;
  const campos = {};
  for (const linha of m[1].split("\n")) {
    const c = linha.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (!c) return null;
    campos[c[1]] = c[2].replace(/^(["'])(.*)\1$/, "$2").trim();
  }
  return { campos, corpo: m[2] };
}

function espelhoSkills(raiz) {
  const origem = join(raiz, ".claude/skills");
  const arquivos = {};
  for (const rel of listar(origem)) {
    arquivos[rel] = ler(join(origem, rel));
    if (rel.endsWith("/SKILL.md")) {
      const fm = lerFrontmatter(arquivos[rel]);
      if (fm?.campos["disable-model-invocation"] === "true") {
        // O Codex ignora o frontmatter acima; a invocação implícita é controlada aqui.
        arquivos[rel.replace("SKILL.md", "agents/openai.yaml")] = "policy:\n  allow_implicit_invocation: false\n";
      }
    }
  }
  return arquivos;
}

function espelhoAgentes(raiz, formato) {
  const origem = join(raiz, ".claude/agents");
  const arquivos = {};
  for (const rel of listar(origem).filter((r) => r.endsWith(".md"))) {
    const fm = lerFrontmatter(ler(join(origem, rel)));
    if (!fm) throw new Error(`frontmatter inválido: .claude/agents/${rel}`);
    const { name, description } = fm.campos;
    if (formato === "cursor") {
      arquivos[rel] = `---\nname: ${name}\ndescription: ${description}\nmodel: inherit\nreadonly: true\n---\n${fm.corpo}`;
    } else if (formato === "codex") {
      arquivos[rel.replace(/\.md$/, ".toml")] =
        `name = ${JSON.stringify(name)}\ndescription = ${JSON.stringify(description)}\n` +
        `developer_instructions = ${JSON.stringify(fm.corpo.trim())}\n`;
    } else throw new Error(`formato de espelho desconhecido: ${formato}`);
  }
  return arquivos;
}

export function calcularEspelhos(raiz, config) {
  const { skills = [], agentes = {} } = config.espelhos ?? {};
  return [
    ...skills.map((destino) => ({ destino, arquivos: espelhoSkills(raiz) })),
    ...Object.entries(agentes).map(([formato, destino]) => ({ destino, arquivos: espelhoAgentes(raiz, formato) })),
  ];
}

function anteriores(dir) {
  const caminho = join(dir, MANIFESTO);
  if (!existsSync(caminho)) return [];
  return JSON.parse(readFileSync(caminho, "utf8")).filter((r) => typeof r === "string" && !r.split("/").includes(".."));
}

/** Diferenças entre o gerado e o que está no disco. */
export function diferencasEspelhos(raiz, config) {
  const problemas = [];
  for (const { destino, arquivos } of calcularEspelhos(raiz, config)) {
    const dir = join(raiz, destino);
    for (const [rel, conteudo] of Object.entries(arquivos)) {
      const caminho = join(dir, rel);
      if (!existsSync(caminho)) problemas.push(`${destino}/${rel} ausente`);
      else if (ler(caminho) !== conteudo) problemas.push(`${destino}/${rel} diferente da fonte`);
    }
    for (const rel of listar(dir)) {
      if (rel !== MANIFESTO && !(rel in arquivos)) problemas.push(`${destino}/${rel} sem fonte em .claude`);
    }
  }
  return problemas;
}

export function sincronizar(raiz, config) {
  const resumo = [];
  for (const { destino, arquivos } of calcularEspelhos(raiz, config)) {
    const dir = join(raiz, destino);
    const removidos = anteriores(dir).filter((rel) => !(rel in arquivos));
    for (const rel of removidos) rmSync(join(dir, rel), { force: true });
    for (const [rel, conteudo] of Object.entries(arquivos)) {
      mkdirSync(dirname(join(dir, rel)), { recursive: true });
      writeFileSync(join(dir, rel), conteudo, "utf8");
    }
    writeFileSync(join(dir, MANIFESTO), `${JSON.stringify(Object.keys(arquivos).sort(), null, 2)}\n`, "utf8");
    resumo.push({ destino, gerados: Object.keys(arquivos).length, removidos: removidos.length });
  }
  return resumo;
}

if (process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))) {
  const args = process.argv.slice(2);
  const i = args.indexOf("--raiz");
  const raiz = i >= 0 ? args[i + 1] : RAIZ_PADRAO;
  const caminho = join(raiz, "esteira.config.json");
  if (!existsSync(caminho)) {
    console.error("adaptador ausente — rode /configurar-esteira");
    process.exit(1);
  }
  const config = JSON.parse(readFileSync(caminho, "utf8"));
  if (!args.includes("--verificar")) console.log(JSON.stringify(sincronizar(raiz, config), null, 2));
  const pendentes = diferencasEspelhos(raiz, config);
  for (const p of pendentes) console.error(p);
  process.exit(pendentes.length ? 1 : 0);
}
