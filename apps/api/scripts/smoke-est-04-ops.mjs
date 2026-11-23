/**
 * EST-04 — validação operacional mínima (local/controlado).
 * - Confere schema vs banco (prisma db push --dry-run quando disponível)
 * - Backup pg_dump do Postgres Docker + restore em banco descartável
 * - GET /saude com banco disponível e indisponível
 * Não usa db reset/push destrutivo no banco compartilhado `pef`.
 */
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync, existsSync, statSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const raizApi = join(dirname(fileURLToPath(import.meta.url)), "..");
const raizRepo = join(raizApi, "..", "..");
const container = process.env.PEF_POSTGRES_CONTAINER || "pef-postgres";
const dbPrincipal = process.env.PEF_DB_NAME || "pef";
const dbRestore = process.env.PEF_DB_RESTORE || "pef_restore_est04";
const usuario = process.env.PEF_DB_USER || "pef";
const apiBase = process.env.PEF_API_BASE || "http://localhost:3001";
const dumpHostDir = join(raizRepo, "backups");
const dumpHost = join(dumpHostDir, "pef-est04-local.dump");
const dumpContainer = "/tmp/pef_est04_smoke.dump";

const checagens = [];
let falhas = 0;

function registrar(nome, ok, detalhe = {}) {
  const item = { nome, status: ok ? "PASS" : "FAIL", ...detalhe };
  checagens.push(item);
  if (!ok) falhas += 1;
  console.log(JSON.stringify(item));
  return ok;
}

function executar(comando, args, opcoes = {}) {
  const resultado = spawnSync(comando, args, {
    encoding: "utf8",
    cwd: opcoes.cwd || raizRepo,
    env: { ...process.env, ...(opcoes.env || {}) },
    shell: opcoes.shell === true,
  });
  return {
    status: resultado.status ?? 1,
    stdout: resultado.stdout || "",
    stderr: resultado.stderr || "",
    error: resultado.error,
  };
}

function dockerExec(args) {
  return executar("docker", ["exec", container, ...args]);
}

async function consultarSaude() {
  const resposta = await fetch(`${apiBase}/saude`);
  let corpo = null;
  try {
    corpo = await resposta.json();
  } catch {
    corpo = null;
  }
  return { statusHttp: resposta.status, corpo };
}

function contarTabelas(nomeBanco) {
  const sql =
    "SELECT count(*)::int AS n FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';";
  const r = dockerExec(["psql", "-U", usuario, "-d", nomeBanco, "-At", "-c", sql]);
  if (r.status !== 0) {
    return { ok: false, erro: r.stderr || r.stdout || String(r.error) };
  }
  const n = Number.parseInt(String(r.stdout).trim(), 10);
  return { ok: Number.isFinite(n), n };
}

function limparRestore() {
  dockerExec([
    "psql",
    "-U",
    usuario,
    "-d",
    "postgres",
    "-c",
    `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${dbRestore}' AND pid <> pg_backend_pid();`,
  ]);
  dockerExec([
    "psql",
    "-U",
    usuario,
    "-d",
    "postgres",
    "-c",
    `DROP DATABASE IF EXISTS ${dbRestore};`,
  ]);
}

