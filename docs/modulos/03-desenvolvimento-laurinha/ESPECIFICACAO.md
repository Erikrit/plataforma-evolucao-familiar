# Módulo 03 — Desenvolvimento da Laurinha

**Versão:** 1.2 — revisão funcional de Executadas e Recompensas aprovada em 2026-11-19  
**Estado:** especificação funcional v1.2 aprovada para o MVP (fonte oficial deste módulo); implementação e homologação humana desta revisão ainda pendentes.  
**Dependência:** Módulo 01 — Fundação Familiar.  
**Fonte de histórico aprofundado e relatórios:** Módulo 04.

## 1. Propósito

Facilitar brincadeiras e experiências presenciais entre a Laurinha, Mikaela e adultos autorizados, reconhecendo participação de forma lúdica e preservando lembranças relevantes. O sistema incentiva a convivência e não mede inteligência, comportamento ou desempenho clínico.

**Restrições inegociáveis:** evolução familiar; esforço mínimo; organização sem cobrança. Se um campo não contribui para lembrar, cuidar, organizar ou compreender evolução, não deve ser exigido. Se registrar a brincadeira der mais trabalho do que realizá-la, simplificar ou remover o fluxo.

## 2. Escopo enxuto

1. **Descobrir ou criar brincadeiras** — biblioteca inicial pequena e útil de atividades com instruções simples, adequadas à faixa etária, em memória/atenção, raciocínio, linguagem, criatividade, coordenação e autonomia.
2. **Explorar e Executadas** — apresentar atividades disponíveis e atividades com participação registrada que ainda não foram reativadas; permitir disponibilizar novamente sem perda de histórico. Preferências/guardados legados precisam de tratamento de compatibilidade, sem descarte silencioso.
3. **Registrar participação e conceder estrelas automaticamente** — ação curta, realizada por adulto autorizado após a experiência.
4. **Consultar estrelas e recompensas (opcionais)** — saldo e recompensas separadas em Disponíveis/Resgatadas; permitir disponibilizar novamente e efetuar novo resgate pago quando houver saldo e autorização. Histórico cronológico completo e resumos ficam no Módulo 04.

Não exigir uso diário, planejamento, cronômetro, foto de prova ou avaliações estruturadas.

## 3. Pessoas e autorizações

- **Mikaela:** referência principal para escolher e organizar brincadeiras e recompensas; não aprova pontos um a um.
- **Outros adultos autorizados:** podem consultar atividades e registrar participações, conforme autorização por pessoa e operação.
- **Laurinha:** participa da experiência; **não precisa de conta** e não precisa registrar dados.
- **Administrador:** gerencia autorizações; parentesco ou administração não concede automaticamente acesso irrestrito a dados privados da criança.
- **Colaboradora da Vovó:** não recebe acesso a este módulo por sua função de cuidados.

## 4. Funcionalidades e comportamentos

### DEV-F01 — Biblioteca de atividades

Cada atividade da biblioteca oferece nome, instrução curta, categoria, dificuldade e materiais quando necessários. Duração aproximada é opcional. Filtros simples por categoria e apresentação adequada a celular. As orientações priorizam a atividade presencial e não exigem manter a tela aberta.

A biblioteca será curada, pequena e apropriada para a idade; não inclui testes diagnósticos nem promessas clínicas.

### DEV-F02 — Brincadeira personalizada

**Entrada mínima:** nome. **Dificuldade:** pré-selecionada como simples; o adulto pode alterá-la para média ou desafiadora. Categoria, instruções, materiais e duração são opcionais e podem ser preenchidos depois.

A dificuldade determina as estrelas segundo regra simples. Nenhuma categoria obrigatória para permitir salvar. A alteração posterior de categoria/dificuldade não reescreve participações ou pontos anteriores.

### DEV-F03 — Explorar, Executadas e disponibilizar novamente

**Decisão L3 aprovada pelo responsável do Produto em 2026-11-19 (CT-20261119-001).** As abas **Explorar** e **Executadas** são mutuamente exclusivas quanto à **disponibilidade atual da atividade para nova participação**, no contexto da pessoa acompanhada:

