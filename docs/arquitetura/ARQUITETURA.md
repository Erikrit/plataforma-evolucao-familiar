# Arquitetura preliminar — Plataforma de Evolução Familiar

**Situação:** arquitetura proposta com bootstrap e fluxo parcial do módulo 01 já presentes na branch `feature/modulo1`; demais contratos e módulos não estão implementados. Ver `docs/produto/STATUS-E-ESCOPO.md`.

## Estrutura lógica

Web mobile-first (Next.js/React, PWA sob validação) → API NestJS modular → PostgreSQL e armazenamento privado compatível com S3.

Módulos lógicos:

1. **Família e acesso:** identidade, pessoas, participações, convites e autorização contextual.
2. **Cuidados:** medicamentos, programação com vigência, registros de doses, consultas, exames, apoio.
3. **Desenvolvimento:** desafios, planejamento opcional, participação, movimentos de estrelas, recompensas e resgates.
4. **Acompanhamento:** leitura autorizada de histórico, indicadores e PDFs sob demanda.
5. **Compartilhados:** anexos privados, agendamento de lembretes e rastreabilidade.

**Monólito modular** em um único banco PostgreSQL, sem microsserviços, filas distribuídas, Redis ou Kubernetes por padrão.

## Modelo conceitual mínimo

### Família

`familia`, `pessoa`, `usuario`, `participacao_familiar`, `autorizacao`, `convite`.

- Pessoa não exige login.
- Papel contextual vincula usuário/família/pessoa-alvo e operação autorizada.
- Revogação impede novas operações, preservando autoria histórica.
- Vínculo de parentesco não implica autorização.
- Isolamento entre famílias desde a modelagem, sem implementar SaaS comercial.

### Cuidados

`medicamento`, `programacao_medicamento`, `registro_dose`, `consulta`, `exame`, `registro_atividade` e `anexo` compartilhado.

- Programações têm vigência; alterações não sobrescrevem passado.
- A ocorrência prevista é diferente do registro de confirmação.
- Sem confirmação não equivale a dose não tomada.
- Identidade da ocorrência, registro e correção precisam evitar duplicidade e preservar histórico.
- Receitas são documentos; seus campos não são automaticamente extraídos nem considerados clinicamente validados.
- Não gerar indiscriminadamente todas as doses futuras no banco se uma visão derivada da programação for suficiente.

### Desenvolvimento

`desafio`, `desafio_guardado` (opcional), `participacao_desafio`, `movimento_estrelas`, `recompensa`, `resgate_recompensa` (a necessidade de tabela separada de resgate será revisada na modelagem final).

- Revisão funcional v1.1 proposta: guardar atividade opcionalmente, sem planejamento semanal com prazo. Apenas Concluiu/Participou são registrados; não realizada não exige lançamento.
- Participação e estrelas são uma transação lógica.
- Reenvio da mesma participação não duplica pontos; execução nova legítima é permitida.
- Resgates não podem gerar saldo negativo sob concorrência.
- Histórico de movimentos explica saldo e preserva custos antigos.

### Acompanhamento

A experiência funcional v1.1 proposta possui **Histórico individual** e **Resumo da pessoa**, com PDF acionado no resumo; o resumo familiar são apenas poucos destaques na home. O histórico consulta registros de origem com autorização por pessoa e período. Estrutura auxiliar de eventos só se houver necessidade comprovada. PDFs gerados sob demanda, sem armazenar cópias por padrão.

## Contratos de API — rascunho

- `GET /me`
- `GET|POST /familias/{id}/pessoas`
- `GET|PATCH /pessoas/{id}`
- `POST /familias/{id}/convites`
- `GET /familias/{id}/acessos`; `PATCH|DELETE /acessos/{id}`
- `GET /pessoas/{id}/cuidados/hoje`
- `GET|POST /pessoas/{id}/medicamentos`
- `PUT /medicamentos/{id}/programacao`
- `POST /medicamentos/{id}/encerramento`
- `POST /medicamentos/{id}/doses/registros`; `PATCH /registros-doses/{id}`
- `GET|POST /pessoas/{id}/consultas`; `POST /pessoas/{id}/exames`
- `GET /desafios`; `POST /familias/{id}/desafios`
- `GET|POST /pessoas/{id}/desafios`
- `POST /pessoas/{id}/participacoes`
- `GET /pessoas/{id}/estrelas`; `GET|POST /pessoas/{id}/recompensas`; `POST /pessoas/{id}/resgates`
- `GET /pessoas/{id}/historico`; `GET /pessoas/{id}/acompanhamento`; `GET /familias/{id}/resumo`; `GET /pessoas/{id}/relatorio.pdf`

São endpoints **candidatos**, não contratos finalizados ou implementados. Os formatos, validações, autenticação, estados e idempotência serão detalhados na implementação.

## Preocupações transversais

- Autorização no backend mesmo quando botões ocultos no frontend.
- Operações de negócio atômicas e proteção contra duplicação.
- Acesso privado a anexos; nunca URLs públicas permanentes para exames e receitas.
- Backups e testes de restauração cobrindo banco e objetos.
- Tratamento consistente de fuso horário em agendas e doses.
- PWA e notificações de medicamentos precisam de teste em dispositivos reais; não depender delas como único mecanismo de segurança.
- Sem segredos ou dados reais de saúde no repositório.
