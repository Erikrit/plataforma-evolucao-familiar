# Plataforma de Evolução Familiar

> **Status:** documentação de produto e implementação parcial da Fundação Familiar na branch `feature/modulo1`. Autenticação provisória: somente ambiente local de teste, sem dados reais.

Plataforma para apoiar o cuidado, as rotinas e o desenvolvimento de integrantes da família, preservando o histórico ao longo do tempo — sem transformar o cotidiano em prestação de contas.

## Princípios inegociáveis

1. **Evolução familiar:** acompanhar pessoas, rotinas, cuidados e desenvolvimento ao longo do tempo.
2. **Esforço mínimo:** registrar rapidamente, sem repetir informações.
3. **Organização sem cobrança:** lembrar, incentivar e acompanhar, sem transformar a vida familiar em obrigação.
4. **Necessidade dos dados:** se uma informação não ajuda a lembrar, cuidar, organizar ou compreender a evolução, sua coleta precisa ser justificada.
5. **Regra de abandono:** se alimentar o sistema for trabalhoso, ele será abandonado.

## Documentação

- [Documento Mestre](docs/produto/DOCUMENTO-MESTRE.md) — fonte de verdade funcional
- [Status e escopo](docs/produto/STATUS-E-ESCOPO.md) — decisões consolidadas e pendências
- [Arquitetura preliminar](docs/arquitetura/ARQUITETURA.md)
- [Decisões arquiteturais](docs/arquitetura/DECISOES.md)
- [Módulo 01 — Fundação Familiar](docs/modulos/01-fundacao-familiar/ESPECIFICACAO.md)
- [Módulo 02 — Cuidados da Vovó](docs/modulos/02-cuidados-vovo/ESPECIFICACAO.md)
- [Módulo 03 — Desenvolvimento da Laurinha](docs/modulos/03-desenvolvimento-laurinha/ESPECIFICACAO.md) — especificação funcional v1.1 proposta, pendente de aceite final
- [Módulo 04 — Evolução Familiar](docs/modulos/04-evolucao-familiar/ESPECIFICACAO.md) — especificação funcional v1.1 proposta, pendente de aceite final

## Como usar

Este repositório documenta **o produto** e, a partir da decisão ADR-012, também pode conter a **esteira inteligente de desenvolvimento**, desde que logicamente separada da especificação funcional.

- Fontes oficiais do produto: `docs/produto/`, `docs/arquitetura/`, `docs/modulos/`
- Esteira (agentes, skills, hooks, estados): `AGENTS.md`, `.cursor/`, `docs/esteira/`, `scripts/esteira/`

A esteira consome as especificações; não altera requisitos aprovados automaticamente.

Não inferir que documentos marcados como *proposta* ou *pendente* estejam definitivamente aprovados. Cada mudança de escopo deve ser registrada.

## Desenvolvimento

Direção tecnológica (ADR-003): Next.js/React, NestJS/TypeScript, PostgreSQL, Prisma e Docker Compose em monólito modular (`apps/api`, `apps/web`).

### Bootstrap local (FF-01)

```bash
cp .env.example .env
npm install
npm run docker:up
npm run db:generate
npm run db:push
npm run db:seed
npm run db:ping
npm run typecheck
npm run lint
npm run dev:api
# outro terminal:
npm run dev:web
```

PostgreSQL do Compose escuta em `localhost:5433` (evita conflito com instalações locais na 5432).  
Healthcheck da API: `GET http://localhost:3001/saude`.  
Admin local provisório: ver `PEF_ADMIN_*` em `.env.example` (dados fictícios).  
Smoke FF-02 (API no ar): `npm run smoke:ff02`.

## Situação e restrições

Consulte [Status e escopo](docs/produto/STATUS-E-ESCOPO.md) para diferenciar funcionalidades previstas, implementadas e ainda pendentes. O código atual não oferece proteção adequada para dados reais da família: sessões provisórias e autorizações contextuais ainda incompletas. As especificações dos módulos 03 e 04 foram detalhadas como propostas v1.1; seus valores de estrelas ainda não foram aprovados.

## Privacidade

O repositório não deve conter documentos médicos, imagens reais, credenciais ou dados sensíveis da família. Exemplos de produto devem utilizar dados fictícios.
