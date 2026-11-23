# Revisão integrada de UX — Módulo 02: Cuidados

**Data:** 2026-11-17  
**Natureza:** consolidação de decisões já aprovadas e análise estática da implementação; **não é homologação visual nem autorização para acesso a dados reais**.  
**Código inspecionado:** branch `develop`, commit `9586d523d497b17be0cb0d8249e35d83137f59e4`.  
**Fontes canônicas:** `docs/produto/DOCUMENTO-MESTRE.md` v1.2; `docs/modulos/01-fundacao-familiar/ESPECIFICACAO.md` v1.3; `docs/modulos/02-cuidados-vovo/ESPECIFICACAO.md` v1.5; `docs/ux-ui/GUIA-DE-EXPERIENCIA.md` v2.2; `docs/produto/GOVERNANCA.md`. Em conflito, prevalece a fonte dona da regra.

## 1. Resultado da revisão

**Direção de UX consolidada e aprovada nas conversas de validação; implementação divergente.** O QG técnico anterior não comprova aceite de uso. Manter a reprovação de UX aberta até revisão humana do aplicativo implementado. O trabalho restante é **redesenho/reorganização incremental do que existe**, com análise pontual de contratos; não criar outro módulo, três aplicativos, sistema de autorização ou novo fluxo de trabalho.

### Princípios de bloqueio

1. **Evolução familiar:** só registrar o que ajuda a acompanhar a pessoa e sua evolução ao longo do tempo.
2. **Esforço mínimo:** ações rápidas, campos mínimos, sem digitação duplicada, sem etapas artificiais.
3. **Organização sem cobrança:** observações opcionais; ausência de relato não é falha, nem prova de dose não tomada.
4. **Proteção:** autorização por pessoa, domínio e operação; dados de saúde e anexos privados não são herdados pelo administrador nem pelo vínculo familiar. Erro de rede nunca aparece como sucesso.

## 2. Navegação única e experiências diferenciadas

- **Uma só navegação compartilhada:** AppShell no desktop, Drawer no celular. Menu contextual da pessoa com `Rotina`, `Medicamentos` e `Consultas e exames`, exibidos conforme existência e autorização. Histórico/Resumo são acessados no acompanhamento/Evolução. **Sem menu `Apoio e companhia`, `Outros cuidados` ou abas duplicadas na Rotina.**
- **Administrador:** prioridade em pessoas, convites e visão mínima de quem acompanha quem; não tem acesso automático a cuidados/exames/relatórios clínicos. Se acumular responsabilidade autorizada, recebe as ações de cuidados correspondentes no contexto da pessoa.
- **Responsável:** vê a mesma Rotina simples; programação/cadastro de medicamentos e consultas ficam em seus destinos secundários no menu. Consulta evolução/relatórios quando autorizado.
- **Integrante:** vê a rotina da pessoa atribuída, registra relatos de doses e observação livre do dia quando autorizado, consulta compromissos pertinentes; não recebe formulários de cadastro, edição de programação, acesso administrativo ou informações de outras pessoas. **Integrante é experiência de uso**, não sinônimo de vínculo familiar. Colaborador(a) contratado(a) permanece vínculo externo; IDs técnicos podem permanecer legados.
- **Vovó com conta:** própria rotina legível e relatos conforme autorização, sem criar um quarto perfil administrativo.
- **Responsabilidades acumuladas:** compor ações autorizadas sem duplicar telas; o backend continua validando cada operação.

## 3. Contrato visual das telas

| Tela/área | Conteúdo principal | Ações secundárias | Proibições |
|---|---|---|---|
| **Rotina** | Saudação breve com nome cadastrado (ex.: “Vovó, olha o que temos para hoje!”), cartões cronológicos de medicamentos e compromissos autorizados, campo de observação opcional quando permitido | Relatar dose ao abrir cartão; salvar observação textual; acesso contextual à navegação | Títulos e explicações redundantes; formulários de cadastro; categorias de apoio; confirmação de dose por simples toque |
| **Medicamentos** | Lista de medicamentos vigentes com nome, horários e duração; selecionar cartão para ver detalhes | Adicionar para Responsável autorizado; alterar/suspender/encerrar apenas nos detalhes, com confirmação e preservação de histórico | Gestão em todos os cartões; acesso de Integrante a programação; horários clínicos inferidos |
| **Cadastro de medicamento** | Nome, primeiro horário, doses/dia e duração; um seletor de hora cheia por dose; opção discreta de horário exato | Receita opcional e opções especiais quando indispensáveis; revisão explícita dos horários prescritos antes de ativar | Minutos separados no padrão; horários arredondados; doses redistribuídas automaticamente; campos de estoque/farmácia |
| **Consultas e exames** | Lista com ícones/estados distintos e detalhes autorizados | Agendar consulta (descrição, data e horário; hora exata se necessária); registro de exame (descrição obrigatória, data/arquivo opcionais) conforme autorização | Cadastro permanente na Rotina; exigir localização/médico/observação; anexos visíveis por presunção |
| **Histórico e resumo** | Registros derivados de doses, consultas, exames e observações existentes | Filtros simples, prévia/PDF autorizados conforme Módulo 04 | Inserir de novo os dados já capturados; dados sensíveis em prévias não autorizadas |

**Relato de medicamento:** tocar cartão apenas abre opções “Informou que tomou”, “Informou que não tomou” e cancelamento. Confirmar explicitamente, aguardar servidor e atualizar estado/histórico; se falhar, manter a situação anterior/sem confirmação. Não transformar ausência de marcação em não tomada.

