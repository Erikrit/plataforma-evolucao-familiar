#!/usr/bin/env node
/**
 * Lint da esteira: núcleo (skills, subagentes, hooks), adaptador e estado.
 *
 *   node scripts/esteira/validar-esteira.mjs [--raiz <dir>]
 */
import { existsSync, readFileSync, readdirSync, realpathSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { comandoExiste } from "./qg.mjs";
import { diferencasEspelhos, lerFrontmatter } from "./sincronizar-agentes.mjs";

const RAIZ_PADRAO = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const PERFIS = ["qg1", "qg2", "qg3"];
const ESTADOS = ["PENDING", "READY", "IN_PROGRESS", "IN_VALIDATION", "COMPLETED", "BLOCKED", "NEEDS_DECISION"];
const NUCLEO = [".claude/skills", ".claude/agents", ".claude/hooks", "scripts/esteira"];
const SKILLS_USUARIO = [
  "esteira", "sabatina", "planejar", "implementar", "homologar",
  "melhorar-arquitetura", "retro", "passagem", "configurar-esteira",
];
const AGENTES = ["verificador", "revisor-padroes", "revisor-especificacao"];
const HOOKS = { PreToolUse: "bloquear-ferramenta.mjs", SessionStart: "contexto-sessao.mjs" };
export const SEM_ADAPTADOR = "adaptador ausente — rode /configurar-esteira";

const ler = (c) => readFileSync(c, "utf8").replace(/\r\n/g, "\n");

function listar(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? listar(join(dir, e.name)) : [join(dir, e.name)],
  );
}

