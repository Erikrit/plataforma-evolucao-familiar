/**
 * Expansão E5 — Pares de sombras, Ache o intruso, Palavra e figura e Entrega no jardim (IDs estáveis).
 * DEV-CAT-M1, ticket 09: 15 fases em três trilhas (pequenos 1–5, médios 6–10, grandes 11–15),
 * duas variantes por fase, aprovadas pela régua (npm run regua:jogos -w @pef/api -- --estrito).
 * Conteúdo gerado e congelado; revisão humana na homologação.
 */
/* Ticket 12 (2026-11-26): sequencia, pares-sombras, ache-intruso e palavra-figura ficam arquivados
 * (ativo: false): saem da Biblioteca e as conquistas continuam no Histórico. */
export const CATALOGO_JOGOS_EXPANSAO_E5 = [
  {
    id: "pares-sombras",
    nome: "Pares de sombras",
    descricao: "Associe cada objeto à sua silhueta.",
    categoria: "memoria_atencao",
    instrucoes: "Vire duas cartas de cada vez. Encontre a figura e a sombra que formam o mesmo par.",
    tipoMecanica: "memoria",
    versao: 2,
    faixaEtariaMin: 5,
    faixaEtariaMax: 8,
    ordemEditorial: 4,
    fases: [
      {
        numero: 1,
        trilha: "pequenos",
        titulo: "2 sombras",
        objetivo: "Encontre os 2 pares de figura e sombra.",
        dificuldade: "simples",
        configuracao: {
          conjuntos: [
            [
              {
                id: "helicoptero",
                faces: [
                  {
                    nome: "Helicóptero",
                    simbolo: "🚁",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🚁",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "joaninha",
                faces: [
                  {
                    nome: "Joaninha",
                    simbolo: "🐞",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🐞",
                    face: "sombra"
                  }
                ]
              }
            ],
            [
              {
                id: "trator",
                faces: [
                  {
                    nome: "Trator",
                    simbolo: "🚜",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🚜",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "joaninha",
                faces: [
                  {
                    nome: "Joaninha",
                    simbolo: "🐞",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🐞",
                    face: "sombra"
                  }
                ]
              }
            ]
          ]
        }
      },
      {
        numero: 2,
        trilha: "pequenos",
        titulo: "2 sombras",
        objetivo: "Encontre os 2 pares de figura e sombra. Algumas sombras se parecem.",
        dificuldade: "simples",
        configuracao: {
          conjuntos: [
            [
              {
                id: "tulipa",
                faces: [
                  {
                    nome: "Tulipa",
                    simbolo: "🌷",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🌷",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "vaso",
                faces: [
                  {
                    nome: "Vaso de planta",
                    simbolo: "🪴",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🪴",
                    face: "sombra"
                  }
                ]
              }
            ],
            [
              {
                id: "papel",
                faces: [
                  {
                    nome: "Papel",
                    simbolo: "📄",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "📄",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "giz",
                faces: [
                  {
                    nome: "Giz de cera",
                    simbolo: "🖍️",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🖍️",
                    face: "sombra"
                  }
                ]
              }
            ]
          ]
        }
      },
      {
        numero: 3,
        trilha: "pequenos",
        titulo: "3 sombras",
        objetivo: "Encontre os 3 pares de figura e sombra. Algumas sombras se parecem.",
        dificuldade: "media",
        configuracao: {
          conjuntos: [
            [
              {
                id: "barco",
                faces: [
                  {
                    nome: "Barco",
                    simbolo: "⛵",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "⛵",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "ursinho",
                faces: [
                  {
                    nome: "Ursinho",
                    simbolo: "🧸",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🧸",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "trem",
                faces: [
                  {
                    nome: "Trem",
                    simbolo: "🚂",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🚂",
                    face: "sombra"
                  }
                ]
              }
            ],
            [
              {
                id: "regua",
                faces: [
                  {
                    nome: "Régua",
                    simbolo: "📏",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "📏",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "giz",
                faces: [
                  {
                    nome: "Giz de cera",
                    simbolo: "🖍️",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🖍️",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "patinete",
                faces: [
                  {
                    nome: "Patinete",
                    simbolo: "🛴",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🛴",
                    face: "sombra"
                  }
                ]
              }
            ]
          ]
        }
      },
      {
        numero: 4,
        trilha: "pequenos",
        titulo: "3 sombras",
        objetivo: "Encontre os 3 pares de figura e sombra. Algumas sombras se parecem.",
        dificuldade: "media",
        configuracao: {
          conjuntos: [
            [
              {
                id: "trem",
                faces: [
                  {
                    nome: "Trem",
                    simbolo: "🚂",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🚂",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "carro",
                faces: [
                  {
                    nome: "Carro",
                    simbolo: "🚗",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🚗",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "bicicleta",
                faces: [
                  {
                    nome: "Bicicleta",
                    simbolo: "🚲",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🚲",
                    face: "sombra"
                  }
                ]
              }
            ],
            [
              {
                id: "estrela",
                faces: [
                  {
                    nome: "Estrela",
                    simbolo: "⭐",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "⭐",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "sol",
                faces: [
                  {
                    nome: "Sol",
                    simbolo: "☀️",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "☀️",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "arco-iris",
                faces: [
                  {
                    nome: "Arco-íris",
                    simbolo: "🌈",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🌈",
                    face: "sombra"
                  }
                ]
              }
            ]
          ]
        }
      },
      {
        numero: 5,
        trilha: "pequenos",
        titulo: "4 sombras",
        objetivo: "Encontre os 4 pares de figura e sombra. Algumas sombras se parecem.",
        dificuldade: "avancada",
        configuracao: {
          conjuntos: [
            [
              {
                id: "coco",
                faces: [
                  {
                    nome: "Coco",
                    simbolo: "🥥",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🥥",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "meia",
                faces: [
                  {
                    nome: "Meia",
                    simbolo: "🧦",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🧦",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "morango",
                faces: [
                  {
                    nome: "Morango",
                    simbolo: "🍓",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🍓",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "bone",
                faces: [
                  {
                    nome: "Boné",
                    simbolo: "🧢",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🧢",
                    face: "sombra"
                  }
                ]
              }
            ],
            [
              {
                id: "coco",
                faces: [
                  {
                    nome: "Coco",
                    simbolo: "🥥",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🥥",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "uva",
                faces: [
                  {
                    nome: "Uva",
                    simbolo: "🍇",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🍇",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "papel",
                faces: [
                  {
                    nome: "Papel",
                    simbolo: "📄",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "📄",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "melancia",
                faces: [
                  {
                    nome: "Melancia",
                    simbolo: "🍉",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🍉",
                    face: "sombra"
                  }
                ]
              }
            ]
          ]
        }
      },
      {
        numero: 6,
        trilha: "medios",
        titulo: "4 sombras",
        objetivo: "Encontre os 4 pares de figura e sombra. Algumas sombras se parecem.",
        dificuldade: "simples",
        configuracao: {
          conjuntos: [
            [
              {
                id: "balao",
                faces: [
                  {
                    nome: "Balão",
                    simbolo: "🎈",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🎈",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "ursinho",
                faces: [
                  {
                    nome: "Ursinho",
                    simbolo: "🧸",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🧸",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "dado",
                faces: [
                  {
                    nome: "Dado",
                    simbolo: "🎲",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🎲",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "pipa",
                faces: [
                  {
                    nome: "Pipa",
                    simbolo: "🪁",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🪁",
                    face: "sombra"
                  }
                ]
              }
            ],
            [
              {
                id: "cogumelo",
                faces: [
                  {
                    nome: "Cogumelo",
                    simbolo: "🍄",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🍄",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "cacto",
                faces: [
                  {
                    nome: "Cacto",
                    simbolo: "🌵",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🌵",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "broto",
                faces: [
                  {
                    nome: "Broto",
                    simbolo: "🌱",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🌱",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "tulipa",
                faces: [
                  {
                    nome: "Tulipa",
                    simbolo: "🌷",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🌷",
                    face: "sombra"
                  }
                ]
              }
            ]
          ]
        }
      },
      {
        numero: 7,
        trilha: "medios",
        titulo: "5 sombras",
        objetivo: "Encontre os 5 pares de figura e sombra. Algumas sombras se parecem.",
        dificuldade: "simples",
        configuracao: {
          conjuntos: [
            [
              {
                id: "folha",
                faces: [
                  {
                    nome: "Folha",
                    simbolo: "🍃",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🍃",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "cogumelo",
                faces: [
                  {
                    nome: "Cogumelo",
                    simbolo: "🍄",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🍄",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "lua",
                faces: [
                  {
                    nome: "Lua",
                    simbolo: "🌙",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🌙",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "girassol",
                faces: [
                  {
                    nome: "Girassol",
                    simbolo: "🌻",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🌻",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "estrela",
                faces: [
                  {
                    nome: "Estrela",
                    simbolo: "⭐",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "⭐",
                    face: "sombra"
                  }
                ]
              }
            ],
            [
              {
                id: "lapis",
                faces: [
                  {
                    nome: "Lápis",
                    simbolo: "✏️",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "✏️",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "giz",
                faces: [
                  {
                    nome: "Giz de cera",
                    simbolo: "🖍️",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🖍️",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "coco",
                faces: [
                  {
                    nome: "Coco",
                    simbolo: "🥥",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🥥",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "regua",
                faces: [
                  {
                    nome: "Régua",
                    simbolo: "📏",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "📏",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "pessego",
                faces: [
                  {
                    nome: "Pêssego",
                    simbolo: "🍑",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🍑",
                    face: "sombra"
                  }
                ]
              }
            ]
          ]
        }
      },
      {
        numero: 8,
        trilha: "medios",
        titulo: "5 sombras",
        objetivo: "Encontre os 5 pares de figura e sombra. Algumas sombras se parecem.",
        dificuldade: "media",
        configuracao: {
          conjuntos: [
            [
              {
                id: "laranja",
                faces: [
                  {
                    nome: "Laranja",
                    simbolo: "🍊",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🍊",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "cereja",
                faces: [
                  {
                    nome: "Cereja",
                    simbolo: "🍒",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🍒",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "melancia",
                faces: [
                  {
                    nome: "Melancia",
                    simbolo: "🍉",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🍉",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "pessego",
                faces: [
                  {
                    nome: "Pêssego",
                    simbolo: "🍑",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🍑",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "uva",
                faces: [
                  {
                    nome: "Uva",
                    simbolo: "🍇",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🍇",
                    face: "sombra"
                  }
                ]
              }
            ],
            [
              {
                id: "escova",
                faces: [
                  {
                    nome: "Escova de dentes",
                    simbolo: "🪥",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🪥",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "cadeira",
                faces: [
                  {
                    nome: "Cadeira",
                    simbolo: "🪑",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🪑",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "cama",
                faces: [
                  {
                    nome: "Cama",
                    simbolo: "🛏️",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🛏️",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "chave",
                faces: [
                  {
                    nome: "Chave",
                    simbolo: "🔑",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🔑",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "vela",
                faces: [
                  {
                    nome: "Vela",
                    simbolo: "🕯️",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🕯️",
                    face: "sombra"
                  }
                ]
              }
            ]
          ]
        }
      },
      {
        numero: 9,
        trilha: "medios",
        titulo: "6 sombras",
        objetivo: "Encontre os 6 pares de figura e sombra. Algumas sombras se parecem.",
        dificuldade: "media",
        configuracao: {
          conjuntos: [
            [
              {
                id: "vaso",
                faces: [
                  {
                    nome: "Vaso de planta",
                    simbolo: "🪴",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🪴",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "regua",
                faces: [
                  {
                    nome: "Régua",
                    simbolo: "📏",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "📏",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "giz",
                faces: [
                  {
                    nome: "Giz de cera",
                    simbolo: "🖍️",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🖍️",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "tulipa",
                faces: [
                  {
                    nome: "Tulipa",
                    simbolo: "🌷",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🌷",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "tesoura",
                faces: [
                  {
                    nome: "Tesoura",
                    simbolo: "✂️",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "✂️",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "papel",
                faces: [
                  {
                    nome: "Papel",
                    simbolo: "📄",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "📄",
                    face: "sombra"
                  }
                ]
              }
            ],
            [
              {
                id: "bola-basquete",
                faces: [
                  {
                    nome: "Bola de basquete",
                    simbolo: "🏀",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🏀",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "balao",
                faces: [
                  {
                    nome: "Balão",
                    simbolo: "🎈",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🎈",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "ursinho",
                faces: [
                  {
                    nome: "Ursinho",
                    simbolo: "🧸",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🧸",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "bola",
                faces: [
                  {
                    nome: "Bola",
                    simbolo: "⚽",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "⚽",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "camiseta",
                faces: [
                  {
                    nome: "Camiseta",
                    simbolo: "👕",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "👕",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "bone",
                faces: [
                  {
                    nome: "Boné",
                    simbolo: "🧢",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🧢",
                    face: "sombra"
                  }
                ]
              }
            ]
          ]
        }
      },
      {
        numero: 10,
        trilha: "medios",
        titulo: "6 sombras",
        objetivo: "Encontre os 6 pares de figura e sombra. Algumas sombras se parecem.",
        dificuldade: "avancada",
        configuracao: {
          conjuntos: [
            [
              {
                id: "milho",
                faces: [
                  {
                    nome: "Milho",
                    simbolo: "🌽",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🌽",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "biscoito",
                faces: [
                  {
                    nome: "Biscoito",
                    simbolo: "🍪",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🍪",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "queijo",
                faces: [
                  {
                    nome: "Queijo",
                    simbolo: "🧀",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🧀",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "batata",
                faces: [
                  {
                    nome: "Batata",
                    simbolo: "🥔",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🥔",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "ovo",
                faces: [
                  {
                    nome: "Ovo",
                    simbolo: "🥚",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🥚",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "brocolis",
                faces: [
                  {
                    nome: "Brócolis",
                    simbolo: "🥦",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🥦",
                    face: "sombra"
                  }
                ]
              }
            ],
            [
              {
                id: "nuvem",
                faces: [
                  {
                    nome: "Nuvem",
                    simbolo: "☁️",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "☁️",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "floco",
                faces: [
                  {
                    nome: "Floco de neve",
                    simbolo: "❄️",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "❄️",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "lua",
                faces: [
                  {
                    nome: "Lua",
                    simbolo: "🌙",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🌙",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "sol",
                faces: [
                  {
                    nome: "Sol",
                    simbolo: "☀️",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "☀️",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "cometa",
                faces: [
                  {
                    nome: "Cometa",
                    simbolo: "☄️",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "☄️",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "estrela",
                faces: [
                  {
                    nome: "Estrela",
                    simbolo: "⭐",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "⭐",
                    face: "sombra"
                  }
                ]
              }
            ]
          ]
        }
      },
      {
        numero: 11,
        trilha: "grandes",
        titulo: "7 sombras",
        objetivo: "Encontre os 7 pares de figura e sombra. Algumas sombras se parecem.",
        dificuldade: "simples",
        configuracao: {
          conjuntos: [
            [
              {
                id: "bola-basquete",
                faces: [
                  {
                    nome: "Bola de basquete",
                    simbolo: "🏀",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🏀",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "bone",
                faces: [
                  {
                    nome: "Boné",
                    simbolo: "🧢",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🧢",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "ursinho",
                faces: [
                  {
                    nome: "Ursinho",
                    simbolo: "🧸",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🧸",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "bola",
                faces: [
                  {
                    nome: "Bola",
                    simbolo: "⚽",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "⚽",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "mochila",
                faces: [
                  {
                    nome: "Mochila",
                    simbolo: "🎒",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🎒",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "meia",
                faces: [
                  {
                    nome: "Meia",
                    simbolo: "🧦",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🧦",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "balao",
                faces: [
                  {
                    nome: "Balão",
                    simbolo: "🎈",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🎈",
                    face: "sombra"
                  }
                ]
              }
            ],
            [
              {
                id: "patinete",
                faces: [
                  {
                    nome: "Patinete",
                    simbolo: "🛴",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🛴",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "trem",
                faces: [
                  {
                    nome: "Trem",
                    simbolo: "🚂",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🚂",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "aviao",
                faces: [
                  {
                    nome: "Avião",
                    simbolo: "✈️",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "✈️",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "carro",
                faces: [
                  {
                    nome: "Carro",
                    simbolo: "🚗",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🚗",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "coelho",
                faces: [
                  {
                    nome: "Coelho",
                    simbolo: "🐇",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🐇",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "gato",
                faces: [
                  {
                    nome: "Gato",
                    simbolo: "🐈",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🐈",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "foguete",
                faces: [
                  {
                    nome: "Foguete",
                    simbolo: "🚀",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🚀",
                    face: "sombra"
                  }
                ]
              }
            ]
          ]
        }
      },
      {
        numero: 12,
        trilha: "grandes",
        titulo: "7 sombras",
        objetivo: "Encontre os 7 pares de figura e sombra. Algumas sombras se parecem.",
        dificuldade: "simples",
        configuracao: {
          conjuntos: [
            [
              {
                id: "lua",
                faces: [
                  {
                    nome: "Lua",
                    simbolo: "🌙",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🌙",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "chuva",
                faces: [
                  {
                    nome: "Chuva",
                    simbolo: "🌧️",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🌧️",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "sol",
                faces: [
                  {
                    nome: "Sol",
                    simbolo: "☀️",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "☀️",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "estrela",
                faces: [
                  {
                    nome: "Estrela",
                    simbolo: "⭐",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "⭐",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "floco",
                faces: [
                  {
                    nome: "Floco de neve",
                    simbolo: "❄️",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "❄️",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "raio",
                faces: [
                  {
                    nome: "Raio",
                    simbolo: "⚡",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "⚡",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "cometa",
                faces: [
                  {
                    nome: "Cometa",
                    simbolo: "☄️",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "☄️",
                    face: "sombra"
                  }
                ]
              }
            ],
            [
              {
                id: "escova",
                faces: [
                  {
                    nome: "Escova de dentes",
                    simbolo: "🪥",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🪥",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "sabonete",
                faces: [
                  {
                    nome: "Sabonete",
                    simbolo: "🧼",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🧼",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "chave",
                faces: [
                  {
                    nome: "Chave",
                    simbolo: "🔑",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🔑",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "cama",
                faces: [
                  {
                    nome: "Cama",
                    simbolo: "🛏️",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🛏️",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "despertador",
                faces: [
                  {
                    nome: "Despertador",
                    simbolo: "⏰",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "⏰",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "vela",
                faces: [
                  {
                    nome: "Vela",
                    simbolo: "🕯️",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🕯️",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "casa",
                faces: [
                  {
                    nome: "Casa",
                    simbolo: "🏠",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🏠",
                    face: "sombra"
                  }
                ]
              }
            ]
          ]
        }
      },
      {
        numero: 13,
        trilha: "grandes",
        titulo: "8 sombras",
        objetivo: "Encontre os 8 pares de figura e sombra. Algumas sombras se parecem.",
        dificuldade: "media",
        configuracao: {
          conjuntos: [
            [
              {
                id: "bolo",
                faces: [
                  {
                    nome: "Bolo",
                    simbolo: "🎂",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🎂",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "brocolis",
                faces: [
                  {
                    nome: "Brócolis",
                    simbolo: "🥦",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🥦",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "mochila",
                faces: [
                  {
                    nome: "Mochila",
                    simbolo: "🎒",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🎒",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "milho",
                faces: [
                  {
                    nome: "Milho",
                    simbolo: "🌽",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🌽",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "biscoito",
                faces: [
                  {
                    nome: "Biscoito",
                    simbolo: "🍪",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🍪",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "camiseta",
                faces: [
                  {
                    nome: "Camiseta",
                    simbolo: "👕",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "👕",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "tenis",
                faces: [
                  {
                    nome: "Tênis",
                    simbolo: "👟",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "👟",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "ovo",
                faces: [
                  {
                    nome: "Ovo",
                    simbolo: "🥚",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🥚",
                    face: "sombra"
                  }
                ]
              }
            ],
            [
              {
                id: "livro",
                faces: [
                  {
                    nome: "Livro",
                    simbolo: "📘",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "📘",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "lua",
                faces: [
                  {
                    nome: "Lua",
                    simbolo: "🌙",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🌙",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "arco-iris",
                faces: [
                  {
                    nome: "Arco-íris",
                    simbolo: "🌈",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🌈",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "sabonete",
                faces: [
                  {
                    nome: "Sabonete",
                    simbolo: "🧼",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🧼",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "vela",
                faces: [
                  {
                    nome: "Vela",
                    simbolo: "🕯️",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🕯️",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "cadeira",
                faces: [
                  {
                    nome: "Cadeira",
                    simbolo: "🪑",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🪑",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "xicara",
                faces: [
                  {
                    nome: "Xícara",
                    simbolo: "☕",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "☕",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "escova",
                faces: [
                  {
                    nome: "Escova de dentes",
                    simbolo: "🪥",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🪥",
                    face: "sombra"
                  }
                ]
              }
            ]
          ]
        }
      },
      {
        numero: 14,
        trilha: "grandes",
        titulo: "8 sombras",
        objetivo: "Encontre os 8 pares de figura e sombra. Algumas sombras se parecem.",
        dificuldade: "media",
        configuracao: {
          conjuntos: [
            [
              {
                id: "cenoura",
                faces: [
                  {
                    nome: "Cenoura",
                    simbolo: "🥕",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🥕",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "ovo",
                faces: [
                  {
                    nome: "Ovo",
                    simbolo: "🥚",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🥚",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "biscoito",
                faces: [
                  {
                    nome: "Biscoito",
                    simbolo: "🍪",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🍪",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "batata",
                faces: [
                  {
                    nome: "Batata",
                    simbolo: "🥔",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🥔",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "bolo",
                faces: [
                  {
                    nome: "Bolo",
                    simbolo: "🎂",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🎂",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "sanduiche",
                faces: [
                  {
                    nome: "Sanduíche",
                    simbolo: "🥪",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🥪",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "brocolis",
                faces: [
                  {
                    nome: "Brócolis",
                    simbolo: "🥦",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🥦",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "pao",
                faces: [
                  {
                    nome: "Pão",
                    simbolo: "🍞",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🍞",
                    face: "sombra"
                  }
                ]
              }
            ],
            [
              {
                id: "sabonete",
                faces: [
                  {
                    nome: "Sabonete",
                    simbolo: "🧼",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🧼",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "cama",
                faces: [
                  {
                    nome: "Cama",
                    simbolo: "🛏️",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🛏️",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "despertador",
                faces: [
                  {
                    nome: "Despertador",
                    simbolo: "⏰",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "⏰",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "xicara",
                faces: [
                  {
                    nome: "Xícara",
                    simbolo: "☕",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "☕",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "cadeira",
                faces: [
                  {
                    nome: "Cadeira",
                    simbolo: "🪑",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🪑",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "vela",
                faces: [
                  {
                    nome: "Vela",
                    simbolo: "🕯️",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🕯️",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "escova",
                faces: [
                  {
                    nome: "Escova de dentes",
                    simbolo: "🪥",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🪥",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "chave",
                faces: [
                  {
                    nome: "Chave",
                    simbolo: "🔑",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🔑",
                    face: "sombra"
                  }
                ]
              }
            ]
          ]
        }
      },
      {
        numero: 15,
        trilha: "grandes",
        titulo: "9 sombras",
        objetivo: "Encontre os 9 pares de figura e sombra. Algumas sombras se parecem.",
        dificuldade: "avancada",
        configuracao: {
          conjuntos: [
            [
              {
                id: "pipa",
                faces: [
                  {
                    nome: "Pipa",
                    simbolo: "🪁",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🪁",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "ursinho",
                faces: [
                  {
                    nome: "Ursinho",
                    simbolo: "🧸",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🧸",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "trator",
                faces: [
                  {
                    nome: "Trator",
                    simbolo: "🚜",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🚜",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "balao",
                faces: [
                  {
                    nome: "Balão",
                    simbolo: "🎈",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🎈",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "aviao",
                faces: [
                  {
                    nome: "Avião",
                    simbolo: "✈️",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "✈️",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "moto",
                faces: [
                  {
                    nome: "Moto",
                    simbolo: "🛵",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🛵",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "helicoptero",
                faces: [
                  {
                    nome: "Helicóptero",
                    simbolo: "🚁",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🚁",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "bola-basquete",
                faces: [
                  {
                    nome: "Bola de basquete",
                    simbolo: "🏀",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🏀",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "bicicleta",
                faces: [
                  {
                    nome: "Bicicleta",
                    simbolo: "🚲",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🚲",
                    face: "sombra"
                  }
                ]
              }
            ],
            [
              {
                id: "brocolis",
                faces: [
                  {
                    nome: "Brócolis",
                    simbolo: "🥦",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🥦",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "broto",
                faces: [
                  {
                    nome: "Broto",
                    simbolo: "🌱",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🌱",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "pao",
                faces: [
                  {
                    nome: "Pão",
                    simbolo: "🍞",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🍞",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "ovo",
                faces: [
                  {
                    nome: "Ovo",
                    simbolo: "🥚",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🥚",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "milho",
                faces: [
                  {
                    nome: "Milho",
                    simbolo: "🌽",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🌽",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "cogumelo",
                faces: [
                  {
                    nome: "Cogumelo",
                    simbolo: "🍄",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🍄",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "batata",
                faces: [
                  {
                    nome: "Batata",
                    simbolo: "🥔",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🥔",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "biscoito",
                faces: [
                  {
                    nome: "Biscoito",
                    simbolo: "🍪",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🍪",
                    face: "sombra"
                  }
                ]
              },
              {
                id: "cenoura",
                faces: [
                  {
                    nome: "Cenoura",
                    simbolo: "🥕",
                    face: "objeto"
                  },
                  {
                    nome: "Sombra",
                    simbolo: "🥕",
                    face: "sombra"
                  }
                ]
              }
            ]
          ]
        }
      }
    ],
    ativo: false
  },
  {
    id: "ache-intruso",
    nome: "Ache o intruso",
    descricao: "Observe o grupo e descubra qual figura destoa.",
    categoria: "memoria_atencao",
    instrucoes: "Olhe todas as figuras. Toque naquela que não combina com o restante do grupo.",
    tipoMecanica: "escolha",
    versao: 2,
    faixaEtariaMin: 5,
    faixaEtariaMax: 8,
    ordemEditorial: 5,
    fases: [
      {
        numero: 1,
        trilha: "pequenos",
        titulo: "3 figuras",
        objetivo: "Ache a figura que não combina com as outras 2.",
        dificuldade: "simples",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Qual não é um animal?",
              opcoes: [
                {
                  id: "gato",
                  nome: "Gato",
                  simbolo: "🐈"
                },
                {
                  id: "vela",
                  nome: "Vela",
                  simbolo: "🕯️"
                },
                {
                  id: "tartaruga",
                  nome: "Tartaruga",
                  simbolo: "🐢"
                }
              ],
              resposta: "vela",
              dica: "Quase todas as figuras são do mesmo tipo. Procure a que é diferente."
            },
            {
              enunciado: "Qual não é um animal?",
              opcoes: [
                {
                  id: "girafa",
                  nome: "Girafa",
                  simbolo: "🦒"
                },
                {
                  id: "galinha",
                  nome: "Galinha",
                  simbolo: "🐔"
                },
                {
                  id: "cama",
                  nome: "Cama",
                  simbolo: "🛏️"
                }
              ],
              resposta: "cama",
              dica: "Quase todas as figuras são do mesmo tipo. Procure a que é diferente."
            }
          ]
        }
      },
      {
        numero: 2,
        trilha: "pequenos",
        titulo: "3 figuras parecidas",
        objetivo: "Ache a figura que não combina com as outras 2.",
        dificuldade: "simples",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Qual não é um animal?",
              opcoes: [
                {
                  id: "tartaruga",
                  nome: "Tartaruga",
                  simbolo: "🐢"
                },
                {
                  id: "vaca",
                  nome: "Vaca",
                  simbolo: "🐄"
                },
                {
                  id: "tulipa",
                  nome: "Tulipa",
                  simbolo: "🌷"
                }
              ],
              resposta: "tulipa",
              dica: "Quase todas as figuras são do mesmo tipo. Procure a que é diferente."
            },
            {
              enunciado: "Qual não é uma fruta?",
              opcoes: [
                {
                  id: "abacaxi",
                  nome: "Abacaxi",
                  simbolo: "🍍"
                },
                {
                  id: "sanduiche",
                  nome: "Sanduíche",
                  simbolo: "🥪"
                },
                {
                  id: "manga",
                  nome: "Manga",
                  simbolo: "🥭"
                }
              ],
              resposta: "sanduiche",
              dica: "Quase todas as figuras são do mesmo tipo. Procure a que é diferente."
            }
          ]
        }
      },
      {
        numero: 3,
        trilha: "pequenos",
        titulo: "4 figuras",
        objetivo: "Ache a figura que não combina com as outras 3.",
        dificuldade: "media",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Qual não está no céu?",
              opcoes: [
                {
                  id: "meia",
                  nome: "Meia",
                  simbolo: "🧦"
                },
                {
                  id: "arco-iris",
                  nome: "Arco-íris",
                  simbolo: "🌈"
                },
                {
                  id: "nuvem",
                  nome: "Nuvem",
                  simbolo: "☁️"
                },
                {
                  id: "sol",
                  nome: "Sol",
                  simbolo: "☀️"
                }
              ],
              resposta: "meia",
              dica: "Quase todas as figuras são do mesmo tipo. Procure a que é diferente."
            },
            {
              enunciado: "Qual não é uma fruta?",
              opcoes: [
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
                  id: "pera",
                  nome: "Pera",
                  simbolo: "🍐"
                },
                {
                  id: "melancia",
                  nome: "Melancia",
                  simbolo: "🍉"
                }
              ],
              resposta: "tenis",
              dica: "Quase todas as figuras são do mesmo tipo. Procure a que é diferente."
            }
          ]
        }
      },
      {
        numero: 4,
        trilha: "pequenos",
        titulo: "4 figuras parecidas",
        objetivo: "Ache a figura que não combina com as outras 3.",
        dificuldade: "media",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Qual não é um animal?",
              opcoes: [
                {
                  id: "joaninha",
                  nome: "Joaninha",
                  simbolo: "🐞"
                },
                {
                  id: "baleia",
                  nome: "Baleia",
                  simbolo: "🐳"
                },
                {
                  id: "cacto",
                  nome: "Cacto",
                  simbolo: "🌵"
                },
                {
                  id: "girafa",
                  nome: "Girafa",
                  simbolo: "🦒"
                }
              ],
              resposta: "cacto",
              dica: "Quase todas as figuras são do mesmo tipo. Procure a que é diferente."
            },
            {
              enunciado: "Qual não é uma fruta?",
              opcoes: [
                {
                  id: "bolo",
                  nome: "Bolo",
                  simbolo: "🎂"
                },
                {
                  id: "banana",
                  nome: "Banana",
                  simbolo: "🍌"
                },
                {
                  id: "maca",
                  nome: "Maçã",
                  simbolo: "🍎"
                },
                {
                  id: "laranja",
                  nome: "Laranja",
                  simbolo: "🍊"
                }
              ],
              resposta: "bolo",
              dica: "Quase todas as figuras são do mesmo tipo. Procure a que é diferente."
            }
          ]
        }
      },
      {
        numero: 5,
        trilha: "pequenos",
        titulo: "5 figuras",
        objetivo: "Ache a figura que não combina com as outras 4.",
        dificuldade: "avancada",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Qual não está no céu?",
              opcoes: [
                {
                  id: "estrela",
                  nome: "Estrela",
                  simbolo: "⭐"
                },
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
                  id: "nuvem",
                  nome: "Nuvem",
                  simbolo: "☁️"
                },
                {
                  id: "tesoura",
                  nome: "Tesoura",
                  simbolo: "✂️"
                }
              ],
              resposta: "tesoura",
              dica: "Quase todas as figuras são do mesmo tipo. Procure a que é diferente."
            },
            {
              enunciado: "Qual não é um meio de transporte?",
              opcoes: [
                {
                  id: "aviao",
                  nome: "Avião",
                  simbolo: "✈️"
                },
                {
                  id: "pessego",
                  nome: "Pêssego",
                  simbolo: "🍑"
                },
                {
                  id: "barco",
                  nome: "Barco",
                  simbolo: "⛵"
                },
                {
                  id: "carro",
                  nome: "Carro",
                  simbolo: "🚗"
                },
                {
                  id: "helicoptero",
                  nome: "Helicóptero",
                  simbolo: "🚁"
                }
              ],
              resposta: "pessego",
              dica: "Quase todas as figuras são do mesmo tipo. Procure a que é diferente."
            }
          ]
        }
      },
      {
        numero: 6,
        trilha: "medios",
        titulo: "5 figuras parecidas",
        objetivo: "Ache a figura que não combina com as outras 4.",
        dificuldade: "simples",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Qual não é um animal?",
              opcoes: [
                {
                  id: "vaca",
                  nome: "Vaca",
                  simbolo: "🐄"
                },
                {
                  id: "porco",
                  nome: "Porco",
                  simbolo: "🐖"
                },
                {
                  id: "tulipa",
                  nome: "Tulipa",
                  simbolo: "🌷"
                },
                {
                  id: "coelho",
                  nome: "Coelho",
                  simbolo: "🐇"
                },
                {
                  id: "caracol",
                  nome: "Caracol",
                  simbolo: "🐌"
                }
              ],
              resposta: "tulipa",
              dica: "Quase todas as figuras são do mesmo tipo. Procure a que é diferente."
            },
            {
              enunciado: "Qual não é uma fruta?",
              opcoes: [
                {
                  id: "laranja",
                  nome: "Laranja",
                  simbolo: "🍊"
                },
                {
                  id: "cereja",
                  nome: "Cereja",
                  simbolo: "🍒"
                },
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
                  id: "sanduiche",
                  nome: "Sanduíche",
                  simbolo: "🥪"
                }
              ],
              resposta: "sanduiche",
              dica: "Quase todas as figuras são do mesmo tipo. Procure a que é diferente."
            }
          ]
        }
      },
      {
        numero: 7,
        trilha: "medios",
        titulo: "6 figuras",
        objetivo: "Ache a figura que não combina com as outras 5.",
        dificuldade: "simples",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Qual não é um meio de transporte?",
              opcoes: [
                {
                  id: "abacaxi",
                  nome: "Abacaxi",
                  simbolo: "🍍"
                },
                {
                  id: "aviao",
                  nome: "Avião",
                  simbolo: "✈️"
                },
                {
                  id: "trator",
                  nome: "Trator",
                  simbolo: "🚜"
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
                },
                {
                  id: "helicoptero",
                  nome: "Helicóptero",
                  simbolo: "🚁"
                }
              ],
              resposta: "abacaxi",
              dica: "Quase todas as figuras são do mesmo tipo. Procure a que é diferente."
            },
            {
              enunciado: "Qual não é um meio de transporte?",
              opcoes: [
                {
                  id: "trator",
                  nome: "Trator",
                  simbolo: "🚜"
                },
                {
                  id: "helicoptero",
                  nome: "Helicóptero",
                  simbolo: "🚁"
                },
                {
                  id: "barco",
                  nome: "Barco",
                  simbolo: "⛵"
                },
                {
                  id: "laranja",
                  nome: "Laranja",
                  simbolo: "🍊"
                },
                {
                  id: "onibus",
                  nome: "Ônibus",
                  simbolo: "🚌"
                },
                {
                  id: "bicicleta",
                  nome: "Bicicleta",
                  simbolo: "🚲"
                }
              ],
              resposta: "laranja",
              dica: "Quase todas as figuras são do mesmo tipo. Procure a que é diferente."
            }
          ]
        }
      },
      {
        numero: 8,
        trilha: "medios",
        titulo: "6 figuras parecidas",
        objetivo: "Ache a figura que não combina com as outras 5.",
        dificuldade: "media",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Qual não é uma fruta?",
              opcoes: [
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
                  id: "pera",
                  nome: "Pera",
                  simbolo: "🍐"
                },
                {
                  id: "pessego",
                  nome: "Pêssego",
                  simbolo: "🍑"
                },
                {
                  id: "cereja",
                  nome: "Cereja",
                  simbolo: "🍒"
                },
                {
                  id: "batata",
                  nome: "Batata",
                  simbolo: "🥔"
                }
              ],
              resposta: "batata",
              dica: "Quase todas as figuras são do mesmo tipo. Procure a que é diferente."
            },
            {
              enunciado: "Qual não é uma fruta?",
              opcoes: [
                {
                  id: "melancia",
                  nome: "Melancia",
                  simbolo: "🍉"
                },
                {
                  id: "pao",
                  nome: "Pão",
                  simbolo: "🍞"
                },
                {
                  id: "uva",
                  nome: "Uva",
                  simbolo: "🍇"
                },
                {
                  id: "banana",
                  nome: "Banana",
                  simbolo: "🍌"
                },
                {
                  id: "manga",
                  nome: "Manga",
                  simbolo: "🥭"
                },
                {
                  id: "limao",
                  nome: "Limão",
                  simbolo: "🍋"
                }
              ],
              resposta: "pao",
              dica: "Quase todas as figuras são do mesmo tipo. Procure a que é diferente."
            }
          ]
        }
      },
      {
        numero: 9,
        trilha: "medios",
        titulo: "7 figuras",
        objetivo: "Ache a figura que não combina com as outras 6.",
        dificuldade: "media",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Qual não é um animal?",
              opcoes: [
                {
                  id: "caranguejo",
                  nome: "Caranguejo",
                  simbolo: "🦀"
                },
                {
                  id: "tartaruga",
                  nome: "Tartaruga",
                  simbolo: "🐢"
                },
                {
                  id: "gato",
                  nome: "Gato",
                  simbolo: "🐈"
                },
                {
                  id: "joaninha",
                  nome: "Joaninha",
                  simbolo: "🐞"
                },
                {
                  id: "sapo",
                  nome: "Sapo",
                  simbolo: "🐸"
                },
                {
                  id: "elefante",
                  nome: "Elefante",
                  simbolo: "🐘"
                },
                {
                  id: "helicoptero",
                  nome: "Helicóptero",
                  simbolo: "🚁"
                }
              ],
              resposta: "helicoptero",
              dica: "Quase todas as figuras são do mesmo tipo. Procure a que é diferente."
            },
            {
              enunciado: "Qual não está no céu?",
              opcoes: [
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
                  id: "nuvem",
                  nome: "Nuvem",
                  simbolo: "☁️"
                },
                {
                  id: "cometa",
                  nome: "Cometa",
                  simbolo: "☄️"
                },
                {
                  id: "raio",
                  nome: "Raio",
                  simbolo: "⚡"
                },
                {
                  id: "lua",
                  nome: "Lua",
                  simbolo: "🌙"
                },
                {
                  id: "bolo",
                  nome: "Bolo",
                  simbolo: "🎂"
                }
              ],
              resposta: "bolo",
              dica: "Quase todas as figuras são do mesmo tipo. Procure a que é diferente."
            }
          ]
        }
      },
      {
        numero: 10,
        trilha: "medios",
        titulo: "7 figuras parecidas",
        objetivo: "Ache a figura que não combina com as outras 6.",
        dificuldade: "avancada",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Qual não é um animal?",
              opcoes: [
                {
                  id: "abelha",
                  nome: "Abelha",
                  simbolo: "🐝"
                },
                {
                  id: "caracol",
                  nome: "Caracol",
                  simbolo: "🐌"
                },
                {
                  id: "cavalo",
                  nome: "Cavalo",
                  simbolo: "🐴"
                },
                {
                  id: "cachorro",
                  nome: "Cachorro",
                  simbolo: "🐶"
                },
                {
                  id: "leao",
                  nome: "Leão",
                  simbolo: "🦁"
                },
                {
                  id: "girassol",
                  nome: "Girassol",
                  simbolo: "🌻"
                },
                {
                  id: "borboleta",
                  nome: "Borboleta",
                  simbolo: "🦋"
                }
              ],
              resposta: "girassol",
              dica: "Quase todas as figuras são do mesmo tipo. Procure a que é diferente."
            },
            {
              enunciado: "Qual não é um animal?",
              opcoes: [
                {
                  id: "vaca",
                  nome: "Vaca",
                  simbolo: "🐄"
                },
                {
                  id: "girafa",
                  nome: "Girafa",
                  simbolo: "🦒"
                },
                {
                  id: "ovelha",
                  nome: "Ovelha",
                  simbolo: "🐑"
                },
                {
                  id: "caracol",
                  nome: "Caracol",
                  simbolo: "🐌"
                },
                {
                  id: "borboleta",
                  nome: "Borboleta",
                  simbolo: "🦋"
                },
                {
                  id: "passaro",
                  nome: "Pássaro",
                  simbolo: "🐦"
                },
                {
                  id: "vaso",
                  nome: "Vaso de planta",
                  simbolo: "🪴"
                }
              ],
              resposta: "vaso",
              dica: "Quase todas as figuras são do mesmo tipo. Procure a que é diferente."
            }
          ]
        }
      },
      {
        numero: 11,
        trilha: "grandes",
        titulo: "8 figuras",
        objetivo: "Ache a figura que não combina com as outras 7.",
        dificuldade: "simples",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Qual não está no céu?",
              opcoes: [
                {
                  id: "meia",
                  nome: "Meia",
                  simbolo: "🧦"
                },
                {
                  id: "nuvem",
                  nome: "Nuvem",
                  simbolo: "☁️"
                },
                {
                  id: "arco-iris",
                  nome: "Arco-íris",
                  simbolo: "🌈"
                },
                {
                  id: "floco",
                  nome: "Floco de neve",
                  simbolo: "❄️"
                },
                {
                  id: "chuva",
                  nome: "Chuva",
                  simbolo: "🌧️"
                },
                {
                  id: "sol",
                  nome: "Sol",
                  simbolo: "☀️"
                },
                {
                  id: "cometa",
                  nome: "Cometa",
                  simbolo: "☄️"
                },
                {
                  id: "lua",
                  nome: "Lua",
                  simbolo: "🌙"
                }
              ],
              resposta: "meia",
              dica: "Quase todas as figuras são do mesmo tipo. Procure a que é diferente."
            },
            {
              enunciado: "Qual não é uma fruta?",
              opcoes: [
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
                  id: "manga",
                  nome: "Manga",
                  simbolo: "🥭"
                },
                {
                  id: "tesoura",
                  nome: "Tesoura",
                  simbolo: "✂️"
                },
                {
                  id: "pera",
                  nome: "Pera",
                  simbolo: "🍐"
                },
                {
                  id: "melancia",
                  nome: "Melancia",
                  simbolo: "🍉"
                },
                {
                  id: "maca",
                  nome: "Maçã",
                  simbolo: "🍎"
                },
                {
                  id: "limao",
                  nome: "Limão",
                  simbolo: "🍋"
                }
              ],
              resposta: "tesoura",
              dica: "Quase todas as figuras são do mesmo tipo. Procure a que é diferente."
            }
          ]
        }
      },
      {
        numero: 12,
        trilha: "grandes",
        titulo: "8 figuras parecidas",
        objetivo: "Ache a figura que não combina com as outras 7.",
        dificuldade: "simples",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Qual não é uma fruta?",
              opcoes: [
                {
                  id: "pessego",
                  nome: "Pêssego",
                  simbolo: "🍑"
                },
                {
                  id: "limao",
                  nome: "Limão",
                  simbolo: "🍋"
                },
                {
                  id: "milho",
                  nome: "Milho",
                  simbolo: "🌽"
                },
                {
                  id: "laranja",
                  nome: "Laranja",
                  simbolo: "🍊"
                },
                {
                  id: "manga",
                  nome: "Manga",
                  simbolo: "🥭"
                },
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
                  id: "melancia",
                  nome: "Melancia",
                  simbolo: "🍉"
                }
              ],
              resposta: "milho",
              dica: "Quase todas as figuras são do mesmo tipo. Procure a que é diferente."
            },
            {
              enunciado: "Qual não é uma fruta?",
              opcoes: [
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
                  id: "maca",
                  nome: "Maçã",
                  simbolo: "🍎"
                },
                {
                  id: "laranja",
                  nome: "Laranja",
                  simbolo: "🍊"
                }
              ],
              resposta: "biscoito",
              dica: "Quase todas as figuras são do mesmo tipo. Procure a que é diferente."
            }
          ]
        }
      },
      {
        numero: 13,
        trilha: "grandes",
        titulo: "9 figuras",
        objetivo: "Ache a figura que não combina com as outras 8.",
        dificuldade: "media",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Qual não é uma fruta?",
              opcoes: [
                {
                  id: "limao",
                  nome: "Limão",
                  simbolo: "🍋"
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
                  id: "morango",
                  nome: "Morango",
                  simbolo: "🍓"
                },
                {
                  id: "bicicleta",
                  nome: "Bicicleta",
                  simbolo: "🚲"
                },
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
                  id: "melancia",
                  nome: "Melancia",
                  simbolo: "🍉"
                },
                {
                  id: "coco",
                  nome: "Coco",
                  simbolo: "🥥"
                }
              ],
              resposta: "bicicleta",
              dica: "Quase todas as figuras são do mesmo tipo. Procure a que é diferente."
            },
            {
              enunciado: "Qual não é um animal?",
              opcoes: [
                {
                  id: "abelha",
                  nome: "Abelha",
                  simbolo: "🐝"
                },
                {
                  id: "pato",
                  nome: "Pato",
                  simbolo: "🦆"
                },
                {
                  id: "coelho",
                  nome: "Coelho",
                  simbolo: "🐇"
                },
                {
                  id: "cama",
                  nome: "Cama",
                  simbolo: "🛏️"
                },
                {
                  id: "borboleta",
                  nome: "Borboleta",
                  simbolo: "🦋"
                },
                {
                  id: "cavalo",
                  nome: "Cavalo",
                  simbolo: "🐴"
                },
                {
                  id: "macaco",
                  nome: "Macaco",
                  simbolo: "🐒"
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
              resposta: "cama",
              dica: "Quase todas as figuras são do mesmo tipo. Procure a que é diferente."
            }
          ]
        }
      },
      {
        numero: 14,
        trilha: "grandes",
        titulo: "9 figuras parecidas",
        objetivo: "Ache a figura que não combina com as outras 8.",
        dificuldade: "media",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Qual não é um animal?",
              opcoes: [
                {
                  id: "pinguim",
                  nome: "Pinguim",
                  simbolo: "🐧"
                },
                {
                  id: "leao",
                  nome: "Leão",
                  simbolo: "🦁"
                },
                {
                  id: "cavalo",
                  nome: "Cavalo",
                  simbolo: "🐴"
                },
                {
                  id: "ovelha",
                  nome: "Ovelha",
                  simbolo: "🐑"
                },
                {
                  id: "cachorro",
                  nome: "Cachorro",
                  simbolo: "🐶"
                },
                {
                  id: "tartaruga",
                  nome: "Tartaruga",
                  simbolo: "🐢"
                },
                {
                  id: "tulipa",
                  nome: "Tulipa",
                  simbolo: "🌷"
                },
                {
                  id: "passaro",
                  nome: "Pássaro",
                  simbolo: "🐦"
                },
                {
                  id: "joaninha",
                  nome: "Joaninha",
                  simbolo: "🐞"
                }
              ],
              resposta: "tulipa",
              dica: "Quase todas as figuras são do mesmo tipo. Procure a que é diferente."
            },
            {
              enunciado: "Qual não é uma fruta?",
              opcoes: [
                {
                  id: "manga",
                  nome: "Manga",
                  simbolo: "🥭"
                },
                {
                  id: "kiwi",
                  nome: "Kiwi",
                  simbolo: "🥝"
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
                  id: "cereja",
                  nome: "Cereja",
                  simbolo: "🍒"
                },
                {
                  id: "ovo",
                  nome: "Ovo",
                  simbolo: "🥚"
                },
                {
                  id: "coco",
                  nome: "Coco",
                  simbolo: "🥥"
                },
                {
                  id: "abacaxi",
                  nome: "Abacaxi",
                  simbolo: "🍍"
                },
                {
                  id: "uva",
                  nome: "Uva",
                  simbolo: "🍇"
                }
              ],
              resposta: "ovo",
              dica: "Quase todas as figuras são do mesmo tipo. Procure a que é diferente."
            }
          ]
        }
      },
      {
        numero: 15,
        trilha: "grandes",
        titulo: "10 figuras parecidas",
        objetivo: "Ache a figura que não combina com as outras 9.",
        dificuldade: "avancada",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Qual não é um animal?",
              opcoes: [
                {
                  id: "leao",
                  nome: "Leão",
                  simbolo: "🦁"
                },
                {
                  id: "gato",
                  nome: "Gato",
                  simbolo: "🐈"
                },
                {
                  id: "borboleta",
                  nome: "Borboleta",
                  simbolo: "🦋"
                },
                {
                  id: "broto",
                  nome: "Broto",
                  simbolo: "🌱"
                },
                {
                  id: "pato",
                  nome: "Pato",
                  simbolo: "🦆"
                },
                {
                  id: "joaninha",
                  nome: "Joaninha",
                  simbolo: "🐞"
                },
                {
                  id: "rato",
                  nome: "Rato",
                  simbolo: "🐭"
                },
                {
                  id: "polvo",
                  nome: "Polvo",
                  simbolo: "🐙"
                },
                {
                  id: "caracol",
                  nome: "Caracol",
                  simbolo: "🐌"
                },
                {
                  id: "coelho",
                  nome: "Coelho",
                  simbolo: "🐇"
                }
              ],
              resposta: "broto",
              dica: "Quase todas as figuras são do mesmo tipo. Procure a que é diferente."
            },
            {
              enunciado: "Qual não é um animal?",
              opcoes: [
                {
                  id: "coelho",
                  nome: "Coelho",
                  simbolo: "🐇"
                },
                {
                  id: "galinha",
                  nome: "Galinha",
                  simbolo: "🐔"
                },
                {
                  id: "tulipa",
                  nome: "Tulipa",
                  simbolo: "🌷"
                },
                {
                  id: "vaca",
                  nome: "Vaca",
                  simbolo: "🐄"
                },
                {
                  id: "peixe",
                  nome: "Peixe",
                  simbolo: "🐟"
                },
                {
                  id: "abelha",
                  nome: "Abelha",
                  simbolo: "🐝"
                },
                {
                  id: "sapo",
                  nome: "Sapo",
                  simbolo: "🐸"
                },
                {
                  id: "joaninha",
                  nome: "Joaninha",
                  simbolo: "🐞"
                },
                {
                  id: "passaro",
                  nome: "Pássaro",
                  simbolo: "🐦"
                },
                {
                  id: "pinguim",
                  nome: "Pinguim",
                  simbolo: "🐧"
                }
              ],
              resposta: "tulipa",
              dica: "Quase todas as figuras são do mesmo tipo. Procure a que é diferente."
            }
          ]
        }
      }
    ],
    ativo: false
  },
  {
    id: "palavra-figura",
    nome: "Palavra e figura",
    descricao: "Leia a palavra e escolha a figura correspondente.",
    categoria: "linguagem",
    instrucoes: "Leia a palavra com calma. Toque na figura que combina com ela; o nome aparece depois do acerto.",
    tipoMecanica: "escolha",
    versao: 2,
    faixaEtariaMin: 6,
    faixaEtariaMax: 8,
    ordemEditorial: 6,
    fases: [
      {
        numero: 1,
        trilha: "pequenos",
        titulo: "2 figuras",
        objetivo: "Leia a palavra e escolha a figura certa entre 2.",
        dificuldade: "simples",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Balão",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "balao",
                  nome: "Balão",
                  simbolo: "🎈"
                },
                {
                  id: "coelho",
                  nome: "Coelho",
                  simbolo: "🐇"
                }
              ],
              resposta: "balao",
              dica: "Serve para brincar."
            },
            {
              enunciado: "Sabonete",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "sapo",
                  nome: "Sapo",
                  simbolo: "🐸"
                },
                {
                  id: "sabonete",
                  nome: "Sabonete",
                  simbolo: "🧼"
                }
              ],
              resposta: "sabonete",
              dica: "É usado no dia a dia."
            }
          ]
        }
      },
      {
        numero: 2,
        trilha: "pequenos",
        titulo: "2 figuras",
        objetivo: "Leia a palavra e escolha a figura certa entre 2.",
        dificuldade: "simples",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Sabonete",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "papel",
                  nome: "Papel",
                  simbolo: "📄"
                },
                {
                  id: "sabonete",
                  nome: "Sabonete",
                  simbolo: "🧼"
                }
              ],
              resposta: "sabonete",
              dica: "É usado no dia a dia."
            },
            {
              enunciado: "Dado",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "dado",
                  nome: "Dado",
                  simbolo: "🎲"
                },
                {
                  id: "cama",
                  nome: "Cama",
                  simbolo: "🛏️"
                }
              ],
              resposta: "dado",
              dica: "Serve para brincar."
            }
          ]
        }
      },
      {
        numero: 3,
        trilha: "pequenos",
        titulo: "2 figuras do mesmo tipo",
        objetivo: "Leia a palavra e escolha a figura certa entre 2.",
        dificuldade: "media",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Uva",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "abacaxi",
                  nome: "Abacaxi",
                  simbolo: "🍍"
                },
                {
                  id: "uva",
                  nome: "Uva",
                  simbolo: "🍇"
                }
              ],
              resposta: "uva",
              dica: "É uma fruta. Pense na cor e no formato."
            },
            {
              enunciado: "Foguete",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "foguete",
                  nome: "Foguete",
                  simbolo: "🚀"
                },
                {
                  id: "onibus",
                  nome: "Ônibus",
                  simbolo: "🚌"
                }
              ],
              resposta: "foguete",
              dica: "Serve para ir de um lugar a outro."
            }
          ]
        }
      },
      {
        numero: 4,
        trilha: "pequenos",
        titulo: "3 figuras do mesmo tipo",
        objetivo: "Leia a palavra e escolha a figura certa entre 3.",
        dificuldade: "media",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Pato",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "vela",
                  nome: "Vela",
                  simbolo: "🕯️"
                },
                {
                  id: "macaco",
                  nome: "Macaco",
                  simbolo: "🐒"
                },
                {
                  id: "pato",
                  nome: "Pato",
                  simbolo: "🦆"
                }
              ],
              resposta: "pato",
              dica: "É um animal. Pense em como ele é."
            },
            {
              enunciado: "Caranguejo",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "ovo",
                  nome: "Ovo",
                  simbolo: "🥚"
                },
                {
                  id: "macaco",
                  nome: "Macaco",
                  simbolo: "🐒"
                },
                {
                  id: "caranguejo",
                  nome: "Caranguejo",
                  simbolo: "🦀"
                }
              ],
              resposta: "caranguejo",
              dica: "É um animal. Pense em como ele é."
            }
          ]
        }
      },
      {
        numero: 5,
        trilha: "pequenos",
        titulo: "3 figuras do mesmo tipo",
        objetivo: "Leia a palavra e escolha a figura certa entre 3.",
        dificuldade: "avancada",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Chuva",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "chuva",
                  nome: "Chuva",
                  simbolo: "🌧️"
                },
                {
                  id: "estrela",
                  nome: "Estrela",
                  simbolo: "⭐"
                },
                {
                  id: "cometa",
                  nome: "Cometa",
                  simbolo: "☄️"
                }
              ],
              resposta: "chuva",
              dica: "Aparece no céu."
            },
            {
              enunciado: "Raio",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "raio",
                  nome: "Raio",
                  simbolo: "⚡"
                },
                {
                  id: "cometa",
                  nome: "Cometa",
                  simbolo: "☄️"
                },
                {
                  id: "nuvem",
                  nome: "Nuvem",
                  simbolo: "☁️"
                }
              ],
              resposta: "raio",
              dica: "Aparece no céu."
            }
          ]
        }
      },
      {
        numero: 6,
        trilha: "medios",
        titulo: "4 figuras do mesmo tipo",
        objetivo: "Leia a palavra e escolha a figura certa entre 4.",
        dificuldade: "simples",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Livro",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "vela",
                  nome: "Vela",
                  simbolo: "🕯️"
                },
                {
                  id: "casa",
                  nome: "Casa",
                  simbolo: "🏠"
                },
                {
                  id: "livro",
                  nome: "Livro",
                  simbolo: "📘"
                },
                {
                  id: "helicoptero",
                  nome: "Helicóptero",
                  simbolo: "🚁"
                }
              ],
              resposta: "livro",
              dica: "É usado no dia a dia."
            },
            {
              enunciado: "Ovo",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "ovo",
                  nome: "Ovo",
                  simbolo: "🥚"
                },
                {
                  id: "milho",
                  nome: "Milho",
                  simbolo: "🌽"
                },
                {
                  id: "bolo",
                  nome: "Bolo",
                  simbolo: "🎂"
                },
                {
                  id: "regua",
                  nome: "Régua",
                  simbolo: "📏"
                }
              ],
              resposta: "ovo",
              dica: "É algo de comer. Pense em onde aparece."
            }
          ]
        }
      },
      {
        numero: 7,
        trilha: "medios",
        titulo: "4 figuras do mesmo tipo",
        objetivo: "Leia a palavra e escolha a figura certa entre 4.",
        dificuldade: "simples",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Biscoito",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "pao",
                  nome: "Pão",
                  simbolo: "🍞"
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
                  id: "biscoito",
                  nome: "Biscoito",
                  simbolo: "🍪"
                }
              ],
              resposta: "biscoito",
              dica: "É algo de comer. Pense em onde aparece."
            },
            {
              enunciado: "Bicicleta",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "onibus",
                  nome: "Ônibus",
                  simbolo: "🚌"
                },
                {
                  id: "bicicleta",
                  nome: "Bicicleta",
                  simbolo: "🚲"
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
                }
              ],
              resposta: "bicicleta",
              dica: "Serve para ir de um lugar a outro."
            }
          ]
        }
      },
      {
        numero: 8,
        trilha: "medios",
        titulo: "5 figuras do mesmo tipo",
        objetivo: "Leia a palavra e escolha a figura certa entre 5.",
        dificuldade: "media",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Melancia",
              ocultarNomes: true,
              opcoes: [
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
                  id: "uva",
                  nome: "Uva",
                  simbolo: "🍇"
                },
                {
                  id: "sapo",
                  nome: "Sapo",
                  simbolo: "🐸"
                },
                {
                  id: "melancia",
                  nome: "Melancia",
                  simbolo: "🍉"
                }
              ],
              resposta: "melancia",
              dica: "É uma fruta. Pense na cor e no formato."
            },
            {
              enunciado: "Escova de dentes",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "chave",
                  nome: "Chave",
                  simbolo: "🔑"
                },
                {
                  id: "casa",
                  nome: "Casa",
                  simbolo: "🏠"
                },
                {
                  id: "melancia",
                  nome: "Melancia",
                  simbolo: "🍉"
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
                }
              ],
              resposta: "escova",
              dica: "É usado no dia a dia."
            }
          ]
        }
      },
      {
        numero: 9,
        trilha: "medios",
        titulo: "5 figuras do mesmo tipo",
        objetivo: "Leia a palavra e escolha a figura certa entre 5.",
        dificuldade: "media",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Morango",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "limao",
                  nome: "Limão",
                  simbolo: "🍋"
                },
                {
                  id: "morango",
                  nome: "Morango",
                  simbolo: "🍓"
                },
                {
                  id: "maca",
                  nome: "Maçã",
                  simbolo: "🍎"
                },
                {
                  id: "coco",
                  nome: "Coco",
                  simbolo: "🥥"
                },
                {
                  id: "pera",
                  nome: "Pera",
                  simbolo: "🍐"
                }
              ],
              resposta: "morango",
              dica: "É uma fruta. Pense na cor e no formato."
            },
            {
              enunciado: "Cenoura",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "ovo",
                  nome: "Ovo",
                  simbolo: "🥚"
                },
                {
                  id: "bolo",
                  nome: "Bolo",
                  simbolo: "🎂"
                },
                {
                  id: "milho",
                  nome: "Milho",
                  simbolo: "🌽"
                },
                {
                  id: "cenoura",
                  nome: "Cenoura",
                  simbolo: "🥕"
                },
                {
                  id: "sanduiche",
                  nome: "Sanduíche",
                  simbolo: "🥪"
                }
              ],
              resposta: "cenoura",
              dica: "É algo de comer. Pense em onde aparece."
            }
          ]
        }
      },
      {
        numero: 10,
        trilha: "medios",
        titulo: "6 figuras do mesmo tipo",
        objetivo: "Leia a palavra e escolha a figura certa entre 6.",
        dificuldade: "avancada",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Vaca",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "vaca",
                  nome: "Vaca",
                  simbolo: "🐄"
                },
                {
                  id: "ovelha",
                  nome: "Ovelha",
                  simbolo: "🐑"
                },
                {
                  id: "elefante",
                  nome: "Elefante",
                  simbolo: "🐘"
                },
                {
                  id: "cachorro",
                  nome: "Cachorro",
                  simbolo: "🐶"
                },
                {
                  id: "coelho",
                  nome: "Coelho",
                  simbolo: "🐇"
                },
                {
                  id: "floco",
                  nome: "Floco de neve",
                  simbolo: "❄️"
                }
              ],
              resposta: "vaca",
              dica: "É um animal. Pense em como ele é."
            },
            {
              enunciado: "Queijo",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "queijo",
                  nome: "Queijo",
                  simbolo: "🧀"
                },
                {
                  id: "ovo",
                  nome: "Ovo",
                  simbolo: "🥚"
                },
                {
                  id: "biscoito",
                  nome: "Biscoito",
                  simbolo: "🍪"
                },
                {
                  id: "sapo",
                  nome: "Sapo",
                  simbolo: "🐸"
                },
                {
                  id: "sanduiche",
                  nome: "Sanduíche",
                  simbolo: "🥪"
                },
                {
                  id: "brocolis",
                  nome: "Brócolis",
                  simbolo: "🥦"
                }
              ],
              resposta: "queijo",
              dica: "É algo de comer. Pense em onde aparece."
            }
          ]
        }
      },
      {
        numero: 11,
        trilha: "grandes",
        titulo: "6 figuras do mesmo tipo",
        objetivo: "Leia a palavra e escolha a figura certa entre 6.",
        dificuldade: "simples",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Casa",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "despertador",
                  nome: "Despertador",
                  simbolo: "⏰"
                },
                {
                  id: "cadeira",
                  nome: "Cadeira",
                  simbolo: "🪑"
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
                  id: "vela",
                  nome: "Vela",
                  simbolo: "🕯️"
                },
                {
                  id: "casa",
                  nome: "Casa",
                  simbolo: "🏠"
                }
              ],
              resposta: "casa",
              dica: "É usado no dia a dia."
            },
            {
              enunciado: "Girassol",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "folha",
                  nome: "Folha",
                  simbolo: "🍃"
                },
                {
                  id: "girassol",
                  nome: "Girassol",
                  simbolo: "🌻"
                },
                {
                  id: "vaso",
                  nome: "Vaso de planta",
                  simbolo: "🪴"
                },
                {
                  id: "tulipa",
                  nome: "Tulipa",
                  simbolo: "🌷"
                },
                {
                  id: "cogumelo",
                  nome: "Cogumelo",
                  simbolo: "🍄"
                },
                {
                  id: "flor",
                  nome: "Flor",
                  simbolo: "🌸"
                }
              ],
              resposta: "girassol",
              dica: "Nasce na terra."
            }
          ]
        }
      },
      {
        numero: 12,
        trilha: "grandes",
        titulo: "7 figuras do mesmo tipo",
        objetivo: "Leia a palavra e escolha a figura certa entre 7.",
        dificuldade: "simples",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Broto",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "cadeira",
                  nome: "Cadeira",
                  simbolo: "🪑"
                },
                {
                  id: "arvore",
                  nome: "Árvore",
                  simbolo: "🌳"
                },
                {
                  id: "tulipa",
                  nome: "Tulipa",
                  simbolo: "🌷"
                },
                {
                  id: "vaso",
                  nome: "Vaso de planta",
                  simbolo: "🪴"
                },
                {
                  id: "folha",
                  nome: "Folha",
                  simbolo: "🍃"
                },
                {
                  id: "cacto",
                  nome: "Cacto",
                  simbolo: "🌵"
                },
                {
                  id: "broto",
                  nome: "Broto",
                  simbolo: "🌱"
                }
              ],
              resposta: "broto",
              dica: "Nasce na terra."
            },
            {
              enunciado: "Livro",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "livro",
                  nome: "Livro",
                  simbolo: "📘"
                },
                {
                  id: "xicara",
                  nome: "Xícara",
                  simbolo: "☕"
                },
                {
                  id: "escova",
                  nome: "Escova de dentes",
                  simbolo: "🪥"
                },
                {
                  id: "sanduiche",
                  nome: "Sanduíche",
                  simbolo: "🥪"
                },
                {
                  id: "vela",
                  nome: "Vela",
                  simbolo: "🕯️"
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
                }
              ],
              resposta: "livro",
              dica: "É usado no dia a dia."
            }
          ]
        }
      },
      {
        numero: 13,
        trilha: "grandes",
        titulo: "7 figuras do mesmo tipo",
        objetivo: "Leia a palavra e escolha a figura certa entre 7.",
        dificuldade: "media",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Batata",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "batata",
                  nome: "Batata",
                  simbolo: "🥔"
                },
                {
                  id: "sanduiche",
                  nome: "Sanduíche",
                  simbolo: "🥪"
                },
                {
                  id: "cenoura",
                  nome: "Cenoura",
                  simbolo: "🥕"
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
                  id: "ovo",
                  nome: "Ovo",
                  simbolo: "🥚"
                },
                {
                  id: "brocolis",
                  nome: "Brócolis",
                  simbolo: "🥦"
                }
              ],
              resposta: "batata",
              dica: "É algo de comer. Pense em onde aparece."
            },
            {
              enunciado: "Chuva",
              ocultarNomes: true,
              opcoes: [
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
                  id: "estrela",
                  nome: "Estrela",
                  simbolo: "⭐"
                },
                {
                  id: "cometa",
                  nome: "Cometa",
                  simbolo: "☄️"
                },
                {
                  id: "floco",
                  nome: "Floco de neve",
                  simbolo: "❄️"
                }
              ],
              resposta: "chuva",
              dica: "Aparece no céu."
            }
          ]
        }
      },
      {
        numero: 14,
        trilha: "grandes",
        titulo: "8 figuras do mesmo tipo",
        objetivo: "Leia a palavra e escolha a figura certa entre 8.",
        dificuldade: "media",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Batata",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "milho",
                  nome: "Milho",
                  simbolo: "🌽"
                },
                {
                  id: "lua",
                  nome: "Lua",
                  simbolo: "🌙"
                },
                {
                  id: "cenoura",
                  nome: "Cenoura",
                  simbolo: "🥕"
                },
                {
                  id: "bolo",
                  nome: "Bolo",
                  simbolo: "🎂"
                },
                {
                  id: "batata",
                  nome: "Batata",
                  simbolo: "🥔"
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
                  id: "biscoito",
                  nome: "Biscoito",
                  simbolo: "🍪"
                }
              ],
              resposta: "batata",
              dica: "É algo de comer. Pense em onde aparece."
            },
            {
              enunciado: "Despertador",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "vela",
                  nome: "Vela",
                  simbolo: "🕯️"
                },
                {
                  id: "floco",
                  nome: "Floco de neve",
                  simbolo: "❄️"
                },
                {
                  id: "escova",
                  nome: "Escova de dentes",
                  simbolo: "🪥"
                },
                {
                  id: "cama",
                  nome: "Cama",
                  simbolo: "🛏️"
                },
                {
                  id: "cadeira",
                  nome: "Cadeira",
                  simbolo: "🪑"
                },
                {
                  id: "sabonete",
                  nome: "Sabonete",
                  simbolo: "🧼"
                },
                {
                  id: "despertador",
                  nome: "Despertador",
                  simbolo: "⏰"
                },
                {
                  id: "chave",
                  nome: "Chave",
                  simbolo: "🔑"
                }
              ],
              resposta: "despertador",
              dica: "É usado no dia a dia."
            }
          ]
        }
      },
      {
        numero: 15,
        trilha: "grandes",
        titulo: "8 figuras do mesmo tipo",
        objetivo: "Leia a palavra e escolha a figura certa entre 8.",
        dificuldade: "avancada",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Biscoito",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "pao",
                  nome: "Pão",
                  simbolo: "🍞"
                },
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
                  id: "ovo",
                  nome: "Ovo",
                  simbolo: "🥚"
                },
                {
                  id: "biscoito",
                  nome: "Biscoito",
                  simbolo: "🍪"
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
                  id: "queijo",
                  nome: "Queijo",
                  simbolo: "🧀"
                }
              ],
              resposta: "biscoito",
              dica: "É algo de comer. Pense em onde aparece."
            },
            {
              enunciado: "Folha",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "vaso",
                  nome: "Vaso de planta",
                  simbolo: "🪴"
                },
                {
                  id: "folha",
                  nome: "Folha",
                  simbolo: "🍃"
                },
                {
                  id: "cogumelo",
                  nome: "Cogumelo",
                  simbolo: "🍄"
                },
                {
                  id: "arvore",
                  nome: "Árvore",
                  simbolo: "🌳"
                },
                {
                  id: "flor",
                  nome: "Flor",
                  simbolo: "🌸"
                },
                {
                  id: "tulipa",
                  nome: "Tulipa",
                  simbolo: "🌷"
                },
                {
                  id: "broto",
                  nome: "Broto",
                  simbolo: "🌱"
                },
                {
                  id: "girassol",
                  nome: "Girassol",
                  simbolo: "🌻"
                }
              ],
              resposta: "folha",
              dica: "Nasce na terra."
            }
          ]
        }
      }
    ],
    ativo: false
  },
  {
    id: "entrega-jardim",
    nome: "Entrega no jardim",
    descricao: "Leve a peça pelos pontos de entrega até a chegada.",
    categoria: "coordenacao",
    instrucoes: "Use as setas ou o teclado. Passe por todos os pontos de entrega antes de chegar ao destino.",
    tipoMecanica: "labirinto",
    versao: 2,
    faixaEtariaMin: 5,
    faixaEtariaMax: 8,
    ordemEditorial: 8,
    fases: [
      {
        numero: 1,
        trilha: "pequenos",
        titulo: "Uma entrega",
        objetivo: "Passe pelo ponto de entrega e chegue ao destino.",
        dificuldade: "simples",
        configuracao: {
          mapas: [
            [
              "#######",
              "#I.P#.#",
              "#.#.#.#",
              "#F#...#",
              "#######"
            ],
            [
              "#######",
              "#I....#",
              "#.###.#",
              "#..F#P#",
              "#######"
            ]
          ]
        }
      },
      {
        numero: 2,
        trilha: "pequenos",
        titulo: "Entrega com curva",
        objetivo: "Passe pelo ponto de entrega e chegue ao destino.",
        dificuldade: "simples",
        configuracao: {
          mapas: [
            [
              "#########",
              "#I...F..#",
              "#.#.#.#.#",
              "#P#.#.#.#",
              "#########"
            ],
            [
              "#########",
              "#I.P...F#",
              "#.#.###.#",
              "#.#...#.#",
              "#########"
            ]
          ]
        }
      },
      {
        numero: 3,
        trilha: "pequenos",
        titulo: "Escolha o caminho",
        objetivo: "Passe pelo ponto de entrega e chegue ao destino.",
        dificuldade: "media",
        configuracao: {
          mapas: [
            [
              "#########",
              "#I....#.#",
              "#.###.#.#",
              "#...#..P#",
              "###.#.###",
              "#..F#...#",
              "#########"
            ],
            [
              "#########",
              "#I#.#...#",
              "#.#.###.#",
              "#...#.#.#",
              "#.#.#.#.#",
              "#P#..F..#",
              "#########"
            ]
          ]
        }
      },
      {
        numero: 4,
        trilha: "pequenos",
        titulo: "Duas entregas",
        objetivo: "Passe pelos 2 pontos de entrega e chegue ao destino.",
        dificuldade: "media",
        configuracao: {
          mapas: [
            [
              "#########",
              "#I......#",
              "#.#.###.#",
              "#.#.#.#.#",
              "#.###.###",
              "#....F#.#",
              "#.#.###.#",
              "#.#P.P..#",
              "#########"
            ],
            [
              "#########",
              "#I.P....#",
              "#.#.#.###",
              "#.#.#..P#",
              "###.#.#.#",
              "#.#.#.#.#",
              "#.#.###.#",
              "#...#F..#",
              "#########"
            ]
          ]
        }
      },
      {
        numero: 5,
        trilha: "pequenos",
        titulo: "Jardim com voltas",
        objetivo: "Passe pelos 2 pontos de entrega e chegue ao destino.",
        dificuldade: "avancada",
        configuracao: {
          mapas: [
            [
              "###########",
              "#I........#",
              "#.#######.#",
              "#...#...#.#",
              "#.###.#.#.#",
              "#P...P#.#.#",
              "###.#######",
              "#........F#",
              "###########"
            ],
            [
              "###########",
              "#I....#.#.#",
              "#.#.#.#.#.#",
              "#P#P#.....#",
              "#.#####.#.#",
              "#.#F....#.#",
              "###.#.###.#",
              "#...#...#.#",
              "###########"
            ]
          ]
        }
      },
      {
        numero: 6,
        trilha: "medios",
        titulo: "Duas entregas longe",
        objetivo: "Passe pelos 2 pontos de entrega e chegue ao destino.",
        dificuldade: "simples",
        configuracao: {
          mapas: [
            [
              "###########",
              "#I....#..P#",
              "#.###.#.#.#",
              "#...#...#.#",
              "#.#####.###",
              "#....P#...#",
              "#.#####.#.#",
              "#..F..#.#.#",
              "###.#####.#",
              "#.......#.#",
              "###########"
            ],
            [
              "###########",
              "#I.P#...#.#",
              "#.###.###.#",
              "#....F....#",
              "#.###.###.#",
              "#...#...#.#",
              "#.###.#.###",
              "#...#.#P..#",
              "###.###.###",
              "#.....#...#",
              "###########"
            ]
          ]
        }
      },
      {
        numero: 7,
        trilha: "medios",
        titulo: "Caminho com becos",
        objetivo: "Passe pelos 2 pontos de entrega e chegue ao destino.",
        dificuldade: "simples",
        configuracao: {
          mapas: [
            [
              "###########",
              "#I........#",
              "#.#.#####.#",
              "#.#....P#.#",
              "#.###.#.###",
              "#P..#.#...#",
              "#.#.###.###",
              "#.#...#...#",
              "###.###.###",
              "#..F..#...#",
              "#######.#.#",
              "#.......#.#",
              "###########"
            ],
            [
              "###########",
              "#I........#",
              "#.###.###.#",
              "#.#....P#.#",
              "#.###.###.#",
              "#...#...#.#",
              "#.#.#.#.#.#",
              "#.#P#.#F#.#",
              "#.#.#####.#",
              "#.#...#...#",
              "#.#######.#",
              "#.....#...#",
              "###########"
            ]
          ]
        }
      },
      {
        numero: 8,
        trilha: "medios",
        titulo: "Três entregas",
        objetivo: "Passe pelos 3 pontos de entrega e chegue ao destino.",
        dificuldade: "media",
        configuracao: {
          mapas: [
            [
              "#############",
              "#I#P....#...#",
              "#.#.#####.###",
              "#P........#.#",
              "#.#.#.#.###.#",
              "#.#.#.#.#...#",
              "#.#######.###",
              "#P..#.......#",
              "#.###.#.###.#",
              "#.....#...#.#",
              "###.###.###.#",
              "#.....#..F#.#",
              "#############"
            ],
            [
              "#############",
              "#I..........#",
              "#.#.#.#.###.#",
              "#.#.#.#...#.#",
              "#.#.#########",
              "#.#F.P......#",
              "#.#.#.#######",
              "#.#.#P..#...#",
              "#.###.#.###.#",
              "#...#.#.....#",
              "#.#######.###",
              "#P..#.......#",
              "#############"
            ]
          ]
        }
      },
      {
        numero: 9,
        trilha: "medios",
        titulo: "Jardim grande",
        objetivo: "Passe pelos 3 pontos de entrega e chegue ao destino.",
        dificuldade: "media",
        configuracao: {
          mapas: [
            [
              "#############",
              "#I..#.#...#.#",
              "#.#.#.#.###.#",
              "#.#.........#",
              "#.#.#.#######",
              "#.#.#...#...#",
              "###.###.#.###",
              "#...#P...P..#",
              "#.###.#.###.#",
              "#.#...#...#.#",
              "#.#.#####.#.#",
              "#.#.#....F#.#",
              "###.#####.#.#",
              "#P......#.#.#",
              "#############"
            ],
            [
              "#############",
              "#I..........#",
              "#.#######.###",
              "#P....#.....#",
              "#.###.#.#.#.#",
              "#...#.#P#.#.#",
              "#.#######.#.#",
              "#.......#.#P#",
              "#.###.#.###.#",
              "#F..#.#...#.#",
              "#.#.#########",
              "#.#.....#...#",
              "#.#.#.#.###.#",
              "#.#.#.#.....#",
              "#############"
            ]
          ]
        }
      },
      {
        numero: 10,
        trilha: "medios",
        titulo: "Três entregas longe",
        objetivo: "Passe pelos 3 pontos de entrega e chegue ao destino.",
        dificuldade: "avancada",
        configuracao: {
          mapas: [
            [
              "###############",
              "#I............#",
              "#.#.###.###.#.#",
              "#.#...#...#.#.#",
              "#.#######.###.#",
              "#..F....#P..#P#",
              "#.###.###.#.#.#",
              "#...#...#.#.#P#",
              "#.###.#.#.#####",
              "#.#.#.#.#...#.#",
              "#.#.#.#######.#",
              "#...#.........#",
              "#.#.###.#.###.#",
              "#.#...#.#...#.#",
              "###############"
            ],
            [
              "###############",
              "#I#.#...#..F..#",
              "#.#.#.###.#.###",
              "#.........#...#",
              "###.#.#.###.###",
              "#...#.#.#.#...#",
              "#.###.###.#.###",
              "#P..#.#.#.....#",
              "#.#.#.#.#.###.#",
              "#.#.#...#...#.#",
              "#.#.###########",
              "#.#...........#",
              "###.###.###.###",
              "#..P.P#...#...#",
              "###############"
            ]
          ]
        }
      },
      {
        numero: 11,
        trilha: "grandes",
        titulo: "Entregas pelo jardim",
        objetivo: "Passe pelos 3 pontos de entrega e chegue ao destino.",
        dificuldade: "simples",
        configuracao: {
          mapas: [
            [
              "###############",
              "#I....#.#..P#F#",
              "#.#.###.#.###.#",
              "#.#...........#",
              "###.###.#.#####",
              "#.....#P#.#.#.#",
              "#.#.###.#.#.#.#",
              "#.#...#.#.....#",
              "#.###.#.#######",
              "#.#...#......P#",
              "#.#.###.#.###.#",
              "#.#.#...#...#.#",
              "###.###.###.#.#",
              "#.....#...#.#.#",
              "###.###.#######",
              "#...#.........#",
              "###############"
            ],
            [
              "###############",
              "#I.......P#.#.#",
              "#.#.#.#####.#.#",
              "#.#.#.#.#...#.#",
              "###.###.#.###.#",
              "#.............#",
              "#.#.#########.#",
              "#P#.........#F#",
              "#.#.#.###.#.#.#",
              "#.#.#.#...#.#.#",
              "#.#.#.#.#.###.#",
              "#.#.#.#.#.#...#",
              "#.###.###.#.#.#",
              "#P..#.#...#.#.#",
              "#.###.#####.###",
              "#.#.......#...#",
              "###############"
            ]
          ]
        }
      },
      {
        numero: 12,
        trilha: "grandes",
        titulo: "Quatro entregas",
        objetivo: "Passe pelos 4 pontos de entrega e chegue ao destino.",
        dificuldade: "simples",
        configuracao: {
          mapas: [
            [
              "###############",
              "#I......#..P#P#",
              "#.###.###.###.#",
              "#...#...#P#...#",
              "#.#.#.###.#.###",
              "#.#.#.#.#..F..#",
              "#.#####.#.###.#",
              "#.......#...#.#",
              "#.#.###.#.#####",
              "#.#.#.........#",
              "#.#.###.#.#.###",
              "#.#...#.#P#...#",
              "###.#.###.#.#.#",
              "#...#.#...#.#.#",
              "###.#####.###.#",
              "#...#.......#.#",
              "###.#####.###.#",
              "#.....#.....#.#",
              "###############"
            ],
            [
              "###############",
              "#I...P......#.#",
              "#.###.#.#.#.#.#",
              "#.#...#.#.#.#.#",
              "#####.###.###.#",
              "#.#.#P..#.#...#",
              "#.#.###.###.#.#",
              "#...#.......#.#",
              "#.###.#######.#",
              "#..........P#.#",
              "#.#####.###.###",
              "#...#.....#...#",
              "#.###.#.###.###",
              "#.#..P#...#...#",
              "###.#.###.#####",
              "#...#...#.....#",
              "###.###.###.###",
              "#.....#.#F....#",
              "###############"
            ]
          ]
        }
      },
      {
        numero: 13,
        trilha: "grandes",
        titulo: "Jardim com muitos becos",
        objetivo: "Passe pelos 4 pontos de entrega e chegue ao destino.",
        dificuldade: "media",
        configuracao: {
          mapas: [
            [
              "###############",
              "#I#.#.........#",
              "#.#.###.###.###",
              "#.........#...#",
              "#.#######.#####",
              "#...#.#.#...#.#",
              "###.#.#.#.###.#",
              "#.......#.....#",
              "#.#.###.#####.#",
              "#.#P..#F....#.#",
              "#.###.###.#####",
              "#.#..P..#....P#",
              "###.#.#.#####.#",
              "#...#.#.#...#.#",
              "#.###.###.#####",
              "#.#........P#.#",
              "#.###.###.#.#.#",
              "#.#.....#.#...#",
              "#.#.#.#######.#",
              "#.#.#.....#...#",
              "###############"
            ],
            [
              "###############",
              "#I....#...#..P#",
              "###.###.#####.#",
              "#.......#..F#.#",
              "###.#.###.###.#",
              "#...#.......#.#",
              "#.#.#.###.###.#",
              "#.#.#...#....P#",
              "###.#.###.#####",
              "#...#...#...#.#",
              "#####.#.#.#.#.#",
              "#.#...#.#.#P..#",
              "#.###.###.###.#",
              "#.......#...#P#",
              "#.#######.#.###",
              "#.....#...#...#",
              "#.#.#.###.#.#.#",
              "#.#.#...#.#.#.#",
              "###.###.#.###.#",
              "#.....#.#.#...#",
              "###############"
            ]
          ]
        }
      },
      {
        numero: 14,
        trilha: "grandes",
        titulo: "Grande entrega",
        objetivo: "Passe pelos 4 pontos de entrega e chegue ao destino.",
        dificuldade: "media",
        configuracao: {
          mapas: [
            [
              "###############",
              "#I....#...#.#.#",
              "#.###.#.###.#.#",
              "#...#.........#",
              "###.#.#.#######",
              "#.#.#.#.......#",
              "#.#.#####.#####",
              "#P......#.#...#",
              "#.###.#.###.###",
              "#...#.#..F#.#.#",
              "#.###.###.#.#.#",
              "#...#...#.....#",
              "#.#.###.###.#.#",
              "#.#...#P..#.#.#",
              "#.#.###.###.#.#",
              "#.#...#P..#.#.#",
              "###.#.#.#.###.#",
              "#...#.#.#...#.#",
              "#######.#######",
              "#.............#",
              "#####.###.#####",
              "#P....#.......#",
              "###############"
            ],
            [
              "###############",
              "#I......#.....#",
              "#.#########.###",
              "#.#...#...#.#.#",
              "#.#.#.#.###.#.#",
              "#...#.........#",
              "#.#.#.#.#.#####",
              "#.#.#.#.#.....#",
              "#.#######.###.#",
              "#......P#...#.#",
              "#.#.#####.#.#.#",
              "#.#..P..#.#.#.#",
              "#.###.#########",
              "#.#.....#.#.#.#",
              "#.###.#.#.#.#.#",
              "#...#P#.#.#.#.#",
              "###.###.#.#.#.#",
              "#...#....F....#",
              "###.#####.#.###",
              "#.....#...#...#",
              "#.###.###.#####",
              "#P#...#.......#",
              "###############"
            ]
          ]
        }
      },
      {
        numero: 15,
        trilha: "grandes",
        titulo: "A maior entrega",
        objetivo: "Passe pelos 4 pontos de entrega e chegue ao destino.",
        dificuldade: "avancada",
        configuracao: {
          mapas: [
            [
              "###############",
              "#I#...........#",
              "#.###.#.#.#####",
              "#.#..P#.#.....#",
              "#.#.#####.###.#",
              "#P...P..#...#.#",
              "#.#.#.#.#####.#",
              "#.#.#.#.....#.#",
              "###.#######.###",
              "#.........#...#",
              "#####.#########",
              "#.............#",
              "#.#.#.#.#.#.#.#",
              "#.#.#.#.#.#.#.#",
              "###.#.#.#.#.#.#",
              "#...#.#.#.#.#.#",
              "#.###.###.#.###",
              "#...#...#.#...#",
              "###.###.#.#.###",
              "#.....#F#.#...#",
              "###.#######.#.#",
              "#....P....#.#.#",
              "###############"
            ],
            [
              "###############",
              "#I......#.....#",
              "###.###.#.###.#",
              "#...#....P..#.#",
              "#.#.###.#.###.#",
              "#.#.#...#F..#.#",
              "#.#.###.#.#.###",
              "#.#.#...#.#...#",
              "#.###########.#",
              "#......P..#...#",
              "#.#.#.#.###.###",
              "#.#.#.#...#P..#",
              "#.#.#.###.#####",
              "#.#.#P..#.....#",
              "#.#####.###.###",
              "#.....#.#.....#",
              "###.#.#.###.###",
              "#...#.#.#...#.#",
              "#.###.#####.#.#",
              "#.#...#.......#",
              "#####.###.#.###",
              "#.....#...#...#",
              "###############"
            ]
          ]
        }
      }
    ]
  }
];
