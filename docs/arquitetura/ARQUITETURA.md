# Arquitetura de referência — Plataforma de Evolução Familiar

**Atualização:** 2026-11-24. **Estado:** V1 homologada funcionalmente, em teste restrito à equipe na VPS com HTTPS conforme informado pelo responsável. Este documento descreve a arquitetura **versionada no repositório**; não comprova segurança auditada ou estado exato do servidor.

**Fonte do estado operacional:** [Status e Escopo](../produto/STATUS-E-ESCOPO.md). **Decisões e substituições técnicas:** [ADRs](DECISOES.md). **Regras de negócio:** especificações dos módulos, não este documento.

## 1. Estrutura implementada

- **Web:** Next.js + React + Mantine, mobile-first, em `apps/web/`.
- **PWA instalável:** manifesto Next em `apps/web/src/app/manifest.ts`, ícones em `apps/web/public/icones/` e Apple icon; não confundir instalação com notificações Web Push.
- **API:** NestJS modular, TypeScript, em `apps/api/src/`, com autenticação de sessão e verificação contextual de autorização.
- **Persistência:** PostgreSQL + Prisma, modelo em `apps/api/prisma/schema.prisma`, migrações versionadas para homologação.
- **Operação:** Docker Compose em `docker-compose.homolog.yml`, imagens versionadas por SHA via GHCR e workflow `.github/workflows/publicar-imagens-homolog.yml`. Publicação das imagens é manual; deploy na VPS é operação separada.

```text
Navegador / PWA
      ↓ HTTPS (proxy externo na VPS)
  Next.js / Web
      ↓ URL pública da API configurada no build
  NestJS / API ─── Prisma ─── PostgreSQL
                 (anexos no banco)
```

No Compose de homologação, Web e API publicam portas apenas em `127.0.0.1` do host, e PostgreSQL não publica porta externa. O navegador **não** usa hostname Docker `api`; sua URL de API precisa ser válida na origem pública. Conferir proxy, origem CORS e cookies no ambiente real antes de afirmar segurança.

## 2. Fronteiras e locais de código

| Domínio | Implementação de referência | Funções |
|---|---|---|
| Família, pessoas, convites | `apps/api/src/familias/`, `pessoas/`, `convites/` | Espaço familiar, participante, vínculo, cadastro e ativação |
| Sessão e autorização | `apps/api/src/auth/`, `autorizacoes/` | Sessão, perfil contextual, leitura e revogação de acessos |
| Cuidados | `apps/api/src/cuidados/`, `anexos/` | Medicamentos, doses relatadas, consultas, exames, observações e documentos |
| Desenvolvimento e catálogo | `apps/api/src/desenvolvimento/`, `desenvolvimento/jogos/` | Biblioteca, sugestões, participações, estrelas, recompensas, jogos e progresso |
| Histórico, Resumo e PDF | Endpoints de leitura em `apps/api/src/cuidados/controlador-cuidados.ts`; UI por pessoa no `apps/web/src/app/f/[slug]/pessoas/[pessoaId]/` | Projeções a partir de dados existentes; sem novo módulo NestJS de histórico |
| Navegação e sessão Web | `apps/web/src/componentes/`, `apps/web/src/lib/api.ts` | Experiência por pessoa/família, menus contextuais e consumo de API |

A composição de módulos NestJS em vigor é `apps/api/src/modulo-app.ts`. Os quatro módulos de **Produto** não exigem correspondência 1:1 com classes `@Module` do backend.

## 3. Persistência e invariantes

O esquema Prisma inclui `Familia`, `Pessoa`, `Usuario`, `SessaoProvisoria`, `Autorizacao`, `Convite`; cuidados (`Medicamento`, `ProgramacaoMedicamento`, `RegistroDose`, `Consulta`, `Exame`, `Anexo`, `RegistroAtividade`); desenvolvimento (`Desafio`, `DisponibilidadeDesafio`, `ParticipacaoDesafio`, `MovimentoEstrelas`, `Recompensa`, `ResgateRecompensa`, `JogoDigital`, `FaseJogoDigital`, `ProgressoFaseJogo`).

Invariantes obrigatórias:
- Uma conta pessoal pertence a uma família, e os recursos privados devem validar **família, pessoa-alvo, domínio e operação**. Administrar a família não concede automaticamente leitura clínica ou infantil.
- Pessoa acompanhada pode existir sem conta; vínculo familiar não cria autorização.
- Revogações impedem operações futuras sem eliminar autoria e registros históricos.
- Programação de medicamento e relato de dose são fatos diferentes. **Sem confirmação não equivale a dose não tomada**; não inferir conduta clínica.
- Participações e movimentos de estrelas precisam de idempotência para evitar duplicar ganhos/custos. Disponibilidade atual não deve reescrever o histórico.
- Resumo/Histórico/PDF consomem fontes originais autorizadas, sem criar obrigação de preenchimento adicional.
- **Anexos na V1:** persistência privada no PostgreSQL (conteúdo Base64); S3 é direção futura, não integração existente.

Para regras detalhadas, prioridades e critérios de aceitação, seguir os documentos do Módulo 01–04 e as ADRs 013–015.

## 4. Contratos e validação

O código das rotas é a fonte atual de **contratos implementados**; uma lista proposta em documento antigo não é endpoint real. Controladores principais:

- `apps/api/src/auth/controlador-sessao.ts` — contexto de família, entrada, saída e `/me`.
- `apps/api/src/autorizacoes/controlador-autorizacoes.ts` — início, autorizações, acessos e revogação.
- `apps/api/src/cuidados/controlador-cuidados.ts` — rotina, medicamentos, registros de doses, consultas/exames, resumo e PDF.
- `apps/api/src/desenvolvimento/controlador-desenvolvimento.ts` — catálogo real, participações, estrelas e recompensas.
- `apps/api/src/desenvolvimento/jogos/controlador-jogos.ts` — fases e progresso de jogos.

Validar contratos, DTOs, status HTTP e tratamento de erros **no código/commit da demanda**. Não ampliar regras funcionais para ajustar uma implementação divergente. A CI de PR executa instalação, geração Prisma, lint, typecheck e build; smokes e validações de segurança por impacto devem complementar esse mínimo. O histórico de execução anterior à V1 foi arquivado no Git, sem necessidade de carregá-lo para cada demanda.

## 5. Homologação e limites de evolução

- **Ambiente vigente:** VPS HTTPS acessível apenas à equipe de testes; não inferir que está liberada para uso público ou dados reais.
- **PWA:** instalação e navegação móvel da V1; validar iPhone quando aplicável. Service worker para Web Push e notificações reais de medicamentos **não** são parte homologada da V1.
- **Segurança pré-uso real:** autenticação, tentativas de login, sessão/cookie, autorização contextual, isolamento, anexos, privacidade e tratamento de logs devem receber avaliação apropriada.
- **Operação:** validar backup/restauração em ambiente pertinente antes de uso real; o teste local antigo não equivale à restauração na VPS.
- **Sem infraestrutura antecipada:** não adicionar microsserviços, filas/Redis, banco vetorial, S3 ou pipeline de IA apenas por expectativa. Decisões posteriores em [Evolução pós-V1](../produto/EVOLUCAO-POS-V1.md).

**Procedimento de VPS:** [homologação e migrações](../esteira/estado/procedimento-homolog-deploy.md). A especificação funcional e as ADRs prevalecem nos seus respectivos domínios; divergências devem ser avaliadas pela governança antes de alterar comportamento.
