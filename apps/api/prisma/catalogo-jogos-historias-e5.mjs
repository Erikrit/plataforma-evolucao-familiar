/**
 * CAT-04 — Histórias em cenas (ordenação). Cinco fases, duas variantes curadas cada.
 */

function dificuldadeDaFase(numero) {
  if (numero <= 2) return "simples";
  if (numero <= 4) return "media";
  return "avancada";
}

function cena(id, nome, simbolo) {
  return { id, nome, simbolo };
}

export const CATALOGO_JOGOS_HISTORIAS_E5 = [
  {
    id: "historias-cenas",
    nome: "Histórias em cenas",
    descricao: "Ordene as cenas para contar a história na ordem certa.",
    categoria: "linguagem",
    instrucoes:
      "Toque nas cenas na ordem da história. Use Desfazer se precisar corrigir. No teclado: setas para escolher, Enter para colocar e Backspace para desfazer.",
    tipoMecanica: "ordenacao",
    versao: 1,
    faixaEtariaMin: 5,
    faixaEtariaMax: 8,
    ordemEditorial: 7,
    fases: [
      {
        numero: 1,
        titulo: "Duas cenas",
        objetivo: "Ordene as 2 cenas do começo ao fim.",
        dificuldade: dificuldadeDaFase(1),
        configuracao: {
          conjuntos: [
            {
              enunciado: "Monte a manhã da semente.",
              cenas: [
                cena("plantar", "Plantar a semente", "🌱"),
                cena("flor", "Flor aberta", "🌸"),
              ],
            },
            {
              enunciado: "Monte o começo do dia.",
              cenas: [
                cena("acordar", "Acordar", "🛏️"),
                cena("escovar", "Escovar os dentes", "🪥"),
              ],
            },
          ],
        },
      },
      {
        numero: 2,
        titulo: "Começo evidente",
        objetivo: "Ordene as 3 cenas começando pelo início claro.",
        dificuldade: dificuldadeDaFase(2),
        configuracao: {
          conjuntos: [
            {
              enunciado: "Conte o passeio ao parque.",
              cenas: [
                cena("casa", "Sair de casa", "🏠"),
                cena("caminho", "Caminhar", "🚶"),
                cena("parque", "Chegar ao parque", "🌳"),
              ],
            },
            {
              enunciado: "Conte o lanche da tarde.",
              cenas: [
                cena("fome", "Sentir fome", "😋"),
                cena("preparar", "Preparar o lanche", "🥪"),
                cena("comer", "Comer juntos", "🍽️"),
              ],
            },
          ],
        },
      },
      {
        numero: 3,
        titulo: "Causa e efeito",
        objetivo: "Ordene as 3 cenas de causa e efeito.",
        dificuldade: dificuldadeDaFase(3),
        configuracao: {
          conjuntos: [
            {
              enunciado: "O que acontece quando chove?",
              cenas: [
                cena("nuvem", "Nuvem escura", "☁️"),
                cena("chuva", "Chuva caindo", "🌧️"),
                cena("poco", "Poça na rua", "💦"),
              ],
            },
            {
              enunciado: "Como nasce o bolo?",
              cenas: [
                cena("misturar", "Misturar a massa", "🥣"),
                cena("forno", "Assar no forno", "🔥"),
                cena("bolo", "Bolo pronto", "🎂"),
              ],
            },
          ],
        },
      },
      {
        numero: 4,
        titulo: "Rotina de quatro passos",
        objetivo: "Ordene as 4 cenas de uma rotina familiar.",
        dificuldade: dificuldadeDaFase(4),
        configuracao: {
          conjuntos: [
            {
              enunciado: "Monte a rotina para ir à escola.",
              cenas: [
                cena("acordar", "Acordar", "⏰"),
                cena("vestir", "Vestir-se", "👕"),
                cena("mochila", "Pegar a mochila", "🎒"),
                cena("escola", "Chegar à escola", "🏫"),
              ],
            },
            {
              enunciado: "Monte a rotina do banho.",
              cenas: [
                cena("torneira", "Abrir a torneira", "🚿"),
                cena("sabao", "Usar sabão", "🧼"),
                cena("enxaguar", "Enxaguar", "💧"),
                cena("toalha", "Secar com toalha", "🧺"),
              ],
            },
          ],
        },
      },
      {
        numero: 5,
        titulo: "Com pista no meio",
        objetivo: "Ordene as 4 cenas; use a pista se precisar.",
        dificuldade: dificuldadeDaFase(5),
        configuracao: {
          conjuntos: [
            {
              enunciado: "Conte a história do cartão para um amigo.",
              cenas: [
                cena("papel", "Pegar o papel", "📄"),
                cena("desenhar", "Desenhar", "✏️"),
                cena("escrever", "Escrever a mensagem", "✍️"),
                cena("entregar", "Entregar o cartão", "💌"),
              ],
              dica: "Depois de desenhar, ainda falta escrever antes de entregar.",
            },
            {
              enunciado: "Conte a história da horta.",
              cenas: [
                cena("terra", "Preparar a terra", "🪴"),
                cena("semente", "Colocar a semente", "🌱"),
                cena("regar", "Regar", "🚿"),
                cena("colher", "Colher o alimento", "🥕"),
              ],
              dica: "A rega vem depois da semente e antes da colheita.",
            },
          ],
        },
      },
    ],
  },
];
