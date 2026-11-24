# Arquitetura de referência — Plataforma de Evolução Familiar

**Situação (2026-11-24):** V1 aprovada/homologada funcionalmente, disponível para **testes restritos na VPS com HTTPS**, conforme comunicado pelo responsável. O monólito e os módulos 01–04 têm código versionado; isso **não** equivale a segurança auditada ou liberação para dados reais. Esta documentação combina arquitetura implementada com direções ainda propostas: conferir cada contrato no código da branch/commit em análise. Estado atual em `docs/produto/STATUS-E-ESCOPO.md`.

## Estrutura lógica

Web mobile-first (Next.js/React/Mantine, **manifesto PWA instalável na V1**) → API NestJS modular → PostgreSQL (**anexos privados persistidos no banco nesta implantação**). Armazenamento compatível com S3 é uma direção futura, **não tecnologia já implantada**. Web Push/lembretes reais ainda não integram a V1 homologada.

Módulos lógicos:

1. **Família e acesso:** identidade, pessoas, participações, convites e autorização contextual.
2. **Cuidados:** medicamentos, programação com vigência, registros de doses, consultas, exames, apoio.
3. **Desenvolvimento:** desafios, planejamento opcional, participação, movimentos de estrelas, recompensas e resgates.
4. **Acompanhamento:** leitura autorizada de histórico, indicadores e PDFs sob demanda.
5. **Compartilhados:** anexos privados, agendamento de lembretes e rastreabilidade.

**Monólito modular** em um único banco PostgreSQL, sem microsserviços, filas distribuídas, Redis ou Kubernetes por padrão.

## Modelo conceitual mínimo

### Família

`familia`, `pessoa`, `usuario`, `autorizacao`, `convite`.

- Pessoa não exige login.
- `Usuario → Pessoa → Familia` determina a única família da conta; a E1 não introduz `participacao_familiar` nem conta global.
- Papel contextual vincula usuário/família/pessoa-alvo e operação autorizada. A gestão administrativa reutiliza as três responsabilidades contextuais já vigentes (ADR-014); o administrador não é opção desse fluxo e não herda conteúdo sensível.
- Revogação impede novas operações, preservando autoria histórica.
- Vínculo de parentesco não implica autorização.
- Isolamento entre famílias desde a modelagem, sem implementar SaaS comercial.

### Direção pós-V1 — autenticação por família, 2026-11-21

**Fonte funcional aprovada:** Módulo 01 v1.6, FUN-08/FAM-R13. Cada conta pessoal pertence a uma única família. O servidor estabelece e verifica o contexto da família da conta em todas as operações protegidas. A URL legível seleciona o espaço que deve concordar com esse contexto.

Reutilizar a relação vigente Usuario → Pessoa → Familia para a solução mínima, conforme necessário à entrega E1. O detalhamento de rotas, criação de família, convites e sessão deve atender essa cardinalidade. A associação a uma pessoa acompanhada e as autorizações de acompanhamento são resolvidas dentro da mesma família.

A proposta de identidade global com múltiplas participações familiares foi substituída pela decisão explícita do Produto. Validar troca de URL/identificadores, anexos, exportações e rotinas com duas famílias fictícias. Esta nota documenta direção técnica derivada da regra aprovada. O recorte E1 foi implementado e integrado na V1 homologada para testes; consultar a especificação vigente do Módulo 01. O plano original é recuperável no histórico Git.

### Cuidados

`medicamento`, `programacao_medicamento`, `registro_dose`, `consulta`, `exame`, `registro_atividade` e `anexo` compartilhado.

- Programações têm vigência; alterações não sobrescrevem passado.
- A ocorrência prevista é diferente do registro de confirmação.
- Sem confirmação não equivale a dose não tomada.
- Identidade da ocorrência, registro e correção precisam evitar duplicidade e preservar histórico.
- Receitas são documentos; seus campos não são automaticamente extraídos nem considerados clinicamente validados.
- Não gerar indiscriminadamente todas as doses futuras no banco se uma visão derivada da programação for suficiente.

### Desenvolvimento

`desafio`, `desafio_guardado` (retenção/compatibilidade; **não** é Executadas), `disponibilidade_desafio` (estado atual Explorar/Executadas por pessoa+desafio — **ADR-013**), `participacao_desafio`, `movimento_estrelas`, `recompensa` (com ciclo `disponivelParaResgate`/`geracaoDisponibilidade` — **ADR-013**), `resgate_recompensa` (uma ocorrência por geração + chave de solicitação idempotente).

- Especificação funcional **v1.2** (CT-20261119-001/002): Explorar/Executadas e Disponíveis/Resgatadas são disponibilidade atual; histórico de participações/resgates permanece imutável para essa organização.
- `desafio_guardado` preservado; não renomear nem derivar Executadas dele.
- Participação e estrelas são uma transação lógica; participação bem-sucedida fecha disponibilidade; reativação autorizada reabre sem criar pontos.
- Reenvio da mesma `execucaoChave` não duplica pontos; nova execução só após disponibilizar.
- Resgates: Serializable + saldo; unique por `(recompensaId, geracaoDisponibilidade)` e `solicitacaoChave` evitam débito duplicado; disponibilizar não estorna.
- Histórico de movimentos explica saldo e preserva custos antigos; Módulo 04 só lê origem (ADR-009).

