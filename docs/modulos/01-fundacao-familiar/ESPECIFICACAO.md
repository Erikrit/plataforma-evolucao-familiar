# Módulo 01 — Fundação Familiar

**Versão:** especificação funcional v1.6 — conta pessoal vinculada a uma única família, aprovada pelo Produto em 2026-11-21  
**Status funcional:** base v1.5 e direção pós-V1 de contas por família v1.6 aprovadas pelo Produto. Estado do código, evidências e homologação em `docs/produto/STATUS-E-ESCOPO.md`.

## 1. Objetivo

Cadastrar pessoas, organizar vínculos e responsabilidades, conceder acessos seguros e oferecer uma página inicial simples e centrada em pessoas.

## 2. Conceitos

- **Família:** espaço organizador e limite dos dados de seus participantes; evolução pós-V1 admite várias famílias isoladas no mesmo sistema e banco.
- **Pessoa:** integrante ou colaborador externo, com ou sem login.
- **Conta:** credencial pessoal vinculada a uma única família, conforme FUN-08.
- **Participação/vínculo:** relação com a família; não é permissão.
- **Autorização:** alcance permitido para usuário, pessoa acompanhada e módulo.

## 3. Funcionalidades

### FUN-01 — Adicionar pessoa

Nome é suficiente para cadastro inicial. Data de nascimento, vínculo e foto podem ser adicionados depois conforme necessidade. Não exigir conta.

### FUN-02 — Perfil individual

Exibir dados básicos e entradas para áreas autorizadas; completar dados progressivamente.

### FUN-03 — Convites

Somente administrador inicial convida no MVP. Vincular conta a pessoa existente ou nova pessoa externa; selecionar responsabilidade e pessoa-alvo. Convite com validade e controle de uso.

### FUN-04 — Autorizações

**Experiência do MVP:** a família gerencia **pessoas, responsabilidades simples e quem acompanha quem**, utilizando três perfis apresentados na interface: **Administrador**, **Responsável** e **Integrante** (rótulo aprovado em 2026-11-16, substitui **Colaborador** apenas na experiência). O sistema reutiliza internamente as autorizações contextualizadas por pessoa, domínio e operação já existentes; os três perfis são uma **simplificação de apresentação**, não novos papéis ou novas concessões automáticas. **Integrante (perfil de experiência)** não é sinônimo de **integrante familiar (vínculo)**: inclui também colaborador externo legitimamente autorizado, sem alterar seu vínculo, contratos ou direitos.

- **Administrador:** organiza pessoas, convites e vínculos de acompanhamento. Pode consultar **metadados mínimos das autorizações que administra** (nome/identificação compreensível do participante, pessoa acompanhada, papel e situação ativa), mas **não recebe acesso automático** a dados clínicos ou infantis.
- **Responsável:** acompanha e organiza as atividades da **pessoa para a qual possui autorização**, dentro do domínio permitido (por exemplo, cuidados ou desenvolvimento), sem herdar acesso a outras pessoas.
- **Integrante:** consulta a rotina e registra ocorrências **somente onde autorizado**; em contexto permitido, pode registrar apoio/observações simples e enviar arquivos/exames quando a operação estiver prevista e autorizada. Não administra pessoas, cria programações nem altera prescrições por padrão. Não é obrigado a registrar relatórios de turno ou justificar ausência de marcações.

A interface **não** oferece no MVP matriz por operação, perfis personalizados, exceções avançadas por campo/documento ou painel de auditoria. Ações seguras continuam controladas pelas verificações contextuais existentes; nenhuma função de administração amplia permissões de conteúdo sensível. Responsabilidades técnicas podem acumular quando legitimamente concedidas; a interface permanece simples.

O administrador pode **adicionar ou retirar um participante** do acompanhamento permitido usando os mecanismos existentes de convite, autorização e revogação. Revogação bloqueia novas operações e sessões afetadas, preservando histórico e autoria.

**CT-20261116-001:** visão administrativa mostra somente **quem acompanha cada pessoa, em qual papel e se o acesso está ativo**. Convite pendente não é acesso ativo. A listagem detalhada de operações/escopos permanece interna e não é requisito de UI do MVP.

