# Documento Mestre do Produto — v1.8

**Estado:** baseline de visão e requisitos funcionais aprovados para o MVP. O estado da implementação, evidências e homologação é mantido somente em `docs/produto/STATUS-E-ESCOPO.md`.  
**Público da baseline V1:** família única. **Direção pós-V1 aprovada:** famílias isoladas no mesmo sistema/banco, com conta pessoal vinculada a uma única família, conforme §14.

## 1. Visão

Organizar cuidados, desenvolvimento e acontecimentos relevantes das pessoas, preservar memória longitudinal e reduzir a carga de organização familiar. Não é ferramenta de produtividade, controle de profissionais ou prontuário clínico.

## 2. Princípios obrigatórios

- **Evolução familiar:** acompanhar pessoas, rotinas, cuidados e desenvolvimento ao longo do tempo.
- **Esforço mínimo:** registrar informações rapidamente, sem preenchimentos repetidos.
- **Organização sem cobrança:** lembrar, incentivar e acompanhar, sem tornar a rotina obrigação.
- Se uma informação não ajuda a lembrar, cuidar, organizar ou compreender a evolução, questionar sua coleta.
- Se alimentar o sistema for trabalhoso, ele será abandonado.
- **Pessoas antes de tarefas.** Interface centrada em integrantes e seus contextos, mobile-first.
- A segurança de crianças e dados de saúde deve permanecer mesmo com UX simples.

## 3. Participantes e responsabilidades

- **Administrador inicial:** convites e autorizações do núcleo familiar.
- **Vovó:** pessoa acompanhada, independente, que relata/confirmará o uso dos próprios medicamentos; conta opcional.
- **Responsável por cuidados:** cadastra medicamentos, compromissos e acompanha informações autorizadas.
- **Colaboradora adulta externa:** acesso restrito à Vovó e tarefas autorizadas; não é membro de parentesco e não atua como profissional clínico por presunção.
- **Laurinha (6 anos):** participa de experiências educativas acompanhadas por adulto.
- **Mikaela:** responsável principal por selecionar e organizar os desafios educativos; não precisa aprovar cada concessão de estrelas.

Uma pessoa pode existir sem conta de acesso. Parentesco não equivale a permissão. O administrador não recebe automaticamente acesso irrestrito a informações confidenciais.

### Experiências de uso e nomenclatura — decisão aprovada em 2026-11-16

A interface apresenta três **perfis de experiência/responsabilidade**: **Administrador**, **Responsável** e **Integrante** (nome aprovado em substituição ao rótulo visual anterior “Colaborador”). Esses nomes orientam a organização das telas, **não são concessões automáticas de acesso** nem exigem renomeação de identificadores técnicos existentes.

- **Administrador:** gerencia pessoas, convites, vínculos e autorizações, com visão dos metadados mínimos de quem acompanha quem. Não recebe automaticamente acesso a medicamentos, relatórios clínicos, exames ou desenvolvimento infantil.
- **Responsável:** planeja e gerencia medicamentos, consultas, atividades e relatórios **apenas para as pessoas e domínios autorizados**.
- **Integrante:** acompanha a rotina autorizada e registra relatos/ocorrências com poucos toques; dispõe de **observação diária opcional na própria Rotina** quando autorizada, sem categorias obrigatórias de apoio nem relatório de turno. Anexos de exames somente quando a operação estiver prevista e autorizada. Não administra pessoas nem modifica prescrições/programações por padrão.

**Perfil ≠ vínculo ≠ autorização:** “Integrante” é o nome da experiência de participação; **integrante familiar** e **colaborador(a) externo(a)/contratado(a)** são tipos de vínculo distintos. Uma pessoa externa não passa a ser familiar por receber esse perfil. Uma pessoa pode acumular responsabilidades quando expressamente autorizada; cada ação depende de verificações contextuais de pessoa, domínio e operação. A Vovó mantém autonomia e pode acessar a própria rotina quando possuir conta e permissão. A navegação-base é compartilhada, adaptando áreas e ações sem criar três aplicações.

## 4. Módulo 01 — Fundação Familiar

