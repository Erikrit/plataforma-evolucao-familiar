# Revisão de UX — Módulo 03: Desenvolvimento da Laurinha

**Referência:** `develop` em `47eb820cbe870fb2694c8d1616189d0392b283bc`; direção de UX aprovada pelo responsável do produto em 2026-11-18.  
**Status:** **APROVADA COMO DIREÇÃO DE DESIGN**, não implementada/homologada por esta revisão.  
**Fonte funcional:** `docs/modulos/03-desenvolvimento-laurinha/ESPECIFICACAO.md` v1.1; **padrão de UX:** `docs/ux-ui/GUIA-DE-EXPERIENCIA.md` § Desenvolvimento.  
**Proposta substituída:** protótipo que alternava modos Integrante/Responsável para Desenvolvimento; a duplicidade não agregava valor ao uso cotidiano.

## Decisão validada

**Desenvolvimento é uma experiência única para quem possui autorização contextual**, sem seletor nem telas paralelas por perfil. A interface principal é centrada nas brincadeiras da Laurinha, participação presencial e reconhecimento da experiência. O Responsável legitimamente autorizado a organizar encontra **ações adicionais** de criação e gerenciamento em segundo plano; não precisa trocar de modo. Outros adultos autorizados acessam apenas o que podem fazer. **A experiência visual não concede acesso novo**, em especial ao Administrador ou à colaboradora externa da Vovó.

### Fluxo principal aprovado como direção

1. **Explorar / Guardadas:** lista de brincadeiras autoexplicativas e seleção direta; marcador simples de guardada, sem atraso ou obrigação.
2. **Abrir brincadeira:** nome e instrução curta, dificuldade/categoria se ajudarem, materiais opcionais; não exigir criação de planejamento.
3. **Registrar participação:** **Concluiu** ou **Participou** com iconografia distinta de confirmação de medicamentos, observação opcional e estados acessíveis; sem opção de não realizada.
4. **Reconhecimento:** estrelas calculadas e persistidas exclusivamente conforme DEV-F05; feedback apenas depois da resposta efetiva, sem duplicar pontos após retry.
5. **Organização contextual:** criar brincadeira (nome mínimo, dificuldade simples por padrão) e gerenciar recompensas somente quando a operação estiver autorizada, afastadas da lista principal.
6. **Histórico/Evolução:** consultar via Módulo 04, sem outro cadastro.

## Evidência e limites da implementação atual

Inspeção estática de `apps/web/src/app/pessoas/[pessoaId]/desenvolvimento/page.tsx`: já há `Explorar`/`Guardadas`, cartões, drawer de detalhes, escolhas `Concluiu`/`Participou`, saldo, resgate e criação. O código atual também reúne estrelas, atalho de histórico e dois formulários em accordions no conteúdo da página: reorganizar com o mínimo de mudança, **não reimplementar**. Auditar permissões efetivas para criação, participação e recompensas; a existência de botões não demonstra autorização. Sem testes executados ou homologação humana nesta revisão.

## Critérios UX para a implementação posterior

- [ ] Mesma experiência de explorar, abrir e registrar para qualquer adulto legitimamente autorizado.
- [ ] Não há seletor Integrante/Responsável nem telas duplicadas do módulo 03.
- [ ] Criação e gestão são ações secundárias, aparecendo somente para quem tem autorização de operação; acesso direto pelo backend protegido.
- [ ] Cartões são legíveis em mobile, com ícones úteis e sem explicações repetidas.
- [ ] `Concluiu` e `Participou` são claros, lúdicos e distintos de relato de medicamento.
- [ ] Observação permanece opcional; ausência não gera atraso, culpa ou redução de estrelas.
- [ ] Pontuação é automática e servidor-confirmada, idempotente na mesma execução; resgates não duplicam nem geram saldo negativo.
- [ ] Histórico é reutilizado; não há nova base ou entrada de dados duplicada.
- [ ] Privacidade infantil protegida por autorização contextual, inclusive em URL e API.

## Próxima decisão de UX