- **Explorar:** lista atividades ativas e atualmente disponíveis, organizadas por categorias de desenvolvimento compreensíveis. O catálogo preserva uma opção “Todas”; atividades sem categoria permanecem encontráveis.
- **Executadas:** lista uma vez cada atividade cuja última execução legítima foi confirmada e que ainda não foi disponibilizada novamente. Mostrar, quando útil, a última realização; outras ocorrências continuam no Histórico do Módulo 04.
- Após persistir **Concluiu** ou **Participou**, a atividade sai de Explorar e aparece em Executadas. Erro de gravação ou confirmação incerta não autoriza mudança visual definitiva.
- Somente um adulto **com operação de organização/reativação efetivamente autorizada** pode escolher **Disponibilizar novamente**, fazendo a atividade voltar a Explorar. Reativar **não** apaga participações, autoria, datas, estrelas ou registros anteriores e não cria pontos. Uma nova execução legítima posterior cria **outro registro** e volta a colocá-la em Executadas.
- Não há prazo, obrigação, atraso nem punição por não realizar atividades. A reativação não deve exigir explicação, avaliação ou dados adicionais.
- O recurso anterior **Guardadas** representava favoritos, não executadas. Os dados existentes de `DesafioGuardado` **não devem ser renomeados, sobrescritos ou apagados por semelhança de nome**. Arquitetura deve definir estratégia mínima e verificável de compatibilidade/retensão, sem expor “Guardadas” como segunda aba principal na UX aprovada; qualquer descarte de dados requer decisão específica de Produto. Não derivar “Executadas” apenas do indicador legado `guardado`.

**Distinção essencial:** a posição da brincadeira nas abas é um **estado atual de disponibilidade**; o histórico de participações é **imutável para essa organização**, salvo os mecanismos rastreáveis de correção já aprovados. A solução técnica precisa lidar com correções, concorrência e sessões simultâneas sem reaparecimento indevido em Explorar.

### DEV-F04 — Participação simples

Depois de realizar a atividade, o adulto autorizado escolhe:
- **Concluiu:** completou a proposta da brincadeira.
- **Participou:** explorou, tentou ou precisou de apoio, sem necessariamente concluí-la.

**Não realizada** deixa de ser opção de registro cotidiano. Se a brincadeira não aconteceu, não há nada para preencher nem punição.

Observação qualitativa opcional, nunca exigida. O sistema acrescenta pessoa, desafio, autor e momento automaticamente. A mesma brincadeira pode ser realizada legitimamente várias vezes, como execuções distintas. Uma tentativa de envio repetida da **mesma execução** não pode gerar registros e pontos duplicados. Correções preservam rastreabilidade e ajustam pontos de modo consistente. **A transição para Executadas deve ser consistente com a confirmação persistida da execução**, sem poder ocorrer de forma definitiva apenas no cliente; execução novamente após disponibilização autorizada é outra ocorrência legítima.

### DEV-F05 — Estrelas automáticas

Sem aprovação manual, sem envio de quantidade pelo frontend, sem ranking, sequência diária, bônus por assiduidade ou perda de estrelas por emoções/comportamento.

**Tabela de estrelas aprovada para o MVP:**

| Dificuldade | Concluiu | Participou |
|---|---:|---:|
| Simples | 5 | 3 |
| Média | 10 | 5 |
| Desafiadora | 15 | 8 |

A dificuldade vem predefinida nas atividades do catálogo e em simples nas personalizadas. **Valores aprovados em 2026-11-15.** Mudanças futuras exigem decisão explícita de produto e não alteram créditos históricos. A regra deve ser transparente; o valor concedido em cada execução é preservado mesmo se valores futuros mudarem. O registro de participação e o movimento de estrelas formam uma operação consistente.

### DEV-F06 — Estrelas e recompensas

Exibir estrelas conquistadas no total, saldo disponível e movimentos/resgates relevantes de forma compreensível. A família pode combinar recompensas fora do aplicativo; o catálogo e o resgate digital são opcionais. Se cadastrada, uma recompensa precisa apenas de nome e custo; o resgate preserva custo histórico e não deve duplicar nem permitir saldo negativo.

**Decisão L3 aprovada pelo responsável do Produto em 2026-11-19 (CT-20261119-002):** o submenu **Recompensas** apresenta abas **Disponíveis** e **Resgatadas**, mutuamente exclusivas como **estado atual do item para um próximo resgate**. Uma recompensa ativa ainda não utilizada ou legitimamente disponibilizada novamente aparece em Disponíveis; ao confirmar um resgate, passa para Resgatadas. A aba Resgatadas permite consultar a última utilização e acessar as demais ocorrências históricas autorizadas, sem confundir a lista de itens com a linha do tempo de transações.

