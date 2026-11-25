/**
 * Testes do qg.mjs em repositórios Git temporários, sem commits:
 * a base é a árvore vazia e os arquivos ficam não rastreados.
 */
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import {
  arquivosAlterados,
  calcularFingerprint,
  comandoExiste,
  ocultar,
  selecionarChecagens,
  urlLocal,
  verificarRequisito,
} from "./qg.mjs";

const QG = join(dirname(fileURLToPath(import.meta.url)), "qg.mjs");
const ARVORE_VAZIA = "4b825dc642cb6eb9a060e54bf8d69288fbee4904";

const critico = {
  nome: "acesso",
  padroes: ["^src/auth/"],
  cmd: "npm run acesso",
  requer: ["docker"],
  perfis: ["qg1", "qg2", "qg3"],
};

function configBase(extra = {}) {
  return {
    estado: "estado.json",
    evidencias: "evidencias",
    fingerprint: { ignorar: ["^estado\\.json", "^evidencias/"] },
    ambiente: { docker: { cmd: "node -e process.exit(1)" } },
    perfis: { qg1: [{ nome: "ok", cmd: "npm run ok" }], qg2: [], qg3: [] },
    criticos: [],
    smokesPorArea: [],
    ...extra,
  };
}

function repo(t, { config = configBase(), arquivos = {}, estado = {} } = {}) {
  const raiz = mkdtempSync(join(tmpdir(), "qg-"));
  t.after(() => rmSync(raiz, { recursive: true, force: true }));
  const gravar = (rel, conteudo) => {
    mkdirSync(dirname(join(raiz, rel)), { recursive: true });
    writeFileSync(join(raiz, rel), typeof conteudo === "string" ? conteudo : JSON.stringify(conteudo));
  };
  assert.equal(spawnSync("git", ["init", "-q"], { cwd: raiz }).status, 0);
  gravar("package.json", {
    name: "x",
    scripts: {
      ok: "node -e process.exit(0)",
      falha: "node -e process.exit(3)",
      acesso: "node -e process.exit(0)",
      muda: "node muda.cjs",
    },
  });
  gravar("esteira.config.json", config);
  gravar("estado.json", { intocado: 1, demandasConcluidas: [{ id: "A" }], demanda: { id: "D-1", tipo: "correcao", verificacao: { nota: "x" } }, ...estado });
  for (const [rel, c] of Object.entries(arquivos)) gravar(rel, c);
  return { raiz, gravar, estado: () => JSON.parse(readFileSync(join(raiz, "estado.json"), "utf8")) };
}

function qg(raiz, ...args) {
  const r = spawnSync(process.execPath, [QG, "--raiz", raiz, "--demanda", "D-1", ...args], { encoding: "utf8" });
  let json = null;
  try {
    json = JSON.parse(r.stdout);
  } catch {
    // erro de uso não emite JSON
  }
  return { exit: r.status, json, erro: r.stderr };
}
const perfil = (raiz, p = "qg1") => qg(raiz, "--perfil", p, "--base", ARVORE_VAZIA);

test("crítico é selecionado em todo perfil quando o padrão casa", () => {
  const config = configBase({ criticos: [critico] });
  for (const p of ["qg1", "qg2", "qg3"]) {
    assert.ok(selecionarChecagens(config, p, ["src/auth/login.ts"]).some((c) => c.nome === "acesso"));
    assert.ok(!selecionarChecagens(config, p, ["src/outro.ts"]).some((c) => c.nome === "acesso"));
  }
});

test("crítico duplicado no perfil continua crítico e obrigatório", () => {
  const config = configBase({
    criticos: [{ ...critico, seExistir: true }],
    perfis: { qg1: [{ nome: "mesmo", cmd: critico.cmd, seExistir: true }] },
  });
  const [item, ...resto] = selecionarChecagens(config, "qg1", ["src/auth/a.ts"]);
  assert.equal(resto.length, 0);
  assert.equal(item.origem, "critico");
  assert.equal(item.seExistir, false);
  assert.deepEqual(item.requer, ["docker"]);
});

test("smoke de área só entra nos perfis declarados", () => {
  const config = configBase({ smokesPorArea: [{ nome: "area", padroes: ["^src/x/"], cmd: "npm run acesso", perfis: ["qg2"] }] });
  assert.ok(!selecionarChecagens(config, "qg1", ["src/x/a"]).some((c) => c.nome === "area"));
  assert.ok(selecionarChecagens(config, "qg2", ["src/x/a"]).some((c) => c.nome === "area"));
});

