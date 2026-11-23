# Governança de Produto — Plataforma de Evolução Familiar

**Versão:** 1.0  
**Aprovação:** 2026-11-16 — estrutura mínima, autonomia e implantação incremental aprovadas pelo responsável pelo produto.  
**Escopo:** decisões, transferência de contexto, rastreabilidade e reconciliação. Este documento não altera requisitos funcionais, decisões arquiteturais ou a esteira de desenvolvimento.

## 1. Princípio operacional

O repositório GitHub é a fonte oficial **após a incorporação da decisão na documentação vigente**. Conversas são ambientes de discussão, não fontes canônicas. Não exigir que uma nova conversa leia o histórico completo de chats; carregar apenas o contexto necessário à especialidade.

Governança deve reduzir retrabalho: **nenhum registro por formalidade, nenhuma duplicação de regras, nenhum novo agente por padrão**. Respeitar evolução familiar, esforço mínimo e organização sem cobrança.

## 2. Onde está a verdade de cada assunto

| Assunto | Fonte canônica | Não confundir com |
|---|---|---|
| Visão, princípios e limites do MVP | `docs/produto/DOCUMENTO-MESTRE.md` | Status de implementação |
| Regras e critérios de aceite | `docs/modulos/<módulo>/ESPECIFICACAO.md` | Uma proposta em conversa |
| Padrões de UX | `docs/ux-ui/GUIA-DE-EXPERIENCIA.md` e revisões de UX | Alteração de regra funcional |
| Soluções e decisões técnicas | `docs/arquitetura/ARQUITETURA.md` e `DECISOES.md` | Endpoint candidato sem contrato validado |
| Estado consolidado, lacunas e homologação | `docs/produto/STATUS-E-ESCOPO.md` | Registro histórico da execução |
| Execução e evidências locais | `docs/esteira/REGISTRO.md`, `estado/atual.json` e evidências | Homologação familiar ou segurança em produção |
| Processo de governança | Este arquivo | Repetição de todas as decisões |

A implementação **é o código da branch e commit inspecionados**. Uma especificação aprovada não comprova código; QG-3 registrado não substitui teste independente, homologação com usuários ou revisão de segurança.

## 3. Responsabilidades e autonomia

| Especialidade | Autonomia | Escalar quando |
|---|---|---|
| Produto (Visão Geral) | Escopo, regras de negócio, prioridades e requisitos funcionais | Solução técnica/UX precisar de especialista |
| UX e Usabilidade | Layout, rótulos, componentes e interações compatíveis com as regras vigentes | Mudar obrigação, permissão, privacidade, dados ou comportamento |
| Arquitetura | Soluções técnicas dentro do escopo aprovado; contratos e restrições técnicas | Afetar comportamento, risco relevante, escopo ou decisão estrutural |
| Acompanhamento e Qualidade | Constatar estado, evidências e divergências; sugerir correções | Nova regra ou alteração de especificação for necessária |
| Governança | Classificar, localizar fontes, reconciliar e encaminhar conflitos | Aprovar decisão funcional/estrutural: **não pode decidir unilateralmente** |

Quem registra uma proposta não adquire autoridade sobre o domínio de destino. A revisão por outra área deve ser solicitada **apenas quando o impacto for material**.

## 4. Classificação de decisões

- **L1 — Local, simples, reversível:** a especialidade resolve; atualiza seu documento existente somente se criar/alterar um padrão reutilizável. Ex.: trocar rótulo mantendo a regra.
- **L2 — Transversal:** especialista proprietário decide dentro de sua competência, consulta apenas áreas efetivamente afetadas e referencia a decisão aprovada. Ex.: experiência de confirmação que toca UX e registro, mas preserva os estados funcionais.
- **L3 — Estrutural ou mudança de produto:** exige aprovação **explícita** do responsável pelo produto antes de mudar a fonte canônica. Ex.: novo módulo, alteração de acesso sensível ou regra de estrelas.

**Regra de proteção:** não tratar mudança envolvendo saúde, criança, permissão, segurança ou perda de dados como L1 se houver impacto material. Resolver ambiguidades consultando a fonte aprovada antes de iniciar novas aprovações.

## 5. Estados e rastreabilidade

Estados da **decisão**: `PROPOSTA`, `NEEDS_DECISION`, `APROVADA`, `REJEITADA`, `DOCUMENTADA`.

- `APROVADA`: autorização humana explícita quando exigida, com destino documental identificado.
- `DOCUMENTADA`: texto aprovado incorporado à fonte canônica, com referência à alteração; **não** significa implementado.
- `NEEDS_DECISION`: decisão fora da autonomia local; não presumir aprovação por silêncio.
- Estados de implementação e testes continuam exclusivamente no registro/estado da esteira. Não acrescentar estados paralelos de desenvolvimento à governança.
- Para documentos alterados, usar revisão Git/histórico de alterações como registro principal; preservar IDs de requisitos e decisões arquiteturais já existentes.

