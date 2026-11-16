# Guia de Experiência UX/UI — Plataforma de Evolução Familiar

**Versão:** 1.1 — identidade aprovada em 2026-11-15; navegação e administração aprovadas em 2026-11-16  
**Referência:** `develop`; decisões de UX validadas em conversa.  
**Status:** diretrizes para implementação; NÃO é evidência de tela implementada, teste de acessibilidade ou homologação.  
**Fontes funcionais:** `docs/produto/DOCUMENTO-MESTRE.md`, `docs/produto/STATUS-E-ESCOPO.md` e `docs/modulos/*/ESPECIFICACAO.md`.

## 1. Objetivo e limites

Entregar experiência familiar moderna, acolhedora, simples e mobile-first, com **pessoas antes de funcionalidades**, **mínimo esforço de registro** e **organização sem cobrança**. Aplica-se aos módulos 01, 02 e futuros 03 e 04.

Este guia regula apresentação, navegação, microcopy, interação, componentes e acessibilidade. **Não substitui especificações funcionais**. Uma alteração puramente visual ou interação compatível com as regras aprovadas pode ser decidida em UX; novas regras de negócio, permissões, comportamentos clínicos, obrigações ou tratamento de dados devem ser encaminhados à conversa de Produto por prompt contextualizado. Privacidade e segurança são obrigatórias.

## 2. Identidade — Família Viva / Azul Contemporâneo

- Primária `#3569C8` (ações e identidade); primária suave `#E8EFFC` (superfícies destacadas).
- Apoio `#E5A66A` (acentos afetivos, nunca indicação automática de atraso).
- Fundo `#F6F8FC`; texto principal `#23344F`; superfícies principais brancas.
- Valores são **referência visual aprovada**, não garantia de contraste: validar cada combinação em seus estados normal/hover/focus/disabled, inclusive texto sobre superfícies suaves; ajustar tons secundários se necessário, preservando a direção visual.
- Tipografia candidata **Inter** com fallback acessível; corpo preferencialmente 16px; secundário 14–16px; títulos de seção 20–22px e título de página 26–28px como referências responsivas, não tamanhos rígidos.
- Densidade **confortável**: espaço de referência 8px entre itens relacionados, 16px dentro dos cartões e 24px entre seções. Alvos interativos preferencialmente >=44×44px; respeitar critérios WCAG 2.2 AA.
- Cor não é a única forma de representar situação. Sem sombras excessivas, cartões multicoloridos, animações ou gamificação decorativa.

## 3. Biblioteca e manutenção

**Mantine UI está integrado à aplicação**; preservar a biblioteca existente e validar o uso de seus componentes, bundle, CSS/SSR, foco e acessibilidade ao evoluir o layout. Não adicionar Mantine e outra biblioteca concorrente para a mesma função. Priorizar componentes próprios da biblioteca, tema central e customizações mínimas. Possíveis componentes: `AppShell`, `Container`, `Stack`, `Group`, `Card`, `Paper`, `Button`, `TextInput`, `Select`, `Drawer`, `Modal`, `Alert`, `Notification`, `Accordion`. Usar uma família coerente de ícones, com rótulo textual quando necessário. Não copiar templates administrativos integrais nem criar design system paralelo.

Padrão para cada componente: texto legível, feedback em andamento, estado desabilitado claro, foco visível, interação por teclado/touch, conteúdo em telas estreitas e sem vazamento de dados sensíveis.

## 4. Arquitetura de informação

- **Página inicial:** pessoas autorizadas como conteúdo principal; cartões indicam quem é a pessoa e, apenas quando existir informação útil e permitida, um resumo contextual. Não exibir IDs, códigos de requisitos, tokens ou termos internos.
- **Gerenciar família:** área administrativa única e secundária, acessível pela navegação compartilhada somente a usuários autorizados. Agrupar **Pessoas**, **Acessos e permissões** e **Convites**; remover formulários administrativos do conteúdo de acompanhamento (home, perfis, cuidados, desenvolvimento, histórico e resumo). Não confundir administração de acessos com gestão cotidiana de medicamentos, consultas e brincadeiras, que continua nos módulos correspondentes. Reaproveitar operações existentes; não ampliar permissões.
- **Perfil:** nome e áreas disponíveis primeiro; edição de vínculo e dados complementares como ação secundária, sem bloquear uso.
- **Cuidados:** três níveis de organização: (1) Rotina de hoje; (2) Outros cuidados — consultas, exames, apoio, histórico quando aplicável; (3) Gerenciar cuidados — programação/cadastros somente para perfis autorizados. Os níveis são agrupamentos de UI, **não necessariamente três novas rotas/telas**.
- **Módulos 03 e 04:** preservar mesma identidade, navegação, cartão, confirmação, feedback, densidade e privacidade, com variações contextuais discretas. Módulo 03 mais lúdico sem placares ou cobrança; módulo 04 histórico e resumo por pessoa, sem duplicar entrada de dados.


