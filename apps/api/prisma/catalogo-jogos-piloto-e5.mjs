/**
 * Piloto E5 — Memória de figuras, Complete a sequência e Caminhos e labirintos (IDs estáveis).
 * DEV-CAT-M1, ticket 09: 15 fases em três trilhas (pequenos 1–5, médios 6–10, grandes 11–15),
 * duas variantes por fase, aprovadas pela régua (npm run regua:jogos -w @pef/api -- --estrito).
 * Conteúdo gerado e congelado; revisão humana na homologação.
 */
/* Ticket 12 (2026-11-26): sequencia, pares-sombras, ache-intruso e palavra-figura ficam arquivados
 * (ativo: false): saem da Biblioteca e as conquistas continuam no Histórico. */
export const CATALOGO_JOGOS_PILOTO_E5 = [
  {
    id: "memoria",
    nome: "Memória de figuras",
    descricao: "Vire as cartas e encontre as figuras que formam pares.",
    categoria: "memoria_atencao",
    instrucoes: "Vire duas cartas de cada vez. Se as figuras forem diferentes, escolha outra carta para começar um novo par.",
    tipoMecanica: "memoria",
    versao: 2,
    faixaEtariaMin: 5,
    faixaEtariaMax: 8,
    ordemEditorial: 1,
    fases: [
      {
        numero: 1,
        trilha: "pequenos",
        titulo: "2 pares",
        objetivo: "Encontre os 2 pares de figuras.",
        dificuldade: "simples",
        configuracao: {
          conjuntos: [
            [
              {
                id: "chave",
                nome: "Chave",
                simbolo: "🔑"
              },
              {
                id: "trem",
                nome: "Trem",
                simbolo: "🚂"
              }
            ],
            [
              {
                id: "bicicleta",
                nome: "Bicicleta",
                simbolo: "🚲"
              },
              {
                id: "folha",
                nome: "Folha",
                simbolo: "🍃"
              }
            ]
          ]
        }
      },
      {
        numero: 2,
        trilha: "pequenos",
        titulo: "3 pares",
        objetivo: "Encontre os 3 pares de figuras.",
        dificuldade: "simples",
        configuracao: {
          conjuntos: [
            [
              {
                id: "melancia",
                nome: "Melancia",
                simbolo: "🍉"
              },
              {
                id: "papel",
                nome: "Papel",
                simbolo: "📄"
              },
              {
                id: "cacto",
                nome: "Cacto",
                simbolo: "🌵"
              }
            ],
            [
              {
                id: "banana",
                nome: "Banana",
                simbolo: "🍌"
              },
              {
                id: "queijo",
                nome: "Queijo",
                simbolo: "🧀"
              },
              {
                id: "dado",
                nome: "Dado",
                simbolo: "🎲"
              }
            ]
          ]
        }
      },
      {
        numero: 3,
        trilha: "pequenos",
        titulo: "3 pares",
        objetivo: "Encontre os 3 pares de figuras. Algumas figuras se parecem.",
        dificuldade: "media",
        configuracao: {
          conjuntos: [
            [
              {
                id: "camiseta",
                nome: "Camiseta",
                simbolo: "👕"
              },
              {
                id: "bone",
                nome: "Boné",
                simbolo: "🧢"
              },
              {
                id: "dado",
                nome: "Dado",
                simbolo: "🎲"
              }
            ],
            [
              {
                id: "balao",
                nome: "Balão",
                simbolo: "🎈"
              },
              {
                id: "tenis",
                nome: "Tênis",
                simbolo: "👟"
              },
              {
                id: "bone",
                nome: "Boné",
                simbolo: "🧢"
              }
            ]
          ]
        }
      },
      {
        numero: 4,
        trilha: "pequenos",
        titulo: "4 pares",
        objetivo: "Encontre os 4 pares de figuras. Algumas figuras se parecem.",
        dificuldade: "media",
        configuracao: {
          conjuntos: [
            [
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
                id: "flor",
                nome: "Flor",
                simbolo: "🌸"
              },
              {
                id: "limao",
                nome: "Limão",
                simbolo: "🍋"
              }
            ],
            [
              {
                id: "queijo",
                nome: "Queijo",
                simbolo: "🧀"
              },
              {
                id: "sanduiche",
                nome: "Sanduíche",
                simbolo: "🥪"
              },
              {
                id: "coelho",
                nome: "Coelho",
                simbolo: "🐇"
              },
              {
                id: "escova",
                nome: "Escova de dentes",
                simbolo: "🪥"
              }
            ]
          ]
        }
      },
      {
        numero: 5,
        trilha: "pequenos",
        titulo: "4 pares",
        objetivo: "Encontre os 4 pares de figuras. Algumas figuras se parecem.",
        dificuldade: "avancada",
        configuracao: {
          conjuntos: [
            [
              {
                id: "floco",
                nome: "Floco de neve",
                simbolo: "❄️"
              },
              {
                id: "lapis",
                nome: "Lápis",
                simbolo: "✏️"
              },
              {
                id: "chuva",
                nome: "Chuva",
                simbolo: "🌧️"
              },
              {
                id: "giz",
                nome: "Giz de cera",
                simbolo: "🖍️"
              }
            ],
            [
              {
                id: "arco-iris",
                nome: "Arco-íris",
                simbolo: "🌈"
              },
              {
                id: "milho",
                nome: "Milho",
                simbolo: "🌽"
              },
              {
                id: "queijo",
                nome: "Queijo",
                simbolo: "🧀"
              },
              {
                id: "cenoura",
                nome: "Cenoura",
                simbolo: "🥕"
              }
            ]
          ]
        }
      },
      {
        numero: 6,
        trilha: "medios",
        titulo: "5 pares",
        objetivo: "Encontre os 5 pares de figuras. Algumas figuras se parecem.",
        dificuldade: "simples",
        configuracao: {
          conjuntos: [
            [
              {
                id: "estrela",
                nome: "Estrela",
                simbolo: "⭐"
              },
              {
                id: "girassol",
                nome: "Girassol",
                simbolo: "🌻"
              },
              {
                id: "cadeira",
                nome: "Cadeira",
                simbolo: "🪑"
              },
              {
                id: "xicara",
                nome: "Xícara",
                simbolo: "☕"
              },
              {
                id: "lua",
                nome: "Lua",
                simbolo: "🌙"
              }
            ],
            [
              {
                id: "estrela",
                nome: "Estrela",
                simbolo: "⭐"
              },
              {
                id: "brocolis",
                nome: "Brócolis",
                simbolo: "🥦"
              },
              {
                id: "pera",
                nome: "Pera",
                simbolo: "🍐"
              },
              {
                id: "manga",
                nome: "Manga",
                simbolo: "🥭"
              },
              {
                id: "morango",
                nome: "Morango",
                simbolo: "🍓"
              }
            ]
          ]
        }
      },
      {
        numero: 7,
        trilha: "medios",
        titulo: "5 pares",
        objetivo: "Encontre os 5 pares de figuras. Algumas figuras se parecem.",
        dificuldade: "simples",
        configuracao: {
          conjuntos: [
            [
              {
                id: "foguete",
                nome: "Foguete",
                simbolo: "🚀"
              },
              {
                id: "patinete",
                nome: "Patinete",
                simbolo: "🛴"
              },
              {
                id: "macaco",
                nome: "Macaco",
                simbolo: "🐒"
              },
              {
                id: "aviao",
                nome: "Avião",
                simbolo: "✈️"
              },
              {
                id: "onibus",
                nome: "Ônibus",
                simbolo: "🚌"
              }
            ],
            [
              {
                id: "aviao",
                nome: "Avião",
                simbolo: "✈️"
              },
              {
                id: "tesoura",
                nome: "Tesoura",
                simbolo: "✂️"
              },
              {
                id: "foguete",
                nome: "Foguete",
                simbolo: "🚀"
              },
              {
                id: "patinete",
                nome: "Patinete",
                simbolo: "🛴"
              },
              {
                id: "barco",
                nome: "Barco",
                simbolo: "⛵"
              }
            ]
          ]
        }
      },
      {
        numero: 8,
        trilha: "medios",
        titulo: "6 pares",
        objetivo: "Encontre os 6 pares de figuras. Algumas figuras se parecem.",
        dificuldade: "media",
        configuracao: {
          conjuntos: [
            [
              {
                id: "bone",
                nome: "Boné",
                simbolo: "🧢"
              },
              {
                id: "meia",
                nome: "Meia",
                simbolo: "🧦"
              },
              {
                id: "abacaxi",
                nome: "Abacaxi",
                simbolo: "🍍"
              },
              {
                id: "balao",
                nome: "Balão",
                simbolo: "🎈"
              },
              {
                id: "mochila",
                nome: "Mochila",
                simbolo: "🎒"
              },
              {
                id: "dado",
                nome: "Dado",
                simbolo: "🎲"
              }
            ],
            [
              {
                id: "pao",
                nome: "Pão",
                simbolo: "🍞"
              },
              {
                id: "biscoito",
                nome: "Biscoito",
                simbolo: "🍪"
              },
              {
                id: "kiwi",
                nome: "Kiwi",
                simbolo: "🥝"
              },
              {
                id: "banana",
                nome: "Banana",
                simbolo: "🍌"
              },
              {
                id: "coco",
                nome: "Coco",
                simbolo: "🥥"
              },
              {
                id: "regua",
                nome: "Régua",
                simbolo: "📏"
              }
            ]
          ]
        }
      },
      {
        numero: 9,
        trilha: "medios",
        titulo: "6 pares",
        objetivo: "Encontre os 6 pares de figuras. Algumas figuras se parecem.",
        dificuldade: "media",
        configuracao: {
          conjuntos: [
            [
              {
                id: "estrela",
                nome: "Estrela",
                simbolo: "⭐"
              },
              {
                id: "chuva",
                nome: "Chuva",
                simbolo: "🌧️"
              },
              {
                id: "regua",
                nome: "Régua",
                simbolo: "📏"
              },
              {
                id: "tesoura",
                nome: "Tesoura",
                simbolo: "✂️"
              },
              {
                id: "lapis",
                nome: "Lápis",
                simbolo: "✏️"
              },
              {
                id: "papel",
                nome: "Papel",
                simbolo: "📄"
              }
            ],
            [
              {
                id: "casa",
                nome: "Casa",
                simbolo: "🏠"
              },
              {
                id: "trator",
                nome: "Trator",
                simbolo: "🚜"
              },
              {
                id: "cama",
                nome: "Cama",
                simbolo: "🛏️"
              },
              {
                id: "trem",
                nome: "Trem",
                simbolo: "🚂"
              },
              {
                id: "aviao",
                nome: "Avião",
                simbolo: "✈️"
              },
              {
                id: "helicoptero",
                nome: "Helicóptero",
                simbolo: "🚁"
              }
            ]
          ]
        }
      },
      {
        numero: 10,
        trilha: "medios",
        titulo: "7 pares",
        objetivo: "Encontre os 7 pares de figuras. Algumas figuras se parecem.",
        dificuldade: "avancada",
        configuracao: {
          conjuntos: [
            [
              {
                id: "giz",
                nome: "Giz de cera",
                simbolo: "🖍️"
              },
              {
                id: "bola-basquete",
                nome: "Bola de basquete",
                simbolo: "🏀"
              },
              {
                id: "banana",
                nome: "Banana",
                simbolo: "🍌"
              },
              {
                id: "pipa",
                nome: "Pipa",
                simbolo: "🪁"
              },
              {
                id: "papel",
                nome: "Papel",
                simbolo: "📄"
              },
              {
                id: "manga",
                nome: "Manga",
                simbolo: "🥭"
              },
              {
                id: "pera",
                nome: "Pera",
                simbolo: "🍐"
              }
            ],
            [
              {
                id: "ursinho",
                nome: "Ursinho",
                simbolo: "🧸"
              },
              {
                id: "bolo",
                nome: "Bolo",
                simbolo: "🎂"
              },
              {
                id: "sanduiche",
                nome: "Sanduíche",
                simbolo: "🥪"
              },
              {
                id: "bone",
                nome: "Boné",
                simbolo: "🧢"
              },
              {
                id: "biscoito",
                nome: "Biscoito",
                simbolo: "🍪"
              },
              {
                id: "tenis",
                nome: "Tênis",
                simbolo: "👟"
              },
              {
                id: "milho",
                nome: "Milho",
                simbolo: "🌽"
              }
            ]
          ]
        }
      },
      {
        numero: 11,
        trilha: "grandes",
        titulo: "7 pares",
        objetivo: "Encontre os 7 pares de figuras. Algumas figuras se parecem.",
        dificuldade: "simples",
        configuracao: {
          conjuntos: [
            [
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
                id: "pera",
                nome: "Pera",
                simbolo: "🍐"
              },
              {
                id: "banana",
                nome: "Banana",
                simbolo: "🍌"
              },
              {
                id: "cogumelo",
                nome: "Cogumelo",
                simbolo: "🍄"
              },
              {
                id: "girassol",
                nome: "Girassol",
                simbolo: "🌻"
              },
              {
                id: "broto",
                nome: "Broto",
                simbolo: "🌱"
              }
            ],
            [
              {
                id: "porco",
                nome: "Porco",
                simbolo: "🐖"
              },
              {
                id: "pinguim",
                nome: "Pinguim",
                simbolo: "🐧"
              },
              {
                id: "gato",
                nome: "Gato",
                simbolo: "🐈"
              },
              {
                id: "bolo",
                nome: "Bolo",
                simbolo: "🎂"
              },
              {
                id: "ovo",
                nome: "Ovo",
                simbolo: "🥚"
              },
              {
                id: "queijo",
                nome: "Queijo",
                simbolo: "🧀"
              },
              {
                id: "elefante",
                nome: "Elefante",
                simbolo: "🐘"
              }
            ]
          ]
        }
      },
      {
        numero: 12,
        trilha: "grandes",
        titulo: "8 pares",
        objetivo: "Encontre os 8 pares de figuras. Algumas figuras se parecem.",
        dificuldade: "simples",
        configuracao: {
          conjuntos: [
            [
              {
                id: "bicicleta",
                nome: "Bicicleta",
                simbolo: "🚲"
              },
              {
                id: "cereja",
                nome: "Cereja",
                simbolo: "🍒"
              },
              {
                id: "tenis",
                nome: "Tênis",
                simbolo: "👟"
              },
              {
                id: "laranja",
                nome: "Laranja",
                simbolo: "🍊"
              },
              {
                id: "aviao",
                nome: "Avião",
                simbolo: "✈️"
              },
              {
                id: "patinete",
                nome: "Patinete",
                simbolo: "🛴"
              },
              {
                id: "mochila",
                nome: "Mochila",
                simbolo: "🎒"
              },
              {
                id: "bone",
                nome: "Boné",
                simbolo: "🧢"
              }
            ],
            [
              {
                id: "bola",
                nome: "Bola",
                simbolo: "⚽"
              },
              {
                id: "flor",
                nome: "Flor",
                simbolo: "🌸"
              },
              {
                id: "lapis",
                nome: "Lápis",
                simbolo: "✏️"
              },
              {
                id: "balao",
                nome: "Balão",
                simbolo: "🎈"
              },
              {
                id: "tesoura",
                nome: "Tesoura",
                simbolo: "✂️"
              },
              {
                id: "tulipa",
                nome: "Tulipa",
                simbolo: "🌷"
              },
              {
                id: "papel",
                nome: "Papel",
                simbolo: "📄"
              },
              {
                id: "bola-basquete",
                nome: "Bola de basquete",
                simbolo: "🏀"
              }
            ]
          ]
        }
      },
      {
        numero: 13,
        trilha: "grandes",
        titulo: "8 pares",
        objetivo: "Encontre os 8 pares de figuras. Algumas figuras se parecem.",
        dificuldade: "media",
        configuracao: {
          conjuntos: [
            [
              {
                id: "mochila",
                nome: "Mochila",
                simbolo: "🎒"
              },
              {
                id: "escova",
                nome: "Escova de dentes",
                simbolo: "🪥"
              },
              {
                id: "cadeira",
                nome: "Cadeira",
                simbolo: "🪑"
              },
              {
                id: "despertador",
                nome: "Despertador",
                simbolo: "⏰"
              },
              {
                id: "casa",
                nome: "Casa",
                simbolo: "🏠"
              },
              {
                id: "tenis",
                nome: "Tênis",
                simbolo: "👟"
              },
              {
                id: "bone",
                nome: "Boné",
                simbolo: "🧢"
              },
              {
                id: "chave",
                nome: "Chave",
                simbolo: "🔑"
              }
            ],
            [
              {
                id: "sabonete",
                nome: "Sabonete",
                simbolo: "🧼"
              },
              {
                id: "chave",
                nome: "Chave",
                simbolo: "🔑"
              },
              {
                id: "cama",
                nome: "Cama",
                simbolo: "🛏️"
              },
              {
                id: "escova",
                nome: "Escova de dentes",
                simbolo: "🪥"
              },
              {
                id: "despertador",
                nome: "Despertador",
                simbolo: "⏰"
              },
              {
                id: "abacaxi",
                nome: "Abacaxi",
                simbolo: "🍍"
              },
              {
                id: "manga",
                nome: "Manga",
                simbolo: "🥭"
              },
              {
                id: "kiwi",
                nome: "Kiwi",
                simbolo: "🥝"
              }
            ]
          ]
        }
      },
      {
        numero: 14,
        trilha: "grandes",
        titulo: "9 pares",
        objetivo: "Encontre os 9 pares de figuras. Algumas figuras se parecem.",
        dificuldade: "media",
        configuracao: {
          conjuntos: [
            [
              {
                id: "casa",
                nome: "Casa",
                simbolo: "🏠"
              },
              {
                id: "sanduiche",
                nome: "Sanduíche",
                simbolo: "🥪"
              },
              {
                id: "batata",
                nome: "Batata",
                simbolo: "🥔"
              },
              {
                id: "despertador",
                nome: "Despertador",
                simbolo: "⏰"
              },
              {
                id: "xicara",
                nome: "Xícara",
                simbolo: "☕"
              },
              {
                id: "milho",
                nome: "Milho",
                simbolo: "🌽"
              },
              {
                id: "biscoito",
                nome: "Biscoito",
                simbolo: "🍪"
              },
              {
                id: "camiseta",
                nome: "Camiseta",
                simbolo: "👕"
              },
              {
                id: "meia",
                nome: "Meia",
                simbolo: "🧦"
              }
            ],
            [
              {
                id: "cenoura",
                nome: "Cenoura",
                simbolo: "🥕"
              },
              {
                id: "brocolis",
                nome: "Brócolis",
                simbolo: "🥦"
              },
              {
                id: "cereja",
                nome: "Cereja",
                simbolo: "🍒"
              },
              {
                id: "melancia",
                nome: "Melancia",
                simbolo: "🍉"
              },
              {
                id: "girassol",
                nome: "Girassol",
                simbolo: "🌻"
              },
              {
                id: "flor",
                nome: "Flor",
                simbolo: "🌸"
              },
              {
                id: "cogumelo",
                nome: "Cogumelo",
                simbolo: "🍄"
              },
              {
                id: "maca",
                nome: "Maçã",
                simbolo: "🍎"
              },
              {
                id: "vaso",
                nome: "Vaso de planta",
                simbolo: "🪴"
              }
            ]
          ]
        }
      },
      {
        numero: 15,
        trilha: "grandes",
        titulo: "10 pares",
        objetivo: "Encontre os 10 pares de figuras. Algumas figuras se parecem.",
        dificuldade: "avancada",
        configuracao: {
          conjuntos: [
            [
              {
                id: "cadeira",
                nome: "Cadeira",
                simbolo: "🪑"
              },
              {
                id: "cogumelo",
                nome: "Cogumelo",
                simbolo: "🍄"
              },
              {
                id: "xicara",
                nome: "Xícara",
                simbolo: "☕"
              },
              {
                id: "tulipa",
                nome: "Tulipa",
                simbolo: "🌷"
              },
              {
                id: "coco",
                nome: "Coco",
                simbolo: "🥥"
              },
              {
                id: "vela",
                nome: "Vela",
                simbolo: "🕯️"
              },
              {
                id: "flor",
                nome: "Flor",
                simbolo: "🌸"
              },
              {
                id: "escova",
                nome: "Escova de dentes",
                simbolo: "🪥"
              },
              {
                id: "manga",
                nome: "Manga",
                simbolo: "🥭"
              },
              {
                id: "folha",
                nome: "Folha",
                simbolo: "🍃"
              }
            ],
            [
              {
                id: "cenoura",
                nome: "Cenoura",
                simbolo: "🥕"
              },
              {
                id: "regua",
                nome: "Régua",
                simbolo: "📏"
              },
              {
                id: "tesoura",
                nome: "Tesoura",
                simbolo: "✂️"
              },
              {
                id: "morango",
                nome: "Morango",
                simbolo: "🍓"
              },
              {
                id: "lapis",
                nome: "Lápis",
                simbolo: "✏️"
              },
              {
                id: "pera",
                nome: "Pera",
                simbolo: "🍐"
              },
              {
                id: "laranja",
                nome: "Laranja",
                simbolo: "🍊"
              },
              {
                id: "banana",
                nome: "Banana",
                simbolo: "🍌"
              },
              {
                id: "papel",
                nome: "Papel",
                simbolo: "📄"
              },
              {
                id: "giz",
                nome: "Giz de cera",
                simbolo: "🖍️"
              }
            ]
          ]
        }
      }
    ]
  },
  {
    id: "sequencia",
    nome: "Complete a sequência",
    descricao: "Descubra o padrão e escolha a peça que falta.",
    categoria: "raciocinio",
    instrucoes: "Leia as peças na ordem em que aparecem. Observe o trecho que se repete e escolha a peça que completa o espaço vazio.",
    tipoMecanica: "sequencia",
    versao: 2,
    faixaEtariaMin: 5,
    faixaEtariaMax: 8,
    ordemEditorial: 2,
    fases: [
      {
        numero: 1,
        trilha: "pequenos",
        titulo: "Padrão de 2",
        objetivo: "Descubra a próxima peça do padrão de 2.",
        dificuldade: "simples",
        configuracao: {
          comprimento: 5,
          lacuna: 4,
          padroes: [
            [
              {
                id: "circulo-verde",
                forma: "circulo",
                cor: "verde",
                nome: "Círculo verde"
              },
              {
                id: "losango-roxo",
                forma: "losango",
                cor: "roxo",
                nome: "Losango roxo"
              }
            ],
            [
              {
                id: "circulo-verde",
                forma: "circulo",
                cor: "verde",
                nome: "Círculo verde"
              },
              {
                id: "triangulo-azul",
                forma: "triangulo",
                cor: "azul",
                nome: "Triângulo azul"
              }
            ]
          ]
        }
      },
      {
        numero: 2,
        trilha: "pequenos",
        titulo: "Padrão de 2",
        objetivo: "Descubra a próxima peça do padrão de 2.",
        dificuldade: "simples",
        configuracao: {
          comprimento: 6,
          lacuna: 5,
          padroes: [
            [
              {
                id: "circulo-azul",
                forma: "circulo",
                cor: "azul",
                nome: "Círculo azul"
              },
              {
                id: "triangulo-verde",
                forma: "triangulo",
                cor: "verde",
                nome: "Triângulo verde"
              }
            ],
            [
              {
                id: "circulo-dourado",
                forma: "circulo",
                cor: "dourado",
                nome: "Círculo dourado"
              },
              {
                id: "quadrado-azul",
                forma: "quadrado",
                cor: "azul",
                nome: "Quadrado azul"
              }
            ]
          ]
        }
      },
      {
        numero: 3,
        trilha: "pequenos",
        titulo: "Padrão de 2",
        objetivo: "Descubra a peça que falta no meio do padrão de 2.",
        dificuldade: "media",
        configuracao: {
          comprimento: 6,
          lacuna: 3,
          padroes: [
            [
              {
                id: "circulo-roxo",
                forma: "circulo",
                cor: "roxo",
                nome: "Círculo roxo"
              },
              {
                id: "quadrado-verde",
                forma: "quadrado",
                cor: "verde",
                nome: "Quadrado verde"
              }
            ],
            [
              {
                id: "circulo-roxo",
                forma: "circulo",
                cor: "roxo",
                nome: "Círculo roxo"
              },
              {
                id: "triangulo-azul",
                forma: "triangulo",
                cor: "azul",
                nome: "Triângulo azul"
              }
            ]
          ]
        }
      },
      {
        numero: 4,
        trilha: "pequenos",
        titulo: "Padrão de 3",
        objetivo: "Descubra a próxima peça do padrão de 3.",
        dificuldade: "media",
        configuracao: {
          comprimento: 7,
          lacuna: 6,
          padroes: [
            [
              {
                id: "circulo-roxo",
                forma: "circulo",
                cor: "roxo",
                nome: "Círculo roxo"
              },
              {
                id: "quadrado-verde",
                forma: "quadrado",
                cor: "verde",
                nome: "Quadrado verde"
              },
              {
                id: "circulo-verde",
                forma: "circulo",
                cor: "verde",
                nome: "Círculo verde"
              }
            ],
            [
              {
                id: "circulo-verde",
                forma: "circulo",
                cor: "verde",
                nome: "Círculo verde"
              },
              {
                id: "quadrado-verde",
                forma: "quadrado",
                cor: "verde",
                nome: "Quadrado verde"
              },
              {
                id: "circulo-roxo",
                forma: "circulo",
                cor: "roxo",
                nome: "Círculo roxo"
              }
            ]
          ]
        }
      },
      {
        numero: 5,
        trilha: "pequenos",
        titulo: "Padrão de 3",
        objetivo: "Descubra a peça que falta no meio do padrão de 3.",
        dificuldade: "avancada",
        configuracao: {
          comprimento: 8,
          lacuna: 4,
          padroes: [
            [
              {
                id: "losango-verde",
                forma: "losango",
                cor: "verde",
                nome: "Losango verde"
              },
              {
                id: "circulo-verde",
                forma: "circulo",
                cor: "verde",
                nome: "Círculo verde"
              },
              {
                id: "circulo-azul",
                forma: "circulo",
                cor: "azul",
                nome: "Círculo azul"
              }
            ],
            [
              {
                id: "quadrado-verde",
                forma: "quadrado",
                cor: "verde",
                nome: "Quadrado verde"
              },
              {
                id: "quadrado-azul",
                forma: "quadrado",
                cor: "azul",
                nome: "Quadrado azul"
              },
              {
                id: "circulo-verde",
                forma: "circulo",
                cor: "verde",
                nome: "Círculo verde"
              }
            ]
          ]
        }
      },
      {
        numero: 6,
        trilha: "medios",
        titulo: "Padrão de 3",
        objetivo: "Descubra a peça que falta no meio do padrão de 3.",
        dificuldade: "simples",
        configuracao: {
          comprimento: 9,
          lacuna: 5,
          padroes: [
            [
              {
                id: "circulo-dourado",
                forma: "circulo",
                cor: "dourado",
                nome: "Círculo dourado"
              },
              {
                id: "circulo-azul",
                forma: "circulo",
                cor: "azul",
                nome: "Círculo azul"
              },
              {
                id: "triangulo-azul",
                forma: "triangulo",
                cor: "azul",
                nome: "Triângulo azul"
              }
            ],
            [
              {
                id: "circulo-azul",
                forma: "circulo",
                cor: "azul",
                nome: "Círculo azul"
              },
              {
                id: "circulo-dourado",
                forma: "circulo",
                cor: "dourado",
                nome: "Círculo dourado"
              },
              {
                id: "losango-verde",
                forma: "losango",
                cor: "verde",
                nome: "Losango verde"
              }
            ]
          ]
        }
      },
      {
        numero: 7,
        trilha: "medios",
        titulo: "Padrão de 4",
        objetivo: "Descubra a próxima peça do padrão de 4.",
        dificuldade: "simples",
        configuracao: {
          comprimento: 9,
          lacuna: 8,
          padroes: [
            [
              {
                id: "quadrado-azul",
                forma: "quadrado",
                cor: "azul",
                nome: "Quadrado azul"
              },
              {
                id: "triangulo-verde",
                forma: "triangulo",
                cor: "verde",
                nome: "Triângulo verde"
              },
              {
                id: "triangulo-azul",
                forma: "triangulo",
                cor: "azul",
                nome: "Triângulo azul"
              },
              {
                id: "circulo-dourado",
                forma: "circulo",
                cor: "dourado",
                nome: "Círculo dourado"
              }
            ],
            [
              {
                id: "triangulo-azul",
                forma: "triangulo",
                cor: "azul",
                nome: "Triângulo azul"
              },
              {
                id: "triangulo-verde",
                forma: "triangulo",
                cor: "verde",
                nome: "Triângulo verde"
              },
              {
                id: "circulo-dourado",
                forma: "circulo",
                cor: "dourado",
                nome: "Círculo dourado"
              },
              {
                id: "circulo-verde",
                forma: "circulo",
                cor: "verde",
                nome: "Círculo verde"
              }
            ]
          ]
        }
      },
      {
        numero: 8,
        trilha: "medios",
        titulo: "Padrão de 4",
        objetivo: "Descubra a peça que falta no meio do padrão de 4.",
        dificuldade: "media",
        configuracao: {
          comprimento: 10,
          lacuna: 5,
          padroes: [
            [
              {
                id: "quadrado-verde",
                forma: "quadrado",
                cor: "verde",
                nome: "Quadrado verde"
              },
              {
                id: "triangulo-verde",
                forma: "triangulo",
                cor: "verde",
                nome: "Triângulo verde"
              },
              {
                id: "quadrado-azul",
                forma: "quadrado",
                cor: "azul",
                nome: "Quadrado azul"
              },
              {
                id: "losango-verde",
                forma: "losango",
                cor: "verde",
                nome: "Losango verde"
              }
            ],
            [
              {
                id: "losango-verde",
                forma: "losango",
                cor: "verde",
                nome: "Losango verde"
              },
              {
                id: "quadrado-azul",
                forma: "quadrado",
                cor: "azul",
                nome: "Quadrado azul"
              },
              {
                id: "quadrado-verde",
                forma: "quadrado",
                cor: "verde",
                nome: "Quadrado verde"
              },
              {
                id: "losango-roxo",
                forma: "losango",
                cor: "roxo",
                nome: "Losango roxo"
              }
            ]
          ]
        }
      },
      {
        numero: 9,
        trilha: "medios",
        titulo: "Padrão de 4",
        objetivo: "Descubra a peça que falta no meio do padrão de 4.",
        dificuldade: "media",
        configuracao: {
          comprimento: 11,
          lacuna: 6,
          padroes: [
            [
              {
                id: "circulo-verde",
                forma: "circulo",
                cor: "verde",
                nome: "Círculo verde"
              },
              {
                id: "circulo-dourado",
                forma: "circulo",
                cor: "dourado",
                nome: "Círculo dourado"
              },
              {
                id: "losango-roxo",
                forma: "losango",
                cor: "roxo",
                nome: "Losango roxo"
              },
              {
                id: "triangulo-verde",
                forma: "triangulo",
                cor: "verde",
                nome: "Triângulo verde"
              }
            ],
            [
              {
                id: "circulo-dourado",
                forma: "circulo",
                cor: "dourado",
                nome: "Círculo dourado"
              },
              {
                id: "triangulo-azul",
                forma: "triangulo",
                cor: "azul",
                nome: "Triângulo azul"
              },
              {
                id: "losango-verde",
                forma: "losango",
                cor: "verde",
                nome: "Losango verde"
              },
              {
                id: "circulo-azul",
                forma: "circulo",
                cor: "azul",
                nome: "Círculo azul"
              }
            ]
          ]
        }
      },
      {
        numero: 10,
        trilha: "medios",
        titulo: "Padrão de 5",
        objetivo: "Descubra a peça que falta no meio do padrão de 5.",
        dificuldade: "avancada",
        configuracao: {
          comprimento: 11,
          lacuna: 5,
          padroes: [
            [
              {
                id: "circulo-azul",
                forma: "circulo",
                cor: "azul",
                nome: "Círculo azul"
              },
              {
                id: "triangulo-azul",
                forma: "triangulo",
                cor: "azul",
                nome: "Triângulo azul"
              },
              {
                id: "quadrado-verde",
                forma: "quadrado",
                cor: "verde",
                nome: "Quadrado verde"
              },
              {
                id: "circulo-roxo",
                forma: "circulo",
                cor: "roxo",
                nome: "Círculo roxo"
              },
              {
                id: "losango-roxo",
                forma: "losango",
                cor: "roxo",
                nome: "Losango roxo"
              }
            ],
            [
              {
                id: "circulo-verde",
                forma: "circulo",
                cor: "verde",
                nome: "Círculo verde"
              },
              {
                id: "circulo-roxo",
                forma: "circulo",
                cor: "roxo",
                nome: "Círculo roxo"
              },
              {
                id: "circulo-azul",
                forma: "circulo",
                cor: "azul",
                nome: "Círculo azul"
              },
              {
                id: "triangulo-azul",
                forma: "triangulo",
                cor: "azul",
                nome: "Triângulo azul"
              },
              {
                id: "circulo-dourado",
                forma: "circulo",
                cor: "dourado",
                nome: "Círculo dourado"
              }
            ]
          ]
        }
      },
      {
        numero: 11,
        trilha: "grandes",
        titulo: "Padrão de 5",
        objetivo: "Descubra a peça que falta no meio do padrão de 5.",
        dificuldade: "simples",
        configuracao: {
          comprimento: 12,
          lacuna: 6,
          padroes: [
            [
              {
                id: "circulo-verde",
                forma: "circulo",
                cor: "verde",
                nome: "Círculo verde"
              },
              {
                id: "quadrado-azul",
                forma: "quadrado",
                cor: "azul",
                nome: "Quadrado azul"
              },
              {
                id: "losango-roxo",
                forma: "losango",
                cor: "roxo",
                nome: "Losango roxo"
              },
              {
                id: "circulo-dourado",
                forma: "circulo",
                cor: "dourado",
                nome: "Círculo dourado"
              },
              {
                id: "quadrado-verde",
                forma: "quadrado",
                cor: "verde",
                nome: "Quadrado verde"
              }
            ],
            [
              {
                id: "circulo-verde",
                forma: "circulo",
                cor: "verde",
                nome: "Círculo verde"
              },
              {
                id: "quadrado-azul",
                forma: "quadrado",
                cor: "azul",
                nome: "Quadrado azul"
              },
              {
                id: "circulo-azul",
                forma: "circulo",
                cor: "azul",
                nome: "Círculo azul"
              },
              {
                id: "circulo-dourado",
                forma: "circulo",
                cor: "dourado",
                nome: "Círculo dourado"
              },
              {
                id: "quadrado-verde",
                forma: "quadrado",
                cor: "verde",
                nome: "Quadrado verde"
              }
            ]
          ]
        }
      },
      {
        numero: 12,
        trilha: "grandes",
        titulo: "Padrão de 5",
        objetivo: "Descubra a peça que falta no meio do padrão de 5.",
        dificuldade: "simples",
        configuracao: {
          comprimento: 13,
          lacuna: 7,
          padroes: [
            [
              {
                id: "triangulo-azul",
                forma: "triangulo",
                cor: "azul",
                nome: "Triângulo azul"
              },
              {
                id: "quadrado-azul",
                forma: "quadrado",
                cor: "azul",
                nome: "Quadrado azul"
              },
              {
                id: "circulo-verde",
                forma: "circulo",
                cor: "verde",
                nome: "Círculo verde"
              },
              {
                id: "circulo-roxo",
                forma: "circulo",
                cor: "roxo",
                nome: "Círculo roxo"
              },
              {
                id: "triangulo-verde",
                forma: "triangulo",
                cor: "verde",
                nome: "Triângulo verde"
              }
            ],
            [
              {
                id: "quadrado-azul",
                forma: "quadrado",
                cor: "azul",
                nome: "Quadrado azul"
              },
              {
                id: "circulo-azul",
                forma: "circulo",
                cor: "azul",
                nome: "Círculo azul"
              },
              {
                id: "losango-verde",
                forma: "losango",
                cor: "verde",
                nome: "Losango verde"
              },
              {
                id: "quadrado-verde",
                forma: "quadrado",
                cor: "verde",
                nome: "Quadrado verde"
              },
              {
                id: "circulo-roxo",
                forma: "circulo",
                cor: "roxo",
                nome: "Círculo roxo"
              }
            ]
          ]
        }
      },
      {
        numero: 13,
        trilha: "grandes",
        titulo: "Padrão de 6",
        objetivo: "Descubra a peça que falta no meio do padrão de 6.",
        dificuldade: "media",
        configuracao: {
          comprimento: 13,
          lacuna: 6,
          padroes: [
            [
              {
                id: "losango-roxo",
                forma: "losango",
                cor: "roxo",
                nome: "Losango roxo"
              },
              {
                id: "triangulo-azul",
                forma: "triangulo",
                cor: "azul",
                nome: "Triângulo azul"
              },
              {
                id: "circulo-roxo",
                forma: "circulo",
                cor: "roxo",
                nome: "Círculo roxo"
              },
              {
                id: "circulo-verde",
                forma: "circulo",
                cor: "verde",
                nome: "Círculo verde"
              },
              {
                id: "triangulo-verde",
                forma: "triangulo",
                cor: "verde",
                nome: "Triângulo verde"
              },
              {
                id: "losango-verde",
                forma: "losango",
                cor: "verde",
                nome: "Losango verde"
              }
            ],
            [
              {
                id: "quadrado-azul",
                forma: "quadrado",
                cor: "azul",
                nome: "Quadrado azul"
              },
              {
                id: "circulo-verde",
                forma: "circulo",
                cor: "verde",
                nome: "Círculo verde"
              },
              {
                id: "circulo-dourado",
                forma: "circulo",
                cor: "dourado",
                nome: "Círculo dourado"
              },
              {
                id: "circulo-roxo",
                forma: "circulo",
                cor: "roxo",
                nome: "Círculo roxo"
              },
              {
                id: "triangulo-azul",
                forma: "triangulo",
                cor: "azul",
                nome: "Triângulo azul"
              },
              {
                id: "triangulo-verde",
                forma: "triangulo",
                cor: "verde",
                nome: "Triângulo verde"
              }
            ]
          ]
        }
      },
      {
        numero: 14,
        trilha: "grandes",
        titulo: "Padrão de 6",
        objetivo: "Descubra a peça que falta no meio do padrão de 6.",
        dificuldade: "media",
        configuracao: {
          comprimento: 14,
          lacuna: 7,
          padroes: [
            [
              {
                id: "quadrado-verde",
                forma: "quadrado",
                cor: "verde",
                nome: "Quadrado verde"
              },
              {
                id: "circulo-azul",
                forma: "circulo",
                cor: "azul",
                nome: "Círculo azul"
              },
              {
                id: "circulo-verde",
                forma: "circulo",
                cor: "verde",
                nome: "Círculo verde"
              },
              {
                id: "losango-roxo",
                forma: "losango",
                cor: "roxo",
                nome: "Losango roxo"
              },
              {
                id: "circulo-dourado",
                forma: "circulo",
                cor: "dourado",
                nome: "Círculo dourado"
              },
              {
                id: "triangulo-azul",
                forma: "triangulo",
                cor: "azul",
                nome: "Triângulo azul"
              }
            ],
            [
              {
                id: "circulo-dourado",
                forma: "circulo",
                cor: "dourado",
                nome: "Círculo dourado"
              },
              {
                id: "circulo-roxo",
                forma: "circulo",
                cor: "roxo",
                nome: "Círculo roxo"
              },
              {
                id: "triangulo-azul",
                forma: "triangulo",
                cor: "azul",
                nome: "Triângulo azul"
              },
              {
                id: "quadrado-azul",
                forma: "quadrado",
                cor: "azul",
                nome: "Quadrado azul"
              },
              {
                id: "triangulo-verde",
                forma: "triangulo",
                cor: "verde",
                nome: "Triângulo verde"
              },
              {
                id: "circulo-azul",
                forma: "circulo",
                cor: "azul",
                nome: "Círculo azul"
              }
            ]
          ]
        }
      },
      {
        numero: 15,
        trilha: "grandes",
        titulo: "Padrão de 6",
        objetivo: "Descubra a peça que falta no meio do padrão de 6.",
        dificuldade: "avancada",
        configuracao: {
          comprimento: 15,
          lacuna: 8,
          padroes: [
            [
              {
                id: "circulo-dourado",
                forma: "circulo",
                cor: "dourado",
                nome: "Círculo dourado"
              },
              {
                id: "circulo-roxo",
                forma: "circulo",
                cor: "roxo",
                nome: "Círculo roxo"
              },
              {
                id: "quadrado-verde",
                forma: "quadrado",
                cor: "verde",
                nome: "Quadrado verde"
              },
              {
                id: "triangulo-verde",
                forma: "triangulo",
                cor: "verde",
                nome: "Triângulo verde"
              },
              {
                id: "circulo-azul",
                forma: "circulo",
                cor: "azul",
                nome: "Círculo azul"
              },
              {
                id: "losango-verde",
                forma: "losango",
                cor: "verde",
                nome: "Losango verde"
              }
            ],
            [
              {
                id: "triangulo-azul",
                forma: "triangulo",
                cor: "azul",
                nome: "Triângulo azul"
              },
              {
                id: "triangulo-verde",
                forma: "triangulo",
                cor: "verde",
                nome: "Triângulo verde"
              },
              {
                id: "circulo-verde",
                forma: "circulo",
                cor: "verde",
                nome: "Círculo verde"
              },
              {
                id: "losango-verde",
                forma: "losango",
                cor: "verde",
                nome: "Losango verde"
              },
              {
                id: "losango-roxo",
                forma: "losango",
                cor: "roxo",
                nome: "Losango roxo"
              },
              {
                id: "quadrado-azul",
                forma: "quadrado",
                cor: "azul",
                nome: "Quadrado azul"
              }
            ]
          ]
        }
      }
    ],
    ativo: false
  },
  {
    id: "labirinto",
    nome: "Caminhos e labirintos",
    descricao: "Pense no percurso e leve a peça até a chegada.",
    categoria: "raciocinio",
    instrucoes: "Use os botões de direção ou as setas do teclado com foco no jogo. Você pode mudar de caminho a qualquer momento.",
    tipoMecanica: "labirinto",
    versao: 3,
    faixaEtariaMin: 5,
    faixaEtariaMax: 8,
    ordemEditorial: 3,
    fases: [
      {
        numero: 1,
        trilha: "pequenos",
        titulo: "Primeiro caminho",
        objetivo: "Leve a peça até a chegada seguindo o corredor.",
        dificuldade: "simples",
        configuracao: {
          mapas: [
            [
              "#######",
              "#I#F..#",
              "#.#.###",
              "#.....#",
              "#######"
            ],
            [
              "#######",
              "#I..#.#",
              "#.###.#",
              "#....F#",
              "#######"
            ]
          ]
        }
      },
      {
        numero: 2,
        trilha: "pequenos",
        titulo: "Uma bifurcação",
        objetivo: "Escolha o caminho que leva à chegada.",
        dificuldade: "simples",
        configuracao: {
          mapas: [
            [
              "#########",
              "#I......#",
              "#.###.###",
              "#...#..F#",
              "#########"
            ],
            [
              "#########",
              "#I......#",
              "#.#.###.#",
              "#.#.#..F#",
              "#########"
            ]
          ]
        }
      },
      {
        numero: 3,
        trilha: "pequenos",
        titulo: "Escolhas no caminho",
        objetivo: "Explore as passagens para encontrar a chegada.",
        dificuldade: "media",
        configuracao: {
          mapas: [
            [
              "#########",
              "#I....#.#",
              "#.#.###.#",
              "#.#....F#",
              "###.###.#",
              "#.....#.#",
              "#########"
            ],
            [
              "#########",
              "#I....#.#",
              "#.#.#.#.#",
              "#.#.#...#",
              "#.###.###",
              "#...#..F#",
              "#########"
            ]
          ]
        }
      },
      {
        numero: 4,
        trilha: "pequenos",
        titulo: "Trajeto mais longo",
        objetivo: "Encontre a chegada passando pelas curvas.",
        dificuldade: "media",
        configuracao: {
          mapas: [
            [
              "#########",
              "#I....#.#",
              "###.###.#",
              "#.......#",
              "###.###.#",
              "#.....#.#",
              "#.###.###",
              "#.#....F#",
              "#########"
            ],
            [
              "#########",
              "#I..#...#",
              "#.#####.#",
              "#.......#",
              "#.#####.#",
              "#...#...#",
              "#.#.###.#",
              "#.#...#F#",
              "#########"
            ]
          ]
        }
      },
      {
        numero: 5,
        trilha: "pequenos",
        titulo: "O grande labirinto",
        objetivo: "Planeje as curvas para encontrar a chegada.",
        dificuldade: "avancada",
        configuracao: {
          mapas: [
            [
              "###########",
              "#I..#...#.#",
              "#.#####.#.#",
              "#.........#",
              "#.#######.#",
              "#.#...#...#",
              "#.#.###.#.#",
              "#.....#F#.#",
              "###########"
            ],
            [
              "###########",
              "#I........#",
              "#.#.#######",
              "#.#.#.....#",
              "#.###.#.###",
              "#.....#..F#",
              "#.#.#.#####",
              "#.#.#.....#",
              "###########"
            ]
          ]
        }
      },
      {
        numero: 6,
        trilha: "medios",
        titulo: "Corredores cruzados",
        objetivo: "Encontre a chegada entre corredores que se cruzam.",
        dificuldade: "simples",
        configuracao: {
          mapas: [
            [
              "###########",
              "#I........#",
              "#.#.#######",
              "#.#.#.#...#",
              "#.#.#.###.#",
              "#.#.......#",
              "#.#####.#.#",
              "#...#...#.#",
              "#######.###",
              "#F........#",
              "###########"
            ],
            [
              "###########",
              "#I#.......#",
              "#.#.#######",
              "#.....#...#",
              "###.###.###",
              "#.........#",
              "#.#####.###",
              "#.#.......#",
              "#####.#####",
              "#........F#",
              "###########"
            ]
          ]
        }
      },
      {
        numero: 7,
        trilha: "medios",
        titulo: "Muitas voltas",
        objetivo: "Siga as voltas sem perder a direção da chegada.",
        dificuldade: "simples",
        configuracao: {
          mapas: [
            [
              "###########",
              "#I........#",
              "#.#.###.###",
              "#.#...#...#",
              "###.###.#.#",
              "#.....#.#.#",
              "#.#.#.#.###",
              "#.#.#.#...#",
              "###.###.#.#",
              "#F#.#...#.#",
              "#.#####.###",
              "#.........#",
              "###########"
            ],
            [
              "###########",
              "#I........#",
              "#.###.#####",
              "#.#.......#",
              "#.#####.#.#",
              "#.#.....#.#",
              "#.###.#.#.#",
              "#.#...#.#.#",
              "#.#.#.#####",
              "#.#.#.....#",
              "###.#####.#",
              "#.....#F..#",
              "###########"
            ]
          ]
        }
      },
      {
        numero: 8,
        trilha: "medios",
        titulo: "Becos pelo caminho",
        objetivo: "Evite os becos e encontre a passagem certa.",
        dificuldade: "media",
        configuracao: {
          mapas: [
            [
              "#############",
              "#I........#.#",
              "#.#########.#",
              "#.....#.#.#.#",
              "#.#.###.#.#.#",
              "#.#.........#",
              "#.###.#####.#",
              "#...#.#.....#",
              "#.#.#.###.###",
              "#.#.#.#.#...#",
              "#.#####.###.#",
              "#.#....F....#",
              "#############"
            ],
            [
              "#############",
              "#I#.......#.#",
              "#.#.#######.#",
              "#...#.#.....#",
              "#.#.#.#.#.#.#",
              "#.#.#...#.#.#",
              "#.#.#.###.#.#",
              "#.#.#...#.#.#",
              "#.###.#####.#",
              "#.......#..F#",
              "#.#.#.#####.#",
              "#.#.#.....#.#",
              "#############"
            ]
          ]
        }
      },
      {
        numero: 9,
        trilha: "medios",
        titulo: "Labirinto quadrado",
        objetivo: "Atravesse o labirinto até a chegada.",
        dificuldade: "media",
        configuracao: {
          mapas: [
            [
              "#############",
              "#I..........#",
              "#.#.#.###.#.#",
              "#.#.#...#.#.#",
              "#.#.#####.#.#",
              "#.#...#...#.#",
              "#.#.#.#####.#",
              "#.#.#...#...#",
              "#.#.#.#####.#",
              "#.#.#.#.....#",
              "#######.#.#.#",
              "#F..#...#.#.#",
              "###.#.#.###.#",
              "#.....#.#...#",
              "#############"
            ],
            [
              "#############",
              "#I..........#",
              "#.#.#.###.#.#",
              "#.#.#.#...#.#",
              "#.#.###.#.#.#",
              "#.#.#...#.#.#",
              "#.#####.#####",
              "#.#.......#.#",
              "#.#.#####.#.#",
              "#.#...#.....#",
              "#######.#####",
              "#...........#",
              "#.#####.###.#",
              "#F#.......#.#",
              "#############"
            ]
          ]
        }
      },
      {
        numero: 10,
        trilha: "medios",
        titulo: "Caminho comprido",
        objetivo: "Planeje o percurso longo até a chegada.",
        dificuldade: "avancada",
        configuracao: {
          mapas: [
            [
              "###############",
              "#I....#...#...#",
              "#.#.#####.#.###",
              "#.#...........#",
              "#.###.#####.###",
              "#.#.#...#...#.#",
              "#.#.#.#.#.###.#",
              "#.#...#.#.....#",
              "#.#.#####.#.###",
              "#.#.....#.#.#.#",
              "###.#.#####.#.#",
              "#...#.#.#.#.#.#",
              "#######.#.#.#.#",
              "#F............#",
              "###############"
            ],
            [
              "###############",
              "#I....#...#..F#",
              "#.#####.#.#.###",
              "#.#.....#.#.#.#",
              "#.#.#######.#.#",
              "#.....#.#.....#",
              "#.#.#.#.#.###.#",
              "#.#.#...#...#.#",
              "###.#####.#####",
              "#.....#.#.....#",
              "###.###.#.#####",
              "#...#...#...#.#",
              "#.#.###.#.#.#.#",
              "#.#.......#...#",
              "###############"
            ]
          ]
        }
      },
      {
        numero: 11,
        trilha: "grandes",
        titulo: "Mapa largo",
        objetivo: "Observe o mapa inteiro antes de começar.",
        dificuldade: "simples",
        configuracao: {
          mapas: [
            [
              "###############",
              "#I............#",
              "#.#######.###.#",
              "#.......#...#.#",
              "#.#.#######.#.#",
              "#.#.......#.#.#",
              "###.#######.#.#",
              "#.#.....#.#.#.#",
              "#.#.#####.#####",
              "#.....#.......#",
              "#.###.#.###.###",
              "#...#...#...#F#",
              "#.###.#.#.###.#",
              "#.#...#.#...#.#",
              "#.###.#.###.#.#",
              "#...#.#.#.....#",
              "###############"
            ],
            [
              "###############",
              "#I#...........#",
              "#.#.#.#######.#",
              "#...#.......#.#",
              "###.#.#.#######",
              "#...#.#.......#",
              "#.#.###.###.###",
              "#.#...#.#...#.#",
              "#.#.#######.#.#",
              "#.#.#.........#",
              "#######.###.###",
              "#F....#.#.....#",
              "#####.#.#.#.#.#",
              "#.......#.#.#.#",
              "###.#.#.#.#.#.#",
              "#...#.#.#.#.#.#",
              "###############"
            ]
          ]
        }
      },
      {
        numero: 12,
        trilha: "grandes",
        titulo: "Planejar antes de andar",
        objetivo: "Olhe onde está a chegada e planeje o caminho.",
        dificuldade: "simples",
        configuracao: {
          mapas: [
            [
              "###############",
              "#I........#...#",
              "#.#.#.#.###.###",
              "#.#.#.#.......#",
              "#.#.#.###.###.#",
              "#.#.#.#...#...#",
              "#.###.###.#.#.#",
              "#...#.#...#.#.#",
              "###.#####.###.#",
              "#...#.#...#...#",
              "###.#.#.#.#.#.#",
              "#.#.#...#.#.#.#",
              "#.#####.###.###",
              "#...#.#.#.....#",
              "###.#.###.#.#.#",
              "#..F#.....#.#.#",
              "###.#.#.#####.#",
              "#.....#.#.....#",
              "###############"
            ],
            [
              "###############",
              "#I....#.......#",
              "#.#######.#.#.#",
              "#.........#.#.#",
              "#.###.#.###.#.#",
              "#...#.#.#...#.#",
              "#.#######.#####",
              "#.#...........#",
              "#.#.###.#.#####",
              "#.#...#.#.....#",
              "#.#.###.#.#####",
              "#.#...#.#.....#",
              "###.#.#.#.###.#",
              "#...#.#.#.#...#",
              "###.#.###.###.#",
              "#...#.#...#...#",
              "#.#.###.###.#.#",
              "#F#.#...#...#.#",
              "###############"
            ]
          ]
        }
      },
      {
        numero: 13,
        trilha: "grandes",
        titulo: "Voltas e mais voltas",
        objetivo: "Encontre a chegada no meio de muitas voltas.",
        dificuldade: "media",
        configuracao: {
          mapas: [
            [
              "###############",
              "#I..#.....#.#.#",
              "#.###.###.#.#.#",
              "#.......#.....#",
              "#.###.#.#####.#",
              "#.#...#.....#.#",
              "#.#.#######.###",
              "#.#.......#.#.#",
              "###.#########.#",
              "#.............#",
              "#.#.#.#.###.###",
              "#.#.#.#...#.#.#",
              "#.#.###.#####.#",
              "#.#...#.#.....#",
              "#.#######.#.#.#",
              "#.....#.#.#.#F#",
              "#.#####.#.#####",
              "#.............#",
              "#.#.#.#.#.#####",
              "#.#.#.#.#.....#",
              "###############"
            ],
            [
              "###############",
              "#I......#.#...#",
              "#.#.#####.#.###",
              "#.#.........#.#",
              "#.#.###.#.#.#.#",
              "#.#...#.#.#...#",
              "#.#.#######.#.#",
              "#.#...#.....#.#",
              "###.#####.###.#",
              "#...#.....#...#",
              "#####.###.###.#",
              "#.....#.....#.#",
              "###.###.###.###",
              "#...#.#...#...#",
              "###.#.###.#.###",
              "#.......#.#...#",
              "###.#######.###",
              "#.......#.....#",
              "#.#####.###.#.#",
              "#.....#..F#.#.#",
              "###############"
            ]
          ]
        }
      },
      {
        numero: 14,
        trilha: "grandes",
        titulo: "Labirinto alto",
        objetivo: "Suba e desça pelos corredores até a chegada.",
        dificuldade: "media",
        configuracao: {
          mapas: [
            [
              "###############",
              "#I............#",
              "#.#.###.#.#####",
              "#.#...#.#.....#",
              "#.#.#####.###.#",
              "#.#...#...#.#.#",
              "#.#.#####.#.#.#",
              "#.#...#...#...#",
              "#.#.#.#####.#.#",
              "#.#.#.#.....#.#",
              "#.#####.#.#.#.#",
              "#.#.....#.#.#.#",
              "#######.#.###.#",
              "#.......#.#...#",
              "###.#####.###.#",
              "#...#.....#.#.#",
              "#.#.###.###.#.#",
              "#.#.#.......#.#",
              "#.#.#####.#.#.#",
              "#.#.#.....#.#.#",
              "#.###.#.#.###.#",
              "#.#F..#.#...#.#",
              "###############"
            ],
            [
              "###############",
              "#I............#",
              "#.#.###.#.#.###",
              "#.#.#.#.#.#...#",
              "#.###.#.#.#####",
              "#...#...#.....#",
              "#.#.###.#.#.###",
              "#.#.#...#.#...#",
              "#.#.#.#.#.#.###",
              "#.#.#.#.#.#...#",
              "#.#.###.###.#.#",
              "#.#.#.....#.#.#",
              "#.#.#######.###",
              "#.#...#.......#",
              "#.#.#.###.###.#",
              "#.#.#...#.#...#",
              "###.#.###.###.#",
              "#...#.#...#...#",
              "#.#.#######.#.#",
              "#.#.#...#...#.#",
              "#######.###.###",
              "#F............#",
              "###############"
            ]
          ]
        }
      },
      {
        numero: 15,
        trilha: "grandes",
        titulo: "O maior labirinto",
        objetivo: "Atravesse o maior labirinto até a chegada.",
        dificuldade: "avancada",
        configuracao: {
          mapas: [
            [
              "###############",
              "#I....#.......#",
              "#.#.###.#######",
              "#.#...........#",
              "###.#.#.#.#.###",
              "#...#.#.#.#...#",
              "#.#.#.#.#.###.#",
              "#.#.#.#.#...#.#",
              "#.#######.#####",
              "#.#...........#",
              "#.###.#.#.#.#.#",
              "#.#...#.#.#.#.#",
              "###.###.#.#####",
              "#...#...#...#.#",
              "#.#.#.#####.#.#",
              "#.#.#.....#...#",
              "###.#.#.#######",
              "#...#.#...#...#",
              "###.#######.#.#",
              "#...........#.#",
              "#.#.#####.#.#.#",
              "#.#.#.....#.#F#",
              "###############"
            ],
            [
              "###############",
              "#I....#...#.#.#",
              "#.#####.###.#.#",
              "#.#.#...#...#.#",
              "#.#.#.#.###.#.#",
              "#.....#.......#",
              "#.#.#.#.#.#####",
              "#.#.#.#.#.#...#",
              "###.#####.#.###",
              "#.....#.......#",
              "#.#.#######.###",
              "#.#.....#.....#",
              "#.###.###.#####",
              "#.#...#.......#",
              "###.###.#.#####",
              "#.#.#...#.....#",
              "#.#####.#.#####",
              "#.......#.#...#",
              "#####.#.###.###",
              "#F#...#.......#",
              "#.###.#.#.###.#",
              "#.....#.#.#...#",
              "###############"
            ]
          ]
        }
      }
    ]
  }
];