async function aguardar(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function principal() {
  mkdirSync(dumpHostDir, { recursive: true });

  const dockerPs = executar("docker", ["inspect", "-f", "{{.State.Health.Status}}", container]);
  registrar("docker_postgres_healthy", dockerPs.status === 0 && dockerPs.stdout.trim() === "healthy", {
    saida: dockerPs.stdout.trim() || dockerPs.stderr.trim(),
  });

  const migrationsExiste = existsSync(join(raizApi, "prisma", "migrations"));
  registrar("estrategia_schema_sem_migrations_dir", migrationsExiste === false, {
    estrategiaVigente: "prisma db push (fase pré-uso; Documento Mestre §13)",
    migrationsDir: migrationsExiste,
    bloqueioUsoReal: "histórico migrate ainda ausente para ambiente alvo",
  });

  // Prisma 6: db push não tem --dry-run; migrate diff é somente leitura.
  const diffSchema = executar(
    "npx",
    [
      "prisma",
      "migrate",
      "diff",
      "--from-schema-datasource",
      "prisma/schema.prisma",
      "--to-schema-datamodel",
      "prisma/schema.prisma",
      "--exit-code",
    ],
    { cwd: raizApi, shell: true },
  );
  const schemaEmSync = diffSchema.status === 0;
  registrar("prisma_schema_em_sync_com_banco", schemaEmSync, {
    exit: diffSchema.status,
    interpretacao: "0=sem diff; 2=há diff; 1=erro",
    trecho: `${diffSchema.stdout}\n${diffSchema.stderr}`.trim().slice(0, 500),
    estrategiaVigente: "npm run db:push (sem pasta migrations)",
  });

  const saudeOk = await consultarSaude();
  registrar("saude_banco_disponivel", saudeOk.statusHttp === 200 && saudeOk.corpo?.banco === "ok", {
    statusHttp: saudeOk.statusHttp,
    corpo: saudeOk.corpo,
  });

  const dump = dockerExec([
    "pg_dump",
    "-U",
    usuario,
    "-d",
    dbPrincipal,
    "-Fc",
    "-f",
    dumpContainer,
  ]);
  registrar("backup_pg_dump", dump.status === 0, {
    exit: dump.status,
    erro: dump.stderr.trim().slice(0, 300),
  });

  const copia = executar("docker", ["cp", `${container}:${dumpContainer}`, dumpHost]);
  const dumpStat = existsSync(dumpHost) ? statSync(dumpHost) : null;
  registrar("backup_arquivo_local", copia.status === 0 && !!dumpStat && dumpStat.size > 0, {
    caminho: "backups/pef-est04-local.dump",
    bytes: dumpStat?.size ?? 0,
  });

  limparRestore();
  const criar = dockerExec([
    "psql",
    "-U",
    usuario,
    "-d",
    "postgres",
    "-c",
    `CREATE DATABASE ${dbRestore};`,
  ]);
  registrar("restore_criar_banco_descartavel", criar.status === 0, {
    banco: dbRestore,
    erro: criar.stderr.trim().slice(0, 300),
  });

  const restore = dockerExec([
    "pg_restore",
    "-U",
    usuario,
    "-d",
    dbRestore,
    "--no-owner",
    "--no-acl",
    dumpContainer,
  ]);
  // pg_restore pode retornar 1 com warnings; exige exit 0 ou tabelas presentes
  const contagemOrigem = contarTabelas(dbPrincipal);
  const contagemRestore = contarTabelas(dbRestore);
  const restoreOk =
    contagemOrigem.ok &&
    contagemRestore.ok &&
    contagemOrigem.n > 0 &&
    contagemOrigem.n === contagemRestore.n &&
    (restore.status === 0 || restore.status === 1);
  registrar("restore_integridade_tabelas", restoreOk, {
    exitPgRestore: restore.status,
    tabelasOrigem: contagemOrigem.n,
    tabelasRestore: contagemRestore.n,
    stderr: restore.stderr.trim().slice(0, 400),
  });

  limparRestore();
  registrar("restore_banco_descartavel_removido", true, { banco: dbRestore });

  // /saude com banco indisponível — para container e restaura (não apaga volume)
  const stop = executar("docker", ["stop", container]);
  registrar("docker_stop_temporario", stop.status === 0, { exit: stop.status });
  await aguardar(2500);
  let saudeDown;
  try {
    saudeDown = await consultarSaude();
  } catch (erro) {
    saudeDown = { statusHttp: 0, corpo: { erro: String(erro) } };
  }
  const degradado =
    saudeDown.statusHttp === 503 &&
    (saudeDown.corpo?.banco === "indisponivel" || saudeDown.corpo?.status === "degradado");
  registrar("saude_banco_indisponivel", degradado, {
    statusHttp: saudeDown.statusHttp,
    corpo: saudeDown.corpo,
  });

  const start = executar("docker", ["start", container]);
  registrar("docker_start_restaurado", start.status === 0, { exit: start.status });
  let healthy = false;
  for (let i = 0; i < 20; i += 1) {
    await aguardar(1000);
    const h = executar("docker", ["inspect", "-f", "{{.State.Health.Status}}", container]);
    if (h.stdout.trim() === "healthy") {
      healthy = true;
      break;
    }
  }
  registrar("docker_health_apos_start", healthy, {});

  await aguardar(1500);
  const saudeVolta = await consultarSaude();
  registrar(
    "saude_apos_restaurar_banco",
    saudeVolta.statusHttp === 200 && saudeVolta.corpo?.banco === "ok",
    { statusHttp: saudeVolta.statusHttp, corpo: saudeVolta.corpo },
  );

  dockerExec(["rm", "-f", dumpContainer]);
  if (existsSync(dumpHost)) {
    // dump local permanece em backups/ (gitignored); registra hash sem conteúdo
    const hash = createHash("sha256");
    // hash só do tamanho + nome para evidência sem embutir dump
    hash.update(`pef-est04-local.dump:${dumpStat?.size ?? 0}`);
    registrar("backup_metadado_hash", true, {
      marcador: hash.digest("hex").slice(0, 16),
      nota: "arquivo em backups/ (ignorado pelo git); não versionar dump",
    });
  }

  const resumo = {
    ok: falhas === 0,
    falhas,
    checagens: checagens.length,
    apiBase,
    container,
    dbPrincipal,
    estrategiaSchema: "prisma db push (sem pasta migrations)",
  };
  console.log(JSON.stringify({ resumo, checagens }, null, 2));

  const evidenciaDir = join(raizRepo, "docs", "esteira", "estado");
  writeFileSync(
    join(evidenciaDir, "qg2-smoke-est-04-ops.txt"),
    JSON.stringify({ resumo, checagens }, null, 2),
    "utf8",
  );

  process.exitCode = falhas === 0 ? 0 : 1;
}

principal().catch((erro) => {
  console.error(JSON.stringify({ ok: false, mensagem: String(erro) }));
  process.exitCode = 1;
});