### 4.1 Navegação adaptativa e contextual por pessoa — decisão aprovada em 2026-11-16

- Utilizar **uma única navegação compartilhada** em toda a plataforma, com `AppShell` do Mantine no desktop e menu `Drawer` no celular. Não criar uma aplicação ou configuração independente por perfil.
- **Navegação geral:** Início / Nossa família. Ações administrativas aparecem em um agrupamento único **Gerenciar família** apenas para usuários com autorização correspondente; não repetir botões de administração em todas as abas/telas.
- **Navegação contextual:** ao selecionar uma pessoa, apresentar seu nome e **somente as áreas autorizadas** (por exemplo, Cuidados, Desenvolvimento, Histórico, Resumo). Permitir trocar de pessoa ou voltar à visão geral sem percorrer uma cadeia de links de retorno.
- **Contexto e estado:** indicar a pessoa e a área ativa, preservar orientação ao transitar por telas, garantir foco/teclado/ARIA para navegação e menu móvel. Destinos inexistentes ou não autorizados não devem ser apresentados como atalhos operáveis.
- **Separação de responsabilidades:** "Gerenciar família" cobre gestão de pessoas, convites e acessos; "Gerenciar cuidados" e criação de brincadeiras são ações dos respectivos módulos, sujeitas às permissões já vigentes.
- **Privacidade:** menu é consequência da autorização do servidor, nunca fonte de autorização. A condição `filtradoPorAutorizacao` não deve ser tomada isoladamente como prova de papel administrativo; revisar com Arquitetura a forma segura de determinar visibilidade. Administrador não ganha acesso clínico ou infantil por padrão.
- Evitar duplicar "Início" e "Nossa família" como rotas/menus redundantes quando apontarem para o mesmo conteúdo: preservar rótulos úteis, com destino único e claro.

### 4.2 Administração familiar — organização visual aprovada

- Área administrativa com navegação local clara: **Pessoas** (consultar/adicionar), **Acessos e permissões** (entender quem acompanha quem e em qual responsabilidade) e **Convites** (convidar/ativação conforme fluxo existente).
- Não colocar todas as funções em um único `Accordion` extenso, nem misturá-las com cartões familiares. Usar seções, telas ou subnavegação proporcionais à complexidade real; não introduzir telas vazias ou formulários duplicados.
- **Acessos:** distinguir pessoa acompanhada, usuário com acesso, responsabilidade e escopo. Identificadores técnicos só para diagnóstico, jamais como principal rótulo. Não prometer listar, editar ou revogar autorizações até confirmar contratos e políticas vigentes.
- **Dependência transversal:** `CT-20261116-001` na revisão de UX, status `PROPOSTA` para Arquitetura. Refere-se à capacidade de montar visão administrativa segura de acessos; não autoriza nova operação de permissão.

## 5. Regras de interação reutilizáveis

