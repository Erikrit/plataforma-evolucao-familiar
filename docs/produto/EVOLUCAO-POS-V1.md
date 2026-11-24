# Evolução posterior à V1 — direções e decisões pendentes

**Revisão:** 2026-11-24. **Estado:** planejamento, **não** descrição da implementação corrente. V1 aprovada/homologada funcionalmente, disponível somente à equipe de testes na VPS HTTPS conforme o responsável; estado atual em [Status e Escopo](STATUS-E-ESCOPO.md).

**Histórico:** a versão integrada v2.3 (E1–E7, pesquisa, critérios e discussões originais) permanece integralmente no [Git antes da limpeza](https://github.com/Erikrit/plataforma-evolucao-familiar/blob/f58d029658499bdfc3807c0488662c0bc4557dae/docs/produto/EVOLUCAO-POS-V1.md). Não executar novamente planos E1–E5 já contemplados na V1.

## 1. Baseline que não deve ser refeita

- **E1/E2:** cadastro/entrada em família, conta vinculada a uma única família, isolamento, convites/ativação e acesso contextual compreensível. Fonte: [Módulo 01](../modulos/01-fundacao-familiar/ESPECIFICACAO.md).
- **E3:** documentos e exames privados, Resumo/Histórico/PDF. Fontes: [Módulo 02](../modulos/02-cuidados-vovo/ESPECIFICACAO.md) e [Módulo 04](../modulos/04-evolucao-familiar/ESPECIFICACAO.md).
- **E4/E5:** biblioteca real curada (24 modelos), oito jogos digitais/40 fases e participações, progresso e recompensas definidos no [Módulo 03](../modulos/03-desenvolvimento-laurinha/ESPECIFICACAO.md).
- **PWA:** manifesto/ícones e instalação Android validados no escopo informado. Web Push/ACE-C12 **não** está implementado.
- Os quatro módulos existentes continuam úteis **sem IA**, sem ranking ou cobrança.

## 2. Prioridade presente: testar a V1 e corrigir apenas achados concretos

Registrar problemas observáveis de UX, navegação, acesso/privacidade, anexos, estabilidade, jogos e celular com: passos para reproduzir, comportamento esperado, comportamento real, dispositivo e critérios afetados. Corrigir em demandas limitadas pela especificação vigente, sem reabrir decisões já homologadas.

**Uso real e publicação aberta permanecem fora do aceite.** Antes de dados familiares reais, reavaliar segurança de login/sessões/permissões, operação e restauração de backups no ambiente pertinente. O adiamento de investimento em backup/rotinas para V2/V3 foi considerado apenas no contexto de **testes com dados fictícios**, não como comprovação de proteção em produção.

## 3. Pendências e ideias posteriores

| Frente | Situação | Próxima condição |
|---|---|---|
| Web Push / ACE-C12 | Adiada; comportamento de lembretes já especificado, mas entrega real não homologada | Estabilizar UX/V1; definir autorização, entrega e testes em Android/iPhone sem inferências clínicas |
| PWA iPhone | Verificação em aparelho real ainda não confirmada nesta revisão | Homologação prática quando aplicável |
| Remoção/desativação de pessoa e vínculo | Propostas anteriores adiadas; **sem** decisão funcional final para exclusão | Decisão explícita de Produto sobre histórico, revogação e reversibilidade |
| Expansão da biblioteca | Visão editorial futura, não regra de quantidade além da V1 homologada | Curadoria, necessidade demonstrada e aprovação proporcional |
| E6 — sugestões assistidas para desenvolvimento | Direção de produto aprovada, **não** implementação autorizada | Delimitar dados enviados, finalidade, custos, autorização, limites e critérios de aceite |
| E7 — resumo assistido de cuidados | Direção posterior à E6, **não** implementação autorizada | Limites clínicos estritos; nenhum diagnóstico/prescrição/recomendação de ajuste; decisões próprias de privacidade |
| Liberação real/produção | Não autorizada por homologação funcional ou VPS de teste | Aprovação separada e validações de segurança/operação |

## 4. Restrições permanentes para qualquer expansão

- Pessoas antes de tarefas, mínimo preenchimento, organização sem cobrança.
- Não criar agenda pessoal genérica, metas de produtividade, ranking ou avaliação clínica.
- Acesso sempre por **família, pessoa e domínio** autorizado; dados médicos/infantis nunca são expostos pela mera condição de administrador.
- Um modelo editorial global não pode carregar históricos, anexos ou pessoas da família.
- IA é **opcional**, separada entre curadoria editorial, desenvolvimento e cuidados. Nunca publicar automaticamente conteúdo gerado nem alterar medicamentos, registros ou pontos por decisão da IA.
- Não enviar documentos, dados de saúde/crianças ou históricos pessoais a terceiros sem finalidade definida, autorização e decisão explícita. Não inserir chaves/segredos no código.
- Preferir novas capacidades apenas se houver benefício cotidiano claro, com critério de aceite verificável.

**Onde decidir:** `docs/produto/GOVERNANCA.md`. **Onde detalhar requisitos aprovados:** especificação do módulo afetado. **Onde registrar o que foi entregue:** `STATUS-E-ESCOPO.md` e estado operacional ativo da esteira. Evitar replicar a mesma regra nos três lugares.