**VALIDADO em 2026-11-18 pelo responsável do produto.** Resultado alegre porém discreto, pontos somente após persistência, saldo compacto e recompensas opcionais em área secundária, com gerenciamento separado e sempre sujeito à autorização. Próximo encaminhamento recomendado: reconciliação com a implementação do Módulo 03 e execução incremental das diferenças via esteira existente, mantendo homologação humana posterior obrigatória.

## Aprovação integrada — reconhecimento, estrelas e recompensas (2026-11-18)

**Status: DIREÇÃO UX APROVADA E DOCUMENTADA**, complementando a experiência única já aprovada. **Não é homologação da interface implementada.**

1. **Reconhecimento de uma brincadeira:** a pessoa adulta registra `Concluiu` ou `Participou` conforme DEV-F04; somente quando o servidor confirma a operação e o movimento de estrelas, mostrar retorno afetivo e breve com nome da brincadeira, resultado e estrelas **de fato concedidas**. O feedback não substitui a informação acessível por texto e não presume que `Participou` seja fracasso. Em caso de erro ou dúvida de gravação, não afirmar conquista; retry não pode creditar duplicado.
2. **Saldo compacto:** mostrar as estrelas disponíveis de forma simples junto à área de atividades, evitando cartões/explicações excessivos, rankings, metas compulsórias ou incentivo a completar tarefas por cobrança. Quantidade exibida deriva de leitura autorizada e atualizada.
3. **Recompensas opcionais:** acessar a lista de recompensas em contexto secundário; visualizar nome e custo de forma compreensível e distinguir **resgatar** de **gerenciar**. Nenhuma recompensa é condição para participar ou ganhar estrelas. Um resgate só é declarado concluído após resposta persistida, validação de saldo e confirmação proporcional, protegendo custo histórico e evitando duplicação.
4. **Organização autorizada:** cadastrar brincadeiras e recompensas somente se a operação for permitida; não repetir formulários na área principal nem criar alternância Integrante/Responsável. O módulo tem **uma experiência** com ações conforme autorização. O Administrador não herda automaticamente acesso aos dados da criança, nem a colaboradora externa da Vovó.
5. **Conferência na implementação:** preservar tabelas de DEV-F05, idempotência, observação opcional, acessibilidade, linguagem lúdica e simples, e histórico via Módulo 04. Para ações sem suporte de autorização granular visível no contrato, solicitar análise arquitetural, sem inventar permissões.

**Critérios complementares de aceite UX:**

- [ ] Um registro confirmado produz um único feedback de estrelas com pontuação retornada pelo servidor; um erro não produz conquista fictícia.
- [ ] Resultado `Concluiu` e `Participou` têm identidade acessível e não confundem criança com avaliação/punição.
- [ ] Saldo é pequeno, legível e atualizado após participar ou resgatar; nenhuma explicação redundante na tela principal.
- [ ] Recompensas são opcionais, secundárias, com escolha/resgate distintos de cadastro/gestão; a autorização é validada no servidor.
- [ ] Não há alternância de perfil, obrigatoriedade de resgate, cronômetro, ranking ou metas de produtividade.
- [ ] A implementação é verificada em mobile, com rede lenta, duplo clique/reenvio e acessibilidade; **aceite humano posterior não pode ser inferido dos testes técnicos**.

**Próxima etapa:** preparar correções incrementais do Módulo 03 a partir do código real, pela triagem `task-routing` e `implementation-workflow`, sem autorizar commit/push/deploy pela esteira. Outras pendências administrativas do Módulo 01 permanecem adiadas, conforme o aceite parcial anterior.

## Reprovação humana — 2026-11-19: categorias, cadastros, executadas e resgates

**Status: REPROVADA / PROPOSTA CORRETIVA EM ANÁLISE.** O responsável do produto rejeitou a experiência implementada do Módulo 03 e relatou quatro mudanças desejadas. **A implementação mais recente deve ser reconciliada com o workspace da esteira**, pois a referência documental desta revisão é `develop` em `f498694a391f008f0d244caf2b892832d3c146d7`, sem evidência da entrega recém-avaliada.

### Proposta de organização de UX

