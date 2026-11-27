/**
 * Régua das Atividades Reais, sem banco (M03 §15, linha "Atividade real";
 * DEV-CAT-M1-CONTEUDO, ticket 01).
 *
 * Reprova a ficha incompleta e emite a matriz de cobertura
 * (faixa × área × duração × lugar × pessoas). Só as atividades ativas entram;
 * as arquivadas (D2) ficam de fora. Buracos da matriz não reprovam a ficha; os de área
 * (faixa × área e área) saem também em `buracosDeArea`, que o catálogo zera desde o ticket 02.
 * Qualidade do texto continua com a revisão humana.
 */

/** D1 (2026-11-26): Pequenos 5–6, Médios 7–9, Grandes 10–12. Ids iguais aos das trilhas. */
export const FAIXAS = [
  { id: "pequenos", min: 5, max: 6 },
  { id: "medios", min: 7, max: 9 },
  { id: "grandes", min: 10, max: 12 },
];

/** Espelho de CATEGORIAS_BIBLIOTECA (constantes-desenvolvimento.ts), com Números (DEV-CAT-P08). */
export const AREAS = [
  "memoria_atencao",
  "raciocinio",
  "linguagem",
  "criatividade",
  "coordenacao",
  "autonomia",
  "numeros",
];

/** "ambos" conta para dentro de casa e para área externa na matriz. */
export const LUGARES = ["dentro_de_casa", "area_externa", "ambos"];

export const LIMITE_PASSOS = 3;

/**
 * Cobertura por faixa (ticket 03, decisão de 2026-11-27): cada atividade conta em todas as
 * faixas que cobre; "cerca de 20 por faixa" (M03 §15, Marco 1) é oferta mínima com equilíbrio.
 */
export const COBERTURA_FAIXA = { minimoPorFaixa: 20, minimoPorFaixaArea: 3, diferencaMaxima: 10 };

const DURACOES = [
  { id: "curta", ate: 10 },
  { id: "media", ate: 20 },
  { id: "longa", ate: Infinity },
];

const preenchido = (texto) => typeof texto === "string" && texto.trim().length > 0;
const inteiroPositivo = (n) => Number.isInteger(n) && n > 0;

export function faixasDaAtividade({ faixaEtariaMin, faixaEtariaMax }) {
  return FAIXAS.filter((f) => faixaEtariaMin <= f.max && faixaEtariaMax >= f.min).map((f) => f.id);
}

function faixaDeDuracao(minutos) {
  return DURACOES.find((d) => minutos <= d.ate).id;
}

function lugaresDaAtividade(lugar) {
  return lugar === "ambos" ? ["dentro_de_casa", "area_externa"] : [lugar];
}

function pessoasDaAtividade({ pessoasMin, pessoasMax }) {
  const grupos = [];
  if (pessoasMin === 1) grupos.push("individual");
  if (pessoasMin <= 2 && pessoasMax >= 2) grupos.push("dupla");
  if (pessoasMax >= 3) grupos.push("grupo");
  return grupos;
}

