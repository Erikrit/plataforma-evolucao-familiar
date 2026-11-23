# Proposta UX/UI — evolução pós-V1

**Data:** 2026-11-21  
**Base:** `develop` @ `40001ec919604c1665f8a26b75a4d5ea89dc4650`  
**Estado:** direção de Produto E1–E7 APROVADA em 2026-11-21; desenho detalhado de UX/UI permanece PROPOSTA para validação por entrega. A aprovação não comprova implementação, acessibilidade ou homologação.  
**Fonte de visão:** `docs/produto/EVOLUCAO-POS-V1.md` v2.2. Entrada/cadastro aprovados no Módulo 01 v1.8 §14; demais desenhos seguem o estado indicado.

## 1. Objetivo da experiência

Ajudar uma pessoa ou família a se orientar, cuidar e compreender evolução com o menor esforço possível. A navegação continua centrada em pessoas. As novas capacidades entram como extensões dos padrões existentes, sem transformar a plataforma em portal administrativo, prontuário ou catálogo infinito.

Princípios de bloqueio:

- nenhuma tela cotidiana pede informação que já pode ser derivada;
- fatos registrados e conteúdo gerado são visualmente diferentes;
- ausência de registro não produz cobrança;
- administração não compete com rotina;
- criança, adulto e idoso recebem linguagem e apresentação apropriadas;
- ocultar uma ação melhora a interface, mas a autorização continua sendo decidida no servidor.

## 2. Arquitetura de informação proposta

| Contexto | Destinos |
|---|---|
| Geral | Nossa família |
| Pessoa | Rotina quando aplicável, Cuidados, Desenvolvimento, Resumo, Histórico |
| Cuidados | Rotina, Medicamentos, Consultas e exames |
| Desenvolvimento | Biblioteca, Recompensas e Cadastros conforme autorização |
| Gestão | Pessoas, Acessos e responsabilidades, Convites |
| Editorial da plataforma | Catálogo e jogos, fora da gestão de uma família |

No celular, usar o mesmo Drawer/AppShell aprovado. Ao selecionar uma pessoa, manter nome e área visíveis. Não criar uma barra global para Família, outra para Pessoa e uma terceira dentro de cada módulo. Subdestinos aparecem apenas quando existem e estão autorizados.

“Resumo” evolui a área já existente do Módulo 04. “Histórico” continua sendo a linha do tempo derivada. A Biblioteca reúne Atividades reais e Jogos digitais para a pessoa, sem exigir que compartilhem o mesmo fluxo técnico.

## 3. Entrada por família

### Boas-vindas e cadastro — direção aprovada em 2026-11-21

Fonte funcional: Módulo 01 v1.8 §14. A raiz e /f devem oferecer uma entrada útil com “Criar minha família” e “Acessar minha família”. Em /f/criar, apresentar nome da família, nome do titular, e-mail e senha; sugerir o endereço com ajuste opcional e prévia.

Após salvar, exibir confirmação com o endereço real, “Copiar endereço” e “Acessar minha família”. Não aguardar envio de mensagem; não informar que e-mail foi enviado/verificado. Acessar leva ao login contextual. Em caso de erro, preservar campos não secretos e manter senha apenas em memória enquanto o formulário estiver ativo, sem persistência no navegador.

“Acessar minha família” aceita o identificador familiar e leva ao login sem listar famílias. URL inválida oferece tentar novamente ou voltar. Eliminar links fixos para família fictícia; exemplos de ajuda não podem ser atalhos operáveis para dados de desenvolvimento.

Validar este percurso em celular e desktop desde a raiz. A reprovação humana anterior decorreu da entrada sem caminho útil e referências fixas; homologar o fluxo completo, incluindo ausência de contexto, colisão, falha de rede e confirmação.

### Estados

