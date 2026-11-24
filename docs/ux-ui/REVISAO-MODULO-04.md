# Revisão UX do Módulo 04 — Histórico, Resumo e PDF

> **REGISTRO HISTÓRICO — NÃO É DEMANDA ATIVA.** Este arquivo registra uma rodada de análise, correção ou homologação anterior à V1 consolidada. Termos como “pendente”, “reprovada” ou “não implementada” descrevem **aquela rodada**, não o estado atual. A V1 está homologada funcionalmente e em testes restritos; consultar `docs/produto/STATUS-E-ESCOPO.md`, a especificação vigente do módulo e o código antes de reabrir trabalho. Não executar este plano por padrão.

**Data** 2026-11-20. **Estado** direção de UX APROVADA pelo responsável do Produto em 2026-11-20; encaminhada para planejamento e implementação.
**Referência** develop @ 64a4a0694d6d370267d8b7ff7d381aa484bec97b.
**Fonte funcional** docs/modulos/04-evolucao-familiar/ESPECIFICACAO.md v1.1.
**Retomada** após aceite humano da simplificação do Módulo 01, registrado em STATUS-E-ESCOPO.md.
A aplicação, os testes e os arquivos PDF não foram executados ou renderizados nesta revisão.

## 1. Proposta concreta de experiência

Preservar Histórico e Resumo no menu contextual da pessoa. PDF é uma ação do Resumo.

| Destino | Composição proposta | Ação principal |
|---|---|---|
| Histórico | Pessoa identificada no contexto, período compacto, acontecimentos agrupados por dia com horário, ícone e descrição humana | Consultar acontecimento; expandir detalhes existentes e autorizados |
| Resumo de Cuidados | Pessoa e período, quatro situações das doses com rótulos legíveis, consultas/exames e observações existentes pertinentes | Consultar resumo; preparar PDF se autorizado |
| Resumo de Desenvolvimento | Experiências, categorias quando existentes, estrelas como incentivo e observações existentes | Consultar experiências; preparar PDF se autorizado |
| Prévia do PDF | Pessoa, período e conteúdo exato que será exportado, com aviso breve de compartilhamento | Baixar PDF após conferência |

**Histórico no celular** — abrir já com os acontecimentos, mais recentes primeiro. Período em controle compacto com opções “Últimos 7 dias”, “Últimos 30 dias” e “Personalizado”, dentro da capacidade efetivamente suportada. A apresentação inicial pode usar período útil sem tornar obrigatório escolher datas. Filtro de área aparece somente quando houver mais de uma área autorizada. Ícones complementam textos. Correções permanecem identificáveis. Não criar novos campos para alimentar o histórico.

**Resumo no celular** — exibir período e conteúdo imediatamente. Para quem acessa duas áreas, manter seções claramente identificadas e os limites de autorização por operação. Exemplo de bloco de Cuidados com dados fictícios: “21 doses previstas”, “18 tomadas informadas”, “1 não tomada informada”, “2 sem confirmação”. Manter a explicação necessária de que ausência de confirmação não significa dose não tomada. Evitar parágrafos que ensinem onde está o menu.

**PDF** — botão “Preparar PDF” somente com capacidade de exportação. Abrir prévia com pessoa, datas e os mesmos dados do arquivo. Exibir “Baixar PDF” após carregamento bem-sucedido. A prévia pode ser a própria tela quando sua seleção corresponder integralmente à exportação; reaproveitar o contrato de prévia existente. A implementação escolhe a composição mais simples após validar a proposta. Conteúdo completo deve continuar em páginas adicionais, sem corte silencioso.

A organização desta seção foi aprovada expressamente pelo responsável do Produto em 2026-11-20, após apresentação de Histórico, Resumo e fluxo Preparar PDF → conferência → Baixar PDF.

## 2. Achados verificáveis na inspeção

