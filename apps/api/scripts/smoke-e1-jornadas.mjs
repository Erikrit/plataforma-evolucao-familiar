/**
 * Smoke E1-ACE-08: jornadas módulos 01–04 em duas famílias com login contextual.
 * Não depende do seed legado; provisiona famílias fictícias.
 */
import { randomUUID } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { provisionarFamiliaComAdmin } from "./lib-provisionar-familia.mjs";
import {
  garantirResponsavelCuidados,
  garantirResponsavelDesenvolvimento,
  json,
} from "./lib-authz-smoke.mjs";

const base = process.env.API_URL ?? "http://localhost:3001";
const prisma = new PrismaClient();
const stamp = Date.now();
const resultados = [];
const reg = (nome, ok, detalhe) => resultados.push({ nome, ok, detalhe });

async function login(email, senha, familiaSlug) {
  const r = await json(
    await fetch(`${base}/sessoes`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, senha, familiaSlug }),
    }),
  );
  if (r.status >= 300) {
    throw new Error(`login ${familiaSlug}: ${JSON.stringify(r.corpo)}`);
  }
  return r.corpo;
}

function headers(token) {
  return {
    "content-type": "application/json",
    "x-sessao-token": token,
  };
}

function isoDia(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

async function jornadaFamilia({ slug, email, senha, nomePessoaCuidado, nomePessoaDev }) {
  const sess = await login(email, senha, slug);
  const h = headers(sess.token);
  const familiaId = sess.usuario.pessoa.familiaId;
  const usuarioId = sess.usuario.id;
  const prefixo = `jornada-${slug}`;

  const inicio = await json(
    await fetch(`${base}/familias/${familiaId}/inicio`, { headers: h }),
  );
  const dest = String(inicio.corpo?.destinoEntrada ?? "");
  const hrefsOk = (inicio.corpo?.contextos ?? []).every((c) =>
    String(c.href).startsWith(`/f/${slug}`),
  );
  reg(`${prefixo}-m01-inicio-slug`, inicio.status < 300 && hrefsOk && dest.startsWith(`/f/${slug}`), {
    destino: dest,
    familiaSlug: inicio.corpo?.familiaSlug,
  });

  const pessoaCuidado = await json(
    await fetch(`${base}/familias/${familiaId}/pessoas`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({ nome: nomePessoaCuidado }),
    }),
  );
  const pessoaDev = await json(
    await fetch(`${base}/familias/${familiaId}/pessoas`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({ nome: nomePessoaDev }),
    }),
  );
  reg(
    `${prefixo}-m01-pessoas`,
    pessoaCuidado.status < 300 && pessoaDev.status < 300,
    { cuidado: pessoaCuidado.corpo?.id, dev: pessoaDev.corpo?.id },
  );
  const idCuidado = pessoaCuidado.corpo.id;
  const idDev = pessoaDev.corpo.id;

  await garantirResponsavelCuidados(base, h, familiaId, usuarioId, idCuidado);
  await garantirResponsavelDesenvolvimento(base, h, familiaId, usuarioId, idDev);

  const acessos = await json(
    await fetch(`${base}/familias/${familiaId}/acessos`, { headers: h }),
  );
  reg(`${prefixo}-m01-acessos`, acessos.status < 300, { status: acessos.status });

  const med = await json(
    await fetch(`${base}/pessoas/${idCuidado}/medicamentos`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        nome: `Med ${slug} ${stamp}`,
        horarios: ["08:00"],
        ativar: true,
      }),
    }),
  );
  reg(`${prefixo}-m02-medicamento`, med.status < 300 && !!med.corpo?.id, {
    id: med.corpo?.id,
  });

  const hoje = isoDia();
  const dose = await json(
    await fetch(`${base}/medicamentos/${med.corpo.id}/doses/registros`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        data: hoje,
        horario: "08:00",
        situacao: "tomou_conforme_informacao",
      }),
    }),
  );
  reg(`${prefixo}-m02-dose`, dose.status < 300, { status: dose.status });

  const rotina = await json(
    await fetch(`${base}/pessoas/${idCuidado}/cuidados/hoje`, { headers: h }),
  );
  reg(`${prefixo}-m02-rotina`, rotina.status < 300, { status: rotina.status });

  const consulta = await json(
    await fetch(`${base}/pessoas/${idCuidado}/consultas`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        categoria: "clinica_geral",
        especialidadeOuDescricao: `Consulta ${slug}`,
        dataHora: new Date().toISOString(),
      }),
    }),
  );
  reg(`${prefixo}-m02-consulta`, consulta.status < 300, {
    status: consulta.status,
  });

  const desafio = await json(
    await fetch(`${base}/pessoas/${idDev}/desafios`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        nome: `Desafio ${slug} ${stamp}`,
        dificuldade: "simples",
      }),
    }),
  );
  const desafioId = desafio.corpo?.id;
  reg(`${prefixo}-m03-desafio`, desafio.status < 300 && !!desafioId, {
    id: desafioId,
  });

  const part = await json(
    await fetch(`${base}/pessoas/${idDev}/participacoes`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        desafioId,
        resultado: "concluiu",
        execucaoChave: `e1-jornada-${slug}-${randomUUID()}`,
      }),
    }),
  );
  reg(`${prefixo}-m03-participacao`, part.status < 300, { status: part.status });

  const recompensa = await json(
    await fetch(`${base}/pessoas/${idDev}/recompensas`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        nome: `Recompensa ${slug}`,
        custo: 1,
      }),
    }),
  );
  reg(`${prefixo}-m03-recompensa`, recompensa.status < 300, {
    id: recompensa.corpo?.id,
  });

  const de = encodeURIComponent(new Date(0).toISOString());
  const ate = encodeURIComponent(new Date().toISOString());
  const historico = await json(
    await fetch(`${base}/pessoas/${idCuidado}/historico?de=${de}&ate=${ate}`, {
      headers: h,
    }),
  );
  reg(`${prefixo}-m04-historico`, historico.status < 300, {
    status: historico.status,
  });

  const resumo = await json(
    await fetch(
      `${base}/pessoas/${idCuidado}/resumo-cuidados?de=${hoje}&ate=${hoje}`,
      { headers: h },
    ),
  );
  reg(`${prefixo}-m04-resumo`, resumo.status < 300, { status: resumo.status });

  const previa = await json(
    await fetch(
      `${base}/pessoas/${idCuidado}/resumo-previa?de=${hoje}&ate=${hoje}`,
      { headers: h },
    ),
  );
  reg(`${prefixo}-m04-previa`, previa.status < 300, { status: previa.status });

  const pdf = await json(
    await fetch(
      `${base}/pessoas/${idCuidado}/relatorio.pdf?de=${hoje}&ate=${hoje}`,
      { headers: h },
    ),
  );
  reg(`${prefixo}-m04-pdf`, pdf.status < 300, { status: pdf.status });

  return {
    sess,
    h,
    familiaId,
    idCuidado,
    idDev,
    slug,
  };
}

