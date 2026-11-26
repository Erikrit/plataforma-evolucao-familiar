# 04: Data de nascimento exigida para Desenvolvimento

**O que entregar:** Conceder Desenvolvimento pede a data de nascimento quando falta. Abrir Desenvolvimento de pessoa sem data orienta o responsável autorizado a informá-la antes de continuar. API direta aplica a mesma regra. Cadastro só com nome e Cuidados não mudam.

**Bloqueado por:** nenhum

**Status:** COMPLETED

**Costura:** smoke:authz e smoke de Desenvolvimento

**Risco:** alto

## Critérios

- [x] FF-NASC-ACE-01 — criar pessoa só com nome continua possível
- [x] FF-NASC-ACE-02 — concessão sem data pede a data e só conclui após persistir (API: PASS; H1 PASS após ajuste)
- [x] FF-NASC-ACE-03 — pessoa existente sem data é orientada, sem perda de progresso (API: PASS; H2 dispensado pelo responsável: sem pessoas reais)
- [x] FF-NASC-ACE-04 — corrigir a data muda a faixa sem reescrever registros (sem reescrever: PASS; mudança de faixa padrão segue no ticket 05, D1)

## Pendências

- FF-NASC-ACE-04: a parte “muda a faixa padrão” depende do ticket 05; correção sem reescrever registros já verificada. Corrigir data existente só pela API (sem tela).
- `smoke:authz` e smokes pelo `qg.mjs` com Docker na máquina do responsável (no agente: BLOCKED por falta de Docker; PASS em ambiente alternativo).
- Homologação humana no celular.

## Homologação (2026-11-26)

- H3, H4 e H5: PASS. H2: dispensado (sem pessoas reais; banco de teste recriável).
- H1: ajuste pedido: o campo de data deve aparecer já obrigatório ao selecionar Desenvolvimento, não depois de tentar conceder. Ajuste feito: o cartão do administrador traz `possuiDataNascimento` (só sim ou não) e o formulário de concessão e de convite mostra o campo na hora. Refazer o H1.
- FF-NASC-ACE-04 (mudança de faixa) segue com o ticket 05 (D1).
- **Ajuste do H1 verificado:** QG-1 e QG-2 PASS (authz, smoke-ff-nasc com duas checagens novas, smoke-e2, check-e2), `qg1-2026-11-26T14-21-06-745Z.json` e `qg2-2026-11-26T14-23-20-929Z.json`; fingerprint `sha256:456cdc44d2185cd3f7a9e4fc78f0a7f51c7f3cb20caeb169a25a1b900882ff9a`; verificador PASS. Também recarrega os cartões depois de um convite, para o indicador da data não ficar desatualizado.

**mensagemCommit (ajuste H1):**

```
fix(acessos): pedir a data de nascimento ao escolher Desenvolvimento

A homologação pediu o campo já no formulário: o cartão do administrador indica
se a pessoa tem data e a concessão e o convite mostram a data obrigatória ao
escolher Desenvolvimento, sem esperar a recusa da API (DEV-CAT-M1, ticket 04).
```
- **H1 refeito (2026-11-26):** PASS. A ordem dos campos (data logo depois da área, responsabilidade por último) virou o ticket 11.
