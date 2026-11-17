# Revisão de UX — módulos implementados 01 e 02

**Referência auditada:** branch `develop` (2026-11-15).  
**Estado:** correções UX-01..UX-14 implementadas; QG-3 local PASS (capturas emuladas + smokes). Homologação com usuários/dispositivos reais e ACE-C12 ainda pendentes.  
**Tipo de evidência:** implementação local + typecheck/build + capturas emuladas; não confundir com homologação em aparelho físico do usuário.  
**Guia transversal:** `docs/ux-ui/GUIA-DE-EXPERIENCIA.md`.  
**Fonte de status corrente:** `docs/produto/STATUS-E-ESCOPO.md` e `docs/esteira/estado/atual.json`.  
**Evidência QG-3:** `docs/esteira/estado/evidencia-qg3-ux-01-02.json`.

## Regras de execução

Corrigir somente o que estiver dentro do comportamento funcional vigente. Reutilizar rotas/componentes e não ampliar escopo. Toda correção preserva dados, histórico, permissões, privacidade, respostas de API e exceções da especificação. Quando a UI atual estiver desalinhada da especificação, marcar dependência funcional existente e não inventar contrato.

## 01 — Fundação Familiar

| ID | Evidência no código | Problema/impacto | Recomendação UX | Prioridade | Natureza |
|---|---|---|---|---|---|
| UX-01 | `apps/web/src/app/page.tsx` e `componentes/painel-fundacao.tsx` | Título e texto introdutório parecem bootstrap; administração ocupa a home antes dos cartões | Home 'Nossa família' com cartões das pessoas permitidas em primeiro lugar, detalhes úteis só se disponíveis; administração sob 'Gerenciar família' | Alta | UI dentro da especificação |
| UX-02 | `painel-fundacao.tsx` | Cadastro, convites, ativação e autorizações todos na mesma tela geram rolagem e distração | Entrada administrativa secundária; formulários sob demanda; manter convite/ativação existentes | Alta | UI; verificar autorização existente |
| UX-03 | `painel-fundacao.tsx` mostra `id:`, `FF-04`, `FAM-R10`, `ACE-05`, `Token:` | Jargões e identificadores confundem o público familiar | Textos claros; identificadores técnicos fora da experiência regular; manter fluxo seguro de ativação | Alta | UI; não alterar contrato de convite |
| UX-04 | `apps/web/src/app/pessoas/[pessoaId]/page.tsx` | 'Perfil' genérico e formulário de vínculo antes das áreas | Nome e áreas autorizadas em destaque; editar vínculo opcional em segundo plano; opção indisponível com contexto útil, sem navegação quebrada | Média | UI |
| UX-05 | `apps/web/src/app/convites/ativar/page.tsx` | Token exposto como campo mesmo quando URL tem token; fluxo pouco contextual | Quando presente na URL, preencher sem exigir redigitação; explicar passo, erro/expiração e próximo passo após ativação | Média | UI; regras de token continuam as existentes |
| UX-06 | `apps/web/src/app/globals.css` | Paleta bege/verde antiga, variações e estrutura visual limitada | Migrar incrementalmente para tema Azul Contemporâneo/densidade confortável com componentes Mantine após validação | Alta | UI |

**Fluxos alvo:** entrar → pessoas autorizadas → perfil → área autorizada; administrador → Gerenciar família → adicionar pessoa/convite/autorização; convite → ativação → entrada. Nenhuma nova permissão derivada da organização visual.

## 02 — Cuidados da Vovó

