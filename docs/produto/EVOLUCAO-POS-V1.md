# Plano integrado de evolução pós-V1

**Versão:** 2.2 — cadastro inicial pela interface; e-mail sem envio de mensagem  
**Data de referência:** 2026-11-21  
**Base desta aprovação e planejamento:** `develop` @ `9193f1660ec2fa06ebdd19d633cc83b86e3a828e`  
**Estado:** direção integrada e sequência E1–E7 **APROVADAS pelo responsável do Produto em 2026-11-21**, por concordância expressa com a recomendação apresentada sobre a v2.0. Regras particulares de cada entrega ainda precisam de especificação; envio de dados pessoais à IA, regras clínicas e pontuação digital continuam **NEEDS_DECISION**. E1 possui recorte funcional no Módulo 01 v1.8 e planejamento na esteira; boas-vindas/cadastro aprovados após reprovação humana da entrada.  
**Baseline:** a V1 homologada permanece preservada em `STATUS-E-ESCOPO.md`; este plano não declara implementação nem homologação das evoluções.

## 1. Objetivo e condução

Ampliar a plataforma para apoiar rotinas de cuidado e experiências de desenvolvimento de crianças, adultos e idosos, com acompanhamento individual e familiar, preparando uso por outras famílias.

O responsável solicitou apoio consultivo ativo para organizar a visão, sugerir soluções e conduzir a evolução. A abordagem combina Produto, Arquitetura, UX, qualidade e referências de saúde/educação. Decisões funcionais novas devem receber status e fonte próprios. A aprovação abrange a direção, os limites e a ordem de trabalho deste plano. Números sugeridos de catálogo, quantidade final de jogos, payloads, tecnologias candidatas e regras específicas ainda são detalhamentos sujeitos ao fechamento de cada entrega. Ela autoriza preparar a E1 e não declara as evoluções implementadas.

**Repriorização confirmada pelo responsável:** tratar estas novas frentes antes das propostas de desativação/reativação e seletor de vínculos registradas em REVISAO-MODULO-01-ACESSOS.md. Essas propostas ficam adiadas. A visão anterior da V1 e suas limitações pertencem àquela baseline; o presente documento trata das mudanças pós-V1.

Princípios continuam sendo registro mínimo, organização sem cobrança, pessoas no centro, acessibilidade, privacidade e simplicidade. O sistema deve funcionar de forma útil com registros estruturados e conteúdos aprovados durante indisponibilidade da IA.

## 2. O que o repositório já oferece

| Base inspecionada | Uso na evolução | Mudança necessária |
|---|---|---|
| Familia, Pessoa e familiaId em autorizações/convites/anexos | Estrutura inicial de isolamento | Completar operação de múltiplas famílias e seus testes |
| Usuario tem pessoaId único; Pessoa tem uma familiaId; sessão retorna essa família | Conta pessoal vinculada a uma única família, conforme decisão de Produto | Reutilizar essa relação e fechar URL, autenticação e isolamento por família |
| Cuidados com consultas, exames, anexos e histórico | Organizar visualização dos documentos e contexto | Conferir contratos, prévia, datas e resumo por área |
| Biblioteca de atividades reais, categorias, participações e estrelas | Base para variedade de atividades e histórico | Idade sugerida, curadoria e origem dos itens |
| Resumo e PDF do Módulo 04 homologados na V1 | Base comum de acompanhamento | Evoluir leitura por área e sugestões opcionais |
| Autorizações contextuais e três experiências do MVP | Reutilizar operações e limites existentes | Separar participação na família, pessoa-alvo, área e capacidade |

A inspeção foi documental e estática. A presença de familiaId e de verificações existentes não demonstra uma operação multitenant completa ou uma auditoria dinâmica de isolamento.


### 2.1 Leitura integrada da evolução desejada

As ideias formam uma evolução coerente quando tratadas como cinco capacidades relacionadas, e não como telas independentes:

| Capacidade | Resultado para a família | Decisão de desenho |
|---|---|---|
| Espaço familiar | Cada família usa seu próprio contexto no mesmo sistema | Conta pessoal pertence a uma única família; URL e servidor concordam sobre a família |
| Cuidado compreensível | Exames ficam fáceis de abrir e o histórico gera uma visão factual | Visualizador e resumo funcionam antes de qualquer IA |
| Desenvolvimento variado | A pessoa recebe opções reais e digitais adequadas ao contexto | Catálogo finito, curado e renovável, sem busca aberta durante o uso cotidiano |
| Resumo da pessoa | A família entende o que ocorreu e pode escolher próximos passos | Evoluir o Módulo 04, sem criar uma segunda base de histórico |
| Gestão simples | Fica claro quem acompanha quem e em qual área | Papéis compreensíveis na interface; capacidades continuam validadas no servidor |

A arquitetura de informação permanece centrada na pessoa. “Cuidados”, “Desenvolvimento” e “Resumo” são áreas da pessoa selecionada; “Gerenciar família” é uma área administrativa separada. Conteúdo global reutilizável, como modelos de atividades e jogos, não contém dados pessoais. Execuções, documentos, análises e escolhas permanecem privadas na família.

### 2.2 Limites que protegem a proposta