Pessoas e vínculos, participação externa, conta e convite, papéis funcionais contextualizados, revogação efetiva e página inicial com cartões de pessoas autorizadas. Cadastro progressivo; nome suficiente para cadastrar pessoa. Histórico sobrevive à revogação. Sem árvore genealógica complexa.

## 5. Módulo 02 — Cuidados da Vovó

- Cadastro simplificado de medicamento **aprovado em 2026-11-15**: nome, primeiro horário, doses por dia e duração (contínua ou por dias), com sugestões matemáticas de horário editáveis e conferidas com a prescrição antes dos lembretes. Não deduzir intervalo clínico a partir do número de doses; opções especiais apenas quando necessárias.
- Receita como foto ou PDF opcional; um arquivo pode estar associado a mais de um medicamento. Não exigir transcrição integral.
- Rotina do dia em cartões clicáveis que abrem escolhas; tocar não confirma automaticamente.
- Estados exibidos: **tomou conforme relato**, **informou que não tomou**, **sem confirmação**. Sem registro não significa não tomado.
- Alteração de horário e encerramento preservam histórico; correções rastreáveis.
- Consultas, exames e anexos com cadastro simples; **apoio e companhia são registrados por uma observação diária opcional na própria Rotina**, sem menus ou categorias de atividades obrigatórias. Histórico aproveita o registro existente, sem digitação repetida.
- **Integrante:** vê somente cuidados e compromissos autorizados e pode escrever observação breve, sem telas de cadastro de medicamentos/consultas ou formulários de relatório de turno. **Responsável:** usa a mesma Rotina e acessa gestão de medicamentos, consultas e exames no menu lateral contextual, conforme autorização.
- **Lembretes aprovados em 2026-11-15:** um aviso discreto por ocorrência de medicamento no horário conferido; destinatários explicitamente selecionados e autorizados (Vovó, responsáveis e colaboradora quando aplicável); sem cobrança repetida por falta de confirmação e sem inferir dose não tomada. Consultas/exames com data permitem aviso antecipado simples; cancelamentos e alterações atualizam avisos futuros. Privacidade inclusive na tela bloqueada; entrega real depende de validação nos dispositivos. Não é canal único de segurança.
- Histórico automático, relatório por período com prévia e exportação PDF.

**Não é sistema médico:** não interpretar exames, diagnosticar, orientar compensação de dose ou tomar decisão terapêutica.

## 6. Módulo 03 — Desenvolvimento da Laurinha

**Revisão funcional v1.1 aprovada**, detalhada em `docs/modulos/03-desenvolvimento-laurinha/ESPECIFICACAO.md`.

- Biblioteca curta de atividades presenciais e atividades personalizadas.
- Cadastro próprio: **nome**; dificuldade predefinida como simples e alterável. Categoria e instruções opcionais.
- Organização por **Explorar/Executadas**, com disponibilização novamente e preservação de participações; recompensas **Disponíveis/Resgatadas** podem ser disponibilizadas para novo resgate com novo débito, conforme especificação v1.2 do Módulo 03.
- Adulto registra apenas **Concluiu** ou **Participou**. **Não realizada** não requer registro.
- Estrelas automáticas e transparentes, sem aprovação da Mikaela, penalidades, ranking ou avaliação clínica.
- Tabela de estrelas **aprovada**: simples 5/3; média 10/5; desafiadora 15/8 (concluiu/participou).
- Repetições legítimas de uma brincadeira são permitidas, reenvios acidentais não duplicam créditos.
- Recompensas opcionais; não condicionam necessidades básicas e afeto.
- Histórico aprofundado e resumo da evolução ficam no **Módulo 04**, sem telas ou dados duplicados.

## 7. Módulo 04 — Evolução Familiar

**Revisão funcional v1.1 aprovada**, detalhada em `docs/modulos/04-evolucao-familiar/ESPECIFICACAO.md`.