1. URL familiar válida e conta compatível: autenticar e entrar.
2. URL válida e conta de outra família: negar sem informar detalhes sobre a outra família.
3. slug inexistente: mensagem neutra e retorno seguro.
4. sessão expirada/revogada: solicitar nova autenticação e preservar somente o destino não sensível.
5. uma única pessoa/área disponível: entrada direta recomendada.
6. várias pessoas/áreas: mostrar “Nossa família” com cartões autorizados.
7. nenhuma área operacional: explicar que o acesso ainda precisa ser configurado, sem mostrar espaços vazios.

A tela pode usar nome/identidade visual da família quando resolvida com segurança. O slug não aparece como uma escolha de permissão. Não existe seletor para trocar de família.

## 4. Cuidados e exames

### Lista

Combinar consultas e exames no destino aprovado “Consultas e exames”, distinguindo-os por rótulo, ícone, data e estado. Listar primeiro; criar/editar somente em ação secundária autorizada. Filtros devem ser pequenos e opcionais.

### Detalhe e visualização

O detalhe de exame apresenta:

- descrição;
- data, quando conhecida;
- consulta relacionada, quando houver;
- arquivo e estado de disponibilidade;
- autoria/origem compreensível quando útil;
- ações autorizadas de visualizar e baixar.

O visualizador ocupa a maior parte da tela, com fechar/voltar consistente, zoom, páginas quando aplicável, nome do documento, carregamento, erro e retry seguro. Em celular, controles não devem cobrir o conteúdo. Arquivo sem prévia oferece download somente quando permitido e explica a limitação.

Não pedir transcrição, resultado ou interpretação para abrir um exame. Não usar cor verde/vermelha para afirmar estado de saúde.

## 5. Biblioteca de Desenvolvimento

### Navegação proposta para a correção E4 e a E5

**Nossa família** prioriza pessoas e acompanhamentos autorizados. **Desenvolvimento** apresenta uma entrada curta com **Ver biblioteca** como ação principal. O mesmo destino aparece no menu contextual compartilhado no desktop e no Drawer móvel. **Recompensas** e **Cadastros** ficam no nível secundário de Desenvolvimento, com visibilidade por ação autorizada.

```text
Nossa família → Pessoa → Desenvolvimento
                            ├─ Biblioteca
                            │  ├─ Atividades reais
                            │  └─ Jogos digitais → Jogo → Fase → Jogar
                            ├─ Recompensas
                            └─ Cadastros
```

**Biblioteca** abre em **Atividades reais**. A escolha entre modalidades acontece na Biblioteca e preserva pessoa, seção e filtro no retorno de um detalhe. A primeira entrega corretiva oferece o destino real com as funções de E4. A entrada **Jogos digitais** aparece com a primeira jornada jogável e autorizada.

### Atividades reais

- **Explorar** reúne sugestões e catálogo. Mostre nome, categoria e informação que ajuda a escolher. Instruções completas, materiais e supervisão ficam no detalhe, antes da participação.
- **Escolher para experimentar** e **Renovar sugestões** ficam perto das sugestões e aparecem para quem puder organizar. A renovação mostra andamento, troca apenas alternativas elegíveis e confirma a seleção após persistir. A pessoa pode encontrar as escolhas mantidas no mesmo lugar.
- **Executadas** fica dentro de Atividades reais. Acesso à ocorrência e ação **Disponibilizar novamente** seguem as regras de autorização do Módulo 03.
- **Atividades reais** apresenta o saldo de forma compacta perto das brincadeiras. **Recompensas** reúne o detalhe do saldo e as abas **Disponíveis** e **Resgatadas**. **Cadastros** concentra criação e manutenção. A experiência cotidiana usa a confirmação da participação já prevista no guia.

### Jogo digital