test("PASS grava evidência e preserva os demais campos do estado", (t) => {
  const r = repo(t, { arquivos: { "src/a.ts": "a" } });
  const { exit, json } = perfil(r.raiz);
  assert.equal(exit, 0);
  assert.equal(json.status, "PASS");
  const e = r.estado();
  assert.equal(e.intocado, 1);
  assert.deepEqual(e.demandasConcluidas, [{ id: "A" }]);
  assert.equal(e.demanda.tipo, "correcao");
  assert.equal(e.demanda.verificacao.nota, "x");
  assert.equal(e.demanda.verificacao.qg1.checagens[0].exit, 0);
  assert.match(e.demanda.fingerprint, /^sha256:[0-9a-f]{64}$/);
  const ev = JSON.parse(readFileSync(join(r.raiz, json.evidencia), "utf8"));
  assert.ok(ev.arquivos["src/a.ts"]);
  assert.equal(ev.arquivos["estado.json"], undefined);
});

test("falha real vira FAIL com exit code", (t) => {
  const r = repo(t, { config: configBase({ perfis: { qg1: [{ nome: "f", cmd: "npm run falha" }] } }) });
  const { exit, json } = perfil(r.raiz);
  assert.equal(exit, 1);
  assert.equal(json.checagens[0].status, "FAIL");
  assert.equal(json.checagens[0].exit, 3);
});

test("sem Docker o crítico fica BLOCKED e não executa", (t) => {
  const r = repo(t, { config: configBase({ criticos: [critico] }), arquivos: { "src/auth/a.ts": "a" } });
  const { exit, json } = perfil(r.raiz);
  const c = json.checagens.find((x) => x.nome === "acesso");
  assert.equal(exit, 1);
  assert.equal(json.status, "BLOCKED");
  assert.equal(c.status, "BLOCKED");
  assert.equal(c.exit, null);
});

test("seExistir ausente é NOT_APPLICABLE; crítico ausente é BLOCKED", (t) => {
  const r = repo(t, {
    config: configBase({
      perfis: { qg1: [{ nome: "t", cmd: "npm run test", seExistir: true }] },
      criticos: [{ ...critico, cmd: "npm run inexistente", seExistir: true, requer: [] }],
    }),
    arquivos: { "src/auth/a.ts": "a" },
  });
  const { json } = perfil(r.raiz);
  assert.equal(json.checagens.find((c) => c.nome === "t").status, "NOT_APPLICABLE");
  assert.equal(json.checagens.find((c) => c.nome === "acesso").status, "BLOCKED");
});

test("checagem que altera arquivos reprova a execução", (t) => {
  const r = repo(t, {
    config: configBase({ perfis: { qg1: [{ nome: "m", cmd: "npm run muda" }] } }),
    arquivos: { "muda.cjs": "require('fs').writeFileSync('src.txt', 'novo')" },
  });
  const { exit, json } = perfil(r.raiz);
  assert.equal(exit, 1);
  assert.match(json.checagens.find((c) => c.nome === "arvore-estavel").motivo, /src\.txt/);
});

test("fingerprint confere; arquivo alterado, novo ou removido diverge", (t) => {
  const r = repo(t, { arquivos: { "src/a.ts": "a", "src/b.ts": "b" } });
  perfil(r.raiz);
  assert.equal(qg(r.raiz, "--verificar-fingerprint").exit, 0);

  r.gravar("src/a.ts", "mudou");
  r.gravar("src/novo.ts", "n");
  rmSync(join(r.raiz, "src/b.ts"));
  const { exit, json } = qg(r.raiz, "--verificar-fingerprint");
  assert.equal(exit, 1);
  assert.deepEqual(json.perfis[0].divergentes, ["src/a.ts", "src/b.ts", "src/novo.ts"]);
});

test("perfil antigo desatualizado reprova mesmo com outro recente", (t) => {
  const r = repo(t, { arquivos: { "src/a.ts": "a" } });
  perfil(r.raiz, "qg1");
  r.gravar("src/a.ts", "mudou");
  perfil(r.raiz, "qg2");
  const { exit, json } = qg(r.raiz, "--verificar-fingerprint");
  assert.equal(exit, 1);
  assert.deepEqual(json.perfis.map((p) => [p.perfil, p.confere]), [["qg1", false], ["qg2", true]]);
});

test("--perfil confere só o perfil pedido; sem registro dele, reprova", (t) => {
  const r = repo(t, { arquivos: { "src/a.ts": "a" } });
  perfil(r.raiz, "qg2");
  r.gravar("src/a.ts", "mudou");
  perfil(r.raiz, "qg1");
  assert.equal(qg(r.raiz, "--verificar-fingerprint", "--perfil", "qg1").exit, 0);
  assert.equal(qg(r.raiz, "--verificar-fingerprint", "--perfil", "qg2").exit, 1);
  assert.equal(qg(r.raiz, "--verificar-fingerprint", "--perfil", "qg3").exit, 1);
  assert.equal(qg(r.raiz, "--verificar-fingerprint").exit, 1);
});

test("perfil reprovado não valida a evidência, mesmo com fingerprint igual", (t) => {
  const r = repo(t, { config: configBase({ perfis: { qg1: [{ nome: "f", cmd: "npm run falha" }] } }) });
  perfil(r.raiz);
  const { exit, json } = qg(r.raiz, "--verificar-fingerprint");
  assert.equal(exit, 1);
  assert.equal(json.perfis[0].confere, true);
});