- Duas experiências centrais: **Histórico individual** e **Resumo da pessoa**, com filtros simples.
- Vovó: doses previstas, tomadas informadas, não tomadas informadas, sem confirmação, consultas e exames; respeitar alterações históricas de programação e dados autorizados.
- Laurinha: experiências, categorias quando disponíveis, conquistas e observações **já existentes**, sem converter estrelas em medidas de inteligência.
- Resumo familiar limitado a poucos destaques relevantes e autorizados na página inicial, sem feed próprio nem publicações manuais.
- Relatório PDF como ação do Resumo: período → prévia → exportação, sem recadastrar dados nem incluir anexos sensíveis por padrão.
- Sem dashboards genéricos, gráficos obrigatórios, ranking ou cobrança.
- Autorização vale para detalhes, metadados, indicadores, prévia e PDF.

## 8. Decisões transversais de experiência móvel e privacidade — aprovadas em 2026-11-15

- **Mobile-first sem exclusividade:** experiência prioritária no celular, adequada também ao computador, com botões legíveis, poucos toques e conteúdo centrado nas pessoas.
- **Navegação única, contexto variável:** estrutura básica consistente; cartões, ações e informações visíveis apenas com autorização.
- **Autorização sem burocracia:** perfis predefinidos, personalização opcional; parentesco, responsabilidade e permissão são conceitos distintos.
- **Autonomia e proteção:** a Vovó compreende quem acompanha seus cuidados e pode participar das escolhas legítimas; administrador não herda acesso clínico irrestrito; dados infantis e documentos sensíveis permanecem protegidos.
- **Notificações discretas por padrão:** detalhamento sensível apenas mediante escolha e autorização, sem exposição indevida em telas bloqueadas.
- **Estado de gravação confiável:** diante de falha de conexão, não afirmar que um registro foi salvo.
- **PWA instalável integra a V1 em homologação** (manifesto e ícones, com instalação Android aprovada); testes em outros dispositivos podem continuar. **Web Push e lembretes automáticos reais são incrementos posteriores**, sujeitos à validação de confiabilidade e privacidade; não confundir instalação da PWA com entrega de notificações.

## 9. Fora do MVP

Agenda universal, Kanban, rankings de produtividade, gestão trabalhista/financeira da colaboradora, prontuário completo, OCR clínico de receitas, diagnóstico por IA, **Web Push/lembretes automáticos ainda não implementados**, SaaS/billing, chat familiar e árvore genealógica complexa. **Os oito jogos digitais e 40 fases já homologados integram a V1** conforme Módulo 03 §13; as evoluções E6/E7 com IA permanecem fora da V1.

## 10. Critérios de sucesso

- Operações frequentes resolvidas com interações rápidas e campos mínimos.
- Autonomia da Vovó preservada; dados de saúde e da criança restritos a usuários autorizados.
- Colaboradora registra somente ocorrências relevantes, sem relatório de turno.
- Desafios e estrelas funcionam sem aprovação manual.
- Histórico e relatórios aproveitam os dados existentes.
- UX validada com usuários reais antes da conclusão do MVP.

## 11. Controle de mudanças

Toda alteração deve registrar: problema resolvido, novo trabalho imposto à família, possibilidade de reutilizar dados existentes, risco de privacidade/segurança, alternativas mais simples, aprovação e impacto. **Não criar funcionalidade sem valor demonstrável.**

## 12. Decisão de Produto — modelo de participação e acesso (2026-11-20)

**APROVADO pelo responsável do Produto como direção funcional L3 para o Módulo 01** após reprovação humana da gestão de pessoas/contas/permissões. O objetivo é que o produto represente intuitivamente **quem é acompanhado, quem possui conta, quem acompanha e em quais áreas**, sem obrigar uma pessoa a desempenhar apenas uma função.