**Distinção obrigatória para nomenclatura:** nas telas de convites e acessos, exibir o **perfil de participação** e o **vínculo real** separadamente quando relevante. Um colaborador externo contratado pode usar a experiência Integrante sem ser apresentado como familiar. Se uma pessoa acumular responsabilidades legítimas, a interface apresenta os recursos autorizados sem duplicar contas ou alterar direitos.

### FUN-05 — Página inicial

Cartões de pessoas visíveis conforme autorização, com breve resumo relevante, navegação por pessoa e UX mobile-first. Não incluir lista universal de tarefas.

### FUN-06 — Experiência móvel centrada nas pessoas

A plataforma deve priorizar uso no celular e também funcionar no computador. A entrada principal apresenta cartões das **pessoas autorizadas**, com o próximo cuidado ou ação realmente útil; não adotar uma navegação centrada em listas técnicas de módulos. Fluxos frequentes exigem poucos toques, textos claros, botões confortáveis e bom contraste.

A estrutura básica de navegação permanece consistente para todos; **conteúdos e operações** variam de acordo com as responsabilidades e autorizações. Não criar aplicativos ou configurações de navegação distintos para cada perfil no MVP. Em conexão instável, comunicar claramente quando uma operação não foi salva; não mostrar sucesso antecipadamente. PWA versus aplicativo móvel nativo permanece decisão técnica a validar pela capacidade de entregar essa experiência.

### FUN-07 — Privacidade compreensível, sem excesso de configuração

- Distinguir **vínculo familiar**, **responsabilidade** e **autorização**. Um vínculo ou o papel de administrador não concede acesso geral a dados médicos ou infantis.
- Exibir **três perfis simples** (Administrador, Responsável, Integrante) e o vínculo de acompanhamento. Não oferecer configuração granular por operação no MVP; manter a autorização contextual internamente, sem inventar concessões.
- A Vovó, sendo adulta independente, deve **compreender quem acompanha seus cuidados**. Quando possuir conta e acesso próprio, pode consultar em modo **somente leitura** os nomes e papéis dos participantes com autorização ativa relacionada aos seus próprios dados. Se não tiver conta, não é obrigada a criá-la apenas para isso; a informação pode ser explicada por responsável legitimamente autorizado. Essa consulta não concede poderes de administração; escolhas de compartilhamento respeitam as autorizações e condições legítimas. Seu histórico clínico não se torna público aos familiares por presunção.
- A colaboradora acessa somente o necessário para a rotina autorizada da Vovó; não recebe dados da Laurinha nem todos os documentos médicos por padrão.
- Listagens, cartões, resumos, anexos, avisos e exportações devem obedecer às autorizações. Dados sensíveis não podem vazar por prévias, contagens ou notificação de tela bloqueada.
- Notificações **discretas por padrão**; apresentação detalhada somente quando expressamente escolhida e permitida. Não pressupor que o bloqueio de tela impedirá toda exposição em dispositivos compartilhados.
- Retirada de autorização bloqueia novas operações protegidas e preserva rastreabilidade legítima. A interface explica a alteração sem telas desnecessárias.

### FUN-08 — Acesso por família

**Decisão L3 APROVADA pelo responsável do Produto em 2026-11-21.** O sistema atende famílias distintas no mesmo banco. Cada conta pertence a uma única família e cada participante com acesso mantém credencial pessoal. A entrada acontece pela URL da família, usando sua identificação legível para selecionar o contexto.

O servidor valida que a conta autenticada pertence à família selecionada antes de responder às operações daquele espaço. Pessoa-alvo, convites, autorizações, anexos, registros, relatórios e futuras solicitações de IA devem respeitar esse mesmo limite. Uma alteração de URL ou identificador de recurso não transfere a sessão nem concede acesso a outra família.

Após o login, a navegação segue os contextos de pessoas e áreas autorizadas dentro da família da conta. A proposta anterior de conta global compartilhada entre famílias está substituída. O detalhamento técnico da URL e dos contratos deve reutilizar a relação existente Usuario/Pessoa/Familia quando suficiente.

## 4. Fluxos

