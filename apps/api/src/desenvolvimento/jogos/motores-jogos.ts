import { BadRequestException } from "@nestjs/common";
import { randomInt } from "node:crypto";

type FiguraMemoria = Readonly<{
  id: string;
  nome: string;
  simbolo: string;
  face?: "objeto" | "sombra";
}>;
type FormaSequencia = "circulo" | "quadrado" | "triangulo" | "losango";
type CorSequencia = "azul" | "dourado" | "verde" | "roxo";
type FiguraSequencia = Readonly<{
  id: string;
  forma: FormaSequencia;
  cor: CorSequencia;
  nome: string;
}>;
type FiguraEscolha = Readonly<{ id: string; nome: string; simbolo: string }>;
type PosicaoMapa = Readonly<{ linha: number; coluna: number }>;

export type ConfigMemoria = Readonly<{ conjuntos: readonly (readonly FiguraMemoria[])[] }>;
export type ConfigSequencia = Readonly<{
  comprimento: number;
  lacuna: number;
  padroes: readonly (readonly FiguraSequencia[])[];
}>;
export type ConfigLabirinto = Readonly<{ mapas: readonly (readonly string[])[] }>;
export type ConfigEscolha = Readonly<{
  conjuntos: readonly Readonly<{
    enunciado: string;
    opcoes: readonly FiguraEscolha[];
    resposta: string;
    dica?: string;
    /** Palavra e figura (ticket 09): o nome da opção só aparece depois do acerto. */
    ocultarNomes?: boolean;
  }>[];
}>;
export type CenaOrdenacao = Readonly<{ id: string; nome: string; simbolo: string }>;
export type ConfigOrdenacao = Readonly<{
  conjuntos: readonly Readonly<{
    enunciado: string;
    cenas: readonly CenaOrdenacao[];
    dica?: string;
    /** Ticket 13: Médios e Grandes mostram só a figura. */
    ocultarNomes?: boolean;
    /** Ticket 13: cenas que não fazem parte da resposta e devem ficar de fora. */
    intrusas?: readonly CenaOrdenacao[];
  }>[];
}>;

export type MotorJogo<TConfig = unknown> = Readonly<{
  id: string;
  validarConfiguracao(config: unknown): TConfig;
  montarConteudo(config: TConfig, sortear?: (limite: number) => number): unknown;
}>;

const PECAS_SEQUENCIA: readonly FiguraSequencia[] = [
  peca("circulo", "azul"),
  peca("circulo", "dourado"),
  peca("circulo", "roxo"),
  peca("circulo", "verde"),
  peca("quadrado", "azul"),
  peca("quadrado", "verde"),
  peca("triangulo", "azul"),
  peca("triangulo", "verde"),
  peca("losango", "verde"),
  peca("losango", "roxo"),
];

function peca(forma: FormaSequencia, cor: CorSequencia): FiguraSequencia {
  const nomeForma = {
    circulo: "Círculo",
    quadrado: "Quadrado",
    triangulo: "Triângulo",
    losango: "Losango",
  }[forma];
  return { id: `${forma}-${cor}`, forma, cor, nome: `${nomeForma} ${cor}` };
}

function embaralhar<T>(itens: readonly T[], sortear: (limite: number) => number): T[] {
  const resultado = [...itens];
  for (let i = resultado.length - 1; i > 0; i -= 1) {
    const outro = sortear(i + 1);
    [resultado[i], resultado[outro]] = [resultado[outro], resultado[i]];
  }
  return resultado;
}

function localizar(mapa: readonly string[], marco: "I" | "F") {
  const linha = mapa.findIndex((conteudo) => conteudo.includes(marco));
  if (linha < 0) throw new BadRequestException("Configuração de labirinto inválida.");
  return { linha, coluna: mapa[linha].indexOf(marco) };
}