**Observação diária:** um campo livre, curto, **opcional e diretamente na Rotina**. Não exigir categoria de atividade, justificativa, relatório de turno, nova seleção de pessoa nem data; o registro recebe contexto, autor e momento automaticamente. Salvar sem etapa extra e mostrar sucesso apenas após persistência. Não criar pendência quando vazio. Exibir no histórico autorizado, sem recadastro; preservar registros antigos de apoio. Um texto por envio não implica sobrescrever observações anteriores.

**Seleção de horários:** padrão em horas cheias `00:00`–`23:00`; opção “Outro horário da prescrição” com minutos exatos. Para várias doses, apresentar exatamente um seletor por dose, sem calcular distribuição clínica; conferir antes de ativar.

## 4. Evidência da implementação atual e lacunas

Inspeção estática das seguintes fontes em `9586d523d497b17be0cb0d8249e35d83137f59e4` (não inclui execução de testes nem auditoria completa de segurança):

| ID | Evidência | Correção / decisão técnica necessária | Prioridade |
|---|---|---|---|
| **CUI-UX-01** | `apps/web/src/app/pessoas/[pessoaId]/cuidados/page.tsx` reúne Rotina, seções extras e `Accordion Gerenciar cuidados` com formulários de medicamento, apoio e consulta | Separar em destinos contextuais sem perder fluxos existentes; Rotina apenas acompanhamento e observação | Alta |
| **CUI-UX-02** | A página atual contém títulos e instruções autorreferentes e pouca diferenciação visual por ação/perfil | Aplicar saudação concisa, ícones, hierarquia de cartões, touch/teclado/foco, estados e vazio sem ruído | Alta |
| **CUI-UX-03** | Tela de Cuidados não evidencia composição de menus e ações por autorização para os três perfis | Reutilizar autorização existente e validar visibilidade por pessoa/operação; não decidir apenas por papel ou `filtradoPorAutorizacao` | Crítica |
| **CUI-UX-04** | `POST /pessoas/:pessoaId/atividades-apoio` aceita `{descricao?, observacao?}`; `servico-compromissos.ts` exige `descricao` não vazia e usa autorização de relato; cliente envia `descricao` | **Há reutilização potencial:** mapear o texto da observação livre para a descrição atual **se** semântica, histórico, autoria e UX forem preservados. Verificar consultas de histórico e regra de múltiplos registros; adaptar contrato apenas se necessário. Não criar endpoint novo por padrão | Alta |
| **CUI-UX-05** | `apps/web/src/lib/api.ts` tipa papel visual `"Colaborador"` em `AcessoResumo` | Exibir **Integrante** na UI, compatibilizando mapeamento de rótulo sem renomear enum/contrato/API ou alterar vínculo externo; validar outros usos | Média |
| **CUI-UX-06** | API possui rotas para consultas, exames e apoio; página Cuidados atual não apresenta jornada unificada aprovada de gestão/exame | Reaproveitar operações disponíveis; confirmar upload/anexos, telas de lista/detalhes e autorização por perfil **antes** de prometer ação ao Integrante | Alta |

**Atenção:** o contrato de observação pode ser atendido aproveitando `descricao` já existente; esta é uma hipótese técnica fundamentada, **não uma validação de API pronta, migração necessária ou decisão de alterar dados**. A Arquitetura só precisa intervir se a análise da implementação encontrar incompatibilidade material em contrato/segurança. Nenhum perfil novo recebe permissão nova por esta revisão.

## 5. Plano de implementação incremental pela esteira existente

**Encaminhamento recomendado:** `task-routing` → `implementation-workflow` em incrementos pequenos, com qualidade e comparação visual; usar `module-planning` **somente se** a triagem identificar mudança estrutural que realmente exija planejamento. Não recriar módulos ou agentes.

1. **Fundação UX compartilhada:** harmonizar rótulos Integrante/Responsável/Administrador, navegação contextual e visibilidade por autorização, sem mudar contratos técnicos inadvertidamente.
2. **Rotina por perfil:** retirar gestão embutida, colocar saudação/ícones/cartões e observação opcional na Rotina; manter relatos, erros e histórico. Validar Integrante, Responsável, Vovó e administrador sem autorização.
3. **Medicamentos:** listar → detalhes → gestão autorizada → cadastro simples com horários conferidos. Preservar vigências/correções e estados.
4. **Consultas e exames:** lista/detalhes → agendamento mínimo → registro/anexo somente quando existente e autorizado.
5. **Validação integrada:** testes de permissão incluindo URL direta e revogação, rede lenta/erro/reenvio, duplicidades, histórico, dispositivos móveis e desktop, acessibilidade e revisão de telas reais pelo responsável do produto. Não declarar UX homologada só com testes automatizados.

**Aceite de entrega:** Integrante faz registro diário relevante com poucos toques, sem formulário de cadastro nem obrigação de observação; Responsável gerencia a programação separadamente; Administrador não vê conteúdo protegido automaticamente; cadastro não infere horários clínicos; falhas de gravação não mostram sucesso; documentos/exames não vazam; pessoa acompanhada recebe a devida autonomia. O estado real continua controlado em `docs/produto/STATUS-E-ESCOPO.md`.

## 6. Pendências fecháveis sem nova decisão de produto

- Priorizar os recursos já aprovados e existentes, evitando categorias de apoio, menus redundantes e novas telas de gestão.
- Verificar se observação livre pode usar o registro de atividade existente; não reabrir regra funcional aprovada se o contrato suportar a experiência.
- Confirmar mapeamento de rótulos legados e permissões nas rotas, especialmente anexos.
- Qualquer ampliação de operação/escopo sensível exige governança L3, não inferência de UX.

**Situação:** revisão integrada documentada; **implementação não iniciada por esta revisão**.
