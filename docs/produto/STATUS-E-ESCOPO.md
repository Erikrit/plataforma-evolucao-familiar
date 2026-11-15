# Estado das decisões e escopo

Atualizado em 2026-11-15.

| Elemento | Estado |
|---|---|
| Princípios e visão | Aprovados |
| Módulos do MVP | Aprovados conceitualmente |
| Fundação Familiar | Especificação v1.0; implementação local FF-01..FF-06 concluída e QG-3 PASS; auth definitiva ainda pendente |
| Cuidados da Vovó | Implementado localmente (CV-01..CV-06, QG-3 PASS); ACE-C12 lembretes em dispositivos reais ainda PENDING |
| Desenvolvimento da Laurinha | Visão aprovada; especificação funcional completa pendente |
| Evolução Familiar | Visão aprovada; especificação funcional completa pendente |
| Arquitetura e contratos REST | Propostas preliminares; detalhadas parcialmente na Fundação |
| Notificações de medicamentos | Estratégia e teste em dispositivos reais pendentes |
| Interface com usuários reais | Validação pendente |
| Infraestrutura/código | Monólito local ativo (`apps/api`, `apps/web`, Compose); smokes do módulo 01; sem deploy |

## Ordem funcional sugerida

1. Fundação Familiar
2. Cuidados da Vovó
3. Desenvolvimento da Laurinha
4. Evolução Familiar

Histórico básico e segurança não devem ser postergados para o quarto módulo.

## Distinção entre conversas e artefatos

**Produto (fontes oficiais):** `docs/produto/`, `docs/arquitetura/`, `docs/modulos/` — especificação e evolução funcional.  
**Esteira (separação lógica, mesmo repositório — ADR-012):** `AGENTS.md`, `.cursor/`, `docs/esteira/`, `scripts/esteira/` — orquestração, skills, hooks e estados de execução.

Não misturar regras funcionais do produto com procedimentos da esteira. A esteira não altera requisitos aprovados automaticamente.

Histórico: a orientação inicial (ADR-011) separava a automação deste repositório; a decisão vigente permite a esteira aqui com isolamento documental.
