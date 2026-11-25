#!/usr/bin/env node
// SessionStart: resume a demanda ativa. Informativo — nunca impede a sessão.
import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const curto = (v, n = 240) => {
  const s = String(v ?? "—").replace(/\s+/g, " ");
  return s.length <= n ? s : `${s.slice(0, n)}…`;
};

try {
  const cfg = join(raiz, "esteira.config.json");
  if (!existsSync(cfg)) {
    console.log("Esteira: adaptador ausente — rode /configurar-esteira.");
  } else {
    const caminho = JSON.parse(readFileSync(cfg, "utf8")).estado;
    const estado = JSON.parse(readFileSync(join(raiz, caminho), "utf8"));
    const d = estado.demanda;
    console.log(`Esteira — estado em ${caminho}`);
    if (d) {
      const arquivos = d.arquivos ?? [];
      const extra = arquivos.length > 8 ? ` (+${arquivos.length - 8})` : "";
      console.log(`Demanda ativa: ${curto(d.id)} | tipo: ${curto(d.tipo)} | estado: ${curto(d.estado)}`);
      console.log(`Próxima ação: ${curto(d.proximaAcao)}`);
      console.log(`Arquivos: ${curto(arquivos.slice(0, 8).join(", "), 500)}${extra}`);
    } else {
      console.log(`Sem demanda ativa. Próxima ação: ${curto(estado.proximaAcao)}`);
    }
    console.log("Retomada: reconciliar com `git status` e o fingerprint; se divergirem, revalidar antes de continuar.");
  }
} catch (erro) {
  console.log(`Esteira: estado ilegível (${curto(erro.message, 120)}) — conferir antes de continuar.`);
}
