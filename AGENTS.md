# Agentes — Plataforma de Evolução Familiar

## Estado vigente

**V1 aprovada e homologada funcionalmente; testes restritos à equipe em VPS HTTPS, conforme o responsável pelo Produto.** Não significa liberação pública, segurança auditada ou autorização para usar dados reais de saúde/crianças. Fonte de estado **sempre atualizável**: `docs/produto/STATUS-E-ESCOPO.md`. Não fixar aqui SHAs, etapas antigas ou conclusões técnicas transitórias.

Branches: `develop` é a referência de desenvolvimento; `master` é a branch padrão de publicação/homologação. **Conferir refs e commit reais antes de agir**; não assumir sincronia entre elas.

## Fontes canônicas — carregar só o necessário

A tabela de fontes, a governança L1–L3/CT, os estados e as proibições estão em `docs/agents/projeto.md`. Ler status e governança só na **triagem de demanda nova**; ticket `READY` com aprovação registrada não os relê. Depois, só o trecho da demanda: requisito localizado pelo ID com `grep -n` e lido por faixa de linhas.

O histórico fechado está no [snapshot Git da V1](https://github.com/Erikrit/plataforma-evolucao-familiar/tree/f58d029658499bdfc3807c0488662c0bc4557dae/docs), **não** na árvore atual; consultar somente para auditoria pontual.

O `atual.json` é **compacto**. Ler o checkpoint e a `demanda` ativa, sem trazer de volta demandas antigas. Ao gravar, preservar os campos correntes e registrar apenas conclusões novas e resumidas. Não copiar documentos inteiros para prompts.

## Esteira v2

Fonte única em `.claude/`; espelhos em `.agents/skills`, `.codex/agents` e `.cursor/agents` são **gerados** por `npm run esteira:sincronizar`. O Cursor lê `.claude/skills` diretamente. Guia: `docs/esteira/COMO-USAR.md`.

Fluxo: `triagem` → `sabatina` e `planejar` quando necessário → `implementar` → `homologar` conforme impacto.

- **Implementar:** `tdd` nas costuras → QG-1 → `verificador` → QG-2 → `revisao-codigo` → conclusão com fingerprint e `mensagemCommit`.
- **Portões:** `node scripts/esteira/qg.mjs` gera os status; o agente interpreta. Configuração em `esteira.config.json`.
- **Subagentes, somente leitura:** `verificador`, `revisor-padroes`, `revisor-especificacao`.
- **Entrada humana:** `/esteira`, `/sabatina`, `/planejar`, `/implementar`, `/homologar`, `/melhorar-arquitetura`, `/retro`, `/passagem`, `/configurar-esteira`.

Estados: `PENDING → READY → IN_PROGRESS → IN_VALIDATION → COMPLETED | BLOCKED | NEEDS_DECISION`.

Se uma decisão já consta aprovada na fonte canônica, não solicitar nova aprovação sem conflito material. Nomes anteriores (`task-routing` etc.): tabela em `docs/agents/projeto.md`.

## Evidências, limpeza e retomada

- Uma demanda concluída precisa de critério verificável, resultado real e fingerprint; **manter no estado somente as últimas demandas resumidas relevantes ao ciclo aberto (máximo 10)**. O histórico permanente é o Git, não arquivos de log.
- Registrar no estado somente caminhos e resumos curtos; preferir saídas detalhadas **locais e ignoradas pelo Git**. Não versionar logs repetitivos ou capturas temporárias por padrão.
- Roteiros de homologação, evidências estruturadas e logs explicitamente referenciados por um aceite devem continuar acessíveis; limpar apenas após checagem de referências.
- Retomada: ler o estado ativo; conferir `git status`, branch/commit, alterações locais e fingerprints; revalidar se divergirem.
- Banco da VPS de testes **não pode ser apagado ou recriado automaticamente**; dispensa de migrações de dados legados em desenvolvimento não é autorização para operação destrutiva.

## Segurança e autorização

Não inventar regras clínicas, resultados de testes ou permissões; preservar dados de crianças/saúde, isolamento por família e consentimento. Homologação funcional ≠ liberação pública. **Agentes não executam automaticamente `git commit`, `git push`, merge, PR, deploy, tags, releases nem operações destrutivas.** Não contornar hooks/restrições. Operações explícitas do responsável fora da esteira exigem autorização específica; o agente não deve generalizá-las.
