# 14: Leitor de tela diz o que a figura mostra em Histórias

**O que entregar:** a partir de Médios, quando as cenas aparecem só com a figura, o leitor de tela anuncia o objeto da figura (por exemplo, "despertador", "mochila"), sem o texto da ação, no lugar de "Cena N". Decisão do responsável em 2026-11-26.

**Bloqueado por:** 13

**Status:** COMPLETED

**Costura:** check:e5 e homologação com leitor de tela

**Risco:** baixo

## Critérios

- [x] Acessibilidade (E5-ACE-10) — com nomes ocultos, cada cena tem rótulo acessível com o objeto da figura e sem o nome da ação

## Implementação (2026-11-26)

- `apps/web/src/lib/objetos-figuras.ts`: objeto de cada figura (ex.: ⏰ despertador, 🎒 mochila). Com nomes ocultos, o rótulo acessível das cenas e intrusas passa a ser o objeto, no lugar de "Cena N".
- `check-e5` reprova cena oculta sem objeto ou objeto igual ao nome da ação.
- **Evidências:** QG-1 PASS `qg1-2026-11-26T22-07-15-553Z.json`; QG-2 PASS `qg2-2026-11-26T22-10-25-999Z.json`; fingerprint `sha256:de48f5c1f035205c2d71badaeec9d733184b8359826a05ab7f14bf0dda1d1ed7`. Verificador PASS.
- **PENDING_HUMAN:** H21.

**mensagemCommit (tickets 11 e 14, juntos na árvore):**

```
feat(acesso,jogos): data antes da responsabilidade e Histórias legíveis no leitor de tela

Nos formulários de concessão e convite a data de nascimento vem logo após a área,
e em Histórias com nomes ocultos o leitor de tela diz o objeto da figura
(DEV-CAT-M1, tickets 11 e 14).
```

- **Homologação (2026-11-26):** aprovada pelo responsável.
