# 04: Revisão de segurança antes do lançamento

**O que entregar:** Uma revisão interna, por roteiro fechado, do que o `STATUS-E-ESCOPO.md` §4 item 2 pede antes do uso real: autenticação, proteção do login, sessão e cookies, limites de acesso a saúde e crianças e configuração do ambiente HTTPS. O resultado é uma tabela curta de achados, cada um com severidade, evidência e decisão: **corrigido**, **aceito pelo responsável** ou **NEEDS_DECISION**. Só falhas comprovadas são corrigidas, cada uma com teste que falhava antes (ADR-015). Mudança estrutural vira `NEEDS_DECISION`, sem redesenho.

**Bloqueado por:** 01 a 03 (a revisão cobre as rotas novas)

**Status:** READY

**Costura:** `smoke:authz`, testes novos por achado e inspeção de configuração

**Risco:** alto

## Achados já observados no planejamento (confirmar antes de corrigir)

1. **Login sem limite de tentativas.** `POST /sessoes` não limita tentativas por e-mail e IP. O cadastro de família já limita (`servico-cadastro-familia.ts`). Proposta: reaproveitar o mesmo mecanismo no login, com mensagem que não revela se o e-mail existe.
2. **Senha mínima diferente.** O cadastro exige 8 caracteres (`servico-cadastro-familia.ts`) e a ativação por convite exige 6 (`servico-convites.ts`). Alinhar é uma regra de produto: **NEEDS_DECISION** se o responsável ainda não tiver decidido. A proposta é 8 nos dois fluxos.
3. **`COOKIE_SECURE` desligado por padrão.** No `docker-compose.homolog.yml`, o padrão é `false`. O `env.example` usa `true`, mas uma variável esquecida tira o `Secure` do cookie em silêncio. Proposta: padrão `true` no compose de homologação, ou falha ao iniciar sem a variável.
4. **Cabeçalhos de segurança.** A API não define cabeçalhos próprios (`main.ts`). Conferir o que o proxy de `deploy/homolog` já envia (HSTS, `X-Content-Type-Options`, `frame-ancestors`/`X-Frame-Options`, `Referrer-Policy`) antes de acrescentar algo na aplicação.

## Roteiro

- **Sessão:**
  - token opaco com hash;
  - duração de 12 h;
  - logout e revogação apagam a sessão no servidor;
  - cookie `HttpOnly`, `SameSite=Lax` e `Secure` na VPS.
- **Login:**
  - mesma mensagem para e-mail inexistente e para senha errada;
  - limite de tentativas (achado 1);
  - senha (achado 2).
- **Autorização:**
  - chamadas diretas com identificadores de outra família e de outra pessoa em todas as rotas, inclusive anexos, Histórico, Resumo/PDF, jogos e as rotas novas de apresentação, sugestões e operação;
  - acesso revogado;
  - administrador sem acesso a saúde e crianças.
- **Entradas:**
  - limites de corpo e de anexo;
  - tipos de arquivo aceitos;
  - texto livre exibido sem interpretar HTML.
- **Configuração:**
  - CORS restrito a `WEB_ORIGIN`;
  - `PEF_LABORATORIO_2D` desligado na VPS;
  - `PEF_OPERADORES_EMAILS` vazio por padrão;
  - nenhum segredo versionado;
  - mensagens de erro sem pilha nem SQL.
- **Dependências:** `npm audit --omit=dev`. Vulnerabilidade alta ou crítica com correção disponível é corrigida; sem correção, é registrada.

## Critérios

- [ ] Tabela de achados no fim deste ticket, com severidade, evidência (comando e resultado) e decisão de cada item
- [ ] Cada falha corrigida tem teste que falhava antes e passa depois
- [ ] `smoke:authz`, `smoke:lan-sug`, `smoke:lan-ope` e os smokes afetados PASS
- [ ] `STATUS-E-ESCOPO.md` §4 item 2 atualizado só com o que foi verificado. Não declarar "segurança auditada" nem "pronto para produção"
- [ ] Nenhuma operação na VPS executada pelo agente; ajustes de ambiente entregues como instrução ao responsável