| ID | Evidência no código | Problema/impacto | Recomendação UX | Prioridade | Natureza |
|---|---|---|---|---|---|
| UX-07 | `apps/web/src/app/pessoas/[pessoaId]/cuidados/page.tsx` | Rotina e três formulários de criação na mesma tela | Hierarquia aprovada: rotina de hoje → outros cuidados → gerenciar cuidados; formulários apenas sob demanda para autorizados | Alta | UI; verificar operações permitidas |
| UX-08 | mesma página, `proximoCuidado` em seção informativa | Próximo cuidado está destacado mas não é acionável como cartão | Tornar destaque um ponto de entrada para a mesma escolha de relato do cartão; não registrar ao tocar | Média | UI |
| UX-09 | mesma página, `role="dialog"` em painel inline | Diálogo marcado como modal sem gestão completa de foco/fechamento; risco de acessibilidade | Usar Drawer/Modal acessível, com foco inicial, contenção/retorno de foco, Escape e cancelamento, incluindo tela pequena | Alta | UI |
| UX-10 | mesma página, ações `confirmarRelato` sem bloqueio próprio durante envio | Possíveis reenvios rápidos e feedback distante do contexto | Estado 'Registrando…', bloquear repetição de toque e mostrar feedback local apenas após persistência; não ocultar erro | Alta | UI/robustez, sem mudar regra de idempotência |
| UX-11 | mesma página, `horarios.split(",")` | Entrada de horários por vírgula é trabalhosa e não atende integralmente o cadastro da especificação v1.3 | Desenhar campos nome, primeiro horário, doses/dia, duração, conferência dos horários prescritos e opções avançadas progressivas, **sem inventar cálculo** | Alta | UX amparada por especificação; depende de contrato existente/adequação funcional |
| UX-12 | mesma página, listas e títulos de consultas/apoio | Informações e cadastros misturados; consulta não mostra data na listagem | Separar leitura das ações de criar, tornar data/hora legíveis onde fornecidas, priorizar próximo compromisso relevante | Média | UI |
| UX-13 | `apps/web/src/app/pessoas/[pessoaId]/historico/page.tsx` | Lista simples, sem agrupamento temporal nem data exibida; traz código `ADR-009` | Lista cronológica legível com data/hora (campo `quando` existente), tipos em linguagem familiar, vazio orientativo e retorno ao contexto da pessoa | Média | UI |
| UX-14 | mensagens `erro`/`sucesso` e `carregando` distribuídas nas telas | Feedback e estados inconsistentes | Padronizar loading, erro, sucesso, disabled, recuperação e apresentação local; não mostrar sucesso sem gravação confirmada | Alta | UI/robustez |

**Fluxos alvo:** pessoa → rotina do dia → cartão de dose → escolha explícita → aguardar gravação → atualização; outro cuidado → consulta/apoio; responsável → gerenciar programação autorizada; histórico da pessoa → acontecimentos por data.

## Dependências e limites

- **Produto/funcional já aprovado:** cadastro de medicamento v1.3; lembretes e segurança. Não reabrir a decisão funcional; identificar lacuna de API/código separadamente na esteira. Não deduzir intervalos clínicos pela quantidade de doses.
- **Produto se surgir novidade:** novas permissões, destinatários de lembretes, edição/suspensão, lógica de frequência, políticas de registro e visibilidade de dados de crianças/saúde. Preparar prompt separado para conversa de Produto, **sem bloquear melhorias visuais independentes**.
- **Engenharia e segurança:** sessão/autorização e testes de regressão pertencem à implementação/qualidade. UI não deve contornar restrições mesmo se uma rota parecer acessível.
- **Exames, PDFs, lembretes e edição** podem estar parciais/ausentes na UI; não considerá-los implementados apenas por estarem descritos. Não adicionar atalhos inoperantes.
- **Validação real pendente:** capturas de telas de 320/375/390px e desktop, teclado, leitores de tela, estados de erro de rede, perfis responsável/Vovó/colaboradora. Sem dados reais de crianças ou saúde.

## Critérios de aceite por módulo

**01:** a home apresenta pessoas autorizadas antes de administração; administrar exige o acesso permitido; cadastro só com nome; convite é compreensível; perfil traz áreas existentes; sem identificadores técnicos em interface usual; layout funcional em desktop e celular.

**02:** rotina abre primeiro, sem formulários permanentes; próximo cuidado pode abrir opções; cartão não confirma sozinho; relato oferece as duas opções e cancelar; aguardar persistência antes de sucesso; erro de rede não altera aparência para 'tomou'; não repetir envio; consulta/apoio legíveis; histórico mostra quando e o que aconteceu; Vovó/colaboradora veem somente o permitido.

## Ordem recomendada

1. Fundamentos visuais e estados compartilhados.
2. Página inicial + perfil + administração/convites.
3. Rotina + diálogo de relato + feedback e prevenção de envio duplicado.
4. Consultas, apoio, histórico e formulários de gerenciamento.
5. Cadastro de medicamentos v1.3 somente com as dependências funcionais claramente identificadas.
6. Verificação UX integrada em celular/desktop, por autorização, rede e acessibilidade.

