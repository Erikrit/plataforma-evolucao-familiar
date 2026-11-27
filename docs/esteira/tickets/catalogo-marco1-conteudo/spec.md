# Catálogo ampliado — Marco 1, conteúdo e jogo 2D

**Demanda:** `DEV-CAT-M1-CONTEUDO` · **Tipo:** nova funcionalidade (conteúdo, motores e 2D) · **Origem:** humano · **Status:** READY — direção e divisão em tickets aprovadas pelo responsável pelo Produto em 2026-11-26.

**Base:** `develop` @ `3dd147f` (fundação DEV-CAT-M1 concluída). **Fonte funcional:** Módulo 03 §15 v1.9 (Marcos, 12 jogos novos e Barquinho no rio).

## Problema

A fundação do catálogo está pronta, mas a Biblioteca tem só 8 jogos ativos e 20 Atividades Reais, sem nenhuma atividade de Números e sem a ficha padrão da régua (passos, variações, versão para brincar sentado e segurança por faixa). O Marco 1 aprovado pede 20 jogos, 60 atividades e um jogo 2D.

## Solução

- **Atividades Reais:** ficha padrão com campos estruturados, verificador próprio (régua de atividades e matriz de cobertura), revisão das 20 atuais e 40 novas, chegando a cerca de 20 por faixa e cobrindo as sete áreas.
- **12 jogos novos** com 15 fases em três trilhas, aprovados pela régua: reaproveitando motores (memória, escolha, labirinto, ordenação) e quatro motores novos (contagem, classificar em caixas, diferenças e traçado).
- **Barquinho no rio**, o primeiro jogo 2D: um teste técnico curto decide a biblioteca e mede desempenho e acessibilidade; depois, o jogo completo com 15 fases. Ele fecha o Marco 1.

## Requisitos

- DEV-CAT-P01, P03, P07, P08 e a régua de qualidade — M03 §15 — APROVADO
- Marco 1 (conteúdo) e lista dos 12 jogos — M03 §15, Marcos — APROVADO (2026-11-26)
- Barquinho no rio — M03 §15, Marcos — APROVADO (2026-11-26)
- E5-F03 a F08, E5-ACE-02 a 12 — M03 §13 — vigentes
- §12 (descoberta por botão, limite de dez por categoria, separação entre descobertas digitais e estrelas) — vigente

## Decisões de implementação

- **Ficha padrão estruturada.** `DesafioCatalogo` ganha campos editoriais: `passos` (1 a 3), `variacaoFacil`, `variacaoDificil`, `adaptacaoSentado`, `seguranca` (lista por faixa), `lugar` (dentro de casa, área externa, ambos) e `pessoas` (mínimo e máximo). `instrucao`, `materiais`, `adaptacoes` e `supervisao` são mantidos ou migrados para os novos campos, a critério de Arquitetura no ticket 01.
- **Banco.** Mudanças de schema são permitidas com migração versionada e instalação do zero coerente. O banco da VPS de testes pode ser limpo e recriado pelo responsável na publicação (M03 §15 e `docs/agents/projeto.md`); não é preciso preservar dados gravados na VPS.
- **Motores novos.** Cada motor declara as próprias métricas de dificuldade para a régua e tem verificador de solução (resposta única, rota possível, figura completa).
- **Cenas de diferenças.** Montadas a partir das ilustrações Twemoji locais, em grade com posições sorteadas de forma determinística por variante. Não usam imagens externas.
- **2D.** Biblioteca escolhida no teste técnico (Phaser ou PixiJS), carregada só quando o jogo abre. O jogo implementa o contrato único de tabuleiro (`contrato-tabuleiro.ts`): montar, dica sob demanda e aviso de conclusão. Os contratos de servidor de início, conclusão e versão não mudam.
- **ADR-017** (trilhas e faixa, em proposta na spec de DEV-CAT-M1) segue para aprovação de Arquitetura; o ticket 10 propõe a ADR do 2D.

## Costuras e testes