1. **Cadastro:** administrador → adicionar pessoa → nome → vínculo opcional → salvar → cartão de pessoa.
2. **Convite colaboradora:** administrador → pessoa externa → contato → responsabilidade de cuidados + Vovó → enviar → ativar → visualizar só contexto autorizado.
3. **Revogação:** administrador → acesso → revogar → novas operações bloqueadas imediatamente; registros anteriores permanecem.
4. **Navegação:** autenticar → cartões permitidos → pessoa → áreas autorizadas.

## 5. Regras

| ID | Regra |
|---|---|
| FAM-R01 | Pessoa pode existir sem login |
| FAM-R02 | Apenas administrador inicial envia convites |
| FAM-R03 | Parentesco não concede autorização automática |
| FAM-R04 | Usuário pode acumular responsabilidades |
| FAM-R05 | Acesso depende de família, pessoa-alvo e operação |
| FAM-R06 | Colaboradora externa só acessa dados autorizados |
| FAM-R07 | Revogação invalida sessões afetadas |
| FAM-R08 | Remover acesso não apaga histórico |
| FAM-R09 | Campos opcionais não impedem cadastro |
| FAM-R10 | Cartões e conteúdos são filtrados por autorização |
| FAM-R11 | Backend valida todas as operações protegidas |
| FAM-R12 | Dados de famílias diferentes permanecem isolados |
| FAM-R13 | Cada conta pessoal pertence a uma única família; sessão e URL devem concordar com essa família |

## 6. Permissões de referência

- Administrador: pessoas, convites e visão simples de quem acompanha quem; acesso ao conteúdo sensível sujeito às autorizações existentes, nunca automático.
- Mikaela: desenvolvimento da Laurinha, conforme autorização.
- Colaboradora externa (perfil de experiência **Integrante**): somente rotina autorizada da Vovó; não acessar Laurinha, nem modificar prescrição. O vínculo continua **externo/contratado**, não familiar.
- Laurinha: não precisa possuir conta.
- Vovó: acesso próprio opcional, preservando autonomia.

## 7. Casos excepcionais

Convite expirado ou já utilizado; nomes parecidos; conta revogada durante sessão; tentativa de abrir URL sem autorização; alteração de responsabilidade; pessoa sem login. Mostrar mensagens claras e preservar informações, sem ampliar formulários.

## 8. Critérios de aceitação

- [ ] Cadastrar Vovó apenas com nome.
- [ ] Cadastrar Laurinha sem conta.
- [ ] Convidar colaboradora externa com autorização somente para Vovó.
- [ ] Negar acesso à Laurinha, inclusive URL direta, para colaboradora.
- [ ] Acumular responsabilidades em usuário autorizado.
- [ ] Revogar acesso e sessão sem apagar históricos.
- [ ] Mostrar somente cartões permitidos.
- [ ] Funcionar em telas de celular e computador, com navegação principal centrada nas pessoas, leitura confortável e ações rápidas.
- [ ] Aplicar a mesma navegação básica, restringindo conteúdos e operações a cada autorização.
- [ ] Apresentar somente Administrador, Responsável e Integrante na experiência de gestão, associados a pessoas acompanhadas; nenhuma matriz de permissões por operação ou perfis personalizados no MVP.
- [ ] Administrador autorizado identifica quem acompanha cada pessoa, papel e situação ativa, sem acesso automático a dados clínicos ou infantis.
- [ ] Pessoa acompanhada com conta pode entender quem possui acesso ativo aos seus próprios dados, sem adquirir administração.
- [ ] Convites pendentes não aparecem como acesso ativo; revogação mantém isolamento e histórico.
- [ ] Permitir compreender claramente quem pode acessar os cuidados da Vovó, preservando sua autonomia.
- [ ] Não vazar dados sensíveis por cartões, contagens, prévias, avisos ou telas bloqueadas.
- [ ] Em falha de conexão, informar que a operação não foi salva; não confirmar falsamente.
- [ ] Não solicitar dados sem necessidade funcional.
- [ ] Impedir vazamento de dados entre famílias.
- [ ] Autenticar pela URL da família e recusar conta/sessão pertencente a outra família.
- [ ] Trocar slug, pessoaId, anexoId ou relatório na requisição mantém a validação de família e autorização.
- [ ] Seleção pós-login apresenta somente pessoas e áreas da família da conta.

## 9. Integrações