Não considerar terminado sem capturas reais e verificação dos critérios; execução técnica, alteração de código e gestão da esteira são externas à conversa de UX.

## Revisão integrada de navegação e administração — 2026-11-16

**Origem:** testes exploratórios relatados pelo responsável pelo produto (menus confusos, componentes pouco organizados, baixa interatividade e dificuldade em permissões), complementados por inspeção estática de `develop` no commit `a17f4a311ab5724690536895196673488971cc67`. **Não é homologação de uso.** Esta revisão é adicional às correções históricas UX-01..UX-14 já implementadas; não reabrir esses itens como se fossem pendentes.

**Decisões de UX aprovadas:** navegação compartilhada `AppShell` no desktop e `Drawer` no celular; navegação contextual por pessoa selecionada; menu administrativo único **Gerenciar família**, com seções Pessoas, Acessos e permissões e Convites; sem ferramentas de administração repetidas em telas de acompanhamento; operações cotidianas de cuidados e desenvolvimento continuam dentro de cada módulo. Ver `GUIA-DE-EXPERIENCIA.md` §4.1–4.2.

### Correções de UX a planejar (não implementadas por esta documentação)

| ID | Escopo | Evidência/impacto | Critério de aceite de UX | Prioridade |
|---|---|---|---|---|
| UX-NAV-01 | Layout global | Páginas possuem links próprios de retorno, sem `AppShell` compartilhado | Desktop tem menu lateral; celular Drawer; navegação segura por teclado e responsiva | Alta |
| UX-NAV-02 | Contexto individual | Retornos ao perfil são necessários entre áreas | Pessoa selecionada, área ativa e links autorizados claros; retorno à família sem labirinto | Alta |
| UX-ADM-01 | Administração | `painel-fundacao.tsx` mistura convites, cadastro e autorizações no Accordion da home | Administração organizada em um local, sem duplicação em telas de acompanhamento | Alta |
| UX-ADM-02 | Clareza de acessos | API de início expõe principalmente autorizações do usuário atual, sem identidade de todos os autorizados | Exibir somente relações autorizadas que o contrato efetivamente suporta; completar visão de quem acompanha quem **após CT** | Alta, dependente |
| UX-CUI-01 | Cuidados | Gestão e consultas/apoio dentro de página longa | Ação cotidiana primeiro, gestão contextual sob demanda; sem alterar relato ou tratamento | Média |
| UX-DES-01 | Desenvolvimento | Estrelas, histórico e cadastros precedem biblioteca; cartão de brincadeira usa `onClick` sem semântica nativa de botão | Biblioteca/participação prioritárias; cartões teclado/foco acessíveis; regras de estrelas preservadas | Alta |
| UX-EVO-01 | Evolução | Histórico e resumo em páginas separadas com navegação própria | Acessos contextuais a Histórico e Resumo, filtros simples, retorno à pessoa | Média |
| UX-ACC-01 | Transversal | Padrões interativos distintos entre telas | Contraste/foco/ordem de teclado, estados de rede e acessibilidade verificados | Alta |

### Transferência entre especialidades — CT-20261116-001

```yaml
CT: CT-20261116-001
origem: UX
destino: Arquitetura
problema: "A interface atual não disponibiliza uma visão administrativa clara de todos os usuários autorizados, suas responsabilidades e pessoas-alvo; o início retorna principalmente autorizações do usuário autenticado."
decisao_ou_proposta: "Verificar capacidades e contratos atuais para uma visão administrativa de acessos legível e segura, sem ampliar dados ou permissões."
justificativa: "Evitar gerenciamento confuso e apresentação enganosa de quem acompanha cada pessoa."
status: PROPOSTA
impactos: [UX, ARQUITETURA, PRIVACIDADE]
dependencias: ["FUN-04", "FUN-07", "FAM-R11"]
referencias:
  - "docs/modulos/01-fundacao-familiar/ESPECIFICACAO.md"
  - "apps/web/src/lib/api.ts"
  - "apps/web/src/componentes/painel-fundacao.tsx"
  - "apps/api/src/autorizacoes/servico-autorizacoes.ts"
  - "docs/ux-ui/GUIA-DE-EXPERIENCIA.md"
branch_inspecionada: develop
commit_inspecionado: a17f4a311ab5724690536895196673488971cc67
encaminhamento: "Arquitetura deve confirmar quais leituras/identidades/operações estão autorizadas e disponíveis, identificar lacunas e devolver proposta técnica ou NEEDS_DECISION. Não alterar funcionalidade sem aval de Produto quando necessário."
```

