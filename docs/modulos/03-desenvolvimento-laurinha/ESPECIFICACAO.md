# Módulo 03 — Desenvolvimento da Laurinha

**Versão:** 1.9 — catálogo ampliado: decisões D1 a D3 e revisões de 2026-11-26 incorporadas; Marco 1 redefinido com 12 jogos novos, 60 atividades e um jogo 2D\
**Estado:** regras de atividades reais nas seções 1–12 e recorte E5 na seção 13. A seção 14 registra as decisões UX-03 a UX-05 e a aprovação do recorte de Atividades Reais. A seção 15 registra a direção aprovada para o catálogo ampliado; as regras das seções 12 e 13 continuam vigentes até a implementação de cada incremento. Implementação e homologação são registradas em [STATUS-E-ESCOPO.md](../../produto/STATUS-E-ESCOPO.md) e na esteira.\
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

Cada atividade da biblioteca oferece nome, instrução curta, categoria, dificuldade e materiais quando necessários. Duração aproximada é opcional. Usar um **Select** para categoria, no padrão de Jogos Digitais. Preservar **Todas**, os filtros existentes e os parâmetros da URL. Alternar **Explorar** e **Executadas** mantém a categoria selecionada. As orientações priorizam a atividade presencial e não exigem manter a tela aberta.

Nas duas modalidades, usar o cabeçalho **Biblioteca · Nome da pessoa**, com ícone de estrela e quantidade de saldo disponível. Compartilhar a consulta de saldo, inclusive ao alternar modalidades. Mostrar zero quando confirmado, atualizar após participação confirmada e respeitar a autorização contextual. Fornecer rótulo acessível, como “12 estrelas disponíveis”.

A biblioteca será curada, pequena e apropriada para a idade; não inclui testes diagnósticos nem promessas clínicas.

### DEV-F02 — Brincadeira personalizada

**Entrada mínima:** nome. **Dificuldade:** pré-selecionada como simples; o adulto pode alterá-la para média ou desafiadora. Categoria, instruções, materiais e duração são opcionais e podem ser preenchidos depois.

A dificuldade determina as estrelas segundo regra simples. Nenhuma categoria obrigatória para permitir salvar. A alteração posterior de categoria/dificuldade não reescreve participações ou pontos anteriores.

### DEV-F03 — Explorar, Executadas e disponibilizar novamente

**Decisão L3 aprovada pelo responsável do Produto em 2026-11-19 (CT-20261119-001).** As abas **Explorar** e **Executadas** são mutuamente exclusivas quanto à **disponibilidade atual da atividade para nova participação**, no contexto da pessoa acompanhada:

- **Explorar:** a entrada apresenta somente as atividades escolhidas e disponíveis da pessoa em **Atividades ativas**. Descobrir outras brincadeiras requer acionar **Sugerir brincadeiras**, conforme a seção 12. O catálogo preserva uma opção “Todas”; atividades sem categoria permanecem encontráveis.
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

## 12. E4 — Biblioteca de atividades reais

**APROVADO pelo responsável do Produto em 2026-11-22**, por concordância com a proposta: catálogo curado, seleção pequena e renovação de sugestões antes de automatizar sua alimentação. A evolução de Atividades Reais de 2026-11-24 (DEV-JOG-P01 a P03) mantém até 24 modelos publicados ativos no catálogo global. Os limites por pessoa e por renovação passam a seguir as regras abaixo depois da implementação.

### Conteúdo e privacidade

Modelos de catálogo são compartilhados e não contêm dados pessoais. Cada modelo publicado tem nome, instrução curta, categoria, dificuldade, faixa etária orientativa, materiais quando necessários e origem. Duração/adaptações e supervisão aparecem quando úteis. Atividades personalizadas e escolhas/participações pertencem ao contexto privado da família/pessoa.

Usar categorias existentes, incluindo Todas e tratamento vigente de atividades personalizadas sem categoria. Publicar conteúdo curado e apropriado para crianças, adultos e idosos, com tratamento respeitoso e sem promessas clínicas. Idade orienta a escolha e não representa capacidade. Não exigir nascimento, interesses ou questionário para oferecer opções; se faltar idade, permitir explorar por faixa orientativa ou opções gerais sem inventar idade.

O limite de 24 aplica-se aos modelos publicados ativos do catálogo global, não ao histórico, modelos arquivados nem atividades personalizadas da família. Alterar/arquivar modelo não reescreve instruções relevantes, dificuldade ou estrelas de execuções anteriores: preservar a versão executada.

### Sugestões e escolha (DEV-JOG-P02)

