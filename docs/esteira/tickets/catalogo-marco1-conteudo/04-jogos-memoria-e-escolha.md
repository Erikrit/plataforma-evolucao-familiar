# 04: Letra inicial e Adivinha pela pista

**O que entregar:** Letra inicial e Adivinha pela pista, reaproveitando o motor de escolha, sem rótulo que entregue a resposta e com dica em dois níveis. Cada um tem 15 fases em três trilhas aprovadas pela régua, e a dificuldade sobe de verdade. *(Escopo original: quatro jogos, com Mãe e filhote e Metades. Os dois saíram; ver abaixo.)*

**Bloqueado por:** nenhum

**Status:** PENDING_HUMAN — refeito após a homologação reprovada; falta nova E5-HOM no celular

**Costura:** régua de jogos, check:e5, carga oficial e smoke:e5

**Risco:** medio

**Escopo alterado (2026-11-27):** o responsável tirou **Mãe e filhote** (filhotes com o emoji de rosto do adulto e nomes de mesma raiz) e, depois da homologação, **Metades** (parecido demais com a Memória). Os dois serão substituídos depois do Marco 1. O catálogo fica com 10 jogos ativos.

**Decisões da revisão (2026-11-27):** na escolha com nomes ocultos, o leitor de tela ouve o nome da figura ("Figura N: nome"), como texto equivalente (E5-ACE-10).

**Homologação reprovada (2026-11-27):** a dificuldade não subia nos jogos novos, e o Metades se parecia demais com a Memória. Decisões do responsável:
- Metades sai, como Mãe e filhote. Os dois serão substituídos depois do Marco 1, e o catálogo fica com 10 jogos ativos.
- Letra inicial e Adivinha pela pista foram refeitos com distrações cada vez mais parecidas com a resposta:
  - Pequenos: começam com sons e tipos bem diferentes; nas últimas fases entram uma ou duas distrações parecidas.
  - Médios: sons vizinhos (B/P, F/V, T/D, C/G, M/N; L/R fica de fora, porque o R inicial não soa como L) e figuras do mesmo tipo, em pelo menos metade das distrações.
  - Grandes: sílaba com todas as figuras começando pela mesma letra; na pista, todas as figuras são do mesmo tipo, cada traço sozinho serve para mais de uma e as respostas não repetem as das trilhas anteriores.
- A régua passa a medir isso (`parecidas` e `dificuldade-trilha`).

## Critérios

- [x] DEV-CAT-P01 e P03 — dois jogos com regra própria e 15 fases aprovadas pela régua, com dificuldade que sobe de verdade (Mãe e filhote e Metades saíram; ver Escopo alterado)
- [x] Régua (Rótulos) — nenhum texto visível entrega a resposta
- [ ] E5-HOM — homologação no celular nas três trilhas


## Conclusão técnica (2026-11-27, após a homologação reprovada)

- **Entregue:** Letra inicial e Adivinha pela pista, com 15 fases, duas variantes por fase e nomes ocultos até o acerto. A dica tem dois níveis, e o catálogo fica com 10 jogos ativos.
- **Dificuldade (opções/parecidas por fase):**
  - Letra inicial: 2/0 3/0 3/1 4/1 4/2 | 5/2 5/3 6/3 6/4 6/5 | 7/6 7/6 8/7 8/7 8/7.
  - Adivinha pela pista: igual nos Pequenos e Médios; nos Grandes, 7/6 8/7 9/8 10/9 11/10.
  - Nos Grandes da Adivinha, cada traço sozinho serve para mais de uma figura, e as respostas são inéditas na trilha.
- **Régua:**
  - `parecidas` conta sons vizinhos B/P, F/V, T/D, C/G e M/N, a mesma letra na sílaba e o mesmo grupo na pista.
  - `dificuldade-trilha`: nos Médios, pelo menos metade das distrações são parecidas; nos Grandes, todas; sem queda dentro da trilha e com média crescente entre as trilhas.
  - A régua reprovava o conteúdo antigo com 18 falhas.
- **Retirados:** Mãe e filhote e Metades. Motor de memória e web voltaram à base.
- **Acessibilidade:** "Figura N: nome" no leitor de tela (E5-ACE-10).
- **Portões (base `421e958`):**
  - QG-1 PASS: lint, typecheck, authz, check-e4, check-e5 e régua de jogos 33/33.
  - QG-2 PASS: build, authz, carga-trilhas, smoke-e4 e smoke-e5.
  - Verificador PASS, depois de um FAIL corrigido (pista do Limão, Grandes com traço único e L/R).
- **Fingerprint:** `sha256:f9f9259a411c56e01dd9d3af4349f08e0d96e51cc620be300bb301786be2b064`.
- **Ambiente:** no banco local, `mae-filhote` e `metades` foram desativados à mão (`ativo = false`).
- **Pendente (humano):** nova E5-HOM no celular nas três trilhas dos dois jogos.

**mensagemCommit:**

```
feat(jogos): Letra inicial e Adivinha pela pista com dificuldade real

Dois jogos novos do Marco 1, com 15 fases em três trilhas. As
distrações ficam cada vez mais parecidas com a resposta: sons
vizinhos e mesma letra na Letra inicial; figuras do mesmo tipo e
traços combinados na Adivinha. A régua passa a medir isso por trilha.
Leitor de tela ouve o nome da figura na escolha com nomes ocultos.
Mãe e filhote e Metades saíram e serão substituídos depois do Marco 1.
```
