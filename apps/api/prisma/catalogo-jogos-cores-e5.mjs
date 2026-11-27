/**
 * Caminho de cores (DEV-CAT-M1-CONTEUDO, ticket 05): grade do labirinto com a cor como restrição.
 * Só se pisa na cor indicada (a azul, v verde, m amarelo, r vermelho); letra maiúscula é casa de
 * troca, que sempre pode ser pisada e muda a cor indicada. I partida, F chegada, # parede.
 * 15 fases em três trilhas: mais cores, caminhos mais longos e trocas no percurso. Gerado de forma
 * determinística e congelado; a régua confere a rota e a progressão
 * (npm run regua:jogos -w @pef/api -- --estrito).
 */
export const CATALOGO_JOGOS_CORES_E5 = [{
  id: "caminho-cores",
  nome: "Caminho de cores",
  descricao: "Chegue ao fim pisando só na cor indicada.",
  categoria: "coordenacao",
  instrucoes: "Use as setas para andar. Só dá para pisar na cor indicada; cada cor tem também um símbolo. Casas de troca mudam a cor indicada.",
  tipoMecanica: "cores",
  versao: 1,
  faixaEtariaMin: 5,
  faixaEtariaMax: 12,
  ordemEditorial: 18,
  fases: [
    {
      numero: 1,
      trilha: "pequenos",
      titulo: "Duas cores · 6 passos",
      objetivo: "Pise só na cor indicada até a chegada.",
      dificuldade: "simples",
      configuracao: {
        mapas: [
          {
            cor: "a",
            linhas: [
              "vavav",
              "#vava",
              "Favav",
              "va#v#",
              "#aaaI"
            ]
          },
          {
            cor: "a",
            linhas: [
              "av#Iv",
              "vavaa",
              "av#va",
              "v#Faa",
              "av#v#"
            ]
          }
        ]
      }
    },
    {
      numero: 2,
      trilha: "pequenos",
      titulo: "Duas cores · 7 passos",
      objetivo: "Pise só na cor indicada até a chegada.",
      dificuldade: "simples",
      configuracao: {
        mapas: [
          {
            cor: "a",
            linhas: [
              "vavav",
              "#vava",
              "F#vav",
              "avavI",
              "aaaaa"
            ]
          },
          {
            cor: "a",
            linhas: [
              "avavI",
              "vavaa",
              "avaav",
              "v#ava",
              "#Faav"
            ]
          }
        ]
      }
    },
    {
      numero: 3,
      trilha: "pequenos",
      titulo: "Duas cores · 8 passos",
      objetivo: "Pise só na cor indicada até a chegada.",
      dificuldade: "media",
      configuracao: {
        mapas: [
          {
            cor: "v",
            linhas: [
              "a#ava",
              "vvvav",
              "vavva",
              "v#Fav",
              "vIava"
            ]
          },
          {
            cor: "v",
            linhas: [
              "vvvva",
              "va#vv",
              "F#a#I",
              "av#va",
              "vavav"
            ]
          }
        ]
      }
    },
    {
      numero: 4,
      trilha: "pequenos",
      titulo: "Duas cores · 9 passos",
      objetivo: "Pise só na cor indicada até a chegada.",
      dificuldade: "media",
      configuracao: {
        mapas: [
          {
            cor: "v",
            linhas: [
              "avaFv",
              "vavav",
              "avavv",
              "va#av",
              "a#I#v",
              "#vvvv"
            ]
          },
          {
            cor: "a",
            linhas: [
              "Faaaa",
              "vav#a",
              "av#aa",
              "v#Iav",
              "av#a#",
              "vav#v"
            ]
          }
        ]
      }
    },
    {
      numero: 5,
      trilha: "pequenos",
      titulo: "Duas cores · 10 passos",
      objetivo: "Pise só na cor indicada até a chegada.",
      dificuldade: "avancada",
      configuracao: {
        mapas: [
          {
            cor: "v",
            linhas: [
              "vFaIv",
              "va#av",
              "vvvvv",
              "a#vav",
              "va#va",
              "ava#v"
            ]
          },
          {
            cor: "v",
            linhas: [
              "ava#v",
              "va#Fv",
              "ava#v",
              "#avav",
              "I#avv",
              "vvvva"
            ]
          }
        ]
      }
    },
    {
      numero: 6,
      trilha: "medios",
      titulo: "Três cores e trocas · 12 passos",
      objetivo: "Pise só na cor indicada. Nas casas de troca, a cor indicada muda.",
      dificuldade: "simples",
      configuracao: {
        mapas: [
          {
            cor: "v",
            linhas: [
              "vavama",
              "mvamvm",
              "Imv#Fv",
              "vvmaaa",
              "mvvmva",
              "vavAaa"
            ]
          },
          {
            cor: "v",
            linhas: [
              "amIvvm",
              "vamav#",
              "amavvA",
              "mavm#a",
              "vmavaa",
              "mFaaav"
            ]
          }
        ]
      }
    },
    {
      numero: 7,
      trilha: "medios",
      titulo: "Três cores e trocas · 13 passos",
      objetivo: "Pise só na cor indicada. Nas casas de troca, a cor indicada muda.",
      dificuldade: "simples",
      configuracao: {
        mapas: [
          {
            cor: "v",
            linhas: [
              "mmmama",
              "mammav",
              "mmvmmm",
              "aMavFa",
              "Ivvavm",
              "amavav"
            ]
          },
          {
            cor: "m",
            linhas: [
              "maaaaa",
              "vaavma",
              "amAmva",
              "vavI#a",
              "amavma",
              "vavmFa"
            ]
          }
        ]
      }
    },
    {
      numero: 8,
      trilha: "medios",
      titulo: "Três cores e trocas · 14 passos",
      objetivo: "Pise só na cor indicada. Nas casas de troca, a cor indicada muda.",
      dificuldade: "media",
      configuracao: {
        mapas: [
          {
            cor: "v",
            linhas: [
              "amvmvm",
              "vamamv",
              "mmvFam",
              "mmmm#a",
              "mamavI",
              "mvavva",
              "mMvvam"
            ]
          },
          {
            cor: "a",
            linhas: [
              "mmmmav",
              "mmamFa",
              "mmmvav",
              "avMama",
              "vmvaav",
              "mamvaa",
              "amamvI"
            ]
          }
        ]
      }
    },
    {
      numero: 9,
      trilha: "medios",
      titulo: "Três cores e trocas · 16 passos",
      objetivo: "Pise só na cor indicada. Nas casas de troca, a cor indicada muda.",
      dificuldade: "media",
      configuracao: {
        mapas: [
          {
            cor: "m",
            linhas: [
              "ammFama",
              "mmvavav",
              "ma#Iavm",
              "mvmmmav",
              "mamavma",
              "M#Vmavm",
              "vvvvmav"
            ]
          },
          {
            cor: "a",
            linhas: [
              "mvmaIva",
              "amaam#v",
              "mavaaam",
              "aaamava",
              "amAvVmv",
              "avmamva",
              "aaFmvmv"
            ]
          }
        ]
      }
    },
    {
      numero: 10,
      trilha: "medios",
      titulo: "Três cores e trocas · 18 passos",
      objetivo: "Pise só na cor indicada. Nas casas de troca, a cor indicada muda.",
      dificuldade: "avancada",
      configuracao: {
        mapas: [
          {
            cor: "m",
            linhas: [
              "avmmmVm",
              "vmma#vv",
              "mvmmvmv",
              "amamIvM",
              "vavavmm",
              "avFmmmv",
              "mavamma"
            ]
          },
          {
            cor: "m",
            linhas: [
              "vamIamv",
              "mmmvmam",
              "vmvavmv",
              "mmmvmam",
              "mvamava",
              "m#aaVmF",
              "mmAmvvv"
            ]
          }
        ]
      }
    },
    {
      numero: 11,
      trilha: "grandes",
      titulo: "Quatro cores e trocas · 20 passos",
      objetivo: "Pise só na cor indicada. Nas casas de troca, a cor indicada muda.",
      dificuldade: "simples",
      configuracao: {
        mapas: [
          {
            cor: "v",
            linhas: [
              "mrmraar",
              "vavmaaa",
              "mrmramA",
              "amraavm",
              "vraaram",
              "mvramvM",
              "vmaarva",
              "FaamIvv"
            ]
          },
          {
            cor: "v",
            linhas: [
              "ImvramF",
              "vvamrva",
              "rvmvaaa",
              "vvarmAv",
              "mvrarrr",
              "rvarram",
              "avmRmra",
              "mvvvvam"
            ]
          }
        ]
      }
    },
    {
      numero: 12,
      trilha: "grandes",
      titulo: "Quatro cores e trocas · 22 passos",
      objetivo: "Pise só na cor indicada. Nas casas de troca, a cor indicada muda.",
      dificuldade: "simples",
      configuracao: {
        mapas: [
          {
            cor: "r",
            linhas: [
              "amrvvvv",
              "ravavav",
              "araIVmv",
              "rmrmrvv",
              "maVvvaR",
              "arraFmr",
              "mrrrmvr",
              "amarrrr"
            ]
          },
          {
            cor: "m",
            linhas: [
              "mvrrrRm",
              "rarravm",
              "vmrrMrm",
              "mavaVam",
              "avrmvrm",
              "rmavvam",
              "mrvvrmm",
              "aFvavIv"
            ]
          }
        ]
      }
    },
    {
      numero: 13,
      trilha: "grandes",
      titulo: "Quatro cores e trocas · 24 passos",
      objetivo: "Pise só na cor indicada. Nas casas de troca, a cor indicada muda.",
      dificuldade: "media",
      configuracao: {
        mapas: [
          {
            cor: "r",
            linhas: [
              "rRvavmvm",
              "rmvvmara",
              "rrmvavav",
              "aravvmvm",
              "rrmrVrav",
              "rmavMvrr",
              "ravrrrrr",
              "rFmvrrvI"
            ]
          },
          {
            cor: "v",
            linhas: [
              "aaaamvmv",
              "mAraarvr",
              "vvamaaam",
              "vararvaa",
              "vravmrFm",
              "vmraravr",
              "Vrmmmrma",
              "mmmmmMvI"
            ]
          }
        ]
      }
    },
    {
      numero: 14,
      trilha: "grandes",
      titulo: "Quatro cores e trocas · 26 passos",
      objetivo: "Pise só na cor indicada. Nas casas de troca, a cor indicada muda.",
      dificuldade: "media",
      configuracao: {
        mapas: [
          {
            cor: "a",
            linhas: [
              "mvrRaaam",
              "arravamv",
              "rrmvraam",
              "rrramraa",
              "vFmvrmra",
              "mvravamA",
              "rImrmvar",
              "maVavm#R",
              "vrvvvvvv"
            ]
          },
          {
            cor: "a",
            linhas: [
              "avrvraIv",
              "mrarmavm",
              "Faavaaav",
              "vmaavraa",
              "avrAMara",
              "mamrvmaa",
              "vravvvra",
              "mavvmamR",
              "vmrvvVrr"
            ]
          }
        ]
      }
    },
    {
      numero: 15,
      trilha: "grandes",
      titulo: "Quatro cores e trocas · 28 passos",
      objetivo: "Pise só na cor indicada. Nas casas de troca, a cor indicada muda.",
      dificuldade: "avancada",
      configuracao: {
        mapas: [
          {
            cor: "a",
            linhas: [
              "aaavMVaa",
              "amarmrar",
              "avaAmvaI",
              "aarvmavr",
              "mavmrmrm",
              "aaaVvava",
              "rarmvvmF",
              "armravvv",
              "rmamrarv"
            ]
          },
          {
            cor: "m",
            linhas: [
              "Immrvmav",
              "avmmmvrm",
              "mraRvamv",
              "avrraFvv",
              "mrrarmrv",
              "rrvmvvmv",
              "rmr#vvvv",
              "rvAaVmav",
              "Mmmravma"
            ]
          }
        ]
      }
    }
  ]
}];
