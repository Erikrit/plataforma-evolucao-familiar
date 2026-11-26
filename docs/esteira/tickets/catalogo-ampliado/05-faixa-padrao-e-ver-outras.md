# 05: Biblioteca abre na faixa da pessoa

**O que entregar:** A faixa é calculada no servidor pela data de nascimento. Catálogo de jogos e trilhas abrem na faixa da pessoa; Ver outras faixas abre as demais. Mudança de faixa preserva descobertas. Retorno ao catálogo preserva o filtro.

**Bloqueado por:** 03, 04 (D1 decidida em 2026-11-26: 5–6, 7–9, 10–12)

**Status:** IN_VALIDATION

**Costura:** smoke:e5 e smoke:authz

**Risco:** alto

## Critérios

- [x] DEV-CAT-P04 — pessoa de 8 anos abre em Médios e consegue abrir Pequenos e Grandes
- [x] DEV-CAT-P06 — ao mudar de faixa, descobertas anteriores continuam no Histórico
- [x] E5-ACE-09 — mesmos limites por família, pessoa e autorização na API direta

## Implementação (2026-11-26)

- **API:** `faixas.ts` calcula a idade (UTC) e a faixa (D1: 5–6, 7–9, 10–12); `GET /pessoas/:id/jogos?faixa=pequenos|medios|grandes|todas` devolve `faixaPadrao`, `faixa` e as fases da trilha; sem data de nascimento responde 409 `DATA_NASCIMENTO_OBRIGATORIA` (P04 substitui o catálogo sem data). Faixa inválida: 400, sempre depois da autorização. Abrir e concluir fases não depende da faixa.
- **Web:** Biblioteca de jogos com o seletor "Ver outras faixas" (a da pessoa marcada como "desta pessoa"); a faixa fica na URL e volta com o usuário; a partida carrega todas as fases.
- **Evidências:** QG-1 PASS `qg1-2026-11-26T18-52-24-176Z.json`; QG-2 PASS (authz, smoke-e5 com faixas, sem data, troca de 6 para 7 anos e Pequenos por Ver outras faixas) `qg2-2026-11-26T18-55-33-834Z.json`; fingerprint `sha256:0efe7609ea63adde41e45bf33905c355ff71299f838e89f3e11f39641210a60d`. Verificador PASS (após ajuste do P04); revisão sem violações.
- **PENDING_HUMAN:** H15.

**mensagemCommit:**

```
feat(jogos): Biblioteca abre na faixa de idade da pessoa

A faixa (5–6, 7–9, 10–12) é calculada no servidor pela data de nascimento;
"Ver outras faixas" abre as demais e o catálogo sem data pede a data, com as
descobertas preservadas na mudança de faixa (DEV-CAT-M1, ticket 05).
```
