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
- **Status:** PENDING_HUMAN
- **Retorno:** quem / quando / resultado / observação

### H2 — FF-NASC-ACE-03: pessoa existente sem data é orientada
- **Preparação:** pessoa fictícia que já tinha Desenvolvimento e progresso antes desta versão, sem data de nascimento (preparada pela equipe).
- **Aparelho:** celular.
- **Passos:** 1. Abrir Desenvolvimento dessa pessoa. 2. Seguir a orientação e informar a data. 3. Voltar à Biblioteca e aos jogos.
- **Esperado:** orientação clara antes de continuar; depois de informar, estrelas, atividades executadas e fases concluídas continuam iguais.
- **Status:** PENDING_HUMAN
- **Retorno:**

### H3 — FF-NASC-ACE-01 e regressão de Cuidados
- **Passos:** 1. Criar uma pessoa só com o nome. 2. Abrir Cuidados dessa pessoa com um responsável autorizado.
- **Esperado:** cadastro concluído sem pedir data; Cuidados funciona sem data.
- **Status:** PENDING_HUMAN
- **Retorno:**

### H4 — Acesso negado
- **Preparação:** conta fictícia com acesso só a Cuidados de outra pessoa.
- **Passos:** abrir o endereço de Desenvolvimento de "Teste Sem Data" diretamente.
- **Esperado:** sem acesso, e sem revelar a data nem o progresso.
- **Status:** PENDING_HUMAN
- **Retorno:**

### H5 — Falha de rede sem falso sucesso
- **Passos:** no fluxo de H1 ou H2, ativar o modo avião antes de salvar a data e tentar salvar.
- **Esperado:** mensagem de que não foi salvo; nada aparece como concluído; ao voltar a rede, salvar funciona.
- **Status:** PENDING_HUMAN
- **Retorno:**

### H6 — E5-F04: dica recalculada no estado atual
- **Aparelho:** celular.
- **Passos:** 1. Labirinto: pedir a dica, andar dois passos e pedir de novo. 2. Repetir a ideia na Entrega e na Memória, avançando antes do segundo pedido.
- **Esperado:** a segunda dica corresponde à posição ou ao estado atual, não à do início.
- **Status:** PENDING_HUMAN
- **Retorno:**

### H7 — E5-ACE-10: toque, teclado e movimento reduzido
- **Aparelho:** celular para o toque; computador para o teclado; movimento reduzido ativado no sistema.
- **Passos:** concluir uma fase de Labirinto e uma de Memória em cada modo e sair pelo botão de saída.
- **Esperado:** foco visível no teclado; toque responde; com movimento reduzido, sem animações intensas; saída sempre disponível.
- **Status:** PENDING_HUMAN
- **Retorno:**

### H8 — Regressão de partida
- **Passos:** concluir uma fase de um jogo não alterado, sair e reabrir o jogo.
- **Esperado:** o jogo abre na próxima fase ainda não concluída, e o saldo de estrelas não muda (jogos não movimentam estrelas).
- **Status:** PENDING_HUMAN
- **Retorno:**

### H9 — E5-ACE-02: dica acessível e conclusão com ajuda
- **Passos:** em Labirinto, Entrega e Memória, usar a dica até concluir uma fase; em outra fase, concluir sem dica.
- **Esperado:** dica fácil de achar e entender; a conclusão com dica tem o mesmo resultado (fase concluída e progresso) que a conclusão sem dica.
- **Status:** PENDING_HUMAN
- **Retorno:**

## Fora do alcance local
- Mudança de faixa padrão (FF-NASC-ACE-04, parte 2): ticket 05, aguarda D1.
- Versão efetivamente publicada na VPS: conferir o commit implantado antes de homologar lá.
