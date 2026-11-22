# Homologação — COR-E5-UX-HOM-R2-20261122

Precedente: `COR-E5-UX-HOM-20261122` (técnico COMPLETED; **homologação REPROVADA** — histórico).  
Protótipo R1 preservado: `prototipo-cor-e5-ux-hom-20261122.html`.

**Resultado humano desta rodada: APROVADA** (responsável, 2026-11-22), versão `develop` @ `e050a99`. O status intermediário REPROVADA do roteiro técnico permanece apenas como histórico até o aceite.

Validar em 375px e 1280px, teclado, leitor de tela, foco do Modal e movimento reduzido.

| Cenário | Critério |
|---|---|
| Catálogo — progresso | Barra horizontal verde-clara com preenchimento proporcional (0–5); número discreto `N de 5`; sem confundir com estrelas |
| Catálogo — fases | Cinco opções compactas; ícone + rótulo perceptível (Concluída / Experimentada / Não explorada); escolha livre; filtros Todas/Concluídas/Não concluídas; **Jogar** abre o tabuleiro |
| Partida — Dica | Botão **Dica** abre Modal Mantine com nome do jogo, Como jogar e uma dica acionável da fase; reabrir na mesma partida não gera nova dica; nova partida libera dica de novo; sem penalidade |
| Menu | Grupo Desenvolvimento com ícone trending-up; navegação/agrupamento preservados |
| Regressão | Permissões, persistência, histórico, progresso e estrelas presenciais inalterados |

## Evidência técnica (não substitui aceite humano)

Typecheck web, check-e4/e5, smoke-e4/e5/authz e build web PASS. Verifier PASS após correção de cache da dica e rótulos do seletor. Fingerprint `sha256:9e70ea931ca2ff30…`. Detalhes em `evidencia-cor-e5-ux-hom-r2-20261122.json`.
