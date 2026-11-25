/** Testes do validador, do sincronizador e da exportação, em diretórios temporários. */
import assert from "node:assert/strict";
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { exportarKit } from "./exportar-kit.mjs";
import { sincronizar } from "./sincronizar-agentes.mjs";
import { SEM_ADAPTADOR, validar } from "./validar-esteira.mjs";

function kit(t, { adaptador = true } = {}) {
  const raiz = mkdtempSync(join(tmpdir(), "kit-"));
  t.after(() => rmSync(raiz, { recursive: true, force: true }));
  exportarKit(raiz);
  const tpl = (de, para) => cpSync(join(raiz, "scripts/esteira/templates", de), join(raiz, para));
  const editar = (rel, f) => writeFileSync(join(raiz, rel), f(readFileSync(join(raiz, rel), "utf8")));
  const editarJson = (rel, f) =>
    editar(rel, (s) => {
      const o = JSON.parse(s);
      f(o);
      return JSON.stringify(o);
    });
  if (adaptador) {
    tpl("esteira.config.example.json", "esteira.config.json");
    tpl("CLAUDE.template.md", "CLAUDE.md");
    tpl("AGENTS.template.md", "AGENTS.md");
    tpl("settings.template.json", ".claude/settings.json");
    tpl("estado.template.json", "docs/esteira/estado/atual.json");
    for (const n of ["projeto", "rastreador", "dominio"]) tpl(`${n}.template.md`, `docs/agents/${n}.md`);
    writeFileSync(join(raiz, "GLOSSARIO.md"), "# Glossário\n");
    writeFileSync(join(raiz, "package.json"), JSON.stringify({ scripts: { lint: "x", build: "x" } }));
    sincronizar(raiz, JSON.parse(readFileSync(join(raiz, "esteira.config.json"), "utf8")));
  }
  const acusa = (trecho) => {
    const { erros } = validar(raiz);
    assert.ok(erros.some((e) => e.includes(trecho)), `esperava "${trecho}" em ${JSON.stringify(erros)}`);
  };
  return { raiz, editar, editarJson, acusa };
}

test("kit sem adaptador acusa apenas o adaptador ausente", (t) => {
  const { raiz } = kit(t, { adaptador: false });
  assert.deepEqual(validar(raiz).erros, [SEM_ADAPTADOR]);
  assert.ok(!existsSync(join(raiz, "docs")));
});

test("kit com os templates preenchidos passa", (t) => {
  assert.deepEqual(validar(kit(t).raiz).erros, []);
});

test("exportar não sobrescreve arquivo diferente sem --forcar", (t) => {
  const { raiz, editar } = kit(t, { adaptador: false });
  editar("scripts/esteira/qg.mjs", (s) => `${s}\n// local`);
  assert.throws(() => exportarKit(raiz), /forcar/);
  assert.equal(exportarKit(raiz, { forcar: true }).substituidos, 1);
});

test("acusa defeitos de skill", (t) => {
  const { editar, acusa } = kit(t);
  const s = (n) => `.claude/skills/${n}/SKILL.md`;
  editar(s("tdd"), (x) => x.replace("name: tdd", "name: outro"));
  acusa("difere da pasta");
  editar(s("sabatina"), (x) => `${x}\nChamar a skill \`planejar\`.\n`);
  acusa("chama a skill de usuário planejar");
  editar(s("retro"), (x) => x.replace("disable-model-invocation: true\n", "").replace("disable-model-invocation: true\r\n", ""));
  acusa("retro: skill de usuário sem");
  editar(s("homologar"), (x) => `${x}\n[x](nao-existe.md)\n`);
  acusa("link quebrado");
  editar(s("triagem"), (x) => x.replace(/description: .*/, `description: Use ${"a".repeat(1100)}`));
  acusa("caracteres");
  editar(s("entrega"), (x) => `${x}\nVer \`/inexistente\`.\n`);
  acusa("/inexistente");
});

test("acusa termo do projeto no núcleo", (t) => {
  const { editar, editarJson, acusa } = kit(t);
  editarJson("esteira.config.json", (c) => {
    c.termosDoProjeto = ["TermoDoProjeto"];
  });
  editar(".claude/agents/verificador.md", (x) => `${x}\nTermoDoProjeto\n`);
  acusa("termo do projeto no núcleo");
});

test("acusa comando inexistente, crítico opcional e requisito indefinido", (t) => {
  const { editarJson, acusa } = kit(t);
  editarJson("esteira.config.json", (c) => {
    c.perfis.qg1.push({ nome: "x", cmd: "npm run nada" });
    c.criticos.push({ nome: "y", cmd: "npm run lint", padroes: ["["], seExistir: true, requer: ["z"] });
  });
  for (const m of ["comando inexistente", "não aceita seExistir", "regex inválida", 'requer "z"']) acusa(m);
});

test("acusa espelho divergente e arquivo sem fonte", (t) => {
  const { raiz, editar, acusa } = kit(t);
  editar(".agents/skills/tdd/SKILL.md", (x) => `${x}mudou`);
  acusa("diferente da fonte");
  writeFileSync(join(raiz, ".agents/skills/solto.md"), "x");
  acusa("sem fonte");
});

test("sincronizar remove só o que gerou", (t) => {
  const { raiz, editarJson } = kit(t);
  writeFileSync(join(raiz, ".agents/skills/solto.md"), "x");
  rmSync(join(raiz, ".claude/skills/tdd"), { recursive: true });
  editarJson("esteira.config.json", () => {});
  sincronizar(raiz, JSON.parse(readFileSync(join(raiz, "esteira.config.json"), "utf8")));
  assert.ok(!existsSync(join(raiz, ".agents/skills/tdd/SKILL.md")));
  assert.ok(existsSync(join(raiz, ".agents/skills/solto.md")));
});

test("acusa hook sem PowerShell, CLAUDE.md longo e estado inválido", (t) => {
  const { editar, editarJson, acusa } = kit(t);
  editarJson(".claude/settings.json", (s) => {
    s.hooks.PreToolUse[0].matcher = "Bash|mcp__.*";
  });
  acusa("não cobre PowerShell");
  editar("CLAUDE.md", (x) => x + "\nlinha".repeat(40));
  acusa("menos de 40");
  editarJson("docs/esteira/estado/atual.json", (e) => {
    e.demanda = { id: "X", estado: "PRONTO" };
  });
  acusa("estado inválido");
});
