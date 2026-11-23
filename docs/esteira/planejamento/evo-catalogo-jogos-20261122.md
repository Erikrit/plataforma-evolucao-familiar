# EVO-CATALOGO-JOGOS-20261122 — Expansão digital da V1

**Aprovação L3 de Produto:** APROVADA em 2026-11-22. **Estado:** CAT-01..05 COMPLETED; **CAT-HOM APROVADA** (demanda HOMOLOGADA). Publicação **não** autorizada por este aceite.

**Base inspecionada:** `develop` @ `3491646`.

**Requisito de publicação:** oito jogos em PostgreSQL, testados e homologados antes do primeiro uso na VPS. A autorização de publicação é independente.

A [especificação E5](../../modulos/03-desenvolvimento-laurinha/ESPECIFICACAO.md#13-e5--jogos-digitais-na-biblioteca-de-desenvolvimento) rege o comportamento. O catálogo E4 permanece com os 24 modelos oficiais e suas regras vigentes. A estimativa anterior de 20 jogos por categoria fica como hipótese editorial futura.

## Catálogo e curadoria

Cinco fases livres por jogo. As primeiras três entradas preservam IDs, fases e conteúdo homologados. As faixas são orientativas.

| Categoria | Jogo e objetivo | Mecânica | Progressão das cinco fases | Público e recursos |
|---|---|---|---|---|
| Memória e atenção | Memória de figuras · encontrar pares iguais | Memória atual | 2, 3, 4, 6 pares, 6 frutas próximas | 5–8 anos. Figuras atuais |
| Raciocínio | Complete a sequência · encontrar a peça ausente | Padrões atuais | Cores, formas, três elementos, lacuna interna, forma e cor | 5–8 anos. Peças atuais |
| Raciocínio | Caminhos e labirintos · chegar ao destino | Labirinto atual | Corredor, bifurcação, várias passagens, trajeto longo, mapa elaborado | 5–8 anos. Tabuleiro atual |
| Memória e atenção | Pares de sombras · associar objeto e silhueta | Memória com duas faces por chave de par | 2 pares distintos, 3 animais, 4 objetos, 5 figuras cotidianas, 6 contornos próximos | 5–8 anos. Objetos e silhuetas de alto contraste |
| Memória e atenção | Ache o intruso · perceber qual figura destoa | Escolha única | 3 formas, 4 tamanhos, 4 objetos por grupo, 5 por atributo, 6 com duas pistas | 5–8 anos. Formas e objetos familiares |
| Linguagem | Palavra e figura · escolher a imagem da palavra | Escolha única | 2 figuras distintas, 3 objetos comuns, 3 do mesmo grupo, 4 palavras semelhantes, 4 opções com pista curta | 6–8 anos. Figuras, texto e rótulos acessíveis |
| Linguagem | Histórias em cenas · ordenar acontecimentos | Ordenação por toque ou teclado, com desfazer | 2 cenas, 3 com começo evidente, 3 de causa e efeito, 4 de uma rotina, 4 com pista intermediária | 5–8 anos. Cenas ilustradas |
| Coordenação | Entrega no jardim · conduzir uma peça por pontos | Labirinto com pontos de passagem | 1 parada em linha, 1 após curva, 2 em percurso curto, 2 com bifurcação, 3 em mapa maior | 5–8 anos. Mapas, personagem, pontos e destino |

Revisar pelo menos duas variantes por fase nova. Verificar soluções únicas para escolha e ordenação, chaves de pares consistentes e destino alcançável após os pontos de passagem. Usar recursos próprios ou licenciados, pistas além da cor e controles acessíveis. Na Biblioteca, manter a UX R2 com seleção direta de fase, categorias publicadas, filtro de conclusão, destaque e progresso discretos, dica durante a partida e retorno ao filtro. Adiar busca adicional. Estrelas pertencem às atividades reais. IA, rankings e avaliações cognitivas ficam fora.

## Arquitetura e compatibilidade

- **Editoriais:** `JogoDigital` (ID, nome, categoria, versão, tipo de mecânica, faixa indicativa, publicação, ordem, capa opcional) e `FaseJogoDigital` (chave composta jogo/fase, título, objetivo, dificuldade, versão e configuração JSON). Reutilizar categorias vigentes. Validar configurações pelo tipo antes da publicação e ao preparar a partida. Referências visuais são chaves de recursos locais da aplicação.
- **Execução e interface:** motores e tabuleiros em código. Reusar memória, seleção e labirinto, com extensões delimitadas. Acrescentar ordenação. Vincular a interface ao tipo de mecânica por contrato explícito e evoluir a resposta de início de forma compatível com o piloto. O catálogo armazena somente dados declarativos.
- **Progresso privado:** preservar `ProgressoFaseJogo`, a chave família/pessoa/jogo/fase, `memoria`, `sequencia`, `labirinto` e fases 1–5. Reutilizar autorização contextual por operação e registros de versão e conclusão. Atualizar conteúdo ou retirar um jogo da listagem preserva descobertas já registradas. Sem tabelas editoriais para recursos visuais neste recorte.
- **Carga:** migração versionada com Prisma. Carga de produção transacional e idempotente por chaves estáveis, separada do seed fictício. Catálogo E4 reutiliza a fonte oficial existente. Testar duas aplicações em banco novo e preservação do progresso em banco de ensaio separado. A primeira VPS recebe apenas catálogos oficiais e configurações indispensáveis.

## Incrementos

| ID | Entrega e aceite | Validação prevista |
|---|---|---|
| CAT-01 | Migração inicial e carga oficial idempotentes. 24 modelos E4, 3 jogos e 15 fases E5. Banco novo sem dados familiares e progresso existente preservado em ensaio separado. A aplicação mantém a leitura atual nessa etapa. | Typecheck da API, instalação limpa, dupla carga, contagens e comparação do progresso em dois ambientes descartáveis |
| CAT-02 | API lê catálogo do PostgreSQL e o piloto mantém contratos, UX R2, autorização contextual e progresso. PostgreSQL vira fonte da leitura editorial e o histórico continua resolvendo as descobertas. | Typechecks, `smoke:e5`, `smoke:authz`, regressão E4 |
| CAT-03 | Pares de sombras, Ache o intruso, Palavra e figura e Entrega no jardim jogáveis com componentes reaproveitados. | Curadoria das 20 fases novas, verificações de configuração e percurso no celular |
| CAT-04 | Histórias em cenas integrado. Oito jogos e 40 fases oficiais, duas variantes curadas por fase nova e Biblioteca validada em celular. | Curadoria das cinco fases novas, variantes, controles por toque e teclado, regressão da Biblioteca |
| CAT-05 | QG-3 de regressão e roteiro CAT-HOM. Registrar aceite humano explícito antes de liberar a publicação. | Builds, regressão E4/E5 e de isolamento, histórico, progresso e homologação em celular com dados fictícios |

## Critérios de saída

- **CAT-ACE-01:** PostgreSQL como fonte editorial, configuração declarativa e versões rastreáveis.
- **CAT-ACE-02:** IDs, fases e progresso do piloto preservados; carga oficial verificável e reexecutável.
- **CAT-ACE-03:** oito jogos e 40 fases disponíveis, duas variantes curadas por fase nova e regressões UX R2 aprovadas.
- **CAT-ACE-04:** autorização contextual, idempotência, descobertas e estrelas presenciais verificadas.
- **CAT-ACE-05 / CAT-HOM:** QG-3 e aceite humano explícito em celular com dados fictícios. Registrar separadamente o resultado técnico e o humano.

**Próximo passo:** publicação só com **autorização explícita** independente (bloqueios EST-02 / restore no alvo permanecem). A [preparação operacional](estabilizacao-pre-uso.md) segue como frente própria. CAT-HOM: [roteiro](../estado/roteiro-homologacao-cat-hom.md) · [evidência](../estado/evidencia-cat-hom-20261122.json).