- Ao abrir Atividades Reais pela primeira vez sem escolhas, mostrar **Atividades ativas** vazia e o botão **Sugerir brincadeiras**. Não exibir modelos do catálogo nem sugestões automaticamente. Em visitas seguintes, carregar as escolhas ativas da pessoa. Ao tocar no botão, apresentar **até duas sugestões elegíveis por pessoa**. Sugerir modelos publicados ativos, disponíveis para nova participação com prioridade para os que a pessoa ainda não viu. Excluir atividades atualmente escolhidas e todas as que tenham participação registrada, inclusive após reativação. Um modelo retirado das ativas antes de qualquer participação pode voltar em pedido futuro, depois dos inéditos. Priorizar a faixa orientativa quando conhecida e diversificar categorias quando houver opções. Sem idade, oferecer opções gerais. Uma categoria sem vaga de escolha fica fora das sugestões enquanto estiver cheia.
- O responsável com organização de Desenvolvimento autorizada pode escolher para experimentar e renovar sugestões. A escolha é privada por pessoa, compartilhada entre responsáveis autorizados e independente do navegador. Ao confirmar **Quero experimentar**, mover a atividade das sugestões para **Atividades ativas** da pessoa. Manter as sugestões restantes. Repor ou trocar somente ao acionar **Renovar sugestões**, após a oferta inicial.
- Renovar oferece até duas opções inéditas, preenchendo vagas e substituindo as opções anteriores quando houver alternativas. Com renovação parcial, manter as opções ainda elegíveis que não puderem ser substituídas. Evitar alternância repetitiva entre os mesmos cartões durante a rotação. Ao esgotar as alternativas, informar “Não há novas sugestões disponíveis por agora” e manter acesso à Biblioteca. Em falha de gravação, preservar o último estado confirmado e permitir nova tentativa.
- Escolher ou renovar não registra participação, não gera estrelas e não altera a disponibilidade conforme DEV-F03. Uma participação legítima, escolhida antes ou registrada diretamente, retira a atividade das escolhas disponíveis e das sugestões. Após registrar Concluiu ou Participou, a atividade passa a Executadas. **Disponibilizar novamente** a retorna a Explorar com o histórico intacto e sem crédito. Após a reativação, se o responsável quiser mantê-la na lista de escolhidas, faz uma escolha explícita sujeita ao limite.

- Na ficha de uma atividade ativa, oferecer **Retirar das ativas** ao responsável autorizado. A retirada confirmada libera a vaga da categoria e preserva histórico e saldo. Não registrar participação nem mover a atividade para Executadas. Reenviar a mesma retirada não produz efeito adicional. Participou e Concluiu continuam reservados à experiência presencial realizada.

### Limite de escolhas (DEV-JOG-P03)

- **Até dez atividades escolhidas e disponíveis por categoria por pessoa acompanhada.** Cada atividade conta uma vez. Atividades personalizadas categorizadas contam quando explicitamente escolhidas para a pessoa. Personalizadas sem categoria continuam cadastráveis e utilizáveis e ficam fora da contagem.
- Modelos globais apenas disponíveis para descoberta, sugestões e atividades em Executadas ficam fora da contagem. Registrar uma participação de atividade escolhida libera uma vaga. Consultar, registrar participação e disponibilizar novamente uma atividade existente continuam possíveis com a categoria cheia.
- Ao atingir dez, uma nova escolha naquela categoria recebe a mensagem “Você já tem 10 atividades ativas nesta categoria. Para adicionar outra, finalize ou retire uma delas.” Oferecer **Ver atividades ativas** com a categoria correspondente selecionada. Aplicar o limite no servidor às operações que efetivamente colocam uma atividade no conjunto contado, incluindo mudança de categoria de uma atividade já escolhida. Tratar concorrência e reenvio com isolamento por pessoa e família. Se houver excedente anterior, preservar escolhas e bloquear novas inclusões na categoria até haver vaga.
- A interface reaproveita Biblioteca, cabeçalho compartilhado, filtro de categoria e Explorar/Executadas. O grupo de escolhidas representa organização para experimentar. Histórico, participações, estrelas e resgates continuam com suas fontes e regras vigentes.

### Alimentação inicial

A entrega funciona com catálogo aprovado e seleção por regras locais. Conteúdo inicial pode ser mantido de forma versionada no repositório/seed, com revisão de qualidade antes de publicação. Internet/IA podem futuramente preparar candidatos para curadoria; pesquisa automática, geração em tempo real e publicação automática não integram E4. A manutenção do catálogo global não é poder do administrador de família.

A primeira rodada de curadoria aprovada está na seção 14. Antes da publicação, conferir por ID sugestões, escolhas, guardados, disponibilidades e participações. Preservar as versões executadas e os vínculos. Manter o limite global e a oferta intergeracional.

### Critérios de aceite