### Acompanhamento

A experiência funcional v1.1 **aprovada** possui **Histórico individual** e **Resumo da pessoa**, com PDF acionado no resumo; o resumo familiar são apenas poucos destaques na home. O histórico consulta registros de origem com autorização por pessoa e período. Estrutura auxiliar de eventos só se houver necessidade comprovada. PDFs gerados sob demanda, sem armazenar cópias por padrão.

## Direção técnica pós-V1 — proposta para E1–E7

**Estado:** direção de Produto aprovada em `docs/produto/EVOLUCAO-POS-V1.md` v2.1; desenho técnico abaixo continua candidato por entrega. O recorte E1 vigente está na especificação do Módulo 01, seções 13–14; o planejamento histórico permanece na revisão Git anterior à consolidação da V1. A aprovação da visão não aprova automaticamente todos os modelos propostos.

### Fronteiras no monólito modular

| Fronteira | Fonte própria | Consome |
|---|---|---|
| Fundação familiar | família, pessoa, usuário, convite e autorização | nenhuma regra clínica ou de desenvolvimento |
| Cuidados | medicamentos, programações, relatos, consultas, exames e anexos | identidade/autorização |
| Desenvolvimento | atividades reais, participações, recompensas e catálogo privado | identidade/autorização |
| Catálogo editorial | modelos globais, versões, origem, licença e estado de publicação | nenhum histórico pessoal |
| Jogos | metadados/versionamento do jogo e sessões/resultados mínimos | pessoa autorizada, catálogo e razão de estrelas |
| Evolução | projeções de histórico e resumo a partir das fontes | Cuidados e Desenvolvimento em modo leitura |
| Assistência por IA | solicitações, pacote de fontes, versão da instrução, resposta e estado | somente dados explicitamente selecionados e autorizados |

Continuar no monólito modular. Microserviços, barramento de eventos, banco vetorial e plataforma externa de jogos ficam fora até existir volume ou requisito que justifique operação adicional.

### Isolamento por família

A família da conta é estabelecida pela sessão e comparada ao contexto resolvido pela URL. Toda consulta privada precisa restringir a família na própria operação de banco e validar relações entre IDs. Um helper comum pode padronizar o contexto, mas cada módulo continua responsável por testar suas consultas e mutações.

O isolamento também cobre:

- chave/prefixo e autorização de objetos no armazenamento;
- prévias, downloads e PDFs;
- tarefas agendadas e reprocessamentos;
- caches e chaves de idempotência;
- registros operacionais e notificações;
- solicitações, pacotes e respostas de IA.

O slug é um localizador legível. IDs internos e autorização no servidor continuam sendo a base. Negativas não revelam a existência de recursos de outra família.

### Modelos candidatos, não contratos aprovados

- `familia.slug`: único e estável para navegação.
- `modelo_atividade` + `versao_modelo_atividade`: conteúdo global publicado, origem/licença e versão.
- seleção/disponibilidade por pessoa: referência privada ao modelo ou atividade personalizada.
- `jogo` + `versao_jogo` + `sessao_jogo`: executável avaliado, regra versionada e resultado mínimo.
- movimento de estrelas com origem, regra/versão e chave idempotente.
- `solicitacao_assistida`: caso de uso, pessoa, família, período, hash/referências das fontes, consentimento/aviso aplicável, estado e resposta versionada.

A modelagem final deve primeiro verificar extensões seguras das entidades existentes. Não duplicar participação, histórico ou razão de estrelas apenas para acomodar a nova interface.

### Processamento assistido

Usar chamada no backend e estado persistido. A primeira opção é fila lógica no próprio banco com trabalhador da aplicação e retry limitado. Resposta estruturada passa por validação de esquema, tamanho e referências antes de ficar visível. Falha, timeout ou limite de custo mantém os fluxos determinísticos disponíveis.

Separar três políticas: geração editorial genérica, sugestões pessoais de desenvolvimento e resumo de saúde. Elas possuem minimização, instruções, autorização, retenção e limites independentes. Resposta anterior pode ser contexto de comparação, mas não fonte factual recursiva.

### Quality gates adicionais

- matriz de isolamento com duas famílias para cada endpoint, arquivo, PDF, job e geração;
- teste de contrato entre fonte e projeção do Resumo;
- teste de idempotência/concorrência em sessão digital e estrelas;
- inventário e verificação de licença/dependência de cada jogo e recurso;
- testes de arquivo malformado, tamanho, tipo, autorização e expiração;
- logs sem conteúdo clínico ou infantil desnecessário;
- revisão de acessibilidade e homologação por jornada além dos testes automatizados.

