# Teste de uso — Biblioteca e jogos digitais

**Data** 2026-11-22 · **Demanda** `DEM-E5-JOGOS-DIGITAIS-20261122` · **Incremento** E5-06.

API e web locais, PostgreSQL temporário e apenas dados fictícios. Percursos executados na interface do Chrome em Windows, em desktop (1280 × 840) e em viewport móvel emulada (320 × 740), com interações de teclado nos fluxos indicados. A revisão anterior da entrega foi reconciliada com o checkout antes do teste. Passaram 28 checagens, sendo 27 no percurso da Biblioteca e uma na troca de família.

## O que funcionou

| Percurso | Resultado observado |
|---|---|
| Entrada e navegação | Login pelo formulário. A página da família permanece orientada às pessoas. Biblioteca no contexto de Desenvolvimento por acesso direto e menu móvel. Recompensas abre em destino próprio. |
| Atividades reais | A renovação preserva a sugestão escolhida. Fechar o detalhe com Escape devolve o foco à sugestão. Registrar participação leva a atividade a Executadas. Depois de disponibilizá-la novamente, a atividade retorna a Explorar. |
| Recompensas | O resgate de custo 1 apareceu em Resgatadas. Para o cenário testado, o saldo passou de 3 a 2 estrelas. |
| Memória, Sequência e Labirinto | Fases avançadas abertas no primeiro acesso. Os três jogos foram concluídos com dicas. No Labirinto, a tecla direcional movimentou a peça e os quatro controles ficaram alinhados em 320 px. |
| Interrupção, falha e evolução | Sair no meio da Memória deixa a fase Experimentada. A reabertura oferece um tabuleiro limpo. Uma resposta perdida após a gravação exibiu salvamento pendente, e o reenvio confirmou a descoberta. Histórico e Resumo exibiram as conclusões dos três jogos. |
| Contexto e acesso | O retorno preservou a categoria escolhida. A rota de partida recusou uma pessoa sem autorização. Abrir a partida de outra família com a sessão anterior preservou a saída e bloqueou o acesso aos dados e ao jogo. |

## Achados

| Prioridade | Como reproduzir | Efeito no uso |
|---|---|---|
| Média | Na Memória, pedir **Dica** e virar apenas a primeira carta indicada. | A indicação das duas cartas desaparece. Quem usa a dica precisa memorizar a segunda posição ou pedir a mesma ajuda de novo. |
| Baixa | Em Jogos digitais, filtrar pela categoria **Linguagem**. | O catálogo informa que a categoria está vazia, enquanto jogos de outras categorias continuam em **Em destaque**. A tela exige que a pessoa deduza que o filtro atua somente no catálogo. |
| Baixa | Resgatar uma recompensa de custo 1 e abrir **Resgatadas**. | O registro mostra “Último resgate: 1 estrelas”. O débito observado foi de uma estrela. |

**Ambiente de compilação.** O primeiro build web, em rede restrita, falhou ao resolver o Google Fonts para baixar a fonte Inter. O build terminou após a execução com acesso de rede autorizado.

**Aceite humano.** E4-HOM e E5-HOM seguem pendentes de avaliação pelo responsável e pela criança em dispositivo real. O teste emulado não incluiu leitor de tela nem uso em celular físico. [Roteiro](roteiro-homologacao-e5.md)

## Reteste após as correções

**Incremento** `E5-06-COR-01`. **Resultado** 38 checagens passaram no Chrome em desktop e em viewport móvel emulada de 320 px, com PostgreSQL temporário e dados fictícios.

| Correção | Verificação no reteste |
|---|---|
| Dica da Memória | Virar a primeira carta sugerida mantém apenas a segunda em destaque e anuncia qual carta virar. Completar o par ou virar uma carta fora da sugestão limpa a dica. Pedir ajuda com uma carta aberta indica a próxima ação. |
| Categoria dos jogos | O seletor acima das listas filtra destaques e catálogo. Uma categoria vazia oculta os destaques. **Todas** recupera os três jogos. O retorno da partida preserva a categoria. |
| Texto de recompensas | O catálogo mostra “1 estrela” e “7 estrelas”. A confirmação e o último resgate usam o singular para um custo de uma estrela. O débito ocorreu uma vez. |
| Compilação | O tema usa a pilha tipográfica já configurada, com fontes do sistema quando Inter está ausente. O build web terminou em rede restrita, com os tipos gerados pelo Next isolados. |

O reteste também percorreu login, atividades reais, resgate, os três jogos, reenvio após perda de resposta, Histórico, Resumo e isolamento entre famílias. Os smokes E4 e E5 passaram com 16 e 30 checagens respectivamente. E4-HOM e E5-HOM permanecem pendentes de aceite humano.

## Erro de servidor ao abrir Jogos digitais

**Incremento** `E5-06-COR-02`. O PostgreSQL de desenvolvimento ainda usava o schema anterior à E5. A consulta do catálogo falhou com o código Prisma `P2021`, pois a tabela `progresso_fase_jogo` estava ausente.

O diff do Prisma apresentou somente a criação da tabela, um índice e duas chaves estrangeiras. A atualização foi aplicada ao banco local sem reset nem seed. A consulta passou, o diff final ficou vazio e a contagem de pessoas cadastradas permaneceu igual.

No Chrome, com dados fictícios e um banco temporário no schema anterior, **Biblioteca → Jogos digitais** exibiu “Jogos indisponíveis” e a API devolveu HTTP 500. Após a mesma atualização, **Tentar novamente** exibiu os três jogos e a API passou a devolver HTTP 200. A fase 1 da Memória foi concluída com confirmação da primeira descoberta, e o catálogo reabriu em 375 px sem rolagem horizontal. As quatro checagens passaram.