- O produto apoia cuidado e desenvolvimento; não se apresenta como prontuário, diagnóstico, teste de inteligência ou substituto de profissional.
- Resumo por área significa inicialmente **área do produto utilizada pela pessoa** — Cuidados e/ou Desenvolvimento. Especialidade médica pode existir como metadado de consulta/exame, sem virar uma nova hierarquia obrigatória.
- O sistema não exige registros extras apenas para alimentar gráficos ou IA.
- Internet e IA ajudam na preparação de candidatos de catálogo; o aplicativo cotidiano consome conteúdo previamente validado.
- A IA acrescenta uma camada opcional. Registros, resumos factuais, biblioteca aprovada e jogos continuam úteis quando ela estiver indisponível.
- Evolução não é sinônimo de aumento de uso. O sucesso é a família compreender e agir com menos esforço, sem sequência diária, ranking ou cobrança.

## 3. Famílias, contas e navegação

### Direção recomendada

Um PostgreSQL compartilhado, com dados privados escopados por família e relações verificáveis. Manter monólito modular.

URL sugerida na web:

```text
/f/familia-barcelos/pessoas/{pessoaId}/cuidados
/f/familia-barcelos/pessoas/{pessoaId}/desenvolvimento
/f/familia-barcelos/pessoas/{pessoaId}/resumo
```

O slug legível resolve a família por identificador interno estável. Ele seleciona contexto; o servidor verifica participação atual e autorização para a operação. Trocar slug, pessoaId, anexoId ou relatório na requisição deve passar pelas mesmas verificações.

**Decisão de Produto aprovada em 2026-11-21:** cada conta pessoal pertence a uma única família. A fonte funcional é `docs/modulos/01-fundacao-familiar/ESPECIFICACAO.md` v1.6, FUN-08. A credencial permanece pessoal e sua sessão atua exclusivamente naquele espaço.

| Conceito | Responsabilidade |
|---|---|
| Conta pessoal | Identidade autenticada vinculada a uma família |
| Pessoa acompanhada | Registros e histórico no contexto dessa família |
| Vínculo familiar/externo | Relação da pessoa com o núcleo |
| Autorização contextual | Pessoa-alvo, área e operações permitidas dentro da mesma família |
| Acesso próprio | Associação da conta à pessoa acompanhada na mesma família |

**Fluxo de entrada** URL da família → autenticar conta daquela família → pessoa/área autorizada. URL de referência `/f/{slug}/entrar`. Após autenticação, conservar a entrada direta no contexto único ou a escolha de pessoas/áreas daquela família, conforme regras já aprovadas.

A conta tem um único contexto familiar. O acesso a outra URL familiar exige autenticação válida para aquela família e não reutiliza os direitos da conta anterior. A seleção de pessoas/áreas ocorre dentro da família da sessão.

A proposta anterior de conta global com múltiplas participações foi substituída por esta decisão explícita. O modelo vigente Usuario → Pessoa → Familia é o ponto de partida para a solução mínima. Uso individual pode começar com espaço de uma pessoa e o mesmo modelo de família.

**Primeiro piloto** duas famílias fictícias, cadastro inicial pela interface e convites administrados. A regra de cadastro passou a integrar a correção E1 conforme Módulo 01 v1.8 §14. Cobrança, planos comerciais e publicação para uso continuam fora desta etapa.

**Critérios técnicos iniciais** isolamento de banco, anexos, prévias/PDF, busca, cache se houver, rotinas agendadas e solicitações de IA. A API deve verificar família em todas as operações e relações entre entidades. A escolha de RLS ou outro reforço pertence à análise arquitetural, conforme riscos e capacidade operacional.


### Fechamento recomendado para a primeira entrega

**Atualização aprovada após homologação reprovada:** a criação inicial passa a ocorrer pela interface de boas-vindas em / ou /f, com nome da família, nome do titular, e-mail e senha. A proposta anterior de provisionamento exclusivamente privado está substituída. O utilitário existente pode permanecer para desenvolvimento. A confirmação entrega o endereço real da família para copiar/acessar, sem envio de e-mail nesta etapa. Regras canônicas no Módulo 01 v1.8 §14.

Detalhamento de E1 a aplicar à direção aprovada, preservando o catálogo de acessos atual:

- preservar a unicidade global de e-mail já existente no schema; esta entrega não introduz contas homônimas em outras famílias;
- tratar o slug como endereço estável e não como identificador de autorização;
- não oferecer seletor de famílias, pois a conta possui um único contexto familiar;
- impedir que renomear a família altere automaticamente o slug;
- apresentar mensagem de acesso inválido sem revelar se outra família, pessoa ou documento existe;
- criar a nova família e sua primeira administração no mesmo fluxo consistente, sem permitir escolher ou alterar uma família existente;

A URL melhora orientação e identidade do espaço. Ela nunca é a única barreira de isolamento. Família precisa acompanhar banco, armazenamento de arquivos, geração de PDF, rotinas agendadas, logs operacionais, cache, exportações e solicitações de IA.

## 4. Organização da experiência

A entrada cotidiana continua centrada em pessoa e áreas utilizadas. O Resumo passa a responder “o que foi registrado e o que merece acompanhar neste período”, com fatos e datas.

| Área | Destinos propostos |
|---|---|
| Cuidados | Rotina, Medicamentos, Consultas e exames, acesso ao resumo contextual |
| Desenvolvimento | Biblioteca com Atividades reais/Jogos digitais, participações/recompensas existentes, acesso ao resumo contextual |
| Evolução | Resumo e Histórico, com filtro por área autorizada; PDF no Resumo |
| Gestão | Família, pessoas, participantes, convites e acessos |