**A. Brincadeiras:** oferecer categorias de desenvolvimento como agrupamento/filtro claro (não uma nova tela por categoria), com nomes compreensíveis: **Raciocínio lógico**, **Coordenação motora / movimento**, **Memória e atenção**, **Linguagem**, **Criatividade**, **Autonomia**. A lista existente de categorias técnicas é `memoria_atencao`, `raciocinio`, `linguagem`, `criatividade`, `coordenacao`, `autonomia` (`apps/api/src/desenvolvimento/constantes-desenvolvimento.ts`). **Priorizar rótulos compreensíveis e agrupamento reaproveitando essas categorias**, sem introduzir enum/“Mobilidade” como sétima categoria técnica por dedução. A pessoa pode explorar todas as atividades e filtrar por uma categoria, sem classificação clínica, telas extras nem exigência de preenchimento adicional para brincadeira personalizada (DEV-F02).

**B. Cadastros:** deslocar **Nova brincadeira** e **Nova recompensa** para uma seção secundária de **Cadastros**, ligada ao contexto da Laurinha e exibida somente se a operação estiver autorizada. Na criação de brincadeira, disponibilizar seletor de categoria com as opções vigentes, preservando a opcionalidade funcional até decisão distinta; nome continua campo mínimo e dificuldade simples padrão. **Não transformar categoria em obrigação por decisão de UX.** Não duplicar formulário na lista principal nem criar novo módulo administrativo.

**C. Executadas:** substituir a segunda aba **Guardadas** por **Executadas**, exibindo brincadeiras com participação confirmada. Após o registro real de `Concluiu` ou `Participou`, a atividade deve aparecer em Executadas. Propor opção contextual **Disponibilizar novamente / Reativar** para o Responsável autorizado, preservando todas as participações, pontos e autoria anteriores. **Não confundir um estado da lista com a ocorrência histórica:** a mesma brincadeira pode ser realizada novamente e gerar outra ocorrência legítima; a operação de reativar não pode cancelar histórico nem devolver estrelas. Definir com Produto e Arquitetura se a separação exige estado persistido por pessoa/atividade ou se pode ser projetada sem ambiguidade a partir de participações e um marcador de disponibilidade. A semântica atual de `Guardadas` como favoritos/planejamento opcional (DEV-F03) **não pode simplesmente ser sobrescrita sem reconciliação funcional e migração/compatibilidade de dados existentes**.

**D. Recompensas e resgates:** apresentar no submenu contextual **Recompensas** duas abas **Disponíveis** e **Resgatadas**, distinguindo itens elegíveis de ocorrências já resgatadas. Uma recompensa já resgatada pode ser escolhida para **resgatar novamente** quando houver saldo e autorização, criando um **novo resgate**, nunca reutilizando/substituindo o registro antigo. A aba Resgatadas pode exibir **histórico de ocorrências** agrupado por recompensa para evitar duplicidade visual. Não inferir que o resgate antigo “devolve” a recompensa ao catálogo, nem que um novo resgate é grátis. Cadastro e manutenção de recompensas ficam em Cadastros, não na tela de resgate. O backend já possui `ResgateRecompensa` e custo histórico em `servico-recompensas.ts`, mas a API atual inspecionada não expõe listagem de resgates; **Arquitetura deve avaliar o menor contrato adicional ou reaproveitamento do Histórico do Módulo 04, sempre com autorização**.

### Encaminhamentos entre especialidades — governança

| ID | Natureza | Encaminhamento | Estado |
|---|---|---|---|
| `DEV-UX-HOM-01` | UX + taxonomia | Validar agrupamento e rótulos sem modificar categorias técnicas por suposição; avaliação de nomes mais amigáveis | Proposta para consolidação UX |
| `DEV-UX-HOM-02` | UX | Separar cadastros das brincadeiras e das recompensas, respeitando autorizações existentes | Proposta para consolidação UX |
| `CT-20261119-001` | **Produto + Arquitetura, L3** | Substituição funcional de `Guardadas` por `Executadas`, estado automático após participação, reativação e compatibilidade dos guardados existentes; atualizar DEV-F03/F04 apenas após aprovação funcional da semântica | **NEEDS_DECISION** |
| `CT-20261119-002` | **Produto + Arquitetura, L3** | Disponíveis/Resgatadas, reutilização legítima, custo por novo resgate, fonte autorizada dos resgates e compatibilidade DEV-F06; especificar se “disponíveis” são catálogo ativo elegível ou recompensas nunca resgatadas | **NEEDS_DECISION** |

