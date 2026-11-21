# Evolução pós-V1 — proposta de produto e sequência de entregas

Data de referência 2026-11-21. Branch develop @ f0a6ca0699cb2f39a8b5b5a59c0d0ab36b6d1e1e.
Estado PROPOSTA de evolução estrutural, com repriorização solicitada pelo responsável do Produto.
A V1 homologada permanece como baseline histórica em STATUS-E-ESCOPO.md.

## 1. Objetivo e condução

Ampliar a plataforma para apoiar rotinas de cuidado e experiências de desenvolvimento de crianças, adultos e idosos, com acompanhamento individual e familiar, preparando uso por outras famílias.

O responsável solicitou apoio consultivo ativo para organizar a visão, sugerir soluções e conduzir a evolução. A abordagem combina Produto, Arquitetura, UX, qualidade e referências de saúde/educação. Decisões funcionais novas devem receber status e fonte próprios. Os detalhamentos deste documento são propostas, sujeitos ao fechamento de escopo por entrega.

**Repriorização confirmada pelo responsável:** tratar estas novas frentes antes das propostas de desativação/reativação e seletor de vínculos registradas em REVISAO-MODULO-01-ACESSOS.md. Essas propostas ficam adiadas. A visão anterior da V1 e suas limitações pertencem àquela baseline; o presente documento trata das mudanças pós-V1.

Princípios continuam sendo registro mínimo, organização sem cobrança, pessoas no centro, acessibilidade, privacidade e simplicidade. O sistema deve funcionar de forma útil com registros estruturados e conteúdos aprovados durante indisponibilidade da IA.

## 2. O que o repositório já oferece

| Base inspecionada | Uso na evolução | Mudança necessária |
|---|---|---|
| Familia, Pessoa e familiaId em autorizações/convites/anexos | Estrutura inicial de isolamento | Completar operação de múltiplas famílias e seus testes |
| Usuario tem pessoaId único; Pessoa tem uma familiaId; sessão retorna essa família | Login atual funciona no contexto da família da pessoa | Separar identidade autenticada de participação em família caso se aprove múltipla participação |
| Cuidados com consultas, exames, anexos e histórico | Organizar visualização dos documentos e contexto | Conferir contratos, prévia, datas e resumo por área |
| Biblioteca de atividades reais, categorias, participações e estrelas | Base para variedade de atividades e histórico | Idade sugerida, curadoria e origem dos itens |
| Resumo e PDF do Módulo 04 homologados na V1 | Base comum de acompanhamento | Evoluir leitura por área e sugestões opcionais |
| Autorizações contextuais e três experiências do MVP | Reutilizar operações e limites existentes | Separar participação na família, pessoa-alvo, área e capacidade |

A inspeção foi documental e estática. A presença de familiaId e de verificações existentes não demonstra uma operação multitenant completa ou uma auditoria dinâmica de isolamento.

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

Para permitir uma cuidadora em duas famílias, ou um adulto que participa de seu núcleo e acompanha um parente em outro, propor conta global e participação contextual:

| Conceito | Responsabilidade |
|---|---|
| Conta | Identidade de login |
| Participação na família | Entrada autorizada naquele espaço e situação da participação |
| Pessoa acompanhada | Registros e histórico sob o contexto de uma família |
| Autorização contextual | Pessoa-alvo, área e operações permitidas |
| Associação para acesso próprio | Relação explícita entre participante e pessoa naquele espaço |

Uma conta pode ter participações independentes. O compartilhamento de identidade não compartilha automaticamente exames ou histórico entre famílias. A opção de uso individual pode começar como espaço com uma pessoa e o mesmo modelo de família, evitando um segundo sistema de acesso.

**Fluxo proposto** login → família única abre diretamente → várias famílias oferecem seleção → pessoa/área conforme permissões. Preservar alternância de contexto e limpar dados em trânsito da família anterior.

**Primeiro piloto** duas famílias fictícias, convites administrados e ingresso controlado. Cadastro público, cobrança e planos comerciais podem receber decisão própria em outra entrega.

**Critérios técnicos iniciais** isolamento de banco, anexos, prévias/PDF, busca, cache se houver, rotinas agendadas e solicitações de IA. A API deve verificar família em todas as operações e relações entre entidades. A escolha de RLS ou outro reforço pertence à análise arquitetural, conforme riscos e capacidade operacional.

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

## 5. Cuidados, exames e IA

### Primeira entrega útil

