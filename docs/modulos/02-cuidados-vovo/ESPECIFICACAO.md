# Módulo 02 — Cuidados da Vovó

**Versão:** especificação funcional v1.7 — E3, download privado de exames, aprovado em 2026-11-22  
**Status funcional:** especificação aprovada. Estado do código, evidências, notificações e pendências de homologação em `docs/produto/STATUS-E-ESCOPO.md`.  
**Dependência:** Fundação Familiar.

## 1. Objetivo

Organizar medicamentos, consultas e exames, com observações simples sobre apoio, companhia e acontecimentos relevantes diretamente na Rotina diária; permitir registro rápido de informações relatadas pela Vovó; preservar histórico. Não é prontuário eletrônico nem substitui orientação clínica.

## 2. Participantes

- **Vovó:** pessoa independente e fonte prioritária de confirmação de uso; acesso próprio opcional.
- **Responsável por cuidados:** cadastra e altera programação, organiza compromissos.
- **Colaboradora adulta externa (experiência visual Integrante):** visualiza rotina autorizada e registra relatos/atividades de apoio; não altera prescrição por padrão. O vínculo permanece externo/contratado, não familiar.
- **Administrador:** gerencia permissões sem acesso clínico irrestrito automático.

## 3. Funcionalidades e regras

### CUI-F01 — Cadastrar medicamento

**Cadastro padrão, com poucos campos:**
- Nome do medicamento.
- Primeiro horário.
- Quantidade de doses ao dia.
- Duração: uso contínuo ou quantidade de dias.
- Horários sugeridos automaticamente **quando a frequência e o intervalo da prescrição permitirem**; possibilidade de ajustar ou informar os horários exatamente como constam da orientação vigente.
- Receita em foto/PDF opcional; um documento pode corresponder a vários medicamentos. Não transcrever tudo nem extrair dados da imagem automaticamente.

**Regras de segurança e simplicidade:**
- O cálculo de horários é apenas um auxílio matemático **para conferência**, não uma definição de tratamento. O sistema não presume que múltiplas doses podem ser distribuídas igualmente em 24 horas, nem inventa intervalo clínico. Sem intervalo claro, orientar o preenchimento dos horários prescritos.
- Mostrar os horários calculados/editados e pedir conferência com a orientação vigente **antes de ativar os lembretes**.
- Se a prescrição for por intervalo (por exemplo, a cada 8 horas), os horários podem atravessar a meia-noite; a apresentação deve indicar corretamente os dias e o fim do período. Não equiparar automaticamente “3 doses por dia” a “a cada 8 horas”.
- Opções especiais (dias alternados, dias específicos, intervalo próprio ou instruções adicionais) aparecem somente quando a pessoa realmente precisar.
- A quantidade de dias define o período de programação, sem alterar prescrição por conta própria. Para uso contínuo não inventar data de encerramento.
- Não exigir fabricante, farmácia, estoque, preço ou outros campos sem necessidade para lembrar/cuidar.
- O sistema não faz recomendações clínicas de dose, duração ou horários.

### CUI-F02 — Rotina do dia

Exibir medicamentos e consultas/compromissos autorizados, com próximo cuidado relevante destacado, e **um campo opcional de observação do dia** acessível na própria Rotina para quem puder registrar. Não criar menu independente de Apoio e companhia nem categorias predefinidas obrigatórias. Cartão clicável mostra nome, horário e situação; tocar abre opções, **não confirma**. Situações: **tomou conforme informação**, **informou que não tomou**, **sem confirmação**. Ausência de registro não equivale a não tomada.

### CUI-F03 — Registrar dose

Após relato da Vovó, pessoa autorizada seleciona a situação; horário efetivo opcional quando conhecido. Backend identifica ocorrência, autor e momento. Não exigir justificativa. Evitar duplicidade e preservar correções; não sugerir compensações de dose.

### CUI-F04 — Alterar, suspender, encerrar

Programação com vigência; novo horário não altera o passado. Encerramento/suspensão interrompe novos lembretes correspondentes; histórico e anexos anteriores preservados. Colaboradora não altera prescrição sem autorização explícita.

### CUI-F05 — Consultas

Data/hora e especialidade/descrição; profissional, local, observação e documentos opcionais. Permitir editar, cancelar e marcar realizada preservando histórico relevante. Lembretes discretos a destinatários autorizados.

