# Guia de Experiência UX/UI — Plataforma de Evolução Familiar

**Versão:** 2.0 — organização de Consultas e exames por perfil aprovada em 2026-11-17  
**Referência:** `develop`; decisões de UX validadas em conversa.  
**Status:** diretrizes para implementação; NÃO é evidência de tela implementada, teste de acessibilidade ou homologação.  
**Fontes funcionais:** `docs/produto/DOCUMENTO-MESTRE.md`, `docs/produto/STATUS-E-ESCOPO.md` e `docs/modulos/*/ESPECIFICACAO.md`.

## 1. Objetivo e limites

Entregar experiência familiar moderna, acolhedora, simples e mobile-first, com **pessoas antes de funcionalidades**, **mínimo esforço de registro** e **organização sem cobrança**. Aplica-se aos módulos 01, 02 e futuros 03 e 04.

Este guia regula apresentação, navegação, microcopy, interação, componentes e acessibilidade. **Não substitui especificações funcionais**. Uma alteração puramente visual ou interação compatível com as regras aprovadas pode ser decidida em UX; novas regras de negócio, permissões, comportamentos clínicos, obrigações ou tratamento de dados devem ser encaminhados à conversa de Produto por prompt contextualizado. Privacidade e segurança são obrigatórias.

## 2. Identidade — Família Viva / Azul Contemporâneo

- Primária `#3569C8` (ações e identidade); primária suave `#E8EFFC` (superfícies destacadas).
- Apoio `#E5A66A` (acentos afetivos, nunca indicação automática de atraso).
- Fundo `#F6F8FC`; texto principal `#23344F`; superfícies principais brancas.
- Valores são **referência visual aprovada**, não garantia de contraste: validar cada combinação em seus estados normal/hover/focus/disabled, inclusive texto sobre superfícies suaves; ajustar tons secundários se necessário, preservando a direção visual.
- Tipografia candidata **Inter** com fallback acessível; corpo preferencialmente 16px; secundário 14–16px; títulos de seção 20–22px e título de página 26–28px como referências responsivas, não tamanhos rígidos.
- Densidade **confortável**: espaço de referência 8px entre itens relacionados, 16px dentro dos cartões e 24px entre seções. Alvos interativos preferencialmente >=44×44px; respeitar critérios WCAG 2.2 AA.
- Cor não é a única forma de representar situação. Sem sombras excessivas, cartões multicoloridos, animações ou gamificação decorativa.

## 3. Biblioteca e manutenção

**Mantine UI está integrado à aplicação**; preservar a biblioteca existente e validar o uso de seus componentes, bundle, CSS/SSR, foco e acessibilidade ao evoluir o layout. Não adicionar Mantine e outra biblioteca concorrente para a mesma função. Priorizar componentes próprios da biblioteca, tema central e customizações mínimas. Possíveis componentes: `AppShell`, `Container`, `Stack`, `Group`, `Card`, `Paper`, `Button`, `TextInput`, `Select`, `Drawer`, `Modal`, `Alert`, `Notification`, `Accordion`. Usar uma família coerente de ícones, com rótulo textual quando necessário. Não copiar templates administrativos integrais nem criar design system paralelo.

Padrão para cada componente: texto legível, feedback em andamento, estado desabilitado claro, foco visível, interação por teclado/touch, conteúdo em telas estreitas e sem vazamento de dados sensíveis.

## 4. Arquitetura de informação

- **Página inicial:** pessoas autorizadas como conteúdo principal; cartões indicam quem é a pessoa e, apenas quando existir informação útil e permitida, um resumo contextual. Não exibir IDs, códigos de requisitos, tokens ou termos internos.
- **Gerenciar família:** área administrativa única e secundária, acessível pela navegação compartilhada somente a usuários autorizados. Agrupar **Pessoas**, **Acessos e permissões** e **Convites**; remover formulários administrativos do conteúdo de acompanhamento (home, perfis, cuidados, desenvolvimento, histórico e resumo). Não confundir administração de acessos com gestão cotidiana de medicamentos, consultas e brincadeiras, que continua nos módulos correspondentes. Reaproveitar operações existentes; não ampliar permissões.
- **Perfil:** nome e áreas disponíveis primeiro; edição de vínculo e dados complementares como ação secundária, sem bloquear uso.
- **Cuidados:** três níveis de organização: (1) Rotina de hoje; (2) Outros cuidados — consultas, exames, apoio, histórico quando aplicável; (3) Gerenciar cuidados — programação/cadastros somente para perfis autorizados. Os níveis são agrupamentos de UI, **não necessariamente três novas rotas/telas**.
- **Módulos 03 e 04:** preservar mesma identidade, navegação, cartão, confirmação, feedback, densidade e privacidade, com variações contextuais discretas. Módulo 03 mais lúdico sem placares ou cobrança; módulo 04 histórico e resumo por pessoa, sem duplicar entrada de dados.