/** Falhas de uma ficha ativa: lista de { regra, detalhe }. */
export function avaliarFicha(item) {
  const falhas = [];
  const falha = (regra, detalhe) => falhas.push({ regra, detalhe });

  if (!preenchido(item.instrucao)) falha("objetivo", "sem objetivo lúdico (instrucao)");
  if (!preenchido(item.materiais)) falha("materiais", "sem materiais; use “Nenhum.” quando não houver");
  if (!inteiroPositivo(item.duracaoMinutos)) falha("duracao", "sem duração em minutos");
  if (!AREAS.includes(item.categoria)) falha("area", `área inválida: ${item.categoria}`);

  const faixaValida =
    Number.isInteger(item.faixaEtariaMin) &&
    Number.isInteger(item.faixaEtariaMax) &&
    item.faixaEtariaMin >= FAIXAS[0].min &&
    item.faixaEtariaMax <= FAIXAS.at(-1).max &&
    item.faixaEtariaMin <= item.faixaEtariaMax;
  if (!faixaValida) {
    falha("faixa", `faixa ${item.faixaEtariaMin}–${item.faixaEtariaMax} fora de 5 a 12 anos`);
  }

  const passos = Array.isArray(item.passos) ? item.passos : [];
  if (passos.length < 1 || passos.length > LIMITE_PASSOS || !passos.every(preenchido)) {
    falha("passos", `${passos.length} passo(s); a ficha pede de 1 a ${LIMITE_PASSOS}, todos escritos`);
  }

  if (!preenchido(item.variacaoFacil) || !preenchido(item.variacaoDificil)) {
    falha("variacoes", "faltam a variação mais fácil e a mais difícil");
  }
  if (!preenchido(item.adaptacaoSentado)) falha("sentado", "sem adaptação para brincar sentado");

  if (!LUGARES.includes(item.lugar)) falha("lugar", `lugar inválido: ${item.lugar}`);
  if (!inteiroPositivo(item.pessoasMin) || !inteiroPositivo(item.pessoasMax) || item.pessoasMin > item.pessoasMax) {
    falha("pessoas", `pessoas ${item.pessoasMin}–${item.pessoasMax} inválido`);
  }

  const seguranca = item.seguranca;
  if (!seguranca || typeof seguranca !== "object" || Array.isArray(seguranca)) {
    falha("seguranca", "sem checklist de segurança por faixa");
  } else if (faixaValida) {
    const cobertas = faixasDaAtividade(item);
    const faltando = cobertas.filter(
      (faixa) => !Array.isArray(seguranca[faixa]) || seguranca[faixa].length === 0 || !seguranca[faixa].every(preenchido),
    );
    if (faltando.length) falha("seguranca", `faltam itens de segurança para ${faltando.join(", ")}`);
    const sobrando = Object.keys(seguranca).filter((faixa) => !cobertas.includes(faixa));
    if (sobrando.length) falha("seguranca", `segurança para faixa fora da atividade: ${sobrando.join(", ")}`);
  }

  return falhas;
}

function matrizVazia() {
  const zeros = (ids) => Object.fromEntries(ids.map((id) => [id, 0]));
  return {
    faixaArea: Object.fromEntries(FAIXAS.map((f) => [f.id, zeros(AREAS)])),
    faixa: zeros(FAIXAS.map((f) => f.id)),
    area: zeros(AREAS),
    duracao: zeros(DURACOES.map((d) => d.id)),
    lugar: zeros(["dentro_de_casa", "area_externa"]),
    pessoas: zeros(["individual", "dupla", "grupo"]),
    /** Combinações faixa × área × duração × lugar × pessoas com ao menos uma atividade. */
    combinacoes: [],
  };
}

const ROTULOS_DIMENSAO = { faixa: "faixa", area: "área", duracao: "duração", lugar: "lugar", pessoas: "pessoas" };

function buracosDaDimensao(matriz, dimensao) {
  return Object.entries(matriz[dimensao])
    .filter(([, n]) => n === 0)
    .map(([valor]) => `${ROTULOS_DIMENSAO[dimensao]}: ${valor}`);
}

/** Células faixa × área com menos de `minimo` atividades: [{ faixa, area, n }]. */
function celulasAbaixoDe(matriz, minimo) {
  return Object.entries(matriz.faixaArea).flatMap(([faixa, areas]) =>
    Object.entries(areas)
      .filter(([, n]) => n < minimo)
      .map(([area, n]) => ({ faixa, area, n })),
  );
}

function buracosFaixaArea(matriz) {
  return celulasAbaixoDe(matriz, 1).map(({ faixa, area }) => `faixa×área: ${faixa} × ${area}`);
}

/** Buracos que o catálogo precisa zerar desde o ticket 02: faixa × área e área. */
function buracosDeAreaDa(matriz) {
  return [...buracosFaixaArea(matriz), ...buracosDaDimensao(matriz, "area")];
}

