# 08: Contrato único de tabuleiro e dica recalculada

**O que entregar:** Cada tabuleiro implementa montar, dica sob demanda e aviso de conclusão. A dica é recalculada a cada abertura no estado atual da partida (corrige a dica fixa no labirinto, na entrega e na memória). Contratos de servidor não mudam.

**Bloqueado por:** nenhum

**Status:** COMPLETED

**Costura:** check:e5 e roteiro no celular

**Risco:** medio

## Critérios

- [x] E5-F04 — no labirinto, andar dois passos e pedir a dica de novo mostra a direção atual
- [x] E5-ACE-02 — concluir com dica produz o mesmo resultado (objetivos: PASS; H9 PASS)
- [x] E5-ACE-10 — toque, teclado e movimento reduzido preservados

## Pendências

- E5-F04 e E5-ACE-10: confirmar no celular (andar dois passos e pedir a dica de novo; toque, teclado e movimento reduzido).

## Homologação

H6 (dica recalculada), H7 (toque, teclado e movimento reduzido), H8 (regressão) e H9 (dica e conclusão com ajuda): PASS, responsável, 2026-11-26.