### 4.1 Navegação adaptativa e contextual por pessoa — decisão aprovada em 2026-11-16

- Utilizar **uma única navegação compartilhada** em toda a plataforma, com `AppShell` do Mantine no desktop e menu `Drawer` no celular. Não criar uma aplicação ou configuração independente por perfil.
- **Navegação geral:** Início / Nossa família. Ações administrativas aparecem em um agrupamento único **Gerenciar família** apenas para usuários com autorização correspondente; não repetir botões de administração em todas as abas/telas.
- **Navegação contextual:** ao selecionar uma pessoa, apresentar seu nome e **somente as áreas autorizadas** (por exemplo, Cuidados, Desenvolvimento, Histórico, Resumo). Permitir trocar de pessoa ou voltar à visão geral sem percorrer uma cadeia de links de retorno.
- **Contexto e estado:** indicar a pessoa e a área ativa, preservar orientação ao transitar por telas, garantir foco/teclado/ARIA para navegação e menu móvel. Destinos inexistentes ou não autorizados não devem ser apresentados como atalhos operáveis.
- **Separação de responsabilidades:** "Gerenciar família" cobre gestão de pessoas, convites e acessos; "Gerenciar cuidados" e criação de brincadeiras são ações dos respectivos módulos, sujeitas às permissões já vigentes.
- **Privacidade:** menu é consequência da autorização do servidor, nunca fonte de autorização. A condição `filtradoPorAutorizacao` não deve ser tomada isoladamente como prova de papel administrativo; revisar com Arquitetura a forma segura de determinar visibilidade. Administrador não ganha acesso clínico ou infantil por padrão.
- Evitar duplicar "Início" e "Nossa família" como rotas/menus redundantes quando apontarem para o mesmo conteúdo: preservar rótulos úteis, com destino único e claro.

### 4.2 Administração familiar — organização visual aprovada

- Área administrativa com navegação local clara: **Pessoas** (consultar/adicionar), **Acessos e permissões** (entender quem acompanha quem e em qual responsabilidade) e **Convites** (convidar/ativação conforme fluxo existente).
- Não colocar todas as funções em um único `Accordion` extenso, nem misturá-las com cartões familiares. Usar seções, telas ou subnavegação proporcionais à complexidade real; não introduzir telas vazias ou formulários duplicados.
- **Acessos:** distinguir pessoa acompanhada, usuário com acesso, responsabilidade e escopo. Identificadores técnicos só para diagnóstico, jamais como principal rótulo. Não prometer listar, editar ou revogar autorizações até confirmar contratos e políticas vigentes.
- **Dependência transversal:** `CT-20261116-001` na revisão de UX, status `PROPOSTA` para Arquitetura. Refere-se à capacidade de montar visão administrativa segura de acessos; não autoriza nova operação de permissão.

### 4.3 Hierarquia de ações e subnavegação contextual — decisão UX aprovada em 2026-11-16

**Origem:** reprovação expressa de experiência em testes de uso da família, após a homologação técnica R2. A reprovação da experiência não invalida os PASS de typecheck/smokes nem comprova uma falha de regras de negócio.