### Critérios de validação humana propostos

- [ ] Brincadeiras são localizáveis por categorias compreensíveis sem telas excessivas.
- [ ] Criação de brincadeiras/recompensas está fora da navegação cotidiana; ações não autorizadas não aparecem.
- [ ] Categoria da brincadeira oferece opções vigentes, sem inventar classificação clínica; obrigatoriedade somente se aprovada funcionalmente.
- [ ] Executadas reflete registro realmente persistido; reativação não apaga histórico, não reverte pontos e respeita autorização.
- [ ] Guardados existentes não são perdidos silenciosamente; migração/compatibilidade é explicitamente tratada.
- [ ] Recompensas Disponíveis/Resgatadas mostram situações inteligíveis e custo de novo resgate; histórico permanece íntegro.
- [ ] Sem resgate duplicado por duplo clique/rede lenta; saldo jamais negativo; autorização verificada no backend.
- [ ] Uso confortável no celular, sem textos excessivos, sem cobrança à criança, com retorno de erro acessível.

**Próximo passo recomendado:** Produto consolidar as duas decisões L3 (CTs), Arquitetura comparar estado/contratos reais com a implementação atual; então UX finalizar o fluxo e a esteira executar apenas os incrementos aprovados com verificação independente e nova homologação humana. **Não implementar imediatamente as mudanças L3 a partir desta revisão de UX.**

## Detalhamento de proposta — 2026-11-19 (ainda não aprovado como regra funcional)

**Status: PROPOSTA PARA DELIBERAÇÃO; sem autorização para implementar as mudanças funcionais.** Consolida a discussão dos CTs `CT-20261119-001` e `CT-20261119-002` e separa UX de regras a serem aprovadas pelo Produto. Inspeção de `develop` em `64e175533711a6eaa38016115dd7bc292fc4e0bd`, que pode não conter a implementação humana mais recente.

### Organização da navegação

- **Brincadeiras**: abas `Explorar` e `Executadas`; filtro por categoria sobre a aba corrente. Categorias visuais existentes: Raciocínio lógico (`raciocinio`), Coordenação motora (`coordenacao`), Memória e atenção (`memoria_atencao`), Linguagem, Criatividade, Autonomia. Não criar categoria técnica extra para “mobilidade” sem necessidade demonstrada. Brincadeira sem categoria deve continuar encontrável em “Todas”.
- **Recompensas**: abas `Disponíveis` e `Resgatadas`, saldo compacto e ações contextuais; sem cadastrar recompensas nesse fluxo.
- **Cadastros**: `Nova brincadeira` e `Nova recompensa` como entradas secundárias, visíveis por operação autorizada. Categoria da brincadeira é escolha opcional até eventual decisão funcional em contrário; não adicionar CRUD de categorias.

### CT-20261119-001 — comportamento de Executadas e reativação

**Proposta de regra:**
1. `Explorar` mostra atividades atualmente disponíveis para novas execuções; `Executadas` lista atividades com pelo menos uma participação salva e ainda não disponibilizadas novamente.
2. Uma nova participação `Concluiu` ou `Participou`, **após confirmação do servidor**, coloca a atividade em `Executadas` e a retira de `Explorar` como disponível. Erro ou envio incerto não provoca transição fictícia.
3. A ação autorizada **Disponibilizar novamente** marca a atividade disponível para outra execução. Não apaga a execução, não altera créditos nem elimina seu histórico. Uma nova participação legítima cria uma ocorrência distinta e volta a marcar a atividade como executada.
4. No card executado, mostrar `última participação` e permitir consultar outras ocorrências via Histórico do Módulo 04. Não duplicar o banco de histórico nem listar a mesma brincadeira como N cards.
5. **Migração/compatibilidade:** `DesafioGuardado` atual representa favoritos, e não execuções. **Não renomear `guardado` como `executado` nem descartar dados.** Arquitetura deve avaliar estado persistido por pessoa/desafio e destino compatível dos favoritos legados, inclusive como preservá-los fora da nova aba. Operação de reativação só deve aparecer quando houver autorização de gestão efetiva; não inventar papel novo.
6. Exceções: mesma execução enviada duas vezes não duplica registros/estrelas; atividade realizada novamente após reativação pode gerar nova participação; alterações/correções de participações precisam recalcular disponibilidade de modo consistente, sem modificar histórico de forma destrutiva.

