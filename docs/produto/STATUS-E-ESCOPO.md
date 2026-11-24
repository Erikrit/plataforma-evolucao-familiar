# Estado atual e escopo — Plataforma de Evolução Familiar

**Atualização:** 2026-11-24  
**Referência do código versionado:** `develop` e `master` em `dcf901db765aee9106070baa3a7903e492c36140` na abertura desta consolidação (PR #4, primeira entrega de homologação).  
**Fonte do estado de uso:** declaração do responsável pelo produto em 2026-11-24. **A URL HTTPS e a versão exata em execução na VPS não foram verificadas nesta revisão documental.**

## 1. Situação vigente — leitura prioritária

**V1 APROVADA E HOMOLOGADA funcionalmente, em fase de testes restritos à equipe.** O responsável informa que a aplicação está disponível em uma VPS com HTTPS. **Isso não representa liberação pública nem uso real pela família.** Os ambientes devem usar dados fictícios e acessos controlados.

Não confundir:
- **Produto:** escopo V1 e aceites humanos aprovados.
- **Código:** funcionalidades versionadas nas branches e commits informados.
- **Ambiente:** VPS HTTPS informada pelo responsável; a saúde, a configuração e o commit efetivo do servidor exigem checagem operacional própria.
- **Qualidade:** homologação funcional não substitui auditoria de segurança, teste de restauração de backup ou validação de notificações em aparelhos reais.

## 2. Escopo funcional vigente da V1

| Frente | Escopo consolidado | Fonte canônica |
|---|---|---|
| 01 — Fundação Familiar | Entrada e cadastro de família, pessoas com/sem conta, convites/ativação, acesso contextual simples e isolamento de famílias | [Módulo 01](../modulos/01-fundacao-familiar/ESPECIFICACAO.md) v1.9 |
| 02 — Cuidados | Rotina, medicamentos com horários conferidos, relatos sem inferência clínica, consultas, exames e anexos privados, acompanhamento autorizado | [Módulo 02](../modulos/02-cuidados-vovo/ESPECIFICACAO.md) v1.7 |
| 03 — Desenvolvimento | Biblioteca de atividades presenciais, participações, estrelas/recompensas, catálogo curado de 24 modelos, **8 jogos digitais e 40 fases** | [Módulo 03](../modulos/03-desenvolvimento-laurinha/ESPECIFICACAO.md) v1.5 |
| 04 — Evolução Familiar | Histórico individual, resumos contextuais e PDF sob demanda, respeitando as autorizações | [Módulo 04](../modulos/04-evolucao-familiar/ESPECIFICACAO.md) v1.2 |
| Experiência | Mobile-first e navegação centrada nas pessoas, com padrões definidos de UX e acessibilidade | [Guia UX](../ux-ui/GUIA-DE-EXPERIENCIA.md) |

O detalhamento dos requisitos e dos critérios de aceite permanece exclusivamente nas especificações, **não neste arquivo**. Marcos anteriores de reprovação/correção foram supersedidos pelos aceites posteriores da V1; consultar Git e o histórico da esteira para auditoria.

## 3. Tecnologia e ambiente de teste

- **Stack versionada:** Next.js/React/Mantine; API NestJS/Prisma; PostgreSQL; Docker/Compose; GHCR e workflow de publicação de imagens de homologação.
- **Topologia de homologação documentada:** Web e API atrás de proxy; serviços internos sob `127.0.0.1`, conforme Compose e procedimentos versionados. O responsável informa HTTPS ativo na VPS.
- **PWA:** manifesto e ícones de instalação presentes no código; instalação no Android aprovada pelo responsável. A confirmação do iPhone não está documentada nesta revisão.
- **Notificações Web Push / ACE-C12:** **não integram o aceite de implantação desta V1**; implementar somente após decisão e teste de entrega real. Os horários de medicamentos permanecem consultáveis sem Push.
- **Implantação:** a existência de deploy para testes não altera a proibição de publicação automática nem concede autorização de uso aberto.

Procedimento operacional: [implantação na VPS](../esteira/estado/procedimento-homolog-deploy.md). Marco e retomada: [registro atual da esteira](../esteira/REGISTRO.md). A [evidência preparatória anterior](https://github.com/Erikrit/plataforma-evolucao-familiar/blob/f58d029658499bdfc3807c0488662c0bc4557dae/docs/esteira/estado/evidencia-ops-homolog-deploy-20261123.json) permanece acessível no Git, **não** no contexto ativo.

## 4. Pendências que realmente permanecem abertas

1. **Testes restritos da V1:** registrar achados reais de UX, navegação, acessos, jogos, anexos, estabilidade e comportamento em celulares, sem presumir que a homologação anterior é anulada.
2. **Segurança antes do uso real:** revisar autenticação, proteção de login, sessão/cookies, limites de acesso a saúde/crianças e ambiente HTTPS, conforme [ADRs](../arquitetura/DECISOES.md) e evidências operacionais; HTTPS isoladamente não basta.
3. **Operação antes do uso real:** validar backup e restauração no ambiente apropriado, estratégia de recuperação e condições de publicação. A equipe decidiu deixar a robustez de backup e dados para V2/V3 enquanto a V1 operar **sem dados reais**; não declarar essa etapa concluída.
4. **PWA e notificações:** validar instalação no iPhone quando aplicável; Web Push e ACE-C12 permanecem posteriores.
5. **Evolução futura:** frentes E6/E7 com IA e demais ampliações são planejamento/direção, **não funcionalidades V1 homologadas**. Ver [Evolução pós-V1](EVOLUCAO-POS-V1.md).

## 5. Melhorias em análise pela equipe de testes (não alteram a baseline homologada)

**Levantamento registrado em 2026-11-24; estado: EM ANÁLISE.** Estas demandas são insumos para as conversas especializadas de UX e Jogos, **não** decisões funcionais já aprovadas nem implementação liberada. Manter os requisitos homologados até resolução na governança.

| Frente | Melhoria solicitada | Regra vigente e dependência |
|---|---|---|
| UX — Cuidados | Categoria obrigatória e descrição complementar opcional em consulta/exame; poucas categorias usuais | **Hoje:** descrição obrigatória, categoria não requerida. Necessita decisão de Produto e análise de impacto em API/validações; [detalhes M02 §11](../modulos/02-cuidados-vovo/ESPECIFICACAO.md) |
| UX — Cuidados | Melhorar botão/fluxo de anexar arquivo em exames | Preservar anexo opcional e download privado; [M02 §11](../modulos/02-cuidados-vovo/ESPECIFICACAO.md) |
| UX — Biblioteca | Categoria por `Select` nas atividades reais e cabeçalho compartilhado com nome, ícone e quantidade de estrelas | Preferir reutilização da UI, sem alterar pontuação; [M03 §14](../modulos/03-desenvolvimento-laurinha/ESPECIFICACAO.md) |
| Jogos — Atividades reais | Curadoria prática para 6–12 anos; 2 sugestões elegíveis por vez; estudar limite de 10 atividades ativas por categoria/pessoa | **Hoje:** até 24 modelos, até 6 sugestões e renovação de até 3. Limites novos exigem decisão funcional e regras de elegibilidade; [M03 §14](../modulos/03-desenvolvimento-laurinha/ESPECIFICACAO.md) |
| Jogos — Digitais | Catálogo com miniaturas e jogo iniciado diretamente; ampliar para pelo menos 15 fases por jogo | **Hoje:** 8 jogos/40 fases, inclusive seleção/acesso direto a fases conforme E5. 15 fases por jogo = mínimo 120, requer aprovação de escopo e revisão de progressão; [M03 §14](../modulos/03-desenvolvimento-laurinha/ESPECIFICACAO.md) |

**Próximo passo:** UX e Jogos inspecionam código/fluxos e entregam diagnóstico, proposta e impactos. Somente alterações compatíveis com o comportamento homologado podem seguir como UX local; novas obrigatoriedades, limites e regras de progressão requerem decisão explícita do Produto antes da implementação. Não reabrir a homologação da V1 por registrar estas propostas.

## 6. Fontes por responsabilidade (contexto mínimo)

| Pergunta | Ler primeiro |
|---|---|
| Qual é a finalidade e os princípios? | [Documento Mestre](DOCUMENTO-MESTRE.md) |
| Qual é a regra funcional? | Especificação do módulo correspondente |
| Qual é o padrão UX? | [Guia de Experiência](../ux-ui/GUIA-DE-EXPERIENCIA.md) |
| Quais são os contratos/limites técnicos? | [Arquitetura](../arquitetura/ARQUITETURA.md) e [ADRs](../arquitetura/DECISOES.md) |
| Como transferir uma decisão? | [Governança](GOVERNANCA.md) |
| Qual foi o resultado de testes/execução? | `docs/esteira/estado/atual.json` e `docs/esteira/REGISTRO.md`; resultados anteriores à V1 no Git |

**Regra de manutenção:** este documento mostra apenas estado **vigente**, pendências e referências. Não anexar retrospectivas completas, reprovações supersedidas, logs ou cópias de requisitos. Histórico de mudanças permanece no Git; a versão extensa anterior está no commit-base `dcf901d` e em seus ancestrais.

## 7. Limite de uso

**Liberado:** homologação e testes restritos pela equipe, com dados fictícios.  
**Não afirmado/liberado:** produção pública, uso real de dados sensíveis, notificações clínicas confiáveis ou segurança auditada.