Lista de exames com descrição, data quando conhecida, vínculo opcional a consulta e ação autorizada de abrir arquivo privado. Visualizar PDF/imagem em contexto, com retorno à lista e tratamento de arquivo indisponível. Não exigir que a família transcreva resultados para obter a função de visualização.

Resumo de Cuidados deriva de medicamentos/programações, relatos, consultas, exames e observações. A interface identifica a data das informações. A existência de exame sem valor estruturado indica documento disponível, e não resultado laboratorial interpretado.

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

**Parâmetros iniciais sugeridos, configuráveis no produto após validação**

- Até 24 modelos ativos no catálogo inicial.
- Até 6 sugestões visíveis para a pessoa por vez.
- Atualização apresenta até 3 alternativas para o responsável escolher.
- Conteúdo anterior pode ser arquivado do catálogo ativo, preservando a versão referenciada nas participações.

Esses números são proposta de densidade, não uma restrição funcional já aprovada.

Cada modelo deve ter origem, instrução curta, categoria, dificuldade, idade sugerida/faixa, materiais quando necessários e adaptações de acessibilidade/supervisão pertinentes. Idade orienta adequação; interesses e necessidades reais ajudam a escolher dificuldade. O usuário não deve preencher uma avaliação extensa para receber sugestões.

Categorias existentes de memória/atenção, raciocínio, linguagem, criatividade, coordenação e autonomia são ponto de partida. Atividades de convivência e socialização podem ser avaliadas na taxonomia, sem prometer que cada categoria corresponde a um nível de capacidade mensurável.

### Renovação do catálogo

A pesquisa na internet e a IA propõem candidatos a partir de fontes selecionadas. A curadoria confirma adequação, origem e qualidade antes de disponibilizar modelos globais. A atualização pessoal escolhe entre modelos aprovados e pode apresentar sugestões privadas para aprovação do responsável.

O botão recomendado é “Renovar sugestões”. Atualizar troca alternativas da seleção, mantendo atividades escolhidas pelo responsável e o histórico de participações. O sistema deve diversificar também por interesses e convivência, sem insistência automática em categorias pouco registradas.

Versionar conteúdo e aplicar limites de geração/solicitação. Reutilizar o catálogo global reduz chamadas de IA por família. Reprodução de materiais de terceiros deve respeitar licença e direitos de uso.

## 7. Jogos digitais e integração

Primeiro piloto sugerido com até três jogos simples, escolhidos entre memória, sequência e labirinto. Validar uso com Laurinha e um adulto antes de estender a idosos e outras faixas. Adultos e idosos precisam de opções apropriadas e acessíveis, sem classificação apenas pela idade.

| Caminho pesquisado | Potencial | Validação necessária |
|---|---|---|
| Simon Tatham’s Portable Puzzle Collection | Puzzles de lógica, versões web JavaScript/WebAssembly e licença MIT | Adequação de jogo, tradução, toque, acessibilidade, versão e evento de conclusão |
| Phaser aberto | Framework 2D com licença MIT para jogos próprios e adaptação de exemplos | Licença de cada exemplo e dos recursos visuais/áudio, integração com a web existente |
| Componentes próprios em React | Jogos muito simples com integração direta | Custo de manutenção e qualidade da interação |

A proposta prefere hospedar a versão avaliada dos jogos dentro da plataforma. Seleção exige publicidade ausente, telemetria controlada, licença adequada, funcionamento em celular e possibilidade de registrar eventos. Plataformas externas gratuitas precisam permitir integração e acesso a resultado verificável. Um iframe sem contrato de eventos é insuficiente para atribuir estrelas de forma confiável.

Licença gratuita reduz custo de licenciamento. Desenvolvimento, acessibilidade, manutenção e infraestrutura continuam compondo o custo.

## 8. Participação, estrelas e evolução

A participação presencial continua com registro rápido do adulto e tabela vigente. Sessões digitais registram automaticamente pessoa, família, jogo, versão, dificuldade, fase e resultado pertinente, sem coletar movimentos/toques excessivos.

**Exemplo desejado pelo responsável** concluir uma fase de labirinto pode conceder 3 estrelas digitais. O valor é referência de proposta e precisa ser calibrado com o incentivo das atividades reais.

Recomendação inicial é distinguir estrelas reais e digitais por origem na apresentação. Definir explicitamente como cada origem poderá financiar recompensas antes de criar saldo combinado. A tabela atual do presencial permanece na baseline até mudança funcional aprovada. Créditos digitais devem ser decididos pelo servidor, com sessão identificada, validação do evento e idempotência. A política de repetição legítima deve permitir brincar novamente sem transformar reenvio técnico em crédito novo.