function localizarTodos(mapa: readonly string[], marco: string): PosicaoMapa[] {
  const pontos: PosicaoMapa[] = [];
  for (let linha = 0; linha < mapa.length; linha += 1) {
    for (let coluna = 0; coluna < mapa[linha].length; coluna += 1) {
      if (mapa[linha][coluna] === marco) pontos.push({ linha, coluna });
    }
  }
  return pontos;
}

function exigirObjeto(config: unknown, motor: string): Record<string, unknown> {
  if (!config || typeof config !== "object" || Array.isArray(config)) {
    throw new BadRequestException(`Configuração inválida para o motor ${motor}.`);
  }
  return config as Record<string, unknown>;
}

function validarFaceMemoria(valor: unknown): { nome: string; simbolo: string; face?: "objeto" | "sombra" } {
  if (!valor || typeof valor !== "object") {
    throw new BadRequestException("Face de memória inválida.");
  }
  const face = valor as Record<string, unknown>;
  if (typeof face.nome !== "string" || typeof face.simbolo !== "string") {
    throw new BadRequestException("Face de memória inválida.");
  }
  if (face.face != null && face.face !== "objeto" && face.face !== "sombra") {
    throw new BadRequestException("Face de memória inválida.");
  }
  return {
    nome: face.nome,
    simbolo: face.simbolo,
    ...(face.face ? { face: face.face } : {}),
  };
}

function validarFiguraMemoria(valor: unknown): FiguraMemoria[] {
  if (!valor || typeof valor !== "object") {
    throw new BadRequestException("Figura de memória inválida.");
  }
  const figura = valor as Record<string, unknown>;
  if (typeof figura.id !== "string") {
    throw new BadRequestException("Figura de memória inválida.");
  }
  const id = figura.id;
  if (Array.isArray(figura.faces)) {
    if (figura.faces.length !== 2) {
      throw new BadRequestException("Par de faces de memória deve ter exatamente duas faces.");
    }
    return figura.faces.map((face) => {
      const validada = validarFaceMemoria(face);
      return { id, ...validada };
    });
  }
  if (typeof figura.nome !== "string" || typeof figura.simbolo !== "string") {
    throw new BadRequestException("Figura de memória inválida.");
  }
  return [{ id, nome: figura.nome, simbolo: figura.simbolo }];
}

function validarFiguraSequencia(valor: unknown): FiguraSequencia {
  if (!valor || typeof valor !== "object") {
    throw new BadRequestException("Peça de sequência inválida.");
  }
  const pecaValor = valor as Record<string, unknown>;
  const formas = new Set(["circulo", "quadrado", "triangulo", "losango"]);
  const cores = new Set(["azul", "dourado", "verde", "roxo"]);
  if (
    typeof pecaValor.id !== "string"
    || typeof pecaValor.nome !== "string"
    || typeof pecaValor.forma !== "string"
    || typeof pecaValor.cor !== "string"
    || !formas.has(pecaValor.forma)
    || !cores.has(pecaValor.cor)
  ) {
    throw new BadRequestException("Peça de sequência inválida.");
  }
  return {
    id: pecaValor.id,
    nome: pecaValor.nome,
    forma: pecaValor.forma as FormaSequencia,
    cor: pecaValor.cor as CorSequencia,
  };
}

function validarFiguraEscolha(valor: unknown): FiguraEscolha {
  if (!valor || typeof valor !== "object") {
    throw new BadRequestException("Opção de escolha inválida.");
  }
  const figura = valor as Record<string, unknown>;
  if (
    typeof figura.id !== "string"
    || typeof figura.nome !== "string"
    || typeof figura.simbolo !== "string"
  ) {
    throw new BadRequestException("Opção de escolha inválida.");
  }
  return { id: figura.id, nome: figura.nome, simbolo: figura.simbolo };
}

