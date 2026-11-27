# Preparação para o lançamento — apresentação, sugestões, operação e segurança

**Demanda:** `LAN-PREPARACAO` · **Tipo:** nova funcionalidade (Módulo 01) e revisão de segurança · **Origem:** humano · **Status:** READY — decisões aprovadas pelo responsável pelo Produto em 2026-11-27.

**Base:** a `develop` no início do ticket 01. **Começar depois do ticket 12 de `DEV-CAT-M1-CONTEUDO`** (Marco 1 homologado), para não disputar o estado ativo da esteira. **Fonte funcional:** [Módulo 01 §17 v1.11](../../../modulos/01-fundacao-familiar/ESPECIFICACAO.md). **Fonte técnica:** ADR-019 (operação) e ADR-015 (autenticação) em `docs/arquitetura/DECISOES.md`.

## Problema

Para o primeiro lançamento, quem entra pela primeira vez não recebe nenhuma orientação: o administrador cria a família e cai numa página inicial vazia. Também não há canal para as pessoas contarem o que falta ou o que deu errado, nem um lugar para quem desenvolve ler isso. E o `STATUS-E-ESCOPO.md` §4 mantém a revisão de segurança como bloqueio antes do uso real.

## Solução

- **Apresentação no primeiro acesso (FUN-10):** de duas a quatro telas por perfil, com Pular, gravada na conta e revista em Configurações → Como funciona.
- **Enviar sugestão (FUN-11):** formulário curto em Configurações, anônimo por padrão, com contato opcional.
- **Operação → Sugestões (ADR-019):** página só de leitura para os e-mails da lista `PEF_OPERADORES_EMAILS`, sem dados das famílias.
- **Revisão de segurança:** roteiro fechado sobre login, sessão, cookies, autorização, entradas e configuração, com correção apenas de falhas comprovadas.

## Requisitos

- FUN-10, FUN-11 e M01 §17 (LAN-APR-01 a 05, LAN-SUG-01 a 05, LAN-OPE-01 a 05) — APROVADO (2026-11-27)
- ADR-019 — APROVADA (2026-11-27)
- ADR-015, ADR-006 e ADR-014 — vigentes e não redesenhadas
- STATUS §4 item 2 (segurança antes do uso real) — pendência aberta

## Decisões de implementação

- **Nomes.** No domínio e no código: **sugestão para a plataforma** (`SugestaoPlataforma`), para não colidir com `SugestaoDesafioPessoa` e com o termo Sugestão do Módulo 03. **Tela de origem** é o rótulo legível da tela, não o termo Área do glossário. **Apresentação** e **Operador da plataforma** estão no `GLOSSARIO.md` como PROPOSTA.
- **Apresentação vista.** Coluna anulável na conta (por exemplo `Usuario.apresentacaoVistaEm`) e uma operação idempotente na sessão atual (por exemplo `POST /me/apresentacao`). O `GET /me` informa se falta ver e qual perfil usar. O perfil vem das autorizações ativas: `administrador` → Administrador; `responsavel_cuidados` ou `responsavel_desenvolvimento` → Responsável; demais → Integrante.
- **Rota da apresentação.** Uma página na família, por exemplo `/f/[slug]/como-funciona`, usada no primeiro acesso e em Configurações → Como funciona. Reservar o segmento se a regra de slugs exigir (M01 §14).
- **Sugestão para a plataforma.** Tabela própria com tipo (`ideia`, `problema`, `outro`), texto, tela de origem, versão do aplicativo, `contatoPermitido`, autor e data. A tela de origem é calculada no cliente a partir da rota, com um mapa fechado de rótulos, e validada no servidor contra o mesmo conjunto. O servidor rejeita qualquer valor fora do mapa, e nunca grava caminho completo. Chave de idempotência no envio. Limite diário de 10 por conta, contado no servidor.
- **Operação.** Guarda própria depois da `GuardaSessao`, que lê `PEF_OPERADORES_EMAILS` a cada requisição. Para quem não é operador, devolve 404. Projeção fechada no serviço, sem retornar entidades do Prisma. Na web, uma rota fora de `/f/[slug]` (por exemplo `/operacao/sugestoes`) que só mostra conteúdo se a API autorizar. O item de menu só aparece com `operador: true` no `GET /me`.
- **Banco.** Migrações versionadas e coerentes numa instalação do zero. O banco da VPS de testes pode ser recriado pelo responsável (`docs/agents/projeto.md`).
- **Versão do aplicativo.** Usar a versão já exposta pela build. Se não houver, usar o commit curto injetado na build. Não criar mecanismo novo de versionamento.