Registrar desempenho em jogo como observação contextual. Mesmo progresso no mesmo jogo depende de dificuldade, ajuda, familiaridade e condições de uso. O resumo deve permitir comparar a própria pessoa em experiências semelhantes, sem inferir inteligência, atraso ou saúde cognitiva a partir do placar.

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

## 10. Gestão de papéis

Propor gestão em duas perguntas complementares, mantendo autorização no servidor.

1. Quem participa desta família e quem administra o espaço?
2. Que pessoa cada participante acompanha, em qual área e com quais capacidades do catálogo aprovado?

Administração da família, organização de Cuidados/Desenvolvimento e registro de rotina continuam responsabilidades distintas. Uma pessoa pode acumular responsabilidades expressamente concedidas. Inclusão em família não libera dados clínicos/infantis automaticamente.

Antes de novos seletores, fechar uma tabela pequena de capacidades existentes e das novas operações realmente necessárias. Jogos supervisionados, curadoria global e envio de dados à IA precisam de decisões específicas. Evitar reconstruir um configurador livre de permissões. Quem administra catálogo global é função editorial da plataforma, distinta de quem administra uma família.

## 11. IA, privacidade e custos

Integração automática deve ocorrer na API da plataforma, com chave protegida no servidor e solicitações autenticadas/autorizadas. A cobrança da API OpenAI é separada da assinatura ChatGPT. Planejar orçamento e quota por família, geração sob demanda e reaproveitamento de sínteses quando a base não mudou.

Os controles oficiais da API informam que dados não são usados para treinamento por padrão, mas existem retenções e regras diferentes por recurso. Avaliar configuração e retenção adequadas antes de enviar dados sensíveis.

Propor autorização transparente para envio ao provedor, com finalidade, dados selecionados, retenção e exclusão compreensíveis. Saúde envolve dados sensíveis e crianças/adolescentes exigem proteção compatível com seu melhor interesse. A base legal, o consentimento quando aplicável e as obrigações atuais devem ser revisados antes do uso por outras famílias. Minimizar nome, contato e documento quando desnecessários ao resultado; dados pseudonimizados continuam exigindo proteção.

Conteúdos recuperados da internet e dos documentos devem ser tratados como dados, com extração validada e sem autorizar o modelo a executar comandos ou mudar regras. Para sugestões estruturadas, validar esquema e limites no servidor. Adotar alternativa útil quando IA recusar, falhar ou devolver dados insuficientes.

## 12. Sequência recomendada

| Entrega | Resultado | Critério para avançar |
|---|---|---|
| E1 — Famílias, identidade e acessos | Duas famílias isoladas no banco compartilhado, URL contextual, convites e participação | Testes de isolamento e jornadas com contas conhecidas |
| E2 — Cuidados e Resumo | Exames legíveis e resumo por áreas efetivamente utilizadas | Homologação dos fluxos cotidianos |
| E3 — Biblioteca real limitada | Catálogo curado com idade sugerida, categorias e renovação controlada | Responsável escolhe sem excesso de opções |
| E4 — Piloto digital | Até três jogos integrados com sessões e estrelas por origem | Jogo acessível, conclusão e crédito consistentes |
| E5 — Sugestões assistidas de desenvolvimento | Geração sob demanda com registros-fonte, revisão e histórico | Recomendações compreensíveis e dados minimizados |
| E6 — Resumo assistido de cuidados | Síntese rastreável para acompanhamento profissional | Avaliação específica de privacidade, precisão e segurança |

A IA pode ajudar a preparar candidatos de catálogo na E3 com dados genéricos. O envio de histórico pessoal ocorre na entrega específica. As entregas mantêm o sistema útil enquanto integrações futuras são construídas.

**Primeiro trabalho executável de planejamento** especificar E1 e a tabela de capacidades, incluindo criação de família, conta global/participação, associação de pessoa para acesso próprio, escolha por URL e convites. Fechar modelo e critérios antes de implementar rotas. Verificar cada consulta, anexo, exportação e rotina de origem com duas famílias fictícias.

A autonomia solicitada orienta pesquisa, análise, propostas e decomposição. Novas regras estruturais L3, clínica/IA, estrelas digitais e participação de menores devem ser aprovadas explicitamente antes de modificar as especificações vigentes.

## 13. Referências pesquisadas em 2026-11-21

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