/** Pendências de cobertura por faixa; vazio quando o catálogo atende a COBERTURA_FAIXA. */
function pendenciasDeFaixaDa(matriz) {
  const { minimoPorFaixa, minimoPorFaixaArea, diferencaMaxima } = COBERTURA_FAIXA;
  const pendencias = [];
  for (const [faixa, n] of Object.entries(matriz.faixa)) {
    if (n < minimoPorFaixa) pendencias.push(`faixa ${faixa} com ${n} ativas; mínimo ${minimoPorFaixa}`);
  }
  for (const { faixa, area, n } of celulasAbaixoDe(matriz, minimoPorFaixaArea)) {
    pendencias.push(`faixa×área ${faixa} × ${area} com ${n}; mínimo ${minimoPorFaixaArea}`);
  }
  // Em empate, vale a primeira faixa na ordem de D1.
  const contagens = Object.entries(matriz.faixa);
  const maior = contagens.reduce((a, b) => (b[1] > a[1] ? b : a));
  const menor = contagens.reduce((a, b) => (b[1] < a[1] ? b : a));
  if (maior[1] - menor[1] > diferencaMaxima) {
    pendencias.push(
      `diferença de ${maior[1] - menor[1]} entre a faixa com mais (${maior[0]}, ${maior[1]}) e a com menos (${menor[0]}, ${menor[1]}); máximo ${diferencaMaxima}`,
    );
  }
  return pendencias;
}

/** Todos os buracos, para o relatório: faixa × área e cada dimensão. */
function buracosDa(matriz) {
  return [...buracosFaixaArea(matriz), ...Object.keys(ROTULOS_DIMENSAO).flatMap((d) => buracosDaDimensao(matriz, d))];
}

/**
 * Avalia o catálogo: { atividades, falhas, matriz, buracos, buracosDeArea, pendenciasDeFaixa, aprovado, catalogoAprovado }.
 * `aprovado` depende só das fichas; a matriz conta apenas fichas sem falha de faixa/área.
 */
export function avaliarAtividades(catalogo) {
  const atividades = catalogo.filter((item) => item.ativo !== false);
  const falhas = [];
  const matriz = matrizVazia();
  const combinacoes = new Map();
  const nomes = new Map();

  for (const item of atividades) {
    const daFicha = avaliarFicha(item);
    falhas.push(...daFicha.map((f) => ({ atividade: item.id, ...f })));

    const nome = (item.nome ?? "").trim().toLocaleLowerCase("pt-BR");
    if (nomes.has(nome)) {
      falhas.push({ atividade: item.id, regra: "nome", detalhe: `nome repetido com ${nomes.get(nome)}` });
    } else {
      nomes.set(nome, item.id);
    }

    if (daFicha.some((f) => ["faixa", "area", "duracao", "lugar", "pessoas"].includes(f.regra))) continue;
    const faixas = faixasDaAtividade(item);
    for (const faixa of faixas) {
      matriz.faixaArea[faixa][item.categoria] += 1;
      matriz.faixa[faixa] += 1;
    }
    const duracao = faixaDeDuracao(item.duracaoMinutos);
    const lugares = lugaresDaAtividade(item.lugar);
    const grupos = pessoasDaAtividade(item);
    matriz.area[item.categoria] += 1;
    matriz.duracao[duracao] += 1;
    for (const lugar of lugares) matriz.lugar[lugar] += 1;
    for (const grupo of grupos) matriz.pessoas[grupo] += 1;
    for (const faixa of faixas) {
      for (const lugar of lugares) {
        for (const pessoas of grupos) {
          const chave = [faixa, item.categoria, duracao, lugar, pessoas].join("|");
          const celula = combinacoes.get(chave) ?? { faixa, area: item.categoria, duracao, lugar, pessoas, quantidade: 0 };
          celula.quantidade += 1;
          combinacoes.set(chave, celula);
        }
      }
    }
  }
  matriz.combinacoes = [...combinacoes.values()];

  const buracosDeArea = buracosDeAreaDa(matriz);
  const pendenciasDeFaixa = pendenciasDeFaixaDa(matriz);
  const aprovado = falhas.length === 0;
  return {
    atividades: atividades.map((a) => a.id),
    falhas,
    matriz,
    buracos: buracosDa(matriz),
    buracosDeArea,
    pendenciasDeFaixa,
    aprovado,
    /** Catálogo pronto: fichas aprovadas, sem buraco de área e sem pendência de faixa. */
    catalogoAprovado: aprovado && buracosDeArea.length === 0 && pendenciasDeFaixa.length === 0,
  };
}
