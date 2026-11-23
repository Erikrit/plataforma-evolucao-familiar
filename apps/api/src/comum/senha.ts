import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export function gerarHashSenha(senha: string): string {
  const sal = randomBytes(16).toString("hex");
  const hash = scryptSync(senha, sal, 64).toString("hex");
  return `${sal}:${hash}`;
}

export function verificarSenha(senha: string, senhaHash: string): boolean {
  const [sal, hashEsperado] = senhaHash.split(":");
  if (!sal || !hashEsperado) return false;
  const hashAtual = scryptSync(senha, sal, 64).toString("hex");
  const a = Buffer.from(hashEsperado, "hex");
  const b = Buffer.from(hashAtual, "hex");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
