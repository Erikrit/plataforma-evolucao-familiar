# Módulo 03 — Desenvolvimento da Laurinha

**Versão:** 1.5 — E5, escopo aprovado para a primeira publicação, 2026-11-22\
**Estado:** regras de atividades reais nas seções 1–12 e recorte E5 na seção 13. Implementação e homologação são registradas em [STATUS-E-ESCOPO.md](../../produto/STATUS-E-ESCOPO.md) e na esteira.\
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

## 12. E4 — Biblioteca de atividades reais

**APROVADO pelo responsável do Produto em 2026-11-22**, por concordância com a proposta: catálogo curado, seleção pequena e renovação de sugestões antes de automatizar sua alimentação. Limites iniciais aprovados: **até 24 modelos publicados ativos, até 6 sugestões por pessoa e renovação de até 3 opções por solicitação**.

### Conteúdo e privacidade

Modelos de catálogo são compartilhados e não contêm dados pessoais. Cada modelo publicado tem nome, instrução curta, categoria, dificuldade, faixa etária orientativa, materiais quando necessários e origem. Duração/adaptações e supervisão aparecem quando úteis. Atividades personalizadas e escolhas/participações pertencem ao contexto privado da família/pessoa.

Usar categorias existentes, incluindo Todas e tratamento vigente de atividades personalizadas sem categoria. Publicar conteúdo curado e apropriado para crianças, adultos e idosos, com tratamento respeitoso e sem promessas clínicas. Idade orienta a escolha e não representa capacidade. Não exigir nascimento, interesses ou questionário para oferecer opções; se faltar idade, permitir explorar por faixa orientativa ou opções gerais sem inventar idade.

O limite de 24 aplica-se aos modelos publicados ativos do catálogo global, não ao histórico, modelos arquivados nem atividades personalizadas da família. Alterar/arquivar modelo não reescreve instruções relevantes, dificuldade ou estrelas de execuções anteriores: preservar a versão executada.

### Sugestões e escolha

Oferecer até 6 sugestões elegíveis no contexto da pessoa. Excluir as indisponíveis para nova participação conforme DEV-F03; diversificar categorias sem diagnosticar necessidades ou impor metas. Com poucas alternativas, mostrar menos opções e explicar de forma neutra. Não duplicar itens para completar a quantidade.

Responsável com organização de Desenvolvimento autorizada pode escolher/manter uma atividade para experimentar e solicitar **Renovar sugestões**. A seleção é privada por pessoa, compartilhada entre seus responsáveis autorizados; não depende do navegador individual.

Renovar substitui **até 3 alternativas ainda não escolhidas** por outras do catálogo curado, conforme disponibilidade. Preserva atividades escolhidas, personalizadas, participações e versões históricas. Sem alternativas, manter a seleção e informar “Não há novas sugestões disponíveis no momento”. Não há garantia de novidade infinita.

### Ciclos que permanecem distintos

Escolher ou renovar não registra participação, não gera estrelas e não altera Explorar/Executadas. Após Concluiu/Participou persistido, a atividade continua indo para Executadas; nova participação depende da disponibilização autorizada já existente. Renovar nunca reabre uma atividade executada. A tabela de estrelas e recompensas permanece vigente.

A interface aproveita Biblioteca e Explorar/Executadas. “Sugestões para esta pessoa”, “Renovar sugestões” e acesso a “Ver biblioteca” ficam no contexto da pessoa, sem novo menu global. Registros e estados operacionais usam os contratos de origem, sem histórico duplicado.

### Alimentação inicial

A entrega funciona com catálogo aprovado e seleção por regras locais. Conteúdo inicial pode ser mantido de forma versionada no repositório/seed, com revisão de qualidade antes de publicação. Internet/IA podem futuramente preparar candidatos para curadoria; pesquisa automática, geração em tempo real e publicação automática não integram E4. A manutenção do catálogo global não é poder do administrador de família.

### Critérios de aceite