**Decisão de Produto ainda necessária:** confirmar se executadas deixam de aparecer em `Explorar` até reativação e o que fazer com favoritos legados.

### CT-20261119-002 — recompensas e reutilização

**Proposta de regra:**
1. `Disponíveis` apresenta recompensas ativas liberadas para o próximo resgate; `Resgatadas` mostra itens já utilizados e ainda não disponibilizados novamente, com último resgate, custo aplicado e contagem/histórico de ocorrências autorizadas.
2. Após resgate válido e persistido, a recompensa passa para `Resgatadas`; mostrar saldo atualizado. Resgate anterior **não** é reversível por essa ação.
3. **Disponibilizar novamente** é uma ação de organização, distinta de resgatar; move a recompensa para `Disponíveis` sem alterar saldo, créditos, registros ou custo de resgates passados. Novo resgate da mesma recompensa gera uma nova ocorrência e **novo débito** com custo vigente apresentado e confirmado. Não conceder resgate grátis.
4. Histórico de resgates preserva `custoAplicado`, autor/data e vínculo com recompensa. Ao reutilizar, não substituir a ocorrência anterior; uma recompensa pode ter vários resgates legítimos.
5. Validar saldo e autorização no servidor, com proteção contra envio duplicado e concorrência. A API atual expõe `GET /pessoas/:pessoaId/estrelas` com `resgatesRecentes` e `GET recompensas`, mas **não comprova** listagem completa nem semântica de disponibilidade pós-resgate; Arquitetura deve propor menor contrato compatível com Histórico do Módulo 04, sem expor dados infantis extras.
6. Nenhuma recompensa é obrigatória; não associar afeto, descanso, alimentação ou cuidados básicos a pontos.

**Decisão de Produto ainda necessária:** confirmar o significado das abas como estados mutuamente exclusivos do próximo resgate (proposta) versus histórico de todos os resgates independente de disponibilidade; definir quem pode disponibilizar novamente conforme autorização já existente.

### Verificações para a futura esteira

- Filtros por categoria, estado vazio e ausência de categoria; formulários de cadastro secundários e autorizados.
- Transição de atividade apenas após persistência, reativação sem apagar histórico/pontos, compatibilidade com `guardados` legados, múltiplas participações legítimas e idempotência.
- Transição de recompensa apenas após resgate persistido, novo resgate com novo débito, recuperação após falha/reenvio, concorrência e saldo não negativo.
- Autorização/URL direta, privacidade infantil, telas 320/375/390/1280px, teclado e leitura acessível.
- **Homologação humana continua REPROVADA até novo aceite.**

**Bloqueio:** não alterar `docs/modulos/03-desenvolvimento-laurinha/ESPECIFICACAO.md` DEV-F03/DEV-F04/DEV-F06 nem iniciar implementação das transições propostas enquanto a decisão L3 não for explicitamente aprovada.

## Deliberação funcional recebida — 2026-11-19

**Responsável pelo Produto aprovou expressamente:**

- **CT-20261119-001 — APROVADA/DOCUMENTADA (L3):** após `Concluiu` ou `Participou` efetivamente persistido, a brincadeira sai de `Explorar` e entra em `Executadas`. Só retorna a `Explorar` após `Disponibilizar novamente` autorizado; histórico, estrelas e autoria não são apagados.
- **CT-20261119-002 — APROVADA/DOCUMENTADA (L3):** `Recompensas > Disponíveis` e `Resgatadas` são estados separados. Reativar/disponibilizar permite outro resgate **cobrado novamente**, como nova ocorrência; nenhum resgate anterior é substituído, estornado ou deletado. Proteção contra débito duplicado e saldo negativo é obrigatória.

