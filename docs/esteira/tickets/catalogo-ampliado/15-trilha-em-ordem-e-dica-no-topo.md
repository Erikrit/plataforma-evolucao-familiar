# 15: Trilha em ordem e botão de dica ao lado de Sair

**O que entregar:** (1) a criança segue a trilha na ordem: antes de concluir todas as fases de um jogo, só a próxima fase pendente abre; as demais aparecem bloqueadas em Escolher fase e a API recusa abri-las. Concluída a trilha inteira, qualquer fase abre para repetir. (2) Na partida, o botão Dica sobe para o topo, ao lado de Sair, para o título do jogo não quebrar. Pedido do responsável em 2026-11-26, depois do H15.

**Bloqueado por:** nenhum

**Status:** IN_VALIDATION

**Costura:** smoke:e5 e homologação no celular

**Risco:** medio

## Critérios

- [x] Trilha em ordem — com a fase 1 pendente, a fase 2 é recusada; concluída a fase 1, a fase 2 abre; concluídas todas, qualquer fase abre
- [x] Escolher fase só aparece depois de concluir a trilha inteira (pedido do responsável); antes disso, tocar no jogo abre a próxima fase pendente
- [ ] Dica no topo, ao lado de Sair; o título do jogo não quebra a 320 px

## Implementação (2026-11-26)

- **API:** `faseLiberada` libera só a primeira fase pendente ou, com a trilha concluída, qualquer uma; `listar` devolve `liberada` por fase; `iniciar` recusa fora da ordem com 409 `FASE_BLOQUEADA` ("Siga a trilha: conclua a fase N antes desta").
- **Web:** "Escolher fase" só aparece com a trilha concluída (na Biblioteca e na partida); tocar no jogo abre a próxima pendente. Dica fica na barra, ao lado de "Sair do jogo"; o título do jogo ocupa a largura toda.
- **Também:** o código do ticket 05 (faixa nos jogos) foi desfeito, por decisão do responsável após o H15.
- **Evidências:** QG-1 PASS `qg1-2026-11-26T19-58-14-350Z.json`; QG-2 PASS (authz, smoke-e5 com a trilha em ordem) `qg2-2026-11-26T20-00-32-250Z.json`; fingerprint `sha256:db5a5941ff64745f2ead961838ff7eb67e6f3d9a5e7c41c66c47885d5b115e06`. Verificador: trava aprovada; critério 2 ajustado ao pedido do responsável (botão invisível até o fim da trilha).
- **PENDING_HUMAN:** H16 (Dica no topo e título a 320 px).

**mensagemCommit:**

```
feat(jogos): trilha em ordem e Dica ao lado de Sair

Os jogos deixam de filtrar por faixa de idade (H15 reprovado): a criança segue
a trilha, só a próxima fase pendente abre e Escolher fase aparece ao concluir
tudo; o botão Dica sobe para a barra, ao lado de Sair (DEV-CAT-M1, tickets 05 e 15).
```
