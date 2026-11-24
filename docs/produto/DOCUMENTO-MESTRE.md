# Documento Mestre do Produto — baseline V1

**Estado:** baseline de visão e requisitos funcionais aprovados para o MVP. O estado da implementação, evidências e homologação é mantido somente em `docs/produto/STATUS-E-ESCOPO.md`.  
**Público vigente:** múltiplas famílias isoladas no mesmo sistema e banco, com **uma família por conta pessoal**, mantendo a experiência centrada nos integrantes de cada núcleo. Estado do uso: testes restritos da V1, sem dados familiares reais.

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

**Especificação funcional vigente v1.5**, detalhada em `docs/modulos/03-desenvolvimento-laurinha/ESPECIFICACAO.md`.

- Biblioteca curta de atividades presenciais e atividades personalizadas.
- Cadastro próprio: **nome**; dificuldade predefinida como simples e alterável. Categoria e instruções opcionais.
- Organização por **Explorar/Executadas**, com disponibilização novamente e preservação de participações; recompensas **Disponíveis/Resgatadas** podem ser disponibilizadas para novo resgate com novo débito, conforme especificação v1.2 do Módulo 03.
- Adulto registra apenas **Concluiu** ou **Participou**. **Não realizada** não requer registro.
- Estrelas automáticas e transparentes, sem aprovação da Mikaela, penalidades, ranking ou avaliação clínica.
- Tabela de estrelas **aprovada**: simples 5/3; média 10/5; desafiadora 15/8 (concluiu/participou).
- Repetições legítimas de uma brincadeira são permitidas, reenvios acidentais não duplicam créditos.
- Recompensas opcionais; não condicionam necessidades básicas e afeto.
- **Catálogo V1:** 24 modelos de atividades reais curadas e oito jogos digitais com 40 fases livres, sem rankings. Histórico aprofundado e resumo ficam no **Módulo 04**, sem telas ou dados duplicados.

## 7. Módulo 04 — Evolução Familiar

**Especificação funcional vigente v1.2**, detalhada em `docs/modulos/04-evolucao-familiar/ESPECIFICACAO.md`.

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
- **Autorização sem burocracia:** mostrar Administrador, Responsável e Integrante e quem acompanha quem; não expor matriz granular por operação no MVP. Parentesco, vínculo, responsabilidade e autorização permanecem distintos.
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

## 12. Decisões transversais consolidadas

- **Pessoa ≠ conta:** toda pessoa pode ser acompanhada sem credenciais. Uma conta pessoal pertence a uma família e pode acompanhar a si, a outra pessoa, ou ambas, conforme autorizações contextuais. O cadastro inicial de família/administrador ocorre pela interface; convites pessoais ativam contas de participantes sem expor senhas ao administrador.
- **Navegação:** uma única experiência centrada em pessoas e áreas autorizadas, com entrada contextual após login. Não criar aplicações distintas por perfil.
- **Autorizações:** três rótulos visuais simples, sem concessões automáticas de conteúdo sensível. Externo/colaborador e integrante familiar são vínculos diferentes, mesmo quando possuem experiência visual semelhante.
- **Escopo de V1:** os módulos 01–04 com E1–E5, biblioteca de 24 atividades e 8 jogos/40 fases integram a baseline homologada. PWA instalável não implica Web Push.
- **Governança:** regras e aceites detalhados vivem apenas nas especificações [M01](../modulos/01-fundacao-familiar/ESPECIFICACAO.md), [M02](../modulos/02-cuidados-vovo/ESPECIFICACAO.md), [M03](../modulos/03-desenvolvimento-laurinha/ESPECIFICACAO.md) e [M04](../modulos/04-evolucao-familiar/ESPECIFICACAO.md). Estado vigente em [Status e Escopo](STATUS-E-ESCOPO.md). Direções não implementadas em [Evolução pós-V1](EVOLUCAO-POS-V1.md).

## 13. Política de dados durante os testes da V1

A V1 está disponível na VPS com HTTPS **somente para a equipe de testes**, conforme o responsável pelo produto, **sem uso familiar real**. Cadastros e registros **fictícios e descartáveis** podem ser recriados em desenvolvimento quando necessário à demanda, sem compatibilidade artificial com dados legados.

**Essa decisão não autoriza agentes a apagar ou reinicializar automaticamente o banco da VPS, mesmo que contenha somente dados de teste.** Operações de reset, migração destrutiva, restauração, mudança de schema da VPS ou publicação exigem autorização específica e execução controlada. Continuam obrigatórias as regras de integridade, histórico, autorização, revogação, privacidade e testes pertinentes.

Os marcos e raciocínios originais das decisões de 20–22/11/2026 continuam disponíveis no [histórico Git anterior à consolidação](https://github.com/Erikrit/plataforma-evolucao-familiar/blob/f58d029658499bdfc3807c0488662c0bc4557dae/docs/produto/DOCUMENTO-MESTRE.md), mas não devem ser reexecutados como planos pendentes.
