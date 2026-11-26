# Homologação — DEV-CAT-M1 (tickets 04 e 08)

**Código:** `develop` @ `60aa196` + correções locais da esteira · **fingerprint** `sha256:7c75b6cd…` · **gerado em** 2026-11-25.

## Automático

Relatório conferido pelo `verificador`: FAIL na primeira versão (H8 errado, E5-ACE-02 parcial, ticket 04 marcado antes do retorno humano), corrigido nesta versão.

Origem: `node scripts/esteira/qg.mjs --perfil qg3 --integral --demanda DEV-CAT-M1 --base 514b049`, exit 0. Evidência local: `docs/esteira/evidencias/DEV-CAT-M1/qg3-2026-11-26T01-57-05-907Z.json`.

| Critério | Status | Evidência |
|---|---|---|
| FF-NASC-ACE-01 | PASS | `smoke-ff-nasc`, exit 0 |
| FF-NASC-ACE-02 (regra na API) | PASS | `smoke-ff-nasc` e `authz`, exit 0 |
| FF-NASC-ACE-03 (regra na API) | PASS | `smoke-ff-nasc`, exit 0 |
| FF-NASC-ACE-04 (sem reescrever registros) | PASS | `smoke-ff-nasc`, exit 0 |
| FF-NASC-ACE-04 (muda a faixa padrão) | PENDING | Depende do ticket 05, bloqueado pela decisão D1 |
| E5-ACE-02 (objetivos verificáveis) | PASS | `check-e5` (QG-1; memória, sequência e labirinto), exit 0 |
| E5-ACE-02 (dica acessível; concluir com ajuda dá o mesmo resultado) | PENDING_HUMAN | H9 |
| E5-ACE-03 e E5-ACE-12 (ticket 01) | PASS | `check-e5`, exit 0 |
| Regressão de acesso, isolamento e módulos | PASS | `authz`, `smoke:e1-*`, `smoke:e2`, `smoke:e3`, `smoke:e4`, `smoke:e5`, `smoke:est-03-docs`, `smoke:e1-04` |

Testes automáticos de unidade: `NOT_APPLICABLE` (sem runner no projeto).

## Humano

**Ambiente:** a VPS de homologação depois da publicação feita pelo responsável, ou a aplicação local (`npm run dev:api` e `npm run dev:web`). Usar somente contas e pessoas fictícias. Nunca usar dados reais.

### H1 — FF-NASC-ACE-02: concessão de Desenvolvimento pede a data
- **Preparação:** administrador fictício; pessoa "Teste Sem Data", criada só com nome.
- **Aparelho:** celular, informar modelo e navegador.
- **Passos:** 1. Gerenciar família → acessos. 2. Conceder Desenvolvimento para "Teste Sem Data". 3. Fechar sem informar a data. 4. Repetir e informar a data.
- **Esperado:** no passo 3, o acesso não aparece como concedido. No passo 4, só aparece concedido depois de salvar, com a data visível no perfil.
- **Status:** PASS (após o ajuste)
- **Retorno:** responsável, 2026-11-26: concessão funciona, mas a data só aparecia depois de tentar conceder. Esperado: ao selecionar Desenvolvimento, o campo de data aparece já como obrigatório; preencher e confirmar. Ajustado na mesma data; refazer o H1. Refeito em 2026-11-26: aprovado. Pedido novo (ticket 11): a data deve vir logo depois da área e a responsabilidade por último.

### H2 — FF-NASC-ACE-03: pessoa existente sem data é orientada
- **Preparação:** pessoa fictícia que já tinha Desenvolvimento e progresso antes desta versão, sem data de nascimento (preparada pela equipe).
- **Aparelho:** celular.
- **Passos:** 1. Abrir Desenvolvimento dessa pessoa. 2. Seguir a orientação e informar a data. 3. Voltar à Biblioteca e aos jogos.
- **Esperado:** orientação clara antes de continuar; depois de informar, estrelas, atividades executadas e fases concluídas continuam iguais.
- **Status:** NOT_APPLICABLE
- **Retorno:** responsável, 2026-11-26: dispensado; o sistema ainda não tem pessoas reais, e o banco de teste pode ser recriado.