Fornece identidade, família, pessoa, conta, autorizações e dados resumidos para os módulos de cuidados, desenvolvimento e acompanhamento. Não implementa medicamentos nem desafios.

## 10. Fora do escopo

Árvore genealógica, chat, Kanban, agenda genérica, controle financeiro/trabalhista, configurador complexo de permissões, SaaS comercial.

**Princípio de aceite:** cadastro e acesso devem exigir o mínimo de esforço, preservando segurança e autonomia.

## 11. Direção funcional aprovada — pessoa, conta, acompanhamento e entrada (2026-11-20)

**Origem:** nova homologação humana REPROVADA para a gestão administrativa do Módulo 01; análise do código e aceite explícito do Produto à recomendação de preservar distinção Pessoa/Conta/Autorização, permitir autoacompanhamento e múltiplos contextos e simplificar o fluxo. **Essa direção complementa FUN-01..FUN-07 sem substituir controles de acesso existentes.**

### Conceitos e invariantes

- **Pessoa acompanhada** é entidade de acompanhamento e histórico, **com ou sem** conta de login.
- **Conta/usuário** é identidade autenticada vinculada de forma segura à pessoa. E-mail/senha dizem respeito à conta, não à ficha de acompanhamento; senha é segredo escolhido/mantido pelo titular no fluxo autorizado, não fornecida pelo administrador.
- **Participação operacional** (acompanha a si, outros ou ambos) é derivada do conjunto de autorizações reais; **não** criar escolha exclusiva `Ator` vs `Integrante` como papel persistido, nem impedir acúmulo legítimo.
- **Responsabilidade** e **área** são concessões contextuais; **vínculo** (familiar/colaborador externo) não é permissão. Preservar rótulos de experiência Administrador, Responsável, Integrante sem confundi-los com tipo exclusivo.
- Nome permanece o único campo obrigatório no cadastro de uma pessoa; data de nascimento opcional é preferível a idade fixa. Criança ou pessoa acompanhada não precisa ter conta.

### Jornadas a especificar e homologar

1. **Criar pessoa sem conta:** informar nome; opcionalmente data de nascimento/vínculo; acompanhar via adulto legitimamente autorizado; sem senha ou e-mail obrigatórios.
2. **Habilitar acesso com conta:** identificar se a pessoa já existe; vincular a conta de forma confiável em vez de criar cadastro duplicado; convidar/ativar quando necessário, com senha definida pelo próprio titular, convite com prazo/uso único e autorização adequada. Não presumir que só conhecer e-mail prova identidade. Identificar como a pessoa aceita sua associação e quem pode iniciar o vínculo.
3. **Definir acompanhamento:** selecionar participante com conta, pessoa acompanhada, área e responsabilidade **dentre combinações efetivamente suportadas** (ADR-014). A mesma conta pode acompanhar a própria pessoa e outras pessoas, sem conceder acesso às demais por dedução; autorização efetiva validada no backend.
4. **Autoacompanhamento:** pessoa com conta encontra os próprios contextos permitidos, preservando as capacidades atuais do servidor conforme fechamento v1.5 abaixo. Programação e exportação seguem as responsabilidades contextuais existentes.
5. **Pós-login:** se existir um único contexto operacional, abrir diretamente a área correspondente; se houver mais de uma pessoa/área, oferecer escolha contextual simples; administrador sem área operacional autorizada abre gestão. Sempre fornecer navegação para alternar contexto autorizado, sem cair em tela vazia ou vazamento de acesso.
6. **Gestão e revogação:** deixar claro quem acompanha quem/área/função, não expor opções de operação granulares sem necessidade, revogar autorizações com invalidação de sessão e histórico preservado. A segurança da associação Pessoa↔Conta e do acesso direto a URL/API deve ser testada.

### Limites e compatibilidade

- A especificação v1.3 de cadastro progressivo permanece: **não** tornar e-mail, senha, data de nascimento ou tipo operacional obrigatórios para criar pessoa.
- **Não** tornar Ator/Integrante funções exclusivas, não criar quarto papel, não converter checboxes de funcionalidades em autorizações livres, não liberar permissões do administrador a conteúdo clínico/infantil.
- A decisão anterior de mostrar cartões por pessoa em FUN-05/FUN-06 passa a ser **fallback para múltiplos contextos**, não uma etapa obrigatória quando houver apenas um contexto; UX define a transição minimizando toques.
- Não alterar Módulos 02/03/04 nem migrar usuários existentes sem plano e testes; não duplicar dados nem permitir tomada indevida de contas.