- **Tela principal de Cuidados:** deve ser enxuta e dedicada à rotina, horários, relatos pendentes e informações de acompanhamento realmente úteis. Retirar da composição principal formulários de criação e instruções longas sobre o uso do sistema.
- **Menu lateral contextual de Cuidados — escolha explícita do responsável pelo produto:** as áreas **Rotina**, **Medicamentos**, **Consultas e exames** e **Outros cuidados**, se autorizadas e úteis, devem aparecer como itens/subitens do menu lateral compartilhado, sob o contexto da pessoa. A entrada principal de Cuidados abre **somente a Rotina**, sem abas internas duplicadas nem navegação de categorias dentro do conteúdo. **Adicionar medicamento** e **Adicionar consulta** pertencem às respectivas áreas e não aparecem como formulários permanentes na Rotina.
- **Saudação da Rotina aprovada:** substituir a pilha de títulos e instruções (como “Rotina da Vovó” / “Hoje” / “Para acompanhar hoje” / “Os cuidados do dia...”) por **uma frase acolhedora, curta e contextual** com o nome cadastrado da pessoa acompanhada, por exemplo: **“Vovó, olha o que temos para hoje!”**. Não fixar “Vovó” no código nem duplicar a saudação com outro título de conteúdo. Os cartões autoexplicativos exibem horário, item, estado e ação; não adicionar texto didático quando a interface já comunicar a ação. Preservar instruções indispensáveis à segurança, ao consentimento e à confirmação do relato. A frase pode ser ajustada para nomes/formas de tratamento diferentes, com linguagem natural, sem presumir parentesco ou que o usuário autenticado seja a pessoa acompanhada.
- **Cadastro de medicamento — seleção de horários aprovada (UX):** o padrão oferece **um único seletor por dose**, com opções de horas cheias (`00:00` a `23:00`), não controles separados de hora/minuto. Se a orientação vigente exigir minuto específico, disponibilizar **“Outro horário da prescrição”** para informar o valor exato, sem arredondar. Exibir exatamente tantos seletores quanto o número de doses por dia informado; não distribuir doses automaticamente nem inferir intervalo clínico. Todos os horários devem ser exibidos para revisão e conferidos explicitamente com a orientação vigente antes da ativação de lembretes. Não acrescentar etapa artificial nem repetir dados já informados. Preservar integralmente CUI-F01 v1.3 e as regras de prescrição, autorização e persistência.
- **Lista de medicamentos — decisão UX aprovada:** o item **Medicamentos** do menu lateral exibe primeiro os medicamentos cadastrados (priorizar os ativos), em cartões concisos com **nome, horários vigentes e indicação de uso contínuo ou por período** quando disponível. Cada cartão abre os **detalhes da programação**. Apresentar **Adicionar medicamento** como ação explícita para quem tenha permissão. Não espalhar botões **Editar / Suspender / Encerrar** por todos os cartões: reunir operações existentes e autorizadas **somente no contexto do medicamento selecionado**, com confirmação proporcional para ações que interrompem programação. Não inventar novas operações nem esconder informação essencial sobre vigência e histórico. A lista não deve replicar a Rotina nem exigir digitação de dados já cadastrados.
- **Uma navegação, sem menus paralelos:** estender o menu lateral contextual já existente no AppShell; no celular, os mesmos destinos ficam no Drawer da navegação global. Não criar uma segunda barra de abas, um menu flutuante ou menu administrativo. Evitar submenu profundo e links redundantes; garantir acesso rápido à Rotina sem abrir o menu a cada relato.
- **Reutilização do padrão:** Desenvolvimento apresenta brincadeiras e participação primeiro; criação de brincadeira e gestão de recompensas ficam em ações secundárias do módulo. Evolução apresenta histórico/resumo primeiro, e filtros/exportação somente no contexto apropriado. Gestão familiar continua exclusivamente em Gerenciar família.
- **Confirmações contextualizadas:** relatos sobre medicamentos e participação em brincadeiras possuem ícones, rótulos, hierarquia e feedback distintos, preservando exatamente as escolhas, consequências, persistência e permissões atuais. Ícones complementam, não substituem texto nem representam punição.
- **Identidade e concisão:** usar uma família consistente de ícones com rótulos, tokens Mantine existentes, cartões com funções visuais distintas (informação, item acionável, estado, gestão), contraste e foco. Eliminar títulos repetidos do cabeçalho, descrições autorreferentes (por exemplo, instruções sobre onde ficam formulários) e parágrafos que expliquem a arquitetura do sistema ao usuário. Manter apenas instruções realmente necessárias à segurança, uso correto e consentimento.
- **Limite de decisão:** esta é uma diretriz de **UX L2 aprovada quanto à organização de interfaces**. Não cria novas permissões, entidades, operações clínicas, regras de agendamento nem altera definição de participação/estrelas. Rotas/subtelas são opções de implementação a validar no desenho UX antes da esteira.
- **Três princípios inegociáveis do produto (fonte canônica: `docs/produto/DOCUMENTO-MESTRE.md` §2):** (1) **Evolução familiar:** acompanhar pessoas, rotinas, cuidados e desenvolvimento ao longo do tempo; (2) **Esforço mínimo:** registrar informações rapidamente, sem preencher dados repetidos; (3) **Organização sem cobrança:** lembrar, incentivar e acompanhar, sem transformar a rotina familiar em obrigação. **Critério de bloqueio UX:** se alimentar o sistema for trabalhoso, a experiência falha mesmo com testes técnicos verdes. Qualquer novo passo, campo, tela ou instrução precisa justificar valor real e não repetição.
- **Aceite:** primeiro validar propostas visuais das jornadas Cuidados e Desenvolvimento com responsável do produto; somente depois encaminhar implementação incremental via `task-routing`, acompanhada de testes técnicos e novo teste humano.

