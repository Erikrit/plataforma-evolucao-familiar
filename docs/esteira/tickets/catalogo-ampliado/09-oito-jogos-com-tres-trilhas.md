# 09: Os oito jogos atuais com três trilhas

**O que entregar:** Recuração dos sete jogos restantes com 15 fases cada, aprovada pela régua: nomes ocultos em Palavra e figura e nas silhuetas de Pares de sombras, intruso sem rótulo que entrega, Entrega com curva crescente e mapas próprios, Histórias sem ordem ambígua, Memória e Sequência com progressão real. Versão de cada jogo sobe; conquistas preservadas.

**Bloqueado por:** 03, 08

**Status:** COMPLETED

**Costura:** verificador de catálogo, carga oficial e homologação

**Risco:** medio

## Critérios

- [x] DEV-CAT-P01 e P03 — 8 jogos, 120 fases, todas aprovadas pela régua
- [x] E5-ACE-12 — conquistas anteriores preservadas após a troca de versão
- [x] E5-HOM — homologação humana no celular, pelas três faixas (PASS, responsável, 2026-11-26)
- [x] Régua de qualidade (Dica) — dica de escolha, sequência e memória não entrega a resposta no primeiro nível (achado do verificador em 2026-11-25)

## Implementação (2026-11-26)

- **Decisões do responsável:** desempate por semelhança (figuras do mesmo grupo; em Histórias, a pista sai); nomes ocultos em Palavra e figura (leitor de tela anuncia "Figura N", nome após o acerto) e sombra só com "Sombra"; dica em dois níveis.
- **Conteúdo:** 7 jogos na v2, 15 fases × 2 variantes, gerados com semente e congelados; labirinto segue na v3. Régua estrita: 8 jogos, 120 fases, 0 falhas.
- **Código:** régua (grupos, `semelhanca`, `semPista`, regra `dica`, rótulo com `ocultarNomes`, 51 figuras novas no vocabulário); `ocultarNomes` no motor de escolha; `dicas-jogos.ts` (escolha, sequência, memória e Histórias em dois níveis) nos tabuleiros.
- **Evidências:** QG-1 PASS `qg1-2026-11-26T15-49-32-898Z.json`; QG-2 PASS (build, authz, carga-trilhas, smoke-e5, smoke-e4, histórico) `qg2-2026-11-26T15-52-42-271Z.json`; `check:cat-03` e `check:cat-04` PASS; fingerprint `sha256:8b30ca62f2c16caac44fc18ff16c9c382f7997b42431de3215fd223039f850df`. Verificador PASS após FAIL corrigido (histórias com ordem ambígua reescritas). Revisão: sem violações; ajustes de estilo aplicados.
- **Observações para a homologação:** Ache o intruso alterna distratores distantes e parecidos; o 1º nível da dica de sequência indica a posição da peça a copiar; algumas pistas de Histórias apontam o começo.
- **PENDING_HUMAN:** E5-HOM, H12 do roteiro.

**mensagemCommit:**

```
feat(jogos): oito jogos com três trilhas e quinze fases aprovadas pela régua

Os sete jogos restantes ganham 15 fases em três trilhas (v2), com dificuldade
crescente medida pela régua, nomes ocultos em Palavra e figura, sombras sem nome,
histórias de ordem única e dicas em dois níveis (DEV-CAT-M1, ticket 09).
```

- **Homologação (2026-11-26):** aprovada pelo responsável; commit `33af7ea`.
