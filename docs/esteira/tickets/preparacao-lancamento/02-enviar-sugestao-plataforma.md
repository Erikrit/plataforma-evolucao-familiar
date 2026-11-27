# 02: Enviar sugestão para a plataforma

**O que entregar:** Em **Configurações → Enviar sugestão**, qualquer pessoa com conta escolhe o tipo (Ideia, Problema ou Outro) e escreve de 10 a 1.000 caracteres, vendo um contador. Junto ao texto aparece o aviso "Não escreva informações de saúde, de crianças ou senhas.". Também pode marcar **Pode me contatar por e-mail**, que vem desmarcado. O envio grava a tela de origem e a versão do aplicativo. A confirmação aparece só depois de gravar. O formulário é anônimo por padrão e limitado a 10 envios por conta por dia. Regras em M01 §17.2.

**Bloqueado por:** nenhum

**Status:** READY

**Costura:** API de sugestões (`smoke:lan-sug`, novo) e interface

**Risco:** alto (privacidade de texto livre)

## Critérios

- [ ] LAN-SUG-01 — envio válido grava e confirma após persistir; sem sessão, a API recusa
- [ ] LAN-SUG-02 — tipo inválido ou texto fora de 10 a 1.000 caracteres é recusado no servidor, com mensagem junto ao campo
- [ ] LAN-SUG-03 — grava só o rótulo da tela de origem (mapa fechado, validado no servidor) e a versão; nunca caminho completo, slug, identificador de família ou de pessoa
- [ ] LAN-SUG-04 — contato desmarcado por padrão; o e-mail exibido no formulário é o da conta
- [ ] LAN-SUG-05 — a 11ª sugestão do dia é recusada com mensagem clara; repetir o mesmo envio (mesma chave) não duplica
- [ ] Em falha de rede, o texto continua preenchido e é possível tentar de novo
- [ ] Modelo `SugestaoPlataforma` com migração coerente do zero; nome não colide com `SugestaoDesafioPessoa`
- [ ] `smoke:lan-sug` registrado em `esteira.config.json` e PASS; `smoke:authz` sem regressão
