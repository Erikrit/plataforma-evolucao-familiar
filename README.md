# Plataforma de Evolução Familiar

**Estado atual (2026-11-24): V1 aprovada e homologada, em testes restritos à equipe.** O responsável informa ambiente disponível em **VPS com HTTPS**; não há autorização para uso público nem dados familiares reais. O estado do servidor e o commit efetivamente implantado não foram auditados nesta atualização documental.

A plataforma ajuda a família a **lembrar, cuidar, organizar e compreender sua evolução** com registros mínimos, sem cobrança. A experiência é centrada nas pessoas e prioriza o celular.

## Onde encontrar a informação vigente

| Necessidade | Documento |
|---|---|
| Situação atual, ambiente de testes e pendências | [Status e Escopo](docs/produto/STATUS-E-ESCOPO.md) |
| Visão e princípios duradouros | [Documento Mestre](docs/produto/DOCUMENTO-MESTRE.md) |
| Aprovação, autonomia e transferência entre conversas | [Governança](docs/produto/GOVERNANCA.md) |
| Regras funcionais e aceites | [M01](docs/modulos/01-fundacao-familiar/ESPECIFICACAO.md) · [M02](docs/modulos/02-cuidados-vovo/ESPECIFICACAO.md) · [M03](docs/modulos/03-desenvolvimento-laurinha/ESPECIFICACAO.md) · [M04](docs/modulos/04-evolucao-familiar/ESPECIFICACAO.md) |
| Padrões de UX/UI | [Guia de Experiência](docs/ux-ui/GUIA-DE-EXPERIENCIA.md) |
| Arquitetura e decisões técnicas | [Arquitetura](docs/arquitetura/ARQUITETURA.md) · [ADRs](docs/arquitetura/DECISOES.md) |
| Evoluções futuras não integrantes da V1 | [Evolução pós-V1](docs/produto/EVOLUCAO-POS-V1.md) |
| Desenvolvimento e verificações | [AGENTS.md](AGENTS.md) · [registro da esteira](docs/esteira/REGISTRO.md) |
| Implantação em homologação | [Procedimento VPS](docs/esteira/estado/procedimento-homolog-deploy.md) |

**Para novos chats/agentes:** ler primeiro `GOVERNANCA.md` e `STATUS-E-ESCOPO.md`, depois somente os trechos do módulo, UX, ADR ou código relacionados à demanda. Não carregar retrospectivas e logs de testes por padrão.

## Visão técnica

Monólito modular: **Next.js/React/Mantine** (Web mobile-first / PWA instalável), **NestJS/Prisma** (API), **PostgreSQL** e **Docker Compose**. As imagens de homologação são publicadas no GHCR por workflow específico. A API e a Web são expostas conforme o proxy da VPS; não usar URLs internas Docker no navegador.

A V1 inclui cadastro e acesso familiar, rotina de cuidados, biblioteca de atividades, oito jogos digitais com 40 fases, histórico e resumos. Notificações Web Push/ACE-C12 **não** fazem parte da entrega em testes.

## Desenvolvimento local

Requisitos: Node.js compatível com `package.json`, Docker e as variáveis locais da `.env.example`.

```bash
cp .env.example .env
npm ci
npm run docker:up
npm run db:generate
npm run db:push
npm run db:seed
npm run dev:api
# em outro terminal
npm run dev:web
```

`db:push` é destinado ao banco **local e descartável**. Para a VPS, seguir as migrações versionadas e o procedimento de homologação; **não** executar `db:push`, `db:reset` ou seed de contas fictícias no ambiente implantado. Para verificar mudanças use `npm run lint`, `npm run typecheck`, `npm run build` e os checks/smokes aplicáveis, respeitando dados e contexto de cada ambiente.

## Segurança e limites

Repositório público: não versionar dados reais de crianças, prescrições, exames, credenciais, logs com segredos ou backups. V1 homologada funcionalmente **não** equivale a produção pública, autenticação auditada ou backups/restauração homologados na VPS. A equipe de testes deve utilizar somente dados fictícios. Consultar o [Status e Escopo](docs/produto/STATUS-E-ESCOPO.md) antes de ampliar o uso.
