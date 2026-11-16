# Módulo 01 — Fundação Familiar

**Versão:** especificação funcional v1.2 — experiência móvel e gestão simplificada de acessos (CT-20261116-001 aprovado em 2026-11-16)  
**Status funcional:** especificação aprovada. Estado do código, evidências e pendências de homologação em `docs/produto/STATUS-E-ESCOPO.md`.

## 1. Objetivo

Cadastrar pessoas, organizar vínculos e responsabilidades, conceder acessos seguros e oferecer uma página inicial simples e centrada em pessoas.

## 2. Conceitos

- **Família:** espaço organizador; inicialmente apenas uma família.
- **Pessoa:** integrante ou colaborador externo, com ou sem login.
- **Conta:** credencial para acessar a plataforma.
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

**Experiência do MVP:** a família gerencia **pessoas, responsabilidades simples e quem acompanha quem**, utilizando três perfis apresentados na interface: **Administrador**, **Responsável** e **Colaborador**. O sistema reutiliza internamente as autorizações contextualizadas por pessoa, domínio e operação já existentes; os três perfis são uma **simplificação de apresentação**, não novos papéis ou novas concessões automáticas.

- **Administrador:** organiza pessoas, convites e vínculos de acompanhamento. Pode consultar **metadados mínimos das autorizações que administra** (nome/identificação compreensível do participante, pessoa acompanhada, papel e situação ativa), mas **não recebe acesso automático** a dados clínicos ou infantis.
- **Responsável:** acompanha e organiza as atividades da **pessoa para a qual possui autorização**, dentro do domínio permitido (por exemplo, cuidados ou desenvolvimento), sem herdar acesso a outras pessoas.
- **Colaborador:** consulta a rotina e registra ocorrências **somente onde autorizado**; não administra pessoas nem altera prescrições por padrão.

A interface **não** oferece no MVP matriz por operação, perfis personalizados, exceções avançadas por campo/documento ou painel de auditoria. Ações seguras continuam controladas pelas verificações contextuais existentes; nenhuma função de administração amplia permissões de conteúdo sensível. Responsabilidades técnicas podem acumular quando legitimamente concedidas; a interface permanece simples.

O administrador pode **adicionar ou retirar um participante** do acompanhamento permitido usando os mecanismos existentes de convite, autorização e revogação. Revogação bloqueia novas operações e sessões afetadas, preservando histórico e autoria.

**CT-20261116-001:** visão administrativa mostra somente **quem acompanha cada pessoa, em qual papel e se o acesso está ativo**. Convite pendente não é acesso ativo. A listagem detalhada de operações/escopos permanece interna e não é requisito de UI do MVP.

### FUN-05 — Página inicial

Cartões de pessoas visíveis conforme autorização, com breve resumo relevante, navegação por pessoa e UX mobile-first. Não incluir lista universal de tarefas.

### FUN-06 — Experiência móvel centrada nas pessoas

A plataforma deve priorizar uso no celular e também funcionar no computador. A entrada principal apresenta cartões das **pessoas autorizadas**, com o próximo cuidado ou ação realmente útil; não adotar uma navegação centrada em listas técnicas de módulos. Fluxos frequentes exigem poucos toques, textos claros, botões confortáveis e bom contraste.

A estrutura básica de navegação permanece consistente para todos; **conteúdos e operações** variam de acordo com as responsabilidades e autorizações. Não criar aplicativos ou configurações de navegação distintos para cada perfil no MVP. Em conexão instável, comunicar claramente quando uma operação não foi salva; não mostrar sucesso antecipadamente. PWA versus aplicativo móvel nativo permanece decisão técnica a validar pela capacidade de entregar essa experiência.

### FUN-07 — Privacidade compreensível, sem excesso de configuração

- Distinguir **vínculo familiar**, **responsabilidade** e **autorização**. Um vínculo ou o papel de administrador não concede acesso geral a dados médicos ou infantis.
- Exibir **três perfis simples** (Administrador, Responsável, Colaborador) e o vínculo de acompanhamento. Não oferecer configuração granular por operação no MVP; manter a autorização contextual internamente, sem inventar concessões.
- A Vovó, sendo adulta independente, deve **compreender quem acompanha seus cuidados**. Quando possuir conta e acesso próprio, pode consultar em modo **somente leitura** os nomes e papéis dos participantes com autorização ativa relacionada aos seus próprios dados. Se não tiver conta, não é obrigada a criá-la apenas para isso; a informação pode ser explicada por responsável legitimamente autorizado. Essa consulta não concede poderes de administração; escolhas de compartilhamento respeitam as autorizações e condições legítimas. Seu histórico clínico não se torna público aos familiares por presunção.
- A colaboradora acessa somente o necessário para a rotina autorizada da Vovó; não recebe dados da Laurinha nem todos os documentos médicos por padrão.
- Listagens, cartões, resumos, anexos, avisos e exportações devem obedecer às autorizações. Dados sensíveis não podem vazar por prévias, contagens ou notificação de tela bloqueada.
- Notificações **discretas por padrão**; apresentação detalhada somente quando expressamente escolhida e permitida. Não pressupor que o bloqueio de tela impedirá toda exposição em dispositivos compartilhados.
- Retirada de autorização bloqueia novas operações protegidas e preserva rastreabilidade legítima. A interface explica a alteração sem telas desnecessárias.

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

## 6. Permissões de referência

- Administrador: pessoas, convites e visão simples de quem acompanha quem; acesso ao conteúdo sensível sujeito às autorizações existentes, nunca automático.
- Mikaela: desenvolvimento da Laurinha, conforme autorização.
- Colaboradora (perfil visual Colaborador): somente rotina autorizada da Vovó; não acessar Laurinha, nem modificar prescrição.
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
- [ ] Apresentar somente Administrador, Responsável e Colaborador na experiência de gestão, associados a pessoas acompanhadas; nenhuma matriz de permissões por operação ou perfis personalizados no MVP.
- [ ] Administrador autorizado identifica quem acompanha cada pessoa, papel e situação ativa, sem acesso automático a dados clínicos ou infantis.
- [ ] Pessoa acompanhada com conta pode entender quem possui acesso ativo aos seus próprios dados, sem adquirir administração.
- [ ] Convites pendentes não aparecem como acesso ativo; revogação mantém isolamento e histórico.
- [ ] Permitir compreender claramente quem pode acessar os cuidados da Vovó, preservando sua autonomia.
- [ ] Não vazar dados sensíveis por cartões, contagens, prévias, avisos ou telas bloqueadas.
- [ ] Em falha de conexão, informar que a operação não foi salva; não confirmar falsamente.
- [ ] Não solicitar dados sem necessidade funcional.
- [ ] Impedir vazamento de dados entre famílias.

## 9. Integrações

Fornece identidade, família, pessoa, conta, autorizações e dados resumidos para os módulos de cuidados, desenvolvimento e acompanhamento. Não implementa medicamentos nem desafios.

## 10. Fora do escopo

Árvore genealógica, chat, Kanban, agenda genérica, controle financeiro/trabalhista, configurador complexo de permissões, SaaS comercial.

**Princípio de aceite:** cadastro e acesso devem exigir o mínimo de esforço, preservando segurança e autonomia.
