# Proposta UX/UI — evolução pós-V1

**Data:** 2026-11-21  
**Base:** `develop` @ `40001ec919604c1665f8a26b75a4d5ea89dc4650`  
**Estado:** PROPOSTA para E1–E7. Não altera as diretrizes aprovadas da V1 nem comprova implementação, acessibilidade ou homologação.  
**Fonte de visão:** `docs/produto/EVOLUCAO-POS-V1.md` v2.0.

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
| Desenvolvimento | Biblioteca, Executadas, Estrelas e recompensas |
| Gestão | Pessoas, Acessos e responsabilidades, Convites |
| Editorial da plataforma | Catálogo e jogos, fora da gestão de uma família |

No celular, usar o mesmo Drawer/AppShell aprovado. Ao selecionar uma pessoa, manter nome e área visíveis. Não criar uma barra global para Família, outra para Pessoa e uma terceira dentro de cada módulo. Subdestinos aparecem apenas quando existem e estão autorizados.

“Resumo” evolui a área já existente do Módulo 04. “Histórico” continua sendo a linha do tempo derivada. A Biblioteca reúne Atividades reais e Jogos digitais para a pessoa, sem exigir que compartilhem o mesmo fluxo técnico.

## 3. Entrada por família

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

### Estrutura

No contexto da pessoa:

- cabeçalho curto com Biblioteca;
- alternância Atividades reais / Jogos digitais;
- seção “Sugestões para esta pessoa” com poucas opções;
- filtros simples por categoria e faixa orientativa quando realmente necessários;
- ação “Renovar sugestões”;
- acesso secundário a “Ver biblioteca”.

Cada cartão mostra nome, modalidade, categoria, dificuldade/faixa orientativa e materiais ou duração somente quando ajudam a decidir. Instruções completas ficam no detalhe. Informar supervisão e acessibilidade quando pertinentes.

Renovar exibe progresso, substitui somente alternativas ainda não escolhidas e confirma a nova seleção após persistência. Não apagar atividades personalizadas, escolhidas ou executadas. Não apresentar contador de quantas vezes a família “deveria” renovar.

### Jogo digital

Antes de iniciar, mostrar objetivo lúdico, controles, acessibilidade, regra de estrelas e quem está jogando. Um adulto autorizado confirma a pessoa quando a criança não possui conta. Durante o jogo, manter pausar/sair, som independente quando existir e alvos confortáveis.

Ao terminar:

- confirmar resultado somente após o servidor aceitar a sessão;
- explicar estrelas concedidas e origem digital;
- oferecer jogar novamente conforme a regra, voltar à Biblioteca ou ver Resumo;
- conexão perdida não mostra crédito provisório como definitivo;
- abandonar não gera mensagem de fracasso, perda ou cobrança.

Adultos e idosos recebem nomes, imagens e instruções respeitosas, sem adaptação infantil baseada apenas em idade.

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
4. escolher Responsável ou Integrante dentre opções permitidas;
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
| Administrador | provisionar/entrar, compreender acessos e convidar |
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
- **E5:** sessão e estrelas são compreensíveis mesmo com retry, pausa ou conexão perdida.
- **E6:** sugestão de desenvolvimento não parece diagnóstico e pode ser ignorada.
- **E7:** resumo de cuidado mostra fontes/limites e prepara conversa, sem sugerir conduta.

Antes da implementação de cada entrega, produzir fluxo de baixa fidelidade e estados críticos. Protótipo visual e homologação humana continuam necessários; este documento organiza a proposta, não os substitui.