### CUI-F06 — Exames

Descrição; data se conhecida; arquivo opcional. Possível vínculo a consulta. Não interpretar resultados ou diagnosticar.

### CUI-F07 — Apoio e companhia

**Decisão funcional aprovada em 2026-11-17:** substituir o fluxo de categorias/cartões de apoio e companhia por **uma observação breve e opcional por registro do dia**, diretamente na Rotina da pessoa acompanhada. Não pedir categoria, classificação, atividade ou justificativa; não exigir registro diário. O campo pode ficar vazio sem gerar pendência ou cobrança. Quando registrada, a observação inclui automaticamente pessoa acompanhada, autor e momento, e aparece no histórico autorizado sem recadastro. O Responsável pode consultar as observações no acompanhamento/Evolução, conforme autorização. **Registrar observação exige autorização contextual explícita;** a decisão não libera automaticamente dados a familiares, administradores nem terceiros. Não é relatório de turno, controle trabalhista, avaliação clínica ou ranking.

**Dependência de implementação:** verificar se a operação atual de registro de apoio comporta texto livre sem exigir categoria/atividade. Se não comportar, propor a menor adaptação do contrato/dados/autorizações existente, com avaliação de Arquitetura e preservação de registros históricos; não presumir que a API de observações esteja pronta nem criar um módulo novo. Prever correção/autoria e feedback de gravação real conforme as regras gerais.

### CUI-F08 — Lembretes

**Objetivo:** lembrar de cuidados e compromissos de maneira discreta, sem fiscalizar pessoas nem tornar o registro obrigatório.

**Medicamentos**
- Cada ocorrência prevista pode gerar **um lembrete no horário cadastrado e conferido**, durante a vigência da programação ativa.
- O lembrete identifica de maneira clara e discreta o medicamento e o horário, sem recomendar ajustes de dose.
- A Vovó pode ser destinatária quando possuir acesso e desejar receber notificações; responsáveis autorizados podem ser incluídos de forma simples e explícita. A colaboradora só recebe lembretes da rotina da Vovó se estiver autorizada e designada para recebê-los.
- O sistema não presume que todos os familiares devam receber a mesma notificação. Os destinatários podem ser ajustados sem modificar a prescrição.
- **Ausência de confirmação não gera cobrança repetida nem aviso automático afirmando que a dose não foi tomada.** Na rotina, a situação permanece *sem confirmação* até haver relato ou correção.
- Confirmar, corrigir, suspender, encerrar ou alterar a programação deve manter os lembretes futuros coerentes com a programação vigente, sem duplicar avisos.
- Notificações devem ser **discretas por padrão**, sem nome de medicamento na tela bloqueada; apresentação detalhada somente por escolha expressa e autorização adequada, considerando o risco de aparelhos compartilhados.

**Consultas e exames**
- Compromissos com data/hora podem receber aviso antecipado simples, direcionado somente a destinatários autorizados. O momento do aviso deve seguir uma escolha simples do usuário; não exigir configurações complexas.
- Consultas canceladas não geram próximos lembretes. Exames sem data/hora não geram aviso agendado.
- Evitar lembretes repetidos, insistentes ou alarmistas.

**Experiência e limitações**
- O usuário visualiza a programação e sabe quem será lembrado, sem gerenciar uma lista complexa de regras.
- O sistema não apresenta uma notificação como prova de que o medicamento foi usado ou de que o aviso foi lido.
- Entrega de avisos depende de permissões e condições reais dos dispositivos; canais e confiabilidade devem ser validados no uso real, sem prometer funcionamento infalível.
- **A plataforma não é o único mecanismo de segurança para medicamentos.** Caso falhem notificações, a rotina permanece consultável no aplicativo, sem inventar confirmações.
- Nenhuma escolha de PWA, aplicativo nativo ou fornecedor de notificações é estabelecida por esta especificação; aqui definimos apenas o comportamento esperado.

### CUI-F09 — Histórico

Linha do tempo individual com doses, mudanças de programação, consultas, exames, atividades significativas, documentos e correções, quando autorizados. Sem alimentação duplicada.

### CUI-F10 — Resumo e PDF

