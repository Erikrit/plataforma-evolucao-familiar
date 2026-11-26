# 11: Ordem dos campos ao conceder acesso ou convidar

**O que entregar:** na concessão de acesso e no convite, a ordem passa a ser participante (ou e-mail), pessoa acompanhada, área, data de nascimento (quando Desenvolvimento e a pessoa ainda não tem data) e, por último, a responsabilidade. Pedido da homologação do H1 em 2026-11-26.

**Bloqueado por:** nenhum

**Status:** COMPLETED

**Costura:** check:e2 e homologação no celular

**Risco:** baixo

## Critérios

- [x] FF-NASC-H1-ORDEM — ao escolher Desenvolvimento para quem não tem data, o campo de data aparece logo abaixo da área e a responsabilidade vem por último, na concessão e no convite

## Implementação (2026-11-26)

- Concessão e convite: Área → Data de nascimento (quando a área pede) → Responsabilidade. Só a posição mudou; validação e confirmação seguem iguais.
- `check-e2` ganhou `ticket-11-ordem-dos-campos` (vermelho antes, verde depois).
- **Evidências:** QG-1 PASS `qg1-2026-11-26T22-07-15-553Z.json`; QG-2 PASS `qg2-2026-11-26T22-10-25-999Z.json`; fingerprint `sha256:de48f5c1f035205c2d71badaeec9d733184b8359826a05ab7f14bf0dda1d1ed7`. Verificador PASS.
- **PENDING_HUMAN:** H20.

**mensagemCommit (tickets 11 e 14, juntos na árvore):**

```
feat(acesso,jogos): data antes da responsabilidade e Histórias legíveis no leitor de tela

Nos formulários de concessão e convite a data de nascimento vem logo após a área,
e em Histórias com nomes ocultos o leitor de tela diz o objeto da figura
(DEV-CAT-M1, tickets 11 e 14).
```

- **Homologação (2026-11-26):** aprovada pelo responsável.
