# Módulo 04 — Evolução Familiar

**Versão:** 1.2 — E3, Resumo da pessoa por área, aprovada em 2026-11-22  
**Estado:** base funcional e recorte E3 v1.2 aprovados pelo Produto; desenho E3 aprovado em 2026-11-22 com simplificação para download de exames.  
**Dependências funcionais:** Módulo 01 para pessoas/autorizações; registros de cuidados do 02 e experiências do 03 à medida que existirem.

## 1. Propósito

Permitir compreender a trajetória de cada pessoa com base em acontecimentos **já registrados**, sem pedir informações novamente, criar métricas de produtividade, fazer diagnósticos ou exigir uso diário.

**Duas experiências principais:** (1) **Histórico individual**; (2) **Resumo da pessoa**. A exportação PDF é uma ação do resumo. O **resumo familiar** é apenas um pequeno destaque na página inicial (Módulo 01), não um feed próprio.

## 2. Histórico individual

- Entrada a partir do cartão/perfil de cada pessoa.
- Linha do tempo cronológica de acontecimentos relevantes de cuidados, consultas, exames, atividades educativas, estrelas/conquistas e observações **existentes**.
- Filtro simples por período (padrões úteis e seleção personalizada quando necessário); categoria opcional baseada no domínio de origem, sem classificar novamente cada registro.
- Detalhes expansíveis apenas para usuários autorizados.
- Informações vêm dos registros oficiais dos módulos 02 e 03, sem lançamento em duplicidade.
- Correções nos dados de origem são refletidas na apresentação; preservar rastreabilidade quando apropriado, não replicar prontuários ou dados sensíveis em novos registros.
- Acesso ao histórico de uma pessoa **não significa acesso irrestrito** a tudo sobre ela.
- Sem dados: mensagem neutra, sem inferir ausência de cuidado, aprendizagem ou participação.

## 3. Resumo individual

O resumo é contextual, pequeno e útil. Evitar dashboards genéricos, indicadores de desempenho e gráficos sem ação clara.

### Vovó — cuidados

Quando disponível e autorizado, apresentar no período:
- Doses previstas.
- Tomadas **informadas**.
- Não tomadas **informadas**.
- Sem confirmação (não equivale a não tomada).
- Consultas e exames relevantes.
- Mudanças de programação e observações pertinentes, sem exigir novas notas.

Conservar a diferença entre relato familiar e constatação clínica. Não produzir diagnósticos, parecer de adesão, sugestão de alterar dose ou inferência a partir de números. A contagem precisa considerar as programações e suas vigências históricas, não somente os horários atuais.

### Laurinha — experiências

Quando disponível e autorizado, apresentar:
- Brincadeiras/experiências registradas por período.
- Categorias exploradas, quando existentes.
- Observações livres existentes, sem exigir preenchimento.
- Conquistas e estrelas com a explicação lúdica apropriada.

Não converter estrelas em inteligência, nota, nível clínico ou comparação entre crianças. Não inferir falta de desenvolvimento quando não há lançamentos. Categorias ausentes em brincadeiras personalizadas podem aparecer como **não classificadas**, sem exigir preenchimento retroativo.

## 4. Resumo familiar discreto

A página inicial pode mostrar **poucos acontecimentos** relevantes e autorizados provenientes dos registros já existentes, como uma consulta próxima ou uma conquista compartilhável.

- Não apresentar todas as doses, todas as participações, contagens de dados privados ou um feed infinito.
- Não criar tela de publicação nem preenchimento próprio.
- Critérios simples e previsíveis de relevância, com privacidade por padrão.
- Se nenhum acontecimento adequado existir, não preencher com conteúdo artificial ou mensagens de cobrança.
- A divulgação de conquistas infantis ou dados sensíveis deve respeitar a autorização de compartilhamento; em caso de dúvida, não incluir.

## 5. Relatórios e exportação PDF

**Fluxo único:** pessoa → resumo → período → prévia → exportar PDF.

