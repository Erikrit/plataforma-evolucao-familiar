# Domínio

- **Glossário:** `GLOSSARIO.md`, na raiz. Contexto único.
- **ADRs:** `docs/arquitetura/DECISOES.md`, arquivo único. A numeração continua da última entrada.

## Leitura

Antes de nomear teste, ticket, módulo ou interface, ler o glossário e as ADRs da área tocada. Usar o termo como está definido. Quando um termo faltar, registrar a lacuna pela skill `modelagem-dominio`.

Se o glossário divergir da especificação, a especificação vence e a divergência é relatada.

## Escrita

- Termo novo entra no glossário com definição de uma linha, fonte e status `PROPOSTA`. O Produto muda o status.
- Decisão nova é redigida como ADR `PROPOSTA` e só entra em `DECISOES.md` depois de aprovado o registro.
- Contradição com ADR vigente é declarada: "Contradiz ADR-NNN porque…". A ADR vale até decisão humana.
