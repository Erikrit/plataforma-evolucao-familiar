@AGENTS.md

## Claude Code

Skills de entrada (só o humano invoca):

- `/esteira` — por onde começar: recomenda o fluxo da demanda
- `/sabatina` — alinhar antes de codar
- `/planejar` — transformar o alinhamento em tickets
- `/implementar` — executar um ticket ou demanda aprovada
- `/homologar` — separar verificação automática da humana
- `/retro` — melhorar a própria esteira
- `/passagem` — preparar a retomada em outra sessão

Adaptador do projeto, lido pelas skills:

- `docs/agents/projeto.md` — fontes oficiais, governança, estados e proibições
- `docs/agents/rastreador.md` — onde e como os tickets vivem
- `docs/agents/dominio.md` — glossário e decisões arquiteturais; ler antes de nomear algo
- `esteira.config.json` — comandos e perfis do portão de qualidade

Ao fim do trabalho, entregue `mensagemCommit` como texto: commit e publicação são do humano.