| ID | Critério |
|---|---|
| E4-ACE-01 | Catálogo contém no máximo 24 modelos ativos publicados, com metadados necessários e curadoria registrada; personalizadas/histórico não entram nesse limite. |
| E4-ACE-02 | Pessoa recebe até 6 sugestões elegíveis, sem exigir novos dados pessoais; faixa orientativa não é diagnóstico nem bloqueio rígido. |
| E4-ACE-03 | Renovar troca até 3 opções não escolhidas, sem duplicar itens, sem apagar escolhas/personalizadas e com retorno útil se faltarem alternativas. |
| E4-ACE-04 | Seleção persiste por pessoa e respeita família/operação; responsáveis da mesma pessoa veem estado consistente, inclusive retry e concorrência. |
| E4-ACE-05 | Escolher/renovar não concede pontos nem reabre Executadas; participação, reativação e resgates mantêm DEV-F03..06. |
| E4-ACE-06 | Atualização/arquivamento não altera conteúdo e créditos de execuções históricas; dados pessoais nunca são publicados no catálogo global. |
| E4-ACE-07 | Biblioteca móvel permite entender instruções/materiais, escolher e renovar sem excesso de opções; vazio/erro não geram cobrança. |
| E4-HOM | Homologar escolher → renovar preservando escolha → participar → Executadas → disponibilizar novamente, com duas famílias e regressão de estrelas/histórico. |

**Fora do recorte E4:** jogos digitais (entregues separadamente no E5), IA com histórico pessoal, publicação automática, ranking e nova tabela de estrelas. A correção de anexos foi executada no recorte EST-01; estado vigente em STATUS-E-ESCOPO.

## 13. E5 — Jogos digitais na Biblioteca de Desenvolvimento