## Costuras e testes

| Costura | Pega | Deixa passar | Testes semelhantes |
|---|---|---|---|
| API de sessão e conta | Perfil errado, registro não idempotente, falha que bloqueia a entrada | Texto das telas | `smoke:e1-*`, `smoke:authz` |
| API de sugestões | Validação, limite diário, idempotência, tela de origem fora do mapa, vazamento de identificadores | Qualidade do texto enviado | smoke novo `smoke:lan-sug` |
| API de operação | Acesso de não operador, lista vazia, projeção com campos proibidos | Leiaute | smoke novo `smoke:lan-ope` |
| Interface | Navegação da apresentação, foco, 320 px, menus condicionais, texto puro | Gosto visual | roteiro de homologação |
| Revisão de segurança | Falhas do roteiro do ticket 04 | Ataques fora do roteiro | `smoke:authz`, testes novos por achado |

## Riscos e dependências

- **Alto:** autorização (o operador é um caminho novo) e privacidade (texto livre pode conter dado sensível). Mitigação: projeção fechada, 404 para não operador, aviso no formulário e regressão `smoke:authz`.
- **Médio:** a revisão de segurança pode achar falhas estruturais. Elas viram `NEEDS_DECISION`, sem redesenho dentro do ticket (ADR-015).
- Falhas anteriores, iguais na base: `check:e2` (`boas_vindas_sem_envio`) e `smoke:e1-ent` (`E1-ENT-02-colisao-slug`). Não atribuir a esta demanda.

## Fora do escopo

Tour com balões sobre a interface, conteúdo novo na tela pública de boas-vindas, cartão de primeiros passos, resposta ou status de sugestões, papel de super-administrador, leitura de dados de famílias pelo operador, envio de e-mail, Web Push, auditoria de segurança externa e declaração de prontidão para produção.

## Execução no Claude Code

Cada ticket começa em sessão nova, na `develop` atualizada, depois do encerramento de `DEV-CAT-M1-CONTEUDO`. Todos os tickets estão `READY`; respeite a coluna "Depende de".

| Ticket | Comando | Depende de |
|---|---|---|
| 01 | `/implementar docs/esteira/tickets/preparacao-lancamento/01-apresentacao-primeiro-acesso.md` | — |
| 02 | `/implementar docs/esteira/tickets/preparacao-lancamento/02-enviar-sugestao-plataforma.md` | — |
| 03 | `/implementar docs/esteira/tickets/preparacao-lancamento/03-operacao-ler-sugestoes.md` | 02 |
| 04 | `/implementar docs/esteira/tickets/preparacao-lancamento/04-revisao-seguranca.md` | 01 a 03 |
| 05 | `/homologar LAN-PREPARACAO` | 01 a 04 |

Verificação com banco e API locais, a cada ticket que toque API ou smokes (`<BASE>` = commit da `develop` no início do ticket 01):

```bash
bash scripts/verificar-local.sh LAN-PREPARACAO <BASE> qg1 qg2
```

Lembretes:

- Dados sempre fictícios. A limpeza do banco da VPS é feita pelo responsável, nunca pelo agente.
- `PEF_OPERADORES_EMAILS` vai para `deploy/homolog/env.example` só como exemplo vazio. E-mails reais não são versionados.
- Ao concluir cada ticket, entregar a `mensagemCommit` (skill `entrega`) e atualizar o status no arquivo do ticket.