### H3 — FF-NASC-ACE-01 e regressão de Cuidados
- **Passos:** 1. Criar uma pessoa só com o nome. 2. Abrir Cuidados dessa pessoa com um responsável autorizado.
- **Esperado:** cadastro concluído sem pedir data; Cuidados funciona sem data.
- **Status:** PASS
- **Retorno:** responsável, 2026-11-26: aprovado.

### H4 — Acesso negado
- **Preparação:** conta fictícia com acesso só a Cuidados de outra pessoa.
- **Passos:** abrir o endereço de Desenvolvimento de "Teste Sem Data" diretamente.
- **Esperado:** sem acesso, e sem revelar a data nem o progresso.
- **Status:** PASS
- **Retorno:** responsável, 2026-11-26: aprovado.

### H5 — Falha de rede sem falso sucesso
- **Passos:** no fluxo de H1 ou H2, ativar o modo avião antes de salvar a data e tentar salvar.
- **Esperado:** mensagem de que não foi salvo; nada aparece como concluído; ao voltar a rede, salvar funciona.
- **Status:** PASS
- **Retorno:** responsável, 2026-11-26: aprovado.

### H6 — E5-F04: dica recalculada no estado atual
- **Aparelho:** celular.
- **Passos:** 1. Labirinto: pedir a dica, andar dois passos e pedir de novo. 2. Repetir a ideia na Entrega e na Memória, avançando antes do segundo pedido.
- **Esperado:** a segunda dica corresponde à posição ou ao estado atual, não à do início.
- **Status:** PASS
- **Retorno:** responsável, 2026-11-26: aprovado.

### H7 — E5-ACE-10: toque, teclado e movimento reduzido
- **Aparelho:** celular para o toque; computador para o teclado; movimento reduzido ativado no sistema.
- **Passos:** concluir uma fase de Labirinto e uma de Memória em cada modo e sair pelo botão de saída.
- **Esperado:** foco visível no teclado; toque responde; com movimento reduzido, sem animações intensas; saída sempre disponível.
- **Status:** PASS
- **Retorno:** responsável, 2026-11-26: aprovado.

### H8 — Regressão de partida
- **Passos:** concluir uma fase de um jogo não alterado, sair e reabrir o jogo.
- **Esperado:** o jogo abre na próxima fase ainda não concluída, e o saldo de estrelas não muda (jogos não movimentam estrelas).
- **Status:** PASS
- **Retorno:** responsável, 2026-11-26: aprovado.

### H9 — E5-ACE-02: dica acessível e conclusão com ajuda
- **Passos:** em Labirinto, Entrega e Memória, usar a dica até concluir uma fase; em outra fase, concluir sem dica.
- **Esperado:** dica fácil de achar e entender; a conclusão com dica tem o mesmo resultado (fase concluída e progresso) que a conclusão sem dica.
- **Status:** PASS
- **Retorno:** responsável, 2026-11-26: aprovado.

## Fora do alcance local
- Mudança de faixa padrão (FF-NASC-ACE-04, parte 2): ticket 05, aguarda D1.
- Versão efetivamente publicada na VPS: conferir o commit implantado antes de homologar lá.

