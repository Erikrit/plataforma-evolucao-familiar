# Documento Mestre do Produto — v1.0

**Estado:** baseline funcional do produto; **implementação parcial** do Módulo 01 verificada por inspeção da branch `feature/modulo1` em 2026-11-15. Revisões v1.1 dos módulos 03/04 propostas, ainda sem aceite final.  
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

## 4. Módulo 01 — Fundação Familiar

Pessoas e vínculos, participação externa, conta e convite, papéis funcionais contextualizados, revogação efetiva e página inicial com cartões de pessoas autorizadas. Cadastro progressivo; nome suficiente para cadastrar pessoa. Histórico sobrevive à revogação. Sem árvore genealógica complexa.

## 5. Módulo 02 — Cuidados da Vovó

- Medicamento com **nome, horários e informações adicionais somente quando essenciais**.
- Receita como foto ou PDF opcional; um arquivo pode estar associado a mais de um medicamento. Não exigir transcrição integral.
- Rotina do dia em cartões clicáveis que abrem escolhas; tocar não confirma automaticamente.
- Estados exibidos: **tomou conforme relato**, **informou que não tomou**, **sem confirmação**. Sem registro não significa não tomado.
- Alteração de horário e encerramento preservam histórico; correções rastreáveis.
- Consultas, exames e anexos com cadastro simples, atividades relevantes de apoio e companhia com registro rápido.
- Visão da colaboradora em seções separadas: medicamentos, atividades de apoio e consultas, com próximo cuidado relevante destacado.
- Lembretes discretos, destinatários autorizados, sem alertas alarmistas nem recomendações de doses.
- Histórico automático, relatório por período com prévia e exportação PDF.

**Não é sistema médico:** não interpretar exames, diagnosticar, orientar compensação de dose ou tomar decisão terapêutica.

## 6. Módulo 03 — Desenvolvimento da Laurinha

**Proposta de revisão funcional v1.1, pendente de aceite final**, detalhada em `docs/modulos/03-desenvolvimento-laurinha/ESPECIFICACAO.md`.

- Biblioteca curta de atividades presenciais e atividades personalizadas.
- Cadastro próprio: **nome**; dificuldade predefinida como simples e alterável. Categoria e instruções opcionais.
- Organização opcional **Guardar para depois**, sem planejamento com datas obrigatórias, atrasos ou cobrança.
- Adulto registra apenas **Concluiu** ou **Participou**. **Não realizada** não requer registro.
- Estrelas automáticas e transparentes, sem aprovação da Mikaela, penalidades, ranking ou avaliação clínica.
- Tabela v1.1 proposta, **ainda não aprovada**: simples 5/3; média 10/5; desafiadora 15/8 (concluiu/participou).
- Repetições legítimas de uma brincadeira são permitidas, reenvios acidentais não duplicam créditos.
- Recompensas opcionais; não condicionam necessidades básicas e afeto.
- Histórico aprofundado e resumo da evolução ficam no **Módulo 04**, sem telas ou dados duplicados.

## 7. Módulo 04 — Evolução Familiar

**Proposta de revisão funcional v1.1, pendente de aceite final**, detalhada em `docs/modulos/04-evolucao-familiar/ESPECIFICACAO.md`.

- Duas experiências centrais: **Histórico individual** e **Resumo da pessoa**, com filtros simples.
- Vovó: doses previstas, tomadas informadas, não tomadas informadas, sem confirmação, consultas e exames; respeitar alterações históricas de programação e dados autorizados.
- Laurinha: experiências, categorias quando disponíveis, conquistas e observações **já existentes**, sem converter estrelas em medidas de inteligência.
- Resumo familiar limitado a poucos destaques relevantes e autorizados na página inicial, sem feed próprio nem publicações manuais.
- Relatório PDF como ação do Resumo: período → prévia → exportação, sem recadastrar dados nem incluir anexos sensíveis por padrão.
- Sem dashboards genéricos, gráficos obrigatórios, ranking ou cobrança.
- Autorização vale para detalhes, metadados, indicadores, prévia e PDF.

## 8. Fora do MVP

Agenda universal, Kanban, rankings de produtividade, gestão trabalhista/financeira da colaboradora, prontuário completo, OCR clínico de receitas, diagnóstico por IA, jogos digitais, SaaS/billing, chat familiar e árvore genealógica complexa.

## 9. Critérios de sucesso

- Operações frequentes resolvidas com interações rápidas e campos mínimos.
- Autonomia da Vovó preservada; dados de saúde e da criança restritos a usuários autorizados.
- Colaboradora registra somente ocorrências relevantes, sem relatório de turno.
- Desafios e estrelas funcionam sem aprovação manual.
- Histórico e relatórios aproveitam os dados existentes.
- UX validada com usuários reais antes da conclusão do MVP.

## 10. Controle de mudanças

Toda alteração deve registrar: problema resolvido, novo trabalho imposto à família, possibilidade de reutilizar dados existentes, risco de privacidade/segurança, alternativas mais simples, aprovação e impacto. **Não criar funcionalidade sem valor demonstrável.**