| ID | Critério |
|---|---|
| E4-ACE-01 | Catálogo contém no máximo 24 modelos ativos publicados, com metadados necessários e curadoria registrada; personalizadas/histórico não entram nesse limite. |
| E4-ACE-02 | Pessoa recebe de zero a duas sugestões elegíveis, sem exigir novos dados pessoais. Escolher remove o cartão após confirmação e mantém a outra opção sem reposição automática. |
| E4-ACE-03 | Renovar oferece até duas alternativas e preserva as escolhas. Testar troca parcial, esgotamento sem rotação repetitiva e exclusão de atividades ativas ou já executadas e retorno de retiradas nunca realizadas somente depois das inéditas. |
| E4-ACE-04 | Seleção persiste por pessoa e respeita família/operação; responsáveis da mesma pessoa veem estado consistente, inclusive retry e concorrência. |
| E4-ACE-05 | Escolher/renovar não concede pontos nem reabre Executadas; participação, reativação e resgates mantêm DEV-F03..06. |
| E4-ACE-06 | Atualização/arquivamento não altera conteúdo e créditos de execuções históricas; dados pessoais nunca são publicados no catálogo global. |
| E4-ACE-07 | Biblioteca móvel permite entender instruções/materiais, escolher e renovar sem excesso de opções; vazio/erro não geram cobrança. |
| E4-ACE-08 | Com nove escolhas de uma categoria, duas novas escolhas concorrentes permitem só a décima. Testar personalizadas categorizadas e sem categoria, reativação, execução com limite cheio, alteração de categoria, excedente anterior e escopo entre pessoas. |
| E4-ACE-09 | Testar primeiro acesso vazio, descoberta por botão, retorno com as escolhas anteriores e retirada com categoria cheia. Confirmar vaga liberada, saldo e histórico preservados, ausência em Executadas e prioridade de inéditas ao pedir sugestões novamente. |
| E4-HOM | Homologar escolher → renovar preservando escolha → participar → Executadas → disponibilizar novamente em celular, com duas famílias e regressão de histórico e estrelas. Testar o limite e o cenário sem novas sugestões. |

**Fora do recorte E4:** jogos digitais (entregues separadamente no E5), IA com histórico pessoal, publicação automática, ranking e nova tabela de estrelas. A correção de anexos foi executada no recorte EST-01; estado vigente em STATUS-E-ESCOPO.

## 13. E5 — Jogos digitais na Biblioteca de Desenvolvimento