Período selecionável; distinguir previstas, informadas como tomadas, informadas como não tomadas e não confirmadas. Consultas, exames e observações pertinentes. Prévia antes de PDF. Sem inferência clínica.

### CUI-F11 — Experiência móvel e autonomia

- A Vovó visualiza uma rotina simples com o próximo cuidado e pode confirmar seu próprio relato quando tiver acesso; o cartão abre opções e não confirma automaticamente.
- Responsáveis autorizados visualizam o acompanhamento relevante e observações permitidas; **Integrante**, inclusive colaboradora externa, vê somente medicamentos e consultas atribuídos e registra observação diária opcional quando autorizado, sem navegar por documentos sensíveis ou dados de crianças sem autorização específica.
- Botões legíveis, poucos toques e confirmação compreensível; a plataforma não impõe relatórios de turno.
- A Vovó deve compreender quem recebe informações de seus cuidados e participar das escolhas de compartilhamento conforme sua autonomia e as autorizações legítimas.
- Erro de rede não pode ser apresentado como confirmação de dose. Manter `sem confirmação` até registro confirmado e não gerar cobranças de ausência.

## 4. Fluxos essenciais

1. **Cadastro:** responsável → novo medicamento → nome + primeiro horário + quantidade de doses/dia + duração (contínua ou por dias) → conferir horários sugeridos ou informar os prescritos → receita opcional → ativar lembretes.
2. **Registro:** tocar cartão → selecionar relato da Vovó → confirmar → atualizar histórico automaticamente.
3. **Correção:** abrir registro → corrigir → salvar → preservar valor anterior e autoria.
4. **Alteração médica:** atualizar programação com vigência → anexar nova receita opcional → preservar passado.
5. **Integrante (colaboradora externa):** acessar apenas Vovó → Rotina de medicamentos e compromissos autorizados → relatar dose ou registrar observação breve opcional; sem categorias de apoio ou configuração.
6. **Consulta/exame:** cadastro simples → lembrete opcional → realização/cancelamento → arquivo opcional.

## 5. Permissões

| Operação | Vovó | Responsável | Colaboradora externa (experiência Integrante) |
|---|---|---|---|
| Visualizar rotina | Própria | Se autorizado | Somente atribuído |
| Confirmar próprio relato/registrar relato | Sim | Sim | Sim, se autorizado |
| Cadastrar/alterar programação | Não por padrão | Sim | Não |
| Consultar documentos | Próprios | Se autorizado | Apenas estritamente necessário |
| Organizar consultas/exames | Conforme configuração | Sim | Não por padrão |
| Registrar observação diária opcional | Conforme configuração | Se autorizado | Se autorizado para a pessoa |
| Exportar PDF completo | Conforme configuração | Se autorizado | Não por padrão |

## 6. Dados informados versus automáticos

- Medicamento: **informado** nome, primeiro horário, doses por dia, duração contínua ou em dias e horários conferidos; **opcional** receita, observação, frequência especial/intervalo quando aplicável; **automático** sugestão matemática de horários quando segura, autor, vigências e identificadores.
- Dose: **informada** situação e eventual horário efetivo; **automático** ocorrência, autor, momento e trilha de correções.
- Consulta: **informado** data/hora e descrição; restantes opcionais.
- Exame: **informado** descrição; data/documento opcionais.
- Apoio: conclusão rápida; observação opcional.

## 7. Exceções

Concorrência de dois registros da mesma dose; reconfirmação; relato tardio; alteração de horários; suspensão/encerramento; arquivo revogado; desconexão; ausência de confirmação; data desconhecida de exame. Não exibir sucesso antes de persistir a operação.

## 8. Critérios de aceitação

