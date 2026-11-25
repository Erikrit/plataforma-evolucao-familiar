# 04: Data de nascimento exigida para Desenvolvimento

**O que entregar:** Conceder Desenvolvimento pede a data de nascimento quando falta. Abrir Desenvolvimento de pessoa sem data orienta o responsável autorizado a informá-la antes de continuar. API direta aplica a mesma regra. Cadastro só com nome e Cuidados não mudam.

**Bloqueado por:** nenhum

**Status:** IN_VALIDATION

**Costura:** smoke:authz e smoke de Desenvolvimento

**Risco:** alto

## Critérios

- [x] FF-NASC-ACE-01 — criar pessoa só com nome continua possível
- [x] FF-NASC-ACE-02 — concessão sem data pede a data e só conclui após persistir
- [x] FF-NASC-ACE-03 — pessoa existente sem data é orientada, sem perda de progresso
- [ ] FF-NASC-ACE-04 — corrigir a data muda a faixa sem reescrever registros

## Pendências

- FF-NASC-ACE-04: a parte “muda a faixa padrão” depende do ticket 05; correção sem reescrever registros já verificada. Corrigir data existente só pela API (sem tela).
- `smoke:authz` e smokes pelo `qg.mjs` com Docker na máquina do responsável (no agente: BLOCKED por falta de Docker; PASS em ambiente alternativo).
- Homologação humana no celular.
