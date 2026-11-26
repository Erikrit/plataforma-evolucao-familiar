/**
 * Marco 1 — jogos novos que substituem os quatro arquivados (DEV-CAT-M1, ticket 12; pedido de 2026-11-26).
 * 15 fases em três trilhas, duas variantes por fase, aprovadas pela régua; conteúdo gerado e congelado.
 */
export const CATALOGO_JOGOS_MARCO1_E5 = [
  {
    id: "sudoku-figuras",
    nome: "Sudoku de figuras",
    descricao: "Complete a grade sem repetir figura na linha, na coluna nem no bloco.",
    categoria: "raciocinio",
    instrucoes: "Toque numa casa vazia e depois na figura. Cada figura aparece uma vez em cada linha, coluna e bloco.",
    tipoMecanica: "sudoku",
    versao: 1,
    faixaEtariaMin: 5,
    faixaEtariaMax: 12,
    ordemEditorial: 9,
    fases: [
      {
        numero: 1,
        trilha: "pequenos",
        titulo: "Sudoku 4×4",
        objetivo: "Complete as 4 casas vazias sem repetir figura na linha, na coluna nem no bloco.",
        dificuldade: "simples",
        configuracao: {
          tamanho: 4,
          simbolos: [
            {
              id: "manga",
              nome: "Manga",
              simbolo: "🥭"
            },
            {
              id: "pessego",
              nome: "Pêssego",
              simbolo: "🍑"
            },
            {
              id: "pera",
              nome: "Pera",
              simbolo: "🍐"
            },
            {
              id: "kiwi",
              nome: "Kiwi",
              simbolo: "🥝"
            }
          ],
          grades: [
            {
              inicial: [
                ".1.2",
                "3214",
                "234.",
                "14.3"
              ],
              solucao: [
                "4132",
                "3214",
                "2341",
                "1423"
              ]
            },
            {
              inicial: [
                "2341",
                ".1.3",
                "3412",
                "12.."
              ],
              solucao: [
                "2341",
                "4123",
                "3412",
                "1234"
              ]
            }
          ]
        }
      },
      {
        numero: 2,
        trilha: "pequenos",
        titulo: "Sudoku 4×4",
        objetivo: "Complete as 5 casas vazias sem repetir figura na linha, na coluna nem no bloco.",
        dificuldade: "simples",
        configuracao: {
          tamanho: 4,
          simbolos: [
            {
              id: "sapo",
              nome: "Sapo",
              simbolo: "🐸"
            },
            {
              id: "peixe",
              nome: "Peixe",
              simbolo: "🐟"
            },
            {
              id: "passaro",
              nome: "Pássaro",
              simbolo: "🐦"
            },
            {
              id: "baleia",
              nome: "Baleia",
              simbolo: "🐳"
            }
          ],
          grades: [
            {
              inicial: [
                "13..",
                "421.",
                "2431",
                ".1.2"
              ],
              solucao: [
                "1324",
                "4213",
                "2431",
                "3142"
              ]
            },
            {
              inicial: [
                "1342",
                "2..1",
                "..24",
                "421."
              ],
              solucao: [
                "1342",
                "2431",
                "3124",
                "4213"
              ]
            }
          ]
        }
      },
      {
        numero: 3,
        trilha: "pequenos",
        titulo: "Sudoku 4×4",
        objetivo: "Complete as 6 casas vazias sem repetir figura na linha, na coluna nem no bloco.",
        dificuldade: "media",
        configuracao: {
          tamanho: 4,
          simbolos: [
            {
              id: "onibus",
              nome: "Ônibus",
              simbolo: "🚌"
            },
            {
              id: "carro",
              nome: "Carro",
              simbolo: "🚗"
            },
            {
              id: "aviao",
              nome: "Avião",
              simbolo: "✈️"
            },
            {
              id: "barco",
              nome: "Barco",
              simbolo: "⛵"
            }
          ],
          grades: [
            {
              inicial: [
                "..31",
                "3..4",
                ".213",
                ".342"
              ],
              solucao: [
                "2431",
                "3124",
                "4213",
                "1342"
              ]
            },
            {
              inicial: [
                "3..4",
                ".231",
                "..42",
                ".413"
              ],
              solucao: [
                "3124",
                "4231",
                "1342",
                "2413"
              ]
            }
          ]
        }
      },
      {
        numero: 4,
        trilha: "pequenos",
        titulo: "Sudoku 4×4",
        objetivo: "Complete as 7 casas vazias sem repetir figura na linha, na coluna nem no bloco.",
        dificuldade: "media",
        configuracao: {
          tamanho: 4,
          simbolos: [
            {
              id: "lua",
              nome: "Lua",
              simbolo: "🌙"
            },
            {
              id: "raio",
              nome: "Raio",
              simbolo: "⚡"
            },
            {
              id: "chuva",
              nome: "Chuva",
              simbolo: "🌧️"
            },
            {
              id: "nuvem",
              nome: "Nuvem",
              simbolo: "☁️"
            }
          ],
          grades: [
            {
              inicial: [
                "3.21",
                "213.",
                "4...",
                "13.."
              ],
              solucao: [
                "3421",
                "2134",
                "4213",
                "1342"
              ]
            },
            {
              inicial: [
                "34..",
                "12.4",
                "..4.",
                "4.23"
              ],
              solucao: [
                "3412",
                "1234",
                "2341",
                "4123"
              ]
            }
          ]
        }
      },
      {
        numero: 5,
        trilha: "pequenos",
        titulo: "Sudoku 4×4",
        objetivo: "Complete as 8 casas vazias sem repetir figura na linha, na coluna nem no bloco.",
        dificuldade: "avancada",
        configuracao: {
          tamanho: 4,
          simbolos: [
            {
              id: "queijo",
              nome: "Queijo",
              simbolo: "🧀"
            },
            {
              id: "bolo",
              nome: "Bolo",
              simbolo: "🎂"
            },
            {
              id: "cenoura",
              nome: "Cenoura",
              simbolo: "🥕"
            },
            {
              id: "biscoito",
              nome: "Biscoito",
              simbolo: "🍪"
            }
          ],
          grades: [
            {
              inicial: [
                "..21",
                "2.3.",
                "3..2",
                ".2.3"
              ],
              solucao: [
                "4321",
                "2134",
                "3412",
                "1243"
              ]
            },
            {
              inicial: [
                "...1",
                ".42.",
                "3.14",
                "..32"
              ],
              solucao: [
                "2341",
                "1423",
                "3214",
                "4132"
              ]
            }
          ]
        }
      },
      {
        numero: 6,
        trilha: "medios",
        titulo: "Sudoku 6×6",
        objetivo: "Complete as 12 casas vazias sem repetir figura na linha, na coluna nem no bloco.",
        dificuldade: "simples",
        configuracao: {
          tamanho: 6,
          simbolos: [
            {
              id: "morango",
              nome: "Morango",
              simbolo: "🍓"
            },
            {
              id: "coco",
              nome: "Coco",
              simbolo: "🥥"
            },
            {
              id: "melancia",
              nome: "Melancia",
              simbolo: "🍉"
            },
            {
              id: "abacaxi",
              nome: "Abacaxi",
              simbolo: "🍍"
            },
            {
              id: "maca",
              nome: "Maçã",
              simbolo: "🍎"
            },
            {
              id: "pera",
              nome: "Pera",
              simbolo: "🍐"
            }
          ],
          grades: [
            {
              inicial: [
                "524.13",
                "36..54",
                "13.462",
                "...5..",
                "2..146",
                "4163.5"
              ],
              solucao: [
                "524613",
                "361254",
                "135462",
                "642531",
                "253146",
                "416325"
              ]
            },
            {
              inicial: [
                "5.634.",
                ".32.61",
                "..54..",
                "143256",
                ".641.5",
                "2.163."
              ],
              solucao: [
                "516342",
                "432561",
                "625413",
                "143256",
                "364125",
                "251634"
              ]
            }
          ]
        }
      },
      {
        numero: 7,
        trilha: "medios",
        titulo: "Sudoku 6×6",
        objetivo: "Complete as 14 casas vazias sem repetir figura na linha, na coluna nem no bloco.",
        dificuldade: "simples",
        configuracao: {
          tamanho: 6,
          simbolos: [
            {
              id: "porco",
              nome: "Porco",
              simbolo: "🐖"
            },
            {
              id: "caranguejo",
              nome: "Caranguejo",
              simbolo: "🦀"
            },
            {
              id: "rato",
              nome: "Rato",
              simbolo: "🐭"
            },
            {
              id: "pato",
              nome: "Pato",
              simbolo: "🦆"
            },
            {
              id: "galinha",
              nome: "Galinha",
              simbolo: "🐔"
            },
            {
              id: "ovelha",
              nome: "Ovelha",
              simbolo: "🐑"
            }
          ],
          grades: [
            {
              inicial: [
                ".245.6",
                "..3.1.",
                "...362",
                "23.14.",
                "34.651",
                "65.4.3"
              ],
              solucao: [
                "124536",
                "563214",
                "415362",
                "236145",
                "342651",
                "651423"
              ]
            },
            {
              inicial: [
                "6..21.",
                "123465",
                "56.34.",
                ".3265.",
                "2..5..",
                ".56..4"
              ],
              solucao: [
                "645213",
                "123465",
                "561342",
                "432651",
                "214536",
                "356124"
              ]
            }
          ]
        }
      },
      {
        numero: 8,
        trilha: "medios",
        titulo: "Sudoku 6×6",
        objetivo: "Complete as 16 casas vazias sem repetir figura na linha, na coluna nem no bloco.",
        dificuldade: "media",
        configuracao: {
          tamanho: 6,
          simbolos: [
            {
              id: "barco",
              nome: "Barco",
              simbolo: "⛵"
            },
            {
              id: "trem",
              nome: "Trem",
              simbolo: "🚂"
            },
            {
              id: "trator",
              nome: "Trator",
              simbolo: "🚜"
            },
            {
              id: "carro",
              nome: "Carro",
              simbolo: "🚗"
            },
            {
              id: "moto",
              nome: "Moto",
              simbolo: "🛵"
            },
            {
              id: "helicoptero",
              nome: "Helicóptero",
              simbolo: "🚁"
            }
          ],
          grades: [
            {
              inicial: [
                "4..62.",
                "65214.",
                "345..6",
                ".6..3.",
                "1.6.52",
                ".2...1"
              ],
              solucao: [
                "413625",
                "652143",
                "345216",
                "261534",
                "136452",
                "524361"
              ]
            },
            {
              inicial: [
                "341.2.",
                "5.63..",
                "1324.6",
                ".6...1",
                "..4163",
                "...54."
              ],
              solucao: [
                "341625",
                "526314",
                "132456",
                "465231",
                "254163",
                "613542"
              ]
            }
          ]
        }
      },
      {
        numero: 9,
        trilha: "medios",
        titulo: "Sudoku 6×6",
        objetivo: "Complete as 18 casas vazias sem repetir figura na linha, na coluna nem no bloco.",
        dificuldade: "media",
        configuracao: {
          tamanho: 6,
          simbolos: [
            {
              id: "sol",
              nome: "Sol",
              simbolo: "☀️"
            },
            {
              id: "arco-iris",
              nome: "Arco-íris",
              simbolo: "🌈"
            },
            {
              id: "lua",
              nome: "Lua",
              simbolo: "🌙"
            },
            {
              id: "nuvem",
              nome: "Nuvem",
              simbolo: "☁️"
            },
            {
              id: "floco",
              nome: "Floco de neve",
              simbolo: "❄️"
            },
            {
              id: "cometa",
              nome: "Cometa",
              simbolo: "☄️"
            }
          ],
          grades: [
            {
              inicial: [
                "3...21",
                ".423..",
                "6...14",
                "2..6..",
                "53.1.2",
                "4..5.3"
              ],
              solucao: [
                "365421",
                "142356",
                "653214",
                "214635",
                "536142",
                "421563"
              ]
            },
            {
              inicial: [
                "4.2136",
                ".6..45",
                ".3....",
                ".24.53",
                "..6.12",
                "..35.."
              ],
              solucao: [
                "452136",
                "361245",
                "635421",
                "124653",
                "546312",
                "213564"
              ]
            }
          ]
        }
      },
      {
        numero: 10,
        trilha: "medios",
        titulo: "Sudoku 6×6",
        objetivo: "Complete as 20 casas vazias sem repetir figura na linha, na coluna nem no bloco.",
        dificuldade: "avancada",
        configuracao: {
          tamanho: 6,
          simbolos: [
            {
              id: "ovo",
              nome: "Ovo",
              simbolo: "🥚"
            },
            {
              id: "cenoura",
              nome: "Cenoura",
              simbolo: "🥕"
            },
            {
              id: "pao",
              nome: "Pão",
              simbolo: "🍞"
            },
            {
              id: "bolo",
              nome: "Bolo",
              simbolo: "🎂"
            },
            {
              id: "biscoito",
              nome: "Biscoito",
              simbolo: "🍪"
            },
            {
              id: "brocolis",
              nome: "Brócolis",
              simbolo: "🥦"
            }
          ],
          grades: [
            {
              inicial: [
                "6.4..3",
                "......",
                ".4..32",
                ".2.5.4",
                "46....",
                "2.1456"
              ],
              solucao: [
                "654213",
                "312645",
                "546132",
                "123564",
                "465321",
                "231456"
              ]
            },
            {
              inicial: [
                "31.4..",
                ".46...",
                ".5.36.",
                "6.3.41",
                "1.5...",
                ".6..3."
              ],
              solucao: [
                "312456",
                "546213",
                "451362",
                "623541",
                "135624",
                "264135"
              ]
            }
          ]
        }
      },
      {
        numero: 11,
        trilha: "grandes",
        titulo: "Sudoku 6×6",
        objetivo: "Complete as 21 casas vazias sem repetir figura na linha, na coluna nem no bloco.",
        dificuldade: "simples",
        configuracao: {
          tamanho: 6,
          simbolos: [
            {
              id: "uva",
              nome: "Uva",
              simbolo: "🍇"
            },
            {
              id: "cereja",
              nome: "Cereja",
              simbolo: "🍒"
            },
            {
              id: "manga",
              nome: "Manga",
              simbolo: "🥭"
            },
            {
              id: "maca",
              nome: "Maçã",
              simbolo: "🍎"
            },
            {
              id: "kiwi",
              nome: "Kiwi",
              simbolo: "🥝"
            },
            {
              id: "limao",
              nome: "Limão",
              simbolo: "🍋"
            }
          ],
          grades: [
            {
              inicial: [
                "....56",
                "52...3",
                "..56..",
                ".6134.",
                "1.4..2",
                "....3."
              ],
              solucao: [
                "413256",
                "526413",
                "345621",
                "261345",
                "134562",
                "652134"
              ]
            },
            {
              inicial: [
                "2.315.",
                ".51...",
                "..2...",
                "1....5",
                "...6.4",
                ".2653."
              ],
              solucao: [
                "243156",
                "651342",
                "562413",
                "134265",
                "315624",
                "426531"
              ]
            }
          ]
        }
      },
      {
        numero: 12,
        trilha: "grandes",
        titulo: "Sudoku 6×6",
        objetivo: "Complete as 22 casas vazias sem repetir figura na linha, na coluna nem no bloco.",
        dificuldade: "simples",
        configuracao: {
          tamanho: 6,
          simbolos: [
            {
              id: "peixe",
              nome: "Peixe",
              simbolo: "🐟"
            },
            {
              id: "caracol",
              nome: "Caracol",
              simbolo: "🐌"
            },
            {
              id: "passaro",
              nome: "Pássaro",
              simbolo: "🐦"
            },
            {
              id: "caranguejo",
              nome: "Caranguejo",
              simbolo: "🦀"
            },
            {
              id: "gato",
              nome: "Gato",
              simbolo: "🐈"
            },
            {
              id: "rato",
              nome: "Rato",
              simbolo: "🐭"
            }
          ],
          grades: [
            {
              inicial: [
                "..2.41",
                "3.4...",
                "...2.4",
                "2..13.",
                ".6..2.",
                "5.3..."
              ],
              solucao: [
                "652341",
                "314652",
                "135264",
                "246135",
                "461523",
                "523416"
              ]
            },
            {
              inicial: [
                "26....",
                "1.5...",
                ".2..64",
                "..6.3.",
                ".13...",
                "..24.3"
              ],
              solucao: [
                "264351",
                "135246",
                "321564",
                "546132",
                "413625",
                "652413"
              ]
            }
          ]
        }
      },
      {
        numero: 13,
        trilha: "grandes",
        titulo: "Sudoku 6×6",
        objetivo: "Complete as 23 casas vazias sem repetir figura na linha, na coluna nem no bloco.",
        dificuldade: "media",
        configuracao: {
          tamanho: 6,
          simbolos: [
            {
              id: "trem",
              nome: "Trem",
              simbolo: "🚂"
            },
            {
              id: "foguete",
              nome: "Foguete",
              simbolo: "🚀"
            },
            {
              id: "carro",
              nome: "Carro",
              simbolo: "🚗"
            },
            {
              id: "patinete",
              nome: "Patinete",
              simbolo: "🛴"
            },
            {
              id: "trator",
              nome: "Trator",
              simbolo: "🚜"
            },
            {
              id: "aviao",
              nome: "Avião",
              simbolo: "✈️"
            }
          ],
          grades: [
            {
              inicial: [
                "4...3.",
                ".5....",
                "5...2.",
                ".4..63",
                "..534.",
                ".2...1"
              ],
              solucao: [
                "461235",
                "253416",
                "536124",
                "142563",
                "615342",
                "324651"
              ]
            },
            {
              inicial: [
                "...32.",
                "34..56",
                "......",
                "1.35..",
                "..4...",
                "...415"
              ],
              solucao: [
                "651324",
                "342156",
                "425631",
                "163542",
                "514263",
                "236415"
              ]
            }
          ]
        }
      },
      {
        numero: 14,
        trilha: "grandes",
        titulo: "Sudoku 6×6",
        objetivo: "Complete as 24 casas vazias sem repetir figura na linha, na coluna nem no bloco.",
        dificuldade: "media",
        configuracao: {
          tamanho: 6,
          simbolos: [
            {
              id: "floco",
              nome: "Floco de neve",
              simbolo: "❄️"
            },
            {
              id: "lua",
              nome: "Lua",
              simbolo: "🌙"
            },
            {
              id: "sol",
              nome: "Sol",
              simbolo: "☀️"
            },
            {
              id: "chuva",
              nome: "Chuva",
              simbolo: "🌧️"
            },
            {
              id: "cometa",
              nome: "Cometa",
              simbolo: "☄️"
            },
            {
              id: "arco-iris",
              nome: "Arco-íris",
              simbolo: "🌈"
            }
          ],
          grades: [
            {
              inicial: [
                ".3.6..",
                "....23",
                "..61..",
                ".....2",
                "34...6",
                "2...5."
              ],
              solucao: [
                "532641",
                "614523",
                "426135",
                "153462",
                "345216",
                "261354"
              ]
            },
            {
              inicial: [
                "3...2.",
                "...4.5",
                ".6.5..",
                "4...6.",
                ".....6",
                "14.2.."
              ],
              solucao: [
                "354621",
                "621435",
                "263514",
                "415362",
                "532146",
                "146253"
              ]
            }
          ]
        }
      },
      {
        numero: 15,
        trilha: "grandes",
        titulo: "Sudoku 6×6",
        objetivo: "Complete as 25 casas vazias sem repetir figura na linha, na coluna nem no bloco.",
        dificuldade: "avancada",
        configuracao: {
          tamanho: 6,
          simbolos: [
            {
              id: "queijo",
              nome: "Queijo",
              simbolo: "🧀"
            },
            {
              id: "batata",
              nome: "Batata",
              simbolo: "🥔"
            },
            {
              id: "milho",
              nome: "Milho",
              simbolo: "🌽"
            },
            {
              id: "brocolis",
              nome: "Brócolis",
              simbolo: "🥦"
            },
            {
              id: "sanduiche",
              nome: "Sanduíche",
              simbolo: "🥪"
            },
            {
              id: "ovo",
              nome: "Ovo",
              simbolo: "🥚"
            }
          ],
          grades: [
            {
              inicial: [
                "....1.",
                ".4.2..",
                "..5..6",
                "....25",
                "31....",
                ".6..3."
              ],
              solucao: [
                "253614",
                "641253",
                "125346",
                "436125",
                "314562",
                "562431"
              ]
            },
            {
              inicial: [
                "56..4.",
                "......",
                "...6.3",
                "..2...",
                ".5.43.",
                "..45.."
              ],
              solucao: [
                "563241",
                "241365",
                "415623",
                "632154",
                "156432",
                "324516"
              ]
            }
          ]
        }
      }
    ]
  },
  {
    id: "forme-palavra",
    nome: "Forme a palavra",
    descricao: "Ordene as letras para escrever o nome da figura.",
    categoria: "linguagem",
    instrucoes: "Olhe a figura e toque nas letras na ordem certa. Nas fases maiores, algumas letras sobram. Use Desfazer se precisar.",
    tipoMecanica: "ordenacao",
    versao: 1,
    faixaEtariaMin: 5,
    faixaEtariaMax: 12,
    ordemEditorial: 10,
    fases: [
      {
        numero: 1,
        trilha: "pequenos",
        titulo: "3 letras",
        objetivo: "Forme a palavra com 3 letras.",
        dificuldade: "simples",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Forme a palavra da figura ☀️",
              cenas: [
                {
                  id: "sol-0",
                  nome: "S",
                  simbolo: "S"
                },
                {
                  id: "sol-1",
                  nome: "O",
                  simbolo: "O"
                },
                {
                  id: "sol-2",
                  nome: "L",
                  simbolo: "L"
                }
              ]
            },
            {
              enunciado: "Forme a palavra da figura 🌙",
              cenas: [
                {
                  id: "lua-0",
                  nome: "L",
                  simbolo: "L"
                },
                {
                  id: "lua-1",
                  nome: "U",
                  simbolo: "U"
                },
                {
                  id: "lua-2",
                  nome: "A",
                  simbolo: "A"
                }
              ]
            }
          ]
        }
      },
      {
        numero: 2,
        trilha: "pequenos",
        titulo: "4 letras",
        objetivo: "Forme a palavra com 4 letras.",
        dificuldade: "simples",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Forme a palavra da figura 🐈",
              cenas: [
                {
                  id: "gato-0",
                  nome: "G",
                  simbolo: "G"
                },
                {
                  id: "gato-1",
                  nome: "A",
                  simbolo: "A"
                },
                {
                  id: "gato-2",
                  nome: "T",
                  simbolo: "T"
                },
                {
                  id: "gato-3",
                  nome: "O",
                  simbolo: "O"
                }
              ],
              dica: "A palavra começa com G."
            },
            {
              enunciado: "Forme a palavra da figura 🦆",
              cenas: [
                {
                  id: "pato-0",
                  nome: "P",
                  simbolo: "P"
                },
                {
                  id: "pato-1",
                  nome: "A",
                  simbolo: "A"
                },
                {
                  id: "pato-2",
                  nome: "T",
                  simbolo: "T"
                },
                {
                  id: "pato-3",
                  nome: "O",
                  simbolo: "O"
                }
              ],
              dica: "A palavra começa com P."
            }
          ]
        }
      },
      {
        numero: 3,
        trilha: "pequenos",
        titulo: "4 letras",
        objetivo: "Forme a palavra com 4 letras.",
        dificuldade: "media",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Forme a palavra da figura 🐸",
              cenas: [
                {
                  id: "sapo-0",
                  nome: "S",
                  simbolo: "S"
                },
                {
                  id: "sapo-1",
                  nome: "A",
                  simbolo: "A"
                },
                {
                  id: "sapo-2",
                  nome: "P",
                  simbolo: "P"
                },
                {
                  id: "sapo-3",
                  nome: "O",
                  simbolo: "O"
                }
              ]
            },
            {
              enunciado: "Forme a palavra da figura 🍐",
              cenas: [
                {
                  id: "pera-0",
                  nome: "P",
                  simbolo: "P"
                },
                {
                  id: "pera-1",
                  nome: "E",
                  simbolo: "E"
                },
                {
                  id: "pera-2",
                  nome: "R",
                  simbolo: "R"
                },
                {
                  id: "pera-3",
                  nome: "A",
                  simbolo: "A"
                }
              ]
            }
          ]
        }
      },
      {
        numero: 4,
        trilha: "pequenos",
        titulo: "5 letras",
        objetivo: "Forme a palavra com 5 letras.",
        dificuldade: "media",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Forme a palavra da figura 📘",
              cenas: [
                {
                  id: "livro-0",
                  nome: "L",
                  simbolo: "L"
                },
                {
                  id: "livro-1",
                  nome: "I",
                  simbolo: "I"
                },
                {
                  id: "livro-2",
                  nome: "V",
                  simbolo: "V"
                },
                {
                  id: "livro-3",
                  nome: "R",
                  simbolo: "R"
                },
                {
                  id: "livro-4",
                  nome: "O",
                  simbolo: "O"
                }
              ],
              dica: "A palavra começa com L."
            },
            {
              enunciado: "Forme a palavra da figura ⛵",
              cenas: [
                {
                  id: "barco-0",
                  nome: "B",
                  simbolo: "B"
                },
                {
                  id: "barco-1",
                  nome: "A",
                  simbolo: "A"
                },
                {
                  id: "barco-2",
                  nome: "R",
                  simbolo: "R"
                },
                {
                  id: "barco-3",
                  nome: "C",
                  simbolo: "C"
                },
                {
                  id: "barco-4",
                  nome: "O",
                  simbolo: "O"
                }
              ],
              dica: "A palavra começa com B."
            }
          ]
        }
      },
      {
        numero: 5,
        trilha: "pequenos",
        titulo: "5 letras",
        objetivo: "Forme a palavra com 5 letras.",
        dificuldade: "avancada",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Forme a palavra da figura ☁️",
              cenas: [
                {
                  id: "nuvem-0",
                  nome: "N",
                  simbolo: "N"
                },
                {
                  id: "nuvem-1",
                  nome: "U",
                  simbolo: "U"
                },
                {
                  id: "nuvem-2",
                  nome: "V",
                  simbolo: "V"
                },
                {
                  id: "nuvem-3",
                  nome: "E",
                  simbolo: "E"
                },
                {
                  id: "nuvem-4",
                  nome: "M",
                  simbolo: "M"
                }
              ]
            },
            {
              enunciado: "Forme a palavra da figura 🌽",
              cenas: [
                {
                  id: "milho-0",
                  nome: "M",
                  simbolo: "M"
                },
                {
                  id: "milho-1",
                  nome: "I",
                  simbolo: "I"
                },
                {
                  id: "milho-2",
                  nome: "L",
                  simbolo: "L"
                },
                {
                  id: "milho-3",
                  nome: "H",
                  simbolo: "H"
                },
                {
                  id: "milho-4",
                  nome: "O",
                  simbolo: "O"
                }
              ]
            }
          ]
        }
      },
      {
        numero: 6,
        trilha: "medios",
        titulo: "5 letras e 1 sobra",
        objetivo: "Forme a palavra com 5 letras; uma letra sobra.",
        dificuldade: "simples",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Forme a palavra da figura 🍋",
              cenas: [
                {
                  id: "limão-0",
                  nome: "L",
                  simbolo: "L"
                },
                {
                  id: "limão-1",
                  nome: "I",
                  simbolo: "I"
                },
                {
                  id: "limão-2",
                  nome: "M",
                  simbolo: "M"
                },
                {
                  id: "limão-3",
                  nome: "Ã",
                  simbolo: "Ã"
                },
                {
                  id: "limão-4",
                  nome: "O",
                  simbolo: "O"
                }
              ],
              intrusas: [
                {
                  id: "limão-x0",
                  nome: "D",
                  simbolo: "D"
                }
              ],
              dica: "A palavra começa com L."
            },
            {
              enunciado: "Forme a palavra da figura ✈️",
              cenas: [
                {
                  id: "avião-0",
                  nome: "A",
                  simbolo: "A"
                },
                {
                  id: "avião-1",
                  nome: "V",
                  simbolo: "V"
                },
                {
                  id: "avião-2",
                  nome: "I",
                  simbolo: "I"
                },
                {
                  id: "avião-3",
                  nome: "Ã",
                  simbolo: "Ã"
                },
                {
                  id: "avião-4",
                  nome: "O",
                  simbolo: "O"
                }
              ],
              intrusas: [
                {
                  id: "avião-x0",
                  nome: "C",
                  simbolo: "C"
                }
              ],
              dica: "A palavra começa com A."
            }
          ]
        }
      },
      {
        numero: 7,
        trilha: "medios",
        titulo: "6 letras e 1 sobra",
        objetivo: "Forme a palavra com 6 letras; uma letra sobra.",
        dificuldade: "simples",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Forme a palavra da figura 🧀",
              cenas: [
                {
                  id: "queijo-0",
                  nome: "Q",
                  simbolo: "Q"
                },
                {
                  id: "queijo-1",
                  nome: "U",
                  simbolo: "U"
                },
                {
                  id: "queijo-2",
                  nome: "E",
                  simbolo: "E"
                },
                {
                  id: "queijo-3",
                  nome: "I",
                  simbolo: "I"
                },
                {
                  id: "queijo-4",
                  nome: "J",
                  simbolo: "J"
                },
                {
                  id: "queijo-5",
                  nome: "O",
                  simbolo: "O"
                }
              ],
              intrusas: [
                {
                  id: "queijo-x0",
                  nome: "V",
                  simbolo: "V"
                }
              ],
              dica: "A palavra começa com Q."
            },
            {
              enunciado: "Forme a palavra da figura 🐫",
              cenas: [
                {
                  id: "camelo-0",
                  nome: "C",
                  simbolo: "C"
                },
                {
                  id: "camelo-1",
                  nome: "A",
                  simbolo: "A"
                },
                {
                  id: "camelo-2",
                  nome: "M",
                  simbolo: "M"
                },
                {
                  id: "camelo-3",
                  nome: "E",
                  simbolo: "E"
                },
                {
                  id: "camelo-4",
                  nome: "L",
                  simbolo: "L"
                },
                {
                  id: "camelo-5",
                  nome: "O",
                  simbolo: "O"
                }
              ],
              intrusas: [
                {
                  id: "camelo-x0",
                  nome: "Z",
                  simbolo: "Z"
                }
              ],
              dica: "A palavra começa com C."
            }
          ]
        }
      },
      {
        numero: 8,
        trilha: "medios",
        titulo: "6 letras e 1 sobra",
        objetivo: "Forme a palavra com 6 letras; uma letra sobra.",
        dificuldade: "media",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Forme a palavra da figura 🏫",
              cenas: [
                {
                  id: "escola-0",
                  nome: "E",
                  simbolo: "E"
                },
                {
                  id: "escola-1",
                  nome: "S",
                  simbolo: "S"
                },
                {
                  id: "escola-2",
                  nome: "C",
                  simbolo: "C"
                },
                {
                  id: "escola-3",
                  nome: "O",
                  simbolo: "O"
                },
                {
                  id: "escola-4",
                  nome: "L",
                  simbolo: "L"
                },
                {
                  id: "escola-5",
                  nome: "A",
                  simbolo: "A"
                }
              ],
              intrusas: [
                {
                  id: "escola-x0",
                  nome: "J",
                  simbolo: "J"
                }
              ]
            },
            {
              enunciado: "Forme a palavra da figura 🍗",
              cenas: [
                {
                  id: "frango-0",
                  nome: "F",
                  simbolo: "F"
                },
                {
                  id: "frango-1",
                  nome: "R",
                  simbolo: "R"
                },
                {
                  id: "frango-2",
                  nome: "A",
                  simbolo: "A"
                },
                {
                  id: "frango-3",
                  nome: "N",
                  simbolo: "N"
                },
                {
                  id: "frango-4",
                  nome: "G",
                  simbolo: "G"
                },
                {
                  id: "frango-5",
                  nome: "O",
                  simbolo: "O"
                }
              ],
              intrusas: [
                {
                  id: "frango-x0",
                  nome: "L",
                  simbolo: "L"
                }
              ]
            }
          ]
        }
      },
      {
        numero: 9,
        trilha: "medios",
        titulo: "6 letras e 2 sobras",
        objetivo: "Forme a palavra com 6 letras; 2 letras sobram.",
        dificuldade: "media",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Forme a palavra da figura 🦉",
              cenas: [
                {
                  id: "coruja-0",
                  nome: "C",
                  simbolo: "C"
                },
                {
                  id: "coruja-1",
                  nome: "O",
                  simbolo: "O"
                },
                {
                  id: "coruja-2",
                  nome: "R",
                  simbolo: "R"
                },
                {
                  id: "coruja-3",
                  nome: "U",
                  simbolo: "U"
                },
                {
                  id: "coruja-4",
                  nome: "J",
                  simbolo: "J"
                },
                {
                  id: "coruja-5",
                  nome: "A",
                  simbolo: "A"
                }
              ],
              intrusas: [
                {
                  id: "coruja-x0",
                  nome: "N",
                  simbolo: "N"
                },
                {
                  id: "coruja-x1",
                  nome: "S",
                  simbolo: "S"
                }
              ],
              dica: "A palavra começa com C."
            },
            {
              enunciado: "Forme a palavra da figura 🥣",
              cenas: [
                {
                  id: "tigela-0",
                  nome: "T",
                  simbolo: "T"
                },
                {
                  id: "tigela-1",
                  nome: "I",
                  simbolo: "I"
                },
                {
                  id: "tigela-2",
                  nome: "G",
                  simbolo: "G"
                },
                {
                  id: "tigela-3",
                  nome: "E",
                  simbolo: "E"
                },
                {
                  id: "tigela-4",
                  nome: "L",
                  simbolo: "L"
                },
                {
                  id: "tigela-5",
                  nome: "A",
                  simbolo: "A"
                }
              ],
              intrusas: [
                {
                  id: "tigela-x0",
                  nome: "O",
                  simbolo: "O"
                },
                {
                  id: "tigela-x1",
                  nome: "P",
                  simbolo: "P"
                }
              ],
              dica: "A palavra começa com T."
            }
          ]
        }
      },
      {
        numero: 10,
        trilha: "medios",
        titulo: "7 letras e 2 sobras",
        objetivo: "Forme a palavra com 7 letras; 2 letras sobram.",
        dificuldade: "avancada",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Forme a palavra da figura 🎒",
              cenas: [
                {
                  id: "mochila-0",
                  nome: "M",
                  simbolo: "M"
                },
                {
                  id: "mochila-1",
                  nome: "O",
                  simbolo: "O"
                },
                {
                  id: "mochila-2",
                  nome: "C",
                  simbolo: "C"
                },
                {
                  id: "mochila-3",
                  nome: "H",
                  simbolo: "H"
                },
                {
                  id: "mochila-4",
                  nome: "I",
                  simbolo: "I"
                },
                {
                  id: "mochila-5",
                  nome: "L",
                  simbolo: "L"
                },
                {
                  id: "mochila-6",
                  nome: "A",
                  simbolo: "A"
                }
              ],
              intrusas: [
                {
                  id: "mochila-x0",
                  nome: "G",
                  simbolo: "G"
                },
                {
                  id: "mochila-x1",
                  nome: "R",
                  simbolo: "R"
                }
              ],
              dica: "A palavra começa com M."
            },
            {
              enunciado: "Forme a palavra da figura 📒",
              cenas: [
                {
                  id: "caderno-0",
                  nome: "C",
                  simbolo: "C"
                },
                {
                  id: "caderno-1",
                  nome: "A",
                  simbolo: "A"
                },
                {
                  id: "caderno-2",
                  nome: "D",
                  simbolo: "D"
                },
                {
                  id: "caderno-3",
                  nome: "E",
                  simbolo: "E"
                },
                {
                  id: "caderno-4",
                  nome: "R",
                  simbolo: "R"
                },
                {
                  id: "caderno-5",
                  nome: "N",
                  simbolo: "N"
                },
                {
                  id: "caderno-6",
                  nome: "O",
                  simbolo: "O"
                }
              ],
              intrusas: [
                {
                  id: "caderno-x0",
                  nome: "J",
                  simbolo: "J"
                },
                {
                  id: "caderno-x1",
                  nome: "I",
                  simbolo: "I"
                }
              ],
              dica: "A palavra começa com C."
            }
          ]
        }
      },
      {
        numero: 11,
        trilha: "grandes",
        titulo: "7 letras e 2 sobras",
        objetivo: "Forme a palavra com 7 letras; 2 letras sobram.",
        dificuldade: "simples",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Forme a palavra da figura 🐿️",
              cenas: [
                {
                  id: "esquilo-0",
                  nome: "E",
                  simbolo: "E"
                },
                {
                  id: "esquilo-1",
                  nome: "S",
                  simbolo: "S"
                },
                {
                  id: "esquilo-2",
                  nome: "Q",
                  simbolo: "Q"
                },
                {
                  id: "esquilo-3",
                  nome: "U",
                  simbolo: "U"
                },
                {
                  id: "esquilo-4",
                  nome: "I",
                  simbolo: "I"
                },
                {
                  id: "esquilo-5",
                  nome: "L",
                  simbolo: "L"
                },
                {
                  id: "esquilo-6",
                  nome: "O",
                  simbolo: "O"
                }
              ],
              intrusas: [
                {
                  id: "esquilo-x0",
                  nome: "P",
                  simbolo: "P"
                },
                {
                  id: "esquilo-x1",
                  nome: "Z",
                  simbolo: "Z"
                }
              ]
            },
            {
              enunciado: "Forme a palavra da figura 🌶️",
              cenas: [
                {
                  id: "pimenta-0",
                  nome: "P",
                  simbolo: "P"
                },
                {
                  id: "pimenta-1",
                  nome: "I",
                  simbolo: "I"
                },
                {
                  id: "pimenta-2",
                  nome: "M",
                  simbolo: "M"
                },
                {
                  id: "pimenta-3",
                  nome: "E",
                  simbolo: "E"
                },
                {
                  id: "pimenta-4",
                  nome: "N",
                  simbolo: "N"
                },
                {
                  id: "pimenta-5",
                  nome: "T",
                  simbolo: "T"
                },
                {
                  id: "pimenta-6",
                  nome: "A",
                  simbolo: "A"
                }
              ],
              intrusas: [
                {
                  id: "pimenta-x0",
                  nome: "B",
                  simbolo: "B"
                },
                {
                  id: "pimenta-x1",
                  nome: "H",
                  simbolo: "H"
                }
              ]
            }
          ]
        }
      },
      {
        numero: 12,
        trilha: "grandes",
        titulo: "7 letras e 3 sobras",
        objetivo: "Forme a palavra com 7 letras; 3 letras sobram.",
        dificuldade: "simples",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Forme a palavra da figura 🦈",
              cenas: [
                {
                  id: "tubarão-0",
                  nome: "T",
                  simbolo: "T"
                },
                {
                  id: "tubarão-1",
                  nome: "U",
                  simbolo: "U"
                },
                {
                  id: "tubarão-2",
                  nome: "B",
                  simbolo: "B"
                },
                {
                  id: "tubarão-3",
                  nome: "A",
                  simbolo: "A"
                },
                {
                  id: "tubarão-4",
                  nome: "R",
                  simbolo: "R"
                },
                {
                  id: "tubarão-5",
                  nome: "Ã",
                  simbolo: "Ã"
                },
                {
                  id: "tubarão-6",
                  nome: "O",
                  simbolo: "O"
                }
              ],
              intrusas: [
                {
                  id: "tubarão-x0",
                  nome: "E",
                  simbolo: "E"
                },
                {
                  id: "tubarão-x1",
                  nome: "C",
                  simbolo: "C"
                },
                {
                  id: "tubarão-x2",
                  nome: "G",
                  simbolo: "G"
                }
              ],
              dica: "A palavra começa com T."
            },
            {
              enunciado: "Forme a palavra da figura 🩴",
              cenas: [
                {
                  id: "chinelo-0",
                  nome: "C",
                  simbolo: "C"
                },
                {
                  id: "chinelo-1",
                  nome: "H",
                  simbolo: "H"
                },
                {
                  id: "chinelo-2",
                  nome: "I",
                  simbolo: "I"
                },
                {
                  id: "chinelo-3",
                  nome: "N",
                  simbolo: "N"
                },
                {
                  id: "chinelo-4",
                  nome: "E",
                  simbolo: "E"
                },
                {
                  id: "chinelo-5",
                  nome: "L",
                  simbolo: "L"
                },
                {
                  id: "chinelo-6",
                  nome: "O",
                  simbolo: "O"
                }
              ],
              intrusas: [
                {
                  id: "chinelo-x0",
                  nome: "F",
                  simbolo: "F"
                },
                {
                  id: "chinelo-x1",
                  nome: "G",
                  simbolo: "G"
                },
                {
                  id: "chinelo-x2",
                  nome: "A",
                  simbolo: "A"
                }
              ],
              dica: "A palavra começa com C."
            }
          ]
        }
      },
      {
        numero: 13,
        trilha: "grandes",
        titulo: "8 letras e 3 sobras",
        objetivo: "Forme a palavra com 8 letras; 3 letras sobram.",
        dificuldade: "media",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Forme a palavra da figura 🦩",
              cenas: [
                {
                  id: "flamingo-0",
                  nome: "F",
                  simbolo: "F"
                },
                {
                  id: "flamingo-1",
                  nome: "L",
                  simbolo: "L"
                },
                {
                  id: "flamingo-2",
                  nome: "A",
                  simbolo: "A"
                },
                {
                  id: "flamingo-3",
                  nome: "M",
                  simbolo: "M"
                },
                {
                  id: "flamingo-4",
                  nome: "I",
                  simbolo: "I"
                },
                {
                  id: "flamingo-5",
                  nome: "N",
                  simbolo: "N"
                },
                {
                  id: "flamingo-6",
                  nome: "G",
                  simbolo: "G"
                },
                {
                  id: "flamingo-7",
                  nome: "O",
                  simbolo: "O"
                }
              ],
              intrusas: [
                {
                  id: "flamingo-x0",
                  nome: "B",
                  simbolo: "B"
                },
                {
                  id: "flamingo-x1",
                  nome: "H",
                  simbolo: "H"
                },
                {
                  id: "flamingo-x2",
                  nome: "V",
                  simbolo: "V"
                }
              ],
              dica: "A palavra começa com F."
            },
            {
              enunciado: "Forme a palavra da figura 🚿",
              cenas: [
                {
                  id: "chuveiro-0",
                  nome: "C",
                  simbolo: "C"
                },
                {
                  id: "chuveiro-1",
                  nome: "H",
                  simbolo: "H"
                },
                {
                  id: "chuveiro-2",
                  nome: "U",
                  simbolo: "U"
                },
                {
                  id: "chuveiro-3",
                  nome: "V",
                  simbolo: "V"
                },
                {
                  id: "chuveiro-4",
                  nome: "E",
                  simbolo: "E"
                },
                {
                  id: "chuveiro-5",
                  nome: "I",
                  simbolo: "I"
                },
                {
                  id: "chuveiro-6",
                  nome: "R",
                  simbolo: "R"
                },
                {
                  id: "chuveiro-7",
                  nome: "O",
                  simbolo: "O"
                }
              ],
              intrusas: [
                {
                  id: "chuveiro-x0",
                  nome: "S",
                  simbolo: "S"
                },
                {
                  id: "chuveiro-x1",
                  nome: "G",
                  simbolo: "G"
                },
                {
                  id: "chuveiro-x2",
                  nome: "L",
                  simbolo: "L"
                }
              ],
              dica: "A palavra começa com C."
            }
          ]
        }
      },
      {
        numero: 14,
        trilha: "grandes",
        titulo: "8 letras e 3 sobras",
        objetivo: "Forme a palavra com 8 letras; 3 letras sobram.",
        dificuldade: "media",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Forme a palavra da figura 🐜",
              cenas: [
                {
                  id: "formigas-0",
                  nome: "F",
                  simbolo: "F"
                },
                {
                  id: "formigas-1",
                  nome: "O",
                  simbolo: "O"
                },
                {
                  id: "formigas-2",
                  nome: "R",
                  simbolo: "R"
                },
                {
                  id: "formigas-3",
                  nome: "M",
                  simbolo: "M"
                },
                {
                  id: "formigas-4",
                  nome: "I",
                  simbolo: "I"
                },
                {
                  id: "formigas-5",
                  nome: "G",
                  simbolo: "G"
                },
                {
                  id: "formigas-6",
                  nome: "A",
                  simbolo: "A"
                },
                {
                  id: "formigas-7",
                  nome: "S",
                  simbolo: "S"
                }
              ],
              intrusas: [
                {
                  id: "formigas-x0",
                  nome: "T",
                  simbolo: "T"
                },
                {
                  id: "formigas-x1",
                  nome: "U",
                  simbolo: "U"
                },
                {
                  id: "formigas-x2",
                  nome: "J",
                  simbolo: "J"
                }
              ]
            },
            {
              enunciado: "Forme a palavra da figura 🚚",
              cenas: [
                {
                  id: "caminhão-0",
                  nome: "C",
                  simbolo: "C"
                },
                {
                  id: "caminhão-1",
                  nome: "A",
                  simbolo: "A"
                },
                {
                  id: "caminhão-2",
                  nome: "M",
                  simbolo: "M"
                },
                {
                  id: "caminhão-3",
                  nome: "I",
                  simbolo: "I"
                },
                {
                  id: "caminhão-4",
                  nome: "N",
                  simbolo: "N"
                },
                {
                  id: "caminhão-5",
                  nome: "H",
                  simbolo: "H"
                },
                {
                  id: "caminhão-6",
                  nome: "Ã",
                  simbolo: "Ã"
                },
                {
                  id: "caminhão-7",
                  nome: "O",
                  simbolo: "O"
                }
              ],
              intrusas: [
                {
                  id: "caminhão-x0",
                  nome: "P",
                  simbolo: "P"
                },
                {
                  id: "caminhão-x1",
                  nome: "D",
                  simbolo: "D"
                },
                {
                  id: "caminhão-x2",
                  nome: "J",
                  simbolo: "J"
                }
              ]
            }
          ]
        }
      },
      {
        numero: 15,
        trilha: "grandes",
        titulo: "9 letras e 3 sobras",
        objetivo: "Forme a palavra com 9 letras; 3 letras sobram.",
        dificuldade: "avancada",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Forme a palavra da figura 🧸",
              cenas: [
                {
                  id: "brinquedo-0",
                  nome: "B",
                  simbolo: "B"
                },
                {
                  id: "brinquedo-1",
                  nome: "R",
                  simbolo: "R"
                },
                {
                  id: "brinquedo-2",
                  nome: "I",
                  simbolo: "I"
                },
                {
                  id: "brinquedo-3",
                  nome: "N",
                  simbolo: "N"
                },
                {
                  id: "brinquedo-4",
                  nome: "Q",
                  simbolo: "Q"
                },
                {
                  id: "brinquedo-5",
                  nome: "U",
                  simbolo: "U"
                },
                {
                  id: "brinquedo-6",
                  nome: "E",
                  simbolo: "E"
                },
                {
                  id: "brinquedo-7",
                  nome: "D",
                  simbolo: "D"
                },
                {
                  id: "brinquedo-8",
                  nome: "O",
                  simbolo: "O"
                }
              ],
              intrusas: [
                {
                  id: "brinquedo-x0",
                  nome: "T",
                  simbolo: "T"
                },
                {
                  id: "brinquedo-x1",
                  nome: "Z",
                  simbolo: "Z"
                },
                {
                  id: "brinquedo-x2",
                  nome: "S",
                  simbolo: "S"
                }
              ],
              dica: "A palavra começa com B."
            },
            {
              enunciado: "Forme a palavra da figura 🏗️",
              cenas: [
                {
                  id: "guindaste-0",
                  nome: "G",
                  simbolo: "G"
                },
                {
                  id: "guindaste-1",
                  nome: "U",
                  simbolo: "U"
                },
                {
                  id: "guindaste-2",
                  nome: "I",
                  simbolo: "I"
                },
                {
                  id: "guindaste-3",
                  nome: "N",
                  simbolo: "N"
                },
                {
                  id: "guindaste-4",
                  nome: "D",
                  simbolo: "D"
                },
                {
                  id: "guindaste-5",
                  nome: "A",
                  simbolo: "A"
                },
                {
                  id: "guindaste-6",
                  nome: "S",
                  simbolo: "S"
                },
                {
                  id: "guindaste-7",
                  nome: "T",
                  simbolo: "T"
                },
                {
                  id: "guindaste-8",
                  nome: "E",
                  simbolo: "E"
                }
              ],
              intrusas: [
                {
                  id: "guindaste-x0",
                  nome: "F",
                  simbolo: "F"
                },
                {
                  id: "guindaste-x1",
                  nome: "J",
                  simbolo: "J"
                },
                {
                  id: "guindaste-x2",
                  nome: "V",
                  simbolo: "V"
                }
              ],
              dica: "A palavra começa com G."
            }
          ]
        }
      }
    ]
  },
  {
    id: "menor-maior",
    nome: "Do menor ao maior",
    descricao: "Coloque os números em ordem, do menor para o maior.",
    categoria: "numeros",
    instrucoes: "Toque nos números do menor para o maior. Use Desfazer se precisar.",
    tipoMecanica: "ordenacao",
    versao: 1,
    faixaEtariaMin: 5,
    faixaEtariaMax: 12,
    ordemEditorial: 11,
    fases: [
      {
        numero: 1,
        trilha: "pequenos",
        titulo: "3 números",
        objetivo: "Ordene 3 números do menor para o maior.",
        dificuldade: "simples",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Coloque do menor para o maior.",
              cenas: [
                {
                  id: "n4",
                  nome: "4",
                  simbolo: "4"
                },
                {
                  id: "n6",
                  nome: "6",
                  simbolo: "6"
                },
                {
                  id: "n9",
                  nome: "9",
                  simbolo: "9"
                }
              ],
              dica: "Comece pelo menor número."
            },
            {
              enunciado: "Coloque do menor para o maior.",
              cenas: [
                {
                  id: "n1",
                  nome: "1",
                  simbolo: "1"
                },
                {
                  id: "n6",
                  nome: "6",
                  simbolo: "6"
                },
                {
                  id: "n7",
                  nome: "7",
                  simbolo: "7"
                }
              ],
              dica: "Comece pelo menor número."
            }
          ]
        }
      },
      {
        numero: 2,
        trilha: "pequenos",
        titulo: "3 números",
        objetivo: "Ordene 3 números do menor para o maior.",
        dificuldade: "simples",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Coloque do menor para o maior.",
              cenas: [
                {
                  id: "n11",
                  nome: "11",
                  simbolo: "11"
                },
                {
                  id: "n17",
                  nome: "17",
                  simbolo: "17"
                },
                {
                  id: "n20",
                  nome: "20",
                  simbolo: "20"
                }
              ]
            },
            {
              enunciado: "Coloque do menor para o maior.",
              cenas: [
                {
                  id: "n9",
                  nome: "9",
                  simbolo: "9"
                },
                {
                  id: "n16",
                  nome: "16",
                  simbolo: "16"
                },
                {
                  id: "n18",
                  nome: "18",
                  simbolo: "18"
                }
              ]
            }
          ]
        }
      },
      {
        numero: 3,
        trilha: "pequenos",
        titulo: "4 números",
        objetivo: "Ordene 4 números do menor para o maior.",
        dificuldade: "media",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Coloque do menor para o maior.",
              cenas: [
                {
                  id: "n21",
                  nome: "21",
                  simbolo: "21"
                },
                {
                  id: "n25",
                  nome: "25",
                  simbolo: "25"
                },
                {
                  id: "n27",
                  nome: "27",
                  simbolo: "27"
                },
                {
                  id: "n29",
                  nome: "29",
                  simbolo: "29"
                }
              ],
              dica: "Comece pelo menor número."
            },
            {
              enunciado: "Coloque do menor para o maior.",
              cenas: [
                {
                  id: "n6",
                  nome: "6",
                  simbolo: "6"
                },
                {
                  id: "n10",
                  nome: "10",
                  simbolo: "10"
                },
                {
                  id: "n11",
                  nome: "11",
                  simbolo: "11"
                },
                {
                  id: "n27",
                  nome: "27",
                  simbolo: "27"
                }
              ],
              dica: "Comece pelo menor número."
            }
          ]
        }
      },
      {
        numero: 4,
        trilha: "pequenos",
        titulo: "4 números",
        objetivo: "Ordene 4 números do menor para o maior.",
        dificuldade: "media",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Coloque do menor para o maior.",
              cenas: [
                {
                  id: "n22",
                  nome: "22",
                  simbolo: "22"
                },
                {
                  id: "n35",
                  nome: "35",
                  simbolo: "35"
                },
                {
                  id: "n50",
                  nome: "50",
                  simbolo: "50"
                },
                {
                  id: "n55",
                  nome: "55",
                  simbolo: "55"
                }
              ]
            },
            {
              enunciado: "Coloque do menor para o maior.",
              cenas: [
                {
                  id: "n34",
                  nome: "34",
                  simbolo: "34"
                },
                {
                  id: "n38",
                  nome: "38",
                  simbolo: "38"
                },
                {
                  id: "n46",
                  nome: "46",
                  simbolo: "46"
                },
                {
                  id: "n49",
                  nome: "49",
                  simbolo: "49"
                }
              ]
            }
          ]
        }
      },
      {
        numero: 5,
        trilha: "pequenos",
        titulo: "5 números",
        objetivo: "Ordene 5 números do menor para o maior.",
        dificuldade: "avancada",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Coloque do menor para o maior.",
              cenas: [
                {
                  id: "n57",
                  nome: "57",
                  simbolo: "57"
                },
                {
                  id: "n68",
                  nome: "68",
                  simbolo: "68"
                },
                {
                  id: "n74",
                  nome: "74",
                  simbolo: "74"
                },
                {
                  id: "n78",
                  nome: "78",
                  simbolo: "78"
                },
                {
                  id: "n99",
                  nome: "99",
                  simbolo: "99"
                }
              ],
              dica: "Comece pelo menor número."
            },
            {
              enunciado: "Coloque do menor para o maior.",
              cenas: [
                {
                  id: "n11",
                  nome: "11",
                  simbolo: "11"
                },
                {
                  id: "n19",
                  nome: "19",
                  simbolo: "19"
                },
                {
                  id: "n33",
                  nome: "33",
                  simbolo: "33"
                },
                {
                  id: "n57",
                  nome: "57",
                  simbolo: "57"
                },
                {
                  id: "n68",
                  nome: "68",
                  simbolo: "68"
                }
              ],
              dica: "Comece pelo menor número."
            }
          ]
        }
      },
      {
        numero: 6,
        trilha: "medios",
        titulo: "5 números",
        objetivo: "Ordene 5 números do menor para o maior.",
        dificuldade: "simples",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Coloque do menor para o maior.",
              cenas: [
                {
                  id: "n141",
                  nome: "141",
                  simbolo: "141"
                },
                {
                  id: "n179",
                  nome: "179",
                  simbolo: "179"
                },
                {
                  id: "n277",
                  nome: "277",
                  simbolo: "277"
                },
                {
                  id: "n282",
                  nome: "282",
                  simbolo: "282"
                },
                {
                  id: "n291",
                  nome: "291",
                  simbolo: "291"
                }
              ]
            },
            {
              enunciado: "Coloque do menor para o maior.",
              cenas: [
                {
                  id: "n125",
                  nome: "125",
                  simbolo: "125"
                },
                {
                  id: "n152",
                  nome: "152",
                  simbolo: "152"
                },
                {
                  id: "n156",
                  nome: "156",
                  simbolo: "156"
                },
                {
                  id: "n216",
                  nome: "216",
                  simbolo: "216"
                },
                {
                  id: "n293",
                  nome: "293",
                  simbolo: "293"
                }
              ]
            }
          ]
        }
      },
      {
        numero: 7,
        trilha: "medios",
        titulo: "6 números",
        objetivo: "Ordene 6 números do menor para o maior.",
        dificuldade: "simples",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Coloque do menor para o maior.",
              cenas: [
                {
                  id: "n119",
                  nome: "119",
                  simbolo: "119"
                },
                {
                  id: "n124",
                  nome: "124",
                  simbolo: "124"
                },
                {
                  id: "n254",
                  nome: "254",
                  simbolo: "254"
                },
                {
                  id: "n339",
                  nome: "339",
                  simbolo: "339"
                },
                {
                  id: "n452",
                  nome: "452",
                  simbolo: "452"
                },
                {
                  id: "n475",
                  nome: "475",
                  simbolo: "475"
                }
              ],
              dica: "Compare primeiro quantos algarismos cada número tem."
            },
            {
              enunciado: "Coloque do menor para o maior.",
              cenas: [
                {
                  id: "n142",
                  nome: "142",
                  simbolo: "142"
                },
                {
                  id: "n157",
                  nome: "157",
                  simbolo: "157"
                },
                {
                  id: "n238",
                  nome: "238",
                  simbolo: "238"
                },
                {
                  id: "n263",
                  nome: "263",
                  simbolo: "263"
                },
                {
                  id: "n404",
                  nome: "404",
                  simbolo: "404"
                },
                {
                  id: "n453",
                  nome: "453",
                  simbolo: "453"
                }
              ],
              dica: "Compare primeiro quantos algarismos cada número tem."
            }
          ]
        }
      },
      {
        numero: 8,
        trilha: "medios",
        titulo: "6 números",
        objetivo: "Ordene 6 números do menor para o maior.",
        dificuldade: "media",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Coloque do menor para o maior.",
              cenas: [
                {
                  id: "n204",
                  nome: "204",
                  simbolo: "204"
                },
                {
                  id: "n239",
                  nome: "239",
                  simbolo: "239"
                },
                {
                  id: "n248",
                  nome: "248",
                  simbolo: "248"
                },
                {
                  id: "n507",
                  nome: "507",
                  simbolo: "507"
                },
                {
                  id: "n600",
                  nome: "600",
                  simbolo: "600"
                },
                {
                  id: "n789",
                  nome: "789",
                  simbolo: "789"
                }
              ]
            },
            {
              enunciado: "Coloque do menor para o maior.",
              cenas: [
                {
                  id: "n156",
                  nome: "156",
                  simbolo: "156"
                },
                {
                  id: "n191",
                  nome: "191",
                  simbolo: "191"
                },
                {
                  id: "n231",
                  nome: "231",
                  simbolo: "231"
                },
                {
                  id: "n332",
                  nome: "332",
                  simbolo: "332"
                },
                {
                  id: "n436",
                  nome: "436",
                  simbolo: "436"
                },
                {
                  id: "n454",
                  nome: "454",
                  simbolo: "454"
                }
              ]
            }
          ]
        }
      },
      {
        numero: 9,
        trilha: "medios",
        titulo: "7 números",
        objetivo: "Ordene 7 números do menor para o maior.",
        dificuldade: "media",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Coloque do menor para o maior.",
              cenas: [
                {
                  id: "n1061",
                  nome: "1061",
                  simbolo: "1061"
                },
                {
                  id: "n1135",
                  nome: "1135",
                  simbolo: "1135"
                },
                {
                  id: "n1254",
                  nome: "1254",
                  simbolo: "1254"
                },
                {
                  id: "n1318",
                  nome: "1318",
                  simbolo: "1318"
                },
                {
                  id: "n1342",
                  nome: "1342",
                  simbolo: "1342"
                },
                {
                  id: "n1396",
                  nome: "1396",
                  simbolo: "1396"
                },
                {
                  id: "n1476",
                  nome: "1476",
                  simbolo: "1476"
                }
              ],
              dica: "Compare primeiro quantos algarismos cada número tem."
            },
            {
              enunciado: "Coloque do menor para o maior.",
              cenas: [
                {
                  id: "n1005",
                  nome: "1005",
                  simbolo: "1005"
                },
                {
                  id: "n1062",
                  nome: "1062",
                  simbolo: "1062"
                },
                {
                  id: "n1154",
                  nome: "1154",
                  simbolo: "1154"
                },
                {
                  id: "n1275",
                  nome: "1275",
                  simbolo: "1275"
                },
                {
                  id: "n1419",
                  nome: "1419",
                  simbolo: "1419"
                },
                {
                  id: "n1435",
                  nome: "1435",
                  simbolo: "1435"
                },
                {
                  id: "n1483",
                  nome: "1483",
                  simbolo: "1483"
                }
              ],
              dica: "Compare primeiro quantos algarismos cada número tem."
            }
          ]
        }
      },
      {
        numero: 10,
        trilha: "medios",
        titulo: "7 números",
        objetivo: "Ordene 7 números do menor para o maior.",
        dificuldade: "avancada",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Coloque do menor para o maior.",
              cenas: [
                {
                  id: "n1397",
                  nome: "1397",
                  simbolo: "1397"
                },
                {
                  id: "n1700",
                  nome: "1700",
                  simbolo: "1700"
                },
                {
                  id: "n2278",
                  nome: "2278",
                  simbolo: "2278"
                },
                {
                  id: "n2387",
                  nome: "2387",
                  simbolo: "2387"
                },
                {
                  id: "n2428",
                  nome: "2428",
                  simbolo: "2428"
                },
                {
                  id: "n2513",
                  nome: "2513",
                  simbolo: "2513"
                },
                {
                  id: "n2556",
                  nome: "2556",
                  simbolo: "2556"
                }
              ]
            },
            {
              enunciado: "Coloque do menor para o maior.",
              cenas: [
                {
                  id: "n1664",
                  nome: "1664",
                  simbolo: "1664"
                },
                {
                  id: "n1948",
                  nome: "1948",
                  simbolo: "1948"
                },
                {
                  id: "n1982",
                  nome: "1982",
                  simbolo: "1982"
                },
                {
                  id: "n2110",
                  nome: "2110",
                  simbolo: "2110"
                },
                {
                  id: "n2391",
                  nome: "2391",
                  simbolo: "2391"
                },
                {
                  id: "n2560",
                  nome: "2560",
                  simbolo: "2560"
                },
                {
                  id: "n2610",
                  nome: "2610",
                  simbolo: "2610"
                }
              ]
            }
          ]
        }
      },
      {
        numero: 11,
        trilha: "grandes",
        titulo: "8 números",
        objetivo: "Ordene 8 números do menor para o maior.",
        dificuldade: "simples",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Coloque do menor para o maior.",
              cenas: [
                {
                  id: "n1118",
                  nome: "1118",
                  simbolo: "1118"
                },
                {
                  id: "n5153",
                  nome: "5153",
                  simbolo: "5153"
                },
                {
                  id: "n6067",
                  nome: "6067",
                  simbolo: "6067"
                },
                {
                  id: "n6102",
                  nome: "6102",
                  simbolo: "6102"
                },
                {
                  id: "n7739",
                  nome: "7739",
                  simbolo: "7739"
                },
                {
                  id: "n7779",
                  nome: "7779",
                  simbolo: "7779"
                },
                {
                  id: "n8490",
                  nome: "8490",
                  simbolo: "8490"
                },
                {
                  id: "n8999",
                  nome: "8999",
                  simbolo: "8999"
                }
              ],
              dica: "Com o mesmo número de algarismos, compare da esquerda para a direita."
            },
            {
              enunciado: "Coloque do menor para o maior.",
              cenas: [
                {
                  id: "n2638",
                  nome: "2638",
                  simbolo: "2638"
                },
                {
                  id: "n5302",
                  nome: "5302",
                  simbolo: "5302"
                },
                {
                  id: "n7878",
                  nome: "7878",
                  simbolo: "7878"
                },
                {
                  id: "n9522",
                  nome: "9522",
                  simbolo: "9522"
                },
                {
                  id: "n9596",
                  nome: "9596",
                  simbolo: "9596"
                },
                {
                  id: "n9668",
                  nome: "9668",
                  simbolo: "9668"
                },
                {
                  id: "n9825",
                  nome: "9825",
                  simbolo: "9825"
                },
                {
                  id: "n9885",
                  nome: "9885",
                  simbolo: "9885"
                }
              ],
              dica: "Com o mesmo número de algarismos, compare da esquerda para a direita."
            }
          ]
        }
      },
      {
        numero: 12,
        trilha: "grandes",
        titulo: "8 números",
        objetivo: "Ordene 8 números do menor para o maior.",
        dificuldade: "simples",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Coloque do menor para o maior.",
              cenas: [
                {
                  id: "n10058",
                  nome: "10058",
                  simbolo: "10058"
                },
                {
                  id: "n10232",
                  nome: "10232",
                  simbolo: "10232"
                },
                {
                  id: "n10297",
                  nome: "10297",
                  simbolo: "10297"
                },
                {
                  id: "n11113",
                  nome: "11113",
                  simbolo: "11113"
                },
                {
                  id: "n11233",
                  nome: "11233",
                  simbolo: "11233"
                },
                {
                  id: "n11256",
                  nome: "11256",
                  simbolo: "11256"
                },
                {
                  id: "n11445",
                  nome: "11445",
                  simbolo: "11445"
                },
                {
                  id: "n11721",
                  nome: "11721",
                  simbolo: "11721"
                }
              ]
            },
            {
              enunciado: "Coloque do menor para o maior.",
              cenas: [
                {
                  id: "n10154",
                  nome: "10154",
                  simbolo: "10154"
                },
                {
                  id: "n10369",
                  nome: "10369",
                  simbolo: "10369"
                },
                {
                  id: "n10375",
                  nome: "10375",
                  simbolo: "10375"
                },
                {
                  id: "n10965",
                  nome: "10965",
                  simbolo: "10965"
                },
                {
                  id: "n11134",
                  nome: "11134",
                  simbolo: "11134"
                },
                {
                  id: "n11197",
                  nome: "11197",
                  simbolo: "11197"
                },
                {
                  id: "n11571",
                  nome: "11571",
                  simbolo: "11571"
                },
                {
                  id: "n11781",
                  nome: "11781",
                  simbolo: "11781"
                }
              ]
            }
          ]
        }
      },
      {
        numero: 13,
        trilha: "grandes",
        titulo: "9 números",
        objetivo: "Ordene 9 números do menor para o maior.",
        dificuldade: "media",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Coloque do menor para o maior.",
              cenas: [
                {
                  id: "n10145",
                  nome: "10145",
                  simbolo: "10145"
                },
                {
                  id: "n11383",
                  nome: "11383",
                  simbolo: "11383"
                },
                {
                  id: "n13966",
                  nome: "13966",
                  simbolo: "13966"
                },
                {
                  id: "n14546",
                  nome: "14546",
                  simbolo: "14546"
                },
                {
                  id: "n15611",
                  nome: "15611",
                  simbolo: "15611"
                },
                {
                  id: "n15765",
                  nome: "15765",
                  simbolo: "15765"
                },
                {
                  id: "n17160",
                  nome: "17160",
                  simbolo: "17160"
                },
                {
                  id: "n17883",
                  nome: "17883",
                  simbolo: "17883"
                },
                {
                  id: "n19076",
                  nome: "19076",
                  simbolo: "19076"
                }
              ],
              dica: "Com o mesmo número de algarismos, compare da esquerda para a direita."
            },
            {
              enunciado: "Coloque do menor para o maior.",
              cenas: [
                {
                  id: "n10227",
                  nome: "10227",
                  simbolo: "10227"
                },
                {
                  id: "n10738",
                  nome: "10738",
                  simbolo: "10738"
                },
                {
                  id: "n12869",
                  nome: "12869",
                  simbolo: "12869"
                },
                {
                  id: "n14248",
                  nome: "14248",
                  simbolo: "14248"
                },
                {
                  id: "n17131",
                  nome: "17131",
                  simbolo: "17131"
                },
                {
                  id: "n17473",
                  nome: "17473",
                  simbolo: "17473"
                },
                {
                  id: "n17737",
                  nome: "17737",
                  simbolo: "17737"
                },
                {
                  id: "n18311",
                  nome: "18311",
                  simbolo: "18311"
                },
                {
                  id: "n19175",
                  nome: "19175",
                  simbolo: "19175"
                }
              ],
              dica: "Com o mesmo número de algarismos, compare da esquerda para a direita."
            }
          ]
        }
      },
      {
        numero: 14,
        trilha: "grandes",
        titulo: "9 números",
        objetivo: "Ordene 9 números do menor para o maior.",
        dificuldade: "media",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Coloque do menor para o maior.",
              cenas: [
                {
                  id: "n10966",
                  nome: "10966",
                  simbolo: "10966"
                },
                {
                  id: "n17477",
                  nome: "17477",
                  simbolo: "17477"
                },
                {
                  id: "n19483",
                  nome: "19483",
                  simbolo: "19483"
                },
                {
                  id: "n26167",
                  nome: "26167",
                  simbolo: "26167"
                },
                {
                  id: "n29443",
                  nome: "29443",
                  simbolo: "29443"
                },
                {
                  id: "n34373",
                  nome: "34373",
                  simbolo: "34373"
                },
                {
                  id: "n37778",
                  nome: "37778",
                  simbolo: "37778"
                },
                {
                  id: "n48595",
                  nome: "48595",
                  simbolo: "48595"
                },
                {
                  id: "n49040",
                  nome: "49040",
                  simbolo: "49040"
                }
              ]
            },
            {
              enunciado: "Coloque do menor para o maior.",
              cenas: [
                {
                  id: "n11523",
                  nome: "11523",
                  simbolo: "11523"
                },
                {
                  id: "n16631",
                  nome: "16631",
                  simbolo: "16631"
                },
                {
                  id: "n18509",
                  nome: "18509",
                  simbolo: "18509"
                },
                {
                  id: "n25100",
                  nome: "25100",
                  simbolo: "25100"
                },
                {
                  id: "n28521",
                  nome: "28521",
                  simbolo: "28521"
                },
                {
                  id: "n30012",
                  nome: "30012",
                  simbolo: "30012"
                },
                {
                  id: "n35974",
                  nome: "35974",
                  simbolo: "35974"
                },
                {
                  id: "n37670",
                  nome: "37670",
                  simbolo: "37670"
                },
                {
                  id: "n44265",
                  nome: "44265",
                  simbolo: "44265"
                }
              ]
            }
          ]
        }
      },
      {
        numero: 15,
        trilha: "grandes",
        titulo: "10 números",
        objetivo: "Ordene 10 números do menor para o maior.",
        dificuldade: "avancada",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Coloque do menor para o maior.",
              cenas: [
                {
                  id: "n16168",
                  nome: "16168",
                  simbolo: "16168"
                },
                {
                  id: "n19661",
                  nome: "19661",
                  simbolo: "19661"
                },
                {
                  id: "n40445",
                  nome: "40445",
                  simbolo: "40445"
                },
                {
                  id: "n41542",
                  nome: "41542",
                  simbolo: "41542"
                },
                {
                  id: "n49200",
                  nome: "49200",
                  simbolo: "49200"
                },
                {
                  id: "n54275",
                  nome: "54275",
                  simbolo: "54275"
                },
                {
                  id: "n58439",
                  nome: "58439",
                  simbolo: "58439"
                },
                {
                  id: "n61105",
                  nome: "61105",
                  simbolo: "61105"
                },
                {
                  id: "n73808",
                  nome: "73808",
                  simbolo: "73808"
                },
                {
                  id: "n93818",
                  nome: "93818",
                  simbolo: "93818"
                }
              ],
              dica: "Com o mesmo número de algarismos, compare da esquerda para a direita."
            },
            {
              enunciado: "Coloque do menor para o maior.",
              cenas: [
                {
                  id: "n11274",
                  nome: "11274",
                  simbolo: "11274"
                },
                {
                  id: "n21924",
                  nome: "21924",
                  simbolo: "21924"
                },
                {
                  id: "n41419",
                  nome: "41419",
                  simbolo: "41419"
                },
                {
                  id: "n65964",
                  nome: "65964",
                  simbolo: "65964"
                },
                {
                  id: "n71601",
                  nome: "71601",
                  simbolo: "71601"
                },
                {
                  id: "n71930",
                  nome: "71930",
                  simbolo: "71930"
                },
                {
                  id: "n78764",
                  nome: "78764",
                  simbolo: "78764"
                },
                {
                  id: "n89367",
                  nome: "89367",
                  simbolo: "89367"
                },
                {
                  id: "n93020",
                  nome: "93020",
                  simbolo: "93020"
                },
                {
                  id: "n94553",
                  nome: "94553",
                  simbolo: "94553"
                }
              ],
              dica: "Com o mesmo número de algarismos, compare da esquerda para a direita."
            }
          ]
        }
      }
    ]
  },
  {
    id: "robo-setas",
    nome: "Robô com setas",
    descricao: "Planeje todas as setas antes de o robô andar.",
    categoria: "raciocinio",
    instrucoes: "Toque nas setas para montar o caminho; tocar a mesma seta soma uma casa. Depois toque em Executar.",
    tipoMecanica: "robo",
    versao: 1,
    faixaEtariaMin: 5,
    faixaEtariaMax: 12,
    ordemEditorial: 12,
    fases: [
      {
        numero: 1,
        trilha: "pequenos",
        titulo: "1 curva",
        objetivo: "Monte as setas para o robô fazer 1 curva e chegar.",
        dificuldade: "simples",
        configuracao: {
          mapas: [
            [
              "#####",
              "#I..#",
              "###.#",
              "#..F#",
              "#####"
            ],
            [
              "#####",
              "#I#.#",
              "#.#.#",
              "#..F#",
              "#####"
            ]
          ]
        }
      },
      {
        numero: 2,
        trilha: "pequenos",
        titulo: "2 curvas",
        objetivo: "Monte as setas para o robô fazer 2 curvas e chegar.",
        dificuldade: "simples",
        configuracao: {
          mapas: [
            [
              "#######",
              "#I..#.#",
              "###.#.#",
              "#F....#",
              "#######"
            ],
            [
              "#######",
              "#I#..F#",
              "#.###.#",
              "#.....#",
              "#######"
            ]
          ]
        }
      },
      {
        numero: 3,
        trilha: "pequenos",
        titulo: "3 curvas",
        objetivo: "Monte as setas para o robô fazer 3 curvas e chegar.",
        dificuldade: "media",
        configuracao: {
          mapas: [
            [
              "#######",
              "#I..#F#",
              "###.#.#",
              "#.#...#",
              "#.###.#",
              "#.....#",
              "#######"
            ],
            [
              "#######",
              "#I#..F#",
              "#.#.#.#",
              "#...#.#",
              "#####.#",
              "#.....#",
              "#######"
            ]
          ]
        }
      },
      {
        numero: 4,
        trilha: "pequenos",
        titulo: "4 curvas",
        objetivo: "Monte as setas para o robô fazer 4 curvas e chegar.",
        dificuldade: "media",
        configuracao: {
          mapas: [
            [
              "#######",
              "#I....#",
              "#####.#",
              "#.....#",
              "#.#####",
              "#..F..#",
              "#######"
            ],
            [
              "#######",
              "#I#...#",
              "#.###.#",
              "#...#F#",
              "###.#.#",
              "#.....#",
              "#######"
            ]
          ]
        }
      },
      {
        numero: 5,
        trilha: "pequenos",
        titulo: "5 curvas",
        objetivo: "Monte as setas para o robô fazer 5 curvas e chegar.",
        dificuldade: "avancada",
        configuracao: {
          mapas: [
            [
              "#########",
              "#I..#...#",
              "###.#.#.#",
              "#.#.#.#F#",
              "#.#.#.#.#",
              "#.....#.#",
              "#########"
            ],
            [
              "#########",
              "#I#..F..#",
              "#.#.#####",
              "#.#.....#",
              "#.#####.#",
              "#.......#",
              "#########"
            ]
          ]
        }
      },
      {
        numero: 6,
        trilha: "medios",
        titulo: "6 curvas",
        objetivo: "Monte as setas para o robô fazer 6 curvas e chegar.",
        dificuldade: "simples",
        configuracao: {
          mapas: [
            [
              "#########",
              "#I....#.#",
              "#####.#.#",
              "#.....#.#",
              "#.#####.#",
              "#.#..F#.#",
              "#.#.#.#.#",
              "#...#...#",
              "#########"
            ],
            [
              "#########",
              "#I..#F..#",
              "###.###.#",
              "#.#...#.#",
              "#.###.#.#",
              "#...#...#",
              "#.#####.#",
              "#.......#",
              "#########"
            ]
          ]
        }
      },
      {
        numero: 7,
        trilha: "medios",
        titulo: "7 curvas",
        objetivo: "Monte as setas para o robô fazer 7 curvas e chegar.",
        dificuldade: "simples",
        configuracao: {
          mapas: [
            [
              "#########",
              "#I#.....#",
              "#.#.###.#",
              "#...#.#.#",
              "#####.#.#",
              "#..F..#.#",
              "#.#####.#",
              "#.......#",
              "#########"
            ],
            [
              "#########",
              "#I#..F..#",
              "#.#.###.#",
              "#.#.#...#",
              "#.###.#.#",
              "#...#.#.#",
              "###.#.#.#",
              "#.....#.#",
              "#########"
            ]
          ]
        }
      },
      {
        numero: 8,
        trilha: "medios",
        titulo: "8 curvas",
        objetivo: "Monte as setas para o robô fazer 8 curvas e chegar.",
        dificuldade: "media",
        configuracao: {
          mapas: [
            [
              "###########",
              "#I..#.....#",
              "###.#####.#",
              "#.#.#...#.#",
              "#.#.#.#.#.#",
              "#...#.#.#.#",
              "#.###.#.#.#",
              "#.....#..F#",
              "###########"
            ],
            [
              "###########",
              "#I..#.....#",
              "###.#.#####",
              "#...#..F..#",
              "#.#######.#",
              "#.......#.#",
              "#######.#.#",
              "#.........#",
              "###########"
            ]
          ]
        }
      },
      {
        numero: 9,
        trilha: "medios",
        titulo: "9 curvas",
        objetivo: "Monte as setas para o robô fazer 9 curvas e chegar.",
        dificuldade: "media",
        configuracao: {
          mapas: [
            [
              "###########",
              "#I......#.#",
              "#######.#.#",
              "#....F#...#",
              "#####.###.#",
              "#.....#...#",
              "#.#####.###",
              "#.......#.#",
              "#.#######.#",
              "#.........#",
              "###########"
            ],
            [
              "###########",
              "#I..#.....#",
              "###.#####.#",
              "#.#...#...#",
              "#.###.#.###",
              "#.....#..F#",
              "#.#######.#",
              "#.#.......#",
              "#.#####.#.#",
              "#.......#.#",
              "###########"
            ]
          ]
        }
      },
      {
        numero: 10,
        trilha: "medios",
        titulo: "10 curvas",
        objetivo: "Monte as setas para o robô fazer 10 curvas e chegar.",
        dificuldade: "avancada",
        configuracao: {
          mapas: [
            [
              "###########",
              "#I..#.....#",
              "###.###.#.#",
              "#...#...#.#",
              "#.###.###.#",
              "#.#F..#...#",
              "#.###.#####",
              "#...#.....#",
              "###.#####.#",
              "#.........#",
              "###########"
            ],
            [
              "###########",
              "#I..#.....#",
              "###.#####.#",
              "#...#...#.#",
              "#.###.#.#.#",
              "#.....#.#.#",
              "#######.#.#",
              "#..F..#.#.#",
              "#.###.#.#.#",
              "#...#.....#",
              "###########"
            ]
          ]
        }
      },
      {
        numero: 11,
        trilha: "grandes",
        titulo: "11 curvas",
        objetivo: "Monte as setas para o robô fazer 11 curvas e chegar.",
        dificuldade: "simples",
        configuracao: {
          mapas: [
            [
              "#############",
              "#I#F..#.....#",
              "#.#.#.#.###.#",
              "#.#.#...#.#.#",
              "#.#####.#.#.#",
              "#.....#...#.#",
              "#####.###.#.#",
              "#.....#...#.#",
              "#.#########.#",
              "#...........#",
              "#############"
            ],
            [
              "#############",
              "#I....#.#...#",
              "#####.#.#.#.#",
              "#.....#...#.#",
              "#.#########.#",
              "#.........#.#",
              "#########.#.#",
              "#.....#...#.#",
              "#.#.###.###.#",
              "#F#.........#",
              "#############"
            ]
          ]
        }
      },
      {
        numero: 12,
        trilha: "grandes",
        titulo: "12 curvas",
        objetivo: "Monte as setas para o robô fazer 12 curvas e chegar.",
        dificuldade: "simples",
        configuracao: {
          mapas: [
            [
              "#############",
              "#I......#...#",
              "#######.###.#",
              "#.....#...#.#",
              "#.#.#####.#.#",
              "#.#...#...#.#",
              "#.###.#.###.#",
              "#..F#.#.#...#",
              "###.#.#.#.#.#",
              "#...#...#.#.#",
              "#.#########.#",
              "#...........#",
              "#############"
            ],
            [
              "#############",
              "#I#.........#",
              "#.###.#####.#",
              "#.#...#.....#",
              "#.#.###.#####",
              "#.#...#.#..F#",
              "#.###.#.###.#",
              "#.....#.....#",
              "###########.#",
              "#.....#...#.#",
              "#.###.#.#.#.#",
              "#...#...#...#",
              "#############"
            ]
          ]
        }
      },
      {
        numero: 13,
        trilha: "grandes",
        titulo: "13 curvas",
        objetivo: "Monte as setas para o robô fazer 13 curvas e chegar.",
        dificuldade: "media",
        configuracao: {
          mapas: [
            [
              "#############",
              "#I....#...#.#",
              "#####.#.#.#.#",
              "#...#.#.#...#",
              "#.#.#.#.###.#",
              "#.#.#...#...#",
              "#.#######.###",
              "#..F....#.#.#",
              "###.###.#.#.#",
              "#...#...#.#.#",
              "#.#######.#.#",
              "#...........#",
              "#############"
            ],
            [
              "#############",
              "#I#.........#",
              "#.#.#######.#",
              "#.#...#...#.#",
              "#.#####.#.#.#",
              "#...#...#...#",
              "###.#.#####.#",
              "#.#.#.#.#F..#",
              "#.#.#.#.#.###",
              "#...#.#...#.#",
              "#.###.#.###.#",
              "#.....#.....#",
              "#############"
            ]
          ]
        }
      },
      {
        numero: 14,
        trilha: "grandes",
        titulo: "14 curvas",
        objetivo: "Monte as setas para o robô fazer 14 curvas e chegar.",
        dificuldade: "media",
        configuracao: {
          mapas: [
            [
              "###############",
              "#I..#....F....#",
              "###.#.#####.###",
              "#.#.#.....#...#",
              "#.#.#####.###.#",
              "#.#.#...#.#...#",
              "#.#.#.#.#.#.#.#",
              "#.#...#.#.#.#.#",
              "#.#####.###.#.#",
              "#.....#.#...#.#",
              "#.#.###.#.###.#",
              "#.#.......#...#",
              "###############"
            ],
            [
              "###############",
              "#I....#.......#",
              "#####.#####.#.#",
              "#...#.......#.#",
              "###.#########.#",
              "#..F....#.....#",
              "#.#######.#####",
              "#.......#.....#",
              "#.#####.#####.#",
              "#.#...#.....#.#",
              "#.#.#.#.#####.#",
              "#...#.#.......#",
              "###############"
            ]
          ]
        }
      },
      {
        numero: 15,
        trilha: "grandes",
        titulo: "15 curvas",
        objetivo: "Monte as setas para o robô fazer 15 curvas e chegar.",
        dificuldade: "avancada",
        configuracao: {
          mapas: [
            [
              "###############",
              "#I#...#.#..F..#",
              "#.#.#.#.#.###.#",
              "#...#.#.#...#.#",
              "#####.#.###.#.#",
              "#.#...#.#...#.#",
              "#.#.###.#.###.#",
              "#.#.#.......#.#",
              "#.#.#######.#.#",
              "#.#.....#...#.#",
              "#.#####.#####.#",
              "#.....#.#...#.#",
              "#.###.#.#.#.#.#",
              "#...#.....#...#",
              "###############"
            ],
            [
              "###############",
              "#I..#.........#",
              "###.#####.###.#",
              "#...#...#...#.#",
              "#.###.#.###.#.#",
              "#.#...#.....#F#",
              "#.#.#########.#",
              "#...#...#.....#",
              "#####.###.#####",
              "#...#.....#...#",
              "#.###.#####.#.#",
              "#...#.#...#.#.#",
              "#.#.#.#.#.#.#.#",
              "#.#.....#...#.#",
              "###############"
            ]
          ]
        }
      }
    ]
  }
];