### 4.4 Experiências contextualizadas por responsabilidade — diretriz UX, 2026-11-16

**Motivação:** o responsável pelo produto explicitou que a experiência de quem **organiza**, de quem **planeja os cuidados** e de quem **registra a rotina** deve ser visualmente distinta, sem criar três aplicativos, duplicar componentes ou comprometer a navegação compartilhada aprovada na FUN-06. **Aparência e ações visíveis dependem sempre de autorização contextual efetiva, não somente do rótulo do perfil**.

- **Administrador — organizar a família:** acesso às telas de gerenciamento de pessoas, convites, responsabilidades, metadados mínimos de quem acompanha quem e estado do acesso. Não herda leitura de medicamentos, relatórios de saúde, exames ou dados infantis. Pode acumular permissões de Responsável quando legitimamente concedidas; então os recursos correspondentes aparecem no contexto da pessoa autorizada.
- **Responsável — planejar e acompanhar:** dentro da pessoa/domínio autorizado, pode visualizar e gerenciar medicamentos e horários, consultas, exames, atividades/desafios e relatórios já previstos nas especificações, sem se tornar gestor de autorizações familiares por isso. O fluxo de cadastro permanece separado da Rotina; controles de programação ficam na área secundária correspondente.
- **Integrante — participar e registrar:** a interface cotidiana é direta, dinâmica, orientada aos cuidados realmente previstos e autorizados; pode apresentar marcação/relato de doses, atividades realizadas, registro breve de apoio e envio de arquivo/exame **somente se a operação e o escopo já estiverem autorizados**. Não exibir formulários de cadastro ou edição de programação, administração familiar ou dados de outras pessoas. Evitar criar relatórios de turno, obrigações diárias de observação ou coleta excessiva; observações são opcionais e contextuais, sem prometer endpoint novo.
- **Navegação:** o mesmo AppShell/Drawer serve a todos; o que muda são destinos, conteúdos, ações e prioridades conforme perfil combinado com autorizações existentes. O início contextual do terceiro perfil deve priorizar Rotina e poucos toques para reportar, enquanto o Responsável pode acessar programação em Medicamentos/Consultas no menu lateral. Não renderizar itens vazios ou indisponíveis; o backend continua exigindo permissão em cada operação.
- **Vocabulário aprovado por Produto:** **Integrante** substitui **Colaborador** como rótulo do terceiro perfil de experiência na interface e nos textos funcionais. É nome de participação operacional, **não indica parentesco**. Em convites e identificação, preservar o vínculo específico **familiar** ou **colaborador(a) externo(a)/contratado(a)**. Não renomear enums/roles técnicas nem ampliar permissões por consequência do rótulo.
- **Limites que continuam exigindo decisão de Produto:** conceder ao Integrante upload de exames ou registros de observação não autorizados hoje; ampliar relatórios de administrador; criar permissões, endpoints ou obrigações de dados. A aprovação do rótulo **não autoriza** novas capacidades. Consultar Produto e Arquitetura somente diante de lacuna efetiva.

**Direção visual aprovada em 2026-11-17:** usar a **visão do Integrante como referência de simplicidade** para a plataforma inteira. Para Integrante, começar pela Rotina contextual da pessoa acompanhada com cartões de horário/estado/ação e registro em poucos toques; **nenhum cadastro, administração ou configuração** em sua experiência padrão. Para Responsável, preservar a mesma Rotina limpa, disponibilizando Medicamentos, Consultas e outras configurações autorizadas exclusivamente em destinos do menu lateral contextual, e não em cartões adicionais da Rotina. Para Administrador, priorizar pessoas, convites, vínculos e relação quem acompanha quem, sem inferir acesso a conteúdo sensível. Para a própria Vovó com conta, priorizar leitura e relato de sua rotina conforme autorização, **sem novo perfil administrativo**. Se houver responsabilidades acumuladas, compor apenas ações efetivamente autorizadas, evitando telas duplicadas.