Cada destino exige conteúdo e capacidade efetiva. A mesma fonte de resumo pode ser acessada pelo contexto da área e pela Evolução, preservando dados e evitando telas duplicadas.

Interface para criança/idoso deve usar linguagem adequada à pessoa, botões confortáveis, contraste, instruções curtas e ritmo ajustável. Adultos e idosos recebem tratamento visual respeitoso. Na criança sem conta, o responsável pode abrir uma sessão de jogo supervisionada; a política de acesso e os controles dessa sessão precisam de especificação.


### Jornadas principais propostas

1. **Entrada pela família:** abrir `/f/{slug}/entrar`, autenticar uma conta daquela família e seguir para a única pessoa/área útil ou para “Nossa família” quando houver mais de uma opção.
2. **Rotina de cuidado:** selecionar a pessoa, abrir Rotina e registrar o acontecimento em poucos toques; configurações continuam fora da rotina.
3. **Consulta de exame:** abrir Consultas e exames, selecionar um item e visualizar PDF/imagem no contexto, com data, descrição, origem e ação de baixar quando autorizada.
4. **Escolha de experiência:** abrir Desenvolvimento, alternar entre Atividades reais e Jogos digitais, receber poucas opções relevantes e renovar apenas as sugestões disponíveis.
5. **Compreensão do período:** abrir Resumo, escolher período e ver fatos por área. Uma ação separada pode gerar sugestões ou resumo assistido quando a funcionalidade estiver habilitada e autorizada.
6. **Gestão:** abrir Gerenciar família, entender participantes, pessoas acompanhadas, área e responsabilidade sem editar uma matriz técnica de operações.

O desenho detalhado de estados, componentes, acessibilidade e homologação humana está proposto em `docs/ux-ui/PROPOSTA-EVOLUCAO-POS-V1.md`.

## 5. Cuidados, exames e IA

### Primeira entrega útil

Lista de exames com descrição, data quando conhecida, vínculo opcional a consulta e ação autorizada de abrir arquivo privado. Visualizar PDF/imagem em contexto, com retorno à lista e tratamento de arquivo indisponível. Não exigir que a família transcreva resultados para obter a função de visualização.

Resumo de Cuidados deriva de medicamentos/programações, relatos, consultas, exames e observações. A interface identifica a data das informações. A existência de exame sem valor estruturado indica documento disponível, e não resultado laboratorial interpretado.


### Experiência do visualizador e resumo factual

O visualizador deve priorizar celular, suportar PDF e imagem, oferecer zoom e troca de página quando aplicável, indicar carregamento/erro e permitir voltar ao item sem perder o contexto. Download é uma ação distinta e autorizada. O arquivo permanece privado, com acesso temporário ou resposta autenticada; a interface não expõe endereço permanente.

O primeiro resumo de Cuidados é determinístico e deriva dos registros existentes. Ele organiza acontecimentos por período, mostra datas e estados informados e aponta documentos disponíveis. OCR, extração de valores e interpretação automática ficam fora da primeira entrega. Assim, a família obtém valor sem transcrever laudos e sem depender da qualidade de leitura de imagem.

A apresentação separa:

- **Registros do período:** fatos provenientes dos módulos, com fonte e data.
- **Para conferir:** dados incompletos, documento indisponível ou informação ainda não confirmada.
- **Resumo assistido:** conteúdo gerado sob demanda, visualmente identificado, nunca misturado aos fatos como se tivesse a mesma origem.

### Evolução futura com IA

Começar por resumo assistido para preparar acompanhamento e conversa com profissional. Saída proposta:

- Informações presentes nos documentos e registros, com referência, data e período.
- Mudanças observadas entre registros comparáveis.
- Informações incompletas ou incertas para conferência.
- Perguntas sugeridas para a próxima consulta.
- Itens sinalizados pelo próprio laudo para conversar com profissional.

As conclusões clínicas e condutas permanecem com profissionais habilitados. A IA deve informar incerteza e relacionar cada observação ao documento-fonte. Classificar uma pessoa como “saudável” exige interpretação além de um exame; um painel verde geral seria uma mensagem inadequada para este produto.

Se houver extração de valores, manter exame original, unidade, intervalo do laboratório, data e validação humana antes de usar o dado em comparação. O resumo inicial pode funcionar apenas com informações confirmadas, com PDF/imagem como fonte acessível.

## 6. Biblioteca limitada de atividades reais

Proposta de catálogo compartilhado de modelos aprovados, sem dados pessoais, e seleção privada de atividades por família/pessoa. Um modelo global não contém o histórico de quem o executou. Atividades personalizadas da família continuam privadas até decisão explícita de publicação.

**Parâmetros E4 aprovados pelo Produto em 2026-11-22, fonte canônica Módulo 03 v1.3 §12**

- Até 24 modelos ativos no catálogo inicial.
- Até 6 sugestões visíveis para a pessoa por vez.
- Atualização apresenta até 3 alternativas para o responsável escolher.
- Conteúdo anterior pode ser arquivado do catálogo ativo, preservando a versão referenciada nas participações.

Os limites 24/6/3 foram aprovados para a primeira entrega E4. Conteúdo arquivado, histórico e atividades personalizadas não compõem o teto de modelos ativos.

Cada modelo deve ter origem, instrução curta, categoria, dificuldade, idade sugerida/faixa, materiais quando necessários e adaptações de acessibilidade/supervisão pertinentes. Idade orienta adequação; interesses e necessidades reais ajudam a escolher dificuldade. O usuário não deve preencher uma avaliação extensa para receber sugestões.

