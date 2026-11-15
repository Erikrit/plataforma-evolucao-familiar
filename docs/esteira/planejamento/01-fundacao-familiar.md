# Planejamento — 01 Fundação Familiar

Fonte: `docs/modulos/01-fundacao-familiar/ESPECIFICACAO.md` (v1.0).  
Gerado pela skill `module-planning`. Sem implementação neste passo.

## Situação

| Camada | Estado |
|---|---|
| Funcional (FUN/FAM/ACE) | Especificação preparada |
| ADRs 001–006, 012 | Direção conceitual |
| Auth / contratos REST / código | Preliminar ou não iniciado |

## Riscos

- **Alto:** vazamento de autorização (colaboradora/Laurinha; famílias); revogação de sessão.
- **Médio:** auth ainda “A validar”; UX mobile / esforço mínimo.
- **Baixo:** campos opcionais do perfil.

## Dependências

Nenhum módulo predecessor. Stack ADR-003 preliminar. Sessão **provisória** até decisão de autenticação.

## Incrementos

| ID | Título | Aceite principal | Depende |
|---|---|---|---|
| FF-01 | Bootstrap monólito modular | sobe local + typecheck | — |
| FF-02 | Pessoa + admin provisório | ACE-01, ACE-02, ACE-09 | FF-01 |
| FF-03 | Autorizações + home cartões | ACE-05, ACE-07 | FF-02 |
| FF-04 | Convites / colaboradora→Vovó | ACE-03, ACE-04 | FF-03 |
| FF-05 | Revogação + isolamento | ACE-06, ACE-10 | FF-04 |
| FF-06 | Perfil + QG-3 módulo | ACE-08 + regressão | FF-05 |

## Bloqueios

Nenhum bloqueio duro para iniciar FF-01. Auth definitiva = risco acompanhado, não `BLOCKED`.

## Critérios de aceite (IDs)

Ver lista ACE-01..ACE-10 em `docs/esteira/estado/atual.json` → `planejamento.criteriosAceite`.

## Próxima ação

`implementation-workflow` em **FF-01**.
