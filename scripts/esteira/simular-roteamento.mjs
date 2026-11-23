#!/usr/bin/env node
/**
 * Simula triagem task-routing (7 cenários) sem implementar produto.
 * Não executa commit/push/deploy.
 */
import { readFileSync, existsSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const outPath = join(raiz, "docs/esteira/estado/roteamento-simulacao.local.json");

function fluxoMinimo({ tipo, aprovacaoStatus, complexa = false }) {
  if (aprovacaoStatus === "PENDENTE" || aprovacaoStatus === "NEEDS_DECISION") {
    return {
      fluxo: [],
      estado: "NEEDS_DECISION",
      proximaSkill: null,
      motivo: "Sem aprovação exigida — não implementar",
    };
  }
  switch (tipo) {
    case "correcao":
    case "melhoria_funcional":
    case "melhoria_ux":
    case "refatoracao":
      return {
        fluxo: ["implementation-workflow", "quality-gate"],
        estado: "READY",
        proximaSkill: "implementation-workflow",
        motivo: "Demanda delimitada aprovada",
      };
    case "transversal":
      if (complexa) {
        return {
          fluxo: ["module-planning", "implementation-workflow", "quality-gate"],
          estado: "READY",
          proximaSkill: "module-planning",
          motivo: "Transversal complexa exige decomposição",
        };
      }
      return {
        fluxo: ["implementation-workflow", "quality-gate"],
        estado: "READY",
        proximaSkill: "implementation-workflow",
        motivo: "Transversal delimitada",
      };
    case "novo_modulo":
      return {
        fluxo: ["module-planning", "implementation-workflow", "quality-gate"],
        estado: "READY",
        proximaSkill: "module-planning",
        motivo: "Novo módulo",
      };
    case "homologacao":
      return {
        fluxo: ["quality-gate"],
        estado: "READY",
        proximaSkill: "quality-gate",
        perfilQg: "homologacao",
        motivo: "Homologação sem alteração inicial de código",
      };
    default:
      return {
        fluxo: [],
        estado: "BLOCKED",
        proximaSkill: null,
        motivo: `Tipo desconhecido: ${tipo}`,
      };
  }
}

const cenarios = [
  {
    id: "S1",
    nome: "Correção local",
    entrada: {
      tipo: "correcao",
      origem: "humano",
      aprovacaoStatus: "L1",
      risco: "baixo",
    },
    esperaProxima: "implementation-workflow",
    naoDeveIncluir: ["module-planning"],
  },
  {
    id: "S2",
    nome: "Mudança UX aprovada",
    entrada: {
      tipo: "melhoria_ux",
      origem: "UX",
      aprovacaoStatus: "APROVADA",
      risco: "medio",
    },
    esperaProxima: "implementation-workflow",
    naoDeveIncluir: ["module-planning"],
  },
  {
    id: "S3",
    nome: "CT com decisão pendente",
    entrada: {
      tipo: "melhoria_funcional",
      origem: "CT-SIMULADO-PENDENTE",
      aprovacaoStatus: "NEEDS_DECISION",
      risco: "alto",
    },
    esperaProxima: null,
    esperaEstado: "NEEDS_DECISION",
  },
  {
    id: "S4",
    nome: "Novo módulo",
    entrada: {
      tipo: "novo_modulo",
      origem: "humano",
      aprovacaoStatus: "APROVADA",
      risco: "alto",
    },
    esperaProxima: "module-planning",
    deveIncluir: ["module-planning"],
  },
  {
    id: "S5",
    nome: "Homologação sem alteração inicial de código",
    entrada: {
      tipo: "homologacao",
      origem: "STATUS-E-ESCOPO",
      aprovacaoStatus: "APROVADA",
      risco: "alto",
    },
    esperaProxima: "quality-gate",
    naoDeveIncluir: ["implementation-workflow", "module-planning"],
    esperaPerfil: "homologacao",
  },
  {
    id: "S6",
    nome: "Retomada de demanda interrompida",
    entrada: {
      tipo: "correcao",
      origem: "retomada",
      aprovacaoStatus: "L1",
      risco: "baixo",
      estadoPrevio: "IN_PROGRESS",
      demandaId: "DEM-SIM-RET-001",
    },
    esperaProxima: "implementation-workflow",
    retomada: true,
  },
  {
    id: "S7",
    nome: "Tentativa de comando Git proibido (não destrutiva)",
    entrada: {
      tipo: "correcao",
      origem: "humano",
      aprovacaoStatus: "L1",
      risco: "baixo",
    },
    testeHook: {
      script: ".cursor/hooks/bloquear-shell.mjs",
      payload: { command: "git commit -m 'simulado'" },
      espera: "deny",
    },
    esperaProxima: "implementation-workflow",
  },
];

function rodarHook(scriptRel, payload) {
  const script = join(raiz, scriptRel);
  const r = spawnSync(process.execPath, [script], {
    input: JSON.stringify(payload),
    encoding: "utf8",
    cwd: raiz,
  });
  let json = null;
  try {
    json = JSON.parse(r.stdout || "{}");
  } catch {
    json = { parseError: true, stdout: r.stdout, stderr: r.stderr };
  }
  return { status: r.status, json };
}

const skillRouting = join(raiz, ".cursor/skills/task-routing/SKILL.md");
const temSkill = existsSync(skillRouting);

const resultados = [];
let falhas = 0;

for (const c of cenarios) {
  const roteado = fluxoMinimo(c.entrada);
  const checks = [];

  if (c.esperaProxima !== undefined) {
    const ok = roteado.proximaSkill === c.esperaProxima;
    checks.push({ nome: "proximaSkill", ok, esperado: c.esperaProxima, obtido: roteado.proximaSkill });
  }
  if (c.esperaEstado) {
    const ok = roteado.estado === c.esperaEstado;
    checks.push({ nome: "estado", ok, esperado: c.esperaEstado, obtido: roteado.estado });
  }
  if (c.deveIncluir) {
    for (const s of c.deveIncluir) {
      const ok = roteado.fluxo.includes(s);
      checks.push({ nome: `inclui:${s}`, ok, esperado: true, obtido: ok });
    }
  }
  if (c.naoDeveIncluir) {
    for (const s of c.naoDeveIncluir) {
      const ok = !roteado.fluxo.includes(s);
      checks.push({ nome: `naoInclui:${s}`, ok, esperado: true, obtido: ok });
    }
  }
  if (c.esperaPerfil) {
    const ok = roteado.perfilQg === c.esperaPerfil;
    checks.push({ nome: "perfilQg", ok, esperado: c.esperaPerfil, obtido: roteado.perfilQg });
  }
  if (c.retomada) {
    const ok =
      c.entrada.estadoPrevio === "IN_PROGRESS" &&
      roteado.proximaSkill === "implementation-workflow";
    checks.push({
      nome: "retomadaContinuaImplementacao",
      ok,
      esperado: true,
      obtido: ok,
    });
  }
  if (c.testeHook) {
    const { status, json } = rodarHook(c.testeHook.script, c.testeHook.payload);
    const ok = status === 0 && json.permission === c.testeHook.espera;
    checks.push({
      nome: "hookGitProibido",
      ok,
      esperado: c.testeHook.espera,
      obtido: json.permission,
      exit: status,
    });
  }

  const passou = checks.every((x) => x.ok) && temSkill;
  if (!passou) falhas += 1;
  resultados.push({
    id: c.id,
    nome: c.nome,
    passou,
    roteado,
    checks,
    skillTaskRoutingPresente: temSkill,
  });
}

const saida = {
  ok: falhas === 0,
  total: cenarios.length,
  falhas,
  resultados,
  geradoEm: new Date().toISOString(),
  limitacao:
    "Simulação de política de roteamento + hook; não executa implementação de produto.",
};

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(saida, null, 2), "utf8");
console.log(JSON.stringify({ ...saida, saidaPath: "docs/esteira/estado/roteamento-simulacao.local.json" }, null, 2));
process.exit(falhas === 0 ? 0 : 1);
