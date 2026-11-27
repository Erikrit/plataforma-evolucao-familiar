# 01: Apresentação no primeiro acesso, por perfil

**O que entregar:** No primeiro login, cada conta vê a apresentação do seu perfil de experiência: Administrador até 4 telas, Responsável até 3 e Integrante até 2. Os botões **Anterior**, **Próximo** e **Pular** ficam sempre visíveis. **Começar** ou **Pular** gravam na conta, no servidor, que a apresentação foi vista, e levam à página inicial da família. **Configurações → Como funciona** reabre a apresentação do perfil atual a qualquer momento. Regras e conteúdo em M01 §17.1.

**Bloqueado por:** nenhum

**Status:** READY

**Costura:** API de sessão/conta (smoke) e interface (roteiro de homologação)

**Risco:** medio

## Critérios

- [ ] LAN-APR-01 — primeiro login abre a apresentação do perfil certo, com no máximo 4, 3 e 2 telas; perfil calculado no servidor a partir das autorizações ativas
- [ ] LAN-APR-02 — Pular ou Começar gravam a data na conta; novo login em outro navegador vai direto à página inicial; reenvio é idempotente
- [ ] LAN-APR-03 — falha ao gravar não bloqueia a entrada; a apresentação volta no próximo login
- [ ] LAN-APR-04 — Configurações → Como funciona reabre a apresentação sem alterar o registro
- [ ] LAN-APR-05 — teclado e toque, posição anunciada em texto ("2 de 4"), foco na abertura, movimento reduzido e 320 px sem rolagem horizontal
- [ ] Textos curtos, sem jargão e sem prometer recurso inexistente (por exemplo notificações); o Administrador recebe a mensagem de que não vê automaticamente dados de saúde e das crianças
- [ ] Migração da coluna na conta coerente numa instalação do zero; smokes `e1-*` e `authz` sem regressão