Jogos breves complementam as atividades presenciais e registram descobertas lúdicas. O piloto é composto por **Memória de figuras** (Memória e atenção), **Complete a sequência** e **Caminhos e labirintos** (Raciocínio lógico), com **cinco fases por jogo**. Labirintos também envolvem coordenação na interação. A V1 para a VPS amplia o catálogo para **oito jogos e 40 fases livres**, acrescentando **Pares de sombras** e **Ache o intruso** (Memória e atenção), **Palavra e figura** e **Histórias em cenas** (Linguagem) e **Entrega no jardim** (Coordenação). O conteúdo aprovado é definido nesta especificação e no catálogo versionado do código; o [plano original de expansão](https://github.com/Erikrit/plataforma-evolucao-familiar/blob/f58d029658499bdfc3807c0488662c0bc4557dae/docs/esteira/planejamento/evo-catalogo-jogos-20261122.md) permanece no Git apenas para consulta histórica.

**Origem das decisões.** As decisões funcionais estão registradas no Git na sequência `e00b23b`–`45e1231`. O recorte de três jogos e cinco fases foi fornecido na especificação consolidada indicada pelo responsável em 2026-11-22 para este planejamento. As fases vigentes e seus controles são definidos no catálogo versionado e nos componentes dos jogos; o [plano E5 histórico](https://github.com/Erikrit/plataforma-evolucao-familiar/blob/f58d029658499bdfc3807c0488662c0bc4557dae/docs/esteira/planejamento/e5-jogos-digitais.md) pode ser consultado no Git, sem funcionar como requisito ativo.

### Regras funcionais

- **E5-F01 — Descoberta.** Integrar **Jogos digitais** à Biblioteca de Desenvolvimento da pessoa. Exibir até três destaques automáticos, com continuidade e variedade por regras locais estáveis, seguidos do catálogo completo com **Todas** e filtros pelas categorias vigentes. Todos os jogos disponíveis à pessoa aparecem no catálogo, inclusive quando a data de nascimento está ausente. Faixa etária é orientativa. Sugestões renováveis e limites da seção 12 pertencem às atividades reais.
  - Na grade do catálogo, mostrar **quatro ícones quadrados por linha, inclusive no celular**, com o nome abaixo de cada ícone. É permitido abreviar nomes longos, mantendo o nome completo para leitores de tela. Cada item apresenta somente o ícone e o nome, com foco visível e acionamento por toque e teclado. O retorno ao catálogo preserva os filtros.
- **E5-F02 — Fases.** Cada jogo oferece cinco fases com objetivo, instrução breve e dificuldade progressiva predefinida. Qualquer fase pode ser aberta no primeiro acesso e repetida livremente. A interface pode indicar uma próxima fase a experimentar. Dificuldade é atributo da fase, sem ajuste adaptativo ou seletor adicional.
- **E5-F03 — Conteúdo.** Usar conteúdo próprio ou licenciado, curado e versionado. Memória varia pares aprovados e posições. Sequência varia padrões verificáveis. Labirinto usa mapas revisados e variações que preservam caminho válido. A versão e a dificuldade são rastreáveis. A partida opera com conteúdo aprovado e lógica hospedada na plataforma, sem serviços externos, IA durante o jogo, anúncios ou rastreadores de terceiros.
- **E5-F04 — Partida.** Acionar o ícone abre diretamente a primeira fase ainda não concluída conforme o progresso persistido. **Escolher fase** fica dentro do jogo e pode ser acionado desde a primeira visita. Se todas as fases já estiverem concluídas, o ícone abre a escolha de fase. Objetivo e controles ficam acessíveis em Como jogar durante a partida. A seleção de fase oferece Todas, Concluídas e Não concluídas a partir do progresso persistido. Dica e saída são sempre acessíveis durante a partida. Alcançar o objetivo conclui a fase, inclusive com dica ou ajuda de adulto. A celebração breve é acessível, respeita movimento reduzido e usa som somente de forma opcional. Concluir uma fase celebra aquela fase após a confirmação do servidor. A celebração de conclusão do jogo depende de todas as fases confirmadas, inclusive quando a última fase numerada é jogada primeiro. Partidas e repetições ficam livres de relógio, limite de vidas e contagem de erros.
- **E5-F05 — Progresso.** **Não explorada** indica fase ainda não iniciada, **Experimentada** indica início registrado e **Concluída** indica objetivo atingido e confirmação persistida. Uma fase concluída mantém esse estado em novas partidas, reenvios e acessos simultâneos. Voltar após interrupção inicia uma nova partida desde o começo da fase e mantém as descobertas confirmadas. A interface confirma o salvamento após resposta confiável do servidor.
- **E5-F06 — Reconhecimento.** A primeira conclusão gera um reconhecimento breve e um único registro de descoberta. A pessoa vê as próprias fases experimentadas e concluídas. Estrelas, saldo e resgates pertencem às atividades reais e seguem DEV-F03 a DEV-F06. A experiência digital restringe o reconhecimento ao progresso pessoal, sem metas, ranking, notificações de retorno ou comparação.
- **E5-F07 — Evolução.** Histórico e Resumo leem jogos experimentados e conclusões diretamente da fonte E5, conforme as regras de período e autorização do Módulo 04. Mostrar fatos como “3 de 5 fases concluídas”. Cada primeira conclusão pode produzir um evento datado no Histórico com jogo, fase e versão. Os registros descrevem experiências lúdicas. A inclusão em prévia/PDF depende de avaliação de UX e testes de privacidade com as regras do Módulo 04.
- **E5-F08 — Autorização e privacidade.** Jogar e consultar progresso exigem acesso autorizado ao Desenvolvimento da pessoa, verificado no servidor em cada operação. Uma criança sem conta joga com a supervisão de quem tem esse acesso. A experiência digital oferece partidas individuais, sem chat, fotos ou envio de provas. A tela apresenta somente a experiência de jogo e saída. A administração familiar por si só concede acesso à gestão. Definições e recursos globais têm dados editoriais. Progresso e descobertas são privados da pessoa e de sua família e ficam na plataforma, sem telemetria de movimentos, erros, tempo de reação ou identidade de quem ajudou.

### Critérios de aceite

| ID | Resultado verificável |
|---|---|
| E5-ACE-01 | Cinco fases por jogo, com acesso direto às fases 4 e 5 desde a primeira visita. Piloto histórico com três jogos e V1 com oito. |
| E5-ACE-02 | As mecânicas publicadas têm objetivos verificáveis e dicas acessíveis. Concluir com ajuda produz o mesmo resultado. |
| E5-ACE-03 | Cada fase tem variações curadas, resolúveis e coerentes com a dificuldade configurada. |
| E5-ACE-04 | Repetir e pedir dicas são ações livres. A primeira descoberta é única e os movimentos de estrelas correspondem apenas a operações presenciais autorizadas. |
| E5-ACE-05 | Inícios e conclusões simultâneos ou reenviados preservam o estado e a data da primeira conclusão. |
| E5-ACE-06 | Ao interromper e abrir de novo, a fase começa do início com o progresso confirmado preservado. |
| E5-ACE-07 | Erro ou resposta incerta de rede oferece recuperação e sinaliza salvamento somente após confirmação confiável. |
| E5-ACE-08 | Até três destaques automáticos e catálogo completo filtrável, inclusive com zero, um ou dois jogos e ausência de nascimento. As entradas em destaque são únicas. |
| E5-ACE-09 | Tela de partida com navegação própria. Acesso direto e API aplicam os mesmos limites por família, pessoa e autorização, inclusive após revogação. |
| E5-ACE-10 | Celular e desktop permitem uso por toque e teclado, saída disponível, foco e contraste perceptíveis, áudio opcional e movimento reduzido. |
| E5-ACE-11 | Histórico e Resumo derivam descobertas da E5. As regras de Explorar, Executadas, recompensas e estrelas continuam verificáveis nos percursos reais. |
| E5-ACE-12 | Jogo, fase e versão são rastreáveis. Atualizar conteúdo mantém conquistas anteriores e os recursos globais contêm apenas dados editoriais. |
| E5-ACE-13 | A grade mantém quatro ícones com nome por linha a partir de 320 px, sem rolagem horizontal. O ícone abre a primeira fase pendente ou a escolha quando o jogo está completo. O retorno mantém os filtros. Concluir a fase 5 primeiro não celebra a conclusão do jogo. |
| E5-HOM | Responsável autorizado e criança avaliam o piloto no celular com dados fictícios, da localização do jogo à escolha livre de fase, dica, conclusão, saída, retorno e leitura da evolução. Registrar o resultado humano explícito. |

**Referências vigentes.** [Guia UX](../../ux-ui/GUIA-DE-EXPERIENCIA.md) · [Módulo 04](../04-evolucao-familiar/ESPECIFICACAO.md) · catálogo e componentes de jogos em `apps/api/src/desenvolvimento/jogos/` e `apps/web/src/componentes/desenvolvimento/jogos/`.

## 14. Decisões de UX e Atividades Reais — 2026-11-24

**Aprovadas pelo Produto:**

- **UX-03 (DEV-UX-P01):** filtro de Atividades Reais em DEV-F01 e estados em DEV-F03.
- **UX-04 (DEV-UX-P02):** cabeçalho compartilhado em DEV-F01 e saldo em DEV-F06.
- **UX-05 (DEV-JOG-P04/P05, interação e confirmação visual):** catálogo, entrada e escolha de fase em E5-F01 a E5-F05 e E5-ACE-13.

**Atividades Reais — aprovação de Produto em 2026-11-24.** O responsável aprovou as opções **1A · 2A · 3A** após a apresentação do protótipo. Isso aprova a reposição manual de sugestões (DEV-JOG-P02), o limite por pessoa e categoria (DEV-JOG-P03) e a rodada de curadoria (DEV-JOG-P01). As regras do E4 estão na seção 12. Jogos Digitais seguem conforme E5, com oito jogos e 40 fases. A ampliação de fases (DEV-JOG-P06) permanece estudo de escopo.

### Primeira rodada de curadoria (DEV-JOG-P01)

Faixa orientativa de **6 a 12 anos**, com instrução curta para o adulto e prioridade à experiência de seis anos. As fichas são para consulta antes da brincadeira.

| Brincadeira | Categoria · dificuldade | Duração | Como brincar e materiais |
|---|---|---|---|
| O que sumiu? | Memória e atenção · simples | 5–8 min | Escolham três objetos da casa. Uma pessoa esconde um e a outra diz o que mudou. Troquem os papéis. Usem um pano ou virem de costas. |
| Mapa do tesouro | Raciocínio · média | 10–15 min | Criem duas pistas até um objeto escondido. Quem encontra escolhe o próximo esconderijo. As pistas podem ser faladas ou desenhadas em papel. |
| História em turnos | Linguagem · simples | 5–10 min | Inventem uma história em turnos, com fala, desenho ou gesto. Escolham juntos o final. Nenhum material obrigatório. |
| Orquestra de casa | Criatividade · simples | 5–10 min | Inventem um ritmo curto e respondam em turnos. A criança conduz a rodada seguinte. Usem palmas suaves, gestos ou pote plástico e colher de madeira. |
| Alvo cooperativo | Coordenação · simples | 5–10 min | Lancem em turnos e ajustem juntos a distância. Usem papel amassado ou meias, com um cesto ou alvo no chão. Dá para jogar sentado. |
| Piquenique em casa | Autonomia · média | 10–15 min | A criança escolhe o lugar e combina com o adulto quem prepara cada parte. Usem o lanche da casa ou façam um piquenique imaginário. |

### Aceite do protótipo e entrega para desenvolvimento

**Protótipo v2 aprovado pelo responsável de Produto em 24/11/2026.** Usar o [protótipo navegável](prototipo-atividades-reais-v2.html) para reproduzir o primeiro uso e a disputa pela décima vaga. A aprovação é do desenho. A aplicação integrada terá homologação própria. Os dados, o seletor de cenários, o botão de reinício e o armazenamento local do HTML servem à demonstração.

#### 1. Estado por pessoa e contratos da API

Revisar `servico-sugestoes.ts`, `servico-desafios.ts`, `servico-participacoes.ts`, o controlador de Desenvolvimento e o esquema Prisma. Reutilizar as rotas de sugestões, escolha, participação e disponibilidade. Definir a menor operação autorizada de retirada e seu contrato. A resposta de cada mutação deve permitir reconciliar a tela com o estado confirmado.

- A lista inicial consulta as escolhas ativas da pessoa. Abrir a Biblioteca, trocar de pessoa ou recarregar a página não deve gerar sugestões nem gravar exposição. A descoberta ocorre mediante ação explícita. Separar as candidatas apresentadas, a escolha ativa, a disponibilidade para nova participação e os fatos históricos.
- Persistir o necessário para priorizar inéditas e identificar retiradas nunca realizadas. Conferir as linhas legadas antes da migração: preservar escolhas ativas válidas, participações, favoritos legados e versões. Linhas antigas de sugestões não escolhidas não são atividades ativas. Quando o histórico de exposição anterior for desconhecido, documentar o tratamento adotado.
- Autorizar leitura e mutação no servidor por pessoa, família e operação. Revalidar elegibilidade e contagem ao escolher, inclusive quando outro responsável já ocupou a última vaga. Reenvio da mesma escolha não consome outra vaga. Retirada repetida não altera saldo ou histórico. Testar escolha e retirada concorrentes com participação, respeitando as operações efetivamente confirmadas.

#### 2. Experiência no celular

| Situação | Resultado verificável |
|---|---|
| Primeiro acesso e retorno | Exibir cabeçalho compartilhado, Ativas, Executadas, filtro e Sugerir brincadeiras. Com zero escolhas, mostrar estado vazio sem cartões editoriais. No retorno, carregar as ativas da pessoa e manter as sugestões fechadas. |
| Descoberta e escolha | Sugerir brincadeiras abre até duas opções elegíveis no filtro selecionado. Quero experimentar move somente a escolhida para Ativas após o sucesso. A outra continua visível. A presença de uma vaga na área de sugestões não dispara reposição. |
| Renovação e escassez | Renovar sugestões substitui até duas opções e respeita a ordem da seção 12. Com poucas alternativas, preservar cartões elegíveis que não puderem ser trocados. Com zero alternativas, informar o resultado e manter acesso às ativas. |
| Ficha da ativa | Apresentar instrução, materiais, dificuldade e, quando disponíveis, idade e duração. Participou e Concluiu registram a experiência e o crédito calculado pelo servidor. Retirar das ativas devolve a vaga sem criar execução ou movimentação de estrelas. |
| Limite e recuperação | Com dez, bloquear somente a nova inclusão na mesma categoria e pessoa. Informar a categoria no aviso e oferecer Ver atividades ativas, abrindo a lista filtrada. Após retirar ou finalizar uma atividade, uma nova escolha explícita pode ocupar a vaga. |
| Rede, navegação e troca de pessoa | Preservar o último estado confirmado em falha de rede, permitir retentar e descartar respostas atrasadas do contexto anterior. Manter os filtros previstos no módulo e anunciar o resultado das ações de forma acessível. |

#### 3. Curadoria e regressão

Aplicar as seis fichas da seção 14 na carga oficial após verificar IDs, versões e vínculos. Reexecutar a carga para comprovar idempotência e teto editorial de 24. Preservar a experiência de atividades personalizadas, inclusive cadastro por nome e uso sem categoria, a reativação autorizada de Executadas e o histórico do Módulo 04.

#### 4. Testes e homologação da implementação

1. **Fluxo principal:** começar com zero, pedir duas sugestões, escolher uma, recarregar e consultar a mesma pessoa em outra sessão. A escolha persiste e a lista de sugestões só reabre por ação explícita.
2. **Retirada:** retirar a atividade nunca realizada. Conferir vaga, histórico e saldo antes e depois. Pedir novas sugestões até esgotar as inéditas elegíveis do filtro e verificar que a retirada pode voltar. Uma atividade já realizada segue excluída da rotação de novidades mesmo após reativação.
3. **Participação:** exercitar Participou e Concluiu, resposta incerta, reenvio e nova execução legítima após reativação. Conferir uma ocorrência e o crédito devido por execução confirmada.
4. **Capacidade:** partir de nove escolhas, tentar incluir duas atividades distintas simultaneamente em duas sessões autorizadas e confirmar dez no servidor. Verificar aviso, filtro, liberação de vaga, outras categorias, personalizadas, sem categoria e dados legados acima do teto.
5. **Isolamento e regressão:** usar duas pessoas e duas famílias fictícias. Verificar acesso revogado e chamadas diretas. Rodar checagens estáticas, smokes E4, regressão de autorização, histórico, estrelas e E5 conforme o impacto. Atualizar testes que ainda exigem seis sugestões ou devolvem a escolhida na lista de sugestões.
6. **Homologação humana:** entregar roteiro móvel reproduzível para primeiro uso, retorno, retirada e 11ª escolha, com dados fictícios. Registrar testes executados, resultados e pendências da implementação separadamente do aceite do protótipo.

## 15. Catálogo ampliado — Jogos Digitais e Atividades Reais (direção aprovada em 2026-11-25)

**Decisão L3 aprovada pelo responsável do Produto em 2026-11-25** (DEV-CAT-P01 a P09). Esta seção define a direção e as regras-alvo. **As seções 12 e 13 continuam vigentes até a implementação homologada de cada incremento.** Ao entrar em vigor, cada regra abaixo substitui expressamente o trecho indicado.

**Motivação.** O catálogo atual (24 atividades, 8 jogos e 40 fases) tem pouca variedade, progressão curta e falhas de curadoria. A meta de longo prazo é de **pelo menos 200 Atividades Reais e 100 Jogos Digitais** para crianças de **5 a 12 anos**, com qualidade verificável. A meta é atingida em marcos; cada marco só avança após homologação.

### Regras-alvo

- **DEV-CAT-P01 — O que conta como jogo.** Um jogo é uma regra e um objetivo que a criança reconhece como diferentes. Mudar apenas o tema ou as figuras não cria jogo novo: o tema é conteúdo dentro do jogo. Exemplo: *Caminhos e labirintos* e *Entrega no jardim* são jogos distintos; um “labirinto da floresta” com a mesma regra não é. Vários jogos podem compartilhar o mesmo motor técnico.
- **DEV-CAT-P02 — Faixas etárias.** O público dos jogos e das atividades curadas é de **5 a 12 anos**, em três faixas: **Pequenos (5–6)**, **Médios (7–9)** e **Grandes (10–12)**. *Limites confirmados pelo responsável do Produto em 2026-11-26 (D1).* A faixa orienta a oferta e não representa capacidade.
- **DEV-CAT-P03 — Trilhas e fases.** Cada jogo tem **três trilhas, uma por faixa, com cinco fases cada (15 fases)**. A dificuldade cresce dentro da trilha e entre as trilhas. A criança segue a trilha na ordem: só a próxima fase pendente abre e, concluídas todas, qualquer fase abre para repetir, sem ajuste adaptativo (decisão do responsável em 2026-11-26, ticket 15). *Substitui E5-F02 e E5-ACE-01 (cinco fases por jogo).*
- **DEV-CAT-P04 — Uso da faixa (revisto em 2026-11-26).** Os jogos **não** filtram por faixa: a criança segue a trilha na ordem, o jogo abre na próxima fase pendente e, concluídas as fases, ela escolhe qualquer uma para repetir. A faixa calculada pela data de nascimento serve para **priorizar as sugestões de Atividades Reais** (P09). *Decisão do responsável do Produto após a homologação H15, que reprovou a Biblioteca de jogos por faixa.*
- **DEV-CAT-P05 — Data de nascimento.** Habilitar e usar Desenvolvimento exige data de nascimento da pessoa acompanhada (ver Módulo 01, seção 16). Cuidados não muda. *Substitui, para Desenvolvimento, o trecho da seção 12 “Não exigir nascimento”.*
- **DEV-CAT-P06 — Mudança de faixa.** Quando a idade muda de faixa, as sugestões de Atividades Reais passam a priorizar a nova faixa. Progresso e descobertas anteriores continuam preservados no Histórico.
- **DEV-CAT-P07 — Leitura.** Instruções e enunciados são curtos e pensados para leitura pelo adulto junto da criança, sobretudo na faixa Pequenos. Não há narração por voz neste recorte; o som continua opcional.
- **DEV-CAT-P08 — Áreas.** Mantêm-se as seis áreas vigentes e entra **Números** (contagem, quantidades, formas e ordem), para jogos e atividades. A inclusão exige compatibilidade com filtros, Histórico, Resumo e atividades personalizadas sem categoria.
- **DEV-CAT-P09 — Sugestões de Atividades Reais.** **Sugerir brincadeiras** passa a apresentar **até cinco** opções elegíveis, priorizando a faixa da pessoa. Renovar oferece até cinco. As demais regras da seção 12 (descoberta por botão, sem reposição automática, prioridade de inéditas, limite de dez por categoria e pessoa) permanecem. *Substitui “até duas” em DEV-JOG-P02, E4-ACE-02 e E4-ACE-03.* O teto editorial de 24 modelos (E4-ACE-01) deixa de valer quando o primeiro marco for publicado.

### Qualidade do conteúdo

Todo jogo, fase e atividade passa pela mesma régua antes de publicar:

| Item | Exigência verificável |
|---|---|
| Objetivo | Uma frase clara; título coerente com o que a fase pede |
| Solução | Cada fase tem solução e, quando aplicável, uma única resposta defensável, conferidas por verificador automático |
| Progressão | Métrica de dificuldade do motor (passos, pares, opções, período, cenas etc.) cresce dentro da trilha e entre as trilhas |
| Rótulos | Nenhum texto visível entrega a resposta; nome e figura correspondem |
| Variedade | Variantes de uma fase não repetem a mesma solução nem são só espelhamento |
| Celular | Legível e tocável a partir de 320 px, sem rolagem horizontal |
| Dica | Útil no estado atual da partida e não revela a resposta no primeiro nível |
| Atividade real | Ficha padrão: objetivo lúdico, até três passos, materiais comuns de casa, variação mais fácil e mais difícil, adaptação para brincar sentado, duração e checklist de segurança por faixa |
| Origem | Conteúdo e ilustrações próprios ou licenciados, com origem registrada. Ilustrações: Twemoji, licença CC-BY 4.0, servidas pela própria plataforma e com atribuição (decisão de 2026-11-26, D3) |

O conteúdo é produzido em formato versionado e pode ser rascunhado com apoio de ferramentas, inclusive IA, **fora da plataforma**. A publicação exige revisão humana. A partida continua sem IA, sem serviços externos, sem anúncios e sem telemetria (E5-F03 e E5-F08). Atividades reais são distribuídas numa matriz de cobertura (faixa × área × duração × lugar × número de pessoas) para evitar repetição.

### Marcos

| Marco | Conteúdo | Condição para avançar |
|---|---|---|
| 1 — fundação (concluída em 2026-11-26) | Régua, três trilhas, data de nascimento, área Números, cinco sugestões, ilustrações Twemoji e **8 jogos ativos** com 15 fases (4 refeitos e 4 novos: Sudoku de figuras, Forme a palavra, Do menor ao maior e Robô com setas) | Homologada (DEV-CAT-M1) |
| 1 — conteúdo (em planejamento) | **12 jogos novos** (total de 20 ativos), **60 Atividades Reais** pela ficha padrão (cerca de 20 por faixa, todas as áreas, inclusive Números) e **um jogo 2D, Barquinho no rio**, que fecha o Marco 1 | Régua aprovada, desempenho e acessibilidade do 2D medidos e homologação humana no celular |
| 2 em diante | Lotes de cerca de 10 jogos e 40 atividades | Mesma régua e homologação por lote |

**12 jogos novos do Marco 1 (escolha do responsável em 2026-11-26):** Conte e toque e Qual tem mais? (Números); Mãe e filhote e Metades (Memória e atenção); Letra inicial e Adivinha pela pista (Linguagem); Separar o lixo e Animais por habitat (Autonomia); Caminho de cores e Ligue os pontos (Coordenação); Encontre as diferenças e Ache o objeto escondido (Memória e atenção). Motores novos: contagem, classificar em caixas, diferenças (cenas montadas com as ilustrações) e traçado. Ache o intruso, Complete a sequência, Pares de sombras e Palavra e figura ficam arquivados por serem fáceis demais (ticket 12 de DEV-CAT-M1).

**Jogo 2D do Marco 1 — Barquinho no rio (escolha do responsável em 2026-11-26).** A criança guia um barco rio abaixo, desviando de pedras e pegando folhas, em ritmo lento, **sem tempo, sem vidas e sem perder**: bater numa pedra só desvia o barco. Toque simples ou teclado, 15 fases em três trilhas (rio mais longo, canal mais estreito, mais pedras e curvas), movimento reduzido respeitado e saída sempre visível. Mesmo contrato de servidor dos demais jogos (início, conclusão, versão) e mesma separação entre descobertas digitais e estrelas.

### Fora deste recorte

Ranking, metas, notificações de retorno, avaliação cognitiva, IA durante o jogo, anúncios, chat, multijogador e narração por voz. As Atividades Reais para adultos e idosos previstas na seção 12 saem do catálogo (decisão do responsável do Produto em 2026-11-26, D2): ficam arquivadas, sem oferta nem sugestão, e as participações anteriores continuam no Histórico. *Substitui, na seção 12, a oferta para adultos e idosos.*

### Decisões registradas

- D1, D2 e D3 decididas em 2026-11-26 (ver P02, “Fora deste recorte” e a régua, linha Origem).
- 2026-11-26: Marco 1 mantido em 20 jogos e 60 atividades, mais o jogo 2D Barquinho no rio; a lista de 12 jogos novos acima substitui a proposta anterior.
