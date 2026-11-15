# Guia de Experiência UX/UI — Plataforma de Evolução Familiar

**Versão:** 1.0 — aprovado conceitualmente em 2026-11-15  
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

**Mantine UI é candidato principal**, sujeito a validação de compatibilidade com versões do repositório, bundle, CSS/SSR, foco e acessibilidade antes da adoção definitiva. Não adicionar Mantine e outra biblioteca concorrente para a mesma função. Priorizar componentes próprios da biblioteca, tema central e customizações mínimas. Possíveis componentes: `AppShell`, `Container`, `Stack`, `Group`, `Card`, `Paper`, `Button`, `TextInput`, `Select`, `Drawer`, `Modal`, `Alert`, `Notification`, `Accordion`. Usar uma família coerente de ícones, com rótulo textual quando necessário. Não copiar templates administrativos integrais nem criar design system paralelo.

Padrão para cada componente: texto legível, feedback em andamento, estado desabilitado claro, foco visível, interação por teclado/touch, conteúdo em telas estreitas e sem vazamento de dados sensíveis.

## 4. Arquitetura de informação

- **Página inicial:** pessoas autorizadas como conteúdo principal; cartões indicam quem é a pessoa e, apenas quando existir informação útil e permitida, um resumo contextual. Não exibir IDs, códigos de requisitos, tokens ou termos internos.
- **Gerenciar família:** entrada administrativa secundária, visível somente a quem possui autorização correspondente. Reaproveitar fluxos existentes de cadastro, convites e autorizações; não conceder novas permissões por reorganização visual. Não exigir nova navegação global sem necessidade.
- **Perfil:** nome e áreas disponíveis primeiro; edição de vínculo e dados complementares como ação secundária, sem bloquear uso.
- **Cuidados:** três níveis de organização: (1) Rotina de hoje; (2) Outros cuidados — consultas, exames, apoio, histórico quando aplicável; (3) Gerenciar cuidados — programação/cadastros somente para perfis autorizados. Os níveis são agrupamentos de UI, **não necessariamente três novas rotas/telas**.
- **Módulos 03 e 04:** preservar mesma identidade, navegação, cartão, confirmação, feedback, densidade e privacidade, com variações contextuais discretas. Módulo 03 mais lúdico sem placares ou cobrança; módulo 04 histórico e resumo por pessoa, sem duplicar entrada de dados.

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

- **UX autônoma:** cores, tipografia, hierarquia, disposição, rótulos, feedback e interação compatível com regras aprovadas.
- **Produto obrigatório:** nova regra, mudança de permissões ou visibilidade sensível, lógica clínica, frequências, histórico, novas obrigações e funcionalidades.
- Divergência documental/código: especificação funcional prevalece para o comportamento; registrar dependência, não completar regra por suposição.
- Evitar aprovações por detalhe; revisar um conjunto coeso. Preservar esta fonte única, sem duplicá-la integralmente nos documentos de módulo.
