# Documento Mestre do Produto — v1.0

**Estado:** baseline funcional consolidada; produto não implementado.  
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

- Biblioteca de desafios presenciais e simples, organizados por categoria e dificuldade.
- Desafios personalizados e planejamento semanal **opcional**, liderado pela Mikaela.
- Adulto registra **concluiu / tentou / não realizou**, observação opcional.
- **Estrelas automáticas sem aprovação manual**; esforço pode ser reconhecido, ausência não gera punição.
- Regras de pontos simples e transparentes, consistentes, protegidas contra duplicidade.
- Recompensas extras combinadas pela família; não condicionar alimentação, cuidados, afeto ou necessidades básicas à pontuação.
- Histórico educativo baseado em experiências e observações; pontuação não representa diagnóstico, inteligência ou avaliação clínica.
- Não implementar XP/níveis complexos ou jogos digitais no MVP.

## 7. Módulo 04 — Evolução Familiar

Histórico **por pessoa**, filtros de período e categoria, detalhes expansíveis, resumo familiar apenas de acontecimentos importantes e autorizados; evitar um feed de todas as doses e atividades. Painéis pequenos com informações qualitativas. Relatórios da Vovó e Laurinha derivados dos registros já existentes, com prévia e PDF; sem preenchimento adicional.

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
