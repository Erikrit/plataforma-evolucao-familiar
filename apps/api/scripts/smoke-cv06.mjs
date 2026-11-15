/** Smoke CV-06: resumo/PDF, lembretes derivados; ACE-C11 estrutural; ACE-C12 PENDING. */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { garantirResponsavelCuidados, resolverPessoa, IDS_SEED } from "./lib-authz-smoke.mjs";

const base = process.env.API_URL ?? "http://localhost:3001";
const emailAdmin = process.env.PEF_ADMIN_EMAIL ?? "admin@pef.local";
const senhaAdmin = process.env.PEF_ADMIN_SENHA ?? "admin-local";
const raiz = join(dirname(fileURLToPath(import.meta.url)), "../../..");

async function json(r) {
  const t = await r.text();
  try {
    return { status: r.status, corpo: JSON.parse(t) };
  } catch {
    return { status: r.status, corpo: t };
  }
}

async function login(email, senha) {
  const r = await fetch(`${base}/sessoes`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });
  const d = await json(r);
  if (r.status >= 300) throw new Error(`login: ${JSON.stringify(d.corpo)}`);
  return d.corpo;
}

const resultados = [];
const reg = (nome, ok, detalhe) => resultados.push({ nome, ok, detalhe });

try {
  const admin = await login(emailAdmin, senhaAdmin);
  const familiaId = admin.usuario.pessoa.familiaId;
  const h = {
    "content-type": "application/json",
    "x-sessao-token": admin.token,
  };

  const vovo = await resolverPessoa(base, h, familiaId, {
    idSeed: IDS_SEED.vovo,
    nome: "Vovó",
  });

  await garantirResponsavelCuidados(
    base,
    h,
    familiaId,
    admin.usuario.id,
    vovo.id,
  );

  const de = new Date(Date.now() - 7 * 864e5).toISOString();
  const ate = new Date().toISOString();

  const resumo = await json(
    await fetch(
      `${base}/pessoas/${vovo.id}/resumo-cuidados?de=${encodeURIComponent(de)}&ate=${encodeURIComponent(ate)}`,
      { headers: h },
    ),
  );
  reg(
    "resumo-previa",
    resumo.status < 300 && resumo.corpo?.inferenciaClinica === false,
    resumo.corpo?.doses,
  );

  const pdf = await json(
    await fetch(
      `${base}/pessoas/${vovo.id}/relatorio.pdf?de=${encodeURIComponent(de)}&ate=${encodeURIComponent(ate)}`,
      { headers: h },
    ),
  );
  reg(
    "pdf-sob-demanda",
    pdf.status < 300 && !!pdf.corpo?.pdfBase64 && pdf.corpo?.mimeTipo === "application/pdf",
    { mime: pdf.corpo?.mimeTipo },
  );

  const lembretes = await json(
    await fetch(`${base}/pessoas/${vovo.id}/lembretes`, { headers: h }),
  );
  reg(
    "lembretes-derivados",
    lembretes.status < 300 &&
      lembretes.corpo?.canalUnicoSeguranca === false &&
      lembretes.corpo?.limitacoesDispositivosReais === true,
    lembretes.corpo?.notaAceC12,
  );
  reg(
    "ACE-C12-pending-documentado",
    Boolean(lembretes.corpo?.notaAceC12),
    { statusAceite: "PENDING", nota: lembretes.corpo?.notaAceC12 },
  );

  const css = readFileSync(
    join(raiz, "apps/web/src/app/globals.css"),
    "utf8",
  );
  const pagina = readFileSync(
    join(raiz, "apps/web/src/app/pessoas/[pessoaId]/cuidados/page.tsx"),
    "utf8",
  );
  reg(
    "ACE-C11-mobile-estrutural",
    css.includes("cuidados-mobile") &&
      css.includes("@media (max-width: 480px)") &&
      pagina.includes("confirmaAoTocar") &&
      // UX-09: Drawer acessível substitui o painel-confirmacao legado
      (pagina.includes("Drawer") || pagina.includes("painel-confirmacao")),
    {
      cssOk: css.includes("cuidados-mobile"),
      relato:
        pagina.includes("Drawer")
          ? "Drawer"
          : pagina.includes("painel-confirmacao")
            ? "painel-confirmacao"
            : null,
    },
  );

  const falhou = resultados.some((r) => !r.ok);
  console.log(JSON.stringify({ ok: !falhou, resultados }, null, 2));
  if (falhou) process.exitCode = 1;
} catch (erro) {
  console.error(JSON.stringify({ ok: false, erro: String(erro) }));
  process.exitCode = 1;
}