Categorias existentes de memória/atenção, raciocínio, linguagem, criatividade, coordenação e autonomia são ponto de partida. Atividades de convivência e socialização podem ser avaliadas na taxonomia, sem prometer que cada categoria corresponde a um nível de capacidade mensurável.

### Renovação do catálogo

A pesquisa na internet e a IA propõem candidatos a partir de fontes selecionadas. A curadoria confirma adequação, origem e qualidade antes de disponibilizar modelos globais. A atualização pessoal escolhe entre modelos aprovados e pode apresentar sugestões privadas para aprovação do responsável.

O botão recomendado é “Renovar sugestões”. Atualizar troca alternativas da seleção, mantendo atividades escolhidas pelo responsável e o histórico de participações. O sistema deve diversificar também por interesses e convivência, sem insistência automática em categorias pouco registradas.

Versionar conteúdo e aplicar limites de geração/solicitação. Reutilizar o catálogo global reduz chamadas de IA por família. Reprodução de materiais de terceiros deve respeitar licença e direitos de uso.


### Modelo editorial recomendado

O catálogo global passa por estados simples: **Rascunho → Em revisão → Publicado → Arquivado**. Somente Publicado aparece às famílias. Arquivar impede novas sugestões, preservando versões já escolhidas e participações históricas. A função editorial da plataforma é separada da administração de uma família.

O conteúdo pode nascer de autoria própria, fonte aberta compatível ou geração assistida. Antes de publicar, revisar linguagem, segurança, adequação de materiais, acessibilidade, faixa sugerida e licença. Não copiar descrições ou recursos de terceiros sem autorização.

Na experiência da família:

- “Sugestões para esta pessoa” mostra uma seleção pequena.
- “Ver biblioteca” permite explorar o catálogo aprovado.
- “Renovar sugestões” substitui apenas alternativas ainda não escolhidas.
- Atividade escolhida ou personalizada permanece disponível conforme as regras vigentes.
- Histórico referencia a versão executada, mesmo se o modelo global mudar.

Faixa etária orienta a curadoria e a linguagem. Ela não bloqueia automaticamente uma atividade segura quando o responsável entende que há interesse, adaptação ou necessidade diferente. Para idosos, evitar estética infantilizada; para crianças, informar supervisão e materiais quando necessários.

## 7. Jogos digitais e integração

Primeiro piloto sugerido com até três jogos simples, escolhidos entre memória, sequência e labirinto. Validar uso com Laurinha e um adulto antes de estender a idosos e outras faixas. Adultos e idosos precisam de opções apropriadas e acessíveis, sem classificação apenas pela idade.

| Caminho pesquisado | Potencial | Validação necessária |
|---|---|---|
| Simon Tatham’s Portable Puzzle Collection | Puzzles de lógica, versões web JavaScript/WebAssembly e licença MIT | Adequação de jogo, tradução, toque, acessibilidade, versão e evento de conclusão |
| Phaser aberto | Framework 2D com licença MIT para jogos próprios e adaptação de exemplos | Licença de cada exemplo e dos recursos visuais/áudio, integração com a web existente |
| Componentes próprios em React | Jogos muito simples com integração direta | Custo de manutenção e qualidade da interação |

A proposta prefere hospedar a versão avaliada dos jogos dentro da plataforma. Seleção exige publicidade ausente, telemetria controlada, licença adequada, funcionamento em celular e possibilidade de registrar eventos. Plataformas externas gratuitas precisam permitir integração e acesso a resultado verificável. Um iframe sem contrato de eventos é insuficiente para atribuir estrelas de forma confiável.

Licença gratuita reduz custo de licenciamento. Desenvolvimento, acessibilidade, manutenção e infraestrutura continuam compondo o custo.


### Fronteira do jogo digital

Produto e UX apresentam atividades reais e jogos digitais na mesma Biblioteca de Desenvolvimento. Arquitetura mantém seus ciclos diferentes: uma atividade real recebe participação informada por adulto; um jogo possui versão executável, sessão, eventos mínimos e resultado validado.

O piloto deve hospedar a versão aprovada dentro da plataforma, sem anúncios, rastreadores de terceiros ou navegação para fora do contexto familiar. Cada jogo precisa declarar objetivo lúdico, categoria sugerida, faixa orientativa, recursos de acessibilidade, regra de conclusão e regra de estrelas. O sistema registra somente o necessário para continuidade e crédito; movimentos detalhados, padrões de toque e tempo de reação não são coletados sem finalidade aprovada.

Para criança sem conta, um adulto autorizado inicia a sessão no contexto da pessoa e o jogo não oferece acesso a outras áreas. A saída retorna à Biblioteca ou ao Resumo da pessoa. Pausar, abandonar ou perder conexão não gera punição e não é tratado como fracasso de desenvolvimento.

### E5 — Decisão específica de Produto: progressão livre (2026-11-22)

**APROVADO expressamente pelo responsável do Produto:** a progressão nos jogos digitais é **livre**. Qualquer fase publicada e adequada ao jogo fica acessível sem obrigar a concluir as anteriores; a interface pode sugerir a próxima fase de dificuldade gradual, mas não bloqueia outras opções. A pessoa pode repetir qualquer fase. O progresso registra apenas experiências e conclusões legítimas, sem punição por interrupção, sem ranking ou metas de frequência.

