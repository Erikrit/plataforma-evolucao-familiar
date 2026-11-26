# 13: Histórias em cenas com três degraus de dificuldade

**O que entregar:** a dificuldade de Histórias passa a subir em três degraus (decisão do responsável em 2026-11-26): Pequenos com figura e nome; Médios só com a figura, sem o texto; Grandes só com a figura e com cena intrusa que fica de fora. A régua mede cenas, figuras sem nome, intrusas e pista. O mesmo recurso de ordenação serve a Forme a palavra e Do menor ao maior (ticket 12).

**Bloqueado por:** 09

**Status:** IN_VALIDATION

**Costura:** régua (test:regua), check:e5, check:cat-04 e smoke:e5

**Risco:** medio

## Critérios

- [x] Régua (Progressão) — empate em cenas só passa se as figuras perderem o nome, entrar intrusa ou a pista sair
- [x] Ordenação com intrusas — a fase só conclui com as cenas da história na ordem e as intrusas de fora
- [x] Nomes ocultos nas cenas a partir de Médios, sem entregar pelo leitor de tela
- [ ] E5-HOM — homologação no celular

## Implementação (2026-11-26)

- Histórias v3: fases 1–5 com nome, 6–10 só figura, 11–15 só figura e 1 ou 2 intrusas de outro mundo (leão, baleia, foguete, polvo, neve). Verificador PASS após FAIL corrigido (intrusas plausíveis trocadas). Para decidir: a partir de Médios, quem usa leitor de tela não recebe nada sobre a cena (decorre de "só figura").
- **Evidências:** QG-1 PASS `qg1-2026-11-26T17-08-05-400Z.json`; QG-2 PASS (build, authz, carga-trilhas com 12 jogos e 180 fases, smoke-e5 com jogos novos e conquista de jogo arquivado, smoke-e4, histórico) `qg2-2026-11-26T17-10-46-774Z.json`; régua estrita 12 jogos, 0 falhas; fingerprint `sha256:94895ba3563d051fd050e278367d78798b80612f5d65fe39bb1fd04743530b4f`.
- **PENDING_HUMAN:** E5-HOM (H14).
