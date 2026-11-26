# 10: Ilustrações próprias no lugar de emoji

**O que entregar:** Conjunto SVG do Twemoji (CC-BY 4.0) servido pela plataforma, com crédito visível, com origem e licença registradas, começando pelas figuras dos oito jogos. Silhuetas passam a usar contorno próprio.

**Bloqueado por:** 02 (D3 decidida em 2026-11-26: Twemoji, CC-BY 4.0, com atribuição)

**Status:** COMPLETED

**Costura:** verificador de catálogo e roteiro no celular

**Risco:** medio

## Critérios

- [x] Régua de qualidade (Origem) — toda figura tem origem registrada
- [x] E5-F03 — nenhum recurso externo na partida

## Implementação (2026-11-26)

- 132 figuras do Twemoji 17.0.3 (jdecked/twemoji, CC-BY 4.0) em `apps/web/public/figuras/twemoji/`, com `LICENSE-GRAPHICS.txt` e `ORIGEM.md`. O componente `<Figura>` desenha o SVG local (sem serviço externo) e cai no emoji do aparelho se faltar a figura; `<TextoComFiguras>` cobre o enunciado de Forme a palavra.
- Crédito com link para a licença na Biblioteca de jogos.
- `check:e5` reprova se uma figura de jogo ativo não tiver SVG local ou se faltar a origem e a licença.
- Silhuetas com contorno próprio: dispensadas, porque Pares de sombras foi arquivado no ticket 12 (o filtro de sombra continua funcionando com as imagens).
- **Evidências:** QG-1 PASS `qg1-2026-11-26T21-08-23-835Z.json`; QG-2 PASS (build, smoke-e5) `qg2-2026-11-26T21-10-40-139Z.json`; fingerprint `sha256:737ba3ca49c5ac66f3b456e730699b1502623f9e24a65612e41f1bd24dcde5e3`. Verificador PASS.
- **PENDING_HUMAN:** H18.

**mensagemCommit:**

```
feat(jogos): ilustrações Twemoji servidas pela plataforma

As figuras dos jogos passam a usar os SVGs do Twemoji 17.0.3 (CC-BY 4.0),
iguais em todos os aparelhos e sem serviço externo, com origem, licença e
crédito registrados (DEV-CAT-M1, ticket 10).
```

- **Homologação (2026-11-26):** aprovada pelo responsável.
