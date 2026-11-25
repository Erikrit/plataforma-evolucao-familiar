# Rastreador de tickets

Markdown local e versionado: `docs/esteira/tickets/<slug-da-demanda>/`.

- `spec.md`: spec curta da demanda. Referencia as especificações por ID; a regra funcional continua só na fonte oficial.
- `<NN>-<slug>.md`: um ticket por arquivo, numerado de `01` em ordem de dependência.

## Formato

```markdown
# <NN>: <título com termos do glossário>

**O que entregar:** comportamento ponta a ponta, do ponto de vista de quem usa.

**Bloqueado por:** <NN> | nenhum

**Status:** READY

**Costura:** onde o comportamento será testado

**Risco:** baixo | medio | alto

## Critérios

- [ ] <ID rastreável> — <resultado verificável>
```

## Operações

- **Publicar:** criar os arquivos depois da aprovação do humano.
- **Buscar:** ler o arquivo indicado por caminho ou número.
- **Fronteira:** tickets `READY` cujos bloqueios estão todos `COMPLETED`; o menor número vem primeiro.
- **Assumir:** gravar `IN_PROGRESS` antes de começar.
- **Concluir:** marcar os critérios e gravar `COMPLETED`, o fingerprint e a `mensagemCommit`.
- **Encerrar a demanda:** com o aceite, propor a remoção da pasta; o histórico fica no Git.

Os status são os estados de [projeto.md](projeto.md). Este rastreador não publica nada em serviços externos.
