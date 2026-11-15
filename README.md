# Plataforma de Evolução Familiar

> **Status:** repositório de especificação do produto. Ainda não contém aplicação executável.

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
- [Módulo 03 — Desenvolvimento da Laurinha](docs/modulos/03-desenvolvimento-laurinha/ESPECIFICACAO.md) — resumo funcional, detalhamento pendente
- [Módulo 04 — Evolução Familiar](docs/modulos/04-evolucao-familiar/ESPECIFICACAO.md) — resumo funcional, detalhamento pendente

## Como usar

Este repositório documenta **o produto**. Configurações, agentes e skills da esteira de desenvolvimento pertencem ao trabalho separado sobre automação. Uma esteira poderá consumir os arquivos deste repositório, sem alterar os requisitos aprovados automaticamente.

Não inferir que documentos marcados como *proposta* ou *pendente* estejam definitivamente aprovados. Cada mudança de escopo deve ser registrada.

## Desenvolvimento

Direção tecnológica **preliminar**, não implementada: Next.js/React, NestJS/TypeScript, PostgreSQL, Prisma, armazenamento privado compatível com S3 e Docker Compose. Nenhuma dependência ou infraestrutura foi instalada aqui.

## Privacidade

O repositório não deve conter documentos médicos, imagens reais, credenciais ou dados sensíveis da família. Exemplos de produto devem utilizar dados fictícios.