- **Disponibilizar novamente** é ação de organização, distinta de resgatar; somente aparece para quem tem operação de gestão autorizada. Transfere o item de Resgatadas a Disponíveis **sem crédito, estorno, devolução ou alteração do resgate anterior**.
- Uma recompensa disponibilizada novamente pode ser **resgatada outra vez** como **nova ocorrência**, com **novo débito** pelo custo atual apresentado na confirmação; manter o custo efetivamente aplicado em cada resgate histórico, sem recalcular valores anteriores. A nova confirmação de resgate devolve a recompensa à aba Resgatadas.
- Validar no servidor **autorização contextual, saldo suficiente, disponibilidade atual e idempotência da solicitação**. Duplo toque, retry de rede e concorrência não podem produzir resgate/débito duplicado, saldo negativo ou dois resgates para a mesma disponibilização. Falha ou estado incerto não é sucesso confirmado.
- O histórico de resgates permanece preservado (data, autor, recompensa, custo aplicado). Reutilizar o histórico e relatórios existentes do Módulo 04 quando viável, sem criar segunda fonte de verdade. Catálogos anteriores ativos e registros históricos devem ser reconciliados/migrados **sem perder informações**.
- Cadastros e manutenção de recompensas pertencem à área secundária de **Cadastros**; não competem com as opções de resgate. O catálogo continua opcional e nenhuma recompensa é condição para ganhar estrelas ou participar.

Não condicionar afeto, comida, necessidades básicas, descanso ou cuidados a pontos. Se a família combinar uma recompensa, evitar alterar uma meta já prometida sem novo acordo compreensível com a criança.

### DEV-F07 — Acesso ao histórico

O módulo pode abrir a linha do tempo e o resumo da Laurinha **fornecidos pelo Módulo 04**; não desenvolver painel ou segunda base de histórico independente. Qualquer observação registrada acompanha sua participação original.

## 5. Fluxos de uso

**A. Explorar:** abrir Laurinha → descobrir atividades → abrir instruções → realizar presencialmente; sem cadastro/planejamento obrigatório.

**B. Cadastrar:** abrir Cadastros quando autorizado → escolher Nova brincadeira ou Nova recompensa; na brincadeira, nome suficiente, dificuldade simples por padrão e categoria opcional escolhida entre as existentes.

**C. Executar:** escolher atividade em Explorar → Concluiu ou Participou → persistir participação e estrelas → exibir em Executadas, sem marcação manual.

**D. Reativar brincadeira:** adulto autorizado abre Executadas → Disponibilizar novamente → atividade retorna a Explorar para nova experiência; histórico intacto.

**E. Recompensas:** abrir submenu Recompensas → Disponíveis → escolher item → conferir custo/saldo → confirmar novo resgate → após persistência, item em Resgatadas. Adulto autorizado pode Disponibilizar novamente para permitir outro resgate, com novo custo/debito e nova ocorrência.

**F. Evolução:** abrir histórico individual (Módulo 04) → consultar atividades e resgates sem nova alimentação.

## 6. Estados e exceções

- Sem atividades registradas: mensagem neutra; não há cobrança.
- Atividade em Explorar não realizada: permanece disponível, sem pendência; dados legados de Guardadas permanecem preservados para compatibilidade.
- Repetição legítima: após disponibilização autorizada, pode registrar novamente com nova identidade de execução, sem perder histórico anterior.
- Duplo toque ou reenvio após falha: não duplica estrelas.
- Erro de gravação: não apresentar pontos como definitivamente ganhos antes de confirmação.
- Correção de resultado: recalcular o efeito do movimento com histórico preservado.
- Resgates concorrentes: exigir disponibilidade, impedir gastos duplicados, saldo negativo e resgate duplo na mesma disponibilização; retries da mesma solicitação são idempotentes.
- Sem autorização: bloquear consulta, registro, histórico e dados agregados.
- Alteração de dificuldade: não mudar resultados já registrados.
- Pausas de dias ou semanas: nenhum alerta de atraso ou diminuição de desempenho.

## 7. Dados mínimos

