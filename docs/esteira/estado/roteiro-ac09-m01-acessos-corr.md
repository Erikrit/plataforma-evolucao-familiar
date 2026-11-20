# Roteiro AC-09 — Homologação humana (PENDING_HUMAN)

**Demanda:** DEM-M01-ACESSOS-CORR-20261120  
**Critério:** a previsão feita pelo administrador na revisão deve coincidir com o que a outra conta vê e pode fazer.  
**Dispositivos:** celular e desktop. **Dados:** apenas fictícios.

## Contas fictícias (seed local)

| Papel no cenário | Uso sugerido | Observação |
|---|---|---|
| Administrador | `admin@pef.local` | Gerencia família; sem conteúdo clínico só por esse papel |
| Responsável (Cuidados / Desenvolvimento) | `mikaela@pef.local` | Usar após concessões do roteiro |
| Integrante (Cuidados) | `ana.paula@pef.local` | Isolar vínculos no cenário de privacidade |
| Pessoas | Avó/Helena Oliveira, Laurinha | Seed local; não usar dados reais |

Senhas: variáveis `PEF_*_SENHA` do `.env` local (não copiar para evidência pública).

## Família de teste sugerida

Preparar/confirmar: **Avó**, **Laurinha**, **Administrador**, **Cuidadora (Integrante)**, **Responsável**. Contas independentes. Para privacidade, a conta testada deve ter só os vínculos do cenário.

## Percurso (celular e desktop)

1. Entrar como Administrador → Gerenciar família → Acessos.
2. Conferir **Por pessoa acompanhada** e **Por participante**; bloco **Administração da família**.
3. Conceder Cuidados da Avó como **Integrante** a uma conta de teste; na revisão, ler em voz alta o efeito; confirmar; entrar com a conta e comparar.
4. Repetir com **Responsável** de Cuidados (programação/anexos/exportação).
5. Acumular Desenvolvimento da Laurinha; consultar por participante; trocar de pessoa na sessão e conferir menu/ações.
6. Retirar só Cuidados da Avó; novo login; Desenvolvimento permanece; Cuidados da Avó não abre.
7. Enviar convite com combinação válida; ativar; conferir que antes só aparece em Convites.
8. Registrar evidência (capturas) celular + desktop sem dados reais.

## Resultado esperado deste arquivo

Checklist pronto para o homologador. **Não marcar PASS automático.** Status permanece `PENDING_HUMAN` até aceite expresso do Produto.
