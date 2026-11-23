# E5 — Jogos digitais e reorganização da Biblioteca

**Demanda** `DEM-E5-JOGOS-DIGITAIS-20261122` · transversal · risco alto para autorização, dados infantis e persistência.\
**Estado** E5-01 a E5-05 implementados e verificados. A E5-06 registra a validação integrada e o aceite humano.\
**Base** `develop @ 45e1231bedd3b9742221240711df94e8566252fd`, com E4 implementada em `0a1055b`.\
**Regra de produto** [Módulo 03 v1.4 §13](../../modulos/03-desenvolvimento-laurinha/ESPECIFICACAO.md#13-e5--jogos-digitais-na-biblioteca-de-desenvolvimento).\
**Desenho da jornada** [UX pós-V1 §5](../../ux-ui/PROPOSTA-EVOLUCAO-POS-V1.md#5-biblioteca-de-desenvolvimento).

## 1. Retorno da homologação e revisão do sistema

O responsável informou **aprovação humana parcial da E4** e pediu que a organização da Biblioteca seja resolvida com a E5. O ponto informado é a concentração de conteúdo na entrada e o risco de agravá-la com os jogos. A revisão cruzou requisitos, código, histórico Git e evidências da esteira. Os resultados abaixo são de inspeção estática. O alcance do aceite humano por cenário ainda precisa ser registrado na reavaliação do percurso E4-HOM.

| Área | O que existe no checkout | Encaminhamento |
|---|---|---|
| Nossa família e perfil | A entrada prioriza contexto conforme a sessão. No conteúdo da página familiar, “Para acompanhar” vem antes da escolha de contexto quando há destaques. “Gerenciar família” também pode aparecer como cartão e no menu. | Prioridade E5 é manter Biblioteca e jogos no contexto da pessoa. Na regressão, validar a descoberta do acompanhamento para quem tem um ou vários contextos. Revisar a prioridade dos destaques e o cartão duplicado em rodada de UX da Fundação se dificultarem a tarefa. |
| Desenvolvimento e Biblioteca | A rota de Desenvolvimento reúne até seis sugestões, catálogo com Explorar/Executadas, recompensas, saldo e links secundários. “Ver biblioteca” reseta filtros e rola para a âncora na mesma página. | Corrigir em E5-01. Dar destino direto à Biblioteca, transportar a jornada E4 e dar destino secundário às recompensas. Fazer o catálogo de jogos entrar somente dentro da Biblioteca. |
| Navegação e partida | O `AppShell` e o Drawer vêm do provedor global. O menu já tem Cadastros contextual e inclui acesso a gestão e outras áreas conforme sessão. | Aproveitar menu e rótulos compartilhados em E5-01. Em E5-02, usar apresentação restrita na rota de partida, mantendo a guarda familiar e os controles de acesso a cada chamada. |
| Cuidados | Rotina, Medicamentos e Consultas e exames já têm destinos contextuais. O defeito de salvar anexo está registrado na E3. | Usar a hierarquia da Rotina como referência e validar seu acesso em regressão. Tratar `DEF-E3-ANEXO-SALVAR-20261122` na frente própria já registrada. |
| Histórico e Resumo | Histórico lê participações e resgates. Resumo e exportação têm autorizações e contratos próprios. | Em E5-05, integrar descobertas ao Histórico e ao bloco Desenvolvimento do Resumo. Usar o recorte explícito de período e preservar a equivalência da prévia com o PDF vigente. |
| Gestão e perfis | Gestão agrupa Pessoas, Acessos e Convites. Visibilidade de pessoa na gestão e direito de acompanhar Desenvolvimento são condições distintas. | Usar as autorizações contextuais da ADR-014 para mostrar Biblioteca, abrir rotas e escrever progresso. A revisão de rótulos ou campos administrativos pertence à evolução da Fundação. |

**Pontos no código.** [Entrada familiar](../../../apps/web/src/componentes/painel-fundacao.tsx) · [navegação compartilhada](../../../apps/web/src/componentes/navegacao-app.tsx) · [provedores](../../../apps/web/src/componentes/provedores-app.tsx) · [Desenvolvimento](../../../apps/web/src/app/f/%5Bslug%5D/pessoas/%5BpessoaId%5D/desenvolvimento/page.tsx) · [autorizações](../../../apps/api/src/autorizacoes/servico-autorizacoes.ts) · [acompanhamento](../../../apps/api/src/cuidados/servico-acompanhamento.ts).

**Rastreabilidade da E4.** [Evidência técnica original](../estado/evidencia-e4-20261122.json) · [Roteiro E4-HOM](../estado/roteiro-homologacao-e4.md) · [Resultado humano vigente](../../produto/STATUS-E-ESCOPO.md#e4--biblioteca-real-com-homologação-humana-parcial-2026-11-22). O conteúdo versionado dos arquivos E4 coincide com o commit de implementação. O hash histórico não foi reproduzido pelo algoritmo de retomada no checkout Windows. A entrega corretiva terá evidência e fingerprint próprios.

## 2. Correção prioritária de UX

- **E5-UX-01 — Encontrar a Biblioteca.** Partir do Desenvolvimento de uma pessoa autorizada, usar **Ver biblioteca** ou o menu contextual e chegar ao mesmo destino em desktop e móvel. A entrada de Desenvolvimento tem uma ação primária. Quando o piloto estiver disponível, **Ver biblioteca** e **Jogos digitais** são as duas escolhas do caminho direto. O menu indica a pessoa e o destino atual. Nossa família continua orientada aos acompanhamentos.
- **E5-UX-02 — Concluir o percurso E4.** Em Atividades reais, encontrar sugestões, escolher, renovar preservando a escolha, participar, conferir **Executadas** e disponibilizar novamente quando autorizado. O saldo e o Histórico refletem apenas as operações previstas. Acesso a **Recompensas** tem função própria e **Cadastros** aparece para quem pode organizar.
- **E5-UX-03 — Voltar ao ponto de escolha.** URL contextual estável, seletor de modalidade e filtros recuperáveis no retorno do detalhe, sem perder a pessoa ativa. Usar foco perceptível no menu e após fechar detalhes, carregamentos por seção e feedback explícito de sucesso, falha ou ausência de conteúdo. Um catálogo indisponível oferece recuperação no próprio destino.

**Decisão de navegação L2.** Usar a entrada contextual do AppShell/Drawer, com rota de referência `/f/{slug}/pessoas/{pessoaId}/desenvolvimento/biblioteca`. Reaproveitar detecção de área em `navegacao-app.tsx`, rotas em `rotas-familia.ts` e componentes Mantine. A escolha de modalidade fica na Biblioteca. Subrotas e filtros precisam respeitar links antigos, acesso direto, troca de pessoa e o botão Voltar. Um fluxo de baixa fidelidade está no desenho de UX. Conferir hierarquia e estados móveis no começo de E5-01.

## 3. Viabilidade técnica e curadoria

### Contratos e dados

- **Fronteira.** E5 entra no domínio Desenvolvimento do monólito. A Biblioteca reúne modalidades na experiência. O código de jogos terá serviço e contratos próprios no módulo. `Desafio`, `SugestaoDesafioPessoa`, `ParticipacaoDesafio` e a razão de estrelas continuam com sua semântica presencial. Reutilizar taxonomia, tema, feedback e controles de autorização vigentes. Aplicar [ADRs 006, 009, 013 e 014](../../arquitetura/DECISOES.md).
- **Catálogo e versões.** Começar com definições e recursos editoriais versionados no repositório, com IDs estáveis de jogo e fase. Registrar no progresso a versão da primeira exploração/conclusão conforme o uso no Histórico. Preservar referências necessárias para ler eventos quando a configuração vigente mudar. Validar autoria/licença, faixa orientativa e resolubilidade antes de disponibilizar cada conjunto.
- **Progresso privado.** Modelar no Prisma uma linha única por pessoa/jogo/fase vinculada à família da pessoa, com datas necessárias de exploração, primeira conclusão e última atividade. Validar vínculo e autorização com o mesmo padrão de `podeVerDesenvolvimento` usado nos serviços atuais. Pessoa e família vêm de sessão e consultas no servidor. Slug, IDs e conteúdo enviados pelo cliente passam pelas mesmas verificações no acesso direto. Respostas e caches privados são escopados ao sujeito autorizado.
- **Escrita e reenvio.** Contratos mínimos para catálogo/progresso, início e conclusão. O servidor confere a fase, sua versão elegível e a transição. Atualizações atômicas com unicidade preservam a primeira conclusão diante de início tardio, repetição, concorrência ou perda de resposta. Tratar uma confirmação de conclusão reenviada como leitura do resultado persistido. Manter estado do tabuleiro na memória da partida. A avaliação de um identificador de execução fica no primeiro jogo, caso necessário para vincular início e conclusão sem persistir cliques.
- **Supervisão.** Usar a sessão autorizada existente para iniciar jogo de uma criança sem conta. Durante a partida, renderizar apenas jogo, dica e saída, fora do menu geral. A guarda familiar fica ativa. A interface reduz saídas acidentais e exposição visual. A proteção de dados em acesso direto continua na API. Após revogação ou troca de contexto, cancelar respostas obsoletas e limpar conteúdo privado exibido.
- **Histórico, Resumo e PDF.** Derivar a linha do tempo da primeira conclusão, com data, nome/versionamento e fase. No Resumo, apresentar descobertas no período e rotular o progresso total com a data final do recorte, se exibido. A fonte é o progresso E5, conforme ADR-009, com autorização de Desenvolvimento aplicada antes de agregação. Como `servico-acompanhamento.ts` compartilha a leitura de Desenvolvimento com a prévia, preservar a projeção atual da exportação enquanto a E5 alimenta a tela. Testar equivalência prévia/PDF e restrições por domínio. Uma eventual inclusão de jogos na exportação depende de desenho e teste de privacidade.

### Jogos e controles de referência

As configurações abaixo orientam curadoria e protótipo. A dificuldade é definida por fase e as cinco fases ficam abertas em cada jogo. Usar título, imagem e instruções compreensíveis inclusive com ampliação, contraste elevado e redução de movimento.

| Jogo | Variação e dificuldade a validar | Controles e verificação |
|---|---|---|
| Memória de figuras | Dois a seis pares curados e maior semelhança no fim, mantendo distinção. Embaralhar posições e variar conjuntos da mesma dificuldade. | Cartas acionáveis por toque/teclado. Informar posição e estado e identificar a figura quando revelada. Conferir pares únicos e se cada conjunto pode ser concluído com dica. |
| Complete a sequência | Alternância simples até padrões combinados de forma e cor com lacuna intermediária. | Cada lacuna tem resposta inequívoca. Cor vem com forma ou descrição. Escolha funciona por botão/teclado e dica explica o padrão. |
| Caminhos e labirintos | Caminho curto até mapas com bifurcações e retornos, com origem e destino em posições válidas. | Usar grade e botões direcionais em React, com setas de teclado no jogo e alternativa perceptível para mapear paredes e posição. Validar conectividade em todas as variantes. Avaliar um motor 2D apenas se a grade se mostrar insuficiente no protótipo. |

### Destaques automáticos

Aplicar na modalidade digital uma ordenação determinística sobre o catálogo publicado e o progresso privado autorizado. Começar com diversidade de categorias e desempate editorial fixo. Com progresso, incluir até um jogo recente e priorizar jogos ainda não explorados, preferindo categorias distintas. Quando todos já foram experimentados ou faltar diversidade, preencher pela combinação estável de recência e ordem editorial. Mudanças no catálogo ou no progresso podem atualizar a seleção. Com menos de três jogos, apresentar os disponíveis uma única vez no destaque. O catálogo completo mantém todos os elegíveis no filtro **Todas**. A falta de idade permite opções gerais e o filtro vazio informa que é possível voltar a **Todas**.

## 4. Incrementos

Cada incremento implementado segue **QG-1 → verifier → QG-2**. O QG-3 fecha o conjunto e a homologação humana avalia as jornadas corrigida e nova.

| ID e estado inicial | Resultado e critérios | Alvos previstos e verificações pertinentes |
|---|---|---|
| **E5-01 READY** | Biblioteca com Atividades reais e separação de recompensas/cadastros. E5-UX-01 a 03, E4-ACE-03 a 07 e percurso E4-HOM para revalidação. | Rota de Desenvolvimento, subrotas Biblioteca e Recompensas, `navegacao-app.tsx` e componentes locais. Atualizar `check-e4.mjs`, que lê a página antiga. Rodar typecheck/build web, `check:e4`, `smoke:e4` e navegação móvel/desktop com acesso autorizado e negado. |
| **E5-02 PENDING** | Memória de figuras em cinco fases, com área de partida isolada, progresso persistido, dica, reinício e falha recuperável. Primeira fatia de E5-ACE-01 a 07, 09, 10 e 12. | `schema.prisma`, catálogo e serviço/controlador de jogos em Desenvolvimento, `api.ts`, rotas/componentes de Biblioteca e partida. Typecheck API/web, smoke novo E5 com escrita concorrente, reenvio, revogação e isolamento. |
| **E5-03 PENDING** | Complete a sequência em cinco fases com variantes e dica acessível. Amplia E5-ACE-01 a 03, 06, 10 e 12. | Configuração, validador de padrões e componente do jogo. Testar solução única, toque e teclado. Regressão de Memória e persistência. |
| **E5-04 PENDING** | Caminhos e labirintos em cinco fases, mapas resolúveis e saída sempre disponível. Fecha o recorte de mecânicas de E5-ACE-01 a 03, 06, 10 e 12. | Configuração, validação de mapas e componente do jogo. Testar caminho possível, controles e orientação móvel. Regressão das três mecânicas com reabertura de fase. |
| **E5-05 PENDING** | Biblioteca com destaques e filtros, descobertas autorizadas em Histórico e Resumo. E5-ACE-04, 05, 08, 09, 11 e 12. | Serviço E5 e integração em `servico-acompanhamento.ts`, `api.ts`, Biblioteca, Histórico e Resumo. Testar ordenação estável, catálogo pequeno, versão, datas e negação em agregações. |
| **E5-06 PENDING** | QG-3 integrado e jornadas humanas E4-HOM e E5-HOM com resultados explícitos. Consolidar evidência de E5-ACE-01 a 12 e E5-UX-01 a 03. | Builds API/web, checks/smokes E4 e E5, `smoke:authz`, regressão pertinente de Resumo/prévia/PDF da E3, roteiro e evidências por cenário. |

## 5. Validação e dependências

- **UX e acessibilidade.** Em celular e desktop, usar toque e teclado e conferir menu, foco, retorno, largura de 320 px, texto ampliado, contraste, leitores de tela e saída com movimento reduzido. Verificar se a pessoa chega a Jogos digitais a partir da Biblioteca e se o adulto recupera a mesma pessoa e seção ao sair. [Guia de Experiência §6](../../ux-ui/GUIA-DE-EXPERIENCIA.md#6-responsividade-e-acessibilidade) · [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- **Autorização.** Duas famílias fictícias, responsável autorizado, pessoa sem conta, administrador sem autorização de Desenvolvimento, responsável só de Cuidados e sessão revogada. Cobrir catálogo, tentativa de abrir rota direta na pessoa errada, progresso, escrita, Histórico, Resumo e exportação. O estado de interface e os totais obedecem ao mesmo escopo dos detalhes.
- **Persistência.** Testar primeira conclusão e repetição, dois dispositivos em paralelo, início tardio após conclusão, volta após fechar a partida, falha antes da gravação e perda da resposta após gravação. Alterar a versão de conteúdo e conferir continuidade da conquista e seu registro histórico.
- **Regressão E4.** Revalidar escolha → renovar preservando escolha → participar → Executadas → disponibilizar novamente. Conferir filtros, recompensa, saldo, estrelas, Histórico e isolamento. Registrar qual cenário foi aceito, reprovado ou ficou pendente. Usar o novo caminho pela Biblioteca e o [roteiro E4-HOM](../estado/roteiro-homologacao-e4.md).
- **Homologação E5.** Responsável e criança localizam jogo, abrem fase avançada no primeiro uso, pedem dica, concluem, interrompem, retornam e conferem a evolução. Usar dispositivos reais com dados fictícios. Registrar observação e resultado humano separados das verificações automatizadas.

A E5 depende da base E4 e da autorização contextual da Fundação. O vínculo com o Módulo 04 entra na leitura de evolução. O Documento Mestre §13 vale para dados de desenvolvimento, e as invariantes de autorização e histórico valem no ambiente em execução. A curadoria de fases e os controles são validados por jogo. A falha de anexos E3 permanece aberta e adiada na frente própria.

**Acompanhamento da entrega.** Consultar as [evidências da esteira](../estado/evidencia-e5-20261122.json) e registrar a revalidação da E4 e a avaliação da E5 no [roteiro de homologação humana](../estado/roteiro-homologacao-e5.md).