| Ação | Informado pelo adulto | Automático |
|---|---|---|
| Criar atividade | Nome; dificuldade com padrão simples | Identidade, origem e pontuação |
| Disponibilizar novamente brincadeira | Escolha da atividade executada pelo adulto autorizado | Estado atual de disponibilidade; histórico preservado |
| Registrar participação | Concluiu/Participou; nota opcional | Autor, momento, identificação da execução, pontos e histórico |
| Criar recompensa | Nome e custo | Identificadores e status |
| Resgatar | Escolha da recompensa disponível; confirmar custo e débito | Custo aplicado, movimento, autoria, horário, estado Resgatadas |
| Disponibilizar recompensa novamente | Escolha do item resgatado pelo adulto autorizado | Estado Disponíveis; resgates e débitos anteriores inalterados |

Evitar classificação, observação, evidência fotográfica, justificativa ou data como campos obrigatórios quando derivados ou desnecessários.

## 8. Integração e fronteiras

- Módulo 01 identifica pessoas, sessões e autorizações.
- Módulo 03 é fonte oficial de desafios, participações, estrelas e resgates.
- Módulo 04 lê os registros autorizados e apresenta histórico, resumo e PDF, sem duplicar entrada de dados.
- Sem dependência funcional do módulo de cuidados da Vovó.

## 9. Critérios de aceitação

- [ ] Adulto encontra e realiza uma atividade da biblioteca sem criar planejamento.
- [ ] Atividade personalizada pode ser salva apenas com nome (dificuldade simples predefinida).
- [ ] Categoria e observação não são obrigatórias.
- [ ] Explorar/Executadas são estados distintos: após participação efetivamente persistida a brincadeira sai de Explorar, sem ação manual; sem gravação confirmada não há sucesso definitivo.
- [ ] Adulto com autorização de organização consegue disponibilizar brincadeira novamente, sem apagar histórico, autoria ou estrelas e sem criar ponto extra.
- [ ] Compatibilidade dos dados anteriores de Guardadas é tratada sem descarte/renomeação indevida; nenhuma migração destrutiva é presumida.
- [ ] Recompensas são apresentadas em Disponíveis/Resgatadas; após resgate persistido o item muda de aba, sem perder a ocorrência histórica.
- [ ] Disponibilizar recompensa novamente não altera saldo nem resgate anterior; novo resgate permitido consome novo débito e preserva custo histórico.
- [ ] Reenvios/concorrência de resgate não debitam duas vezes nem realizam múltiplos resgates para a mesma disponibilização.
- [ ] Somente Concluiu e Participou aparecem no registro cotidiano.
- [ ] Uma participação gera estrelas automaticamente sem aprovação.
- [ ] Tentativa/participação recebe reconhecimento conforme tabela vigente.
- [ ] Brincadeiras não realizadas não exigem qualquer registro.
- [ ] Reenvio da mesma execução não duplica dados ou estrelas, mas nova execução legítima é permitida.
- [ ] Correções e resgates mantêm consistência de saldo e rastreabilidade.
- [ ] Histórico individual é disponibilizado pelo Módulo 04, sem segundo cadastro.
- [ ] A colaboradora e usuários sem autorização não acessam dados da Laurinha.
- [ ] Experiência funciona em celular e sem uso diário.
- [ ] Nenhuma informação é apresentada como avaliação clínica da criança.

## 10. Implementação e fronteira arquitetural da revisão v1.2

**Comportamentos L3 aprovados:** `CT-20261119-001` e `CT-20261119-002`. A especificação **não escolhe** tabela, enum adicional, migration, API nem estratégia de concorrência. Arquitetura deve reconciliar a implementação efetiva (incluindo código ainda não integrado à `develop`) e apresentar a **menor adaptação segura** para disponibilização por pessoa/atividade e por recompensa; revogação/autorização por operação, idempotência de resgates, estado após correção de participação, compatibilidade com `DesafioGuardado` e apresentação de dados históricos. Se a autorização vigente não possui capacidade para reativação/gestão, **não conceder acesso implícito**; registrar lacuna de contrato e encaminhar a Produto antes de ampliar o privilégio. A UX pode propor organização visual, mas não redefinir permissão ou persistência.

**Homologação da rodada de 2026-11-19:** REPROVADA. A aprovação das decisões funcionais não aprova a experiência implementada; reexecutar verificações e homologação humana após entrega.

## 11. Fora do MVP

Planejamento com calendário obrigatório; declaração de atividade não realizada; metas compulsórias; ranking; notas escolares/clínicas; XP separado; níveis complexos; jogos digitais; geração por IA; medição de inteligência; foto/vídeo como prova; relatórios manuais; painel próprio duplicado de evolução.

**Princípio de aceite:** a família vive a experiência; a plataforma reconhece e lembra, sem fiscalizar.