test("--integral seleciona críticos e áreas sem diff", (t) => {
  const config = configBase({ criticos: [critico], smokesPorArea: [{ nome: "area", padroes: ["^x/"], cmd: "npm run ok", perfis: ["qg3"] }] });
  assert.deepEqual(selecionarChecagens(config, "qg3", []), []);
  assert.deepEqual(selecionarChecagens(config, "qg3", [], true).map((c) => c.nome), ["acesso", "area"]);
  const r = repo(t, { config });
  const { json } = qg(r.raiz, "--perfil", "qg3", "--integral", "--base", ARVORE_VAZIA);
  assert.equal(json.status, "BLOCKED");
});

test("fingerprint sem registro não passa", (t) => {
  assert.equal(qg(repo(t).raiz, "--verificar-fingerprint").exit, 1);
});

test("fingerprint ignora CRLF em texto e distingue binário", (t) => {
  const r = repo(t, { arquivos: { "a.txt": "um\r\ndois\r\n" } });
  const antes = calcularFingerprint(r.raiz, ["a.txt"]).valor;
  r.gravar("a.txt", "um\ndois\n");
  assert.equal(calcularFingerprint(r.raiz, ["a.txt"]).valor, antes);
  r.gravar("a.bin", "\0um\r\n");
  const bin = calcularFingerprint(r.raiz, ["a.bin"]).valor;
  r.gravar("a.bin", "\0um\n");
  assert.notEqual(calcularFingerprint(r.raiz, ["a.bin"]).valor, bin);
});

test("caminhos com acento e espaço são listados literalmente", (t) => {
  const r = repo(t, { arquivos: { "src/ação nova.ts": "a" } });
  assert.ok(arquivosAlterados(r.raiz, ARVORE_VAZIA).includes("src/ação nova.ts"));
});

test("uso inválido sai com exit 2", (t) => {
  const r = repo(t);
  assert.equal(qg(r.raiz, "--perfil", "qg9").exit, 2);
  assert.equal(qg(r.raiz, "--perfil", "qg1", "--base", "nao-existe").exit, 2);
  assert.equal(qg(r.raiz, "--perfil").exit, 2);
  assert.equal(qg(r.raiz, "--demanda", "OUTRA", "--perfil", "qg1", "--base", ARVORE_VAZIA).exit, 2);
  assert.equal(qg(r.raiz, "--demanda", "../x", "--perfil", "qg1", "--base", ARVORE_VAZIA).exit, 2);
});

test("comandoExiste consulta o workspace certo", (t) => {
  const r = repo(t, { arquivos: { "pacotes/um/package.json": { name: "@k/um", scripts: { s: "x" } } } });
  r.gravar("package.json", { workspaces: ["pacotes/*"], scripts: { raiz: "x" } });
  assert.equal(comandoExiste(r.raiz, "npm run s -w @k/um"), true);
  assert.equal(comandoExiste(r.raiz, "npm run raiz -w @k/um"), false);
  assert.equal(comandoExiste(r.raiz, "npm run raiz"), true);
});

test("somente destinos desta máquina contam como locais", () => {
  assert.equal(urlLocal("postgresql://u:p@localhost:5433/x"), true);
  assert.equal(urlLocal("http://127.0.0.1:3001"), true);
  assert.equal(urlLocal("postgresql://u:p@banco.exemplo/x"), false);
  assert.equal(urlLocal("postgresql://u:p@localhost/x?host=banco.exemplo"), false);
  assert.equal(urlLocal("http://localhost.exemplo.com"), false);
  assert.equal(urlLocal("lixo"), false);
});

test("banco remoto em qualquer fonte bloqueia sem revelar o valor", async (t) => {
  const r = repo(t, {
    arquivos: { "a.env": "QG_URL_TESTE=postgresql://u:p@localhost/x", "b.env": 'QG_URL_TESTE="postgresql://u:segredo@remoto.exemplo/x"' },
  });
  const local = { b: { urlEnv: "QG_URL_TESTE", arquivos: ["a.env"] } };
  assert.equal(await verificarRequisito(r.raiz, "b", local), null);
  const misto = { b: { urlEnv: "QG_URL_TESTE", arquivos: ["a.env", "b.env"] } };
  const motivo = await verificarRequisito(r.raiz, "b", misto);
  assert.match(motivo, /não local/);
  assert.doesNotMatch(motivo, /segredo|remoto/);
  assert.match(await verificarRequisito(r.raiz, "nada", {}), /sem definição/);
});

test("segredos são ocultados na saída", () => {
  const s = ocultar("postgresql://u:abc@h/x TOKEN=def senha: ghi\nCookie: sid=jkl");
  assert.doesNotMatch(s, /abc|def|ghi|jkl/);
});