### H10 — Ticket 03: trilhas no labirinto (DEV-CAT-P03)
- **Preparação:** pessoa fictícia com Desenvolvimento; ambiente com a migração `20261126120000_trilha_fase_jogo` e a carga oficial aplicadas.
- **Aparelho:** celular de 320 a 360 px de largura; informar modelo e navegador.
- **Passos:** 1. Biblioteca → Jogos → Caminhos e labirintos → Escolher fase. 2. (Revisto pelo ticket 15: a trilha segue em ordem e a fase 15 só abre depois das anteriores.) 3. Jogar até a chegada. 4. Abrir Escolher fase de dentro da partida.
- **Esperado:** fases agrupadas em Pequenos, Médios e Grandes; a fase 15 abre na primeira visita; o mapa cabe na largura sem rolagem horizontal e as setas são tocáveis; conquistas anteriores do labirinto continuam visíveis.
- **Status:** PASS (v3)
- **Retorno anterior (v2, FAIL de dificuldade):** responsável, 2026-11-26: o jogo funcionou até a fase 15 e as marcações de fase funcionaram; porém a dificuldade quase não muda, o mapa só fica maior. Medição confirmou: as decisões no caminho ficam entre 0 e 4 da fase 1 à 15; a régua media só passos.
- **O que conferir na v3:** a dificuldade cresce de verdade? As decisões no caminho vão de 1 a 15. Os mapas têm até 23 linhas: a rolagem vertical no celular incomoda?
- **Retorno (v3):** responsável, 2026-11-26: homologado; a dificuldade evolui conforme o esperado.

### H11 — Ticket 06: área Números (DEV-CAT-P08, E5-ACE-11)
- **Aparelho:** celular.
- **Passos:** 1. Biblioteca → Jogos: abrir o filtro de área. 2. Atividades Reais: abrir o filtro de área. 3. Cadastrar uma atividade personalizada fictícia na área Números, escolher para a pessoa e registrar que concluiu. 4. Abrir Histórico e Resumo da pessoa. 5. Cadastrar outra personalizada sem área e usar normalmente.
- **Esperado:** "Números" aparece nos dois filtros; o filtro mostra estado vazio (ainda não há conteúdo de catálogo em Números, isso não é erro). No Histórico, a conclusão mostra "Área: Números". No Resumo, as áreas aparecem com o nome legível ("Números", "Memória e atenção"). A personalizada sem área continua funcionando.
- **Status:** PASS
- **Retorno:** responsável, 2026-11-26: aprovado; a área Números aparece.

### H12 — Ticket 09: os oito jogos com três trilhas (E5-HOM)
- **Preparação:** banco local com a carga oficial nova (120 fases); pessoa fictícia com Desenvolvimento.
- **Aparelho:** celular de 320 a 360 px.
- **Passos:** em cada jogo, jogar uma fase de cada trilha (por exemplo 2, 7 e 12) e pedir a dica duas vezes em uma delas.
- **Esperado:**
  - a dificuldade sobe de verdade de uma trilha para outra;
  - Palavra e figura: as opções aparecem sem nome e o nome surge depois do acerto;
  - Pares de sombras: a carta de sombra mostra só "Sombra";
  - Histórias: cada história tem uma ordem só, e ela faz sentido;
  - a 1ª dica orienta sem entregar e a 2ª mostra a resposta;
  - a Memória com 10 pares e as Histórias com 9 cenas cabem e são tocáveis;
  - as conquistas antigas continuam no Histórico.
- **Status:** PASS
- **Retorno:** responsável, 2026-11-26: homologação aprovada.

> Observação (2026-11-26): depois do H12, Palavra e figura, Pares de sombras, Ache o intruso e Complete a sequência foram arquivados a pedido do responsável (ticket 12). No H12, confira só os jogos que continuam ativos.

### H13 — Ticket 12: jogos novos (Sudoku, Forme a palavra, Do menor ao maior, Robô com setas)
- **Aparelho:** celular de 320 a 360 px.
- **Passos:** em cada jogo novo, jogar uma fase de cada trilha (por exemplo 2, 7 e 12) e pedir a dica duas vezes em uma delas; conferir que os quatro jogos antigos não aparecem mais na Biblioteca e que conquistas antigas deles continuam no Histórico.
- **Esperado:**
  - **Sudoku:** grade 4×4 e depois 6×6 cabe e é tocável; a fase só conclui com a grade certa.
  - **Forme a palavra:** a figura indica a palavra; nas fases maiores sobram letras.
  - **Do menor ao maior:** os números crescem até dezenas de milhar.
  - **Robô com setas:** dá para montar, executar, tirar um comando do meio e corrigir.
  - A dificuldade sobe de verdade entre as trilhas, e o conteúdo é adequado para 5 a 12 anos.
