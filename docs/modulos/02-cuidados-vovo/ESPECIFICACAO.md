# Módulo 02 — Cuidados da Vovó

**Versão:** especificação funcional v1.0  
**Status:** preparada para validação e desenvolvimento, sem implementação.  
**Dependência:** Fundação Familiar.

## 1. Objetivo

Organizar medicamentos, consultas, exames e atividades relevantes de companhia e apoio; permitir registro rápido de informações relatadas pela Vovó; preservar histórico. Não é prontuário eletrônico nem substitui orientação clínica.

## 2. Participantes

- **Vovó:** pessoa independente e fonte prioritária de confirmação de uso; acesso próprio opcional.
- **Responsável por cuidados:** cadastra e altera programação, organiza compromissos.
- **Colaboradora adulta externa:** visualiza rotina autorizada e registra relatos/atividades de apoio; não altera prescrição por padrão.
- **Administrador:** gerencia permissões sem acesso clínico irrestrito automático.

## 3. Funcionalidades e regras

### CUI-F01 — Cadastrar medicamento

Nome, horários e campos adicionais apenas se essenciais à prescrição (frequência, instruções especiais). Receita como imagem/PDF opcional, sem transcrição integral. Uma receita pode servir a vários medicamentos. Mostrar conferência antes de ativar lembretes. Não extrair dose automaticamente da imagem.

### CUI-F02 — Rotina do dia

Seções: medicamentos, atividades de apoio e consultas, com próximo cuidado relevante destacado. Cartão clicável mostra nome, horário e situação; tocar abre opções, **não confirma**. Situações: **tomou conforme informação**, **informou que não tomou**, **sem confirmação**. Ausência de registro não equivale a não tomada.

### CUI-F03 — Registrar dose

Após relato da Vovó, pessoa autorizada seleciona a situação; horário efetivo opcional quando conhecido. Backend identifica ocorrência, autor e momento. Não exigir justificativa. Evitar duplicidade e preservar correções; não sugerir compensações de dose.

### CUI-F04 — Alterar, suspender, encerrar

Programação com vigência; novo horário não altera o passado. Encerramento/suspensão interrompe novos lembretes correspondentes; histórico e anexos anteriores preservados. Colaboradora não altera prescrição sem autorização explícita.

### CUI-F05 — Consultas

Data/hora e especialidade/descrição; profissional, local, observação e documentos opcionais. Permitir editar, cancelar e marcar realizada preservando histórico relevante. Lembretes discretos a destinatários autorizados.

### CUI-F06 — Exames

Descrição; data se conhecida; arquivo opcional. Possível vínculo a consulta. Não interpretar resultados ou diagnosticar.

### CUI-F07 — Apoio e companhia

Registrar atividades familiares realmente relevantes; conclusão rápida, observação opcional. Não exigir diário de turno, controle trabalhista ou ranking.

### CUI-F08 — Lembretes

Derivados de programações e compromissos, a destinatários autorizados; sem cobrança insistente. Sem confirmação comunica somente que não há registro. PWA/notificação exige validação em aparelhos reais; não é canal único de segurança de medicamentos.

### CUI-F09 — Histórico

Linha do tempo individual com doses, mudanças de programação, consultas, exames, atividades significativas, documentos e correções, quando autorizados. Sem alimentação duplicada.

### CUI-F10 — Resumo e PDF

Período selecionável; distinguir previstas, informadas como tomadas, informadas como não tomadas e não confirmadas. Consultas, exames e observações pertinentes. Prévia antes de PDF. Sem inferência clínica.

## 4. Fluxos essenciais

1. **Cadastro:** responsável → novo medicamento → nome/horários → receita opcional → conferir → ativar.
2. **Registro:** tocar cartão → selecionar relato da Vovó → confirmar → atualizar histórico automaticamente.
3. **Correção:** abrir registro → corrigir → salvar → preservar valor anterior e autoria.
4. **Alteração médica:** atualizar programação com vigência → anexar nova receita opcional → preservar passado.
5. **Colaboradora:** acessar apenas Vovó → seções de medicamentos, atividades, consultas → registrar ocorrência relevante.
6. **Consulta/exame:** cadastro simples → lembrete opcional → realização/cancelamento → arquivo opcional.

## 5. Permissões

| Operação | Vovó | Responsável | Colaboradora |
|---|---|---|---|
| Visualizar rotina | Própria | Se autorizado | Somente atribuído |
| Confirmar próprio relato/registrar relato | Sim | Sim | Sim, se autorizado |
| Cadastrar/alterar programação | Não por padrão | Sim | Não |
| Consultar documentos | Próprios | Se autorizado | Apenas estritamente necessário |
| Organizar consultas/exames | Conforme configuração | Sim | Não por padrão |
| Registrar atividade de apoio | Conforme configuração | Sim | Se atribuída |
| Exportar PDF completo | Conforme configuração | Se autorizado | Não por padrão |

## 6. Dados informados versus automáticos

- Medicamento: **informado** nome, horários e instruções indispensáveis; **opcional** receita/observação; **automático** autor, vigências, identificadores.
- Dose: **informada** situação e eventual horário efetivo; **automático** ocorrência, autor, momento e trilha de correções.
- Consulta: **informado** data/hora e descrição; restantes opcionais.
- Exame: **informado** descrição; data/documento opcionais.
- Apoio: conclusão rápida; observação opcional.

## 7. Exceções

Concorrência de dois registros da mesma dose; reconfirmação; relato tardio; alteração de horários; suspensão/encerramento; arquivo revogado; desconexão; ausência de confirmação; data desconhecida de exame. Não exibir sucesso antes de persistir a operação.

## 8. Critérios de aceitação

- [ ] Cadastrar medicamento sem transcrever receita.
- [ ] Associar um PDF/foto a vários medicamentos quando necessário.
- [ ] Exibir rotina e estados corretos, incluindo frequência especial suportada.
- [ ] Cartão abre confirmação sem registrar automaticamente.
- [ ] Guardar situação e autoria sem preenchimento duplicado.
- [ ] Preservar histórico de horário, encerramentos e correções.
- [ ] Negar à colaboradora alterações clínicas não autorizadas e acesso a Laurinha.
- [ ] Consultas, exames e atividades de apoio com poucos campos.
- [ ] Anexos privados acessíveis apenas com autorização.
- [ ] Histórico e relatório derivados dos registros.
- [ ] UX móvel validada com Vovó e colaboradora.
- [ ] Lembretes testados nos dispositivos reais, com limitações documentadas.

## 9. Fora do MVP

Prontuário clínico, diagnóstico, recomendação de doses, OCR de receitas, farmácias/laboratórios, controle de estoque, gestão trabalhista e relatórios obrigatórios de turno.

**Regra:** organizar e lembrar sem cobrança; não cadastrar informação sem justificativa para o cuidado.
