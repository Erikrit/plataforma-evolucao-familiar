# Auditoria técnica · 2026-11-22

Base `develop` em `95cb9de`. O checkout já continha a correção de UX em andamento, evidências e arquivos locais dessa demanda. Triagem transversal L2 conforme Governança e ADR-012. A auditoria completa três recortes e mantém os demais no plano incremental.

| Ordem | Achado e evidência | Impacto, risco e esforço | Resultado |
|---|---|---|---|
| 1 | Lembretes executavam um `findFirst` por ocorrência. O índice de `registro_dose` já cobre chave e versão ativa. | Alto, médio, baixo | Uma consulta de doses em condições normais e zero para agenda vazia. Versões ativas duplicadas usam a consulta legada apenas nas chaves afetadas. |
| 2 | A home consultava as concessões ativas duas vezes por cartão de outra pessoa. Administradores podem ter muitos cartões. | Alto, alto, baixo | A home reutiliza a lista ativa da própria requisição, indexada por pessoa e área. A consulta aos metadados de acessos mantém o escopo existente. |
| 3 | Lembretes de medicamento e consulta passavam pela guarda que aceita Desenvolvimento ou Cuidados. | Alto, alto, baixo | A leitura agora exige a permissão existente de Cuidados, conforme M02. |
| 4 | Resumo de Cuidados traz todas as doses ativas da pessoa antes de restringir às ocorrências do período. Prévia e PDF repetem verificações de visão e resumo. A rotina de medicamentos também tem consulta por horário. | Médio, alto, médio | Pendentes. Medir volume e plano de consulta com dados fictícios. Para limitar doses no resumo, usar chaves de ocorrências previstas e cobrir vigências e correções retroativas. |
| 5 | Em `contexto-sessao`, login chama `aplicarInicio` após definir o usuário, e o efeito da sessão também pode chamar `aplicarInicio`. Respostas antigas merecem teste de troca de família. O painel de gestão recarrega a home após mutações e recarrega convites conforme a aba. O menu consulta a ficha quando falta o cartão. `api.ts` centraliza o fetch. | Médio, médio, médio | Pendentes. Contar requisições por login, mutação e navegação direta antes de reduzir recargas. Manter atualização após revogação e a consulta de contingência para URL direta. |
| 6 | Parte significativa do Git é composta por saídas de quality gate. | Médio, baixo para novos artefatos, baixo | Padrões explícitos para `*.local.txt` e `*.local.png` em `docs/esteira/estado`. Formatos canônicos permanecem rastreáveis. |

## Medições e verificação

- Comparação por eventos SQL do Prisma no mesmo PostgreSQL fictício, com igualdade integral das respostas autorizadas. A home com quatro cartões adicionais passou de 23 para 15 consultas totais, com 12 para 4 consultas de autorização. Os lembretes com seis horários passaram de 10 para 5 consultas totais, com 6 para 1 consultas de doses. Latência e volume em bytes não foram medidos.
- O teste instrumentado cobriu agenda vazia sem consulta de doses e preservação da leitura para chaves duplicadas. O teste HTTP retornou 200 para Cuidados, 403 para Desenvolvimento sem Cuidados e após revogação, e 404 para outra família.
- Build API, lint dos dois serviços, bootstrap com 42 checagens, teste de lote, verificação independente e smokes E1 de autorização e jornadas, E2, E4 e E5 passaram no recorte. Os smokes integrados usaram PostgreSQL isolado e dados fictícios. O teste de lote inspeciona chamadas Prisma por meio de um dublê.
- O bootstrap inicialmente falhou por um sufixo literal depois do JSON de estado. O reparo retirou somente o sufixo e manteve o registro da outra demanda.

## Inventário sem exclusões

| Categoria | Tratamento |
|---|---|
| Código e operação | Preservados em `apps/**/src`, schema Prisma, configuração, migrations quando rastreadas e scripts operacionais. |
| Testes automatizados | Preservados, incluindo os scripts smoke e a nova regressão de lembretes. |
| Documentação e evidências canônicas | Preservadas. As 12 capturas rastreadas têm referências agrupadas em evidências e no registro. Os documentos, ADRs, JSONs e roteiros mantêm sua rastreabilidade. |
| Artefatos temporários | Builds, traces, logs e cache de TypeScript já têm padrões de exclusão correspondentes. Nenhum arquivo rastreado com extensão `.tsbuildinfo`, `.log`, `.har`, `.ndjson`, `.zip` ou `.pdf` apareceu. |
| Duplicados ou obsoletos | Nenhuma exclusão confirmada. |
| Classificação incerta | Dos 236 arquivos `qg*.txt`, 201 tiveram referência direta ao nome em fontes e documentos rastreados. Os demais 35 podem ainda ter retenção histórica ou referências indiretas. Permanecem preservados até revisão individual. |

O checkout contém 590 arquivos rastreados. Inventário de remoção confirmado vazio. A identificação de uma saída intermediária não autoriza sua retirada do histórico de homologação.

## Estado

Mudanças locais. A correção de UX existente continua registrada na demanda original. A auditoria técnica permanece aberta para os itens de desempenho sem medição integrada e a revisão individual de retenção.

## Retomada sobre `534e020`

Checkout inicial limpo na `develop`. Build web concluído em `.next-qg-audit-r2`, com restauração dos arquivos de configuração que o Next ajustou durante a compilação. Build da API, bootstrap com 42 verificações, smokes E1 de autorização e jornadas, E2, E4 e E5 e revisão independente passaram.

