# Projeto — adaptador da esteira

Plataforma de Evolução Familiar: famílias isoladas, dados de saúde e de crianças, V1 em testes restritos com dados fictícios.

## Fontes oficiais

Carregar só o trecho que a demanda toca: localizar o ID com `grep -n` e ler a faixa de linhas. Status e governança são lidos na triagem de demanda nova; ticket `READY` com aprovação registrada não os relê.

**Catálogos não são lidos inteiros.** `apps/api/prisma/catalogo-*.mjs` e `apps/api/scripts/lib-regua-jogos.mjs` passam de 40 KB; inspecionar pelos scripts existentes (`npm run test:regua -w @pef/api`, `npm run test:regua-atividades -w @pef/api`, `npm run check:e4 -w @pef/api`, `npm run check:e5 -w @pef/api`) e, para um item, `grep -n` pelo id e leitura da faixa.

| Assunto | Fonte |
|---|---|
| Estado, lacunas, homologação | `docs/produto/STATUS-E-ESCOPO.md` |
| Autoridade, níveis, CT | `docs/produto/GOVERNANCA.md` |
| Visão e limites | `docs/produto/DOCUMENTO-MESTRE.md` |
| Regra funcional e critérios de aceite | `docs/modulos/<id>/ESPECIFICACAO.md` |
| Experiência | `docs/ux-ui/GUIA-DE-EXPERIENCIA.md` |
| Decisões e arquitetura | `docs/arquitetura/DECISOES.md`, `docs/arquitetura/ARQUITETURA.md` |
| Padrões de engenharia | `.cursor/rules/engineering.mdc`, `AGENTS.md`, `eslint.config.mjs`, convenções do código vizinho |
| Histórico anterior à V1 | Git, revisão `f58d029658499bdfc3807c0488662c0bc4557dae` |

Código e testes: `apps/api` (NestJS/Prisma) e `apps/web` (Next.js/React/Mantine). Banco local via Compose.

## Governança

Resumo; a regra está em `docs/produto/GOVERNANCA.md` §4–6.

- **L1:** local e reversível; a especialidade resolve.
- **L2:** transversal; o dono decide e consulta as áreas afetadas.
- **L3:** estrutural ou de produto; exige aprovação explícita do responsável pelo Produto antes de mudar a fonte canônica.
- **CT:** contrato de transferência entre especialidades, usado só quando necessário; um CT não vira arquivo por demanda.
- Saúde, criança, permissão, segurança e perda de dados com impacto material não são L1.
- Decisão `APROVADA` ou `DOCUMENTADA` vale até surgir conflito material novo.
- Incerteza de autorização, saúde ou criança: `NEEDS_DECISION`; seguir só com o trabalho independente.

## Divisão do trabalho

Decisão do responsável pelo Produto em 2026-11-25:

- **Conversas de planejamento** (fora do Claude Code): diagnóstico, decisões, especificação e tickets. Publicam somente documentos: especificações dos módulos, spec e tickets em `docs/esteira/tickets/<demanda>/`, com a seção "Execução no Claude Code".
- **Claude Code com esteira v2**: implementação, portões de qualidade, verificador e entrega, ticket a ticket, a partir dessa seção.

## Estados da demanda

`PENDING → READY → IN_PROGRESS → IN_VALIDATION → COMPLETED | BLOCKED | NEEDS_DECISION`

Até **3 tentativas por causa raiz**; na terceira falha, `BLOCKED` com o diagnóstico.

## Estado e evidências

- Estado versionado: `docs/esteira/estado/atual.json` (`demanda` ativa; até 10 itens em `demandasConcluidas`). Alterar só os campos da demanda e preservar os demais.
- Registro: `docs/esteira/REGISTRO.md`, uma entrada curta por transição material.
- Evidência detalhada: `docs/esteira/evidencias/<demanda>/`, local e ignorada pelo Git. O resumo versionado se sustenta sozinho: comando, exit code, resultado e fingerprint.
- Relatórios locais: `reports/`. Passagens: `docs/esteira/estado/passagem-<data>.local.json`.
- Fingerprint: SHA-256 com finais de linha normalizados para LF, calculado por `node scripts/esteira/qg.mjs`. Valores anteriores à esteira v2 são registro histórico.

## Risco alto

Autenticação, autorização, privacidade, persistência, saúde e criança. As checagens críticas de `esteira.config.json` são obrigatórias quando o diff toca essas áreas.

## Reservado ao humano

Commit, push, merge, PR, tag, release, deploy, Git destrutivo e reset de banco. O agente entrega `mensagemCommit`; o hook bloqueia o resto. O banco da VPS nunca é apagado ou recriado automaticamente. Exceção decidida pelo responsável em 2026-11-26: enquanto houver só dados fictícios, ele pode limpar e recriar o banco da VPS de testes na publicação, executando ele mesmo; com isso, migrações não precisam preservar dados já gravados na VPS, mas continuam versionadas e reproduzíveis numa instalação do zero. Dados e exemplos são sempre fictícios; `.env` e `backups/` não são lidos pelo agente.

## Nomes anteriores à esteira v2

Documentos de produto podem citar os nomes antigos.

| Antigo | Atual |
|---|---|
| `task-routing` | `triagem` (entrada pelo humano: `/esteira`) |
| `module-planning` | `/planejar` (precedida de `/sabatina`) |
| `implementation-workflow` | `/implementar` |
| `quality-gate` | `portao-qualidade` e `/homologar` |
| `verifier` | `verificador` |