export function validar(raiz = RAIZ_PADRAO) {
  const erros = [];
  const erro = (m) => erros.push(m);
  const rel = (c) => relative(raiz, c).replaceAll("\\", "/");
  const lerJson = (relativo) => {
    try {
      return JSON.parse(ler(join(raiz, relativo)));
    } catch (e) {
      erro(`${relativo}: ${e.code === "ENOENT" ? "ausente" : "JSON inválido"}`);
      return null;
    }
  };
  const links = (arquivo) => {
    const texto = ler(arquivo).replace(/```[\s\S]*?```/g, "");
    for (const [, alvo] of texto.matchAll(/\]\(([^)\s#]+)(?:#[^)]*)?\)/g)) {
      if (/^[a-z]+:/i.test(alvo)) continue;
      if (!existsSync(join(dirname(arquivo), decodeURIComponent(alvo)))) erro(`${rel(arquivo)}: link quebrado ${alvo}`);
    }
  };

  const nSkills = validarNucleo();
  const temAdaptador = existsSync(join(raiz, "esteira.config.json"));
  if (temAdaptador) validarAdaptador();
  else erro(SEM_ADAPTADOR);
  return { ok: erros.length === 0, erros, skills: nSkills };

  function validarNucleo() {
    const dirSkills = join(raiz, ".claude/skills");
    if (!existsSync(dirSkills)) {
      erro(".claude/skills ausente");
      return 0;
    }
    const skills = new Map();
    for (const d of readdirSync(dirSkills, { withFileTypes: true }).filter((x) => x.isDirectory())) {
      const arquivo = join(dirSkills, d.name, "SKILL.md");
      if (!existsSync(arquivo)) {
        erro(`${d.name}: SKILL.md ausente`);
        continue;
      }
      const fm = lerFrontmatter(ler(arquivo));
      if (!fm) {
        erro(`${d.name}: frontmatter inválido`);
        continue;
      }
      const { name, description = "" } = fm.campos;
      if (name !== d.name) erro(`${d.name}: name "${name}" difere da pasta`);
      if (skills.has(name)) erro(`${d.name}: name repetido`);
      if (!description) erro(`${d.name}: descrição ausente`);
      if (description.length > 1024) erro(`${d.name}: descrição com ${description.length} caracteres`);
      if (!/Conclu[ií]d[ao]/.test(fm.corpo)) erro(`${d.name}: sem critério de conclusão`);
      const marca = fm.campos["disable-model-invocation"];
      if (marca !== undefined && marca !== "true") erro(`${d.name}: disable-model-invocation deve ser true ou ausente`);
      const usuario = marca === "true";
      if (SKILLS_USUARIO.includes(d.name) && !usuario) erro(`${d.name}: skill de usuário sem disable-model-invocation: true`);
      // Descrição de modelo precisa de gatilho; sem ele, a skill só serve ao humano.
      if (!usuario && !/\bUse\b/.test(description)) {
        erro(`${d.name}: sem gatilho "Use ..." na descrição; se é de usuário, falta disable-model-invocation: true`);
      }
      skills.set(d.name, { usuario, corpo: fm.corpo });
    }
    for (const nome of SKILLS_USUARIO) if (!skills.has(nome)) erro(`skill de usuário ausente: ${nome}`);
    for (const [nome, s] of skills) {
      for (const [, citada] of s.corpo.matchAll(/`\/([a-z][a-z-]*)`/g)) {
        if (!skills.get(citada)?.usuario) erro(`${nome}: /${citada} não é skill de usuário existente`);
      }
      for (const [, frase] of s.corpo.matchAll(/\b[Cc]ham(?:ar|e)\b([^.;:\n]*)/g)) {
        for (const [, alvo] of frase.matchAll(/`\/?([a-z][a-z-]*)`/g)) {
          if (!skills.has(alvo)) erro(`${nome}: chama skill inexistente ${alvo}`);
          else if (skills.get(alvo).usuario) erro(`${nome}: chama a skill de usuário ${alvo}`);
        }
      }
    }
    for (const arquivo of listar(dirSkills).filter((a) => a.endsWith(".md"))) links(arquivo);

    for (const nome of AGENTES) {
      const arquivo = join(raiz, ".claude/agents", `${nome}.md`);
      const fm = existsSync(arquivo) ? lerFrontmatter(ler(arquivo)) : null;
      if (!fm) {
        erro(`subagente ${nome}: ausente ou frontmatter inválido`);
        continue;
      }
      if (fm.campos.name !== nome) erro(`subagente ${nome}: name difere do arquivo`);
      if (!fm.campos.description) erro(`subagente ${nome}: descrição ausente`);
      const ferramentas = (fm.campos.tools ?? "").split(",").map((t) => t.trim()).filter(Boolean);
      if (!ferramentas.length || ferramentas.some((t) => !["Read", "Grep", "Glob", "Bash"].includes(t))) {
        erro(`subagente ${nome}: tools deve se limitar a Read, Grep, Glob, Bash`);
      }
    }
    for (const c of [
      ...Object.values(HOOKS).map((h) => `.claude/hooks/${h}`),
      "scripts/esteira/politica/politica-proibida.mjs",
      "scripts/esteira/qg.mjs",
      ".claude/skills/CREDITOS.md",
    ]) {
      if (!existsSync(join(raiz, c))) erro(`${c} ausente`);
    }
    return skills.size;
  }

  function validarAdaptador() {
    const config = lerJson("esteira.config.json");
    if (!config) return;

    const obj = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
    for (const campo of ["estado", "evidencias", "referenciaBase"]) {
      if (typeof config[campo] !== "string" || !config[campo]) erro(`esteira.config.json: ${campo} deve ser texto`);
    }
    if (!obj(config.ambiente)) erro("esteira.config.json: ambiente deve ser objeto");
    const regex = (p, onde) => {
      try {
        new RegExp(p);
      } catch {
        erro(`esteira.config.json: regex inválida em ${onde}: ${p}`);
      }
    };
    const lista = (v, onde) => {
      if (Array.isArray(v)) return v;
      erro(`esteira.config.json: ${onde} deve ser lista`);
      return [];
    };
    for (const p of lista(config.fingerprint?.ignorar ?? [], "fingerprint.ignorar")) regex(p, "fingerprint.ignorar");

    const itens = PERFIS.flatMap((p) => lista(config.perfis?.[p], `perfis.${p}`).map((i) => ({ ...i, onde: `perfis.${p}` })));
    for (const grupo of ["criticos", "smokesPorArea"]) {
      for (const i of lista(config[grupo], grupo)) itens.push({ ...i, onde: grupo });
    }
    const temManifesto = existsSync(join(raiz, "package.json"));
    for (const i of itens) {
      const onde = `${i.onde}/${i.nome ?? "?"}`;
      if (!i.nome || !i.cmd) {
        erro(`esteira.config.json: ${onde} precisa de nome e cmd`);
        continue;
      }
      if (["criticos", "smokesPorArea"].includes(i.onde)) {
        if (!i.padroes?.length) erro(`esteira.config.json: ${onde} sem padroes`);
        for (const p of i.perfis ?? []) if (!PERFIS.includes(p)) erro(`esteira.config.json: ${onde} perfil ${p}`);
      }
      if (i.onde === "criticos" && i.seExistir) erro(`esteira.config.json: ${onde} crítico não aceita seExistir`);
      for (const p of i.padroes ?? []) regex(p, onde);
      for (const r of i.requer ?? []) if (!config.ambiente?.[r]) erro(`esteira.config.json: ${onde} requer "${r}" sem ambiente`);
      if (!i.seExistir && /^npm run /.test(i.cmd) && (!temManifesto || !comandoExiste(raiz, i.cmd))) {
        erro(`esteira.config.json: ${onde} comando inexistente: ${i.cmd}`);
      }
    }

    const termos = lista(config.termosDoProjeto ?? [], "termosDoProjeto");
    for (const arquivo of NUCLEO.flatMap((d) => listar(join(raiz, d)))) {
      const texto = ler(arquivo);
      for (const t of termos) if (texto.includes(t)) erro(`${rel(arquivo)}: termo do projeto no núcleo: ${t}`);
    }

    for (const nome of ["projeto", "rastreador", "dominio"]) {
      const arquivo = join(raiz, "docs/agents", `${nome}.md`);
      if (existsSync(arquivo)) links(arquivo);
      else erro(`docs/agents/${nome}.md ausente`);
    }
    if (config.glossario && !existsSync(join(raiz, config.glossario))) erro(`${config.glossario} ausente`);

    const claude = join(raiz, "CLAUDE.md");
    if (!existsSync(claude)) erro("CLAUDE.md ausente");
    else if (ler(claude).trimEnd().split("\n").length >= 40) erro("CLAUDE.md deve ter menos de 40 linhas");
    if (!existsSync(join(raiz, "AGENTS.md"))) erro("AGENTS.md ausente");

    const settings = lerJson(".claude/settings.json");
    if (settings) {
      for (const [evento, script] of Object.entries(HOOKS)) {
        const grupos = settings.hooks?.[evento] ?? [];
        const grupo = grupos.find((g) =>
          g.hooks?.some((h) => [h.command, ...(h.args ?? [])].some((a) => String(a).includes(basename(script)))),
        );
        if (!grupo) erro(`.claude/settings.json: hook ${evento} (${script}) não registrado`);
        else if (evento === "PreToolUse") {
          const re = new RegExp(`^(?:${grupo.matcher ?? ".*"})$`);
          for (const f of ["Bash", "PowerShell", "mcp__x__y"]) if (!re.test(f)) erro(`.claude/settings.json: PreToolUse não cobre ${f}`);
        }
      }
    }

    try {
      for (const p of diferencasEspelhos(raiz, config)) erro(`espelho: ${p}`);
    } catch (e) {
      erro(`espelho: ${e.message}`);
    }

    if (typeof config.estado === "string") validarEstado(config);
  }

  function validarEstado(config) {
    const estado = lerJson(config.estado);
    if (!estado) return;
    if (!("demanda" in estado)) erro(`${config.estado}: campo demanda ausente`);
    if (!Array.isArray(estado.demandasConcluidas)) erro(`${config.estado}: demandasConcluidas deve ser lista`);
    else if (estado.demandasConcluidas.length > (config.limiteDemandasConcluidas ?? 10)) {
      erro(`${config.estado}: demandasConcluidas acima do limite`);
    }
    if (estado.estado && !ESTADOS.includes(estado.estado)) erro(`${config.estado}: estado inválido ${estado.estado}`);
    if (estado.demanda) {
      for (const c of ["id", "tipo", "estado", "fluxo", "proximaAcao"]) {
        if (!(c in estado.demanda)) erro(`${config.estado}: demanda sem ${c}`);
      }
      if (!ESTADOS.includes(estado.demanda.estado)) erro(`${config.estado}: demanda com estado inválido`);
    }
  }
}

if (process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))) {
  const i = process.argv.indexOf("--raiz");
  const r = validar(i >= 0 ? process.argv[i + 1] : RAIZ_PADRAO);
  console.log(JSON.stringify(r, null, 2));
  process.exit(r.ok ? 0 : 1);
}