try {
  const slugA = `jog-a-${stamp}`;
  const slugB = `jog-b-${stamp}`;
  const emailA = `jog.a.${stamp}@pef.local`;
  const emailB = `jog.b.${stamp}@pef.local`;
  const senhaA = `jog-a-${stamp}-segura`;
  const senhaB = `jog-b-${stamp}-segura`;

  await provisionarFamiliaComAdmin(prisma, {
    nomeFamilia: `Jornada A ${stamp}`,
    slug: slugA,
    nomeAdmin: `Admin Jornada A ${stamp}`,
    emailAdmin: emailA,
    senhaAdmin: senhaA,
  });
  await provisionarFamiliaComAdmin(prisma, {
    nomeFamilia: `Jornada B ${stamp}`,
    slug: slugB,
    nomeAdmin: `Admin Jornada B ${stamp}`,
    emailAdmin: emailB,
    senhaAdmin: senhaB,
  });

  const famA = await jornadaFamilia({
    slug: slugA,
    email: emailA,
    senha: senhaA,
    nomePessoaCuidado: `Cuidado A ${stamp}`,
    nomePessoaDev: `Dev A ${stamp}`,
  });
  const famB = await jornadaFamilia({
    slug: slugB,
    email: emailB,
    senha: senhaB,
    nomePessoaCuidado: `Cuidado B ${stamp}`,
    nomePessoaDev: `Dev B ${stamp}`,
  });

  const cruzLogin = await json(
    await fetch(`${base}/sessoes`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: emailA,
        senha: senhaA,
        familiaSlug: slugB,
      }),
    }),
  );
  reg("E1-ACE-08-login-A-em-B", cruzLogin.status === 401, {
    status: cruzLogin.status,
  });

  const cruzRotina = await json(
    await fetch(`${base}/pessoas/${famB.idCuidado}/cuidados/hoje`, {
      headers: famA.h,
    }),
  );
  reg("E1-ACE-08-rotina-B-com-sessao-A", cruzRotina.status === 404, {
    status: cruzRotina.status,
  });

  const cruzDev = await json(
    await fetch(`${base}/pessoas/${famB.idDev}/desafios`, {
      headers: famA.h,
    }),
  );
  reg("E1-ACE-08-desafios-B-com-sessao-A", cruzDev.status === 404, {
    status: cruzDev.status,
  });

  const cruzFam = await json(
    await fetch(`${base}/familias/${famB.familiaId}/pessoas`, {
      headers: famA.h,
    }),
  );
  reg("E1-ACE-08-familiaId-B-com-sessao-A", cruzFam.status === 403, {
    status: cruzFam.status,
  });

  const ok = resultados.every((r) => r.ok);
  console.log(JSON.stringify({ ok, resultados }, null, 2));
  process.exit(ok ? 0 : 1);
} catch (erro) {
  console.error(erro);
  console.log(
    JSON.stringify(
      {
        ok: false,
        erro: erro instanceof Error ? erro.message : String(erro),
        resultados,
      },
      null,
      2,
    ),
  );
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