const motorMemoria: MotorJogo<ConfigMemoria> = {
  id: "memoria",
  validarConfiguracao(config) {
    const bruto = exigirObjeto(config, "memoria");
    if (!Array.isArray(bruto.conjuntos) || bruto.conjuntos.length === 0) {
      throw new BadRequestException("Configuração de memória sem conjuntos.");
    }
    const conjuntos = bruto.conjuntos.map((conjunto) => {
      if (!Array.isArray(conjunto) || conjunto.length === 0) {
        throw new BadRequestException("Conjunto de memória inválido.");
      }
      const cartas = conjunto.flatMap((item) => {
        const faces = validarFiguraMemoria(item);
        if (faces.length === 2) return faces;
        return [faces[0], { ...faces[0] }];
      });
      const ids = cartas.map((carta) => carta.id);
      if (new Set(ids).size * 2 !== ids.length) {
        throw new BadRequestException("Cada chave de par deve aparecer exatamente duas vezes.");
      }
      return cartas;
    });
    return { conjuntos };
  },
  montarConteudo(config, sortear = randomInt) {
    const cartas = config.conjuntos[sortear(config.conjuntos.length)];
    return { tipo: "memoria", cartas: embaralhar([...cartas], sortear) };
  },
};

const motorSequencia: MotorJogo<ConfigSequencia> = {
  id: "sequencia",
  validarConfiguracao(config) {
    const bruto = exigirObjeto(config, "sequencia");
    if (
      typeof bruto.comprimento !== "number"
      || !Number.isInteger(bruto.comprimento)
      || bruto.comprimento < 2
      || typeof bruto.lacuna !== "number"
      || !Number.isInteger(bruto.lacuna)
      || bruto.lacuna < 0
      || bruto.lacuna >= bruto.comprimento
      || !Array.isArray(bruto.padroes)
      || bruto.padroes.length === 0
    ) {
      throw new BadRequestException("Configuração de sequência inválida.");
    }
    const padroes = bruto.padroes.map((padrao) => {
      if (!Array.isArray(padrao) || padrao.length === 0) {
        throw new BadRequestException("Padrão de sequência inválido.");
      }
      return padrao.map(validarFiguraSequencia);
    });
    return {
      comprimento: bruto.comprimento,
      lacuna: bruto.lacuna,
      padroes,
    };
  },
  montarConteudo(config, sortear = randomInt) {
    const padrao = config.padroes[sortear(config.padroes.length)];
    const correta = padrao[config.lacuna % padrao.length];
    const sequencia = Array.from({ length: config.comprimento }, (_, indice) =>
      indice === config.lacuna ? null : padrao[indice % padrao.length],
    );
    const outrasPecas = PECAS_SEQUENCIA.filter((item) => item.id !== correta.id);
    const mesmaForma = embaralhar(
      outrasPecas.filter((item) => item.forma === correta.forma),
      sortear,
    );
    const mesmaCor = embaralhar(
      outrasPecas.filter((item) => item.cor === correta.cor),
      sortear,
    );
    const soMudaCor = padrao.every((item) => item.forma === correta.forma);
    const soMudaForma = padrao.every((item) => item.cor === correta.cor);
    const distratoras = soMudaCor
      ? mesmaForma.slice(0, 2)
      : soMudaForma
        ? mesmaCor.slice(0, 2)
        : [mesmaForma[0], mesmaCor[0]];
    const alternativas = embaralhar([correta, ...distratoras], sortear);
    return {
      tipo: "sequencia",
      sequencia,
      alternativas,
      resposta: correta.id,
    };
  },
};

