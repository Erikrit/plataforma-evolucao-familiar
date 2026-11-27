# 11: Barquinho no rio (jogo 2D completo)

**O que entregar:** Jogo 2D com 15 fases em três trilhas: rio mais longo, canal mais estreito, mais pedras, curvas e correnteza leve. Sem tempo, sem vidas e sem perder: bater numa pedra só desvia o barco. A fase termina ao chegar na margem final; as folhas são opcionais e não bloqueiam a conclusão. A régua ganha métricas do motor 2D (comprimento, largura mínima do canal, densidade de pedras, curvas) e verifica que existe rota possível. Dica mostra a direção livre mais próxima.

**Bloqueado por:** 10

**Status:** BLOCKED — homologação humana reprovada em 2026-11-27; jogo desativado (`ativo: false`) até a revisão depois do Marco 1

**Costura:** régua de jogos, check:e5, carga oficial, smoke:e5 e homologação

**Risco:** alto

## Critérios

- [x] DEV-CAT-P03 — 15 fases em três trilhas com dificuldade crescente medida pela régua
- [x] Régua (Solução) — toda fase tem rota possível com a largura do barco, e nenhuma casa alcançável é beco sem saída
- [x] E5-F04 — dica útil no estado atual (seguindo só a dica, o barco chega nos 30 rios)
- [ ] E5-ACE-10 — toque, teclado, movimento reduzido e saída sempre visível (código verificado; falta conferir no aparelho)
- [ ] E5-HOM — homologação no celular nas três trilhas (**reprovada** em 2026-11-27; jogo desativado)

## Conclusão técnica (2026-11-27)

- **Entregue:**
  - motor `barquinho` no servidor: valida a correnteza (0,5 a 2), o rio e o barco único, e mantém os contratos de início, conclusão e versão;
  - 15 fases com 2 rios cada, em `catalogo-jogos-barquinho-e5.mjs`;
  - na partida, o `TabuleiroBarquinho` em PixiJS (ADR-018), carregado por `React.lazy` só quando a partida é do Barquinho;
  - o catálogo fica com 11 jogos ativos.
- **Progressão (comprimento/estreitamento/pedras %/curvas/correnteza):** de 20/3/3/1/1,0 até 56/6/17/14/1,4. Nenhuma medida cai de uma fase para a outra.
- **Régua:**
  - rota até a margem e nenhum beco sem saída; isso pegou 52 becos no primeiro conteúdo gerado;
  - métricas do motor 2D;
  - variante que é só espelho reprova.
- **Sem tempo, sem vidas, sem perder:** a pedra só desvia o barco. Sem saída à frente, o barco espera a criança virar. As folhas são opcionais.
- **Peso:** o PixiJS só vem sob demanda. A tela de jogar ficou +1,58 kB (gzip), dentro da folga de 2 kB aprovada pelo responsável.
- **Portões (base `17006f3`):**
  - QG-1 PASS: lint, typecheck, authz, check-e4, check-e5 e régua de jogos 39/39.
  - QG-2 PASS: build, authz, carga-trilhas, smoke-historico-resumo, smoke-e4 e smoke-e5.
  - check-peso-2d PASS.
  - Verificador PASS, inclusive no delta pós-revisão.
- **Fingerprint:** `sha256:1aadadd03cbf8cf5271b9400bc0982dd913d58da3c1f12b30c779db6aa58b4f4`.
- **Decisão do responsável:** seguir sem a medição numérica de fluidez no Android (ADR-018).
- **Homologação (2026-11-27):** reprovada pelo responsável, sem motivo detalhado. Decisão: desativar o jogo (`ativo: false` no catálogo) e revê-lo depois de completar o Marco 1. Código, conteúdo, régua e laboratório ficam. A carga não oferece o jogo, o smoke confere que ele fica fora do catálogo, e o catálogo volta a 10 jogos ativos.
- **Portões após a desativação:**
  - QG-1 PASS: lint, typecheck, authz, check-e4, check-e5 e régua de jogos 39/39.
  - smoke-e5 PASS: 50 checagens, rodado contra a API local.
  - O QG-2 completo (com build) fica pendente: os dev servers do responsável estavam no ar. Comando: `bash scripts/verificar-local.sh DEV-CAT-M1-CONTEUDO 17006f3 qg1 qg2`.
- **Fingerprint após a desativação:** `sha256:ae3ab89ce9b4ba20733d40dca3f9b11c4ec2349b6eb269684787a6cc75ea12d5`.

**mensagemCommit:**

```
feat(jogos): Barquinho no rio 2D, desativado até revisão

Jogo 2D em PixiJS (ADR-018) com 15 fases, motor no servidor e régua
com rota, sem becos sem saída e métricas do 2D. A homologação humana
reprovou o jogo; ele fica com ativo: false e será revisto depois de
completar o Marco 1. Código e conteúdo permanecem; o catálogo segue
com 10 jogos ativos.
```
