# 01: Ficha padrão e régua de Atividades Reais

**O que entregar:** Campos estruturados da ficha em `DesafioCatalogo` (migração versionada): passos (1 a 3), variação mais fácil, variação mais difícil, adaptação para brincar sentado, segurança por faixa, lugar e número de pessoas. Verificador `regua:atividades` (sem banco) que reprova ficha incompleta e emite a matriz de cobertura (faixa × área × duração × lugar × pessoas). As 20 atividades ativas são revistas pela ficha. A tela de detalhe da atividade mostra passos, variações e segurança de forma compacta no celular.

**Bloqueado por:** nenhum

**Status:** READY

**Costura:** régua de atividades, check:e4, carga oficial e smoke:e4

**Risco:** medio

## Critérios

- [ ] Régua de qualidade (Atividade real) — as 20 atividades ativas passam na ficha padrão
- [ ] Régua de atividades reprova ficha sem segurança, com mais de três passos ou sem variação
- [ ] E4-ACE-03 e DEV-CAT-P09 — sugestões e limites continuam corretos
- [ ] E5-HOM — detalhe da atividade legível em 320 px (homologação humana)