## 6. Contrato compacto de transferência — CT v1

Usar **somente quando necessário** cruzar especialidades, registrar conflito material ou obter aprovação. Não criar um arquivo individual para cada CT.

```yaml
CT: CT-AAAAMMDD-NNN
origem: UX
destino: Produto
problema: "Fato ou dúvida objetiva"
decisao_ou_proposta: "Mudança pretendida ou decisão aprovada"
justificativa: "Impacto para a família ou produto"
status: PROPOSTA
impactos: [UX, REGRA]
dependencias: ["CUI-F03"]
referencias: ["docs/modulos/02-cuidados-vovo/ESPECIFICACAO.md"]
encaminhamento: "Decidir se altera o comportamento existente"
```

Campos mínimos: identificador, origem/destino, problema, decisão/proposta, justificativa, status, impactos/dependências, fontes e encaminhamento. Usar `CT-AAAAMMDD-NNN` apenas como referência na conversa/alteração documental. Se for resultado de inspeção de código, **informar branch e SHA do commit examinado**.

Reutilizar o mesmo CT durante o encaminhamento. Se rejeitado, registrar o motivo somente quando necessário para evitar rediscussão. Se aprovado, atualizar o documento **dono da regra**; os demais documentos referenciam, não copiam. CT é mecanismo de transporte, não banco de dados paralelo.

## 7. Reconciliação e conflitos

1. Confirmar **branch e commit** usados para falar de implementação, e versão/status para falar de decisão.
2. Classificar: proposta, decisão aprovada, texto antigo, regra contraditória, código divergente ou evidência insuficiente.
3. Identificar qual fonte tem autoridade sobre **a pergunta concreta** (tabela da seção 2).
4. Se for apenas status desatualizado, atualizar `STATUS-E-ESCOPO.md` com evidências; não reaprovar requisito.
5. Se a proposta contrariar regra aprovada, encaminhar ao proprietário e, sendo L3, pedir aprovação explícita. Não corrigir unilateralmente a regra para adequá-la ao código.
6. Se o código divergir da especificação, registrar não conformidade para Acompanhamento; somente mudar a especificação por decisão de Produto.
7. Corrigir referências derivadas que induzam erro, mantendo uma **única fonte primária** para cada regra. Marcar decisões arquiteturais substituídas em `DECISOES.md` em vez de apagá-las.

**Falha segura:** diante de incerteza de autorização, saúde ou dados de crianças, não alargar acesso nem inventar regras; classificar `NEEDS_DECISION` e continuar apenas o trabalho independente.

## 8. Entrada em uma conversa nova

**Camada 1 — orientação (leitura curta):** `docs/produto/GOVERNANCA.md` e `docs/produto/STATUS-E-ESCOPO.md`.

**Camada 2 — assunto:** carregar somente a especificação do módulo, guia de UX ou ADR aplicável.

**Camada 3 — evidências (sob demanda):** branch/commit relevantes, arquivos de código, testes e relatórios específicos. Não transcrever o Documento Mestre inteiro em prompts e não confiar em resumo antigo sem conferir a fonte atual.

Para continuação, informar: objetivo atual, especialista, caminhos relevantes, CT pendente (se houver), branch/commit (se pertinente) e o próximo encaminhamento. Não reconstituir a conversa completa.

## 9. Interface com o desenvolvimento existente

A governança entrega **especificação aprovada e suas referências** ao fluxo de desenvolvimento contínuo (`task-routing` → `module-planning` quando necessário → `implementation-workflow` → `quality-gate`). O fluxo devolve evidências, divergências e `NEEDS_DECISION`, sem tornar testes uma aprovação de produto.

A esteira (`.cursor/`, `scripts/esteira/`, `docs/esteira/`, `AGENTS.md`) evolui para receber correções, melhorias, CTs aprovados, módulos e homologação, **sem** criar requisitos novos nem duplicar decisões. Alterações de processo da esteira não substituem aprovação L3 de produto. Nenhum agente/automação deve executar `git commit`, `git push`, merge ou deploy automaticamente. Publicação e integração do material documental exigem ação humana separada.

## 10. Quando revisar a governança

Revisar apenas se houver confusão recorrente de autoridade, decisões contraditórias que escaparam ao fluxo ou excesso comprovado de manutenção. Não exigir cerimônias, reuniões, relatórios ou atualizações periódicas sem necessidade demonstrável.

**Critério de sucesso:** uma conversa entende a regra vigente, toma decisões dentro da própria autonomia e encaminha exceções com contexto mínimo, sem exigir que a família — ou o responsável pelo produto — mantenha um sistema adicional.
