# Estado das decisões e escopo

**Revisão:** 2026-11-15. **Base inspecionada:** `feature/modulo1` no commit `2c015c530736e9a1f3b51756f144487246e8c043`. A documentação de produto e a implementação têm ciclos distintos.

| Elemento | Situação verificada |
|---|---|
| Visão e princípios | Aprovados |
| Módulo 01 — Fundação Familiar | Especificação v1.1 (experiência móvel/privacidade aprovadas); **implementação parcial** na base previamente inspecionada |
| Módulo 02 — Cuidados da Vovó | Especificação v1.3 (cadastro, lembretes e experiência móvel/privacidade aprovados); **sem implementação funcional de cuidados constatada na base inspecionada** |
| Módulo 03 — Laurinha | Especificação funcional **v1.1 aprovada**; sem implementação observada |
| Módulo 04 — Evolução Familiar | Especificação funcional **v1.1 aprovada**; sem implementação observada |
| Arquitetura | Next.js, NestJS, Prisma, PostgreSQL e Docker Compose já presentes no código; demais decisões preliminares |
| Autorização contextual/convites | **Não implementados** no código inspecionado (só verificação básica de `familiaId` por sessão) |
| Autenticação | **Provisória**, com token de sessão no banco e `localStorage` no cliente |
| Notificações, anexos privados e PDFs | Não constatados como funcionalidades implementadas |
| Validação real de UX | Pendente |

## Evidências verificadas no repositório

- `apps/api/prisma/schema.prisma`: `Familia`, `Pessoa`, `Usuario`, `SessaoProvisoria`, ainda sem modelos de autorização contextual.
- `apps/api/src/auth/`: entrada, consulta de sessão e saída provisórias.
- `apps/api/src/pessoas/`: listagem e criação de pessoas por família; nome obrigatório apenas.
- `apps/web/src/componentes/painel-fundacao.tsx`: formulário de login provisório, cadastro com nome e listagem simples de pessoas, ainda sem cartões individuais concluídos.
- `docs/esteira/estado/evidencia-ff-02.json` registra PASS em typecheck, lint, build e smoke FF-02. **São evidências registradas no repositório; esta revisão não executou testes ou implantou a aplicação.**

## Atenção antes do uso com dados reais

**Impedimento de segurança:** a autenticação ainda é experimental. O frontend guarda token em `localStorage`, pré-preenche credenciais fictícias de desenvolvimento, e o backend não possui autorização contextual por pessoa/módulo. O repositório está **público**. Não inserir informações médicas, dados privados de crianças ou credenciais reais até concluir autenticação segura, autorização contextual e validações apropriadas. Credenciais seed são apenas para desenvolvimento local; nunca para produção.

## Separação de escopos

**Produto:** `docs/produto/`, `docs/modulos/` e decisões funcionais pertinentes de `docs/arquitetura/`. Esta conversa só trata do produto.

**Processo de desenvolvimento:** `docs/esteira/`, `.cursor/`, `AGENTS.md`, scripts correspondentes. Existe no repositório por decisão prévia, mas sua especificação e operação são tratadas em outro contexto. **Não houve alterações nesses arquivos nesta revisão.**

## Decisões funcionais aprovadas em 2026-11-15

- **Experiência móvel transversal:** uso prioritário em celular e adequado ao computador, navegação centrada nas pessoas, botões legíveis e poucos toques; mesma estrutura básica, conteúdo e operações filtrados por autorização.
- **Privacidade funcional:** perfis prontos com ajuste opcional; vínculo familiar e administração não equivalem a acesso sensível; Vovó compreende quem acompanha seus cuidados e participa das escolhas legítimas; colaboradora sem acesso automático a dados de Laurinha ou documentos clínicos completos.
- **Notificações e conectividade:** avisos discretos por padrão, detalhamento sensível só com escolha e autorização; em falha de rede não declarar registro concluído. PWA versus aplicativo nativo fica para validação técnica e testes em dispositivos reais.

- **Módulo 02 v1.2:** cadastro de medicamento por nome, primeiro horário, número de doses diárias e duração (contínua ou dias). Sugestões de horários editáveis apenas para conferência com prescrição, sem inferir intervalo terapêutico; frequências especiais em opções progressivas.
- **Comportamento dos lembretes:** aviso nos horários confirmados, para destinatários escolhidos e autorizados; compromissos com data/hora podem ter aviso antecipado simples. Sem cobrança por falta de confirmação, sem divulgação indevida de informações sensíveis, e atualização de avisos futuros quando houver mudança/cancelamento. Canais e entrega efetiva ainda dependem de validação prática.

- **Módulo 03 v1.1:** nome + dificuldade predefinida como simples, guardar para depois, registro Concluiu/Participou, histórico no Módulo 04, sem cadastro de não realização.
- **Estrelas:** dificuldade simples = 5/3; média = 10/5; desafiadora = 15/8 (Concluiu/Participou). Cálculo automático, sem aprovação manual, sem reescrever créditos históricos.
- **Módulo 04 v1.1:** histórico individual e resumo contextual, poucos destaques familiares, PDF como ação do resumo.

## Validações ainda pendentes

- Experiência de uso real com a família e confiabilidade de lembretes nos dispositivos previstos.
- Controles de autenticação e autorização antes do uso de informações reais sensíveis.

## Ordem funcional

01 Fundação Familiar → 02 Cuidados → 03 Laurinha → 04 Evolução, porém autoria, autorização e histórico mínimo não devem ser adiados até o quarto módulo.