- [ ] Cadastrar medicamento com nome, primeiro horário, doses por dia e duração sem transcrever receita.
- [ ] Exibir sugestão de horários editável, sempre exigindo conferência antes de ativar lembretes; jamais inferir horários clínicos apenas do número de doses.
- [ ] Permitir uso contínuo, período em dias e horários prescritos manualmente; mostrar opções especiais só quando necessárias.
- [ ] Representar corretamente intervalos que atravessam a meia-noite, quando informados explicitamente.
- [ ] Associar um PDF/foto a vários medicamentos quando necessário.
- [ ] Exibir rotina e estados corretos, incluindo frequência especial suportada.
- [ ] Cartão abre confirmação sem registrar automaticamente.
- [ ] Guardar situação e autoria sem preenchimento duplicado.
- [ ] Preservar histórico de horário, encerramentos e correções.
- [ ] Negar à colaboradora alterações clínicas não autorizadas e acesso a Laurinha.
- [ ] Consultas, exames e atividades de apoio com poucos campos.
- [ ] Anexos privados acessíveis apenas com autorização.
- [ ] Histórico e relatório derivados dos registros.
- [ ] UX móvel validada com Vovó e colaboradora, sem navegação complexa ou cobranças de uso.
- [ ] Vovó pode compreender destinatários e acessos aos seus cuidados, preservando sua autonomia.
- [ ] Avisos são discretos por padrão; detalhamento sensível exige escolha expressa e autorização.
- [ ] Falha de conexão não gera confirmação falsa de dose.
- [ ] Cada ocorrência prevista ativa gera lembrete no horário conferido, apenas aos destinatários escolhidos e autorizados.
- [ ] Falta de confirmação mantém *sem confirmação*, sem mensagens repetidas de cobrança ou inferência de não tomada.
- [ ] Suspensões, encerramentos, alterações de horário e cancelamentos de consultas atualizam os avisos futuros.
- [ ] Compromissos com data/hora permitem lembrete antecipado simples; exames sem data não criam avisos fictícios.
- [ ] Avisos e prévias preservam privacidade, inclusive em tela bloqueada.
- [ ] Lembretes testados nos dispositivos reais, com limitações documentadas; notificações não são o único mecanismo de segurança.

## 9. Fora do MVP

Prontuário clínico, diagnóstico, recomendação de doses, OCR de receitas, farmácias/laboratórios, controle de estoque, gestão trabalhista e relatórios obrigatórios de turno.

**Regra:** organizar e lembrar sem cobrança; não cadastrar informação sem justificativa para o cuidado.

## 10. E3 — Download privado de exames

**APROVADO pelo Produto em 2026-11-22:** simplificar a proposta anterior para apenas baixar o arquivo. O usuário abre o documento no navegador/aplicativo do próprio dispositivo. O restante do desenho E3 foi aprovado; E3-UX-00 encerrado. Substitui a proposta de visualizador interno da v1.6. Complementa CUI-F06/F10/F11, preservando permissões e cadastro mínimo.

Em Consultas e exames, mostrar **Baixar arquivo** no detalhe de exame com anexo, somente quando autorizado. Manter pessoa, descrição e data conhecida visíveis. Não criar visualizador, zoom, paginação ou dependência de biblioteca de leitura. A plataforma disponibiliza o arquivo; a abertura externa segue o comportamento do dispositivo e não pode ser prometida como automática.

Descrição permanece obrigatória; data e arquivo opcionais, consulta relacionada quando existir. Não exigir transcrição, especialidade ou resultados. Prever sem anexo, preparando download, arquivo indisponível, falha de rede e permissão revogada, sem sucesso fictício. Não transferir bytes sem autorização do servidor nem criar URL pública permanente.

| ID | Aceite |
|---|---|
| E3-EX-01 | Baixar o anexo pelo detalhe do exame com nome e formato adequados, sem novo cadastro e sem visualizador interno. |
| E3-EX-02 | Download é acionável no celular/desktop e preserva o contexto do exame; interface informa que o documento pode ser aberto no aplicativo do dispositivo, sem prometer sua abertura automática. |
| E3-EX-03 | Download exige autorização contextual, inclusive API/URL direta, sessão revogada e família diferente; administrador e integrante não ganham acesso clínico por presunção. |
| E3-EX-04 | Sem anexo, arquivo indisponível, falha de rede e acesso negado recebem tratamento útil, sem informar sucesso antes de disponibilizar o arquivo. |
| E3-EX-05 | Cadastro mantém descrição mínima, data/arquivo opcionais; não interpreta resultados nem exige transcrição. |

Resumo e sua prévia/PDF continuam de propriedade do Módulo 04 v1.2. A exclusão do visualizador de exames não remove a conferência da prévia do relatório. Fora: visualizador embutido, IA, OCR, diagnóstico, nova classificação médica e migração de armazenamento como pré-condição. Plano em `docs/esteira/planejamento/e3-exames-resumo.md`.
