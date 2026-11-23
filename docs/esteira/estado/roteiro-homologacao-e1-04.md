# Roteiro de homologação humana — E1 (contexto familiar)

**Demanda:** DEM-E1-FAMILIAS-20261121 · incremento E1-04  
**Critérios:** E1-ACE-01..08  
**Status:** PENDING_HUMAN até aceite expresso do responsável do Produto.

## Preparação

1. Banco local de desenvolvimento pode ser recriado (`db:reset` + seed ou `provisionar:familia`).
2. Subir API e web locais.
3. Usar duas famílias fictícias com slugs distintos (ex.: seed `oliveira` e uma segunda provisionada).

## Checklist

| ID | Cenário | Esperado | Resultado humano |
|---|---|---|---|
| H-01 | Abrir `/f/{slugA}/entrar` e autenticar conta A | Entra na home da família A; links com `/f/{slugA}` | |
| H-02 | Mesma conta A em `/f/{slugB}/entrar` | Recusa; sem dados de A ou B | |
| H-03 | Com sessão A, colar URL de pessoa/área da família B | Sem conteúdo anterior nem dados de B | |
| H-04 | Navegar pessoas, cuidados, desenvolvimento, histórico e resumo em A | Jornada completa sem voltar ao login global | |
| H-05 | Administrador sem responsabilidade clínica | Gestão ok; conteúdo clínico/desenvolvimento negado ou oculto | |
| H-06 | Ativar convite da família A no contexto B | Recusa sem ativação parcial | |
| H-07 | Revogar acesso de colaboradora | Sessão deixa de ver a área; histórico preservado | |
| H-08 | Prévia/PDF de pessoa autorizada | Conteúdo coerente; sem anexos indevidos | |
| H-09 | Mobile e desktop nas jornadas principais | Layout usável; sem passos extras desnecessários (E1-ACE-08) | |

## Observações

- Homologação humana **não** é automática; evidência técnica (QG-3) não substitui este roteiro.
- Publicação para uso permanece decisão própria, fora deste aceite.