**Observação:** `listarDoUsuario` retorna autorizações do usuário autenticado; `cartoesInicio` propaga essa lista. O serviço já possui operação de revogação, mas isto **não prova** que o fluxo/contrato de gestão total está disponível ou autorizado à interface. O CT não deve criar acesso novo, endpoint ou operação por presunção. Não gerar arquivo individual para o CT. Após resposta de Arquitetura, atualizar apenas a fonte dona da solução/UX pertinente, conforme governança.

### Decisão de Produto sobre o CT — 2026-11-16

**CT-20261116-001: APROVADO e DOCUMENTADO**, conforme `docs/modulos/01-fundacao-familiar/ESPECIFICACAO.md` v1.2, FUN-04/FUN-07. A descrição `PROPOSTA` no bloco histórico acima é o estado **da emissão original**, não a situação atual.

**Resultado funcional aprovado:** a experiência do MVP exibe somente **Administrador, Responsável e Colaborador** e a relação **quem acompanha quem**. A tela administrativa apresenta participante, pessoa acompanhada, papel e situação de acesso, sem matrizes por operação, personalizações avançadas ou dados sensíveis. Pessoa acompanhada com conta pode consultar em leitura simples quem possui acesso ativo a seus dados, sem poder de administrar; sem conta, não é obrigada a se cadastrar só para isso. A arquitetura mantém as verificações de autorização existentes, sem conceder novos acessos automaticamente.

**UX-ADM-02:** pode prosseguir com a visão simplificada acima, sujeita à implementação e validação técnica de leitura autorizada. Não exibir dados de outras famílias, nem usar a listagem como autorização de leitura clínica/infantil. Nenhuma autorização granular é solicitada à família.

### Próximo encaminhamento

1. Entregar UX-NAV-01/02 e UX-ADM-01 em incrementos pequenos via esteira existente, respeitando contratos e permissões.
2. CT-20261116-001 concluído em Produto; UX-ADM-02 passa a depender somente de consulta segura dos metadados mínimos e da validação de Arquitetura, sem nova decisão funcional por padrão.
3. Revisar UX dos módulos 02–04 após navegação compartilhada, sem recriar funcionalidades nem reabrir regras aprovadas.
4. Exigir inspeção visual em aparelhos reais, teclado/leitor de tela e perfis autorizados antes de chamar a experiência de homologada.

## Reprovação em teste de uso e redesenho proposto — 2026-11-16

**Fonte:** observações expressas do responsável pelo produto após testes com a interface. **Referência do código inspecionado:** `develop` em `e150b70eb4824ea0fedc4679610e254ed02fc5fe`. **Situação:** **UX REPROVADA** nos testes relatados; a homologação técnica `DEM-HOMOL-UX-20261116-R2` permanece `PASS` para suas verificações automatizadas, mas **não constitui aceite de experiência** nem homologação completa para dados reais.

**Achados relatados:** telas sem identidade visual suficientemente reconhecível; ausência de ícones semânticos; informação e instruções repetidas; pouca distinção entre confirmação de relato de cuidados e participação/conclusão em desenvolvimento; criação de medicamentos/consultas misturada na mesma tela da rotina; esforço de navegação e leitura desnecessário. A inspeção estática encontrou formulários no Accordion `Gerenciar cuidados` em `apps/web/src/app/pessoas/[pessoaId]/cuidados/page.tsx`, mensagens explicativas no topo das páginas e componentes visuais amplamente genéricos. Sem alegar que houve auditoria visual completa por captura em dispositivo real nesta revisão.

**Decisão de organização de UX (L2, aprovada pelo responsável pelo produto):** manter a **Rotina** de Cuidados centrada no acompanhamento, movendo criação de medicamentos e consultas para **subnavegação contextual do próprio módulo**, acessível somente aos autorizados. Reutilizar a distinção **acompanhar/consultar versus criar/administrar** nos demais módulos quando aplicável, sem transformar a navegação geral em um menu extenso e sem afastar ações de uso frequente. Diretriz primária: `GUIA-DE-EXPERIENCIA.md` §4.3.