- **Status:** PASS
- **Retorno:** responsável, 2026-11-26: homologação aprovada.

### H14 — Ticket 13: Histórias em três degraus
- **Aparelho:** celular.
- **Passos:** jogar as fases 3 (com nome), 8 (só figura) e 13 (só figura, com intrusa).
- **Esperado:**
  - nas fases 6 a 10, as cenas aparecem sem texto e dá para deduzir a ordem pelas figuras;
  - nas fases 11 a 15, a cena intrusa claramente não pertence à história e precisa ficar de fora;
  - a dificuldade sobe a cada degrau;
  - a 1ª dica orienta e a 2ª diz a próxima cena.
- **Status:** PASS
- **Retorno:** responsável, 2026-11-26: homologação aprovada.

### H15 — Ticket 05: Biblioteca na faixa da pessoa
- **Preparação:** três pessoas fictícias com Desenvolvimento: 6, 8 e 11 anos.
- **Passos:**
  1. Abrir Biblioteca → Jogos com cada pessoa.
  2. Usar "Ver outras faixas" para abrir outra faixa e "Todas as faixas".
  3. Abrir uma fase e voltar ao catálogo.
- **Esperado:**
  - cada pessoa abre na sua faixa: Pequenos, Médios e Grandes, respectivamente;
  - as fases mostradas são só as da faixa, 5 por jogo;
  - a faixa escolhida continua depois de voltar da partida;
  - conquistas de outras faixas continuam visíveis ao abri-las.
- **Status:** FAIL — ticket 05 descartado
- **Retorno:** responsável, 2026-11-26: reprovado; a faixa de idade não deve filtrar os jogos, só priorizar as sugestões de Atividades Reais. Os jogos voltam ao comportamento anterior.

### H16 — Ticket 15: trilha em ordem e Dica no topo
- **Aparelho:** celular de 320 a 360 px.
- **Passos:** 1. Em um jogo novo para a pessoa, tocar no jogo e conferir que abre a fase 1. 2. Concluir a fase 1 e ver que a próxima é a 2. 3. Conferir que "Escolher fase" não aparece enquanto a trilha não termina. 4. Em um jogo com todas as fases concluídas, tocar no jogo e escolher qualquer fase. 5. Na partida, conferir o botão Dica ao lado de Sair e o título do jogo inteiro, sem quebra.
- **Esperado:** a trilha segue em ordem; "Escolher fase" só aparece com a trilha concluída; Dica no topo funciona nos dois níveis; o título não quebra.
- **Status:** PASS
- **Retorno:** responsável, 2026-11-26: homologação aprovada.

### H17 — Ticket 07: até cinco sugestões de Atividades Reais
- **Preparação:** pessoas fictícias de 6, 8 e 11 anos com Desenvolvimento.
- **Passos:**
  1. Em Atividades Reais, tocar em Sugerir brincadeiras.
  2. Renovar sugestões.
  3. Escolher uma sugestão.
  4. Conferir as atividades ativas.
- **Esperado:**
  - aparecem até cinco sugestões, adequadas à idade;
  - renovar troca até cinco;
  - não aparecem "Lembrete em três fotos", "Alongar ombros sentados", "Lista mental da feira" nem "Semana em ordem";
  - se alguma delas já estava escolhida antes, ela sai das ativas, mas as participações continuam no Histórico.
- **Status:** PENDING_HUMAN
- **Retorno:**