## Contratos de API — rascunho

- `GET /me`
- `GET|POST /familias/{id}/pessoas`
- `GET|PATCH /pessoas/{id}`
- `POST /familias/{id}/convites`
- `GET /familias/{id}/acessos`; `PATCH|DELETE /acessos/{id}`
- `GET /pessoas/{id}/cuidados/hoje`
- `GET|POST /pessoas/{id}/medicamentos`
- `PUT /medicamentos/{id}/programacao`
- `POST /medicamentos/{id}/encerramento`
- `POST /medicamentos/{id}/doses/registros`; `PATCH /registros-doses/{id}`
- `GET|POST /pessoas/{id}/consultas`; `POST /pessoas/{id}/exames`
- `GET /desafios`; `POST /familias/{id}/desafios`
- `GET|POST /pessoas/{id}/desafios`
- `POST /pessoas/{id}/participacoes`
- `GET /pessoas/{id}/estrelas`; `GET|POST /pessoas/{id}/recompensas`; `POST /pessoas/{id}/resgates`
- `GET /pessoas/{id}/historico`; `GET /pessoas/{id}/acompanhamento`; `GET /familias/{id}/resumo`; `GET /pessoas/{id}/relatorio.pdf`

Esta lista é um **rascunho conceitual histórico**, não um inventário confiável dos endpoints já implementados. Para contratos reais, inspecionar controladores/rotas da branch e do commit relevante; decisões sobre formatos, validações, segurança e idempotência pertencem à Arquitetura. Não alterar regras funcionais por inferência da lista.

## Preocupações transversais

- Autorização no backend mesmo quando botões ocultos no frontend.
- Operações de negócio atômicas e proteção contra duplicação.
- Acesso privado a anexos; nunca URLs públicas permanentes para exames e receitas.
- Backups e testes de restauração cobrindo banco e objetos.
- Tratamento consistente de fuso horário em agendas e doses.
- PWA e notificações de medicamentos precisam de teste em dispositivos reais; não depender delas como único mecanismo de segurança.
- Sem segredos ou dados reais de saúde no repositório.

## Evidência estática para E1 — 2026-11-21

Inspeção de `develop` @ `9193f1660ec2fa06ebdd19d633cc83b86e3a828e`: Familia ainda não possui slug; login recebe e-mail/senha sem família; rotas web ainda não têm /f/[slug]. Anexos implementados usam `conteudoBase64` no banco e retorno autenticado. Armazenamento S3 é direção arquitetural, não integração demonstrada por essa inspeção. A E1 deve proteger o caminho de arquivo existente sem exigir migração de armazenamento para cumprir o isolamento.

Preservar as combinações da ADR-014: Cuidados Responsável/Integrante e Desenvolvimento Responsável. Integrante em Desenvolvimento e concessão genérica de Administrador continuam fora do escopo. A criação da primeira administração, agora disponível no cadastro inicial conforme Módulo 01 v1.8 §14, não amplia o catálogo genérico de concessão familiar.

## Alteração E1 — cadastro inicial sem envio de e-mail, 2026-11-21

**Fonte de Produto aprovada:** Módulo 01 v1.8, FUN-09 e §14. A exclusividade do provisionamento privado é substituída pelo cadastro inicial na interface; o utilitário CLI pode permanecer para testes/desenvolvimento.

A implementação deve extrair/reutilizar a regra de criação consistente de família, pessoa, usuário e autorização inicial no backend. Não expor o script CLI como rota nem confiar em papel/familiaId enviados pelo navegador. O cadastro cria somente uma nova família, mantendo unicidade global de e-mail, slug único e limites da ADR-014.

Preservar transação e restrições de unicidade; tratar corrida, reenvio e falha sem estado parcial. Definir mecanismo simples de idempotência para a mesma solicitação de cadastro, sem persistir senha em claro ou registrá-la em logs. Validar campos e limites no servidor; limitar abuso da nova operação anônima proporcionalmente ao ambiente.

Reservar segmentos públicos como criar, considerando rotas estáticas de Next.js e validação de slug no servidor. Excluir /f e /f/criar da guarda que exige sessão/família; não estender essa exceção às rotas privadas. A raiz deve tratar sessão válida e visitante sem reutilizar contexto familiar indevido.

A confirmação constrói a URL a partir de origem confiável/configurada para o ambiente e slug validado. O endereço é exibido para copiar/acessar. E-mail segue como identificador obrigatório; não há envio, verificação de e-mail nem recuperação por mensagem neste escopo, e a conta não pode ser marcada como verificada.

**Base estática desta correção:** develop @ efb9fecf07db18b2c20057e8ec7fd28663b26916. O provisionamento atual está em apps/api/scripts/lib-provisionar-familia.mjs; o PainelFundacao contém /f/oliveira/entrar fixo; não existe apps/web/src/app/f/page.tsx. São evidências de código consultado, não teste do localhost do responsável.
