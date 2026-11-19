/** Smoke EF-04: resumo Laurinha (experiências, categorias, estrelas, observações). */
import {
  garantirResponsavelDesenvolvimento,
  resolverPessoa,
  IDS_SEED,
} from "./lib-authz-smoke.mjs";
import { randomUUID } from "node:crypto";

const base = process.env.API_URL ?? "http://localhost:3001";
const emailAdmin = process.env.PEF_ADMIN_EMAIL ?? "admin@pef.local";
const senhaAdmin = process.env.PEF_ADMIN_SENHA ?? "admin-local";

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

  const laurinha = await resolverPessoa(base, h, familiaId, {
    idSeed: IDS_SEED.laurinha,
    nome: "Laurinha",
  });
  const vovo = await resolverPessoa(base, h, familiaId, {
    idSeed: IDS_SEED.vovo,
    nome: "Vovó",
  });

  await garantirResponsavelDesenvolvimento(
    base,
    h,
    familiaId,
    admin.usuario.id,
    laurinha.id,
  );

  const hoje = new Date().toISOString().slice(0, 10);
  const obsTexto = `EF04 obs ${Date.now()}`;

  const personalizada = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/desafios`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        nome: `EF04 sem categoria ${Date.now()}`,
        dificuldade: "simples",
      }),
    }),
  );
  reg(
    "desafio-personalizado-sem-categoria",
    personalizada.status < 300 &&
      (personalizada.corpo?.categoria == null ||
        personalizada.corpo?.categoria === ""),
    {
      status: personalizada.status,
      id: personalizada.corpo?.id,
      categoria: personalizada.corpo?.categoria,
    },
  );

  const partPers = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/participacoes`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        desafioId: personalizada.corpo?.id,
        resultado: "concluiu",
        observacao: obsTexto,
        execucaoChave: `smoke-ef04-pers-${randomUUID()}`,
      }),
    }),
  );
  reg("participacao-personalizada", partPers.status < 300, {
    status: partPers.status,
    estrelas: partPers.corpo?.estrelasConcedidas,
  });

  const catalogo = await json(
    await fetch(
      `${base}/pessoas/${laurinha.id}/desafios?disponibilidade=explorar`,
      { headers: h },
    ),
  );
  const comCategoria = (catalogo.corpo?.desafios ?? []).find(
    (d) => typeof d.categoria === "string" && d.categoria.trim().length > 0,
  );
  if (comCategoria?.id) {
    const partCat = await json(
      await fetch(`${base}/pessoas/${laurinha.id}/participacoes`, {
        method: "POST",
        headers: h,
        body: JSON.stringify({
          desafioId: comCategoria.id,
          resultado: "participou",
          execucaoChave: `smoke-ef04-cat-${randomUUID()}`,
        }),
      }),
    );
    reg("participacao-com-categoria", partCat.status < 300, {
      status: partCat.status,
      categoria: comCategoria.categoria,
    });
  } else {
    reg("participacao-com-categoria", false, "sem desafio com categoria");
  }

  const resumo = await json(
    await fetch(
      `${base}/pessoas/${laurinha.id}/resumo-desenvolvimento?de=${hoje}&ate=${hoje}`,
      { headers: h },
    ),
  );
  const corpo = resumo.corpo;
  const naoClassificada = (corpo?.experiencias ?? []).some(
    (e) => e.categoria === "nao_classificada",
  );
  const temObs = (corpo?.observacoes ?? []).some((o) => o.texto === obsTexto);
  const esclarecimento = String(corpo?.estrelas?.esclarecimento ?? "").toLowerCase();
  reg(
    "resumo-experiencias-categorias-estrelas-obs",
    resumo.status < 300 &&
      corpo?.tipo === "desenvolvimento" &&
      Array.isArray(corpo?.experiencias) &&
      corpo.experiencias.length >= 2 &&
      naoClassificada &&
      (corpo?.categoriasExploradas ?? []).some(
        (c) => c.categoria === "nao_classificada",
      ) &&
      typeof corpo?.estrelas?.concedidasNoPeriodo === "number" &&
      corpo.estrelas.concedidasNoPeriodo > 0 &&
      esclarecimento.includes("não medem") &&
      corpo?.inferenciaClinica === false &&
      corpo?.ranking === false &&
      temObs,
    {
      status: resumo.status,
      totalExp: corpo?.experiencias?.length,
      categorias: corpo?.categoriasExploradas,
      estrelas: corpo?.estrelas,
      observacoes: corpo?.observacoes?.length,
    },
  );

  const perfil = await json(
    await fetch(`${base}/familias/${familiaId}/pessoas/${laurinha.id}`, {
      headers: h,
    }),
  );
  const areaResumo = perfil.corpo?.areas?.find((a) => a.id === "resumo");
  reg(
    "perfil-area-resumo-disponivel",
    areaResumo?.disponivel === true,
    areaResumo,
  );

  const negadoVovo = await json(
    await fetch(
      `${base}/pessoas/${vovo.id}/resumo-desenvolvimento?de=${hoje}&ate=${hoje}`,
      { headers: h },
    ),
  );
  reg(
    "resumo-dev-negado-sem-auth-desenvolvimento",
    negadoVovo.status === 403,
    { status: negadoVovo.status },
  );

  const ok = resultados.every((r) => r.ok);
  console.log(JSON.stringify({ ok, resultados }, null, 2));
  process.exitCode = ok ? 0 : 1;
} catch (e) {
  console.error(e);
  console.log(
    JSON.stringify({ ok: false, resultados, erro: String(e) }, null, 2),
  );
  process.exitCode = 1;
}