1. **Ação mais frequente primeiro**; revelar configuração e campos opcionais sob demanda, com rótulos explícitos.
2. Cartão de ocorrência de medicamento inteiro clicável; o toque **abre opções**, nunca registra sozinho. Em celular, preferir painel inferior (`Drawer`), preservando cancelamento, foco, retorno de foco, tecla Escape, leitura por tecnologia assistiva e fallback em desktop.
3. Para registro de medicamento, mostrar claramente nome/horário e escolhas **Informou que tomou**, **Informou que não tomou** e **Cancelar**. `Sem confirmação` é ausência de relato, não julgamento de falha. Não oferecer instrução de dose nem inferir tratamento.
4. Após enviar operação, mostrar andamento e impedir reenvios acidentais. **Só mostrar sucesso após persistência confirmada**; falha deve ser explícita e manter os dados digitados. Em incerteza de rede, não afirmar que foi salvo.
5. Estados: carregamento legível sem salto excessivo; vazio com mensagem contextual e próximo passo autorizado; erro com recuperação possível; sucesso discreto e claro.
6. Campos com rótulo persistente, tipo correto, ajuda breve se indispensável, validação junto ao campo; formulário de criação não permanece aberto quando não é ação principal.
7. Mensagens: linguagem familiar, direta, respeitosa; evitar `FF-04`, `FAM-R10`, `ACE-05`, `ADR-009`, UUID, token bruto e jargão clínico/técnico nas telas normais.
8. O usuário só visualiza informações e ações autorizadas. Não mostrar cartão, resumo, prévia, indicadores, anexos ou avisos sensíveis sem autorização. Não presumir direitos pelo vínculo ou perfil administrativo.
9. Comunicação sem cobrança, pressão ou punição; não usar vermelho/âmbar para ausência de registro sem erro real.
10. A navegação deve permitir retorno ao contexto da **pessoa**; não direcionar arbitrariamente todo histórico para o módulo de cuidados.

## 6. Responsividade e acessibilidade

- Celular: coluna única por padrão, cartões e ações confortáveis, painel inferior para escolhas rápidas; evitar rolagem horizontal.
- Desktop: largura de leitura controlada; grades de cartões quando houver espaço; modais/painéis proporcionais; não transformar todo o produto em dashboard.
- Considerar 320px, 375px, 390px, tablet e desktop; zoom 200%, fontes maiores, teclado, leitor de tela, preferência por movimento reduzido.
- Contraste de texto normal >=4.5:1 e de texto grande >=3:1; foco visível, sem perda de contexto; estado e erro informados por texto e não só cor.
- Conferir rótulos, áreas de toque, ordem de tabulação, fechamento/retorno de foco do Drawer/Modal e mensagens acessíveis.
- Não expor dados sensíveis em notificações de tela bloqueada por padrão.

## 7. Critérios de aceite transversais de UX

- [ ] Pessoas autorizadas são o ponto de partida; administração não compete com rotina.
- [ ] Desktop usa navegação lateral; celular usa Drawer; seção da pessoa selecionada indica somente áreas autorizadas e estado ativo.
- [ ] Gestão familiar está centralizada, sem botões/formulários administrativos repetidos nas áreas de acompanhamento.
- [ ] Informações de autorização exibidas ao administrador não excedem contratos e acessos aprovados.
- [ ] A ação principal de cada tela é reconhecível sem ler instruções técnicas.
- [ ] Operações frequentes requerem poucos passos e evitam redigitação.
- [ ] Cada estado (vazio, loading, erro, sucesso, sem confirmação) é compreensível.
- [ ] Não há feedback de sucesso antes da persistência; erro de rede é explícito.
- [ ] Funciona em celular e desktop e com teclado/leitor de tela; verificar contrastes reais.
- [ ] Componentes e tema são reutilizados; sem CSS arbitrário por tela.
- [ ] Nenhum conteúdo sensível é exibido fora da autorização existente.
- [ ] Não há alteração funcional não aprovada nem registro duplicado para histórico.
- [ ] Revisão visual final com capturas reais + teste com familiares; proposta aprovada não equivale a homologação.

## 8. Governança de decisões

- **Governança:** `docs/produto/GOVERNANCA.md` é a fonte do processo de decisão, com níveis L1/L2/L3 e CT v1.
- **UX autônoma:** cores, tipografia, hierarquia, disposição, rótulos, feedback e interação compatível com regras aprovadas.
- **Produto obrigatório:** nova regra, mudança de permissões ou visibilidade sensível, lógica clínica, frequências, histórico, novas obrigações e funcionalidades.
- Divergência documental/código: especificação funcional prevalece para o comportamento; registrar dependência, não completar regra por suposição.
- Evitar aprovações por detalhe; revisar um conjunto coeso. Preservar esta fonte única, sem duplicá-la integralmente nos documentos de módulo.