Jogos breves complementam as atividades presenciais e registram descobertas lúdicas. O piloto é composto por **Memória de figuras** (Memória e atenção), **Complete a sequência** e **Caminhos e labirintos** (Raciocínio lógico), com **cinco fases por jogo**. Labirintos também envolvem coordenação na interação. A V1 para a VPS amplia o catálogo para **oito jogos e 40 fases livres**, acrescentando **Pares de sombras** e **Ache o intruso** (Memória e atenção), **Palavra e figura** e **Histórias em cenas** (Linguagem) e **Entrega no jardim** (Coordenação). O conteúdo aprovado é definido nesta especificação e no catálogo versionado do código; o [plano original de expansão](https://github.com/Erikrit/plataforma-evolucao-familiar/blob/f58d029658499bdfc3807c0488662c0bc4557dae/docs/esteira/planejamento/evo-catalogo-jogos-20261122.md) permanece no Git apenas para consulta histórica.

**Origem das decisões.** As decisões funcionais estão registradas no Git na sequência `e00b23b`–`45e1231`. O recorte de três jogos e cinco fases foi fornecido na especificação consolidada indicada pelo responsável em 2026-11-22 para este planejamento. As fases vigentes e seus controles são definidos no catálogo versionado e nos componentes dos jogos; o [plano E5 histórico](https://github.com/Erikrit/plataforma-evolucao-familiar/blob/f58d029658499bdfc3807c0488662c0bc4557dae/docs/esteira/planejamento/e5-jogos-digitais.md) pode ser consultado no Git, sem funcionar como requisito ativo.

### Regras funcionais

- **E5-F01 — Descoberta.** Integrar **Jogos digitais** à Biblioteca de Desenvolvimento da pessoa. Exibir até três destaques automáticos, com continuidade e variedade por regras locais estáveis, seguidos do catálogo completo com **Todas** e filtros pelas categorias vigentes. Todos os jogos disponíveis à pessoa aparecem no catálogo, inclusive quando a data de nascimento está ausente. Faixa etária é orientativa. Sugestões renováveis e limites da seção 12 pertencem às atividades reais.
- **E5-F02 — Fases.** Cada jogo oferece cinco fases com objetivo, instrução breve e dificuldade progressiva predefinida. Qualquer fase pode ser aberta no primeiro acesso e repetida livremente. A interface pode indicar uma próxima fase a experimentar. Dificuldade é atributo da fase, sem ajuste adaptativo ou seletor adicional.
- **E5-F03 — Conteúdo.** Usar conteúdo próprio ou licenciado, curado e versionado. Memória varia pares aprovados e posições. Sequência varia padrões verificáveis. Labirinto usa mapas revisados e variações que preservam caminho válido. A versão e a dificuldade são rastreáveis. A partida opera com conteúdo aprovado e lógica hospedada na plataforma, sem serviços externos, IA durante o jogo, anúncios ou rastreadores de terceiros.
- **E5-F04 — Partida.** Jogar inicia a fase diretamente. Objetivo e controles ficam acessíveis em Como jogar durante a partida. A seleção de fase oferece Todas, Concluídas e Não concluídas a partir do progresso persistido. Dica e saída são sempre acessíveis durante a partida. Alcançar o objetivo conclui a fase, inclusive com dica ou ajuda de adulto. A celebração breve é acessível, respeita movimento reduzido e usa som somente de forma opcional. Partidas e repetições ficam livres de relógio, limite de vidas e contagem de erros.
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
| E5-HOM | Responsável autorizado e criança avaliam o piloto no celular com dados fictícios, da localização do jogo à escolha livre de fase, dica, conclusão, saída, retorno e leitura da evolução. Registrar o resultado humano explícito. |

**Referências vigentes.** [Guia UX](../../ux-ui/GUIA-DE-EXPERIENCIA.md) · [Módulo 04](../04-evolucao-familiar/ESPECIFICACAO.md) · catálogo e componentes de jogos em `apps/api/src/desenvolvimento/jogos/` e `apps/web/src/componentes/desenvolvimento/jogos/`.

## 14. Propostas de UX, curadoria e jogos — achados dos testes da V1 (2026-11-24)

**Estado: PROPOSTAS EM ANÁLISE, NÃO HOMOLOGADAS NEM APROVADAS COMO SUBSTITUIÇÃO DAS REGRAS VIGENTES.** As frentes UX e Jogos devem usá-las como objeto da análise; não executar automaticamente as mudanças apenas por constarem aqui. A baseline V1 permanece de **24 modelos curados, até 6 sugestões por pessoa, renovação de até 3 e oito jogos/40 fases**. Pontuação, histórico, idempotência e autorizações atuais permanecem intocados até aprovação.

| ID | Proposta para avaliação | Frente e cuidado |
|---|---|---|
| DEV-UX-P01 | Trocar chips/controles avulsos de categoria por **Select** em Atividades Reais, coerente com Jogos; preservar Todas, filtros, estados e URL | UX; preferencialmente sem mudança funcional |
| DEV-UX-P02 | Unificar cabeçalho das duas bibliotecas: **Biblioteca · nome da pessoa** + ícone de estrela e **quantidade de saldo**, sem texto “Saldo:” | UX; reutilizar fonte de saldo, sem alterar regra de estrelas |
| DEV-JOG-P01 | Revisar a curadoria de atividades reais para faixa orientativa **6–12 anos**, priorizando atividades práticas, materiais acessíveis e diversão presencial | Jogos/Produto; preservar conteúdo e participações utilizados |
| DEV-JOG-P02 | Exibir **até duas sugestões por vez**, somente elegíveis/ainda não escolhidas ou aplicadas, com renovação e feedback claro | Jogos/Produto; **substitui limites E4 de até 6/renovação 3 se aprovado**; definir elegibilidade e não confundir escolha com participação |
| DEV-JOG-P03 | Avaliar **máximo de 10 atividades ativas por categoria e pessoa**, com mensagem amigável ao atingir limite, **não** limitar automaticamente o catálogo editorial global | Jogos/Produto e Arquitetura; definir ativas, personalizadas, sem categoria, reativação e concorrência; só validar no backend após aprovação |
| DEV-JOG-P04 | Catálogo de jogos em **cards com miniatura**, filtros simples e entrada direta na primeira fase disponível; não mostrar lista extensa de fases ao abrir a biblioteca | UX/Jogos; referência de navegação Poki, sem copiar marcas, imagens, anúncios ou jogos; preservar acessibilidade |
| DEV-JOG-P05 | Conclusão oferece próxima fase ou repetir; ao concluir todas, parabenizar e permitir revisitar fases concluídas | Jogos/Produto; validar contra a regra atual E5 de acesso direto às fases 4/5, sem bloqueio automático silencioso |
| DEV-JOG-P06 | Estudar ampliação dos **8 jogos para pelo menos 15 fases cada (mínimo 120)**, garantindo variedade real, progressão qualitativa e compatibilidade com o progresso existente | Jogos/Arquitetura/Produto; **mudança de escopo**, distinta do redesenho visual e posterior à estabilidade UX |

**Ordem:** (1) corrigir a experiência da biblioteca e anexo/cabeçalho em conjunto com UX; (2) definir regras de sugestões, limites e catálogo com Produto/Arquitetura; (3) avaliar ampliação de fases em incrementos após estabilização da V1. **Não adicionar** Web Push, IA, novos tipos de estrelas, rankings ou controles de desempenho.

**Critério de encaminhamento:** cada frente apresenta diagnóstico com arquivos reais, experiência proposta, impactos e testes. Propostas que alteram limites, obrigatoriedade, progressão, persistência ou autorização retornam ao Produto para decisão L3 e **somente após aprovação** substituem a regra canônica e são enviadas à esteira.
