#!/usr/bin/env node
/**
 * Portão de qualidade determinístico. Os status vêm de execução real.
 *
 *   node scripts/esteira/qg.mjs --perfil qg1|qg2|qg3 --demanda <id> [--base <ref>] [--integral]
 *   node scripts/esteira/qg.mjs --verificar-fingerprint --demanda <id> [--perfil <perfil>]
 *
 * --integral seleciona todos os críticos e áreas do perfil, mesmo sem diff (homologação).
 * Exit: 0 ok; 1 FAIL/BLOCKED ou evidência inválida; 2 uso ou configuração inválida.
 */
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  readlinkSync,
  realpathSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ_PADRAO = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const PERFIS = ["qg1", "qg2", "qg3"];
const LINHAS_SAIDA = 40;
const TEMPO_LIMITE_MS = 20 * 60 * 1000;

export class ErroUso extends Error {}

const lerJson = (caminho) => JSON.parse(readFileSync(caminho, "utf8").replace(/^﻿/, ""));

// --- Git e fingerprint ------------------------------------------------------

function git(raiz, args) {
  const r = spawnSync("git", args, { cwd: raiz, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  return { ok: r.status === 0, saida: r.stdout ?? "", erro: (r.stderr ?? "").trim() };
}

function resolverBase(raiz, ref) {
  const objeto = git(raiz, ["rev-parse", "--verify", "--quiet", `${ref}^{tree}`]);
  if (!objeto.ok) throw new ErroUso(`base não encontrada: ${ref}`);
  const comum = git(raiz, ["merge-base", ref, "HEAD"]);
  return comum.ok ? comum.saida.trim() : git(raiz, ["rev-parse", ref]).saida.trim();
}

export function arquivosAlterados(raiz, base) {
  const diff = git(raiz, ["diff", "--name-only", "--no-renames", "-z", base, "--"]);
  const novos = git(raiz, ["ls-files", "--others", "--exclude-standard", "-z"]);
  if (!diff.ok || !novos.ok) throw new ErroUso(`git falhou: ${diff.erro || novos.erro}`);
  return [...new Set([...diff.saida.split("\0"), ...novos.saida.split("\0")].filter(Boolean))].sort();
}

function hashArquivo(caminho) {
  let info;
  try {
    info = lstatSync(caminho);
  } catch {
    return "AUSENTE";
  }
  const h = createHash("sha256");
  if (info.isSymbolicLink()) return h.update(`link:${readlinkSync(caminho)}`).digest("hex");
  if (!info.isFile()) return "NAO-ARQUIVO";
  const bytes = readFileSync(caminho);
  // Texto com finais de linha normalizados: mesmo valor em Windows e Linux.
  const texto = !bytes.includes(0);
  return h.update(texto ? Buffer.from(bytes.toString("latin1").replace(/\r\n/g, "\n"), "latin1") : bytes).digest("hex");
}

export function calcularFingerprint(raiz, arquivos, ignorar = []) {
  const regras = ignorar.map((p) => new RegExp(p));
  const porArquivo = {};
  const agregado = createHash("sha256");
  for (const arquivo of arquivos.filter((a) => !regras.some((r) => r.test(a))).sort()) {
    porArquivo[arquivo] = hashArquivo(join(raiz, arquivo));
    agregado.update(`${arquivo}\0${porArquivo[arquivo]}\n`);
  }
  return { valor: `sha256:${agregado.digest("hex")}`, porArquivo };
}

// --- Seleção ------------------------------------------------------------------

const casa = (padroes, arquivos) => {
  const regras = padroes.map((p) => new RegExp(p, "i"));
  return arquivos.some((a) => regras.some((r) => r.test(a)));
};

/** Perfil + críticos + áreas. Crítico vence duplicata e nunca é opcional. */
export function selecionarChecagens(config, perfil, arquivos, integral = false) {
  const toca = (padroes) => integral || casa(padroes, arquivos);
  const doPerfil = (item) => (item.perfis ?? PERFIS).includes(perfil);
  const criticos = (config.criticos ?? [])
    .filter((i) => doPerfil(i) && toca(i.padroes))
    .map((i) => ({ ...i, origem: "critico", seExistir: false }));
  const perfilBase = (config.perfis?.[perfil] ?? [])
    .filter((i) => !i.padroes || toca(i.padroes))
    .map((i) => ({ ...i, origem: "perfil" }));
  const areas = (config.smokesPorArea ?? [])
    .filter((i) => doPerfil(i) && toca(i.padroes))
    .map((i) => ({ ...i, origem: "area" }));

  const porComando = new Map();
  for (const item of [...criticos, ...perfilBase, ...areas]) {
    if (!porComando.has(item.cmd)) porComando.set(item.cmd, item);
    else {
      const atual = porComando.get(item.cmd);
      atual.requer = [...new Set([...(atual.requer ?? []), ...(item.requer ?? [])])];
      atual.seExistir = Boolean(atual.seExistir && item.seExistir);
    }
  }
  const ordem = { perfil: 0, critico: 1, area: 2 };
  return [...porComando.values()].sort((a, b) => ordem[a.origem] - ordem[b.origem]);
}

function diretoriosWorkspace(raiz) {
  const pkg = lerJson(join(raiz, "package.json"));
  const padroes = Array.isArray(pkg.workspaces) ? pkg.workspaces : (pkg.workspaces?.packages ?? []);
  return padroes.flatMap((p) => {
    if (!p.endsWith("/*")) return [p];
    const pai = p.slice(0, -2);
    if (!existsSync(join(raiz, pai))) return [];
    return readdirSync(join(raiz, pai), { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => `${pai}/${d.name}`);
  });
}

/** `npm run x [-w pacote]` existe no manifesto? Outros comandos são dados como existentes. */
export function comandoExiste(raiz, cmd) {
  const m = cmd.match(/^npm run (?:-s |--silent )?(\S+)(?:.*?\s(?:-w|--workspace)[= ](\S+))?/);
  if (!m) return true;
  const manifestos = m[2]
    ? diretoriosWorkspace(raiz).map((d) => join(raiz, d, "package.json")).filter(existsSync)
    : [join(raiz, "package.json")].filter(existsSync);
  return manifestos.some((arq) => {
    const pkg = lerJson(arq);
    return (!m[2] || pkg.name === m[2]) && Boolean(pkg.scripts?.[m[1]]);
  });
}

// --- Requisitos de ambiente ------------------------------------------------------

const LOCAIS = new Set(["localhost", "127.0.0.1", "[::1]", "::1"]);

/** Todos os destinos da URL são desta máquina? O valor nunca é exibido. */
export function urlLocal(valor) {
  try {
    const u = new URL(valor);
    const alternativos = u.searchParams.getAll("host");
    return LOCAIS.has(u.hostname) && alternativos.every((h) => LOCAIS.has(h));
  } catch {
    return false;
  }
}

function valoresEnv(raiz, nome, arquivos = []) {
  const valores = process.env[nome] ? [process.env[nome]] : [];
  for (const arq of arquivos) {
    const caminho = join(raiz, arq);
    if (!existsSync(caminho)) continue;
    for (const linha of readFileSync(caminho, "utf8").split(/\r?\n/)) {
      const m = linha.match(/^\s*(?:export\s+)?([A-Za-z_]\w*)\s*=\s*(.*?)\s*$/);
      if (m?.[1] === nome) valores.push(m[2].replace(/^(["'])(.*)\1$/, "$2"));
    }
  }
  return valores;
}

/** Devolve null se disponível, ou o motivo do bloqueio. */
export async function verificarRequisito(raiz, nome, ambiente = {}) {
  const r = ambiente[nome];
  if (!r) return `requisito "${nome}" sem definição em ambiente`;

  if (r.cmd) {
    const exec = spawnSync(r.cmd, { cwd: raiz, shell: true, encoding: "utf8", timeout: 30_000 });
    if (exec.status !== 0) return `${nome} indisponível (exit ${exec.status ?? "sem resposta"})`;
    if (r.contem && !exec.stdout.includes(r.contem)) return `${nome}: serviço "${r.contem}" parado`;
    return null;
  }
  if (r.urlEnv) {
    const valores = valoresEnv(raiz, r.urlEnv, r.arquivos);
    if (valores.length === 0 && r.padrao) valores.push(r.padrao);
    if (valores.length === 0) return `${nome}: ${r.urlEnv} não definida`;
    // Não sabemos qual fonte o comando usará: todas precisam ser locais.
    if (!valores.every(urlLocal)) return `${nome}: ${r.urlEnv} aponta para destino não local`;
    if (r.caminho) {
      try {
        const resposta = await fetch(new URL(r.caminho, valores[0]), {
          signal: AbortSignal.timeout(5000),
          redirect: "error",
        });
        if (!resposta.ok) return `${nome}: respondeu ${resposta.status}`;
      } catch {
        return `${nome}: sem resposta`;
      }
    }
    return null;
  }
  return `requisito "${nome}" mal definido`;
}

// --- Execução -----------------------------------------------------------------

export function ocultar(texto) {
  return texto
    .replace(/(\b[a-z][a-z0-9+.-]*:\/\/)[^\s/@]+@/gi, "$1<OCULTO>@")
    .replace(/\b(authorization|cookie|set-cookie)(["']?\s*[:=]\s*).+/gi, "$1$2<OCULTO>")
    .replace(/\b([\w-]*(?:senha|password|token|secret|api[_-]?key))(["']?\s*[:=]\s*["']?)[^\s"',;}]+/gi, "$1$2<OCULTO>");
}

const ultimasLinhas = (t) =>
  ocultar(t.replace(/\x1b\[[0-9;]*m/g, "")).trimEnd().split(/\r?\n/).slice(-LINHAS_SAIDA);

export async function executarChecagem(raiz, item, ambiente) {
  const base = { nome: item.nome, origem: item.origem, comando: item.cmd, exit: null, duracaoMs: 0 };
  if (!comandoExiste(raiz, item.cmd)) {
    return item.seExistir
      ? { ...base, status: "NOT_APPLICABLE", motivo: "script ainda não existe" }
      : { ...base, status: "BLOCKED", motivo: "script ausente no package.json" };
  }
  const motivos = [];
  for (const req of item.requer ?? []) {
    const motivo = await verificarRequisito(raiz, req, ambiente);
    if (motivo) motivos.push(motivo);
  }
  if (motivos.length) return { ...base, status: "BLOCKED", motivo: motivos.join("; ") };

  const inicio = Date.now();
  const r = spawnSync(item.cmd, {
    cwd: raiz,
    shell: true,
    encoding: "utf8",
    timeout: item.tempoLimiteMs ?? TEMPO_LIMITE_MS,
    maxBuffer: 256 * 1024 * 1024,
  });
  return {
    ...base,
    status: r.status === 0 && !r.error ? "PASS" : "FAIL",
    exit: r.status,
    duracaoMs: Date.now() - inicio,
    ...(r.error ? { motivo: r.error.code === "ETIMEDOUT" ? "tempo esgotado" : r.error.code } : {}),
    saida: ultimasLinhas(`${r.stdout ?? ""}${r.stderr ?? ""}`),
  };
}

// --- Estado ---------------------------------------------------------------------

function carregar(raiz, demandaId) {
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(demandaId ?? "")) {
    throw new ErroUso("--demanda obrigatória (letras, números, ponto, hífen e sublinhado)");
  }
  const caminhoConfig = join(raiz, "esteira.config.json");
  if (!existsSync(caminhoConfig)) throw new ErroUso("adaptador ausente — rode /configurar-esteira");
  const config = lerJson(caminhoConfig);
  const caminhoEstado = join(raiz, config.estado);
  const estado = lerJson(caminhoEstado);
  if (estado.demanda?.id !== demandaId) {
    throw new ErroUso(`demanda ativa é "${estado.demanda?.id ?? "nenhuma"}", não "${demandaId}"`);
  }
  return { config, caminhoEstado, estado };
}

function gravarEstado(caminho, estado) {
  const temporario = `${caminho}.tmp`;
  writeFileSync(temporario, `${JSON.stringify(estado, null, 2)}\n`, "utf8");
  renameSync(temporario, caminho);
}

export async function executarPerfil({ raiz = RAIZ_PADRAO, perfil, demanda, base, integral = false }) {
  if (!PERFIS.includes(perfil)) throw new ErroUso(`--perfil deve ser ${PERFIS.join(" | ")}`);
  const { config, caminhoEstado } = carregar(raiz, demanda);
  const refBase = base ?? config.referenciaBase ?? "HEAD";
  const baseSha = resolverBase(raiz, refBase);
  const head = git(raiz, ["rev-parse", "--verify", "--quiet", "HEAD"]).saida.trim() || null;
  const ignorar = config.fingerprint?.ignorar ?? [];

  const arquivos = arquivosAlterados(raiz, baseSha);
  const fingerprint = calcularFingerprint(raiz, arquivos, ignorar);
  const checagens = [];
  for (const item of selecionarChecagens(config, perfil, arquivos, integral)) {
    checagens.push(await executarChecagem(raiz, item, config.ambiente));
  }

  const depois = calcularFingerprint(raiz, arquivosAlterados(raiz, baseSha), ignorar);
  if (depois.valor !== fingerprint.valor) {
    checagens.push({
      nome: "arvore-estavel",
      origem: "perfil",
      comando: "(interno)",
      exit: null,
      duracaoMs: 0,
      status: "FAIL",
      motivo: `arquivos mudaram durante a execução: ${diferencas(fingerprint.porArquivo, depois.porArquivo).join(", ")}`,
    });
  }

  const ruins = checagens.filter((c) => c.status === "FAIL" || c.status === "BLOCKED");
  const status = ruins.some((c) => c.status === "FAIL") ? "FAIL" : ruins.length ? "BLOCKED" : "PASS";
  const agora = new Date().toISOString();
  const relEvidencia = `${config.evidencias}/${demanda}/${perfil}-${agora.replace(/[:.]/g, "-")}.json`;
  const evidencia = {
    demanda,
    perfil,
    integral,
    status,
    em: agora,
    base: { ref: refBase, sha: baseSha },
    head,
    fingerprint: fingerprint.valor,
    arquivos: fingerprint.porArquivo,
    arquivosConsiderados: arquivos,
    checagens,
  };
  mkdirSync(dirname(join(raiz, relEvidencia)), { recursive: true });
  writeFileSync(join(raiz, relEvidencia), `${JSON.stringify(evidencia, null, 2)}\n`, "utf8");

  // Relê o estado: só a verificação da demanda muda.
  const estado = lerJson(caminhoEstado);
  if (estado.demanda?.id !== demanda) throw new ErroUso("a demanda ativa mudou durante a execução");
  estado.demanda.verificacao = {
    ...(estado.demanda.verificacao ?? {}),
    [perfil]: {
      status,
      integral,
      em: agora,
      base: baseSha,
      head,
      fingerprint: fingerprint.valor,
      checagens: checagens.map((c) => ({
        nome: c.nome,
        status: c.status,
        comando: c.comando,
        exit: c.exit,
        ...(c.motivo ? { motivo: c.motivo } : {}),
      })),
      evidencia: relEvidencia,
    },
  };
  estado.demanda.fingerprint = fingerprint.valor;
  gravarEstado(caminhoEstado, estado);

  const limite = config.limiteDemandasConcluidas ?? 10;
  const avisos =
    (estado.demandasConcluidas?.length ?? 0) > limite
      ? [`demandasConcluidas passa do limite de ${limite}; resumir no estado (histórico no Git)`]
      : [];
  return { ...evidencia, evidencia: relEvidencia, avisos };
}

function diferencas(antes, agora) {
  return [...new Set([...Object.keys(antes), ...Object.keys(agora)])]
    .filter((a) => antes[a] !== agora[a])
    .sort();
}

/**
 * Cada perfil registrado precisa corresponder à árvore atual e estar em PASS.
 * Com `perfil`, confere só ele: no meio do ciclo, os perfis seguintes ainda serão refeitos.
 */
export function verificarFingerprint({ raiz = RAIZ_PADRAO, demanda, perfil: unico }) {
  if (unico && !PERFIS.includes(unico)) throw new ErroUso(`--perfil deve ser ${PERFIS.join(" | ")}`);
  const { config, estado } = carregar(raiz, demanda);
  const registrados = Object.entries(estado.demanda.verificacao ?? {}).filter(
    ([nome, v]) => (unico ? nome === unico : PERFIS.includes(nome)) && v?.fingerprint && v?.base,
  );
  if (!registrados.length) return { ok: false, demanda, motivo: "sem fingerprint registrado pelo qg.mjs", perfis: [] };

  const perfis = registrados.map(([perfil, v]) => {
    const arquivos = arquivosAlterados(raiz, v.base);
    const atual = calcularFingerprint(raiz, arquivos, config.fingerprint?.ignorar ?? []);
    const confere = atual.valor === v.fingerprint;
    const caminho = v.evidencia ? join(raiz, v.evidencia) : "";
    let divergentes = null;
    if (!confere && caminho && existsSync(caminho)) {
      divergentes = diferencas(lerJson(caminho).arquivos, atual.porArquivo);
    }
    return {
      perfil,
      confere,
      status: v.status,
      registrado: v.fingerprint,
      atual: atual.valor,
      ...(confere ? {} : { divergentes: divergentes ?? "detalhe local ausente; reexecutar o perfil" }),
    };
  });
  return { ok: perfis.every((p) => p.confere && p.status === "PASS"), demanda, perfis };
}

// --- CLI --------------------------------------------------------------------------

function lerArgs(argv) {
  const opcoes = {};
  const comValor = { "--perfil": "perfil", "--demanda": "demanda", "--base": "base", "--raiz": "raiz" };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--verificar-fingerprint") opcoes.verificar = true;
    else if (argv[i] === "--integral") opcoes.integral = true;
    else if (comValor[argv[i]]) {
      if (argv[i + 1] === undefined || argv[i + 1].startsWith("--")) throw new ErroUso(`${argv[i]} sem valor`);
      opcoes[comValor[argv[i]]] = argv[++i];
    } else throw new ErroUso(`opção desconhecida: ${argv[i]}`);
  }
  return opcoes;
}

async function principal() {
  try {
    const { verificar, ...opcoes } = lerArgs(process.argv.slice(2));
    if (verificar) {
      const r = verificarFingerprint(opcoes);
      console.log(JSON.stringify(r, null, 2));
      return r.ok ? 0 : 1;
    }
    const r = await executarPerfil(opcoes);
    const { perfil, status, base, fingerprint, evidencia, avisos } = r;
    const checagens = r.checagens.map(({ nome, status: s, exit, duracaoMs, motivo }) => ({ nome, status: s, exit, duracaoMs, motivo }));
    console.log(JSON.stringify({ perfil, status, base, fingerprint, checagens, evidencia, avisos }, null, 2));
    return status === "PASS" ? 0 : 1;
  } catch (erro) {
    console.error(`qg: ${erro.message}`);
    return 2;
  }
}

if (process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))) {
  process.exitCode = await principal();
}