| ID | Prioridade | Evidência estática | Encaminhamento |
|---|---|---|---|
| EVO-REV-01 | Alta | historico/page.tsx mantém dois campos de data em destaque e parágrafo sobre uso do menu; resumo/page.tsx repete instruções de navegação | Validar controle compacto de período e retirar texto redundante |
| EVO-REV-02 | Alta | Cartões do histórico exibem data, tipo e resumo, sem ícone nem detalhe expansível; resumo não apresenta datas das consultas embora o payload as contenha | Melhorar legibilidade com dados já disponíveis e detalhes autorizados |
| EVO-REV-03 | Alta funcional | linhasRelatorio inclui c.registros com doses detalhadas, enquanto resumo/page.tsx não renderiza esses registros. O botão baixa o PDF imediatamente e só então mostra o aviso retornado | Reconciliar seleção da prévia e PDF conforme EVO-R05/R10 e seção 5 |
| EVO-REV-04 | Alta funcional | montarPdfMinimo aplica split por linha e slice(0,55), depois slice(0,90) em cada linha; documento tem uma página | Corrigir paginação e quebra de linha, validando completude, acentos e texto longo |
| EVO-REV-05 | Alta funcional | resumo usa listarDiasIso(de,ate,62), que termina ao alcançar 62 dias sem sinalizar; consultas/exames usam take 20; experiências take 40 e doses detalhadas take 50 | Evitar resumo parcial apresentado como total; separar totais do período e listagem paginada conforme especificação |
| EVO-REV-06 | Alta autorização/UX | Botão Exportar PDF aparece com conteúdo, sem consulta explícita da capacidade de exportar. Servidor exigeExportacao permanece presente | Representar capacidade efetiva e testar acesso por domínio e operação, inclusive conta com Cuidados/Integrante e Desenvolvimento/Responsável |
| EVO-REV-07 | Alta confiabilidade | Requisições dependem diretamente das datas e pessoaId, sem descarte explícito de respostas antigas; podeVer interpreta autorização pelo prefixo textual da mensagem de erro | Testar troca rápida de pessoa/período e perda de acesso; usar estado explícito e impedir resposta antiga de preencher contexto novo |
| EVO-REV-08 | Média funcional | Resumo de Cuidados não consulta/retorna observações de apoio na função resumo; especificação prevê observações e mudanças de programação pertinentes | Conferir cobertura dos registros existentes e apresentar os itens previstos sem duplicação |

Os limites de take e 62 dias são observados no código. Seu efeito prático precisa de fixtures que ultrapassem cada limite. As condições de corrida e autorização por combinação de domínios são riscos a testar, sem conclusão de vazamento reproduzido nesta revisão.

O cabeçalho do PDF usa pessoaId, estados técnicos e datas ISO. O nome compreensível da pessoa, rótulos e datas locais devem ser utilizados na apresentação ao usuário, mantendo identificadores técnicos apenas onde necessários ao diagnóstico.

## 3. Encaminhamento entre áreas

**UX/Produto** — validar a composição de Histórico, Resumo e prévia acima antes de iniciar o redesenho.

**Arquitetura/Qualidade** — avaliar EVO-REV-03..08 como aderência aos requisitos já aprovados. Prévia fiel, PDF completo, totais corretos e autorização contextual já são exigidos na especificação v1.1. A menor correção compatível pode ser planejada sem reabrir esses requisitos. Caso a solução proponha restringir período aceito, excluir dados antes previstos ou ampliar exportação, encaminhar a mudança funcional ao Produto.

**Esteira** — após validação da experiência, rotear demanda delimitada com os achados aplicáveis e respectivas evidências. Preservar o aceite dos módulos anteriores e executar regressão conforme impacto. Não marcar esta revisão como homologação de tela implementada.

## 4. Critérios de validação

- Familiar identifica de quem são os dados e o período em Histórico, Resumo e PDF.
- Consegue entender os quatro estados de doses sem julgamento ou inferência clínica.
- Encontra experiências, categorias e observações já existentes, inclusive sem categoria.
- Prévia e PDF têm a mesma seleção autorizada e conteúdo completo.
- Amostras excedem 55 linhas, 90 caracteres e os limites de listagem existentes; período excede 62 dias ou recebe tratamento explícito compatível com o requisito aprovado.
- Alterações de programação no mesmo dia e vigências históricas não distorcem contagens.
- Integrante, Responsável, acesso próprio e administrador têm suas capacidades respeitadas em tela, URL, API, prévia e PDF.
- Revogação, falha de rede e troca rápida de contexto não mostram dados anteriores como resposta atual.
- Mobile, desktop, teclado e foco são verificados. Aceite humano registrado após entrega.

## 5. Arquivos consultados

