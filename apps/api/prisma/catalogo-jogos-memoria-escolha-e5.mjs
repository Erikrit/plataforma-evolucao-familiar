/**
 * Marco 1, conteúdo — Letra inicial e Adivinha pela pista (DEV-CAT-M1-CONTEUDO, ticket 04).
 * Reaproveitam o motor de escolha, sem rótulo que entregue a resposta (nomes ocultos, letra ou
 * sílaba declarada, pista sem o nome). Mãe e filhote e Metades saíram do ticket por decisão do
 * responsável (2026-11-27), por se parecerem com a Memória; serão substituídos depois do Marco 1.
 * Refeitos após a homologação de 2026-11-27: as distrações ficam cada vez mais parecidas com a
 * resposta (sons vizinhos e mesma letra; figuras do mesmo tipo), medidas pela régua.
 * 15 fases em três trilhas, duas variantes por fase, aprovadas pela régua
 * (npm run regua:jogos -w @pef/api -- --estrito). Revisão humana na homologação.
 */
export const CATALOGO_JOGOS_MEMORIA_ESCOLHA_E5 = [
  {
    id: "letra-inicial",
    nome: "Letra inicial",
    descricao: "Escolha a figura cujo nome começa com a letra ou a sílaba pedida.",
    categoria: "linguagem",
    instrucoes: "Leia a letra com a criança e falem juntos o nome de cada figura. Toque na que começa assim; o nome aparece depois do acerto.",
    tipoMecanica: "escolha",
    versao: 1,
    faixaEtariaMin: 5,
    faixaEtariaMax: 12,
    ordemEditorial: 15,
    fases: [
      {
        numero: 1,
        trilha: "pequenos",
        dificuldade: "simples",
        titulo: "Letra inicial · 2 figuras",
        objetivo: "Escolha, entre 2 figuras, a que começa com a letra pedida.",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Qual figura começa com B?",
              inicio: "B",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "bola",
                  nome: "Bola",
                  simbolo: "⚽"
                },
                {
                  id: "uva",
                  nome: "Uva",
                  simbolo: "🍇"
                }
              ],
              resposta: "bola",
              dica: "Fale devagar o nome de cada figura. Qual começa com o mesmo som de “bebê”?"
            },
            {
              enunciado: "Qual figura começa com S?",
              inicio: "S",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "sol",
                  nome: "Sol",
                  simbolo: "☀️"
                },
                {
                  id: "ovo",
                  nome: "Ovo",
                  simbolo: "🥚"
                }
              ],
              resposta: "sol",
              dica: "Fale devagar o nome de cada figura. Qual começa com o mesmo som de “sopa”?"
            }
          ]
        }
      },
      {
        numero: 2,
        trilha: "pequenos",
        dificuldade: "simples",
        titulo: "Letra inicial · 3 figuras",
        objetivo: "Escolha, entre 3 figuras, a que começa com a letra pedida.",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Qual figura começa com U?",
              inicio: "U",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "uva",
                  nome: "Uva",
                  simbolo: "🍇"
                },
                {
                  id: "gato",
                  nome: "Gato",
                  simbolo: "🐈"
                },
                {
                  id: "mel",
                  nome: "Mel",
                  simbolo: "🍯"
                }
              ],
              resposta: "uva",
              dica: "Fale devagar o nome de cada figura. Qual começa com o mesmo som de “um”?"
            },
            {
              enunciado: "Qual figura começa com L?",
              inicio: "L",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "lua",
                  nome: "Lua",
                  simbolo: "🌙"
                },
                {
                  id: "ovo",
                  nome: "Ovo",
                  simbolo: "🥚"
                },
                {
                  id: "casa",
                  nome: "Casa",
                  simbolo: "🏠"
                }
              ],
              resposta: "lua",
              dica: "Fale devagar o nome de cada figura. Qual começa com o mesmo som de “lata”?"
            }
          ]
        }
      },
      {
        numero: 3,
        trilha: "pequenos",
        dificuldade: "media",
        titulo: "Letra inicial · 3 figuras",
        objetivo: "Escolha, entre 3 figuras, a que começa com a letra pedida.",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Qual figura começa com B?",
              inicio: "B",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "barco",
                  nome: "Barco",
                  simbolo: "⛵"
                },
                {
                  id: "pato",
                  nome: "Pato",
                  simbolo: "🦆"
                },
                {
                  id: "uva",
                  nome: "Uva",
                  simbolo: "🍇"
                }
              ],
              resposta: "barco",
              dica: "Fale devagar o nome de cada figura. Qual começa com o mesmo som de “bebê”?"
            },
            {
              enunciado: "Qual figura começa com T?",
              inicio: "T",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "trem",
                  nome: "Trem",
                  simbolo: "🚂"
                },
                {
                  id: "dado",
                  nome: "Dado",
                  simbolo: "🎲"
                },
                {
                  id: "ovo",
                  nome: "Ovo",
                  simbolo: "🥚"
                }
              ],
              resposta: "trem",
              dica: "Fale devagar o nome de cada figura. Qual começa com o mesmo som de “tatu”?"
            }
          ]
        }
      },
      {
        numero: 4,
        trilha: "pequenos",
        dificuldade: "media",
        titulo: "Letra inicial · 4 figuras",
        objetivo: "Escolha, entre 4 figuras, a que começa com a letra pedida.",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Qual figura começa com M?",
              inicio: "M",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "macaco",
                  nome: "Macaco",
                  simbolo: "🐒"
                },
                {
                  id: "nuvem",
                  nome: "Nuvem",
                  simbolo: "☁️"
                },
                {
                  id: "ovo",
                  nome: "Ovo",
                  simbolo: "🥚"
                },
                {
                  id: "sol",
                  nome: "Sol",
                  simbolo: "☀️"
                }
              ],
              resposta: "macaco",
              dica: "Fale devagar o nome de cada figura. Qual começa com o mesmo som de “mamãe”?"
            },
            {
              enunciado: "Qual figura começa com F?",
              inicio: "F",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "foguete",
                  nome: "Foguete",
                  simbolo: "🚀"
                },
                {
                  id: "vela",
                  nome: "Vela",
                  simbolo: "🕯️"
                },
                {
                  id: "uva",
                  nome: "Uva",
                  simbolo: "🍇"
                },
                {
                  id: "gato",
                  nome: "Gato",
                  simbolo: "🐈"
                }
              ],
              resposta: "foguete",
              dica: "Fale devagar o nome de cada figura. Qual começa com o mesmo som de “fada”?"
            }
          ]
        }
      },
      {
        numero: 5,
        trilha: "pequenos",
        dificuldade: "avancada",
        titulo: "Letra inicial · 4 figuras",
        objetivo: "Escolha, entre 4 figuras, a que começa com a letra pedida.",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Qual figura começa com P?",
              inicio: "P",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "pato",
                  nome: "Pato",
                  simbolo: "🦆"
                },
                {
                  id: "bola",
                  nome: "Bola",
                  simbolo: "⚽"
                },
                {
                  id: "banana",
                  nome: "Banana",
                  simbolo: "🍌"
                },
                {
                  id: "uva",
                  nome: "Uva",
                  simbolo: "🍇"
                }
              ],
              resposta: "pato",
              dica: "Fale devagar o nome de cada figura. Qual começa com o mesmo som de “papai”?"
            },
            {
              enunciado: "Qual figura começa com G?",
              inicio: "G",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "gato",
                  nome: "Gato",
                  simbolo: "🐈"
                },
                {
                  id: "casa",
                  nome: "Casa",
                  simbolo: "🏠"
                },
                {
                  id: "cama",
                  nome: "Cama",
                  simbolo: "🛏️"
                },
                {
                  id: "ovo",
                  nome: "Ovo",
                  simbolo: "🥚"
                }
              ],
              resposta: "gato",
              dica: "Fale devagar o nome de cada figura. Qual começa com o mesmo som de “gol”?"
            }
          ]
        }
      },
      {
        numero: 6,
        trilha: "medios",
        dificuldade: "simples",
        titulo: "Sons parecidos · 5 figuras",
        objetivo: "Escolha, entre 5 figuras, a que começa com a letra pedida. Cuidado com os sons parecidos.",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Qual figura começa com B?",
              inicio: "B",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "banana",
                  nome: "Banana",
                  simbolo: "🍌"
                },
                {
                  id: "pato",
                  nome: "Pato",
                  simbolo: "🦆"
                },
                {
                  id: "pera",
                  nome: "Pera",
                  simbolo: "🍐"
                },
                {
                  id: "uva",
                  nome: "Uva",
                  simbolo: "🍇"
                },
                {
                  id: "sol",
                  nome: "Sol",
                  simbolo: "☀️"
                }
              ],
              resposta: "banana",
              dica: "B e P soam parecidos. Fale devagar: qual figura começa com o som de “bebê”?"
            },
            {
              enunciado: "Qual figura começa com D?",
              inicio: "D",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "dado",
                  nome: "Dado",
                  simbolo: "🎲"
                },
                {
                  id: "trem",
                  nome: "Trem",
                  simbolo: "🚂"
                },
                {
                  id: "tigela",
                  nome: "Tigela",
                  simbolo: "🥣"
                },
                {
                  id: "ovo",
                  nome: "Ovo",
                  simbolo: "🥚"
                },
                {
                  id: "lua",
                  nome: "Lua",
                  simbolo: "🌙"
                }
              ],
              resposta: "dado",
              dica: "D e T soam parecidos. Fale devagar: qual figura começa com o som de “dedo”?"
            }
          ]
        }
      },
      {
        numero: 7,
        trilha: "medios",
        dificuldade: "simples",
        titulo: "Sons parecidos · 5 figuras",
        objetivo: "Escolha, entre 5 figuras, a que começa com a letra pedida. Cuidado com os sons parecidos.",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Qual figura começa com C?",
              inicio: "C",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "casa",
                  nome: "Casa",
                  simbolo: "🏠"
                },
                {
                  id: "gato",
                  nome: "Gato",
                  simbolo: "🐈"
                },
                {
                  id: "galinha",
                  nome: "Galinha",
                  simbolo: "🐔"
                },
                {
                  id: "gota",
                  nome: "Gota",
                  simbolo: "💧"
                },
                {
                  id: "uva",
                  nome: "Uva",
                  simbolo: "🍇"
                }
              ],
              resposta: "casa",
              dica: "C e G soam parecidos. Fale devagar: qual figura começa com o som de “copo”?"
            },
            {
              enunciado: "Qual figura começa com F?",
              inicio: "F",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "folha",
                  nome: "Folha",
                  simbolo: "🍃"
                },
                {
                  id: "vela",
                  nome: "Vela",
                  simbolo: "🕯️"
                },
                {
                  id: "vaso",
                  nome: "Vaso",
                  simbolo: "🪴"
                },
                {
                  id: "vento",
                  nome: "Vento",
                  simbolo: "🌬️"
                },
                {
                  id: "ovo",
                  nome: "Ovo",
                  simbolo: "🥚"
                }
              ],
              resposta: "folha",
              dica: "F e V soam parecidos. Fale devagar: qual figura começa com o som de “fada”?"
            }
          ]
        }
      },
      {
        numero: 8,
        trilha: "medios",
        dificuldade: "media",
        titulo: "Sons parecidos · 6 figuras",
        objetivo: "Escolha, entre 6 figuras, a que começa com a letra pedida. Cuidado com os sons parecidos.",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Qual figura começa com P?",
              inicio: "P",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "pera",
                  nome: "Pera",
                  simbolo: "🍐"
                },
                {
                  id: "bola",
                  nome: "Bola",
                  simbolo: "⚽"
                },
                {
                  id: "barco",
                  nome: "Barco",
                  simbolo: "⛵"
                },
                {
                  id: "bolo",
                  nome: "Bolo",
                  simbolo: "🎂"
                },
                {
                  id: "uva",
                  nome: "Uva",
                  simbolo: "🍇"
                },
                {
                  id: "sol",
                  nome: "Sol",
                  simbolo: "☀️"
                }
              ],
              resposta: "pera",
              dica: "P e B soam parecidos. Fale devagar: qual figura começa com o som de “papai”?"
            },
            {
              enunciado: "Qual figura começa com C?",
              inicio: "C",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "cama",
                  nome: "Cama",
                  simbolo: "🛏️"
                },
                {
                  id: "gato",
                  nome: "Gato",
                  simbolo: "🐈"
                },
                {
                  id: "galinha",
                  nome: "Galinha",
                  simbolo: "🐔"
                },
                {
                  id: "guarda-chuva",
                  nome: "Guarda-chuva",
                  simbolo: "☂️"
                },
                {
                  id: "ovo",
                  nome: "Ovo",
                  simbolo: "🥚"
                },
                {
                  id: "sol",
                  nome: "Sol",
                  simbolo: "☀️"
                }
              ],
              resposta: "cama",
              dica: "C e G soam parecidos. Fale devagar: qual figura começa com o som de “copo”?"
            }
          ]
        }
      },
      {
        numero: 9,
        trilha: "medios",
        dificuldade: "media",
        titulo: "Sons parecidos · 6 figuras",
        objetivo: "Escolha, entre 6 figuras, a que começa com a letra pedida. Cuidado com os sons parecidos.",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Qual figura começa com G?",
              inicio: "G",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "galinha",
                  nome: "Galinha",
                  simbolo: "🐔"
                },
                {
                  id: "casa",
                  nome: "Casa",
                  simbolo: "🏠"
                },
                {
                  id: "carro",
                  nome: "Carro",
                  simbolo: "🚗"
                },
                {
                  id: "coco",
                  nome: "Coco",
                  simbolo: "🥥"
                },
                {
                  id: "cadeira",
                  nome: "Cadeira",
                  simbolo: "🪑"
                },
                {
                  id: "uva",
                  nome: "Uva",
                  simbolo: "🍇"
                }
              ],
              resposta: "galinha",
              dica: "G e C soam parecidos. Fale devagar: qual figura começa com o som de “gol”?"
            },
            {
              enunciado: "Qual figura começa com V?",
              inicio: "V",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "vaso",
                  nome: "Vaso",
                  simbolo: "🪴"
                },
                {
                  id: "foguete",
                  nome: "Foguete",
                  simbolo: "🚀"
                },
                {
                  id: "flor",
                  nome: "Flor",
                  simbolo: "🌸"
                },
                {
                  id: "folha",
                  nome: "Folha",
                  simbolo: "🍃"
                },
                {
                  id: "fogo",
                  nome: "Fogo",
                  simbolo: "🔥"
                },
                {
                  id: "uva",
                  nome: "Uva",
                  simbolo: "🍇"
                }
              ],
              resposta: "vaso",
              dica: "V e F soam parecidos. Fale devagar: qual figura começa com o som de “vovó”?"
            }
          ]
        }
      },
      {
        numero: 10,
        trilha: "medios",
        dificuldade: "avancada",
        titulo: "Sons parecidos · 6 figuras",
        objetivo: "Escolha, entre 6 figuras, a que começa com a letra pedida. Cuidado com os sons parecidos.",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Qual figura começa com B?",
              inicio: "B",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "biscoito",
                  nome: "Biscoito",
                  simbolo: "🍪"
                },
                {
                  id: "pato",
                  nome: "Pato",
                  simbolo: "🦆"
                },
                {
                  id: "peixe",
                  nome: "Peixe",
                  simbolo: "🐟"
                },
                {
                  id: "pipa",
                  nome: "Pipa",
                  simbolo: "🪁"
                },
                {
                  id: "polvo",
                  nome: "Polvo",
                  simbolo: "🐙"
                },
                {
                  id: "porco",
                  nome: "Porco",
                  simbolo: "🐖"
                }
              ],
              resposta: "biscoito",
              dica: "B e P soam parecidos. Fale devagar: qual figura começa com o som de “bebê”?"
            },
            {
              enunciado: "Qual figura começa com P?",
              inicio: "P",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "pipa",
                  nome: "Pipa",
                  simbolo: "🪁"
                },
                {
                  id: "bola",
                  nome: "Bola",
                  simbolo: "⚽"
                },
                {
                  id: "barco",
                  nome: "Barco",
                  simbolo: "⛵"
                },
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
                  id: "balao",
                  nome: "Balão",
                  simbolo: "🎈"
                }
              ],
              resposta: "pipa",
              dica: "P e B soam parecidos. Fale devagar: qual figura começa com o som de “papai”?"
            }
          ]
        }
      },
      {
        numero: 11,
        trilha: "grandes",
        dificuldade: "simples",
        titulo: "Sílaba inicial · 7 figuras",
        objetivo: "Escolha, entre 7 figuras que começam com a mesma letra, a que começa com a sílaba pedida.",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Qual figura começa com PO?",
              inicio: "PO",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "polvo",
                  nome: "Polvo",
                  simbolo: "🐙"
                },
                {
                  id: "pera",
                  nome: "Pera",
                  simbolo: "🍐"
                },
                {
                  id: "pipa",
                  nome: "Pipa",
                  simbolo: "🪁"
                },
                {
                  id: "pao",
                  nome: "Pão",
                  simbolo: "🍞"
                },
                {
                  id: "prato",
                  nome: "Prato",
                  simbolo: "🍽️"
                },
                {
                  id: "patinete",
                  nome: "Patinete",
                  simbolo: "🛴"
                },
                {
                  id: "pessego",
                  nome: "Pêssego",
                  simbolo: "🍑"
                }
              ],
              resposta: "polvo",
              dica: "Fale o nome de cada figura bem devagar, em pedaços. Qual começa com “po”, como em “pote”?"
            },
            {
              enunciado: "Qual figura começa com CO?",
              inicio: "CO",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "coco",
                  nome: "Coco",
                  simbolo: "🥥"
                },
                {
                  id: "casa",
                  nome: "Casa",
                  simbolo: "🏠"
                },
                {
                  id: "cama",
                  nome: "Cama",
                  simbolo: "🛏️"
                },
                {
                  id: "carro",
                  nome: "Carro",
                  simbolo: "🚗"
                },
                {
                  id: "cadeira",
                  nome: "Cadeira",
                  simbolo: "🪑"
                },
                {
                  id: "cacto",
                  nome: "Cacto",
                  simbolo: "🌵"
                },
                {
                  id: "cesto",
                  nome: "Cesto",
                  simbolo: "🧺"
                }
              ],
              resposta: "coco",
              dica: "Fale o nome de cada figura bem devagar, em pedaços. Qual começa com “co”, como em “copo”?"
            }
          ]
        }
      },
      {
        numero: 12,
        trilha: "grandes",
        dificuldade: "simples",
        titulo: "Sílaba inicial · 7 figuras",
        objetivo: "Escolha, entre 7 figuras que começam com a mesma letra, a que começa com a sílaba pedida.",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Qual figura começa com BI?",
              inicio: "BI",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "bicicleta",
                  nome: "Bicicleta",
                  simbolo: "🚲"
                },
                {
                  id: "banana",
                  nome: "Banana",
                  simbolo: "🍌"
                },
                {
                  id: "barco",
                  nome: "Barco",
                  simbolo: "⛵"
                },
                {
                  id: "bola",
                  nome: "Bola",
                  simbolo: "⚽"
                },
                {
                  id: "bolo",
                  nome: "Bolo",
                  simbolo: "🎂"
                },
                {
                  id: "balao",
                  nome: "Balão",
                  simbolo: "🎈"
                },
                {
                  id: "bone",
                  nome: "Boné",
                  simbolo: "🧢"
                }
              ],
              resposta: "bicicleta",
              dica: "Fale o nome de cada figura bem devagar, em pedaços. Qual começa com “bi”, como em “bico”?"
            },
            {
              enunciado: "Qual figura começa com ME?",
              inicio: "ME",
              ocultarNomes: true,
              opcoes: [
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
                  id: "macaco",
                  nome: "Macaco",
                  simbolo: "🐒"
                },
                {
                  id: "manga",
                  nome: "Manga",
                  simbolo: "🥭"
                },
                {
                  id: "milho",
                  nome: "Milho",
                  simbolo: "🌽"
                },
                {
                  id: "mochila",
                  nome: "Mochila",
                  simbolo: "🎒"
                },
                {
                  id: "moto",
                  nome: "Moto",
                  simbolo: "🛵"
                }
              ],
              resposta: "melancia",
              dica: "Fale o nome de cada figura bem devagar, em pedaços. Qual começa com “me”, como em “menino”?"
            }
          ]
        }
      },
      {
        numero: 13,
        trilha: "grandes",
        dificuldade: "media",
        titulo: "Sílaba inicial · 8 figuras",
        objetivo: "Escolha, entre 8 figuras que começam com a mesma letra, a que começa com a sílaba pedida.",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Qual figura começa com PE?",
              inicio: "PE",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "peixe",
                  nome: "Peixe",
                  simbolo: "🐟"
                },
                {
                  id: "pato",
                  nome: "Pato",
                  simbolo: "🦆"
                },
                {
                  id: "pao",
                  nome: "Pão",
                  simbolo: "🍞"
                },
                {
                  id: "pipa",
                  nome: "Pipa",
                  simbolo: "🪁"
                },
                {
                  id: "pinguim",
                  nome: "Pinguim",
                  simbolo: "🐧"
                },
                {
                  id: "polvo",
                  nome: "Polvo",
                  simbolo: "🐙"
                },
                {
                  id: "porco",
                  nome: "Porco",
                  simbolo: "🐖"
                },
                {
                  id: "prato",
                  nome: "Prato",
                  simbolo: "🍽️"
                }
              ],
              resposta: "peixe",
              dica: "Fale o nome de cada figura bem devagar, em pedaços. Qual começa com “pe”, como em “pena”?"
            },
            {
              enunciado: "Qual figura começa com CA?",
              inicio: "CA",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "caracol",
                  nome: "Caracol",
                  simbolo: "🐌"
                },
                {
                  id: "coco",
                  nome: "Coco",
                  simbolo: "🥥"
                },
                {
                  id: "coelho",
                  nome: "Coelho",
                  simbolo: "🐇"
                },
                {
                  id: "cogumelo",
                  nome: "Cogumelo",
                  simbolo: "🍄"
                },
                {
                  id: "cometa",
                  nome: "Cometa",
                  simbolo: "☄️"
                },
                {
                  id: "correio",
                  nome: "Correio",
                  simbolo: "📮"
                },
                {
                  id: "cereja",
                  nome: "Cereja",
                  simbolo: "🍒"
                },
                {
                  id: "cenoura",
                  nome: "Cenoura",
                  simbolo: "🥕"
                }
              ],
              resposta: "caracol",
              dica: "Fale o nome de cada figura bem devagar, em pedaços. Qual começa com “ca”, como em “caneca”?"
            }
          ]
        }
      },
      {
        numero: 14,
        trilha: "grandes",
        dificuldade: "media",
        titulo: "Sílaba inicial · 8 figuras",
        objetivo: "Escolha, entre 8 figuras que começam com a mesma letra, a que começa com a sílaba pedida.",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Qual figura começa com MO?",
              inicio: "MO",
              ocultarNomes: true,
              opcoes: [
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
                  id: "macaco",
                  nome: "Macaco",
                  simbolo: "🐒"
                },
                {
                  id: "manga",
                  nome: "Manga",
                  simbolo: "🥭"
                },
                {
                  id: "milho",
                  nome: "Milho",
                  simbolo: "🌽"
                },
                {
                  id: "mel",
                  nome: "Mel",
                  simbolo: "🍯"
                },
                {
                  id: "melancia",
                  nome: "Melancia",
                  simbolo: "🍉"
                },
                {
                  id: "meia",
                  nome: "Meia",
                  simbolo: "🧦"
                }
              ],
              resposta: "morango",
              dica: "Fale o nome de cada figura bem devagar, em pedaços. Qual começa com “mo”, como em “mola”?"
            },
            {
              enunciado: "Qual figura começa com PI?",
              inicio: "PI",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "pinguim",
                  nome: "Pinguim",
                  simbolo: "🐧"
                },
                {
                  id: "pato",
                  nome: "Pato",
                  simbolo: "🦆"
                },
                {
                  id: "passaro",
                  nome: "Pássaro",
                  simbolo: "🐦"
                },
                {
                  id: "peixe",
                  nome: "Peixe",
                  simbolo: "🐟"
                },
                {
                  id: "polvo",
                  nome: "Polvo",
                  simbolo: "🐙"
                },
                {
                  id: "porco",
                  nome: "Porco",
                  simbolo: "🐖"
                },
                {
                  id: "pera",
                  nome: "Pera",
                  simbolo: "🍐"
                },
                {
                  id: "porta",
                  nome: "Porta",
                  simbolo: "🚪"
                }
              ],
              resposta: "pinguim",
              dica: "Fale o nome de cada figura bem devagar, em pedaços. Qual começa com “pi”, como em “pilha”?"
            }
          ]
        }
      },
      {
        numero: 15,
        trilha: "grandes",
        dificuldade: "avancada",
        titulo: "Sílaba inicial · 8 figuras",
        objetivo: "Escolha, entre 8 figuras que começam com a mesma letra, a que começa com a sílaba pedida.",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Qual figura começa com PO?",
              inicio: "PO",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "porco",
                  nome: "Porco",
                  simbolo: "🐖"
                },
                {
                  id: "pato",
                  nome: "Pato",
                  simbolo: "🦆"
                },
                {
                  id: "passaro",
                  nome: "Pássaro",
                  simbolo: "🐦"
                },
                {
                  id: "peixe",
                  nome: "Peixe",
                  simbolo: "🐟"
                },
                {
                  id: "pinguim",
                  nome: "Pinguim",
                  simbolo: "🐧"
                },
                {
                  id: "pintinho",
                  nome: "Pintinho",
                  simbolo: "🐣"
                },
                {
                  id: "pera",
                  nome: "Pera",
                  simbolo: "🍐"
                },
                {
                  id: "pipa",
                  nome: "Pipa",
                  simbolo: "🪁"
                }
              ],
              resposta: "porco",
              dica: "Fale o nome de cada figura bem devagar, em pedaços. Qual começa com “po”, como em “pote”?"
            },
            {
              enunciado: "Qual figura começa com PA?",
              inicio: "PA",
              ocultarNomes: true,
              opcoes: [
                {
                  id: "pato",
                  nome: "Pato",
                  simbolo: "🦆"
                },
                {
                  id: "pera",
                  nome: "Pera",
                  simbolo: "🍐"
                },
                {
                  id: "peixe",
                  nome: "Peixe",
                  simbolo: "🐟"
                },
                {
                  id: "pinguim",
                  nome: "Pinguim",
                  simbolo: "🐧"
                },
                {
                  id: "pintinho",
                  nome: "Pintinho",
                  simbolo: "🐣"
                },
                {
                  id: "polvo",
                  nome: "Polvo",
                  simbolo: "🐙"
                },
                {
                  id: "porco",
                  nome: "Porco",
                  simbolo: "🐖"
                },
                {
                  id: "pessego",
                  nome: "Pêssego",
                  simbolo: "🍑"
                }
              ],
              resposta: "pato",
              dica: "Fale o nome de cada figura bem devagar, em pedaços. Qual começa com “pa”, como em “panela”?"
            }
          ]
        }
      }
    ]
  },
  {
    id: "adivinha-pista",
    nome: "Adivinha pela pista",
    descricao: "Leia a pista e descubra qual figura ela descreve.",
    categoria: "linguagem",
    instrucoes: "Leia a pista em voz alta com a criança e toque na figura que ela descreve. O nome aparece depois do acerto.",
    tipoMecanica: "escolha",
    versao: 1,
    faixaEtariaMin: 5,
    faixaEtariaMax: 12,
    ordemEditorial: 16,
    fases: [
      {
        numero: 1,
        trilha: "pequenos",
        dificuldade: "simples",
        titulo: "Pista · 2 figuras",
        objetivo: "Leia a pista e escolha a figura certa entre 2.",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Moro no mar e tenho oito braços. Quem sou eu?",
              pista: true,
              ocultarNomes: true,
              opcoes: [
                {
                  id: "polvo",
                  nome: "Polvo",
                  simbolo: "🐙"
                },
                {
                  id: "carro",
                  nome: "Carro",
                  simbolo: "🚗"
                }
              ],
              resposta: "polvo",
              dica: "Conte os braços."
            },
            {
              enunciado: "Voo de flor em flor e faço mel. Quem sou eu?",
              pista: true,
              ocultarNomes: true,
              opcoes: [
                {
                  id: "abelha",
                  nome: "Abelha",
                  simbolo: "🐝"
                },
                {
                  id: "bola",
                  nome: "Bola",
                  simbolo: "⚽"
                }
              ],
              resposta: "abelha",
              dica: "Quem consegue voar?"
            }
          ]
        }
      },
      {
        numero: 2,
        trilha: "pequenos",
        dificuldade: "simples",
        titulo: "Pista · 3 figuras",
        objetivo: "Leia a pista e escolha a figura certa entre 3.",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Sou enorme, cinza e tenho uma tromba comprida. Quem sou eu?",
              pista: true,
              ocultarNomes: true,
              opcoes: [
                {
                  id: "elefante",
                  nome: "Elefante",
                  simbolo: "🐘"
                },
                {
                  id: "bicicleta",
                  nome: "Bicicleta",
                  simbolo: "🚲"
                },
                {
                  id: "uva",
                  nome: "Uva",
                  simbolo: "🍇"
                }
              ],
              resposta: "elefante",
              dica: "Procure o bicho grandão."
            },
            {
              enunciado: "Brilho no céu durante o dia e esquento tudo. Quem sou eu?",
              pista: true,
              ocultarNomes: true,
              opcoes: [
                {
                  id: "sol",
                  nome: "Sol",
                  simbolo: "☀️"
                },
                {
                  id: "peixe",
                  nome: "Peixe",
                  simbolo: "🐟"
                },
                {
                  id: "bolo",
                  nome: "Bolo",
                  simbolo: "🎂"
                }
              ],
              resposta: "sol",
              dica: "Olhe para cima num dia bonito."
            }
          ]
        }
      },
      {
        numero: 3,
        trilha: "pequenos",
        dificuldade: "media",
        titulo: "Pista · 3 figuras",
        objetivo: "Leia a pista e escolha a figura certa entre 3.",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Tenho bigodes, faço miau e adoro dormir. Quem sou eu?",
              pista: true,
              ocultarNomes: true,
              opcoes: [
                {
                  id: "gato",
                  nome: "Gato",
                  simbolo: "🐈"
                },
                {
                  id: "pato",
                  nome: "Pato",
                  simbolo: "🦆"
                },
                {
                  id: "trem",
                  nome: "Trem",
                  simbolo: "🚂"
                }
              ],
              resposta: "gato",
              dica: "Que bicho faz esse som?"
            },
            {
              enunciado: "Sou amarela, comprida e o macaco adora me comer. Quem sou eu?",
              pista: true,
              ocultarNomes: true,
              opcoes: [
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
                  id: "carro",
                  nome: "Carro",
                  simbolo: "🚗"
                }
              ],
              resposta: "banana",
              dica: "Pense numa fruta comprida."
            }
          ]
        }
      },
      {
        numero: 4,
        trilha: "pequenos",
        dificuldade: "media",
        titulo: "Pista · 4 figuras",
        objetivo: "Leia a pista e escolha a figura certa entre 4.",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Apareço no céu à noite e às vezes fico redonda como uma bola. Quem sou eu?",
              pista: true,
              ocultarNomes: true,
              opcoes: [
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
                  id: "bola",
                  nome: "Bola",
                  simbolo: "⚽"
                },
                {
                  id: "peixe",
                  nome: "Peixe",
                  simbolo: "🐟"
                }
              ],
              resposta: "lua",
              dica: "A estrela também aparece à noite. Qual fica redonda?"
            },
            {
              enunciado: "Sou laranja, cresço embaixo da terra e o coelho adora me roer. Quem sou eu?",
              pista: true,
              ocultarNomes: true,
              opcoes: [
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
                  id: "carro",
                  nome: "Carro",
                  simbolo: "🚗"
                },
                {
                  id: "gato",
                  nome: "Gato",
                  simbolo: "🐈"
                }
              ],
              resposta: "cenoura",
              dica: "Pense na cor laranja."
            }
          ]
        }
      },
      {
        numero: 5,
        trilha: "pequenos",
        dificuldade: "avancada",
        titulo: "Pista · 4 figuras",
        objetivo: "Leia a pista e escolha a figura certa entre 4.",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Ando sobre trilhos e puxo muitos vagões. Quem sou eu?",
              pista: true,
              ocultarNomes: true,
              opcoes: [
                {
                  id: "trem",
                  nome: "Trem",
                  simbolo: "🚂"
                },
                {
                  id: "carro",
                  nome: "Carro",
                  simbolo: "🚗"
                },
                {
                  id: "barco",
                  nome: "Barco",
                  simbolo: "⛵"
                },
                {
                  id: "uva",
                  nome: "Uva",
                  simbolo: "🍇"
                }
              ],
              resposta: "trem",
              dica: "Pense no caminho por onde ele anda."
            },
            {
              enunciado: "Sou uma ave que não voa, nado muito bem e moro no gelo. Quem sou eu?",
              pista: true,
              ocultarNomes: true,
              opcoes: [
                {
                  id: "pinguim",
                  nome: "Pinguim",
                  simbolo: "🐧"
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
                  id: "bola",
                  nome: "Bola",
                  simbolo: "⚽"
                }
              ],
              resposta: "pinguim",
              dica: "Pense num lugar muito frio."
            }
          ]
        }
      },
      {
        numero: 6,
        trilha: "medios",
        dificuldade: "simples",
        titulo: "Pista · 5 figuras",
        objetivo: "Leia a pista e escolha a figura certa entre 5.",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Sou uma fruta pequena e vermelha, com um caroço dentro. Quem sou eu?",
              pista: true,
              ocultarNomes: true,
              opcoes: [
                {
                  id: "cereja",
                  nome: "Cereja",
                  simbolo: "🍒"
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
                  id: "carro",
                  nome: "Carro",
                  simbolo: "🚗"
                },
                {
                  id: "sol",
                  nome: "Sol",
                  simbolo: "☀️"
                }
              ],
              resposta: "cereja",
              dica: "Qual destas frutas é vermelha?"
            },
            {
              enunciado: "Moro na água, tenho escamas e nadadeiras. Quem sou eu?",
              pista: true,
              ocultarNomes: true,
              opcoes: [
                {
                  id: "peixe",
                  nome: "Peixe",
                  simbolo: "🐟"
                },
                {
                  id: "polvo",
                  nome: "Polvo",
                  simbolo: "🐙"
                },
                {
                  id: "baleia",
                  nome: "Baleia",
                  simbolo: "🐳"
                },
                {
                  id: "bola",
                  nome: "Bola",
                  simbolo: "⚽"
                },
                {
                  id: "trem",
                  nome: "Trem",
                  simbolo: "🚂"
                }
              ],
              resposta: "peixe",
              dica: "Repare em quem tem escamas."
            }
          ]
        }
      },
      {
        numero: 7,
        trilha: "medios",
        dificuldade: "simples",
        titulo: "Pista · 5 figuras",
        objetivo: "Leia a pista e escolha a figura certa entre 5.",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Sou vermelho, tenho sementinhas por fora e uma folhinha verde em cima. Quem sou eu?",
              pista: true,
              ocultarNomes: true,
              opcoes: [
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
                  id: "sapato",
                  nome: "Sapato",
                  simbolo: "👟"
                }
              ],
              resposta: "morango",
              dica: "A maçã também é vermelha. Onde ficam as sementes?"
            },
            {
              enunciado: "Tenho orelhas compridas, pulo muito e adoro cenoura. Quem sou eu?",
              pista: true,
              ocultarNomes: true,
              opcoes: [
                {
                  id: "coelho",
                  nome: "Coelho",
                  simbolo: "🐇"
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
                },
                {
                  id: "sapo",
                  nome: "Sapo",
                  simbolo: "🐸"
                },
                {
                  id: "bola",
                  nome: "Bola",
                  simbolo: "⚽"
                }
              ],
              resposta: "coelho",
              dica: "O sapo também pula. Repare nas orelhas."
            }
          ]
        }
      },
      {
        numero: 8,
        trilha: "medios",
        dificuldade: "media",
        titulo: "Pista · 6 figuras",
        objetivo: "Leia a pista e escolha a figura certa entre 6.",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Ando bem devagar e carrego minha casa nas costas. Quem sou eu?",
              pista: true,
              ocultarNomes: true,
              opcoes: [
                {
                  id: "caracol",
                  nome: "Caracol",
                  simbolo: "🐌"
                },
                {
                  id: "caranguejo",
                  nome: "Caranguejo",
                  simbolo: "🦀"
                },
                {
                  id: "sapo",
                  nome: "Sapo",
                  simbolo: "🐸"
                },
                {
                  id: "pato",
                  nome: "Pato",
                  simbolo: "🦆"
                },
                {
                  id: "bolo",
                  nome: "Bolo",
                  simbolo: "🎂"
                },
                {
                  id: "lua",
                  nome: "Lua",
                  simbolo: "🌙"
                }
              ],
              resposta: "caracol",
              dica: "Quem é o mais lento de todos?"
            },
            {
              enunciado: "Tenho casca grossa cheia de escamas e uma coroa de folhas na cabeça. Quem sou eu?",
              pista: true,
              ocultarNomes: true,
              opcoes: [
                {
                  id: "abacaxi",
                  nome: "Abacaxi",
                  simbolo: "🍍"
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
                  id: "laranja",
                  nome: "Laranja",
                  simbolo: "🍊"
                },
                {
                  id: "carro",
                  nome: "Carro",
                  simbolo: "🚗"
                },
                {
                  id: "sol",
                  nome: "Sol",
                  simbolo: "☀️"
                }
              ],
              resposta: "abacaxi",
              dica: "O coco também tem casca grossa. Qual tem coroa?"
            }
          ]
        }
      },
      {
        numero: 9,
        trilha: "medios",
        dificuldade: "media",
        titulo: "Pista · 6 figuras",
        objetivo: "Leia a pista e escolha a figura certa entre 6.",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Tenho grãos amarelos presos numa espiga e viro pipoca. Quem sou eu?",
              pista: true,
              ocultarNomes: true,
              opcoes: [
                {
                  id: "milho",
                  nome: "Milho",
                  simbolo: "🌽"
                },
                {
                  id: "batata",
                  nome: "Batata",
                  simbolo: "🥔"
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
                  id: "pao",
                  nome: "Pão",
                  simbolo: "🍞"
                },
                {
                  id: "sol",
                  nome: "Sol",
                  simbolo: "☀️"
                }
              ],
              resposta: "milho",
              dica: "Qual destes vira pipoca na panela?"
            },
            {
              enunciado: "Sou uma ave da fazenda, cisco o chão e choco meus ovos. Quem sou eu?",
              pista: true,
              ocultarNomes: true,
              opcoes: [
                {
                  id: "galinha",
                  nome: "Galinha",
                  simbolo: "🐔"
                },
                {
                  id: "pato",
                  nome: "Pato",
                  simbolo: "🦆"
                },
                {
                  id: "pinguim",
                  nome: "Pinguim",
                  simbolo: "🐧"
                },
                {
                  id: "passaro",
                  nome: "Pássaro",
                  simbolo: "🐦"
                },
                {
                  id: "porco",
                  nome: "Porco",
                  simbolo: "🐖"
                },
                {
                  id: "carro",
                  nome: "Carro",
                  simbolo: "🚗"
                }
              ],
              resposta: "galinha",
              dica: "O pato também é ave. Qual cisca o chão da fazenda?"
            }
          ]
        }
      },
      {
        numero: 10,
        trilha: "medios",
        dificuldade: "avancada",
        titulo: "Pista · 6 figuras",
        objetivo: "Leia a pista e escolha a figura certa entre 6.",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Tenho duas rodas e ando quando você pedala. Quem sou eu?",
              pista: true,
              ocultarNomes: true,
              opcoes: [
                {
                  id: "bicicleta",
                  nome: "Bicicleta",
                  simbolo: "🚲"
                },
                {
                  id: "moto",
                  nome: "Moto",
                  simbolo: "🛵"
                },
                {
                  id: "patinete",
                  nome: "Patinete",
                  simbolo: "🛴"
                },
                {
                  id: "carro",
                  nome: "Carro",
                  simbolo: "🚗"
                },
                {
                  id: "onibus",
                  nome: "Ônibus",
                  simbolo: "🚌"
                },
                {
                  id: "trem",
                  nome: "Trem",
                  simbolo: "🚂"
                }
              ],
              resposta: "bicicleta",
              dica: "A moto e o patinete também têm duas rodas. Qual tem pedal?"
            },
            {
              enunciado: "Sou uma fruta amarela, pequena e muito azeda. Quem sou eu?",
              pista: true,
              ocultarNomes: true,
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
                  id: "uva",
                  nome: "Uva",
                  simbolo: "🍇"
                },
                {
                  id: "laranja",
                  nome: "Laranja",
                  simbolo: "🍊"
                }
              ],
              resposta: "limao",
              dica: "A laranja também tem gomos, mas é doce. Qual é azeda?"
            }
          ]
        }
      },
      {
        numero: 11,
        trilha: "grandes",
        dificuldade: "simples",
        titulo: "Pista · 7 figuras",
        objetivo: "Leia a pista inteira: todas as 7 figuras são do mesmo tipo.",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Sou redonda, tenho gomos e meu suco é doce. Quem sou eu?",
              pista: true,
              ocultarNomes: true,
              opcoes: [
                {
                  id: "laranja",
                  nome: "Laranja",
                  simbolo: "🍊"
                },
                {
                  id: "limao",
                  nome: "Limão",
                  simbolo: "🍋"
                },
                {
                  id: "maca",
                  nome: "Maçã",
                  simbolo: "🍎"
                },
                {
                  id: "melancia",
                  nome: "Melancia",
                  simbolo: "🍉"
                },
                {
                  id: "pessego",
                  nome: "Pêssego",
                  simbolo: "🍑"
                },
                {
                  id: "uva",
                  nome: "Uva",
                  simbolo: "🍇"
                },
                {
                  id: "kiwi",
                  nome: "Kiwi",
                  simbolo: "🥝"
                }
              ],
              resposta: "laranja",
              dica: "O limão também tem gomos, mas é azedo. Qual é doce?"
            },
            {
              enunciado: "Sou uma ave, sei nadar e também consigo voar. Quem sou eu?",
              pista: true,
              ocultarNomes: true,
              opcoes: [
                {
                  id: "pato",
                  nome: "Pato",
                  simbolo: "🦆"
                },
                {
                  id: "pinguim",
                  nome: "Pinguim",
                  simbolo: "🐧"
                },
                {
                  id: "passaro",
                  nome: "Pássaro",
                  simbolo: "🐦"
                },
                {
                  id: "galinha",
                  nome: "Galinha",
                  simbolo: "🐔"
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
                }
              ],
              resposta: "pato",
              dica: "O pinguim nada mas não voa; o pássaro voa mas não nada."
            }
          ]
        }
      },
      {
        numero: 12,
        trilha: "grandes",
        dificuldade: "simples",
        titulo: "Pista · 8 figuras",
        objetivo: "Leia a pista inteira: todas as 8 figuras são do mesmo tipo.",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Ando na rua, tenho rodas e levo muitas pessoas de uma vez. Quem sou eu?",
              pista: true,
              ocultarNomes: true,
              opcoes: [
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
                  id: "moto",
                  nome: "Moto",
                  simbolo: "🛵"
                },
                {
                  id: "bicicleta",
                  nome: "Bicicleta",
                  simbolo: "🚲"
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
                  id: "barco",
                  nome: "Barco",
                  simbolo: "⛵"
                },
                {
                  id: "patinete",
                  nome: "Patinete",
                  simbolo: "🛴"
                }
              ],
              resposta: "onibus",
              dica: "O trem e o avião também levam muita gente. Qual anda na rua?"
            },
            {
              enunciado: "Sou feito de farinha, vou ao forno, sou salgadinho e apareço no café da manhã. Quem sou eu?",
              pista: true,
              ocultarNomes: true,
              opcoes: [
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
                  id: "cenoura",
                  nome: "Cenoura",
                  simbolo: "🥕"
                }
              ],
              resposta: "pao",
              dica: "O bolo e o biscoito também vão ao forno, mas são doces."
            }
          ]
        }
      },
      {
        numero: 13,
        trilha: "grandes",
        dificuldade: "media",
        titulo: "Pista · 9 figuras",
        objetivo: "Leia a pista inteira: todas as 9 figuras são do mesmo tipo.",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Sou grande, verde por fora, vermelha por dentro e cheia de sementes pretas. Quem sou eu?",
              pista: true,
              ocultarNomes: true,
              opcoes: [
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
                  id: "coco",
                  nome: "Coco",
                  simbolo: "🥥"
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
                  id: "manga",
                  nome: "Manga",
                  simbolo: "🥭"
                },
                {
                  id: "uva",
                  nome: "Uva",
                  simbolo: "🍇"
                }
              ],
              resposta: "melancia",
              dica: "O kiwi também tem sementinhas pretas, mas é pequeno."
            },
            {
              enunciado: "Tenho pelos e um rabo comprido, subo em árvores e pego a comida com as mãos. Quem sou eu?",
              pista: true,
              ocultarNomes: true,
              opcoes: [
                {
                  id: "macaco",
                  nome: "Macaco",
                  simbolo: "🐒"
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
                },
                {
                  id: "leao",
                  nome: "Leão",
                  simbolo: "🦁"
                },
                {
                  id: "coelho",
                  nome: "Coelho",
                  simbolo: "🐇"
                },
                {
                  id: "passaro",
                  nome: "Pássaro",
                  simbolo: "🐦"
                },
                {
                  id: "ovelha",
                  nome: "Ovelha",
                  simbolo: "🐑"
                },
                {
                  id: "porco",
                  nome: "Porco",
                  simbolo: "🐖"
                },
                {
                  id: "elefante",
                  nome: "Elefante",
                  simbolo: "🐘"
                }
              ],
              resposta: "macaco",
              dica: "O gato também sobe em árvores. Quem pega a comida com as mãos?"
            }
          ]
        }
      },
      {
        numero: 14,
        trilha: "grandes",
        dificuldade: "media",
        titulo: "Pista · 10 figuras",
        objetivo: "Leia a pista inteira: todas as 10 figuras são do mesmo tipo.",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Sou redondo, tenho a casca peludinha e um caroço grande no meio. Quem sou eu?",
              pista: true,
              ocultarNomes: true,
              opcoes: [
                {
                  id: "pessego",
                  nome: "Pêssego",
                  simbolo: "🍑"
                },
                {
                  id: "kiwi",
                  nome: "Kiwi",
                  simbolo: "🥝"
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
                  id: "cereja",
                  nome: "Cereja",
                  simbolo: "🍒"
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
                },
                {
                  id: "limao",
                  nome: "Limão",
                  simbolo: "🍋"
                },
                {
                  id: "uva",
                  nome: "Uva",
                  simbolo: "🍇"
                },
                {
                  id: "pera",
                  nome: "Pera",
                  simbolo: "🍐"
                }
              ],
              resposta: "pessego",
              dica: "O kiwi também tem casca peluda, mas não tem caroço."
            },
            {
              enunciado: "Sou pequeno, tenho bigodes e um rabo fininho e comprido, e me escondo em buraquinhos. Quem sou eu?",
              pista: true,
              ocultarNomes: true,
              opcoes: [
                {
                  id: "rato",
                  nome: "Rato",
                  simbolo: "🐭"
                },
                {
                  id: "gato",
                  nome: "Gato",
                  simbolo: "🐈"
                },
                {
                  id: "coelho",
                  nome: "Coelho",
                  simbolo: "🐇"
                },
                {
                  id: "macaco",
                  nome: "Macaco",
                  simbolo: "🐒"
                },
                {
                  id: "leao",
                  nome: "Leão",
                  simbolo: "🦁"
                },
                {
                  id: "porco",
                  nome: "Porco",
                  simbolo: "🐖"
                },
                {
                  id: "ovelha",
                  nome: "Ovelha",
                  simbolo: "🐑"
                },
                {
                  id: "pintinho",
                  nome: "Pintinho",
                  simbolo: "🐣"
                },
                {
                  id: "passaro",
                  nome: "Pássaro",
                  simbolo: "🐦"
                },
                {
                  id: "caracol",
                  nome: "Caracol",
                  simbolo: "🐌"
                }
              ],
              resposta: "rato",
              dica: "O gato também tem bigodes, mas é maior. Quem se esconde em buraquinhos?"
            }
          ]
        }
      },
      {
        numero: 15,
        trilha: "grandes",
        dificuldade: "avancada",
        titulo: "Pista · 11 figuras",
        objetivo: "Leia a pista inteira: todas as 11 figuras são do mesmo tipo.",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Sou doce, tenho a polpa amarela, um caroço grande no meio e a casca lisinha. Quem sou eu?",
              pista: true,
              ocultarNomes: true,
              opcoes: [
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
                  id: "cereja",
                  nome: "Cereja",
                  simbolo: "🍒"
                },
                {
                  id: "banana",
                  nome: "Banana",
                  simbolo: "🍌"
                },
                {
                  id: "abacaxi",
                  nome: "Abacaxi",
                  simbolo: "🍍"
                },
                {
                  id: "pera",
                  nome: "Pera",
                  simbolo: "🍐"
                },
                {
                  id: "limao",
                  nome: "Limão",
                  simbolo: "🍋"
                },
                {
                  id: "melancia",
                  nome: "Melancia",
                  simbolo: "🍉"
                },
                {
                  id: "kiwi",
                  nome: "Kiwi",
                  simbolo: "🥝"
                },
                {
                  id: "laranja",
                  nome: "Laranja",
                  simbolo: "🍊"
                },
                {
                  id: "maca",
                  nome: "Maçã",
                  simbolo: "🍎"
                }
              ],
              resposta: "manga",
              dica: "O pêssego também tem caroço, mas a casca é peludinha."
            },
            {
              enunciado: "Tenho penas, sei voar, pouso nos galhos e canto bonito de manhã. Quem sou eu?",
              pista: true,
              ocultarNomes: true,
              opcoes: [
                {
                  id: "passaro",
                  nome: "Pássaro",
                  simbolo: "🐦"
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
                  id: "pinguim",
                  nome: "Pinguim",
                  simbolo: "🐧"
                },
                {
                  id: "pintinho",
                  nome: "Pintinho",
                  simbolo: "🐣"
                },
                {
                  id: "abelha",
                  nome: "Abelha",
                  simbolo: "🐝"
                },
                {
                  id: "macaco",
                  nome: "Macaco",
                  simbolo: "🐒"
                },
                {
                  id: "gato",
                  nome: "Gato",
                  simbolo: "🐈"
                },
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
                  id: "coelho",
                  nome: "Coelho",
                  simbolo: "🐇"
                }
              ],
              resposta: "passaro",
              dica: "O pato também voa e tem penas. Quem pousa nos galhos e canta?"
            }
          ]
        }
      }
    ]
  }
];
