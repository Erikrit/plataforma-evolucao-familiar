import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { CATALOGO_JOGOS_PILOTO_E5 } from "../prisma/catalogo-jogos-piloto-e5.mjs";

const require = createRequire(import.meta.url);
require("ts-node").register({
  project: fileURLToPath(new URL("../tsconfig.json", import.meta.url)),
  transpileOnly: true,
});
const { montarConteudoMotor } = require("../src/desenvolvimento/jogos/motores-jogos");
const { selecionarDestaquesJogos } = require("../src/desenvolvimento/jogos/destaques-jogos");
const { CATEGORIAS_BIBLIOTECA } = require("../src/desenvolvimento/constantes-desenvolvimento");
const { dicaEscolha, dicaSequencia, dicaMemoria, dicaOrdenacao, dicaSudoku, dicaRobo, comandosDoCaminho } = require("../../web/src/componentes/desenvolvimento/jogos/dicas-jogos");

// Valida o catálogo que a carga oficial publica (DEV-CAT-M1, ticket 01).
const CATALOGO_JOGOS = CATALOGO_JOGOS_PILOTO_E5.map((jogo) => ({
  ...jogo,
  fases: jogo.fases.map((fase) => ({
    numero: fase.numero,
    titulo: fase.titulo,
    objetivo: fase.objetivo,
    tipo: jogo.tipoMecanica,
    configuracao: fase.configuracao,
    ...fase.configuracao,
  })),
}));

function montarConteudoFase(fase, sortear) {
  return montarConteudoMotor(fase.tipo, fase.configuracao, sortear);
}

assert.equal(new Set(CATALOGO_JOGOS.map((jogo) => jogo.id)).size, CATALOGO_JOGOS.length);
assert.deepEqual(CATALOGO_JOGOS.map((jogo) => jogo.id), ["memoria", "sequencia", "labirinto"]);

function rodada(fase, indice) {
  let sorteios = 0;
  return montarConteudoFase(fase, () => sorteios++ === 0 ? indice : 0);
}

function conferirMemoria(fase) {
  assert.ok(fase.conjuntos.length >= 2);
  const variantes = new Set();
  for (const [indice, figuras] of fase.conjuntos.entries()) {
    const esperado = fase.conjuntos[0].length;
    assert.equal(figuras.length, esperado);
    assert.equal(new Set(figuras.map((figura) => figura.id)).size, esperado);
    const conteudo = rodada(fase, indice);
    assert.equal(conteudo.cartas.length, esperado * 2);
    assert.ok(figuras.every((figura) => conteudo.cartas.filter((carta) => carta.id === figura.id).length === 2));
    variantes.add(conteudo.cartas.map((figura) => figura.id).sort().join(","));
  }
  assert.equal(variantes.size, fase.conjuntos.length);
}

function conferirSequencia(fase) {
  assert.ok(fase.padroes.length >= 2);
  assert.equal(new Set(fase.padroes.map((padrao) => padrao.map((peca) => peca.id).join(","))).size, fase.padroes.length);
  for (const [indice, padrao] of fase.padroes.entries()) {
    const conteudo = rodada(fase, indice);
    assert.equal(conteudo.sequencia.length, fase.comprimento);
    assert.equal(conteudo.sequencia.filter((peca) => peca === null).length, 1);
    assert.equal(conteudo.sequencia[fase.lacuna], null);
    const evidencias = conteudo.sequencia.filter((peca, posicao) =>
      peca && posicao % padrao.length === fase.lacuna % padrao.length,
    );
    assert.ok(evidencias.length > 0, "O padrão tem de mostrar a peça em outra posição.");
    assert.equal(conteudo.alternativas.length, 3);
    assert.equal(new Set(conteudo.alternativas.map((peca) => peca.id)).size, 3);
    const corretas = conteudo.alternativas.filter((peca) => evidencias.every((item) => item.id === peca.id));
    assert.deepEqual(corretas.map((peca) => peca.id), [conteudo.resposta]);
    assert.ok(conteudo.alternativas.every((peca) => peca.forma && peca.cor && peca.nome));
    const [correta] = corretas;
    if (padrao.every((peca) => peca.forma === correta.forma)) {
      assert.ok(conteudo.alternativas.every((peca) => peca.forma === correta.forma));
    } else if (padrao.every((peca) => peca.cor === correta.cor)) {
      assert.ok(conteudo.alternativas.every((peca) => peca.cor === correta.cor));
    } else {
      const distratoras = conteudo.alternativas.filter((peca) => peca.id !== correta.id);
      assert.equal(distratoras.filter((peca) => peca.forma === correta.forma).length, 1);
      assert.equal(distratoras.filter((peca) => peca.cor === correta.cor).length, 1);
    }
  }
}

