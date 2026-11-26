/**
 * Histórias em cenas (ordenação), IDs estáveis.
 * DEV-CAT-M1, ticket 09: 15 fases em três trilhas (pequenos 1–5, médios 6–10, grandes 11–15),
 * duas variantes por fase, aprovadas pela régua (npm run regua:jogos -w @pef/api -- --estrito).
 * Conteúdo gerado e congelado; revisão humana na homologação.
 */
/* v3 (ticket 13): três degraus — com nome, só figura e com cena intrusa. */
export const CATALOGO_JOGOS_HISTORIAS_E5 = [
  {
    id: "historias-cenas",
    nome: "Histórias em cenas",
    descricao: "Ordene as cenas para contar a história na ordem certa.",
    categoria: "linguagem",
    instrucoes: "Toque nas cenas na ordem da história. Use Desfazer se precisar corrigir. No teclado: setas para escolher, Enter para colocar e Backspace para desfazer.",
    tipoMecanica: "ordenacao",
    versao: 3,
    faixaEtariaMin: 5,
    faixaEtariaMax: 8,
    ordemEditorial: 7,
    fases: [
      {
        numero: 1,
        trilha: "pequenos",
        titulo: "2 cenas",
        objetivo: "Ordene as 2 cenas do começo ao fim.",
        dificuldade: "simples",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Conte como nasce a flor.",
              cenas: [
                {
                  id: "plantar-a-semente",
                  nome: "Plantar a semente",
                  simbolo: "🌱"
                },
                {
                  id: "flor-aberta",
                  nome: "Flor aberta",
                  simbolo: "🌸"
                }
              ]
            },
            {
              enunciado: "O que vem antes da chuva?",
              cenas: [
                {
                  id: "nuvem-escura",
                  nome: "Nuvem escura",
                  simbolo: "☁️"
                },
                {
                  id: "chuva-caindo",
                  nome: "Chuva caindo",
                  simbolo: "🌧️"
                }
              ]
            }
          ]
        }
      },
      {
        numero: 2,
        trilha: "pequenos",
        titulo: "3 cenas",
        objetivo: "Ordene as 3 cenas do começo ao fim.",
        dificuldade: "simples",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Conte a história do pintinho.",
              cenas: [
                {
                  id: "ovo-no-ninho",
                  nome: "Ovo no ninho",
                  simbolo: "🥚"
                },
                {
                  id: "pintinho-nasce",
                  nome: "Pintinho nasce",
                  simbolo: "🐣"
                },
                {
                  id: "galinha-crescida",
                  nome: "Galinha crescida",
                  simbolo: "🐔"
                }
              ],
              dica: "O pintinho sai do ovo."
            },
            {
              enunciado: "Monte o lanche.",
              cenas: [
                {
                  id: "pegar-o-pao",
                  nome: "Pegar o pão",
                  simbolo: "🍞"
                },
                {
                  id: "por-o-queijo-no-pao",
                  nome: "Pôr o queijo no pão",
                  simbolo: "🧀"
                },
                {
                  id: "comer-o-sanduiche",
                  nome: "Comer o sanduíche",
                  simbolo: "🥪"
                }
              ],
              dica: "O queijo vai no pão antes de comer."
            }
          ]
        }
      },
      {
        numero: 3,
        trilha: "pequenos",
        titulo: "3 cenas",
        objetivo: "Ordene as 3 cenas do começo ao fim.",
        dificuldade: "media",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Prepare o balão da festa.",
              cenas: [
                {
                  id: "encher-o-balao",
                  nome: "Encher o balão",
                  simbolo: "🎈"
                },
                {
                  id: "amarrar-o-balao-com-linha",
                  nome: "Amarrar o balão com linha",
                  simbolo: "🧵"
                },
                {
                  id: "festa-com-balao",
                  nome: "Festa com balão",
                  simbolo: "🎉"
                }
              ]
            },
            {
              enunciado: "O que acontece na chuva?",
              cenas: [
                {
                  id: "chuva-comeca",
                  nome: "Chuva começa",
                  simbolo: "🌧️"
                },
                {
                  id: "abrir-o-guarda-chuva",
                  nome: "Abrir o guarda-chuva",
                  simbolo: "☂️"
                },
                {
                  id: "arco-iris-no-fim-da-chuva",
                  nome: "Arco-íris no fim da chuva",
                  simbolo: "🌈"
                }
              ]
            }
          ]
        }
      },
      {
        numero: 4,
        trilha: "pequenos",
        titulo: "4 cenas",
        objetivo: "Ordene as 4 cenas do começo ao fim.",
        dificuldade: "media",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Mande uma carta.",
              cenas: [
                {
                  id: "pegar-o-papel",
                  nome: "Pegar o papel",
                  simbolo: "📄"
                },
                {
                  id: "escrever-com-o-lapis",
                  nome: "Escrever com o lápis",
                  simbolo: "✏️"
                },
                {
                  id: "fechar-o-envelope",
                  nome: "Fechar o envelope",
                  simbolo: "💌"
                },
                {
                  id: "por-no-correio",
                  nome: "Pôr no correio",
                  simbolo: "📮"
                }
              ],
              dica: "Primeiro escreva; o envelope vem depois."
            },
            {
              enunciado: "Monte a hora do banho.",
              cenas: [
                {
                  id: "abrir-o-chuveiro",
                  nome: "Abrir o chuveiro",
                  simbolo: "🚿"
                },
                {
                  id: "passar-o-sabonete",
                  nome: "Passar o sabonete",
                  simbolo: "🧼"
                },
                {
                  id: "enxaguar-com-agua",
                  nome: "Enxaguar com água",
                  simbolo: "💧"
                },
                {
                  id: "vestir-a-camiseta",
                  nome: "Vestir a camiseta",
                  simbolo: "👕"
                }
              ],
              dica: "O sabonete sai com a água."
            }
          ]
        }
      },
      {
        numero: 5,
        trilha: "pequenos",
        titulo: "4 cenas",
        objetivo: "Ordene as 4 cenas do começo ao fim.",
        dificuldade: "avancada",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Plante um girassol.",
              cenas: [
                {
                  id: "encher-o-vaso-de-terra",
                  nome: "Encher o vaso de terra",
                  simbolo: "🪴"
                },
                {
                  id: "plantar-o-broto",
                  nome: "Plantar o broto",
                  simbolo: "🌱"
                },
                {
                  id: "regar-com-agua",
                  nome: "Regar com água",
                  simbolo: "💧"
                },
                {
                  id: "girassol-crescido",
                  nome: "Girassol crescido",
                  simbolo: "🌻"
                }
              ]
            },
            {
              enunciado: "Faça um bolo.",
              cenas: [
                {
                  id: "quebrar-o-ovo",
                  nome: "Quebrar o ovo",
                  simbolo: "🥚"
                },
                {
                  id: "misturar-a-massa-na-tigela",
                  nome: "Misturar a massa na tigela",
                  simbolo: "🥣"
                },
                {
                  id: "assar-no-forno",
                  nome: "Assar no forno",
                  simbolo: "🔥"
                },
                {
                  id: "bolo-pronto",
                  nome: "Bolo pronto",
                  simbolo: "🎂"
                }
              ]
            }
          ]
        }
      },
      {
        numero: 6,
        trilha: "medios",
        titulo: "4 cenas só com figuras",
        objetivo: "Ordene as 4 cenas olhando só as figuras.",
        dificuldade: "simples",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Conte a ida para a escola.",
              cenas: [
                {
                  id: "acordar-com-o-despertador",
                  nome: "Acordar com o despertador",
                  simbolo: "⏰"
                },
                {
                  id: "pegar-a-mochila",
                  nome: "Pegar a mochila",
                  simbolo: "🎒"
                },
                {
                  id: "sair-pela-porta",
                  nome: "Sair pela porta",
                  simbolo: "🚪"
                },
                {
                  id: "pegar-o-onibus",
                  nome: "Pegar o ônibus",
                  simbolo: "🚌"
                }
              ],
              ocultarNomes: true,
              dica: "O ônibus leva até a escola."
            },
            {
              enunciado: "Lave a roupa.",
              cenas: [
                {
                  id: "juntar-a-roupa-no-cesto",
                  nome: "Juntar a roupa no cesto",
                  simbolo: "🧺"
                },
                {
                  id: "lavar-com-sabao",
                  nome: "Lavar com sabão",
                  simbolo: "🧼"
                },
                {
                  id: "enxaguar-com-agua",
                  nome: "Enxaguar com água",
                  simbolo: "💧"
                },
                {
                  id: "secar-no-sol",
                  nome: "Secar no sol",
                  simbolo: "☀️"
                }
              ],
              ocultarNomes: true,
              dica: "A roupa seca antes de vestir."
            }
          ]
        }
      },
      {
        numero: 7,
        trilha: "medios",
        titulo: "5 cenas só com figuras",
        objetivo: "Ordene as 5 cenas olhando só as figuras.",
        dificuldade: "simples",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Conte a ida para a escola.",
              cenas: [
                {
                  id: "acordar-com-o-despertador",
                  nome: "Acordar com o despertador",
                  simbolo: "⏰"
                },
                {
                  id: "pegar-a-mochila",
                  nome: "Pegar a mochila",
                  simbolo: "🎒"
                },
                {
                  id: "sair-pela-porta",
                  nome: "Sair pela porta",
                  simbolo: "🚪"
                },
                {
                  id: "pegar-o-onibus",
                  nome: "Pegar o ônibus",
                  simbolo: "🚌"
                },
                {
                  id: "chegar-a-escola",
                  nome: "Chegar à escola",
                  simbolo: "🏫"
                }
              ],
              ocultarNomes: true,
              dica: "O ônibus leva até a escola."
            },
            {
              enunciado: "Lave a roupa.",
              cenas: [
                {
                  id: "juntar-a-roupa-no-cesto",
                  nome: "Juntar a roupa no cesto",
                  simbolo: "🧺"
                },
                {
                  id: "lavar-com-sabao",
                  nome: "Lavar com sabão",
                  simbolo: "🧼"
                },
                {
                  id: "enxaguar-com-agua",
                  nome: "Enxaguar com água",
                  simbolo: "💧"
                },
                {
                  id: "secar-no-sol",
                  nome: "Secar no sol",
                  simbolo: "☀️"
                },
                {
                  id: "vestir-a-camiseta-limpa",
                  nome: "Vestir a camiseta limpa",
                  simbolo: "👕"
                }
              ],
              ocultarNomes: true,
              dica: "A roupa seca antes de vestir."
            }
          ]
        }
      },
      {
        numero: 8,
        trilha: "medios",
        titulo: "5 cenas só com figuras",
        objetivo: "Ordene as 5 cenas olhando só as figuras.",
        dificuldade: "media",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Lave o carro.",
              cenas: [
                {
                  id: "encher-o-balde-de-agua",
                  nome: "Encher o balde de água",
                  simbolo: "🪣"
                },
                {
                  id: "molhar-a-esponja",
                  nome: "Molhar a esponja",
                  simbolo: "🧽"
                },
                {
                  id: "esfregar-o-carro",
                  nome: "Esfregar o carro",
                  simbolo: "🚗"
                },
                {
                  id: "enxaguar-com-agua",
                  nome: "Enxaguar com água",
                  simbolo: "💧"
                },
                {
                  id: "secar-no-sol",
                  nome: "Secar no sol",
                  simbolo: "☀️"
                }
              ],
              ocultarNomes: true
            },
            {
              enunciado: "Da semente à maçã.",
              cenas: [
                {
                  id: "plantar-a-semente",
                  nome: "Plantar a semente",
                  simbolo: "🌱"
                },
                {
                  id: "regar-com-agua",
                  nome: "Regar com água",
                  simbolo: "💧"
                },
                {
                  id: "arvore-grande",
                  nome: "Árvore grande",
                  simbolo: "🌳"
                },
                {
                  id: "flor-na-arvore",
                  nome: "Flor na árvore",
                  simbolo: "🌸"
                },
                {
                  id: "colher-a-maca",
                  nome: "Colher a maçã",
                  simbolo: "🍎"
                }
              ],
              ocultarNomes: true
            }
          ]
        }
      },
      {
        numero: 9,
        trilha: "medios",
        titulo: "6 cenas só com figuras",
        objetivo: "Ordene as 6 cenas olhando só as figuras.",
        dificuldade: "media",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Prepare a cenoura do almoço.",
              cenas: [
                {
                  id: "colher-a-cenoura",
                  nome: "Colher a cenoura",
                  simbolo: "🥕"
                },
                {
                  id: "lavar-a-cenoura-com-agua",
                  nome: "Lavar a cenoura com água",
                  simbolo: "💧"
                },
                {
                  id: "cozinhar-no-fogo",
                  nome: "Cozinhar no fogo",
                  simbolo: "🔥"
                },
                {
                  id: "servir-no-prato",
                  nome: "Servir no prato",
                  simbolo: "🍽️"
                },
                {
                  id: "comer-que-delicia",
                  nome: "Comer: que delícia",
                  simbolo: "😋"
                },
                {
                  id: "lavar-o-prato-com-a-esponja",
                  nome: "Lavar o prato com a esponja",
                  simbolo: "🧽"
                }
              ],
              ocultarNomes: true,
              dica: "Primeiro colha, depois lave."
            },
            {
              enunciado: "Mande um desenho para a vovó.",
              cenas: [
                {
                  id: "pegar-o-papel",
                  nome: "Pegar o papel",
                  simbolo: "📄"
                },
                {
                  id: "desenhar-com-o-lapis",
                  nome: "Desenhar com o lápis",
                  simbolo: "✏️"
                },
                {
                  id: "pintar-o-desenho-com-giz-de-cera",
                  nome: "Pintar o desenho com giz de cera",
                  simbolo: "🖍️"
                },
                {
                  id: "por-no-envelope",
                  nome: "Pôr no envelope",
                  simbolo: "💌"
                },
                {
                  id: "por-no-correio",
                  nome: "Pôr no correio",
                  simbolo: "📮"
                },
                {
                  id: "chegar-a-casa-da-vovo",
                  nome: "Chegar à casa da vovó",
                  simbolo: "🏠"
                }
              ],
              ocultarNomes: true,
              dica: "Pinte depois de desenhar."
            }
          ]
        }
      },
      {
        numero: 10,
        trilha: "medios",
        titulo: "6 cenas só com figuras",
        objetivo: "Ordene as 6 cenas olhando só as figuras.",
        dificuldade: "avancada",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Solte a pipa num lugar aberto.",
              cenas: [
                {
                  id: "pegar-a-linha",
                  nome: "Pegar a linha",
                  simbolo: "🧵"
                },
                {
                  id: "amarrar-a-linha-na-pipa",
                  nome: "Amarrar a linha na pipa",
                  simbolo: "🪁"
                },
                {
                  id: "esperar-o-vento",
                  nome: "Esperar o vento",
                  simbolo: "🌬️"
                },
                {
                  id: "correr-de-tenis",
                  nome: "Correr de tênis",
                  simbolo: "👟"
                },
                {
                  id: "pipa-perto-da-nuvem",
                  nome: "Pipa perto da nuvem",
                  simbolo: "☁️"
                },
                {
                  id: "voltar-para-casa",
                  nome: "Voltar para casa",
                  simbolo: "🏠"
                }
              ],
              ocultarNomes: true
            },
            {
              enunciado: "Da flor ao mel.",
              cenas: [
                {
                  id: "plantar-a-semente",
                  nome: "Plantar a semente",
                  simbolo: "🌱"
                },
                {
                  id: "flor-aberta",
                  nome: "Flor aberta",
                  simbolo: "🌸"
                },
                {
                  id: "abelha-visita-a-flor",
                  nome: "Abelha visita a flor",
                  simbolo: "🐝"
                },
                {
                  id: "mel-pronto",
                  nome: "Mel pronto",
                  simbolo: "🍯"
                },
                {
                  id: "passar-mel-no-pao",
                  nome: "Passar mel no pão",
                  simbolo: "🍞"
                },
                {
                  id: "comer-que-delicia",
                  nome: "Comer: que delícia",
                  simbolo: "😋"
                }
              ],
              ocultarNomes: true
            }
          ]
        }
      },
      {
        numero: 11,
        trilha: "grandes",
        titulo: "6 cenas e 1 intrusa",
        objetivo: "Ordene as 6 cenas da história e deixe de fora a que não faz parte.",
        dificuldade: "simples",
        configuracao: {
          conjuntos: [
            {
              enunciado: "A festa do bolo.",
              cenas: [
                {
                  id: "quebrar-o-ovo",
                  nome: "Quebrar o ovo",
                  simbolo: "🥚"
                },
                {
                  id: "misturar-a-massa-na-tigela",
                  nome: "Misturar a massa na tigela",
                  simbolo: "🥣"
                },
                {
                  id: "assar-no-forno",
                  nome: "Assar no forno",
                  simbolo: "🔥"
                },
                {
                  id: "bolo-pronto",
                  nome: "Bolo pronto",
                  simbolo: "🎂"
                },
                {
                  id: "acender-a-vela",
                  nome: "Acender a vela",
                  simbolo: "🕯️"
                },
                {
                  id: "cantar-parabens-na-festa",
                  nome: "Cantar parabéns na festa",
                  simbolo: "🎉"
                }
              ],
              ocultarNomes: true,
              intrusas: [
                {
                  id: "fora-baleia-nadando-no-mar",
                  nome: "Baleia nadando no mar",
                  simbolo: "🐳"
                }
              ],
              dica: "A vela vai no bolo pronto."
            },
            {
              enunciado: "Do vaso ao mel.",
              cenas: [
                {
                  id: "encher-o-vaso-de-terra",
                  nome: "Encher o vaso de terra",
                  simbolo: "🪴"
                },
                {
                  id: "plantar-a-semente",
                  nome: "Plantar a semente",
                  simbolo: "🌱"
                },
                {
                  id: "regar-com-agua",
                  nome: "Regar com água",
                  simbolo: "💧"
                },
                {
                  id: "flor-aberta",
                  nome: "Flor aberta",
                  simbolo: "🌸"
                },
                {
                  id: "abelha-visita-a-flor",
                  nome: "Abelha visita a flor",
                  simbolo: "🐝"
                },
                {
                  id: "mel-pronto",
                  nome: "Mel pronto",
                  simbolo: "🍯"
                }
              ],
              ocultarNomes: true,
              intrusas: [
                {
                  id: "fora-floco-de-neve-caindo",
                  nome: "Floco de neve caindo",
                  simbolo: "❄️"
                }
              ],
              dica: "A abelha precisa da flor."
            }
          ]
        }
      },
      {
        numero: 12,
        trilha: "grandes",
        titulo: "7 cenas e 1 intrusa",
        objetivo: "Ordene as 7 cenas da história e deixe de fora a que não faz parte.",
        dificuldade: "simples",
        configuracao: {
          conjuntos: [
            {
              enunciado: "A festa do bolo.",
              cenas: [
                {
                  id: "quebrar-o-ovo",
                  nome: "Quebrar o ovo",
                  simbolo: "🥚"
                },
                {
                  id: "misturar-a-massa-na-tigela",
                  nome: "Misturar a massa na tigela",
                  simbolo: "🥣"
                },
                {
                  id: "assar-no-forno",
                  nome: "Assar no forno",
                  simbolo: "🔥"
                },
                {
                  id: "bolo-pronto",
                  nome: "Bolo pronto",
                  simbolo: "🎂"
                },
                {
                  id: "acender-a-vela",
                  nome: "Acender a vela",
                  simbolo: "🕯️"
                },
                {
                  id: "cantar-parabens-na-festa",
                  nome: "Cantar parabéns na festa",
                  simbolo: "🎉"
                },
                {
                  id: "comer-o-bolo-no-prato",
                  nome: "Comer o bolo no prato",
                  simbolo: "🍽️"
                }
              ],
              ocultarNomes: true,
              intrusas: [
                {
                  id: "fora-foguete-subindo-ao-espaco",
                  nome: "Foguete subindo ao espaço",
                  simbolo: "🚀"
                }
              ],
              dica: "A vela vai no bolo pronto."
            },
            {
              enunciado: "Do vaso ao mel.",
              cenas: [
                {
                  id: "encher-o-vaso-de-terra",
                  nome: "Encher o vaso de terra",
                  simbolo: "🪴"
                },
                {
                  id: "plantar-a-semente",
                  nome: "Plantar a semente",
                  simbolo: "🌱"
                },
                {
                  id: "regar-com-agua",
                  nome: "Regar com água",
                  simbolo: "💧"
                },
                {
                  id: "flor-aberta",
                  nome: "Flor aberta",
                  simbolo: "🌸"
                },
                {
                  id: "abelha-visita-a-flor",
                  nome: "Abelha visita a flor",
                  simbolo: "🐝"
                },
                {
                  id: "mel-pronto",
                  nome: "Mel pronto",
                  simbolo: "🍯"
                },
                {
                  id: "passar-mel-no-pao",
                  nome: "Passar mel no pão",
                  simbolo: "🍞"
                }
              ],
              ocultarNomes: true,
              intrusas: [
                {
                  id: "fora-foguete-subindo-ao-espaco",
                  nome: "Foguete subindo ao espaço",
                  simbolo: "🚀"
                }
              ],
              dica: "A abelha precisa da flor."
            }
          ]
        }
      },
      {
        numero: 13,
        trilha: "grandes",
        titulo: "7 cenas e 1 intrusa",
        objetivo: "Ordene as 7 cenas da história e deixe de fora a que não faz parte.",
        dificuldade: "media",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Um dia de escola.",
              cenas: [
                {
                  id: "arrumar-a-mochila",
                  nome: "Arrumar a mochila",
                  simbolo: "🎒"
                },
                {
                  id: "sair-pela-porta",
                  nome: "Sair pela porta",
                  simbolo: "🚪"
                },
                {
                  id: "caminhar-ate-o-ponto",
                  nome: "Caminhar até o ponto",
                  simbolo: "🚶"
                },
                {
                  id: "pegar-o-onibus",
                  nome: "Pegar o ônibus",
                  simbolo: "🚌"
                },
                {
                  id: "chegar-a-escola",
                  nome: "Chegar à escola",
                  simbolo: "🏫"
                },
                {
                  id: "abrir-o-livro",
                  nome: "Abrir o livro",
                  simbolo: "📘"
                },
                {
                  id: "copiar-a-licao-do-livro-com-o-lapis",
                  nome: "Copiar a lição do livro com o lápis",
                  simbolo: "✏️"
                }
              ],
              ocultarNomes: true,
              intrusas: [
                {
                  id: "fora-leao-dormindo-na-savana",
                  nome: "Leão dormindo na savana",
                  simbolo: "🦁"
                }
              ]
            },
            {
              enunciado: "O carro limpo.",
              cenas: [
                {
                  id: "encher-o-balde-de-agua",
                  nome: "Encher o balde de água",
                  simbolo: "🪣"
                },
                {
                  id: "por-sabao-no-balde",
                  nome: "Pôr sabão no balde",
                  simbolo: "🧼"
                },
                {
                  id: "molhar-a-esponja",
                  nome: "Molhar a esponja",
                  simbolo: "🧽"
                },
                {
                  id: "esfregar-o-carro",
                  nome: "Esfregar o carro",
                  simbolo: "🚗"
                },
                {
                  id: "enxaguar-com-agua",
                  nome: "Enxaguar com água",
                  simbolo: "💧"
                },
                {
                  id: "secar-no-sol",
                  nome: "Secar no sol",
                  simbolo: "☀️"
                },
                {
                  id: "passear-ate-o-parque",
                  nome: "Passear até o parque",
                  simbolo: "🌳"
                }
              ],
              ocultarNomes: true,
              intrusas: [
                {
                  id: "fora-baleia-nadando-no-mar",
                  nome: "Baleia nadando no mar",
                  simbolo: "🐳"
                }
              ]
            }
          ]
        }
      },
      {
        numero: 14,
        trilha: "grandes",
        titulo: "8 cenas e 2 intrusas",
        objetivo: "Ordene as 8 cenas da história e deixe de fora a que não faz parte.",
        dificuldade: "media",
        configuracao: {
          conjuntos: [
            {
              enunciado: "A festa do bolo, do começo.",
              cenas: [
                {
                  id: "lavar-as-maos-com-sabonete",
                  nome: "Lavar as mãos com sabonete",
                  simbolo: "🧼"
                },
                {
                  id: "quebrar-o-ovo",
                  nome: "Quebrar o ovo",
                  simbolo: "🥚"
                },
                {
                  id: "misturar-a-massa-na-tigela",
                  nome: "Misturar a massa na tigela",
                  simbolo: "🥣"
                },
                {
                  id: "assar-no-forno",
                  nome: "Assar no forno",
                  simbolo: "🔥"
                },
                {
                  id: "bolo-pronto",
                  nome: "Bolo pronto",
                  simbolo: "🎂"
                },
                {
                  id: "acender-a-vela",
                  nome: "Acender a vela",
                  simbolo: "🕯️"
                },
                {
                  id: "cantar-parabens-na-festa",
                  nome: "Cantar parabéns na festa",
                  simbolo: "🎉"
                },
                {
                  id: "comer-o-bolo-no-prato",
                  nome: "Comer o bolo no prato",
                  simbolo: "🍽️"
                }
              ],
              ocultarNomes: true,
              intrusas: [
                {
                  id: "fora-foguete-subindo-ao-espaco",
                  nome: "Foguete subindo ao espaço",
                  simbolo: "🚀"
                },
                {
                  id: "fora-floco-de-neve-caindo",
                  nome: "Floco de neve caindo",
                  simbolo: "❄️"
                }
              ],
              dica: "Lave as mãos antes de cozinhar."
            },
            {
              enunciado: "Do vaso ao lanche.",
              cenas: [
                {
                  id: "encher-o-vaso-de-terra",
                  nome: "Encher o vaso de terra",
                  simbolo: "🪴"
                },
                {
                  id: "plantar-a-semente",
                  nome: "Plantar a semente",
                  simbolo: "🌱"
                },
                {
                  id: "regar-com-agua",
                  nome: "Regar com água",
                  simbolo: "💧"
                },
                {
                  id: "flor-aberta",
                  nome: "Flor aberta",
                  simbolo: "🌸"
                },
                {
                  id: "abelha-visita-a-flor",
                  nome: "Abelha visita a flor",
                  simbolo: "🐝"
                },
                {
                  id: "mel-pronto",
                  nome: "Mel pronto",
                  simbolo: "🍯"
                },
                {
                  id: "passar-mel-no-pao",
                  nome: "Passar mel no pão",
                  simbolo: "🍞"
                },
                {
                  id: "comer-que-delicia",
                  nome: "Comer: que delícia",
                  simbolo: "😋"
                }
              ],
              ocultarNomes: true,
              intrusas: [
                {
                  id: "fora-leao-dormindo-na-savana",
                  nome: "Leão dormindo na savana",
                  simbolo: "🦁"
                },
                {
                  id: "fora-floco-de-neve-caindo",
                  nome: "Floco de neve caindo",
                  simbolo: "❄️"
                }
              ],
              dica: "O mel vem da flor."
            }
          ]
        }
      },
      {
        numero: 15,
        trilha: "grandes",
        titulo: "8 cenas e 2 intrusas",
        objetivo: "Ordene as 8 cenas da história e deixe de fora a que não faz parte.",
        dificuldade: "avancada",
        configuracao: {
          conjuntos: [
            {
              enunciado: "Ida e volta da escola.",
              cenas: [
                {
                  id: "arrumar-a-mochila",
                  nome: "Arrumar a mochila",
                  simbolo: "🎒"
                },
                {
                  id: "sair-pela-porta",
                  nome: "Sair pela porta",
                  simbolo: "🚪"
                },
                {
                  id: "caminhar-ate-o-ponto",
                  nome: "Caminhar até o ponto",
                  simbolo: "🚶"
                },
                {
                  id: "pegar-o-onibus",
                  nome: "Pegar o ônibus",
                  simbolo: "🚌"
                },
                {
                  id: "chegar-a-escola",
                  nome: "Chegar à escola",
                  simbolo: "🏫"
                },
                {
                  id: "abrir-o-livro",
                  nome: "Abrir o livro",
                  simbolo: "📘"
                },
                {
                  id: "copiar-a-licao-do-livro-com-o-lapis",
                  nome: "Copiar a lição do livro com o lápis",
                  simbolo: "✏️"
                },
                {
                  id: "voltar-para-casa",
                  nome: "Voltar para casa",
                  simbolo: "🏠"
                }
              ],
              ocultarNomes: true,
              intrusas: [
                {
                  id: "fora-floco-de-neve-caindo",
                  nome: "Floco de neve caindo",
                  simbolo: "❄️"
                },
                {
                  id: "fora-foguete-subindo-ao-espaco",
                  nome: "Foguete subindo ao espaço",
                  simbolo: "🚀"
                }
              ]
            },
            {
              enunciado: "Depois da chuva, carro limpo.",
              cenas: [
                {
                  id: "chuva-suja-o-carro",
                  nome: "Chuva suja o carro",
                  simbolo: "🌧️"
                },
                {
                  id: "encher-o-balde-de-agua",
                  nome: "Encher o balde de água",
                  simbolo: "🪣"
                },
                {
                  id: "por-sabao-no-balde",
                  nome: "Pôr sabão no balde",
                  simbolo: "🧼"
                },
                {
                  id: "molhar-a-esponja",
                  nome: "Molhar a esponja",
                  simbolo: "🧽"
                },
                {
                  id: "esfregar-o-carro",
                  nome: "Esfregar o carro",
                  simbolo: "🚗"
                },
                {
                  id: "enxaguar-com-agua",
                  nome: "Enxaguar com água",
                  simbolo: "💧"
                },
                {
                  id: "secar-no-sol",
                  nome: "Secar no sol",
                  simbolo: "☀️"
                },
                {
                  id: "passear-ate-o-parque",
                  nome: "Passear até o parque",
                  simbolo: "🌳"
                }
              ],
              ocultarNomes: true,
              intrusas: [
                {
                  id: "fora-polvo-no-fundo-do-mar",
                  nome: "Polvo no fundo do mar",
                  simbolo: "🐙"
                },
                {
                  id: "fora-floco-de-neve-caindo",
                  nome: "Floco de neve caindo",
                  simbolo: "❄️"
                }
              ]
            }
          ]
        }
      }
    ]
  }
];
