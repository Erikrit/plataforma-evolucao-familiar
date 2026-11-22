# E4 — Biblioteca real curada e sugestões renováveis

**Demanda:** DEM-E4-BIBLIOTECA-20261122  
**Tipo:** transversal · **Risco:** alto (isolamento, crianças, participação/estrelas).  
**Aprovação:** Produto em 2026-11-22, Módulo 03 v1.3 §12.  
**Estado:** READY para primeiro incremento; código/gates/homologação E4 pendentes.  
**Base:** develop @ 4ae828da06b5dfa78abbedda56e5c5965aea33ac.

## Evidência e dependências

Schema atual já oferece Desafio global (origem catalogo, familiaId nulo) e personalizado por família. ServicoDesafios.listarParaPessoa combina esses conjuntos e usa disponibilidade por pessoa e participação recente. Reutilizar essa estrutura antes de propor novo catálogo. Disponibilidade e movimentos seguem ADR-013; responsabilidades seguem ADR-014; histórico é derivado (ADR-009).

Inspeção estática, sem teste dinâmico nesta rodada. A E3 permanece com anexos não homologados e DEF-E3-ANEXO-SALVAR-20261122 aberto; Produto autorizou adiar a correção e avançar nesta frente independente. Não herdar nem declarar aprovação da E3.

## Incrementos verticais

| ID | Requisitos | Resultado e arquivos previstos |
|---|---|---|
| E4-01 | E4-ACE-01/02/06 | Metadados/faixa/origem e versão, conteúdo inicial curado e seleção elegível até 6; schema/seed, servico-desafios.ts, constantes e API da biblioteca; apresentação mínima das sugestões |
| E4-02 | E4-ACE-03/04/05 | Escolher/manter e renovar até 3 com persistência por pessoa, limites no servidor e proteção contra retry/concorrência; serviço/controlador, API e interface Desenvolvimento |
| E4-03 | E4-ACE-05..07 e E4-HOM | Organização móvel, filtros, falta de alternativas, regressões Explorar/Executadas, estrelas/histórico/PDF e isolamento; testes/roteiro/evidências |

Cada incremento usa QG-1 → verifier → QG-2. Fechar conjunto com QG-3 e homologação humana. A revisão do desenho da tela é parte do primeiro incremento antes de alterar componentes: aproveitar a Biblioteca existente e apresentar Sugestões, renovar, escolher/manter e Ver biblioteca sem criar menus concorrentes.

## Solução mínima a conferir

- Não criar uma segunda tabela de modelos globais se Desafio puder receber metadados/versionamento com segurança. A arquitetura define referência/snapshot de versão que preserve histórico.
- Manter até 24 modelos publicados ativos. Conteúdo inicial revisado, preferencialmente autoral, com origem e instrução apropriadas; não copiar materiais de terceiros sem direito.
- A seleção privada deve referenciar pessoa/família e itens do catálogo elegíveis; manter persistência compartilhada entre responsáveis autorizados da mesma pessoa. Não usar DesafioGuardado como substituto da disponibilidade operacional.
- Resolver como marcar escolha explícita sem confundir com favorito legado, execução ou reativação. Reutilizar mecanismo atual somente se sua semântica for compatível; registrar decisão técnica.
- Limites 24/6/3 no servidor, não apenas na UI. Para escassez, retornar menos; para ausência de novas opções, preservar seleção.
- Renovar escolhe entre modelos já aprovados; não precisa internet, IA, cron, serviço externo ou fila.
- Cadastro personalizado continua mínimo. Faixa pode ser filtro opcional; data de nascimento ausente não impede biblioteca.
- As famílias veem modelos globais e dados privados próprios. Nunca usar atividade personalizada/histórico de outra família como sugestão.
- Preservar estados e vigências do conteúdo executado, regras de pontos, idempotência e catálogo fechado de operações.
- Não exigir migração de preservação dos dados atuais de teste, conforme Documento Mestre §13; invariantes funcionais de histórico permanecem.

## Validação e retomada

Testar teto ativo, conteúdo arquivado, ausência de idade/categoria, escolha preservada ao renovar, menos de 3 alternativas, nenhum candidato, retry/concorrência e tentativa cruzada entre pessoas/famílias. Execução e reativação não podem ser produzidas por renovar; testar saldo/histórico após cada fluxo.

E4-HOM exige responsável escolher e compreender opções no celular, renovar sem perder escolha e registrar participação pelo fluxo existente. Nenhum número de registro é medida clínica.

Antes de editar: comparar checkout/branch, alterações locais/não rastreados e calcular fingerprint real. Próxima ação: implementation-workflow E4-01, com levantamento de contrato e desenho local. Nenhum bloqueio funcional identificado; anexos E3 são pendência adiada fora deste escopo.