**Fonte canônica atualizada:** `docs/modulos/03-desenvolvimento-laurinha/ESPECIFICACAO.md` v1.2 (DEV-F03/F04/F06, fluxos, estados e critérios). As notas anteriores neste documento indicadas como `NEEDS_DECISION` ou `PROPOSTA` são histórico **superado somente para as duas decisões expressamente aprovadas**. Permanecem dependências de Arquitetura para modelo de estado, dados legados de Guardadas, contratos de operações de reativação, API/histórico, concorrência e idempotência. Não confundir com autorização para modificar privilégios ou descartar dados.

**Arquitetura:** `ADR-013` registrada (`docs/arquitetura/DECISOES.md`) — disponibilidade separada do histórico; Guardadas retidas; reativação em `responsavel_desenvolvimento`; sem ampliar privilégio. **Próxima etapa:** `implementation-workflow` demanda `DEM-CT-20261119-001-002` e nova homologação humana. Status UX do Módulo 03 continua **REPROVADA**, mesmo com especificação e ADR aprovadas.

## Nova reprovação humana — 2026-11-19: navegação estável, submenu Cadastros e categorias

**Estado: REPROVADA / CORREÇÃO DE UX NECESSÁRIA.** O responsável pelo produto testou a implementação após CT-20261119-001/002 e relatou três problemas que impedem o aceite humano. **Referência do código inspecionado:** `develop` em `28c32fa4038a497fbcb74cf5ecf4047f465c5dee`. Os três ajustes abaixo são de interação/organização compatíveis com as regras funcionais v1.2 e ADR-013; não reabrir os CTs nem alterar estrelas, estado persistido ou permissões.

### DEV-UX-HOM-R3-01 — Preservar aba do usuário

- **Participação:** ao confirmar `Concluiu` ou `Participou` em Explorar, a atividade muda de disponibilidade e passa a Executadas **nos dados**, mas a aba **continua Explorar**. O item desaparece da lista atual, exibir feedback curto de sucesso e atualizar o saldo; não conduzir o usuário automaticamente a Executadas.
- **Resgate:** ao confirmar resgate em Recompensas > Disponíveis, o item passa a Resgatadas **nos dados**, mas a aba continua **Disponíveis** e o saldo é atualizado; não navegar automaticamente.
- **Disponibilização novamente:** após reativar em Executadas ou Resgatadas, manter a aba atual, removendo o item da lista atual e indicando sucesso. O usuário pode mudar de aba voluntariamente.
- **Cadastro secundário:** ao criar uma brincadeira/recompensa, não alterar automaticamente o filtro/aba da página cotidiana; dar confirmação e preservar rota/modal de cadastro. Evitar navegação surpresa.
- **Código verificado:** `apps/web/src/app/pessoas/[pessoaId]/desenvolvimento/page.tsx` contém `setFiltro("executadas")` após registrar, `setFiltroRecompensa("resgatadas")` após resgate e mudanças análogas após reativar/criar. Corrigir a atualização da lista ativa (refetch ou atualização de cache) **sem** forçar `setFiltro`/`setFiltroRecompensa`. Tratar estado vazio sem mover o usuário.
- **Aceite:** conservar aba, scroll/foco quando viável, sem item com estado anterior; sucesso só após persistência e sem duplicaçōes.

### DEV-UX-HOM-R3-02 — Cadastros no menu lateral contextual

- O destino **Cadastros** deve ser **submenu lateral sob Desenvolvimento**, usando o mesmo AppShell/Drawer global (inclusive em celular). Oferece `Nova brincadeira` e `Nova recompensa` e seus formulários em rotas/visões secundárias; **não** em accordions ou cartões na página de brincar/resgatar.
- Não introduzir gestão familiar em Desenvolvimento, nem um segundo menu de navegação dentro da página. **Somente renderizar destino e ações com autorização real de organização**; a API deve validar as operações independentemente da navegação.
- **Código verificado:** `navegacao-app.tsx` inclui apenas entrada simples Desenvolvimento; `desenvolvimento/page.tsx` ainda contém formulários `Cadastros · Nova brincadeira` e `Cadastros · Nova recompensa`.
- **Aceite:** no desktop e Drawer mobile, submenu contextual coerente; usuário sem organização vê somente a experiência cotidiana; URL direta bloqueada em operação não autorizada; sem reintroduzir duplicação de formulários.