**Microinterações aprovadas:** observações de apoio são opcionais, curtas e contextuais; não exigir relato de turno nem justificativa por ausência de marcação. Relatos sobre medicamentos só alteram estado após confirmação explícita e sucesso real da persistência; falhas deixam a ocorrência sem confirmação. Anexos/exames somente quando operação e escopo estiverem previstos e autorizados. A orientação aprovada é de **design**, não prova de implementação ou homologação de UX no aplicativo.

**Critérios de aceite de UX:** comparar as mesmas jornadas com três contextos de autorização; o terceiro perfil consegue registrar uma ocorrência com poucos toques e sem ver cadastros; Responsável encontra configurações somente no contexto adequado; Administrador gerencia família sem exposição de conteúdo sensível; estados de falha de gravação e permissões revogadas permanecem corretos.

### 4.5 Consultas e exames — direção UX aprovada em 2026-11-17

- **Uma única área no menu lateral contextual:** `Consultas e exames`, com itens visualmente distinguíveis por ícone, rótulo, data e estado. Não criar vários menus para recursos pequenos nem exibir cadastros permanentes na Rotina.
- **Listar antes de cadastrar:** mostrar compromissos e exames autorizados de modo conciso; tocar um item abre detalhes. Ações de agendar/editar/cancelar/concluir ficam disponíveis no contexto de **Responsável** legitimamente autorizado, não repetidas em cada cartão.
- **Agendamento mínimo:** descrição ou especialidade, data e horário; demais detalhes opcionais. Escolha fácil de hora cheia como padrão visual, com possibilidade de horário exato sem arredondamento caso a consulta esteja marcada em minutos específicos. Não duplicar informações nem pedir dados clínicos desnecessários.
- **Exame:** descrição obrigatória; data e arquivo opcionais conforme CUI-F06, vínculo à consulta se disponível. Exibir arquivos apenas quando autorizados; não interpretar resultados nem tratá-los como orientação clínica.
- **Integrante:** ver somente compromissos pertinentes à pessoa acompanhada e ações de registro/anexo **se já previstas e autorizadas**, sem controlar agendamentos nem acessar documentos sensíveis por presunção. Envio de exames/observações por esse perfil exige confirmação de operação autorizada e contrato existente; este aceite de UX não concede uma nova permissão.
- **Administrador:** não recebe automaticamente acesso a consultas, exames ou anexos pelo papel administrativo.
- **Estados de persistência:** nunca exibir conclusão de upload/agendamento sem confirmação do servidor; oferecer erro compreensível, sem duplicar registro ao tentar novamente.

**Próximo desenho:** validar cadastro de consulta e fluxo contextual de anexo de exame, comparando Responsável e Integrante, antes de implementar.

## 5. Regras de interação reutilizáveis

1. **Ação mais frequente primeiro**; revelar configuração e campos opcionais sob demanda, com rótulos explícitos.
2. Cartão de ocorrência de medicamento inteiro clicável; o toque **abre opções**, nunca registra sozinho. Em celular, preferir painel inferior (`Drawer`), preservando cancelamento, foco, retorno de foco, tecla Escape, leitura por tecnologia assistiva e fallback em desktop.
3. Para registro de medicamento, mostrar claramente nome/horário e escolhas **Informou que tomou**, **Informou que não tomou** e **Cancelar**. `Sem confirmação` é ausência de relato, não julgamento de falha. Não oferecer instrução de dose nem inferir tratamento.
4. Após enviar operação, mostrar andamento e impedir reenvios acidentais. **Só mostrar sucesso após persistência confirmada**; falha deve ser explícita e manter os dados digitados. Em incerteza de rede, não afirmar que foi salvo.
5. Estados: carregamento legível sem salto excessivo; vazio com mensagem contextual e próximo passo autorizado; erro com recuperação possível; sucesso discreto e claro.
6. Campos com rótulo persistente, tipo correto, ajuda breve se indispensável, validação junto ao campo; formulário de criação não permanece aberto quando não é ação principal.
7. Mensagens: linguagem familiar, direta, respeitosa; evitar `FF-04`, `FAM-R10`, `ACE-05`, `ADR-009`, UUID, token bruto e jargão clínico/técnico nas telas normais.
8. O usuário só visualiza informações e ações autorizadas. Não mostrar cartão, resumo, prévia, indicadores, anexos ou avisos sensíveis sem autorização. Não presumir direitos pelo vínculo ou perfil administrativo.
9. Comunicação sem cobrança, pressão ou punição; não usar vermelho/âmbar para ausência de registro sem erro real.
10. A navegação deve permitir retorno ao contexto da **pessoa**; não direcionar arbitrariamente todo histórico para o módulo de cuidados.

