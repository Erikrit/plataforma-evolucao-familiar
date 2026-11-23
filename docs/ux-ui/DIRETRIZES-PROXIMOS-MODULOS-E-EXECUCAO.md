# Diretrizes UX para os módulos 03 e 04 — referência e validação

**Estado:** orientação UX aprovada como referência; módulos 03/04 já possuem implementação local e QG-3 PASS registrado em `develop`, sem homologação em usuários/dispositivos reais. A especificação funcional de cada módulo prevalece; estado corrente em `docs/produto/STATUS-E-ESCOPO.md`.  
**Base:** `docs/ux-ui/GUIA-DE-EXPERIENCIA.md` + `docs/ux-ui/REVISAO-MODULOS-01-02.md`.  
**Não autoriza:** novos requisitos, criação de dados duplicados, mudanças de permissão ou commit/push/deploy automatizado.

## 1. Módulo 03 — Desenvolvimento da Laurinha

**Fonte funcional:** `docs/modulos/03-desenvolvimento-laurinha/ESPECIFICACAO.md` v1.1.

- Entrada pelo cartão da Laurinha, somente para autorizados.
- Biblioteca curta de brincadeiras presenciais, com título claro, instruções opcionais quando presentes e escolha intuitiva; não criar jogo digital.
- Ação primária de registro: **Concluiu** ou **Participou**; não adicionar "não realizou" ou justificativa obrigatória. Mostrar confirmação depois da persistência; sem reenvio acidental.
- **Guardar para depois** sem prazos, atraso, metas ou cobrança; evitar transformar a tela em agenda.
- Cadastro de brincadeira própria progressivo: nome obrigatório, dificuldade simples como padrão alterável, outros campos opcionais conforme especificação.
- Estrelas e recompensas transparentes, positivas e não competitivas; não exibir ranking, métricas clínicas ou placares comparativos. Não exigir aprovação manual de estrelas.
- Histórico aprofundado e resumo devem conduzir ao Módulo 04; não repetir formulário/linha do tempo própria.
- Manter Azul Contemporâneo, densidade confortável, cartões, estados, acessibilidade e microcopy do guia; elementos lúdicos apenas contextuais.

**Validação UX mínima:** adulto encontra brincadeira, salva opcionalmente, registra participação/conclusão com poucos toques, identifica estrelas sem confundir com avaliação infantil, consegue cancelar e se recuperar de falha, sem acesso indevido de colaboradora de cuidados.

## 2. Módulo 04 — Evolução Familiar

**Fonte funcional:** `docs/modulos/04-evolucao-familiar/ESPECIFICACAO.md` v1.1.

- Entrada **por pessoa**, para duas experiências: histórico individual e resumo contextual. Não dashboard genérico nem feed de publicações.
- Eventos em sequência cronológica legível, com data, origem e descrição humana; filtros simples somente quando úteis.
- Resumo com poucos destaques autorizados, diferenciações corretas entre relatos e falta de confirmação, sem interpretação clínica nem comparação infantil.
- PDF como ação do resumo: escolher período → prévia → exportar. Não gerar relatório com informação não autorizada; anexos sensíveis não entram por padrão.
- Aproveitar dados existentes dos módulos 02 e 03; não criar formulário exclusivamente para alimentar o histórico.
- Vazio deve explicar ausência de registros sem sugerir falha da pessoa ou responsabilidade.
- Evitar gráficos e indicadores decorativos; preferir resumo textual claro.

**Validação UX mínima:** encontrar histórico da Vovó/Laurinha a partir de pessoa autorizada, compreender eventos e períodos, gerar prévia/PDF somente com dados permitidos, diferenciar sem confirmação de não tomada.

## 3. Encaminhamento para a esteira existente

Utilizar **module-planning → implementation-workflow → quality-gate/verifier** definidos no repositório. O trabalho de UI deve ser recortado em incrementos pequenos que preservem funcionalidades, dados e autorizações.

**Leitura e validação do que existe:**
1. Consultar `docs/produto/STATUS-E-ESCOPO.md` e a versão aprovada das especificações; inspecionar a branch/commit atualmente relevantes.
2. Tratar as diretrizes desta revisão como **critério de verificação** das telas 03/04 existentes, não como instrução para reimplementá-las do zero.
3. Registrar somente divergências observadas de UX, acessibilidade, autorização e privacidade, com evidência e prioridade. Ajustes visuais L1 podem ser resolvidos por UX; comportamento novo, permissão ou obrigação exige avaliação pela especialidade competente.
4. Evidências QG-3 locais não substituem homologação com familiares, testes de acessibilidade e validação em aparelhos reais; não declarar aceite antes dessas verificações.
5. Informar discrepâncias relevantes em `docs/produto/STATUS-E-ESCOPO.md` ou por CT, conforme `docs/produto/GOVERNANCA.md`; preserva-se o registro histórico do desenvolvimento.

**O guia não altera as regras da esteira:** respeitar proibição de commit/push/deploy automático especificada em `AGENTS.md` e `.cursor/skills/implementation-workflow/SKILL.md`. Revisão e publicação de código permanecem sob controle humano.

## 4. Critério de conclusão e revisão UX

Cada slice registra: problema/ID, arquivos alterados, tela antes/depois, impactos de acessibilidade, testes realizados, efeito sobre autorizações, evidência visual e pendências. Fazer uma **revisão integrada de UX** após 01/02 e somente então decidir detalhes remanescentes, sem interromper o desenvolvimento por preferências cosméticas menores.

Este documento preserva critérios de experiência para os módulos existentes; não é ordem para reimplementação ou mudança de requisitos aprovados.