Tipos contextuais:
- **Vovó:** organização de cuidados, programações válidas no período, doses previstas e estados informados/sem confirmação, consultas, exames e observações já existentes. Deixar claro que os registros são relatos, não prontuário ou diagnóstico.
- **Laurinha:** atividades, categorias disponíveis, participações, conquistas e observações registradas pela família, sem interpretação clínica.

Regras:
- Não redigitar dados para gerar relatório.
- Incluir período e data de geração.
- Prévia e PDF exibem a mesma seleção de informações autorizadas.
- Não inserir receitas, exames ou outros anexos completos por padrão.
- Proteção também na prévia, em agregações, em downloads e nos arquivos PDF gerados; evitar URL pública permanente.
- Não armazenar cópias do PDF indiscriminadamente; geração sob demanda é suficiente no MVP.
- Informar que a família deve cuidar da privacidade ao compartilhar o arquivo exportado.

## 6. Fluxos

**A. Consultar passado:** entrar no perfil → abrir Histórico → navegar e expandir registros autorizados.

**B. Resumo:** abrir Resumo → visualizar o período padrão → escolher outro período apenas se desejar.

**C. Exportar:** Resumo → escolher período → prévia → PDF, sem formulário de relatório.

**D. Início familiar:** entrar na plataforma → ver poucos destaques autorizados → abrir pessoa correspondente, se pertinente.

## 7. Dados: nenhuma nova alimentação

O módulo lê, conforme permissão: pessoa, família, autorizações, dose/programação/consulta/exame/apoio, desafio/participação/estrelas/recompensa e documentos referenciados.

Metadados derivados internamente são permitidos apenas quando necessários à performance, rastreabilidade ou segurança; não são novos campos solicitados à família. A autoria permanece na fonte original.

## 8. Exceções e privacidade

- Autorização revogada: não retornar conteúdos, prévias, contagens, categorias ocultas ou PDF em novas solicitações.
- Registro corrigido: exibir estado correto, sem apagar trilha de auditoria.
- Alteração de horário da Vovó: respeitar vigências no período.
- Ausência de registro: estado neutro; não interpretar como descumprimento ou fracasso.
- Exame/receita com acesso negado: não oferecer link ou detalhes reveladores.
- Falha na exportação: erro claro sem gerar arquivo parcial considerado válido.
- Períodos extensos: resposta paginada para histórico e processamento controlado de relatório.
- Dados de famílias diferentes: isolamento obrigatório em todas as consultas.
- Criança sem conta: histórico pode existir, acessível apenas aos responsáveis autorizados.

## 9. Regras funcionais

| ID | Regra |
|---|---|
| EVO-R01 | Histórico principal é individual, não feed familiar universal |
| EVO-R02 | Resumo individual é pequeno e contextual |
| EVO-R03 | Dados derivados dos módulos; sem alimentação repetida |
| EVO-R04 | Resumo familiar exibe somente poucos destaques autorizados |
| EVO-R05 | Autorizações valem para itens, detalhes, totais, prévia e PDF |
| EVO-R06 | Correções e vigências anteriores são respeitadas |
| EVO-R07 | Sem confirmação de dose não significa dose não tomada |
| EVO-R08 | Estrelas não são medida clínica de desenvolvimento |
| EVO-R09 | Não há ranking, cobranças ou metas de uso do aplicativo |
| EVO-R10 | PDF é ação do Resumo e não módulo administrativo independente |
| EVO-R11 | Não são criados lançamentos exclusivamente para alimentar histórico/resumo |
| EVO-R12 | Sem registros, apresentar mensagem neutra, sem extrapolar |

## 10. Critérios de aceitação

