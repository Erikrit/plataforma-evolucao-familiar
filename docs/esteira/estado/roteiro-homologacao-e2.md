# Roteiro de homologação humana — DEM-E2-ACESSOS-20261122

**Critério humano:** E2-ACE-08  
**Defeito relacionado:** DEF-E2-ATIVACAO-20261122 (só encerra após validação desta jornada)  
**Pré-requisito técnico:** QG-1/QG-2/QG-3 e verifier PASS nesta demanda  
**Ambiente:** aplicação local (`apps/web` + `apps/api`), janela anônima  
**Dispositivos:** celular e desktop  
**Papéis:** administrador, responsável/integrante e pessoa com acesso próprio, em duas famílias fictícias

## Preparação

1. Abrir janela anônima (sem sessão anterior).
2. Confirmar API e web locais no ar.
3. Usar famílias de teste (não dados reais). Preferir famílias criadas em E1 ou provisionadas.

## Jornada 1 — Cadastrar pessoa e ativar conta pelo link

1. Entrar como administrador da família A.
2. Em **Gerenciar família → Pessoas**, cadastrar pessoa só com nome (sem conta).
3. Em outra pessoa (ou na mesma), marcar necessidade de entrar / **Habilitar conta** com e-mail.
4. Após persistir, deve aparecer **“Convite criado — compartilhe o link para ativar o acesso”**, URL completa, validade e **Copiar link de ativação** (ou seleção manual).
5. Não deve afirmar que e-mail foi enviado.
6. Abrir o link em janela anônima (ou outro navegador), definir senha e ativar.
7. Confirmar login na família correta e que a pessoa não foi duplicada.
8. Em Pessoas/Convites, estados devem refletir conta ativa / convite ativado.

## Jornada 2 — Conceder acompanhamento

1. Como administrador, em **Acessos e responsabilidades**, conceder a alguém com conta uma combinação ADR-014 (ex.: Desenvolvimento como Responsável).
2. Revisar a frase do tipo “X acompanhará Y em Área como Papel” antes de confirmar.
3. Em **Convites**, gerar convite contextual para quem ainda não tem conta; mesmas combinações; copiar/compartilhar link.
4. Confirmar que convite pendente não aparece como acompanhamento ativo até a ativação.

## Jornada 3 — Retirar acompanhamento e bloqueio

1. Revogar o acompanhamento concedido.
2. Confirmar que operações futuras na área ficam bloqueadas para quem perdeu o acesso.
3. Tentar URL/API direta na área revogada: sem acesso indevido.
4. Confirmar que o último administrador não pode ser removido.
5. Confirmar isolamento: link/convite da família A não ativa na família B.

## Falhas esperadas

| Tentativa | Esperado |
|---|---|
| Convite já usado | Orientação clara; sem nova conta |
| Convite expirado | Orientação; pedir novo convite |
| Link de outra família | Recusa de contexto |
| E-mail já com conta | Sem vincular/tomar conta existente |
| Clipboard indisponível | Campo para seleção manual do link |
| Falha de rede ao gerar | Sem sucesso falso nem “enviado” |

## Registro do aceite

- [ ] Desktop — jornada cadastrar/ativar OK  
- [ ] Desktop — conceder acompanhamento OK  
- [ ] Desktop — retirar e bloquear OK  
- [ ] Celular — ao menos cadastrar/ativar + conceder ou retirar OK  
- [ ] Duas famílias / isolamento OK  
- [ ] Sem expectativa de e-mail enviado OK  
- [ ] DEF-E2-ATIVACAO-20261122 validado na jornada afetada  

**Resultado:** APROVADA / REPROVADA  
**Data / responsável:**  
**Escopo efetivamente percorrido:**  
**Observações:**  