**Plano proposto — design antes de implementar:**

| ID | Prioridade | Resultado esperado | Limites |
|---|---|---|---|
| UX-RED-01 | Alta | Definir padrões visuais reais de título, ícones, cartões, estados, botões de escolha e redução de textos repetidos | Reutilizar Mantine e tema atual; manter acessibilidade |
| UX-RED-02 | Alta | Desenhar Rotina / Medicamentos / Consultas da Vovó com ações de cadastro fora da Rotina | Preservar programação, relatos, autorizações e ações já aprovadas |
| UX-RED-03 | Alta | Desenhar biblioteca/participação da Laurinha com confirmações distintas e criação/recompensas em contexto secundário | Sem mudar estrelas, regras ou obrigatoriedade |
| UX-RED-04 | Média | Aplicar o mesmo princípio de hierarquia a Gestão familiar e Evolução, somente onde eliminar ruído real | Sem novas telas ou menus por formalidade |
| UX-RED-05 | Alta | Validar visualmente protótipos e jornadas antes de abrir incrementos técnicos; repetir avaliação humana após entrega | Não converter PASS técnico em aceite UX |

**Critérios mínimos para superar a reprovação:** tela cotidiana sem formulário de cadastro permanente; ação principal inequívoca; usuário identifica visualmente relatos e participações diferentes; sem instruções autorreferentes repetidas; ícones com texto e foco acessível; subnavegação não exige navegar por menus globais; funcionalidades e permissões preservadas. A validação requer apreciação explícita do responsável pelo produto sobre os desenhos e novo teste de uso, não apenas testes automatizados.

**Encaminhamento:** especialidade UX prepara proposta de telas concretas (primeiro Cuidados, depois Desenvolvimento); Arquitetura só é consultada se surgir alteração material de contrato/roteamento/autorização; Acompanhamento mantém a reprovação de UX aberta até evidência de novo aceite humano. Esta revisão não solicita reimplementar CT-20261116-001 nem altera regras funcionais.

### Ratificação da navegação de Cuidados e dos princípios do produto — 2026-11-16

**Decisão expressa do responsável pelo produto:** no redesenho `UX-RED-02`, **as áreas de Cuidados ficam no menu lateral contextual já existente** (e no Drawer da mesma navegação no celular). **A tela inicial de Cuidados mostra somente a Rotina**; não colocar nela abas para Medicamentos, Consultas ou Apoio, nem formulários de cadastro. Cada área secundária fica acessível por item de menu pertinente, quando autorizado. Evitar links e menus duplicados; a rotina precisa continuar acessível em poucos toques.

**Critérios inegociáveis reafirmados:** Evolução familiar (acompanhar pessoas e evolução longitudinal), Esforço mínimo (registrar rápido e sem dados repetidos), Organização sem cobrança (lembrar/incentivar sem impor obrigação). **Se alimentar o sistema for trabalhoso, será abandonado.** A fonte permanente desses princípios já é `docs/produto/DOCUMENTO-MESTRE.md` §2; a aplicação específica como critério UX consta em `GUIA-DE-EXPERIENCIA.md` §4.3, sem duplicar requisitos funcionais.

**Impacto na proposta anterior:** substituir a prévia de quatro abas dentro da tela Cuidados por navegação lateral contextual. Preservar o item Rotina como entrada padrão. O desenho das telas de cadastro/consultas e a aparência das confirmações continuam sujeitos à validação visual antes de implementar. Replicar o padrão de organização nos outros módulos **somente depois da validação de Cuidados**, respeitando a frequência real de uso e evitando sobrecarregar o menu global. **Não implementado neste registro.**

### Aprovação da saudação concisa na Rotina — 2026-11-16

**Decisão expressa do responsável pelo produto:** adotar uma abertura acolhedora e personalizada na tela inicial de Cuidados, usando o **nome cadastrado da pessoa acompanhada** (exemplo: **“Vovó, olha o que temos para hoje!”**), seguida diretamente pelos cartões de horários, medicamentos e compromissos. Retirar títulos e instruções redundantes como “Rotina da Vovó”, “Hoje”, “Para acompanhar hoje” e “Os cuidados do dia, em ordem de horário”, uma vez que os cartões são autoexplicativos. Não duplicar informações já presentes no cabeçalho e no menu lateral.