const motorLabirinto: MotorJogo<ConfigLabirinto> = {
  id: "labirinto",
  validarConfiguracao(config) {
    const bruto = exigirObjeto(config, "labirinto");
    if (!Array.isArray(bruto.mapas) || bruto.mapas.length === 0) {
      throw new BadRequestException("Configuração de labirinto sem mapas.");
    }
    const mapas = bruto.mapas.map((mapa) => {
      if (!Array.isArray(mapa) || mapa.length === 0 || mapa.some((linha) => typeof linha !== "string")) {
        throw new BadRequestException("Mapa de labirinto inválido.");
      }
      return mapa as string[];
    });
    for (const mapa of mapas) {
      if (!mapa.every((linha) => linha.length === mapa[0].length && /^[#.IFP]+$/.test(linha))) {
        throw new BadRequestException("Mapa de labirinto com caracteres inválidos.");
      }
      if (localizarTodos(mapa, "I").length !== 1 || localizarTodos(mapa, "F").length !== 1) {
        throw new BadRequestException("Mapa de labirinto precisa de um início e uma chegada.");
      }
      localizar(mapa, "I");
      localizar(mapa, "F");
    }
    return { mapas };
  },
  montarConteudo(config, sortear = randomInt) {
    const mapa = config.mapas[sortear(config.mapas.length)];
    return {
      tipo: "labirinto",
      mapa,
      inicio: localizar(mapa, "I"),
      chegada: localizar(mapa, "F"),
      pontos: localizarTodos(mapa, "P"),
    };
  },
};

const motorEscolha: MotorJogo<ConfigEscolha> = {
  id: "escolha",
  validarConfiguracao(config) {
    const bruto = exigirObjeto(config, "escolha");
    if (!Array.isArray(bruto.conjuntos) || bruto.conjuntos.length === 0) {
      throw new BadRequestException("Configuração de escolha sem conjuntos.");
    }
    const conjuntos = bruto.conjuntos.map((conjunto) => {
      if (!conjunto || typeof conjunto !== "object" || Array.isArray(conjunto)) {
        throw new BadRequestException("Conjunto de escolha inválido.");
      }
      const item = conjunto as Record<string, unknown>;
      if (typeof item.enunciado !== "string" || item.enunciado.length === 0) {
        throw new BadRequestException("Enunciado de escolha inválido.");
      }
      if (!Array.isArray(item.opcoes) || item.opcoes.length < 2) {
        throw new BadRequestException("Escolha precisa de ao menos duas opções.");
      }
      const opcoes = item.opcoes.map(validarFiguraEscolha);
      if (new Set(opcoes.map((opcao) => opcao.id)).size !== opcoes.length) {
        throw new BadRequestException("Opções de escolha com ids duplicados.");
      }
      if (typeof item.resposta !== "string" || !opcoes.some((opcao) => opcao.id === item.resposta)) {
        throw new BadRequestException("Resposta de escolha inválida.");
      }
      if (item.dica != null && typeof item.dica !== "string") {
        throw new BadRequestException("Dica de escolha inválida.");
      }
      if (item.ocultarNomes != null && typeof item.ocultarNomes !== "boolean") {
        throw new BadRequestException("Configuração de nomes da escolha inválida.");
      }
      return {
        enunciado: item.enunciado,
        opcoes,
        resposta: item.resposta,
        ...(typeof item.dica === "string" ? { dica: item.dica } : {}),
        ...(item.ocultarNomes === true ? { ocultarNomes: true } : {}),
      };
    });
    return { conjuntos };
  },
  montarConteudo(config, sortear = randomInt) {
    const conjunto = config.conjuntos[sortear(config.conjuntos.length)];
    return {
      tipo: "escolha",
      enunciado: conjunto.enunciado,
      opcoes: embaralhar([...conjunto.opcoes], sortear),
      resposta: conjunto.resposta,
      ...(conjunto.dica ? { dica: conjunto.dica } : {}),
      ...(conjunto.ocultarNomes ? { ocultarNomes: true } : {}),
    };
  },
};

function validarCenaOrdenacao(valor: unknown): CenaOrdenacao {
  if (!valor || typeof valor !== "object") {
    throw new BadRequestException("Cena de ordenação inválida.");
  }
  const cena = valor as Record<string, unknown>;
  if (
    typeof cena.id !== "string"
    || typeof cena.nome !== "string"
    || typeof cena.simbolo !== "string"
  ) {
    throw new BadRequestException("Cena de ordenação inválida.");
  }
  return { id: cena.id, nome: cena.nome, simbolo: cena.simbolo };
}

const motorOrdenacao: MotorJogo<ConfigOrdenacao> = {
  id: "ordenacao",
  validarConfiguracao(config) {
    const bruto = exigirObjeto(config, "ordenacao");
    if (!Array.isArray(bruto.conjuntos) || bruto.conjuntos.length === 0) {
      throw new BadRequestException("Configuração de ordenação sem conjuntos.");
    }
    const conjuntos = bruto.conjuntos.map((conjunto) => {
      if (!conjunto || typeof conjunto !== "object" || Array.isArray(conjunto)) {
        throw new BadRequestException("Conjunto de ordenação inválido.");
      }
      const item = conjunto as Record<string, unknown>;
      if (typeof item.enunciado !== "string" || item.enunciado.length === 0) {
        throw new BadRequestException("Enunciado de ordenação inválido.");
      }
      if (!Array.isArray(item.cenas) || item.cenas.length < 2) {
        throw new BadRequestException("Ordenação precisa de ao menos duas cenas.");
      }
      const cenas = item.cenas.map(validarCenaOrdenacao);
      if (item.intrusas != null && !Array.isArray(item.intrusas)) {
        throw new BadRequestException("Cenas intrusas inválidas.");
      }
      const intrusas = (item.intrusas ?? []).map(validarCenaOrdenacao);
      const todas = [...cenas, ...intrusas];
      if (new Set(todas.map((cena) => cena.id)).size !== todas.length) {
        throw new BadRequestException("Cenas de ordenação com ids duplicados.");
      }
      if (item.dica != null && typeof item.dica !== "string") {
        throw new BadRequestException("Dica de ordenação inválida.");
      }
      if (item.ocultarNomes != null && typeof item.ocultarNomes !== "boolean") {
        throw new BadRequestException("Configuração de nomes da ordenação inválida.");
      }
      return {
        enunciado: item.enunciado,
        cenas,
        ...(typeof item.dica === "string" ? { dica: item.dica } : {}),
        ...(item.ocultarNomes === true ? { ocultarNomes: true } : {}),
        ...(intrusas.length ? { intrusas } : {}),
      };
    });
    return { conjuntos };
  },
  montarConteudo(config, sortear = randomInt) {
    const conjunto = config.conjuntos[sortear(config.conjuntos.length)];
    const ordemCorreta = conjunto.cenas.map((cena) => cena.id);
    let cenas = embaralhar([...conjunto.cenas, ...(conjunto.intrusas ?? [])], sortear);
    if (cenas.every((cena, indice) => cena.id === ordemCorreta[indice])) {
      cenas = [...cenas.slice(1), cenas[0]];
    }
    return {
      tipo: "ordenacao",
      enunciado: conjunto.enunciado,
      cenas,
      ordemCorreta,
      ...(conjunto.dica ? { dica: conjunto.dica } : {}),
      ...(conjunto.ocultarNomes ? { ocultarNomes: true } : {}),
      ...(conjunto.intrusas?.length ? { intrusas: conjunto.intrusas.length } : {}),
    };
  },
};

// ---------- Sudoku de figuras (DEV-CAT-M1, ticket 12) ----------

export type ConfigSudoku = Readonly<{
  tamanho: 4 | 6;
  simbolos: readonly FiguraEscolha[];
  grades: readonly Readonly<{ inicial: readonly string[]; solucao: readonly string[] }>[];
}>;

const CAIXAS_SUDOKU: Record<number, readonly [number, number]> = { 4: [2, 2], 6: [2, 3] };

function lerGradeSudoku(linhas: unknown, tamanho: number, permiteVazio: boolean): number[][] {
  if (!Array.isArray(linhas) || linhas.length !== tamanho) {
    throw new BadRequestException("Grade de sudoku inválida.");
  }
  return linhas.map((linha) => {
    if (typeof linha !== "string" || linha.length !== tamanho) {
      throw new BadRequestException("Grade de sudoku inválida.");
    }
    return [...linha].map((x) => {
      if (x === "." && permiteVazio) return 0;
      const v = Number(x);
      if (!Number.isInteger(v) || v < 1 || v > tamanho) throw new BadRequestException("Grade de sudoku inválida.");
      return v;
    });
  });
}

const motorSudoku: MotorJogo<ConfigSudoku> = {
  id: "sudoku",
  validarConfiguracao(config) {
    const bruto = exigirObjeto(config, "sudoku");
    const tamanho = bruto.tamanho;
    if (tamanho !== 4 && tamanho !== 6) throw new BadRequestException("Tamanho de sudoku inválido.");
    if (!Array.isArray(bruto.simbolos) || bruto.simbolos.length !== tamanho) {
      throw new BadRequestException("Símbolos de sudoku inválidos.");
    }
    const simbolos = bruto.simbolos.map(validarFiguraEscolha);
    if (!Array.isArray(bruto.grades) || bruto.grades.length === 0) {
      throw new BadRequestException("Configuração de sudoku sem grades.");
    }
    const grades = bruto.grades.map((grade) => {
      const item = exigirObjeto(grade, "sudoku");
      const inicial = lerGradeSudoku(item.inicial, tamanho, true);
      const solucao = lerGradeSudoku(item.solucao, tamanho, false);
      if (inicial.some((linha, l) => linha.some((v, c) => v !== 0 && v !== solucao[l][c]))) {
        throw new BadRequestException("Grade de sudoku incoerente com a solução.");
      }
      return { inicial: item.inicial as string[], solucao: item.solucao as string[] };
    });
    return { tamanho, simbolos, grades };
  },
  montarConteudo(config, sortear = randomInt) {
    const grade = config.grades[sortear(config.grades.length)];
    const [linhasCaixa, colunasCaixa] = CAIXAS_SUDOKU[config.tamanho];
    return {
      tipo: "sudoku",
      tamanho: config.tamanho,
      caixa: { linhas: linhasCaixa, colunas: colunasCaixa },
      simbolos: config.simbolos,
      inicial: lerGradeSudoku(grade.inicial, config.tamanho, true),
      solucao: lerGradeSudoku(grade.solucao, config.tamanho, false),
    };
  },
};

// ---------- Robô com setas (DEV-CAT-M1, ticket 12): mapa do labirinto, sem pontos ----------

const motorRobo: MotorJogo<ConfigLabirinto> = {
  id: "robo",
  validarConfiguracao(config) {
    const validado = motorLabirinto.validarConfiguracao(config);
    if (validado.mapas.some((mapa) => localizarTodos(mapa, "P").length > 0)) {
      throw new BadRequestException("O robô não usa pontos de entrega.");
    }
    return validado;
  },
  montarConteudo(config, sortear = randomInt) {
    const mapa = config.mapas[sortear(config.mapas.length)];
    return { tipo: "robo", mapa, inicio: localizar(mapa, "I"), chegada: localizar(mapa, "F") };
  },
};

const MOTORES: Record<string, MotorJogo> = {
  memoria: motorMemoria as MotorJogo,
  sequencia: motorSequencia as MotorJogo,
  labirinto: motorLabirinto as MotorJogo,
  escolha: motorEscolha as MotorJogo,
  ordenacao: motorOrdenacao as MotorJogo,
  sudoku: motorSudoku as MotorJogo,
  robo: motorRobo as MotorJogo,
};

export function obterMotor(tipoMecanica: string): MotorJogo {
  const motor = MOTORES[tipoMecanica];
  if (!motor) {
    throw new BadRequestException("Tipo de mecânica de jogo não suportado.");
  }
  return motor;
}

export function montarConteudoMotor(
  tipoMecanica: string,
  configuracao: unknown,
  sortear: (limite: number) => number = randomInt,
) {
  const motor = obterMotor(tipoMecanica);
  const config = motor.validarConfiguracao(configuracao);
  return motor.montarConteudo(config, sortear);
}