**Contexto da direção em discussão, ainda não integralmente aprovado como especificação E5:** jogos complementam atividades presenciais; qualidade visual/interativa intermediária; mais de uma fase por jogo; opções por categoria; incentivo por descobertas/conquistas simbólicas; leitura de evolução pessoal sem diagnóstico e sem estrelas digitais. Proposta inicial a avaliar: três jogos no piloto, seis como variedade-alvo e cinco fases por jogo. Esses números e os critérios de conclusão, conquistas, resultados, catálogo, integração e capacidade de edição ainda exigem detalhamento e validação antes da implementação. O objetivo de **não conceder estrelas digitais** foi manifestado pelo Produto nesta discussão; não alterar tabela ou saldo presencial.

**Não inferir desta decisão:** implementação autorizada da E5, catálogo definitivo, premiação, alteração de autorizações de criança, coleta de métricas granulares, compromisso clínico, homologação da E4 ou publicação em produção. E4-HOM permanece pendente conforme registros da esteira, E3 mantém defeito aberto de anexo. Elaborar critérios de fase experimentada versus concluída e homologar com família antes de desenvolver.

### E5 — Critério de conclusão com ajuda aprovado (2026-11-22)

**APROVADO expressamente pelo responsável do Produto:** uma fase pode ser considerada **Concluída** quando o objetivo próprio do jogo for atingido, **mesmo com dicas ou ajuda de adulto**. Não exigir conclusão independente, registrar erros ou diferenciar conclusão assistida para comparação. A fase **Não explorada** ainda não foi iniciada; **Experimentada** foi iniciada sem objetivo alcançado; **Concluída** alcançou objetivo e permanece registrada mesmo após repetições. Interrupção, pausa ou abandono não geram punição, estrelas ou avaliação clínica. Progresso livre aprovado acima continua válido.

**Proposta adicional em análise, NÃO aprovada por este aceite:** piloto com jogos de Memória de figuras, Complete a sequência e Caminhos e labirintos; cinco fases configuradas por jogo, dificuldade gradual, dicas e retorno positivo, sem estrelas digitais; posterior expansão por categoria. Validar regras de conclusão e variações de cada mecânica, conteúdo por idade, persistência mínima por pessoa e versão de jogo, acessibilidade, UX e registro no Módulo 04 antes de autorizar implementação.

### E5 — Conquistas discretas aprovadas (2026-11-22)

**Decisão expressa do Produto:** incentivo digital por **conquistas discretas**, não por coleção extensa de medalhas, ranking, sequência de dias, metas compulsórias, estrelas digitais ou recompensas materiais. Ao concluir legitimamente uma fase, oferecer confirmação visual breve e acessível; na biblioteca, apresentar progresso pessoal simples (fases experimentadas/concluídas e descoberta de jogos), sem pressão para jogar. Nenhum aviso insistente de retorno ou prêmio por frequência. A fase concluída com dicas ou ajuda recebe a mesma confirmação.

**Limite da aprovação:** não autoriza jogo ou regra de pontuação a ser implementada; quantidade final de jogos/fases e critérios de retenção/resultado continuam em detalhamento. Proposta para análise subsequente: persistir por pessoa e versão do jogo um estado resumido de exploração/conclusão por fase e eventos mínimos de conclusão, reutilizáveis no Módulo 04 sem duplicar o histórico; não coletar movimentos, erros, tempo de reação ou identidade de quem ajudou. Especificar retomada e teste de interrupção/perda de conexão antes de implementar.

## 8. Participação, estrelas e evolução

A participação presencial continua com registro rápido do adulto e tabela vigente. Sessões digitais registram automaticamente pessoa, família, jogo, versão, dificuldade, fase e resultado pertinente, sem coletar movimentos/toques excessivos.

**Exemplo desejado pelo responsável** concluir uma fase de labirinto pode conceder 3 estrelas digitais. O valor é referência de proposta e precisa ser calibrado com o incentivo das atividades reais.

Recomendação inicial é distinguir estrelas reais e digitais por origem na apresentação. Definir explicitamente como cada origem poderá financiar recompensas antes de criar saldo combinado. A tabela atual do presencial permanece na baseline até mudança funcional aprovada. Créditos digitais devem ser decididos pelo servidor, com sessão identificada, validação do evento e idempotência. A política de repetição legítima deve permitir brincar novamente sem transformar reenvio técnico em crédito novo.

Registrar desempenho em jogo como observação contextual. Mesmo progresso no mesmo jogo depende de dificuldade, ajuda, familiaridade e condições de uso. O resumo deve permitir comparar a própria pessoa em experiências semelhantes, sem inferir inteligência, atraso ou saúde cognitiva a partir do placar.


### Recomendação de consistência

Usar um único razão de movimentos de estrelas, preservando em cada crédito a origem `atividade_real` ou `jogo_digital`, a regra aplicada e a versão. A interface pode mostrar a origem separadamente e um total explicável. A possibilidade de gastar estrelas digitais e reais no mesmo catálogo de recompensas permanece **NEEDS_DECISION**; não somar economias silenciosamente.

A tabela presencial já aprovada não muda. Cada jogo digital recebe uma regra curta e versionada. O exemplo de 3 estrelas por fase de labirinto pode ser usado no protótipo, mas vira regra somente após calibrar repetição, dificuldade e equilíbrio com experiências reais. Repetir para se divertir é permitido; conceder novo crédito depende da política explícita do jogo e nunca de reenvio técnico.

## 9. Resumo por área e sugestões assistidas