**Limites:** nome dinâmico; tom respeitoso e natural, sem presumir parentesco nem usuário autenticado; não remover explicações clínicas necessárias para conferência de horários, distinção de relato, riscos de registro ou erros de persistência. O padrão de concisão pode ser reutilizado nos demais módulos após o desenho e validação de Cuidados. Fonte da diretriz: `GUIA-DE-EXPERIENCIA.md` §4.3. **Decisão UX documentada, ainda não implementada; UX permanece reprovada até nova validação humana.**

### Aprovação do cadastro e da conferência de horários — 2026-11-16

**Decisão UX expressa do responsável pelo produto:** usar um seletor simples de horas cheias (`00:00`–`23:00`) em vez de digitação livre habitual ou controles separados de horas/minutos. Exibir **um seletor por dose**, de acordo com a quantidade informada, sem campos vazios adicionais. Preservar opção discreta **“Outro horário da prescrição”** para inserir hora exata (inclusive minutos) quando necessária, sem arredondamento. Não distribuir automaticamente doses por intervalos inferidos. Conferir todos os horários com a orientação vigente antes de ativar lembretes, conforme CUI-F01 v1.3.

**Próxima tela para design:** listagem de medicamentos ativos no item **Medicamentos** do menu lateral contextual de Cuidados; distinguir lista, consulta de programação e ação secundária de adicionar, sem contaminar a Rotina com formulários. **Status:** decisão de UX documentada, não implementada; homologação humana permanece reprovada até nova avaliação após o redesenho.

### Aprovação da lista de medicamentos e ações contextuais — 2026-11-16

**Decisão expressa do responsável pelo produto:** a área Medicamentos (item do menu lateral de Cuidados) deve apresentar **primeiro a listagem dos medicamentos cadastrados**, preferencialmente ativos, com nome, horários vigentes e indicação concisa de uso contínuo ou por período. Um cartão selecionado abre detalhes da programação. **Adicionar medicamento** fica como ação clara, sem formulário permanente. **Editar, suspender e encerrar** não devem aparecer repetidos em cada cartão; ficam no contexto do item selecionado e somente para usuários autorizados. Ações que interrompem a programação exigem cuidado proporcional, sem alterar regras clínicas nem histórico.

**Próximo desenho a validar:** detalhes do medicamento (horários, duração/vigência e ações autorizadas), com foco em clareza, baixo esforço e preservação de CUI-F01/CUI-F04. Essa decisão é apenas documental e não converte a UX reprovada em homologada. Diretriz canônica: `GUIA-DE-EXPERIENCIA.md` §4.3.

### Diretriz de experiências distintas por responsabilidade — 2026-11-16

**Origem:** o responsável pelo produto reforçou três visões distintas: **Administrador** para gestão de pessoas/autorizações; **Responsável** para planejamento e cadastros de cuidados; e **terceiro perfil operacional** para registrar atividades/relatos e, quando autorizados, enviar exames e observações em interface objetiva e leve. A apresentação deverá diferenciar visualmente os recursos e o foco cotidiano; sem criar três aplicações, menus paralelos ou autorizações automáticas. **Diretriz UX registrada** em `GUIA-DE-EXPERIENCIA.md` §4.4.

**Conflito de fonte canônica e proposta de nome — NEEDS_DECISION (Produto):** o Documento Mestre §3 e `docs/modulos/01-fundacao-familiar/ESPECIFICACAO.md` FUN-04/FUN-07 hoje estabelecem **Administrador, Responsável e Colaborador**, diferenciando colaboradora externa de integrante familiar. O responsável sugeriu o termo **“Integrando”**; UX recomenda **“Integrante”** para o rótulo da experiência de participação. A substituição do perfil canônico não está automaticamente aprovada; Produto deve decidir o rótulo definitivo e como distinguir participação familiar de colaboração externa, sem perder a modelagem de vínculos e autorizações. Não alterar enum, schema, middleware ou permissões por simples troca de rótulo.

**Lacunas funcionais a verificar antes de implementação:** upload de exames e observações por terceiro perfil, abrangência de relatórios do administrador e extensão de cadastros do Responsável são permitidos apenas quando houver autorização contextual e contrato existente. Se forem novas capacidades, escalar à Produto/Arquitetura. Nenhum código foi alterado; a UX segue pendente de homologação humana.