### Fechamento de Produto v1.5 — 2026-11-20

**APROVADO expressamente pelo responsável do Produto.** O sistema ainda não foi lançado e não possui usuários em utilização. A implementação desta demanda dispensa fluxo de migração, reconciliação ou associação de contas legadas. O fluxo ordinário de cadastrar pessoa e eventualmente habilitar sua conta deve manter a relação Pessoa/Usuario consistente e preservar o histórico, sem criar uma segunda pessoa para representar a mesma identidade. O vínculo de conta em novos cadastros pode reutilizar a pessoa criada nessa jornada. Contas e dados fictícios de teste devem ser tratados como dados de desenvolvimento; esta decisão não autoriza limpeza destrutiva automática.

**Autoacompanhamento mantém o comportamento efetivo atual.** A referência é `apps/api/src/autorizacoes/servico-autorizacoes.ts` em `develop` @ `89f47d38a5b6e5d05f8145545bfc6b2327f98db8`.

| Capacidade própria em Cuidados | Regra aprovada para esta entrega |
|---|---|
| Consultar cuidados e anexos próprios | Preservar os controles atuais de acesso próprio |
| Registrar relatos próprios | Preservar o controle atual |
| Cadastrar/alterar programação, organizar consultas/exames e exportar Cuidados | Exigir a responsabilidade contextual existente, como no servidor atual |
| Consultar Desenvolvimento próprio | Preservar o controle atual |
| Organizar Desenvolvimento, registrar participações/resgates e exportar | Preservar as verificações de cada operação existente |

A expressão “manter como está” confirma essas capacidades efetivas. Não tomar ausência de responsável selecionado como concessão automática de `responsavel_cuidados` ou `responsavel_desenvolvimento`. Uma responsabilidade legítima pode ter a própria pessoa como alvo, conforme catálogo ADR-014.

**Entrada contextual:** calcular contextos por pessoa e área usando capacidades efetivas do servidor, incluindo acesso próprio. Um contexto abre diretamente a área principal; vários contextos são apresentados em escolha simples agrupada por pessoa, com as áreas autorizadas. Administração permanece acessível para quem a possui; administrador sem contexto operacional abre gestão. Histórico/resumo continuam disponíveis conforme autorização no menu da pessoa e não precisam gerar uma escolha adicional obrigatória no login. Caso o próprio cadastro dê acesso às duas áreas pelos controles atuais, aplicar a escolha de múltiplos contextos. Evitar redirecionamentos por rótulo de perfil ou apenas pelo número de concessões explícitas.

**Critérios para a entrega:** cadastro mínimo sem conta obrigatória; ativação ordinária com relação consistente Pessoa/Usuario; conta que acompanha a si e/ou terceiros; entrada com um ou múltiplos contextos; isolamento por pessoa/família; diferenças entre leitura, registro e gestão; revogação e sessão; testes com dados fictícios e nova homologação humana.

**Encaminhamento funcional fechado:** as duas pendências levantadas no alinhamento (contas legadas e poderes de autoacompanhamento) estão resolvidas para este escopo. UX e Arquitetura podem detalhar e implementar a menor solução compatível pela esteira existente. Novas capacidades exigem decisão própria.

## 12. Delimitação pós-V1 aprovada — 2026-11-21

FUN-08 e FAM-R13 incorporam a correção expressa do responsável de que existe um login por família. A regra mantém contas pessoais com uma única família por conta e substitui a proposta de conta global apresentada no planejamento de evolução. Múltiplos contextos da seção 11 significam pessoas/áreas dentro da mesma família.

A base V1 homologada continua identificada em STATUS-E-ESCOPO.md. A operação com URLs de família e seus testes depende da entrega E1. As demais propostas de biblioteca, jogos digitais, IA e revisões de acesso seguem seus próprios estados de aprovação. Aplicar os princípios do Documento Mestre e a política pré-uso do §13.