| Cenário fictício | Antes | Depois |
|---|---:|---:|
| Resumo de um dia, pessoa com 101 doses ativas, uma no dia | 11 consultas SQL e 102 linhas de doses retornadas ao Prisma | 11 consultas SQL e 2 linhas |
| Histórico filtrado para Desenvolvimento, titular autorizado nas duas áreas | 12 consultas SQL e 1 linha de dose | 4 consultas SQL e 0 linhas de doses |

Contagens obtidas por eventos SQL e instrumentação do retorno Prisma no mesmo PostgreSQL. A comparação integral das respostas passou. A listagem de doses continua vinculada à data de registro. A contagem de doses previstas usa as chaves geradas pelas vigências existentes. Chaves duplicadas preservam o caminho anterior. Intervalos grandes podem exigir múltiplos lotes e memória proporcional a ocorrências. Latência e intervalos extensos seguem sem medição.

### Classificação das saídas de quality gate

Dos 243 arquivos `qg*.txt`, 208 têm referência direta e ficam preservados. Outros 29 ficam em retenção preventiva porque a ausência de referência por nome não demonstra ausência de dependências indiretas. Seis podem ser avaliados para retirada após autorização humana. Cada um tem conteúdo byte a byte igual ao de um arquivo referenciado.

| Candidato em `docs/esteira/estado/` | Conteúdo igual em arquivo preservado |
|---|---|
| `qg1-typecheck-ef01.txt` | `qg1-typecheck-api-adr014.txt` |
| `qg1-typecheck-ef02.txt` | `qg1-typecheck-api-adr014.txt` |
| `qg1-typecheck-ef03.txt` | `qg1-typecheck-api-adr014.txt` |
| `qg1-typecheck-web-ef02.txt` | `qg1-typecheck-dl05.txt` |
| `qg1-typecheck-web-ef03.txt` | `qg1-typecheck-dl05.txt` |
| `qg2-build-ef01.txt` | `qg2-build-api-dl06.txt` |

Antes de qualquer retirada, registrar a etapa de origem de cada candidato. Conteúdo idêntico não prova que as execuções foram a mesma. Nenhum arquivo rastreado foi removido.

### Frontend

O build de produção passou. O ensaio automatizado de login no Chrome isolado expirou antes de concluir a jornada. A hipótese de duplicação entre a chamada explícita e o efeito continua sustentada pela leitura do código, sem contagem observada de requisições duplicadas ou de renders. A sessão foi preservada para evitar uma alteração de sincronização sem linha de base.

## Conclusão sobre `de4bb09`

Checkout inicial limpo. O trabalho de UX registrado na esteira foi preservado. Uma alternativa ao ensaio que expirou executou o formulário de produção no Chrome com respostas fictícias de API e atraso controlado em `/inicio`. O login disparou duas leituras de início. O provedor passou a aproveitar a leitura explícita do login e a descartar respostas e erros superados por outra leitura ou pelo logout. A recarga explícita continua disponível após mutações.

### Backend

Tempos em milissegundos no serviço Nest com PostgreSQL local. Cada célula mostra p50 e p95 de 30 chamadas após aquecimento. A referência anterior às otimizações de resumo e histórico foi `534e020`. A massa tinha 101 doses ativas. A comparação integral dos resultados passou nos quatro cenários.

| Serviço e janela | Referência p50 / p95 | Atual p50 / p95 | SQL antes → depois | Linhas de doses antes → depois |
|---|---:|---:|---:|---:|
| Resumo, 1 dia | 27,51 / 45,34 | 38,03 / 98,01 | 11 → 11 | 102 → 2 |
| Histórico de Desenvolvimento, 1 dia | 23,05 / 35,86 | 7,95 / 10,15 | 12 → 4 | 1 → 0 |
| Resumo, 326 dias | 40,29 / 87,83 | 38,52 / 74,53 | 11 → 11 | 202 → 202 |
| Histórico de Desenvolvimento, 326 dias | 30,80 / 45,19 | 16,97 / 45,05 | 12 → 4 | 101 → 0 |

O resumo curto reduziu volume, mas teve maior latência nesta rodada. As versões foram medidas em sequência numa máquina compartilhada. Os números caracterizam esta massa e incluem o tempo do serviço e do banco. PDF e transporte HTTP ficaram fora do cronômetro.

### Retenção e manutenção

Uma cópia dos arquivos rastreados omitiu os seis candidatos inventariados acima. O bootstrap passou nas 42 verificações. `git check-ignore` confirmou a cobertura de `tmp/` e das saídas locais de texto e imagem. Os seis logs foram removidos após autorização humana e nova conferência de conteúdo e referências. A cópia temporária de validação também foi removida. Nenhum novo padrão foi necessário.

A duplicação no login teve prioridade alta, risco médio e esforço baixo. As medições não justificaram decompor o painel administrativo, alterar o cliente HTTP ou adicionar cache de permissões. A janela extensa continua com memória proporcional ao número de ocorrências previstas.

**PERF-04.** No desktop e em 375 × 812 emulados, o login passou de 3 para 2 chamadas à API simulada: uma criação de sessão e uma leitura da home. Os commits da raiz React durante a jornada foram 15 → 14 no desktop e 15 → 15 no móvel, uma execução por versão e viewport. São atualizações da árvore, não contagens de renderização de cada componente. O teste controlado de concorrência passou para falha antiga, sucesso da leitura mais recente e logout durante uma leitura. Build com verificação de tipos, lint do provedor, regressões E1 de autorização e jornadas, E2, E4, E5, lote de lembretes e revisão independente passaram. A aplicação continua usando a API real nas regressões de backend. A medição de frontend usou respostas simuladas.

**Estado final.** Auditoria técnica concluída. A retirada autorizada dos seis logs está registrada no inventário acima. O ensaio com autenticação integrada que expirou continua registrado como limitação da medição de frontend.
