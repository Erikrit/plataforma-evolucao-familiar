/**
 * Smoke SA: riscos críticos de autenticação/autorização.
 * Dados fictícios apenas.
 */
import { createHash } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import {
  garantirResponsavelCuidados,
  json,
  login,
  resolverPessoa,
  IDS_SEED,
} from "./lib-authz-smoke.mjs";

const base = process.env.API_URL ?? "http://localhost:3001";
const emailAdmin = process.env.PEF_ADMIN_EMAIL ?? "admin@pef.local";
const senhaAdmin = process.env.PEF_ADMIN_SENHA ?? "admin-local";
const prisma = new PrismaClient();

const resultados = [];
const reg = (nome, ok, detalhe) => resultados.push({ nome, ok, detalhe });

try {
  const admin = await login(base, emailAdmin, senhaAdmin);
  const familiaId = admin.usuario.pessoa.familiaId;
  const h = {
    "content-type": "application/json",
    "x-sessao-token": admin.token,
  };

  const vovo = await resolverPessoa(base, h, familiaId, {
    idSeed: IDS_SEED.vovo,
    nome: "Vovó",
  });
  const laurinha = await resolverPessoa(base, h, familiaId, {
    idSeed: IDS_SEED.laurinha,
    nome: "Laurinha",
  });

  // Isola o cenário "admin puro": remove autorizações clínicas residuais de runs anteriores.
  const clinicasResiduais = await prisma.autorizacao.findMany({
    where: {
      familiaId,
      usuarioId: admin.usuario.id,
      ativa: true,
      responsabilidade: {
        in: ["responsavel_cuidados", "colaboradora_cuidados"],
      },
    },
  });
  for (const a of clinicasResiduais) {
    await prisma.autorizacao.update({
      where: { id: a.id },
      data: { ativa: false, revogadaEm: new Date() },
    });
  }

  // --- Admin puro: negado em clínico da Vovó e Laurinha ---
  const adminNegadoRotina = await json(
    await fetch(`${base}/pessoas/${vovo.id}/cuidados/hoje`, { headers: h }),
  );
  reg("admin-puro-negado-rotina-vovo", adminNegadoRotina.status === 403, {
    status: adminNegadoRotina.status,
  });

  const adminNegadoLaurinha = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/cuidados/hoje`, { headers: h }),
  );
  reg("admin-puro-negado-rotina-laurinha", adminNegadoLaurinha.status === 403, {
    status: adminNegadoLaurinha.status,
  });

  const adminNegadoPdf = await json(
    await fetch(
      `${base}/pessoas/${vovo.id}/relatorio.pdf?de=${encodeURIComponent(new Date(0).toISOString())}&ate=${encodeURIComponent(new Date().toISOString())}`,
      { headers: h },
    ),
  );
  reg("admin-puro-negado-pdf", adminNegadoPdf.status === 403, {
    status: adminNegadoPdf.status,
  });

  const perfilAdmin = await json(
    await fetch(`${base}/familias/${familiaId}/pessoas/${vovo.id}`, {
      headers: h,
    }),
  );
  const areaCuidados = (perfilAdmin.corpo?.areas ?? []).find(
    (a) => a.id === "cuidados",
  );
  reg(
    "admin-puro-area-cuidados-indisponivel",
    perfilAdmin.status < 300 && areaCuidados?.disponivel === false,
    areaCuidados,
  );

  // --- Concessão explícita: admin + responsavel_cuidados na Vovó ---
  await garantirResponsavelCuidados(
    base,
    h,
    familiaId,
    admin.usuario.id,
    vovo.id,
  );

  const adminOkRotina = await json(
    await fetch(`${base}/pessoas/${vovo.id}/cuidados/hoje`, { headers: h }),
  );
  reg("admin-com-cuidados-ok-vovo", adminOkRotina.status < 300, {
    status: adminOkRotina.status,
  });

  const aindaNegadoLaurinha = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/cuidados/hoje`, { headers: h }),
  );
  reg(
    "admin-com-cuidados-vovo-ainda-negado-laurinha",
    aindaNegadoLaurinha.status === 403,
    { status: aindaNegadoLaurinha.status },
  );

  const med = await json(
    await fetch(`${base}/pessoas/${vovo.id}/medicamentos`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        nome: `Med-Authz-${Date.now()}`,
        horarios: ["08:00"],
        ativar: true,
      }),
    }),
  );
  reg("admin-com-cuidados-cria-med", med.status < 300, { id: med.corpo?.id });

  const anexo = await json(
    await fetch(`${base}/familias/${familiaId}/anexos`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        pessoaId: vovo.id,
        nomeArquivo: "receita-ficticia.pdf",
        mimeTipo: "application/pdf",
        conteudoBase64: Buffer.from("%PDF-fake").toString("base64"),
      }),
    }),
  );
  reg("anexo-criado", anexo.status < 300, { id: anexo.corpo?.id });

  // --- Colaboradora: só Vovó; sem Laurinha; sem anexos; sem programação ---
  const email = `colab.authz.${Date.now()}@pef.local`;
  const convite = await json(
    await fetch(`${base}/familias/${familiaId}/convites`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        email,
        nomeConvidado: "Colaboradora Authz",
        responsabilidade: "colaboradora_cuidados",
        pessoaAlvoId: vovo.id,
      }),
    }),
  );
  await fetch(`${base}/convites/${convite.corpo.token}/ativar`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ senha: "colab-local", nome: "Colaboradora Authz" }),
  });
  const colab = await login(base, email, "colab-local");
  const hc = {
    "content-type": "application/json",
    "x-sessao-token": colab.token,
  };

  const colabRotina = await json(
    await fetch(`${base}/pessoas/${vovo.id}/cuidados/hoje`, { headers: hc }),
  );
  reg("colab-ok-rotina-vovo", colabRotina.status < 300, {
    status: colabRotina.status,
  });

  const colabLaurinha = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/cuidados/hoje`, { headers: hc }),
  );
  reg("colab-negado-laurinha", colabLaurinha.status === 403, {
    status: colabLaurinha.status,
  });

  const colabAnexo = await json(
    await fetch(`${base}/anexos/${anexo.corpo.id}`, { headers: hc }),
  );
  reg("colab-negado-anexo", colabAnexo.status === 403, {
    status: colabAnexo.status,
  });

  const colabProg = await json(
    await fetch(`${base}/medicamentos/${med.corpo.id}/programacao`, {
      method: "PUT",
      headers: hc,
      body: JSON.stringify({ horarios: ["09:00"] }),
    }),
  );
  reg("colab-negado-programacao", colabProg.status === 403, {
    status: colabProg.status,
  });

  const colabPdf = await json(
    await fetch(
      `${base}/pessoas/${vovo.id}/relatorio.pdf?de=${encodeURIComponent(new Date(0).toISOString())}&ate=${encodeURIComponent(new Date().toISOString())}`,
      { headers: hc },
    ),
  );
  reg("colab-negado-pdf", colabPdf.status === 403, {
    status: colabPdf.status,
  });

  const inicioColab = await json(
    await fetch(`${base}/familias/${familiaId}/inicio`, { headers: hc }),
  );
  const nomes = (inicioColab.corpo?.cartoes ?? []).map((c) => c.nome);
  reg(
    "colab-cartoes-sem-laurinha",
    inicioColab.status < 300 &&
      nomes.includes("Vovó") &&
      !nomes.includes("Laurinha"),
    { nomes },
  );

  // --- Revogação invalida sessão ---
  const authDb = await prisma.autorizacao.findFirst({
    where: {
      usuarioId: colab.usuario.id,
      responsabilidade: "colaboradora_cuidados",
      ativa: true,
    },
  });
  const revogar = await json(
    await fetch(`${base}/familias/${familiaId}/autorizacoes/${authDb.id}`, {
      method: "DELETE",
      headers: h,
    }),
  );
  reg(
    "revogacao-invalida-sessoes",
    revogar.status < 300 &&
      revogar.corpo?.ativa === false &&
      revogar.corpo?.sessoesInvalidadas >= 1,
    revogar.corpo,
  );

  const sessaoMorta = await fetch(`${base}/familias/${familiaId}/inicio`, {
    headers: { "x-sessao-token": colab.token },
  });
  reg("sessao-revogada-401", sessaoMorta.status === 401, {
    status: sessaoMorta.status,
  });

  // --- Token armazenado como hash (coluna token guarda SHA-256) ---
  const hashEsperado = createHash("sha256")
    .update(admin.token, "utf8")
    .digest("hex");
  const sessaoDb = await prisma.sessaoProvisoria.findUnique({
    where: { token: hashEsperado },
  });
  const vazamentoPlain = await prisma.sessaoProvisoria.findUnique({
    where: { token: admin.token },
  });
  reg(
    "token-armazenado-como-hash",
    !!sessaoDb && !vazamentoPlain,
    { hashEncontrado: Boolean(sessaoDb), plainAusente: !vazamentoPlain },
  );

  const me = await json(
    await fetch(`${base}/me`, { headers: h }),
  );
  reg("autenticacao-sessao-mvp", me.corpo?.autenticacao === "sessao_mvp", me.corpo);

  const falhou = resultados.some((r) => !r.ok);
  console.log(JSON.stringify({ ok: !falhou, resultados }, null, 2));
  if (falhou) process.exitCode = 1;
} catch (erro) {
  console.error(
    JSON.stringify({
      ok: false,
      mensagem: erro instanceof Error ? erro.message : String(erro),
      resultados,
    }),
  );
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