A entrada de Resumo apresenta apenas as áreas utilizadas e autorizadas. Conteúdo proposto:

| Contexto | Informações úteis |
|---|---|
| Cuidados | Fatos recentes, consultas/exames disponíveis, relatos de medicamentos e observações |
| Desenvolvimento | Atividades reais/digitais por categoria, experiências recentes e progressão comparável dentro dos jogos |
| Continuidade | Sugestões escolhidas e observações posteriores, mantendo histórico |

Exibir “sem registros suficientes” quando pertinente. Quantidade de atividades por categoria informa variedade registrada. Ela não mede a capacidade global da pessoa.

Botão sugerido “Gerar sugestões para o próximo período”, com síntese de quais dados serão utilizados e confirmação autorizada. Para cuidados, “Gerar resumo para acompanhamento” descreve melhor o uso inicial.

Uma geração deve salvar período, referências/versões dos registros-fonte, data, modelo e versão da instrução, resposta, limitações e decisões do responsável. A análise anterior serve para comparação; os registros originais atualizados continuam sendo a fonte. Correções relevantes tornam a síntese anterior desatualizada. Evitar que respostas anteriores da IA sejam sucessivamente tratadas como fatos.

A IA pode propor atividades aprovadas e adaptações. O responsável escolhe o que oferecer. A atualização do catálogo não altera automaticamente metas pessoais, permissões ou rotina. Nenhuma ausência de participação gera obrigação de preenchimento.


### Estrutura visual recomendada

O Resumo individual evolui em camadas, na mesma tela e sem criar uma fonte paralela:

1. **Agora:** poucos acontecimentos recentes que ajudam a pessoa/família a se orientar.
2. **No período:** síntese factual por área utilizada, com estados neutros e links para a origem.
3. **Próximos passos escolhidos:** atividades, consultas ou acompanhamentos que a família decidiu manter.
4. **Análise assistida opcional:** sugestões geradas sob demanda, identificadas por data e dados utilizados.

Evitar semáforo geral “bom/ruim”. Em Cuidados, a linguagem pode distinguir “registrado”, “para conferir” e “conversar com profissional”. Em Desenvolvimento, usar “experiências recentes”, “categorias exploradas” e “ideias para experimentar”, sem medir uma pessoa pela quantidade de registros.

Ao salvar uma análise assistida, a família pode marcar uma sugestão como útil, descartada ou escolhida. Esse feedback organiza a continuidade e não treina automaticamente modelos nem altera diagnósticos. Se os dados-fonte relevantes mudarem, a análise aparece como “gerada antes das últimas alterações”.

## 10. Gestão de papéis

Propor gestão em duas perguntas complementares, mantendo autorização no servidor.

1. Quem participa desta família e quem administra o espaço?
2. Que pessoa cada participante acompanha, em qual área e com quais capacidades do catálogo aprovado?

Administração da família, organização de Cuidados/Desenvolvimento e registro de rotina continuam responsabilidades distintas. Uma pessoa pode acumular responsabilidades expressamente concedidas. Inclusão em família não libera dados clínicos/infantis automaticamente.

Antes de novos seletores, fechar uma tabela pequena de capacidades existentes e das novas operações realmente necessárias. Jogos supervisionados, curadoria global e envio de dados à IA precisam de decisões específicas. Evitar reconstruir um configurador livre de permissões. Quem administra catálogo global é função editorial da plataforma, distinta de quem administra uma família.


### Organização recomendada para a interface

| Experiência | O que a pessoa entende e faz | O que não recebe por presunção |
|---|---|---|
| Administrador | Organiza pessoas, contas, convites e responsabilidades da família | Conteúdo de saúde, desenvolvimento ou relatórios |
| Responsável | Planeja e acompanha uma pessoa em Cuidados e/ou Desenvolvimento | Administração da família fora da autorização concedida |
| Integrante | Participa da rotina e registra operações permitidas | Configuração, programação e documentos sensíveis não autorizados |
| Acesso próprio | Acompanha a si mesmo nas áreas habilitadas | Poder administrativo sobre outras pessoas |

A tela “Acessos e responsabilidades” deve apresentar frases compreensíveis, por exemplo: “Mikaela acompanha Laurinha em Desenvolvimento como Responsável”. Para conceder acesso, o administrador escolhe participante, pessoa, área e uma responsabilidade predefinida. Não expor checkboxes de endpoints nem permitir papel personalizado na primeira evolução.

Uma pessoa pode acumular responsabilidades dentro da sua família. A composição mostra a união das ações concedidas, sem duplicar telas. O backend continua verificando capacidade, pessoa-alvo, área e família em cada operação. Alterar papel ou revogar acesso invalida o uso futuro e preserva autoria/histórico.

## 11. IA, privacidade e custos

Integração automática deve ocorrer na API da plataforma, com chave protegida no servidor e solicitações autenticadas/autorizadas. A cobrança da API OpenAI é separada da assinatura ChatGPT. Planejar orçamento e quota por família, geração sob demanda e reaproveitamento de sínteses quando a base não mudou.

Os controles oficiais da API informam que dados não são usados para treinamento por padrão, mas existem retenções e regras diferentes por recurso. Avaliar configuração e retenção adequadas antes de enviar dados sensíveis.

