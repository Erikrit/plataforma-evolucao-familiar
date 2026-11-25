---
name: configurar-esteira
description: Instala ou atualiza o adaptador da esteira neste repositório, seção por seção.
disable-model-invocation: true
---

# Configurar esteira

Escreve o adaptador a partir de `scripts/esteira/templates/`; o núcleo permanece igual.

## 1. Explorar

Ler o que existe: `git remote -v`, manifesto e scripts, CI, estrutura, `AGENTS.md`, `CLAUDE.md`, glossário, ADRs, `docs/agents/`, `esteira.config.json`. Concluído quando cada seção abaixo está como **encontrado**, **inferido** ou **ausente**.

## 2. Perguntar

Uma seção por vez, com resposta recomendada. Pular a que a exploração já resolveu.

1. **Rastreador:** markdown local (recomendado) ou outro, descrito pelo humano.
2. **Glossário e ADRs:** caminhos e quem aprova.
3. **Comandos de QG:** por perfil, só os que existem no manifesto; futuros com `seExistir`.
4. **Caminhos críticos:** autenticação, autorização, dados sensíveis, persistência; checagem e requisitos.
5. **Governança:** fontes oficiais, níveis de aprovação, estados, limite de tentativas, proibições.
6. **Estado e evidências:** caminhos; detalhe fora do Git.
7. **Espelhos:** outros agentes usados.

## 3. Confirmar e escrever

Mostrar os rascunhos e esperar o aceite. Escrever `docs/agents/{projeto,rastreador,dominio}.md`, `esteira.config.json` e, se faltarem, o estado inicial, `AGENTS.md`, `CLAUDE.md` e `.claude/settings.json`. Em arquivo existente, alterar só a seção da esteira; em settings, mesclar permissões e hooks.

Conferir que `.claude/settings.json` registra os hooks e que o `.gitignore` cobre evidências e passagens.

## 4. Validar

Rodar `node scripts/esteira/sincronizar-agentes.mjs` e `node scripts/esteira/validar-esteira.mjs`.

Concluída quando o validador termina com exit 0. Recomendar `/esteira`.
