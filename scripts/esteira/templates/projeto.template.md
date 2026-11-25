# Projeto — adaptador da esteira

<Uma frase: o que é o projeto e o que nele é sensível.>

## Fontes oficiais

| Assunto | Fonte |
|---|---|
| Estado e pendências | <caminho> |
| Autoridade e aprovação | <caminho> |
| Regra funcional e critérios | <caminho> |
| Decisões e arquitetura | <caminho> |
| Padrões de engenharia | <caminhos> |

## Governança

- **L1:** local e reversível. **L2:** transversal. **L3:** estrutural ou de produto; exige aprovação explícita de <quem>.
- <Regras próprias de transferência e proteção.>

## Estados da demanda

`PENDING → READY → IN_PROGRESS → IN_VALIDATION → COMPLETED | BLOCKED | NEEDS_DECISION`

Até **3 tentativas por causa raiz**; depois, `BLOCKED` com o diagnóstico.

## Estado e evidências

- Estado versionado: `docs/esteira/estado/atual.json`.
- Registro: <caminho>.
- Evidência detalhada: `docs/esteira/evidencias/<demanda>/`, local e ignorada pelo Git.
- Relatórios locais: `reports/`. Passagens: `docs/esteira/estado/passagem-<data>.local.json`.

## Risco alto

<Áreas: autenticação, autorização, dados sensíveis, persistência.>

## Reservado ao humano

Commit, push, merge, PR, release, deploy e operação destrutiva. O agente entrega `mensagemCommit`.