| Etapa | Tela e ação principal |
|---|---|
| Descobrir | Até três destaques dentro de Jogos digitais, seguidos do catálogo com **Todas** e filtro por categoria. Usar cartões compactos e um estado vazio simples quando o catálogo ou o filtro estiver sem opções. |
| Escolher | Detalhe com objetivo, controles resumidos e cinco fases abertas. Estados em texto, com indicação discreta de descoberta. O responsável vê o contexto da pessoa antes de entregar o dispositivo. |
| Jogar | Área de jogo com instrução curta, **Dica** e **Sair do jogo** visíveis. A sessão de partida apresenta apenas os controles relevantes e guarda o contexto da pessoa no servidor. |
| Concluir | Confirmar o salvamento após a resposta do servidor. Mostrar reconhecimento breve na primeira conclusão, com opções **Jogar novamente** e **Escolher outra fase**. |
| Interromper ou recuperar | **Sair do jogo** retorna ao contexto do jogo na Biblioteca. Havendo retorno incerto, oferecer **Tentar salvar novamente** com texto claro. Ao reabrir, iniciar a fase do começo e mostrar progresso confirmado. |

No celular, manter saída e dica alcançáveis e testar desde 320 px. Usar alvos confortáveis, foco visível e restituição de foco ao sair, ícones com rótulo e feedback acessível por texto. Controles de teclado e toque devem permitir terminar cada jogo. Cores, imagens e sons têm alternativas perceptíveis. A celebração respeita movimento reduzido e o áudio, quando disponível, começa desligado. [WCAG 2.2](https://www.w3.org/TR/WCAG22/)

Aplicar os mesmos rótulos, toque e feedback nas duas modalidades. Oferecer conteúdo respeitoso e faixa orientativa, inclusive para adultos e idosos. O fluxo de descoberta e as permissões seguem a [especificação do Módulo 03](../modulos/03-desenvolvimento-laurinha/ESPECIFICACAO.md#13-e5--jogos-digitais-na-biblioteca-de-desenvolvimento).

## 6. Resumo da pessoa

A leitura segue esta ordem:

1. período e áreas incluídas;
2. poucos acontecimentos atuais;
3. síntese factual por área;
4. próximos passos já escolhidos;
5. ação opcional de gerar conteúdo assistido.

Cards factuais informam fonte e data e levam ao registro original quando permitido. Estados vazios dizem “Ainda não há registros neste período” e sugerem apenas navegação útil, sem pressionar preenchimento.

### Conteúdo assistido

Antes de gerar, apresentar finalidade, período e categorias de dados que serão usadas. Depois, separar visualmente:

- síntese gerada;
- fontes utilizadas;
- limitações/informações para conferir;
- sugestões ou perguntas;
- data e indicação de desatualização.

Ações possíveis: escolher sugestão, descartar, marcar útil e voltar às fontes. Nenhuma delas é obrigatória. Em Cuidados, usar “Gerar resumo para acompanhamento”. Em Desenvolvimento, “Gerar ideias para o próximo período”. Evitar o rótulo genérico “Avaliar pessoa”.

## 7. Gestão de acessos

### Tela de compreensão

“Acessos e responsabilidades” agrupa por pessoa acompanhada. Cada linha responde:

- quem;
- acompanha qual pessoa;
- em qual área;
- com qual responsabilidade;
- acesso ativo, convite pendente ou revogado.

Exemplo de leitura: “Mikaela acompanha Laurinha em Desenvolvimento como Responsável”. Identificadores técnicos e operações internas não são rótulos principais.

### Concessão

Fluxo em passos curtos:

1. escolher participante/conta da família;
2. escolher pessoa acompanhada;
3. escolher Cuidados e/ou Desenvolvimento;
4. escolher somente combinações já suportadas pela ADR-014: Cuidados com Responsável/Integrante e Desenvolvimento com Responsável;
5. revisar em linguagem natural e confirmar.

Administrador é responsabilidade de organização da família e não uma opção equivalente dentro de Cuidados/Desenvolvimento. Acesso próprio aparece como relação da conta com a própria pessoa, sem conceder administração.

Revogação explica o efeito futuro e preservação do histórico. Dados sensíveis não aparecem como prévia na tela administrativa.

## 8. Estados e componentes comuns

Toda ação mutável prevê: inicial, carregando, sucesso confirmado, erro recuperável, permissão alterada e estado incerto. Botão desabilitado não substitui explicação quando o usuário iniciou a ação.

Padrões:

- feedback próximo da ação;
- proteção contra duplo toque;
- skeleton sem revelar quantidade privada;
- modais apenas para consequência relevante;
- linguagem curta, concreta e não clínica;
- ícone sempre acompanhado de texto quando transmite estado;
- data/hora no fuso familiar, com formato compreensível;
- foco restaurado após Drawer/modal;
- conteúdo gerado identificado por rótulo e não apenas por cor.

## 9. Acessibilidade e validação humana

Verificar no mínimo:

- 320 px de largura e orientação móvel;
- zoom do navegador e texto ampliado;
- teclado, foco visível e ordem lógica;
- leitor de tela para navegação, cartões, estados e visualizador;
- contraste e estados que não dependem só de cor;
- controles de jogo por toque e teclado quando compatível;
- pausa, áudio e redução de movimento quando utilizados;
- PDFs/imagens com alternativa útil quando o conteúdo não for acessível.

Homologar jornadas específicas:

| Participante | Jornada |
|---|---|
| Titular inicial | criar família e primeira conta na tela de boas-vindas, copiar endereço e entrar |
| Administrador familiar | entrar, compreender acessos e convidar dentro da própria família |
| Responsável | ver exame, organizar área e escolher experiência |
| Integrante | entrar direto na rotina e registrar sem ver configurações |
| Pessoa idosa | abrir rotina/resumo e compreender estados |
| Criança acompanhada | iniciar jogo supervisionado, pausar e concluir |
| Autoacompanhamento | navegar na própria pessoa sem tela administrativa desnecessária |

## 10. Critérios de aceite UX por entrega

- **E1:** contexto familiar e pessoa ativa permanecem claros; erros não revelam outra família.
- **E2:** alguém não técnico explica corretamente quem acompanha quem após usar a tela.
- **E3:** exame abre em celular e Resumo diferencia fato, ausência de dado e conteúdo assistido.
- **E4:** renovar sugestões não remove escolhas e não cria sensação de catálogo infinito.
- **E5:** responsável encontra a Biblioteca e uma fase no celular, entende a conclusão confirmada e consegue sair, retomar e recuperar um salvamento incerto.
- **E6:** sugestão de desenvolvimento não parece diagnóstico e pode ser ignorada.
- **E7:** resumo de cuidado mostra fontes/limites e prepara conversa, sem sugerir conduta.

Antes da implementação de cada entrega, produzir fluxo de baixa fidelidade e estados críticos. Protótipo visual e homologação humana continuam necessários; este documento organiza a proposta, não os substitui.

## 11. E3 — desenho aprovado com download de exames, 2026-11-22

**E3-UX-00 APROVADO pelo responsável:** retirar a abertura interna de arquivos e manter o restante do desenho. Fonte vigente: Módulo 02 v1.7 §10 e Módulo 04 v1.2 §12. Propostas anteriores de visualizador nas seções gerais deste documento ficam substituídas para a E3 por este desenho.

| Tela | Organização aprovada |
|---|---|
| Detalhe do exame | Pessoa, descrição, data conhecida e documento → **Baixar arquivo** |
| Resumo da pessoa | Período no topo → Cuidados e/ou Desenvolvimento conforme áreas aplicáveis/autorizadas |
| Exportação do resumo | Preparar PDF → conferir prévia → baixar |

O download mantém o detalhe do exame disponível. Mostrar nome/formato do anexo, estado de preparação, erro e alternativa de tentar novamente. Sem anexo, texto neutro sem botão vazio. O navegador/aplicativo do dispositivo abre o arquivo conforme suas configurações; não criar viewer, zoom, paginação ou tela de leitura própria.

Resumo preserva blocos factuais, datas, fontes e detalhes recolhidos, com vazio neutro. Prévia/PDF dos relatórios continuam no fluxo aprovado. Não expor informações por contagens/links de áreas sem autorização.

Validação humana da implementação: baixar PDF/imagem em celular/desktop e abrir pelo recurso do dispositivo; trocar período, conferir fontes e exportar resumo autorizado; repetir falha de rede e acesso revogado.

Este é aceite do desenho, não homologação do código a implementar.
