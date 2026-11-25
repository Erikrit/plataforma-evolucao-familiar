# Rastreador de tickets

Markdown local e versionado: `docs/esteira/tickets/<slug-da-demanda>/`, com `spec.md` e um `<NN>-<slug>.md` por ticket.

## Formato

```markdown
# <NN>: <título com termos do glossário>

**O que entregar:** comportamento ponta a ponta.

**Bloqueado por:** <NN> | nenhum

**Status:** READY

**Costura:** onde será testado

**Risco:** baixo | medio | alto

## Critérios

- [ ] <ID rastreável> — <resultado verificável>
```

## Operações

- **Publicar:** criar os arquivos depois da aprovação do humano.
- **Buscar:** ler o arquivo indicado.
- **Fronteira:** tickets `READY` com todos os bloqueios `COMPLETED`; o menor número vem primeiro.
- **Assumir:** gravar `IN_PROGRESS` antes de começar.
- **Concluir:** marcar critérios e gravar `COMPLETED`, fingerprint e `mensagemCommit`.
