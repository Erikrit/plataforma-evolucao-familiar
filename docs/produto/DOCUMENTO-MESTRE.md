# Documento Mestre do Produto — v1.1

**Estado:** baseline de visão e requisitos funcionais aprovados para o MVP. O estado da implementação, evidências e homologação é mantido somente em `docs/produto/STATUS-E-ESCOPO.md`.  
**Público inicial:** família única, com possível expansão futura sem construir SaaS no MVP.

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
- **Integrante:** acompanha a rotina autorizada e registra relatos, ocorrências e apoios com poucos toques; anexos de exames ou observações somente quando a operação estiver prevista e autorizada. Não administra pessoas nem modifica prescrições/programações por padrão.

**Perfil ≠ vínculo ≠ autorização:** “Integrante” é o nome da experiência de participação; **integrante familiar** e **colaborador(a) externo(a)/contratado(a)** são tipos de vínculo distintos. Uma pessoa externa não passa a ser familiar por receber esse perfil. Uma pessoa pode acumular responsabilidades quando expressamente autorizada; cada ação depende de verificações contextuais de pessoa, domínio e operação. A Vovó mantém autonomia e pode acessar a própria rotina quando possuir conta e permissão. A navegação-base é compartilhada, adaptando áreas e ações sem criar três aplicações.

## 4. Módulo 01 — Fundação Familiar

Pessoas e vínculos, participação externa, conta e convite, papéis funcionais contextualizados, revogação efetiva e página inicial com cartões de pessoas autorizadas. Cadastro progressivo; nome suficiente para cadastrar pessoa. Histórico sobrevive à revogação. Sem árvore genealógica complexa.

## 5. Módulo 02 — Cuidados da Vovó

- Cadastro simplificado de medicamento **aprovado em 2026-11-15**: nome, primeiro horário, doses por dia e duração (contínua ou por dias), com sugestões matemáticas de horário editáveis e conferidas com a prescrição antes dos lembretes. Não deduzir intervalo clínico a partir do número de doses; opções especiais apenas quando necessárias.
- Receita como foto ou PDF opcional; um arquivo pode estar associado a mais de um medicamento. Não exigir transcrição integral.
- Rotina do dia em cartões clicáveis que abrem escolhas; tocar não confirma automaticamente.
- Estados exibidos: **tomou conforme relato**, **informou que não tomou**, **sem confirmação**. Sem registro não significa não tomado.
- Alteração de horário e encerramento preservam histórico; correções rastreáveis.
- Consultas, exames e anexos com cadastro simples, atividades relevantes de apoio e companhia com registro rápido.
- Visão da colaboradora em seções separadas: medicamentos, atividades de apoio e consultas, com próximo cuidado relevante destacado.
- **Lembretes aprovados em 2026-11-15:** um aviso discreto por ocorrência de medicamento no horário conferido; destinatários explicitamente selecionados e autorizados (Vovó, responsáveis e colaboradora quando aplicável); sem cobrança repetida por falta de confirmação e sem inferir dose não tomada. Consultas/exames com data permitem aviso antecipado simples; cancelamentos e alterações atualizam avisos futuros. Privacidade inclusive na tela bloqueada; entrega real depende de validação nos dispositivos. Não é canal único de segurança.
- Histórico automático, relatório por período com prévia e exportação PDF.

**Não é sistema médico:** não interpretar exames, diagnosticar, orientar compensação de dose ou tomar decisão terapêutica.

## 6. Módulo 03 — Desenvolvimento da Laurinha

**Revisão funcional v1.1 aprovada**, detalhada em `docs/modulos/03-desenvolvimento-laurinha/ESPECIFICACAO.md`.

- Biblioteca curta de atividades presenciais e atividades personalizadas.
- Cadastro próprio: **nome**; dificuldade predefinida como simples e alterável. Categoria e instruções opcionais.
- Organização opcional **Guardar para depois**, sem planejamento com datas obrigatórias, atrasos ou cobrança.
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
- PWA ou aplicativo nativo ainda depende de avaliação técnica e testes reais de notificações, sem ampliar requisitos funcionais por conveniência da tecnologia.

## 9. Fora do MVP

Agenda universal, Kanban, rankings de produtividade, gestão trabalhista/financeira da colaboradora, prontuário completo, OCR clínico de receitas, diagnóstico por IA, jogos digitais, SaaS/billing, chat familiar e árvore genealógica complexa.

## 10. Critérios de sucesso

- Operações frequentes resolvidas com interações rápidas e campos mínimos.
- Autonomia da Vovó preservada; dados de saúde e da criança restritos a usuários autorizados.
- Colaboradora registra somente ocorrências relevantes, sem relatório de turno.
- Desafios e estrelas funcionam sem aprovação manual.
- Histórico e relatórios aproveitam os dados existentes.
- UX validada com usuários reais antes da conclusão do MVP.

## 11. Controle de mudanças

Toda alteração deve registrar: problema resolvido, novo trabalho imposto à família, possibilidade de reutilizar dados existentes, risco de privacidade/segurança, alternativas mais simples, aprovação e impacto. **Não criar funcionalidade sem valor demonstrável.**