- docs/modulos/04-evolucao-familiar/ESPECIFICACAO.md
- docs/ux-ui/DIRETRIZES-PROXIMOS-MODULOS-E-EXECUCAO.md
- docs/produto/STATUS-E-ESCOPO.md
- apps/web/src/app/pessoas/[pessoaId]/historico/page.tsx
- apps/web/src/app/pessoas/[pessoaId]/resumo/page.tsx
- apps/api/src/cuidados/servico-acompanhamento.ts

**Próxima ação** planejar e implementar as correções com base na direção de UX aprovada e nos requisitos funcionais v1.1, depois executar testes e nova homologação humana.

## 6. Aprovação de Produto e plano de execução — 2026-11-20

**APROVADA expressamente pelo responsável do Produto**, em resposta à organização proposta na revisão. A aprovação cobre Histórico agrupado por dia com período compacto; Resumo contextual por pessoa e áreas autorizadas; PDF com preparação, conferência e download. O escopo técnico corrige os achados EVO-REV-01..08 em aderência à especificação funcional v1.1.

**Situação** direção de UX aprovada e documentada, implementação e homologação humana da nova entrega pendentes. Base documental da aprovação develop @ c75800f0e14090434a71a5f038ec2cf09ac1f9d5. A revisão estática anterior permanece como evidência dos achados, sem nova execução de testes nesta atualização.

### Ordem recomendada para a esteira

| Etapa | Escopo | Resultado verificável |
|---|---|---|
| 1 — Contratos e completude | EVO-REV-03/04/05/06/08 | Mesma seleção autorizada na prévia e PDF; arquivo completo; totais corretos no período; cobertura dos registros previstos |
| 2 — Experiência | EVO-REV-01/02/07 e integração com a etapa 1 | Histórico legível, filtros compactos, resumo contextual, exportação autorizada e troca segura de pessoa/período |
| 3 — Validação integrada | Critérios da seção 4 | Evidências técnicas e visuais, regressão por impacto, verifier e entrega para aceite humano |

Usar `task-routing` para reconciliar o workspace com a develop e registrar a demanda. O conjunto envolve API, web, geração de PDF e autorização; `module-planning` deve decompor os incrementos quando necessário, reaproveitando o módulo existente. Em seguida executar `implementation-workflow` e `quality-gate`.

Confirmar os contratos e as capacidades existentes antes de editar. Priorizar a menor solução que satisfaça os requisitos aprovados. O contrato de prévia existente é ponto de partida; a apresentação deve permitir conferir a seleção inteira, inclusive itens de páginas posteriores. Totais do período devem refletir todos os registros pertinentes mesmo quando a listagem for paginada. A geração do PDF deve cobrir o conteúdo selecionado com paginação e quebras legíveis.

Testes de regressão devem incluir limites anteriores de 55 linhas, 90 caracteres e 62 dias, dados além dos limites de listagem, vigências e correções, conteúdo de prévia/PDF, combinações de autorização, revogação e troca de contexto. Usar dados fictícios e registrar evidências de mobile/desktop e acessibilidade. As suítes existentes devem ser reaproveitadas e complementadas para regressões concretas.

A aprovação desta direção permite avançar ao planejamento e à implementação compatível. Restrição funcional de períodos, retirada de conteúdo previsto ou ampliação de permissões exigem encaminhamento próprio. O aceite humano da tela implementada será solicitado após a entrega técnica.

## 7. Homologação humana APROVADA — 2026-11-21

O responsável pelo Produto informou expressamente que as atualizações foram feitas e a homologação humana foi aprovada. Aceite da entrega `DEM-M04-EVO-REV-20261121`, abrangendo as correções EVO-REV-01..08 e a experiência de Histórico, Resumo e PDF. Critério humano `EVO-REV-HOM` APROVADO.

Referência disponível develop @ `2bafbc560cfedc9483151b4dfaaef12b443c0a94`. O aceite foi comunicado pelo responsável nesta conversa. Esta atualização não reexecutou a aplicação nem testes. Os resultados técnicos permanecem conforme a esteira, inclusive a distinção de verifier oficial bloqueado e verificação independente via shell.

O responsável também declarou a V1 homologada, com disponibilização para uso adiada e continuidade na evolução das lacunas. Fonte consolidada da baseline e do próximo encaminhamento em `docs/produto/STATUS-E-ESCOPO.md`; política de dados de desenvolvimento no Documento Mestre §13.