/** Menor distância do início à chegada por fase; não pode cair de uma fase para outra. */
const passosLabirinto = new Map();

function conferirLabirinto(fase) {
  assert.ok(fase.mapas.length >= 2);
  assert.equal(new Set(fase.mapas.map((mapa) => mapa.join("/"))).size, fase.mapas.length);
  for (const [indice, mapa] of fase.mapas.entries()) {
    const { inicio, chegada } = rodada(fase, indice);
    assert.ok(mapa.every((linha) => linha.length === mapa[0].length && /^[#.IF]+$/.test(linha)));
    assert.equal([...mapa.join("").matchAll(/I/g)].length, 1);
    assert.equal([...mapa.join("").matchAll(/F/g)].length, 1);
    assert.equal(mapa[inicio.linha][inicio.coluna], "I");
    assert.equal(mapa[chegada.linha][chegada.coluna], "F");
    const fila = [[inicio.linha, inicio.coluna, 0]];
    const visitados = new Set([`${inicio.linha}/${inicio.coluna}`]);
    let distancia;
    for (let i = 0; i < fila.length; i++) {
      const [linha, coluna, passos] = fila[i];
      if (linha === chegada.linha && coluna === chegada.coluna) distancia = passos;
      for (const [l, c] of [[linha - 1, coluna], [linha + 1, coluna], [linha, coluna - 1], [linha, coluna + 1]]) {
        const chave = `${l}/${c}`;
        if (!mapa[l]?.[c] || mapa[l][c] === "#" || visitados.has(chave)) continue;
        visitados.add(chave);
        fila.push([l, c, passos + 1]);
      }
    }
    assert.ok(distancia > 0, "O mapa tem de ter caminho até a chegada.");
    passosLabirinto.set(fase.numero, Math.min(passosLabirinto.get(fase.numero) ?? Infinity, distancia));
    assert.equal(visitados.size, [...mapa.join("")].filter((celula) => celula !== "#").length);
  }
}

for (const jogo of CATALOGO_JOGOS) {
  assert.ok(CATEGORIAS_BIBLIOTECA.includes(jogo.categoria));
  assert.ok(jogo.versao > 0);
  const totalFases = 15;
  assert.deepEqual(jogo.fases.map((fase) => fase.numero), Array.from({ length: totalFases }, (_, i) => i + 1));
  for (const fase of jogo.fases) {
    assert.ok(fase.objetivo && fase.titulo);
    if (fase.tipo === "memoria") conferirMemoria(fase);
    if (fase.tipo === "sequencia") conferirSequencia(fase);
    if (fase.tipo === "labirinto") conferirLabirinto(fase);
  }
}

const passos = [...passosLabirinto.values()];
assert.equal(passos.length, 15);
// A dificuldade (decisões no caminho) é medida pela régua (test:regua); aqui os passos só não caem.
assert.ok(passos.every((valor, i) => i === 0 || valor >= passos[i - 1]), `Passos do labirinto não podem cair: ${passos.join(",")}`);

// Ticket 09 (decisão de 2026-11-26): dica em dois níveis. O 1º orienta sem entregar; o 2º mostra a resposta.
{
  const escolha = {
    enunciado: "Pera",
    resposta: "pera",
    ocultarNomes: true,
    opcoes: [{ id: "maca", nome: "Maçã", simbolo: "🍎" }, { id: "pera", nome: "Pera", simbolo: "🍐" }],
  };
  const n1 = dicaEscolha(escolha, 1);
  assert.ok(n1 && !/pera/i.test(n1.texto) && n1.destacar == null, "1º nível da escolha não entrega");
  assert.deepEqual(dicaEscolha({ ...escolha, dica: "É verde e alongada." }, 1).texto, "É verde e alongada.");
  const n2 = dicaEscolha(escolha, 2);
  assert.ok(n2.destacar === "pera" && /figura 2/i.test(n2.texto), "2º nível mostra a figura certa sem depender do nome");

  const a = { id: "circulo-azul", nome: "Círculo azul" };
  const b = { id: "quadrado-azul", nome: "Quadrado azul" };
  const c = { id: "triangulo-azul", nome: "Triângulo azul" };
  const sequencia = { sequencia: [a, b, c, a, b, null], alternativas: [b, c, a], resposta: "triangulo-azul" };
  const s1 = dicaSequencia(sequencia, 1);
  assert.ok(!/tri[aâ]ngulo/i.test(s1.texto) && /3 posições antes/.test(s1.texto), `1º nível da sequência orienta pelo período: ${s1.texto}`);
  assert.match(dicaSequencia(sequencia, 2).texto, /triângulo azul/i);

  const cartas = ["gato", "sol", "gato", "lua", "sol", "lua"].map((id) => ({ id }));
  const m1 = dicaMemoria({ cartas, viradas: [0], encontradas: [], nivel: 1, sortear: () => 0 });
  assert.ok(m1.indicar.length === 3 && m1.indicar.includes(2) && !m1.indicar.includes(0), "1º nível indica três cartas, uma delas o par");
  const m2 = dicaMemoria({ cartas, viradas: [0], encontradas: [], nivel: 2, sortear: () => 0 });
  assert.deepEqual(m2.indicar, [2]);
  const m0 = dicaMemoria({ cartas, viradas: [], encontradas: [], nivel: 1, sortear: () => 0 });
  assert.equal(m0.indicar.length, 1, "sem carta virada, o 1º nível só sugere por onde começar");

  // Histórias: o 1º nível não diz a primeira cena; o 2º diz a próxima cena que falta.
  const cenas = [{ id: "a", nome: "Plantar a semente" }, { id: "b", nome: "Flor aberta" }];
  const o1 = dicaOrdenacao({ cenas, ordemCorreta: ["a", "b"] }, [], 1);
  assert.ok(!/plantar|flor/i.test(o1), `1º nível de Histórias não entrega: ${o1}`);
  assert.equal(dicaOrdenacao({ cenas, ordemCorreta: ["a", "b"], dica: "A flor vem depois." }, [], 1), "A flor vem depois.");
  assert.match(dicaOrdenacao({ cenas, ordemCorreta: ["a", "b"] }, [], 2), /plantar a semente/i);
  assert.match(dicaOrdenacao({ cenas, ordemCorreta: ["a", "b"] }, ["a"], 2), /flor aberta/i);

  // Forme a palavra e Do menor ao maior (ticket 12): dica própria de letras e números.
  const letras = [..."SOL"].map((l, i) => ({ id: `sol-${i}`, nome: l, simbolo: l }));
  assert.match(dicaOrdenacao({ cenas: letras, ordemCorreta: letras.map((c) => c.id) }, [], 1), /primeira letra/i);
  assert.match(dicaOrdenacao({ cenas: letras, ordemCorreta: letras.map((c) => c.id) }, ["sol-0"], 2), /próxima letra é O/);
  const nums = [3, 7, 12].map((v) => ({ id: `n${v}`, nome: String(v), simbolo: String(v) }));
  assert.match(dicaOrdenacao({ cenas: nums, ordemCorreta: nums.map((c) => c.id) }, [], 1), /menor número/i);
  assert.match(dicaOrdenacao({ cenas: nums, ordemCorreta: nums.map((c) => c.id) }, [], 2), /primeiro número é 3/);

  // Sudoku (ticket 12): o 1º nível aponta a linha, coluna ou bloco mais perto de completar; o 2º, uma casa.
  const simbolos = ["Maçã", "Pera", "Uva", "Banana"].map((nome, i) => ({ id: String(i), nome, simbolo: "x" }));
  const sudoku = { tamanho: 4, caixa: { linhas: 2, colunas: 2 }, simbolos, solucao: [[1, 2, 3, 4], [3, 4, 1, 2], [2, 1, 4, 3], [4, 3, 2, 1]] };
  const atual = [[1, 2, 3, 0], [0, 0, 1, 2], [0, 0, 0, 0], [0, 0, 0, 0]];
  const d1 = dicaSudoku(sudoku, atual, 1);
  assert.ok(/linha 1/i.test(d1.texto) && d1.celula == null && !/banana/i.test(d1.texto), `1º nível do sudoku: ${d1.texto}`);
  const d2 = dicaSudoku(sudoku, atual, 2);
  assert.deepEqual(d2.celula, [0, 3]);
  assert.match(d2.texto, /banana/i);

  // Robô (ticket 12): caminho em comandos; o 2º nível diz o próximo comando certo.
  const mapa = ["#####", "#I..#", "###.#", "#F..#", "#####"];
  const caminho = comandosDoCaminho(mapa, { linha: 1, coluna: 1 }, { linha: 3, coluna: 1 });
  assert.deepEqual(caminho, [{ direcao: "direita", passos: 2 }, { direcao: "baixo", passos: 2 }, { direcao: "esquerda", passos: 2 }]);
  const r1 = dicaRobo({ mapa, inicio: { linha: 1, coluna: 1 }, chegada: { linha: 3, coluna: 1 } }, [], 1);
  assert.ok(!/direita|baixo|esquerda/i.test(r1), `1º nível do robô não entrega: ${r1}`);
  assert.match(dicaRobo({ mapa, inicio: { linha: 1, coluna: 1 }, chegada: { linha: 3, coluna: 1 } }, [{ direcao: "direita", passos: 2 }], 2), /baixo.*2/i);
}

// DEV-CAT-M1-CONTEUDO, ticket 04: escolha sem rótulo que entregue.
{
  const { CATALOGO_JOGOS_MEMORIA_ESCOLHA_E5 } = await import("../prisma/catalogo-jogos-memoria-escolha-e5.mjs");
  const par = (id, faces) => ({ id, faces });
  // Mãe e filhote e Metades saíram do ticket 04 (responsável, 2026-11-27): a memória segue só com objeto e sombra.
  for (const face of ["filhote", "metade-esquerda"]) {
    assert.throws(() => montarConteudoMotor("memoria", { conjuntos: [[par("x", [{ nome: "X", simbolo: "🍎" }, { nome: "X", simbolo: "🍎", face }])]] }), face);
  }
  assert.deepEqual(CATALOGO_JOGOS_MEMORIA_ESCOLHA_E5.map((j) => j.id), ["letra-inicial", "adivinha-pista"]);
  for (const jogo of CATALOGO_JOGOS_MEMORIA_ESCOLHA_E5) {
    assert.ok(CATEGORIAS_BIBLIOTECA.includes(jogo.categoria));
    assert.deepEqual(jogo.fases.map((f) => f.numero), Array.from({ length: 15 }, (_, i) => i + 1));
    for (const fase of jogo.fases) {
      for (const indice of fase.configuracao.conjuntos.keys()) {
        let sorteios = 0;
        const conteudo = montarConteudoMotor(jogo.tipoMecanica, fase.configuracao, () => (sorteios++ === 0 ? indice : 0));
        if (jogo.tipoMecanica === "memoria") {
          assert.equal(conteudo.cartas.length, fase.configuracao.conjuntos[indice].length * 2);
          assert.equal(Boolean(conteudo.ocultarNomes), Boolean(fase.configuracao.ocultarNomes));
        } else {
          // Escolha: nomes ocultos até o acerto e dica de 1º nível curada que não aponta a figura.
          assert.equal(conteudo.ocultarNomes, true);
          const d1 = dicaEscolha(conteudo, 1);
          assert.equal(d1.texto, fase.configuracao.conjuntos[indice].dica);
          assert.equal(d1.destacar, null);
          assert.equal(dicaEscolha(conteudo, 2).destacar, conteudo.resposta);
        }
      }
    }
  }
}

// Ticket 10 (D3, 2026-11-26): toda figura de jogo ativo tem SVG Twemoji local e origem registrada.
{
  const { readFileSync, existsSync } = await import("node:fs");
  const { CATALOGO_CARREGADO } = await import("./lib-regua-jogos.mjs");
  const pasta = fileURLToPath(new URL("../../web/public/figuras/twemoji/", import.meta.url));
  const segmentador = new Intl.Segmenter("pt", { granularity: "grapheme" });
  const codigo = (g) => {
    const pontos = [...g].map((c) => c.codePointAt(0).toString(16));
    return (pontos.includes("200d") ? pontos : pontos.filter((p) => p !== "fe0f")).join("-");
  };
  const figuras = new Set();
  const visitar = (x) => {
    if (Array.isArray(x)) x.forEach(visitar);
    else if (x && typeof x === "object") Object.values(x).forEach(visitar);
    else if (typeof x === "string") {
      for (const { segment } of segmentador.segment(x)) if (/\p{Extended_Pictographic}/u.test(segment)) figuras.add(segment);
    }
  };
  visitar(CATALOGO_CARREGADO.filter((jogo) => jogo.ativo !== false));
  ["🤖", "🔒"].forEach((g) => figuras.add(g));
  const faltando = [...figuras].filter((g) => !existsSync(`${pasta}${codigo(g)}.svg`));
  assert.deepEqual(faltando, [], `Figuras sem SVG local: ${faltando.join(" ")}`);
  const origem = readFileSync(`${pasta}ORIGEM.md`, "utf8");
  assert.ok(/CC-BY 4\.0/.test(origem) && /17\.0\.3/.test(origem) && existsSync(`${pasta}LICENSE-GRAPHICS.txt`));
  const modulo = readFileSync(fileURLToPath(new URL("../../web/src/lib/figuras-twemoji.ts", import.meta.url)), "utf8");
  assert.ok([...figuras].every((g) => modulo.includes(`"${codigo(g)}"`)), "lista de figuras do web desatualizada");
}

// Ticket 14: com nomes ocultos, toda cena (e intrusa) de Histórias tem objeto para o leitor de tela,
// e o objeto não repete o texto da ação.
{
  const { readFileSync } = await import("node:fs");
  const { CATALOGO_JOGOS_HISTORIAS_E5 } = await import("../prisma/catalogo-jogos-historias-e5.mjs");
  const mapa = readFileSync(fileURLToPath(new URL("../../web/src/lib/objetos-figuras.ts", import.meta.url)), "utf8");
  const objetos = new Map([...mapa.matchAll(/"([^"]+)": "([^"]+)"/g)].map((m) => [m[1], m[2]]));
  const semObjeto = new Set();
  const repetem = [];
  for (const fase of CATALOGO_JOGOS_HISTORIAS_E5[0].fases) {
    for (const conjunto of fase.configuracao.conjuntos ?? [fase.configuracao]) {
      if (!conjunto.ocultarNomes) continue;
      for (const cena of [...conjunto.cenas, ...(conjunto.intrusas ?? [])]) {
        const objeto = objetos.get(cena.simbolo);
        if (!objeto) semObjeto.add(cena.simbolo);
        else if (objeto.toLowerCase() === cena.nome.toLowerCase()) repetem.push(cena.nome);
      }
    }
  }
  assert.deepEqual([...semObjeto], [], `Cenas sem objeto para o leitor de tela: ${[...semObjeto].join(" ")}`);
  assert.deepEqual(repetem, [], `Objeto igual ao nome da ação: ${repetem.join(", ")}`);
}

// DEV-CAT-M1-CONTEUDO, ticket 10: simulação do Barquinho no rio, sem biblioteca 2D.
// Sem tempo, sem vidas e sem perder: a pedra só desvia o barco; caminho fechado só para o barco.
{
  const sim = require("../../web/src/componentes/desenvolvimento/jogos/barquinho/simulacao-barquinho");
  const { criarControladorBarquinho } = require("../../web/src/componentes/desenvolvimento/jogos/barquinho/controlador-barquinho");
  const rio = {
    correnteza: 1,
    rio: ["#..B..#", "#.....#", "#..o..#", "#..f..#", "#.ooo.#", "#.....#", "#.....#"],
  };
  const inicio = sim.criarPartidaBarquinho(rio);
  assert.deepEqual([inicio.linha, inicio.coluna, inicio.concluido], [0, 3, false]);
  assert.equal(sim.existeRotaBarquinho(rio), true);

  let e = sim.avancarBarco(inicio, rio, 1);
  assert.deepEqual([e.linha, e.coluna, e.desvios], [1, 3, 0]);
  e = sim.avancarBarco(e, rio, 1);
  assert.deepEqual([e.linha, e.coluna, e.desvios], [2, 2, 1], "a pedra desvia o barco para a faixa livre");
  assert.match(e.aviso, /desvi/i);
  e = sim.avancarBarco(e, rio, 2);
  assert.deepEqual([e.linha, e.coluna, e.desvios], [4, 1, 2]);
  e = sim.avancarBarco(e, rio, 5);
  assert.deepEqual([e.linha, e.concluido], [6, true], "chegar na margem final conclui a fase");
  assert.deepEqual(sim.avancarBarco(e, rio, 3), e, "concluída, a fase não muda mais");
  const deUmaVez = sim.avancarBarco(inicio, rio, 10);
  assert.deepEqual([deUmaVez.linha, deUmaVez.coluna, deUmaVez.desvios, deUmaVez.concluido], [6, 1, 2, true]);

  let lado = sim.virarBarco(inicio, rio, 1);
  lado = sim.virarBarco(lado, rio, 1);
  assert.equal(lado.coluna, 5);
  lado = sim.virarBarco(lado, rio, 1);
  assert.equal(lado.coluna, 5, "a margem não deixa o barco sair do rio");
  assert.match(lado.aviso, /margem/i);

  const folha = { correnteza: 1, rio: ["#.B.#", "#.f.#", "#...#"] };
  const comFolha = sim.avancarBarco(sim.criarPartidaBarquinho(folha), folha, 1);
  assert.deepEqual(comFolha.folhas, ["1/2"]);
  assert.equal(sim.totalFolhas(folha), 1);

  const fechado = { correnteza: 1, rio: ["#.B..#", "#ooo.#", "#....#"] };
  assert.equal(sim.existeRotaBarquinho(fechado), true);
  const dica = sim.dicaBarquinho(sim.criarPartidaBarquinho(fechado), fechado);
  assert.equal(dica.lado, 1);
  assert.match(dica.texto, /direita/);
  let parado = sim.avancarBarco(sim.criarPartidaBarquinho(fechado), fechado, 3);
  assert.deepEqual([parado.linha, parado.coluna, parado.parado, parado.concluido], [0, 2, true, false], "sem saída à frente, o barco espera");
  assert.match(parado.aviso, /direita/);
  parado = sim.virarBarco(sim.virarBarco(parado, fechado, 1), fechado, 1);
  parado = sim.avancarBarco(parado, fechado, 2);
  assert.deepEqual([parado.coluna, parado.concluido], [4, true]);

  assert.equal(sim.existeRotaBarquinho({ correnteza: 1, rio: ["#.B.#", "#ooo#", "#...#"] }), false);
  const livre = sim.dicaBarquinho(sim.criarPartidaBarquinho(folha), folha);
  assert.equal(livre.lado, 0);
  const pausado = sim.pausarBarco(inicio, true);
  assert.deepEqual(sim.avancarBarco(pausado, rio, 5), pausado, "pausado, o barco não anda");

  // E5-ACE-10: com movimento reduzido, o barco anda por linhas inteiras, sem deslizar.
  const reduzido = criarControladorBarquinho(rio, { movimentoReduzido: true });
  for (let i = 0; i < 3; i += 1) reduzido.passo(200);
  assert.equal(reduzido.estado.linha, 0);
  for (let i = 0; i < 3; i += 1) reduzido.passo(200);
  assert.equal(reduzido.estado.linha, 1);
  const fluido = criarControladorBarquinho(rio, { movimentoReduzido: false });
  fluido.passo(200);
  assert.equal(fluido.estado.linha, 0.2);
  fluido.passo(30000);
  assert.ok(fluido.estado.linha <= 0.5, "aba escondida não faz o barco pular o rio");
  let concluidas = 0;
  fluido.aoConcluir = () => { concluidas += 1; };
  for (let i = 0; i < 60; i += 1) fluido.passo(250);
  assert.equal(concluidas, 1, "o aviso de conclusão sai uma vez");

  const { FASE_PROTOTIPO_BARQUINHO: prototipo } = require("../../web/src/componentes/desenvolvimento/jogos/barquinho/fase-prototipo-barquinho");
  assert.ok(prototipo.rio.every((linha) => linha.length === prototipo.rio[0].length), "rio retangular");
  assert.equal(sim.existeRotaBarquinho(prototipo), true, "a fase do protótipo tem rota até a margem");
  const semToque = sim.avancarBarco(sim.criarPartidaBarquinho(prototipo), prototipo, 120);
  assert.equal(semToque.concluido, true, "só com os desvios das pedras, o barco chega na margem");
}

const editorial = [...CATALOGO_JOGOS, { id: "outro", categoria: "autonomia" }];
assert.deepEqual(selecionarDestaquesJogos([], []), []);
assert.deepEqual(selecionarDestaquesJogos(editorial.slice(0, 1), []), ["memoria"]);
assert.deepEqual(selecionarDestaquesJogos(editorial.slice(0, 2), []), ["memoria", "sequencia"]);
assert.deepEqual(selecionarDestaquesJogos(editorial, []), ["memoria", "sequencia", "outro"]);
const aberturas = [
  { jogoId: "labirinto", ultimaAberturaEm: new Date(5000) },
  { jogoId: "labirinto", ultimaAberturaEm: new Date(1000) },
  { jogoId: "sequencia", ultimaAberturaEm: new Date(3000) },
];
assert.deepEqual(selecionarDestaquesJogos(editorial, aberturas), ["labirinto", "memoria", "outro"]);
assert.deepEqual(selecionarDestaquesJogos(editorial, [...aberturas].reverse()), ["labirinto", "memoria", "outro"]);
const todosExplorados = editorial.map((item, indice) => ({ jogoId: item.id, ultimaAberturaEm: new Date(indice) }));
assert.deepEqual(selecionarDestaquesJogos(editorial, todosExplorados), ["outro", "memoria", "sequencia"]);
assert.deepEqual(selecionarDestaquesJogos(editorial, editorial.map((item) => ({ jogoId: item.id, ultimaAberturaEm: new Date(5000) }))), ["memoria", "sequencia", "labirinto"]);

// DEV-CAT-M1-CONTEUDO, ticket 04 (E5-ACE-10): com nomes ocultos na tela, o leitor de tela
// ainda ouve o que a figura mostra (texto equivalente), como na memória.
{
  const { readFileSync } = await import("node:fs");
  const escolha = readFileSync(fileURLToPath(new URL("../../web/src/componentes/desenvolvimento/jogos/tabuleiro-escolha.tsx", import.meta.url)), "utf8");
  assert.ok(escolha.includes("aria-label={mostrarNomes ? figura.nome : `Figura ${indice + 1}: ${figura.nome}`}"), "escolha com nomes ocultos anuncia o nome da figura ao leitor de tela");
}

// DEV-CAT-M1-CONTEUDO, ticket 11: motor do Barquinho no rio no servidor.
// O conteúdo é o rio sorteado entre as variantes e a correnteza; contratos de partida iguais.
{
  const rios = [["#..B..#", "#..o..#", "#.....#"], ["#.B...#", "#...o.#", "#.....#"]];
  const conteudo = montarConteudoMotor("barquinho", { correnteza: 1.2, rios }, () => 1);
  assert.deepEqual(conteudo, { tipo: "barquinho", correnteza: 1.2, rio: rios[1] });
  const invalidos = [
    { correnteza: 1, rios: [] },
    { correnteza: 1, rios: [["#.....#", "#.....#"]] },
    { correnteza: 1, rios: [["#..B..#", "#....#"]] },
    { correnteza: 1, rios: [["#..B..#", "#..x..#"]] },
    { correnteza: 5, rios: [["#..B..#", "#.....#"]] },
    { correnteza: 1, rios: [["#..B..#", "#..B..#"]] },
  ];
  for (const config of invalidos) assert.throws(() => montarConteudoMotor("barquinho", config), JSON.stringify(config));
}

// DEV-CAT-M1-CONTEUDO, ticket 11 (E5-F04): em todos os rios do catálogo, seguir só a dica leva
// o barco à margem final, e a dica nunca falta antes da chegada (simulação da web, sem 2D).
{
  const sim = require("../../web/src/componentes/desenvolvimento/jogos/barquinho/simulacao-barquinho");
  const { CATALOGO_JOGO_BARQUINHO_E5 } = await import("../prisma/catalogo-jogos-barquinho-e5.mjs");
  const [barquinho] = CATALOGO_JOGO_BARQUINHO_E5;
  assert.equal(barquinho.fases.length, 15);
  for (const fase of barquinho.fases) {
    for (const rio of fase.configuracao.rios) {
      const partida = { rio, correnteza: fase.configuracao.correnteza };
      let estado = sim.criarPartidaBarquinho(partida);
      for (let passo = 0; passo < 2000 && !estado.concluido; passo += 1) {
        const dica = sim.dicaBarquinho(estado, partida);
        assert.ok(dica, `fase ${fase.numero}: sem dica antes da chegada`);
        estado = estado.parado && dica.lado !== 0 ? sim.virarBarco(estado, partida, dica.lado) : sim.avancarBarco(estado, partida, 0.25);
      }
      assert.equal(estado.concluido, true, `fase ${fase.numero}: seguindo a dica, o barco não chegou`);
    }
  }
}

// DEV-CAT-M1-CONTEUDO, ticket 05: motor do Caminho de cores no servidor.
{
  const mapas = [{ cor: "a", linhas: ["IaaV", "mmmv", "Fvvv"] }, { cor: "v", linhas: ["Ivva", "mmva", "Fvva"] }];
  const conteudo = montarConteudoMotor("cores", { mapas }, () => 0);
  assert.deepEqual(conteudo, { tipo: "cores", mapa: mapas[0].linhas, cor: "a", inicio: { linha: 0, coluna: 0 }, chegada: { linha: 2, coluna: 0 } });
  const invalidos = [
    { mapas: [] },
    { mapas: [{ cor: "x", linhas: ["IaaF"] }] },
    { mapas: [{ cor: "a", linhas: ["aaaF"] }] },
    { mapas: [{ cor: "a", linhas: ["IaqF"] }] },
    { mapas: [{ cor: "a", linhas: ["IaaF", "aa"] }] },
  ];
  for (const config of invalidos) assert.throws(() => montarConteudoMotor("cores", config), JSON.stringify(config));
}

// DEV-CAT-M1-CONTEUDO, ticket 05 (E5-F04 e E5-ACE-10): regras da web do Caminho de cores.
// Seguir só a dica leva à chegada em todos os mapas; a cor indicada é respeitada; cada cor tem
// nome e símbolo distintos.
{
  const cc = require("../../web/src/componentes/desenvolvimento/jogos/caminho-cores");
  const mapa = ["IaaV", "mmmv", "Fvvv"];
  assert.equal(cc.pisar(mapa, { linha: 1, coluna: 0 }, "a"), null, "casa amarela com azul indicado");
  assert.equal(cc.pisar(mapa, { linha: 0, coluna: 3 }, "a"), "v", "a casa de troca muda a cor");
  assert.equal(cc.dicaCores(mapa, { linha: 0, coluna: 0 }, "a").id, "direita");
  assert.match(cc.descreverArredores(mapa, { linha: 0, coluna: 2 }), /direita: troca para verde/);
  const simbolos = Object.values(cc.CORES_CAMINHO).map((c) => c.simbolo);
  assert.equal(new Set(simbolos).size, 4, "um símbolo por cor");
  const { CATALOGO_JOGOS_CORES_E5 } = await import("../prisma/catalogo-jogos-cores-e5.mjs");
  const [jogoCores] = CATALOGO_JOGOS_CORES_E5;
  assert.equal(jogoCores.fases.length, 15);
  for (const fase of jogoCores.fases) assert.doesNotThrow(() => montarConteudoMotor("cores", fase.configuracao, () => 0), `fase ${fase.numero}`);
  for (const fase of jogoCores.fases) {
    for (const { cor: corInicial, linhas } of fase.configuracao.mapas) {
      let posicao = null;
      linhas.forEach((linha, l) => { const c = linha.indexOf("I"); if (c >= 0) posicao = { linha: l, coluna: c }; });
      let cor = corInicial;
      for (let passo = 0; passo < 200 && linhas[posicao.linha][posicao.coluna] !== "F"; passo += 1) {
        const direcao = cc.dicaCores(linhas, posicao, cor);
        assert.ok(direcao, `fase ${fase.numero}: sem dica antes da chegada`);
        const destino = cc.andar(posicao, direcao);
        cor = cc.pisar(linhas, destino, cor);
        assert.ok(cor, `fase ${fase.numero}: a dica mandou pisar fora da cor`);
        posicao = destino;
      }
      assert.equal(linhas[posicao.linha][posicao.coluna], "F", `fase ${fase.numero}: seguindo a dica, não chegou`);
    }
  }
}

console.log("check-e5: três jogos, 45 fases em três trilhas, dicas em dois níveis, variantes e destaques determinísticos validados");