| Costura | Pega | Deixa passar | Testes semelhantes |
|---|---|---|---|
| Régua de jogos (sem banco) | Fase sem solução, mais de uma resposta, progressão que não cresce, rótulo que entrega a resposta, figura e nome divergentes | Diversão percebida | `regua:jogos`, `test:regua`, `check:e5`, `check:cat-03`, `check:cat-04` |
| Régua de atividades (sem banco) | Ficha incompleta, mais de três passos, segurança faltando por faixa, matriz de cobertura com buracos, nomes repetidos | Qualidade do texto | `check:e4` |
| Carga oficial em banco descartável | Totais (20 jogos ativos, 300 fases, 60 atividades ativas), idempotência | Tela | carga oficial executada duas vezes |
| API (smokes) | Partida, conclusão, sugestões pela faixa, isolamento, autorização | Leiaute | `smoke:e5`, `smoke:e4`, `smoke:authz` |
| 2D no celular | Fluidez, toque, teclado, movimento reduzido, saída visível | — | roteiro de homologação |

## Riscos e dependências

- **Médio:** volume editorial (40 atividades e 180 fases). Por isso a régua de atividades vem primeiro e as atividades são entregues em dois lotes.
- **Alto:** o jogo 2D (desempenho em Android simples, tamanho do download e acessibilidade em canvas). Por isso há um teste técnico com critério de parada antes do jogo completo.
- Os contadores fixos das checagens (`oficial 8/120` no `check:cat-04` e os totais da carga) mudam a cada lote de jogos; cada ticket atualiza os seus.

## Fora do escopo

Marco 2, outros jogos 2D, narração por voz, ranking, metas, notificações, avaliação cognitiva, IA na partida, anúncios e multijogador.

## Execução no Claude Code

Cada ticket começa em sessão nova, na `develop` atualizada. Divisão aprovada em 2026-11-26: todos os tickets estão `READY`; respeite a coluna “Depende de”.

| Ticket | Comando | Depende de |
|---|---|---|
| 01 | `/implementar docs/esteira/tickets/catalogo-marco1-conteudo/01-ficha-padrao-e-regua-de-atividades.md` | — |
| 02 | `/implementar docs/esteira/tickets/catalogo-marco1-conteudo/02-atividades-lote-1.md` | 01 |
| 03 | `/implementar docs/esteira/tickets/catalogo-marco1-conteudo/03-atividades-lote-2.md` | 02 |
| 04 | `/implementar docs/esteira/tickets/catalogo-marco1-conteudo/04-jogos-memoria-e-escolha.md` | — |
| 05 | `/implementar docs/esteira/tickets/catalogo-marco1-conteudo/05-caminho-de-cores.md` | — |
| 06 | `/implementar docs/esteira/tickets/catalogo-marco1-conteudo/06-motor-contagem.md` | — |
| 07 | `/implementar docs/esteira/tickets/catalogo-marco1-conteudo/07-motor-classificar.md` | — |
| 08 | `/implementar docs/esteira/tickets/catalogo-marco1-conteudo/08-motor-diferencas.md` | — |
| 09 | `/implementar docs/esteira/tickets/catalogo-marco1-conteudo/09-motor-tracado.md` | — |
| 10 | `/implementar docs/esteira/tickets/catalogo-marco1-conteudo/10-teste-tecnico-2d.md` | — |
| 11 | `/implementar docs/esteira/tickets/catalogo-marco1-conteudo/11-barquinho-no-rio.md` | 10 |
| 12 | `/homologar DEV-CAT-M1-CONTEUDO` | 01 a 11 |

Verificação com banco e API locais, a cada ticket que toque API, carga ou smokes:

```bash
bash scripts/verificar-local.sh DEV-CAT-M1-CONTEUDO 3dd147f qg1 qg2
```

Lembretes:

- Falhas anteriores, iguais na base: `check:e2` (`boas_vindas_sem_envio`) e `smoke:e1-ent` (`E1-ENT-02-colisao-slug`).
- Dados sempre fictícios. A limpeza do banco da VPS é feita pelo responsável, nunca pelo agente.
- Ao concluir cada ticket, entregar a `mensagemCommit` (skill `entrega`) e atualizar o status no arquivo do ticket.