Propor autorização transparente para envio ao provedor, com finalidade, dados selecionados, retenção e exclusão compreensíveis. Saúde envolve dados sensíveis e crianças/adolescentes exigem proteção compatível com seu melhor interesse. A base legal, o consentimento quando aplicável e as obrigações atuais devem ser revisados antes do uso por outras famílias. Minimizar nome, contato e documento quando desnecessários ao resultado; dados pseudonimizados continuam exigindo proteção.

Conteúdos recuperados da internet e dos documentos devem ser tratados como dados, com extração validada e sem autorizar o modelo a executar comandos ou mudar regras. Para sugestões estruturadas, validar esquema e limites no servidor. Adotar alternativa útil quando IA recusar, falhar ou devolver dados insuficientes.


### Três usos distintos de IA

| Uso | Dados enviados | Risco e ordem recomendada |
|---|---|---|
| Candidatos de catálogo | Tema, faixa orientativa, materiais e critérios genéricos | Menor risco; ainda exige revisão editorial e de licença |
| Sugestões de desenvolvimento | Histórico mínimo autorizado da pessoa e catálogo aprovado | Risco moderado; não diagnosticar nem rotular capacidade |
| Resumo de cuidados | Registros e trechos de documentos de saúde selecionados | Maior risco; exige etapa específica de privacidade, precisão e segurança |

Esses usos não compartilham automaticamente instruções, histórico ou autorização. Cada solicitação mostra finalidade e período; o servidor monta um pacote mínimo, registra fontes/versões e valida uma resposta estruturada. Conteúdo gerado nunca altera medicamentos, agenda, pontos, permissões ou catálogo publicado sem ação humana autorizada.

A primeira implementação pode usar processamento assíncrono persistido no próprio banco/aplicação, com estados solicitado, processando, concluído, falhou e cancelado. Não introduzir microserviço, barramento, banco vetorial ou busca sem evidência de necessidade. Limites de custo e frequência são aplicados por família e caso de uso, com mensagem útil quando indisponível.

## 12. Sequência recomendada

A sequência separa fundação, valor sem IA e usos assistidos. Cada entrega é vertical, homologável e mantém a V1 utilizável.

| Entrega | Escopo principal | Fora da entrega | Evidência para avançar |
|---|---|---|---|
| E1 — Contexto familiar e isolamento | Boas-vindas, cadastro de família/admin, endereço, login contextual e proteção de banco/arquivos/PDF/rotinas | Envio de e-mail, cobrança, seletor de famílias | Raiz → cadastro → login homologados; duas famílias isoladas |
| E2 — Gestão compreensível de acessos | Pessoas, contas, convites e responsabilidades predefinidas por pessoa/área | Papéis personalizados e matriz técnica na UI | Administrador entende quem acompanha quem; três experiências não expõem ações indevidas |
| E3 — Exames e Resumo factual | Visualizador privado PDF/imagem e evolução do Módulo 04 por área utilizada | OCR, interpretação clínica e IA | Uso móvel homologado; prévia, download e resumo respeitam autorização e fonte |
| E4 — Catálogo real curado | Modelos globais versionados, faixa orientativa, curadoria, seleção pequena e renovar sugestões | Busca aberta em tempo real e publicação automática por IA | Responsável encontra/renova opções sem perder escolhas ou histórico |
| E5 — Piloto de jogos digitais | Até três jogos, sessão supervisionada, eventos mínimos e estrelas com origem | Plataforma de jogos ampla, multiplayer e inferência cognitiva | Celular homologado; conclusão, retry e crédito são consistentes; nenhuma publicidade/telemetria indevida |
| E6 — Sugestões assistidas de desenvolvimento | Geração sob demanda usando catálogo aprovado e histórico mínimo, com escolha humana | Diagnóstico, plano automático ou alteração de pontuação | Fontes/período visíveis; recomendações úteis e descartáveis; falha mantém fluxo manual |
| E7 — Resumo assistido de cuidados | Síntese rastreável para preparar acompanhamento e perguntas ao profissional | Diagnóstico, prescrição e automação de conduta | Revisão específica de privacidade/segurança e homologação com documentos controlados |

### Ordem de trabalho dentro de cada entrega

1. Produto fecha objetivo, regras e itens fora do escopo.
2. Arquitetura confirma contratos, dados, autorização, privacidade e estratégia mínima.
3. UX/UI desenha jornadas e estados com as personas afetadas.
4. Desenvolvimento executa a esteira já existente.
5. Qualidade verifica regra, isolamento, acessibilidade e regressão.
6. Homologação humana confirma valor e esforço antes de declarar a entrega concluída.

O planejamento E1 está em `docs/esteira/planejamento/e1-contexto-familiar.md`. Após a reprovação humana da demanda original, a próxima atividade é executar E1-ENT-01 da correção `DEM-E1-ENTRADA-20261121`, conforme Módulo 01 v1.8 §14. A E2 pode ser desenhada em paralelo documental, mas sua implementação depende do contexto familiar estar consistente. E3–E5 podem ser refinadas sem enviar dados pessoais a IA. E6 e E7 exigem aprovações próprias.

## 13. Consolidação por especialidade

