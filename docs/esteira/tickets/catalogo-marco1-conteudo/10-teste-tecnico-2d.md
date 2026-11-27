# 10: Teste técnico do 2D (Barquinho no rio, uma fase)

**O que entregar:** Comparar Phaser e PixiJS com um protótipo de uma fase do Barquinho no rio, carregado só ao abrir o jogo e implementando o contrato de tabuleiro. Medir em Android simples: fluidez, peso do download, tempo para abrir, toque, teclado, movimento reduzido e saída visível. Propor a ADR do 2D com a escolha. **Critério de parada:** se nenhuma biblioteca atingir as metas, o ticket termina com a recomendação e o 11 volta para planejamento.

**Bloqueado por:** nenhum

**Status:** COMPLETED — aprovado provisoriamente pelo responsável em 2026-11-27, sem medições numéricas no Android

**Costura:** build, check:e5 e medição no celular

**Risco:** alto

## Critérios

- [x] ADR do 2D proposta com medições comparadas (ADR-018 APROVADA em 2026-11-27: PixiJS; peso medido, fluidez só qualitativa)
- [x] Peso adicional carregado só no jogo 2D; Biblioteca e demais jogos com no máximo 1,5 kB gzip a mais (mapa de pedaços sob demanda do webpack; decisão do responsável em 2026-11-27)
- [x] Fluidez aceitável em Android simples — **aprovação provisória** do responsável; ele decidiu seguir com o ticket 11 sem a medição numérica
- [x] E5-ACE-10 — toque, teclado e movimento reduzido no protótipo (código verificado; aprovação provisória no aparelho)

## Conclusão (2026-11-27)

- **Origem:** o trabalho veio da worktree `t10-teste-tecnico-2d` (execução paralela, base `4a5bfc5`), foi trazido para a `develop` @ `e9cf16f` e revalidado aqui.
- **Entregue:**
  - protótipo de uma fase do Barquinho com PixiJS e Phaser, carregados por `import()`;
  - simulação sem biblioteca, testada no `check-e5`: sem tempo, sem vidas, pedra que desvia o barco, movimento reduzido;
  - laboratório `/laboratorio/barquinho`, que só existe com `PEF_LABORATORIO_2D=1` e não grava dados;
  - `check-peso-2d`.
- **Medições:** sob demanda, PixiJS ~112 kB e Phaser ~347 kB gzip; telas existentes com no máximo +1,13 kB, dentro da folga de 1,5 kB decidida pelo responsável.
- **ADR-018 (APROVADA em 2026-11-27):** PixiJS. Com a aprovação, o Phaser saiu do `package.json` e do código: o renderizador Phaser foi removido, o tabuleiro carrega o PixiJS direto e o laboratório mede só o PixiJS.
- **Portões (base `e9cf16f`):** QG-1 PASS (lint, typecheck, check-e4, check-e5); QG-2 PASS (build, smoke-e5). Verificador: parte automática conferida; a decisão sobre o peso foi do responsável.
- **Fingerprint:** `sha256:71cdb0e91768c6c4b42cd110233d151061186d9f3b2e751dca648c895f35709d` (depois da remoção do Phaser; QG-1 e QG-2 PASS; peso: 36 rotas com no máximo +1,1 kB).
- **Ressalva:** a fluidez, o toque e o movimento reduzido em Android foram aprovados provisoriamente, sem números. O responsável decidiu seguir com o ticket 11 sem a medição.

**mensagemCommit:**

```
feat(jogos): teste técnico do 2D com protótipo do Barquinho no rio

Uma fase do Barquinho comparando PixiJS e Phaser, com simulação
testada (sem tempo, sem vidas, movimento reduzido) e laboratório
protegido por variável de ambiente. Peso medido e checado por
script; ADR-018 aprovada escolhe o PixiJS, carregado só ao abrir o
jogo, e o Phaser sai. Fluidez em Android aprovada provisoriamente.
```
