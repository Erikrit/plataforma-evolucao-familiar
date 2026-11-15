# Estado das decisões e escopo

**Revisão reconciliada:** 2026-11-15. **Referência de implementação:** `develop`. **Fonte funcional:** especificações aprovadas neste PR. Evidências de testes são registros locais não reexecutados nesta reconciliação.

| Elemento | Situação |
|---|---|
| Visão e princípios | Aprovados |
| Módulo 01 — Fundação Familiar | Especificação v1.1 aprovada; FF-01..FF-06 implementados localmente com QG-3 PASS registrado; privacidade/UX v1.1, autenticação definitiva e homologação pendentes |
| Módulo 02 — Cuidados da Vovó | Especificação v1.3 aprovada; CV-01..CV-06 + cadastro/alteração de programação v1.3 implementados localmente (QG-3 módulo base PASS); notificações reais (ACE-C12) e homologação pendentes |
| Módulo 03 — Desenvolvimento da Laurinha | Especificação funcional v1.1 aprovada; não implementado |
| Módulo 04 — Evolução Familiar | Especificação funcional v1.1 aprovada; histórico e resumo parciais já existem no módulo 02, sem módulo 04 completo |
| Autenticação | Sessão MVP com cookie httpOnly (hash SHA-256); IdP definitivo ainda pendente em DECISOES.md — inadequado para dados reais sensíveis sem revisão |
| Autorizações | Código contextual presente e correções SA-01..SA-04 registradas; IdP definitivo e homologação ainda pendentes |
| Interface móvel | Estrutura mobile-first presente; sem homologação com usuários reais |
| Testes | Evidências locais dos módulos 01 e 02 em `docs/esteira/estado/`; não reexecutadas nesta integração |
| Deploy | Nenhum deployment homologado |

## Evidências e limites

- Código em `apps/api/`, `apps/web/`; scripts smoke por incremento e resultados em `docs/esteira/estado/`.
- `docs/esteira/estado/evidencia-modulo-01.json` e `evidencia-modulo-02.json` registram QG-3 PASS; não equivalem a validação independente ou em dispositivo real.
- Repositório público: não incluir dados reais de crianças, receitas, exames, credenciais ou segredos.
- Sem nova execução de testes, alteração de código, configuração de esteira ou deploy como parte deste PR documental.

## Decisões funcionais aprovadas em 2026-11-15

- Experiência móvel centrada em pessoas, poucos toques, conectividade instável tratada com mensagens honestas e notificações discretas.
- Perfis de acesso prontos e ajustáveis; parentesco e papel de administrador **não** liberam dados médicos/infantis indiscriminadamente.
- Cuidados v1.3: primeiro horário, quantidade de doses, duração, sugestões matemáticas somente quando clinicamente compatíveis e conferência explícita antes dos lembretes. Não deduzir intervalo terapêutico.
- Lembretes aos autorizados, sem cobrança; ACE-C12 só após validação em dispositivos reais.
- Desenvolvimento v1.1: guardar brincadeiras sem prazo; registrar somente Concluiu/Participou, sem cobrança por não realização. Estrelas: simples 5/3, média 10/5, desafiadora 15/8.
- Evolução v1.1: histórico individual e resumo da pessoa com PDF sob demanda; poucos destaques na home.

## Priorização de acompanhamento

1. Homologar UX 01/02 (QG-3 visual) e validar ACE-C12 em dispositivos reais.
2. Selecionar autenticação definitiva (IdP) antes de usar dados reais sensíveis.
3. Planejar o módulo 03 com base na especificação v1.1.
4. Completar módulo 04 (histórico/resumo) sobre a base já existente no 02.

## Separação de responsabilidades

**Produto:** `docs/produto/`, `docs/modulos/`, `docs/arquitetura/`. **Esteira:** `docs/esteira/`, `.cursor/`, `AGENTS.md`, `scripts/esteira/`. A documentação aprovada não prova implementação e a esteira não modifica requisitos automaticamente.