| Perspectiva | Contribuição incorporada | Risco bloqueador |
|---|---|---|
| Produto | Resultado por pessoa, catálogo finito, IA opcional e sequência E1–E7 | Transformar visão em muitos recursos sem validar utilidade cotidiana |
| Análise de negócio | Regras por origem, versão, período, autorização e estados explícitos | Termos vagos como “evolução”, “área” ou “bom” produzirem comportamentos diferentes |
| Arquitetura | Monólito modular, isolamento transversal, fontes preservadas e integrações assíncronas simples | Confiar no slug/cliente ou duplicar histórico e permissões |
| UX/UI | Navegação por pessoa, poucas opções, fatos antes de sugestões e papéis em linguagem humana | Painéis densos, formulários extras e mistura entre administração e rotina |
| Cuidados/saúde | Documento original, incerteza, perguntas para profissional e nenhuma conduta automática | Resumo convincente porém incorreto, desatualizado ou sem fonte |
| Desenvolvimento/pedagogia | Atividades lúdicas variadas, idade como orientação e observação contextual | Infantilizar adultos/idosos ou transformar jogo em teste de capacidade |
| Psicologia/bem-estar | Incentivo sem comparação, punição ou obrigação de uso | Estrelas, alertas ou IA virarem cobrança familiar |
| Segurança/privacidade | Mínimo de dados, autorização contextual e separação por família | Vazamento por anexo, PDF, cache, rotina ou geração assistida |
| Qualidade | Matriz por família/persona/área, contratos e homologação humana | Considerar teste técnico verde como prova de utilidade ou segurança clínica |

### Critérios transversais de qualidade

- **Isolamento:** nenhum dado, contagem, arquivo, exportação, evento ou análise cruza famílias.
- **Esforço:** nenhuma evolução obriga recadastro de informação já existente; fluxos cotidianos continuam curtos.
- **Explicabilidade:** estrelas, resumos e sugestões informam origem e regra de maneira compreensível.
- **Acessibilidade:** jornadas principais funcionam por toque, teclado, leitor de tela e ampliação compatíveis com a tecnologia usada.
- **Resiliência:** erro de rede, arquivo inválido ou IA indisponível não produz sucesso falso nem perda silenciosa.
- **Privacidade:** ações administrativas não revelam conteúdo sensível; prévias e agregações obedecem à mesma autorização do detalhe.
- **Homologação:** criança, adulto responsável, pessoa idosa e integrante são avaliados apenas nas jornadas que lhes dizem respeito.

### Direção aprovada e decisões específicas pendentes

| Item | Estado |
|---|---|
| Conta pessoal vinculada a uma única família | APROVADA/DOCUMENTADA |
| Banco compartilhado com isolamento lógico por família e URL contextual | DIREÇÃO APROVADA; recorte E1 em Módulo 01 v1.8 |
| Cadastro inicial pela interface de boas-vindas | APROVADO; substitui exclusividade do provisionamento privado, Módulo 01 v1.8 §14 |
| Gestão por responsabilidades predefinidas, sem papéis personalizados | DIREÇÃO APROVADA; manter combinações da ADR-014 |
| Resumo por área como evolução do Módulo 04 | DIREÇÃO APROVADA |
| Catálogo global curado e seleção privada renovável | APROVADO no recorte E4, Módulo 03 v1.3 §12, limites 24/6/3 |
| Atividades reais e jogos juntos na UX, separados no ciclo técnico | DIREÇÃO APROVADA |
| Estrelas com origem preservada; economia combinada adiada | DIREÇÃO APROVADA; valor/crédito/resgate digital NEEDS_DECISION |
| IA de desenvolvimento antes da IA de cuidados | DIREÇÃO APROVADA |
| Regras clínicas, envio de dados pessoais e estrelas digitais | NEEDS_DECISION por entrega |

**Fonte do aceite:** resposta humana “Concordo com sua recomendação”, após a apresentação do commit `9193f16` e da recomendação de aprovar a direção integrada, reservando pontuação digital, envio de dados pessoais à IA e regras clínicas às respectivas entregas.

O Documento Mestre §15 registra a visão aprovada. A especificação do Módulo 01 v1.8 contém o recorte E1 e a correção de entrada aprovada. As especificações dos módulos 02–04 mantêm suas regras operacionais até o fechamento de cada entrega. Desenhos UX e modelos técnicos ainda candidatos não ganham aprovação detalhada por consequência deste aceite.

## 14. Referências pesquisadas em 2026-11-21

- [Isolamento multitenant — OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Multi_Tenant_Security_Cheat_Sheet.html)
- [Simon Tatham — coleção de puzzles e licença](https://www.chiark.greenend.org.uk/~sgtatham/puzzles/)
- [Phaser — licença do framework aberto](https://phaser.io/download/license)
- [OpenAI — controles de dados da API](https://developers.openai.com/api/docs/guides/your-data)
- [OpenAI — cobrança ChatGPT/API](https://help.openai.com/en/articles/9039756-managing-billing-for-chatgpt-and-the-api-platform)
- [OMS — orientação sobre IA generativa em saúde](https://www.who.int/news/item/18-01-2024-who-releases-ai-ethics-and-governance-guidance-for-large-multi-modal-models)
- [NIA — saúde cognitiva e limites das evidências](https://www.nia.nih.gov/health/cognitive-health-and-older-adults)
- [ANPD — perguntas frequentes sobre dados pessoais](https://www.gov.br/anpd/pt-br/acesso-a-informacao/perguntas-frequentes)
- [LGPD — art. 14, dados de crianças e adolescentes](https://normas.leg.br/?urn=urn%3Alex%3Abr%3Afederal%3Alei%3A2018-08-14%3B13709%21art14_par1)

As fontes de saúde orientam limites de uso, não validam clinicamente esta plataforma. Bibliotecas e jogos são candidatos pesquisados, sem protótipo integrado, teste de acessibilidade ou auditoria de dependências nesta etapa.