- **Pessoa acompanhada** é qualquer pessoa com trajetória no sistema; pode existir sem conta e ser acompanhada por responsáveis autorizados. **Usuário/conta** é a credencial pessoal para entrar; não é sinônimo de pessoa acompanhada.
- **Participante com conta** pode acompanhar **a si mesmo, outra(s) pessoa(s), ou ambas**, de acordo com direitos efetivos por pessoa, área e operação. Não introduzir `Ator`/`Integrante` como enum mutuamente exclusivo ou impedir responsabilidades acumuladas. São conceitos explicativos da experiência, não nova fonte de autorização.
- **Responsável** continua uma responsabilidade contextual da área, não um tipo permanente de pessoa. Os três rótulos de experiência Administrador, Responsável e Integrante e a separação de vínculo familiar/externo permanecem, respeitando autorizações reais.
- **Cadastro progressivo:** nome mínimo para pessoa; data de nascimento opcional em vez de idade estática. Conta é opcional. Se houver necessidade de conta, apresentar convite/ativação pessoal para definir e manter senha, sem exigir que administrador cadastre ou conheça senha do usuário. Reutilizar pessoa existente ao vincular conta quando apropriado, impedindo duplicação; os contratos, tratamento de identidade e consentimento serão validados pela Arquitetura.
- **Acesso e organização:** selecionar participante, pessoa acompanhada, área e responsabilidade compatível. Apresentar capacidades permitidas de forma compreensível **sem** matriz livre de checkboxes por operação. Autoacompanhamento deve permitir experiência útil dos próprios dados; diferença entre visualização própria e operações de gestão exige especificação e autorização explícitas antes de ampliar gates.
- **Entrada após autenticação:** com **um único contexto operacional autorizado**, abrir diretamente sua área principal (Cuidados/Rotina ou Desenvolvimento). Com múltiplos contextos, apresentar seleção simples de pessoa/área, preferencialmente respeitando uma escolha anterior segura se houver; com papel exclusivamente administrativo, abrir gestão familiar. Nunca redirecionar para área sem autorização.
- **Proteção e continuidade:** não ampliar direitos por parentesco, papel administrativo ou login; revogações eficazes, sessões e isolamento entre pessoas/famílias; preservar histórico e autoria, não criar conta duplicada; não impor login a crianças ou idosos sem necessidade.

**Fechamento pelo Produto em 2026-11-20:** o sistema ainda está em desenvolvimento e não possui usuários em utilização, conforme informado pelo responsável. Associação, reconciliação ou migração de contas legadas ficam fora desta entrega. O cadastro e a ativação ordinários devem manter a relação consistente entre pessoa e conta, conforme FUN-03 e seção 11 do Módulo 01.

**Autoacompanhamento aprovado com o comportamento atual:** preservar as capacidades efetivas do servidor, inclusive a distinção entre leitura/relato próprio e gestão/exportação dependentes de responsabilidade contextual. A decisão encerra a pendência sobre novos poderes de autoacompanhamento. A fonte detalhada é a especificação do Módulo 01 v1.5.

**Encaminhamento:** implementar a simplificação de cadastro, apresentação de acessos e entrada contextual usando os contratos e autorizações vigentes; UX detalha a escolha de pessoa/área dentro da direção aprovada. O status de homologação humana do Módulo 01 segue REPROVADO até nova avaliação. Módulo 04 permanece pausado.

**Publicação documental:** o responsável autorizou expressamente o commit deste alinhamento no GitHub em 2026-11-20. Essa autorização aplica-se a esta atualização documental.

## 13. Evolução pós-V1 e dados de desenvolvimento — decisão de Produto, 2026-11-21

**APROVADO expressamente pelo responsável do Produto.** A V1 foi homologada humanamente após as atualizações do Módulo 04. A situação da versão, baseline, evidências e lacunas é mantida em `docs/produto/STATUS-E-ESCOPO.md`.

Esta seção registra a decisão histórica de pré-uso em 2026-11-21. **Estado posterior (2026-11-24):** V1 aprovada/homologada e disponível para **testes restritos na VPS HTTPS**, conforme informado pelo responsável; sem liberação pública nem dados reais. O estado atual pertence ao `STATUS-E-ESCOPO.md`. A evolução preserva os princípios de evolução familiar, esforço mínimo, organização sem cobrança, privacidade e simplicidade.

