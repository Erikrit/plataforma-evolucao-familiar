# 03: Operação → Sugestões, só leitura (ADR-019)

**O que entregar:** Uma conta cujo e-mail está em `PEF_OPERADORES_EMAILS` (API) vê o item **Operação → Sugestões** e lê as sugestões para a plataforma de todas as famílias, das mais recentes para as mais antigas, com filtro por tipo e paginação. Cada item mostra tipo, texto, tela de origem, versão, data e, só com contato autorizado, o e-mail. Para quem não é operador, o item não aparece, e a página e a API respondem como inexistentes. Regras em M01 §17.3 e ADR-019.

**Bloqueado por:** 02

**Status:** READY

**Costura:** API de operação (`smoke:lan-ope`, novo), `smoke:authz` e interface

**Risco:** alto (autorização)

## Critérios

- [ ] LAN-OPE-01 — operador lista sugestões de duas famílias fictícias, mais recentes primeiro, com filtro por tipo e paginação
- [ ] LAN-OPE-02 — conta fora da lista recebe 404 na API e "não encontrada" na página; variável ausente ou vazia não libera ninguém; e-mail com maiúsculas ou espaços na lista é reconhecido
- [ ] LAN-OPE-03 — a resposta não contém família, slug, pessoa, identificador de conta nem perfil (o teste verifica as chaves exatas da projeção)
- [ ] LAN-OPE-04 — ser operador não muda as autorizações na própria família nem dá acesso a rotas de outras famílias; `smoke:authz` PASS
- [ ] LAN-OPE-05 — texto exibido como texto puro (teste com `<script>` e link no conteúdo)
- [ ] `GET /me` informa `operador` só como dica de interface; a guarda do servidor decide
- [ ] `PEF_OPERADORES_EMAILS` documentada em `deploy/homolog/env.example`, vazia; nenhum e-mail real versionado
- [ ] `smoke:lan-ope` registrado em `esteira.config.json` e PASS