- [ ] Histórico individual é acessível pelo perfil de pessoa autorizada.
- [ ] Filtros simples por período e categoria funcionam sem cadastro adicional.
- [ ] Acontecimentos mostram detalhes apenas conforme autorização.
- [ ] Resumo da Vovó distingue previstos, tomada informada, não tomada informada e sem confirmação.
- [ ] Alteração histórica da programação não distorce contagens antigas.
- [ ] Resumo da Laurinha valoriza experiências e notas opcionais, sem notas clínicas.
- [ ] Atividades personalizadas sem categoria não obrigam recadastro.
- [ ] Resumo familiar contém somente destaques relevantes e permitidos.
- [ ] Contagens, filtros, históricos e PDFs não revelam informação restrita.
- [ ] Correções de origem aparecem corretamente.
- [ ] PDF corresponde à prévia e não inclui anexos sensíveis por padrão.
- [ ] Períodos sem registros exibem estado neutro, sem mensagens de cobrança.
- [ ] Nenhum fluxo cria obrigação de alimentar o histórico ou relatório.
- [ ] Experiência móvel é clara, com poucos controles.

## 11. Fora do MVP

Analytics genérico, dashboards de produtividade, rankings, evolução por nota, interpretação clínica por IA, feed social, publicações manuais, construtor de relatórios, gráficos complexos por padrão, exportações agendadas, informações duplicadas ou formulários de acompanhamento obrigatório.

**Princípio de aceite:** a evolução é vivida pela família; o sistema a torna compreensível sem trabalho adicional.

## 12. E3 — Um Resumo da pessoa, organizado por área

**APROVADO pelo Produto em 2026-11-22**, por aceitação da recomendação de download de exames e resumo factual por área. Evolui as seções 3 e 5, sem criar outra fonte de histórico.

A pessoa possui uma única entrada **Resumo** e período comum de leitura. Apresentar os blocos aplicáveis e autorizados **Cuidados** e/ou **Desenvolvimento**, respeitando contextos efetivos existentes. Não inferir área apenas por parentesco, idade, rótulo de perfil ou presença de contagem. Área autorizada sem registros no período recebe mensagem neutra, sem inferir falta de cuidado/desenvolvimento. “Área” significa área do sistema, não especialidade médica.

- **Cuidados:** estados informados e sem confirmação das doses, consultas, exames, mudanças de programação e observações do período, conforme dados existentes. Documentos disponíveis não são resultados interpretados.
- **Desenvolvimento:** experiências registradas, categorias exploradas, estrelas e observações existentes. Quantidade de registros e estrelas não medem capacidade.
- **Rastreabilidade:** datas e links para registros de origem autorizados. Corrigir origem reflete na leitura; não copiar relatos para alimentar outra base.
- **Exportação:** manter tipos e autorizações vigentes, com prévia e PDF equivalentes para a seleção/tipo escolhido. Não exigir PDF combinado das duas áreas nem incluir anexos completos por padrão.

### Critérios E3 de Resumo

| ID | Aceite |
|---|---|
| E3-RES-01 | Uma entrada Resumo por pessoa, período compreensível e somente blocos aplicáveis/autorizados; nenhuma duplicação de painel/histórico. |
| E3-RES-02 | Cuidados distingue estados informados de ausência de confirmação e mostra consultas/exames/observações com datas e origem, sem inferência clínica. |
| E3-RES-03 | Desenvolvimento mostra experiências, categorias, estrelas e observações já existentes, sem ranking, diagnóstico ou registro extra obrigatório. |
| E3-RES-04 | Vazio no período, erro e permissão alterada têm tratamento neutro; itens, links, totais e documentos não vazam entre pessoas/famílias. |
| E3-RES-05 | Prévia/PDF mantêm a seleção autorizada do tipo escolhido e dados completos; correções/vigências de origem são respeitadas, sem embutir laudos por padrão. |
| E3-HOM | Homologar baixar exame no celular e compreender o período sem redigitar informação, incluindo navegação, retorno e exportação pertinente. |

Fora da E3: IA, semáforo geral de saúde, metas de uso e formulário adicional para alimentar resumo. Desenho em `docs/ux-ui/PROPOSTA-EVOLUCAO-POS-V1.md`, seção E3; plano em `docs/esteira/planejamento/e3-exames-resumo.md`.