## 6. Responsividade e acessibilidade

- Celular: coluna única por padrão, cartões e ações confortáveis, painel inferior para escolhas rápidas; evitar rolagem horizontal.
- Desktop: largura de leitura controlada; grades de cartões quando houver espaço; modais/painéis proporcionais; não transformar todo o produto em dashboard.
- Considerar 320px, 375px, 390px, tablet e desktop; zoom 200%, fontes maiores, teclado, leitor de tela, preferência por movimento reduzido.
- Contraste de texto normal >=4.5:1 e de texto grande >=3:1; foco visível, sem perda de contexto; estado e erro informados por texto e não só cor.
- Conferir rótulos, áreas de toque, ordem de tabulação, fechamento/retorno de foco do Drawer/Modal e mensagens acessíveis.
- Não expor dados sensíveis em notificações de tela bloqueada por padrão.

## 7. Critérios de aceite transversais de UX

- [ ] Pessoas autorizadas são o ponto de partida; administração não compete com rotina.
- [ ] Desktop usa navegação lateral; celular usa Drawer; seção da pessoa selecionada indica somente áreas autorizadas e estado ativo.
- [ ] Gestão familiar está centralizada, sem botões/formulários administrativos repetidos nas áreas de acompanhamento.
- [ ] Informações de autorização exibidas ao administrador não excedem contratos e acessos aprovados.
- [ ] A ação principal de cada tela é reconhecível sem ler instruções técnicas.
- [ ] A Rotina começa por uma única saudação contextual com o nome da pessoa acompanhada, sem repetir “Rotina”, “Hoje” e descrições autoexplicativas.
- [ ] Lista de medicamentos mostra nome/horários/vigência de modo compacto, abre detalhes e concentra ações de gestão autorizadas no medicamento selecionado, sem botões destrutivos em todos os cartões.
- [ ] Cadastro de medicamento tem seleção única por dose (hora cheia por padrão, opção para hora exata prescrita), sem distribuição automática nem arredondamento; revisão de todos os horários antes da ativação.
- [ ] A entrada de Cuidados mostra apenas a Rotina; Medicamentos, Consultas e Outros cuidados ficam no menu lateral contextual (Drawer global no celular), sem abas duplicadas no conteúdo.
- [ ] Rotina de Cuidados não contém formulários de criação permanentes; cadastro de medicamentos/consultas está no contexto da área correspondente.
- [ ] Registros frequentes são rápidos e sem entrada duplicada; nenhuma explicação ou etapa supérflua obriga a família a alimentar o sistema.
- [ ] Desenvolvimento e módulos similares separam acompanhamento e criação/gestão sem adicionar menus globais redundantes.
- [ ] Ícones semânticos e rótulos tornam as ações e estados distinguíveis; as telas não repetem títulos ou explicações do sistema.
- [ ] Confirmações de Cuidados e Desenvolvimento são visualmente diferentes e preservam regras e feedback de persistência.
- [ ] Operações frequentes requerem poucos passos e evitam redigitação.
- [ ] Cada estado (vazio, loading, erro, sucesso, sem confirmação) é compreensível.
- [ ] Não há feedback de sucesso antes da persistência; erro de rede é explícito.
- [ ] Funciona em celular e desktop e com teclado/leitor de tela; verificar contrastes reais.
- [ ] Componentes e tema são reutilizados; sem CSS arbitrário por tela.
- [ ] Nenhum conteúdo sensível é exibido fora da autorização existente.
- [ ] Não há alteração funcional não aprovada nem registro duplicado para histórico.
- [ ] Revisão visual final com capturas reais + teste com familiares; proposta aprovada não equivale a homologação.

## 8. Governança de decisões

- **Governança:** `docs/produto/GOVERNANCA.md` é a fonte do processo de decisão, com níveis L1/L2/L3 e CT v1.
- **UX autônoma:** cores, tipografia, hierarquia, disposição, rótulos, feedback e interação compatível com regras aprovadas.
- **Produto obrigatório:** nova regra, mudança de permissões ou visibilidade sensível, lógica clínica, frequências, histórico, novas obrigações e funcionalidades.
- Divergência documental/código: especificação funcional prevalece para o comportamento; registrar dependência, não completar regra por suposição.
- Evitar aprovações por detalhe; revisar um conjunto coeso. Preservar esta fonte única, sem duplicá-la integralmente nos documentos de módulo.
