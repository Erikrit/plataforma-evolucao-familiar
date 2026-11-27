# 05: Caminho de cores

**O que entregar:** Jogo de grade com a regra “só pise na cor indicada”, reaproveitando o motor de labirinto com a cor como restrição. Quinze fases em três trilhas: mais cores, caminhos mais longos e trocas de cor no percurso. O verificador confere que existe rota válida e mede as decisões no caminho.

**Bloqueado por:** nenhum

**Status:** PENDING_HUMAN — parte automática concluída; falta E5-HOM no celular

**Costura:** régua de jogos, check:cat-03, carga oficial e smoke:e5

**Risco:** medio

## Critérios

- [x] DEV-CAT-P01 — regra distinta de Caminhos e labirintos e de Entrega no jardim
- [x] Régua (Solução) — toda fase tem rota válida pela cor
- [ ] E5-ACE-10 — toque, teclado e cores identificadas também por símbolo (código verificado; falta conferir no aparelho)

## Conclusão técnica (2026-11-27)

- **Regra:** só se pisa na cor indicada (azul ●, verde ▲, amarelo ■, vermelho ♦). A casa de troca (↻) sempre pode ser pisada e muda a cor. I é a partida, F a chegada.
- **Motor `cores`:** é separado e reaproveita a grade e os auxiliares do labirinto, como o Robô. O labirinto não muda, e os contratos de partida são os mesmos.
- **Progressão:**

  | Trilha | Cores | Passos | Trocas |
  |---|---|---|---|
  | Pequenos | 2 | 6 a 10 | 0 |
  | Médios | 3 | 12 a 18 | 1 a 2 |
  | Grandes | 4 | 20 a 28 | 2 a 4 |

  As trocas são obrigatórias: sem elas não há rota. Os mapas vão de 5×5 a 9×8, cabendo em 320 px.
- **Régua:** rota pelo par (casa, cor); métricas de passos, decisões, cores e trocas.
- **check-e5:**
  - as 15 fases passam na validação do servidor;
  - seguir só a dica leva à chegada nos 30 mapas, sem pisar fora da cor.
- **Acessibilidade:** setas e teclado. Cada cor tem nome e símbolo; o status descreve a cor indicada e as casas em volta. O contraste do símbolo sobre o fundo fica entre 6,5 e 8,9.
- **Glossário:** "Cor indicada" e "Casa de troca" entram como PROPOSTA.
- **Portões (base `ac641ef`):**
  - QG-1 PASS: lint, typecheck, authz, check-e4, check-e5 e régua de jogos 44/44.
  - QG-2 PASS: build, authz, carga-trilhas, smoke-historico-resumo, smoke-e4 e smoke-e5.
  - Verificador PASS, inclusive no delta pós-revisão.
  - TDD: os testes da régua foram vistos vermelhos. As regras da web no check-e5 foram escritas depois do módulo.
- **Fingerprint:** `sha256:784402287c4dffc3e40265bdd708dfff8741bbbe1ea78cf46de49e1ac6ad8788`.
- **Julgamento a confirmar:** motor separado em vez de estender o `labirinto` ("reaproveitando o motor de labirinto").
- **Pendente (humano):** E5-HOM no celular. Pontos a olhar:
  - se dá para distinguir os fundos pastel;
  - o tamanho dos símbolos (cerca de 11 px em 320 px);
  - o ritmo dos Pequenos.

**mensagemCommit:**

```
feat(jogos): Caminho de cores

Jogo de grade em que só se pisa na cor indicada; casas de troca mudam
a cor no percurso. 15 fases em três trilhas (2, 3 e 4 cores; caminhos
de 6 a 28 passos; até 4 trocas), aprovadas pela régua com rota por
casa e cor. Cada cor tem nome e símbolo, com toque, teclado e dica
que leva à chegada em todos os mapas.
```
