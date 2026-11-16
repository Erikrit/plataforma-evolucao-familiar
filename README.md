# Plataforma de Evolução Familiar

> **Situação:** especificações aprovadas e código dos quatro módulos presentes na `develop`, com evidências locais de validação, **sem homologação para uso real**. Para o estado preciso e atualizado, consultar [Status e Escopo](docs/produto/STATUS-E-ESCOPO.md). Não utilizar dados reais sensíveis.

Plataforma para apoiar o cuidado, as rotinas e o desenvolvimento de integrantes da família, preservando o histórico ao longo do tempo — sem transformar o cotidiano em prestação de contas.

## Princípios inegociáveis

1. **Evolução familiar:** acompanhar pessoas, rotinas, cuidados e desenvolvimento ao longo do tempo.
2. **Esforço mínimo:** registrar rapidamente, sem repetir informações.
3. **Organização sem cobrança:** lembrar, incentivar e acompanhar, sem transformar a vida familiar em obrigação.
4. **Necessidade dos dados:** se uma informação não ajuda a lembrar, cuidar, organizar ou compreender a evolução, sua coleta precisa ser justificada.
5. **Regra de abandono:** se alimentar o sistema for trabalhoso, ele será abandonado.

## Documentação

- [Documento Mestre](docs/produto/DOCUMENTO-MESTRE.md) — visão e princípios do produto
- [Governança de Produto](docs/produto/GOVERNANCA.md) — decisões, competências e transferência de contexto
- [Status e escopo](docs/produto/STATUS-E-ESCOPO.md) — decisões consolidadas e pendências
- [Arquitetura preliminar](docs/arquitetura/ARQUITETURA.md)
- [Decisões arquiteturais](docs/arquitetura/DECISOES.md)
- [Guia UX/UI](docs/ux-ui/GUIA-DE-EXPERIENCIA.md) — padrões de experiência
- [Módulo 01 — Fundação Familiar](docs/modulos/01-fundacao-familiar/ESPECIFICACAO.md)
- [Módulo 02 — Cuidados da Vovó](docs/modulos/02-cuidados-vovo/ESPECIFICACAO.md)
- [Módulo 03 — Desenvolvimento da Laurinha](docs/modulos/03-desenvolvimento-laurinha/ESPECIFICACAO.md) — especificação funcional v1.1 aprovada
- [Módulo 04 — Evolução Familiar](docs/modulos/04-evolucao-familiar/ESPECIFICACAO.md) — especificação funcional v1.1 aprovada

## Como usar

Este repositório documenta **o produto** e, a partir da decisão ADR-012, também pode conter a **esteira inteligente de desenvolvimento**, desde que logicamente separada da especificação funcional.

- Fontes oficiais: `docs/produto/`, `docs/modulos/`, `docs/ux-ui/` e `docs/arquitetura/`, conforme `GOVERNANCA.md`
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
Smoke FF-02 (API no ar): `npm run smoke:ff02`. Existem scripts smoke por módulo em `apps/api/scripts/` e evidências locais em `docs/esteira/estado/`; a suíte não foi reexecutada nesta atualização documental.

## Situação e restrições

Consulte [Status e escopo](docs/produto/STATUS-E-ESCOPO.md) para diferenciar **regra aprovada, código existente, evidência local e homologação**. A autenticação e autorização ainda exigem revisão antes de usar dados reais sensíveis; a existência dos módulos e de QG-3 PASS registrado não equivale a liberação para uso real.

## Privacidade

O repositório não deve conter documentos médicos, imagens reais, credenciais ou dados sensíveis da família. Exemplos de produto devem utilizar dados fictícios.
