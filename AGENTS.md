# Agentes — Plataforma de Evolução Familiar

## Estado vigente (2026-11-24)

**V1 aprovada e homologada funcionalmente; testes restritos à equipe em VPS HTTPS, conforme o responsável pelo Produto.** Não significa liberação pública, segurança auditada ou autorização para usar dados reais de saúde/crianças. Fonte de estado **sempre atualizável**: `docs/produto/STATUS-E-ESCOPO.md`. Não fixar aqui SHAs, etapas antigas ou conclusões técnicas transitórias.

Branches: `develop` é a referência de desenvolvimento; `master` é a branch padrão de publicação/homologação. **Conferir refs e commit reais antes de agir**; não assumir sincronia entre elas.

## Fontes canônicas — carregar só o necessário

1. **Início de tarefa:** `docs/produto/STATUS-E-ESCOPO.md` (estado) e `docs/produto/GOVERNANCA.md` (competência/CT).
2. **Regra funcional:** `docs/modulos/<id>/ESPECIFICACAO.md`, apenas o trecho da demanda; visão geral em `docs/produto/DOCUMENTO-MESTRE.md`.
3. **UX / Arquitetura:** `docs/ux-ui/GUIA-DE-EXPERIENCIA.md` ou `docs/arquitetura/DECISOES.md` e `ARQUITETURA.md`, conforme impacto.
4. **Execução:** arquivos de código/teste afetados; estado ativo em `docs/esteira/estado/atual.json`; evidências **apenas por referência**.
5. **Histórico:** `docs/esteira/REGISTRO.md`, planejamentos encerrados, revisões antigas de UX e logs `qg*.txt` **somente se forem necessários para uma divergência concreta**.

Não ler integralmente o `atual.json` (histórico extenso) nem o `REGISTRO.md` na inicialização: extrair apenas `revisao`, `demanda`, estado ativo, critérios, fingerprint e `proximaAcao` por uma leitura estruturada. **Ao gravar, preservar todos os demais campos existentes**, sem truncar histórico. Não copiar documentos inteiros para prompts.

## Esteira existente — sem agentes adicionais

- `task-routing`: classificar e verificar a aprovação (L1/L2/L3).
- `module-planning`: somente para novo módulo ou impacto transversal complexo.
- `implementation-workflow`: implementar a demanda aprovada e delimitada.
- `quality-gate`: QG-1 → verificador independente → QG-2; QG-3/regressão ou homologação conforme risco e impacto.
- `verifier` é subagente independente de **somente leitura**; definições em `.cursor/agents/verifier.md` e `.codex/agents/verifier.toml`.

As skills são espelhadas em `.cursor/skills/` e `.agents/skills/` para os dois ambientes; **manter espelhos equivalentes**. Se uma decisão já consta aprovada na fonte canônica, não solicitar nova aprovação sem conflito material.

## Evidências, limpeza e retomada

- Uma demanda concluída precisa de critério verificável, resultado real e fingerprint; log bruto não é decisão nem contexto permanente.
- Registrar no estado somente caminhos e resumos curtos; preferir saídas detalhadas **locais e ignoradas pelo Git**. Não versionar logs repetitivos ou capturas temporárias por padrão.
- Roteiros de homologação, evidências estruturadas e logs explicitamente referenciados por um aceite devem continuar acessíveis; limpar apenas após checagem de referências.
- Retomada: ler estado ativo estruturado; conferir `git status`, branch/commit, alterações locais e fingerprints; revalidar se divergirem.
- Banco da VPS de testes **não pode ser apagado ou recriado automaticamente**; dispensa de migrações de dados legados em desenvolvimento não é autorização para operação destrutiva.

## Segurança e autorização

Não inventar regras clínicas, resultados de testes ou permissões; preservar dados de crianças/saúde, isolamento por família e consentimento. Homologação funcional ≠ liberação pública. **Agentes não executam automaticamente `git commit`, `git push`, merge, PR, deploy, tags, releases nem operações destrutivas.** Não contornar hooks/restrições. Operações explícitas do responsável fora da esteira exigem autorização específica; o agente não deve generalizá-las.
