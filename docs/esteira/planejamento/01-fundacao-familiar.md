# Planejamento — 01 Fundação Familiar

Fonte: `docs/modulos/01-fundacao-familiar/ESPECIFICACAO.md` (v1.0).  
Gerado pela skill `module-planning`. Execução FF-01..FF-06 concluída.

## Situação

| Camada | Estado |
|---|---|
| Funcional (FUN/FAM/ACE) | Especificação v1.0; ACE-01..10 PASS nos smokes locais |
| ADRs 001–006, 012 | Direção conceitual mantida |
| Código do módulo 01 | Implementado localmente (`apps/api`, `apps/web`) |
| Auth / contratos REST | Sessão provisória em uso; mecanismo definitivo ainda “A validar” |

## Riscos

- **Alto:** vazamento de autorização / isolamento — mitigado nos smokes FF-03..05; manter regressão.
- **Médio:** auth definitiva pendente; UX mobile com usuários reais pendente.
- **Baixo:** perfil progressivo.

## Dependências

Nenhum módulo predecessor. Stack ADR-003. Sessão **provisória** até decisão de autenticação.

## Incrementos

| ID | Título | Aceite principal | Status |
|---|---|---|---|
| FF-01 | Bootstrap monólito modular | sobe local + typecheck | COMPLETED |
| FF-02 | Pessoa + admin provisório | ACE-01, ACE-02, ACE-09 | COMPLETED |
| FF-03 | Autorizações + home cartões | ACE-05, ACE-07 | COMPLETED |
| FF-04 | Convites / colaboradora→Vovó | ACE-03, ACE-04 | COMPLETED |
| FF-05 | Revogação + isolamento | ACE-06, ACE-10 | COMPLETED |
| FF-06 | Perfil + QG-3 módulo | ACE-08 + regressão | COMPLETED |

## Bloqueios

Nenhum bloqueio aberto do módulo 01. Auth definitiva permanece risco acompanhado (não `BLOCKED`).

## Critérios de aceite (IDs)

Ver `docs/esteira/estado/atual.json` e `docs/esteira/estado/evidencia-modulo-01.json`.

## Próxima ação

Módulo 01 **COMPLETED**. Próximo produto: módulo 02 — Cuidados da Vovó (`module-planning`).
