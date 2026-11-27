# 13: Refatoração geral — código duplicado e sem uso

**O que entregar:** Varredura do projeto inteiro (`apps/api`, `apps/web`, `scripts/`) removendo código duplicado e sem uso, sem mudar comportamento. Cada remoção ou unificação é coberta pelos portões existentes; o que não tiver cobertura ganha teste antes de mudar.

**Bloqueado por:** 01 a 11 (roda depois de toda a implementação do Marco 1 e antes do encerramento no 12)

**Status:** READY — pedido pelo responsável em 2026-11-27, na homologação do ticket 01

**Costura:** QG-1 e QG-2 completos (lint, typecheck, build, checks e smokes com banco e API locais)

**Risco:** medio

## Pontos já conhecidos (revisão do ticket 01)

- Faixas Pequenos/Médios/Grandes definidas em vários lugares: `lib-regua-atividades.mjs`, `ficha-padrao.ts`, `ficha-atividade.tsx`, `apps/web/src/lib/api.ts` e `NOMES_TRILHA` em `apps/web/src/lib/trilhas-jogos.ts`.
- Valores de `lugar` repetidos na régua, em `ficha-padrao.ts`, na migração e na web.
- Tipo `DesafioCatalogo` repete os campos de `LinhaFicha`; `smoke-e4` reimplementa parte da checagem da ficha.
- Exports sem uso, como `FAIXAS_FICHA` fora de `ficha-padrao.ts`.
- `check-e4` valida por busca de trechos de texto, o que é frágil.
- Do ticket 02: teto `LIMITE_CATALOGO_ATIVO` (60) espelhado em `constantes-desenvolvimento.ts`, no texto procurado pelo `check-e4` e em `smoke-e4`; totais 40/44 soltos em `carga-oficial`, `check-e4`, `qg-cat-01` e no teste da régua; filtros `ativo !== false` repetidos fora da régua.
- Do ticket 03: totais 60/4 também em `qg-cat-trilhas`; o `where` Prisma `{ familiaId: null, origem: "catalogo" }` repetido entre `qg-cat-trilhas` e `qg-cat-01`.
- Do ticket 04: `qg-cat-01` confere `jogos === 8`, desatualizado desde DEV-CAT-M1 (a base já tinha 12 jogos) e fora dos portões; `check-cat-04` diz “oficial 8/120” sobre o subconjunto antigo.
- Do ticket 04 (régua): a divisão por `inicio`/`pista` na escolha se repete em cinco pontos (rótulo, dica, letra inicial, distrações parecidas, regra por trilha); a normalização do início aparece duas vezes; a checagem de fonte do `aria-label` em `check-e5` procura o literal exato.
- Do ticket 04 (comportamento a decidir): a carga oficial faz upsert e não desativa um jogo que saiu do catálogo. No banco local, o `mae-filhote` carregado antes da retirada ficou ativo e foi desativado à mão (`ativo = false`).

## Decisão adiada para este ticket

- **Faixas de duração da matriz de cobertura** (até 10, até 20 e acima de 20 minutos), definidas no código sem base na especificação. Com as 60 atividades prontas, levar ao responsável se mantém, ajusta ou remove (decisão de 2026-11-27).

## Critérios

- [ ] Nenhum código sem uso nem duplicação relevante restante, com a lista do que foi removido ou unificado
- [ ] Comportamento preservado: QG-1 e QG-2 PASS com fingerprint, régua e smokes nos mesmos totais de antes
- [ ] Faixas de duração da matriz decididas pelo responsável e aplicadas
- [ ] Nenhuma mudança de banco destrutiva sem aprovação explícita
