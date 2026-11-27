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

## Decisão adiada para este ticket

- **Faixas de duração da matriz de cobertura** (até 10, até 20 e acima de 20 minutos), definidas no código sem base na especificação. Com as 60 atividades prontas, levar ao responsável se mantém, ajusta ou remove (decisão de 2026-11-27).

## Critérios

- [ ] Nenhum código sem uso nem duplicação relevante restante, com a lista do que foi removido ou unificado
- [ ] Comportamento preservado: QG-1 e QG-2 PASS com fingerprint, régua e smokes nos mesmos totais de antes
- [ ] Faixas de duração da matriz decididas pelo responsável e aplicadas
- [ ] Nenhuma mudança de banco destrutiva sem aprovação explícita