### DEV-UX-HOM-R3-03 — Categorias operacionais na biblioteca e no cadastro

- Expor **filtro/agrupamento visível** de categorias na tela Explorar, com opção **Todas**, sem páginas redundantes. Rótulos amigáveis reaproveitando os códigos atuais: `raciocinio` (Raciocínio lógico), `coordenacao` (Coordenação motora), `memoria_atencao` (Memória e atenção), `linguagem` (Linguagem), `criatividade` (Criatividade), `autonomia` (Autonomia).
- No formulário **Nova brincadeira**, oferecer `Select` de categoria (opcional conforme DEV-F02), preservando categoria no envio e na leitura. A escolha não altera pontuação, só classificação. Brincadeiras sem categoria ficam visíveis em Todas. Não criar CRUD de categorias nem novo enum por especulação.
- **Código verificado:** `desenvolvimento/page.tsx` apresenta categoria no cartão, mas não possui filtro visível; criação envia `nome`, `dificuldade`, `instrucao` sem `categoria`. O backend já oferece validação de categorias e parâmetro de filtro; reconciliar DTO/contrato real antes de alterar.
- **Aceite:** filtrar realmente os itens, inclusive ao retornar às abas; categoria selecionada fica persistida e é exibida, vazio/erro coerentes; sem filtro clínico ou obrigação adicional.

### Plano pequeno de execução

1. Triar como **correção UX delimitada**, priorizando preservar abas e atualizações de estado sem regressão da ADR-013.
2. Ajustar a navegação lateral e mover formulários existentes, sem criar funcionalidades novas.
3. Conectar categoria existente ao filtro e à criação, reutilizando APIs/códigos vigentes.
4. Verificar com `quality-gate` e `verifier`: sessão/URL direta, permissão de gestão, transição das listas, idempotência e saldo, mobile/desktop (320/375/390/1280), acessibilidade e retorno de rede; evidências reais.
5. **Manter homologação humana do Módulo 03 REPROVADA até novo teste e aceite expresso.** A primeira revisão transversal de UX permanece homologada somente no escopo próprio.

**Separação de autoridades:** não alterar DEV-F03/F04/F06, ADR-013 ou autorizações por estética. Se aparecer contrato ausente que exija alteração funcional, escalar pontualmente a Produto e Arquitetura, sem bloquear os demais ajustes.

## Encerramento da revisão R3 — aceite humano em 2026-11-19

**Status: HOMOLOGADA PELO RESPONSÁVEL DO PRODUTO NO ESCOPO DA UX DO MÓDULO 03.** Após as correções de `DEV-UX-HOM-R3-01..03`, foi comunicada aprovação humana expressa. Inspeção documental da `develop` em `7dad200a85feb5b2534b941ad31581089f941812` confirma a presença de categorias/filtros, Cadastros em rota e menu lateral contextual, e ausência de troca automática de aba após operações principais. A esteira registra `DEM-UX-HOM-R3-20261119` concluída tecnicamente; testes não reexecutados nesta atualização.

**Critérios da rodada aceitos:** (1) o item muda de disponibilidade, não a aba do usuário, tanto em participações quanto em resgates e disponibilizações; (2) cadastros de brincadeiras e recompensas têm destino secundário contextual; (3) categorias de desenvolvimento são filtros operacionais e opção de criação sem obrigatoriedade extra. Rótulos, categoria e autorização permanecem sujeitos às fontes funcionais e arquiteturais vigentes.

**Preservação do histórico:** os registros anteriores de `REPROVADA` e `PENDING_HUMAN` descrevem rodadas anteriores e **não são o estado atual dessa homologação**. O aceite não certifica segurança, privacidade em produção, implantação, todos os dispositivos ou o Módulo 04. Próxima etapa de UX: avaliar Histórico, Resumo e relatórios do Módulo 04, sem reabrir os ajustes homologados do 03 salvo regressão comprovada.
