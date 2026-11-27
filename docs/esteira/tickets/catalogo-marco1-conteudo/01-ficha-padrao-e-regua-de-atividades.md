# 01: Ficha padrão e régua de Atividades Reais

**O que entregar:** Campos estruturados da ficha em `DesafioCatalogo` (migração versionada): passos (1 a 3), variação mais fácil, variação mais difícil, adaptação para brincar sentado, segurança por faixa, lugar e número de pessoas. Verificador `regua:atividades` (sem banco) que reprova ficha incompleta e emite a matriz de cobertura (faixa × área × duração × lugar × pessoas). As 20 atividades ativas são revistas pela ficha. A tela de detalhe da atividade mostra passos, variações e segurança de forma compacta no celular.

**Bloqueado por:** nenhum

**Status:** COMPLETED — homologado pelo responsável em 2026-11-27

**Costura:** régua de atividades, check:e4, carga oficial e smoke:e4

**Risco:** medio

## Critérios

- [x] Régua de qualidade (Atividade real) — as 20 atividades ativas passam na ficha padrão
- [x] Régua de atividades reprova ficha sem segurança, com mais de três passos ou sem variação
- [x] E4-ACE-03 e DEV-CAT-P09 — sugestões e limites continuam corretos
- [x] E5-HOM — detalhe da atividade legível em 320 px (homologação humana)

## Conclusão técnica (2026-11-27)

- **Origem:** implementação da execução paralela (worktree `t01-ficha-padrao-atividades`, descartada pelo responsável) reaproveitada, trazida para a `develop` e revalidada aqui; ajustes da revisão aplicados.
- **Decisão de Arquitetura (spec.md):** `adaptacoes` e `supervisao` removidas por migração; viram variações, adaptação sentada e segurança por faixa. Só o catálogo as usava; o texto anterior fica no Git. CHECKs no banco para lugar, pessoas e no máximo 3 passos.
- **Matriz:** faixa × área, totais por dimensão e combinações faixa × área × duração × lugar × pessoas. Buracos relatados sem reprovar (Números, duração longa, pessoas individual); os tickets 02 e 03 decidem quando passam a bloquear.
- **Portões (base `4a5bfc5`):** QG-1 PASS (lint, typecheck, authz, check-e4 14/14, check-e5, regua-atividades 15/15); QG-2 PASS (build, authz, carga-trilhas, smoke-e4, smoke-e5, smoke histórico/resumo); verificador PASS.
- **Fingerprint:** `sha256:0cf06943f1b7f0e73e8af5ab356ee0d7fdbb700aa095a114b933e140decad8f1`.
- **Homologação (2026-11-27):** E5-HOM aprovado pelo responsável.
- **Decisões do responsável (2026-11-27):** remoção de `adaptacoes` e `supervisao` confirmada; “Régua de qualidade”, “Ficha padrão” e “Matriz de cobertura” registradas no glossário como PROPOSTA; faixas de duração da matriz adiadas para o fim dos tickets; duplicações e código sem uso vão para o ticket 13 (refatoração geral).

**mensagemCommit:**

```
feat(desenvolvimento): ficha padrão e régua das Atividades Reais

Passos, variações, versão sentada, segurança por faixa, lugar e pessoas
em Desafio; régua sem banco com matriz de cobertura, as 20 ativas
revistas e a ficha compacta na tela de detalhe. Termos no glossário
e ticket 13 de refatoração geral.
```