**Dados pré-uso:** nas próximas alterações, os cadastros e registros atuais de desenvolvimento podem ser descartados ou recriados quando necessário. A equipe pode evoluir schema e contratos sem implementar migração, conversão, compatibilidade retroativa ou associação de contas apenas para preservar esses dados. Pode ajustar/recriar seeds e aplicar reset no banco de desenvolvimento pertinente à demanda. Mudanças devem continuar executáveis de forma consistente em ambiente novo.

A dispensa vale para os dados de desenvolvimento desta fase pré-uso. Os requisitos funcionais de autorização, histórico, autoria, correções e revogação continuam valendo para o comportamento do sistema em execução. A decisão não resolve por si a regra de remoção de pessoa nem implica conceder acesso adicional.

Usar demandas delimitadas e as fontes oficiais vigentes para implementar evoluções. Aceites posteriores devem identificar o escopo alterado e as regressões verificadas em relação à baseline V1. A futura disponibilização para uso depende de decisão própria do responsável.

## 14. Conta pessoal por família — decisão de Produto, 2026-11-21

**APROVADO expressamente pelo responsável do Produto.** A expansão atende várias famílias no mesmo sistema e banco, com entrada contextual pela URL de cada família. Cada conta pessoal está vinculada a uma única família. Pessoas com acesso mantêm suas credenciais pessoais e direitos dentro desse núcleo.

A regra funcional pertence a `docs/modulos/01-fundacao-familiar/ESPECIFICACAO.md` v1.6, FUN-08/FAM-R13. Ela substitui a proposta de conta global com participação em várias famílias do documento de evolução. A autorização continua sendo contextual por pessoa, área e operação.

A arquitetura e a experiência da entrega E1 devem partir dessa delimitação. A direção das demais frentes foi aprovada posteriormente, conforme §15 e `docs/produto/EVOLUCAO-POS-V1.md` v2.1; seus detalhamentos mantêm os estados específicos. Os princípios de esforço mínimo, organização sem cobrança e valor de cada informação solicitada permanecem critérios obrigatórios de produto.

## 15. Direção integrada pós-V1 — aprovação de Produto, 2026-11-21

O responsável do Produto aprovou a recomendação apresentada sobre o plano integrado v2.0, registrado no commit `9193f1660ec2fa06ebdd19d633cc83b86e3a828e`. A direção e a sequência E1–E7 ficam **APROVADAS e DOCUMENTADAS** em `docs/produto/EVOLUCAO-POS-V1.md` v2.1.

A evolução abrange contexto familiar isolado, gestão compreensível de acessos, exames/resumo factual, catálogo real curado, piloto digital, sugestões assistidas de desenvolvimento e resumo assistido de cuidados. A implementação será incremental, com aceite humano por entrega e respeito aos princípios da seção 2.

Esta aprovação fixa visão, limites e ordem de trabalho. Pontuação digital e seu uso em recompensas, envio de dados pessoais à IA e regras clínicas exigem decisão específica nas respectivas entregas. Números propostos de catálogo/jogos e contratos candidatos não se tornam obrigações aprovadas automaticamente.

O primeiro recorte funcional pertence ao Módulo 01 v1.7, seção 13. Seu planejamento pode seguir para execução na esteira. As fontes dos módulos 02–04 serão atualizadas quando cada entrega tiver regras fechadas. A disponibilização do produto para uso continua dependendo de decisão própria, conforme §13.

## 16. Entrada e cadastro de família — decisão de Produto, 2026-11-21

Após reprovar humanamente a entrada da E1, o responsável aprovou boas-vindas em / e /f, com criação de família e primeira conta pessoal administradora pela interface. Essa decisão substitui a exclusividade do provisionamento privado prevista no primeiro recorte E1. O fluxo mantém os limites de conta por família e autorização contextual.

**E-mail permanece identificador de login.** O responsável dispensou apenas o envio da mensagem nesta etapa. A confirmação apresenta o endereço da família e ações para copiar/acessar, com senha definida pelo titular durante o cadastro.

Fonte funcional: Módulo 01 v1.8, FUN-09 e seção 14. Planejamento e homologação pertencem à esteira e ao STATUS. A mudança autoriza evolução pré-uso; disponibilização pública em produção continua dependendo de decisão própria.
