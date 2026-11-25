---
name: melhorar-arquitetura
description: Levanta oportunidades de aprofundar módulos, gera relatório local e entrevista sobre uma delas.
argument-hint: "área ou dor (opcional)"
disable-model-invocation: true
---

# Melhorar arquitetura

Entrega relatório e entendimento; a mudança vira demanda própria.

1. **Delimitar.** Usar a área indicada ou os pontos quentes de `git log`. Ler glossário e ADRs; chamar `desenho-modulos`.
2. **Explorar** com subagente de leitura, anotando atrito: conceito espalhado por muitos módulos, módulo **raso**, função extraída só para teste, costura que vaza, área difícil de testar. Aplicar o teste da remoção. Concluído quando cada candidato cita arquivos e atrito observado.
3. **Relatar** em `reports/arquitetura-<data>.html`, autocontido e local. Por candidato: arquivos, problema, solução, ganho em localidade, alavancagem e testes, diagrama antes/depois e força (Forte, Vale explorar, Especulativo). Conflito com ADR só quando o atrito justifica, sinalizado. Fechar com a recomendação principal.
4. **Perguntar** qual explorar; propor interfaces só depois da escolha.
5. **Entrevistar** sobre o escolhido com `interrogatorio` e `modelagem-dominio`. Recusa com motivo durável: oferecer ADR.

Concluída quando o relatório existe e o candidato escolhido tem fronteira vazia, ou o humano encerrou. Recomendar `/planejar`.
