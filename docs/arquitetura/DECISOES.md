# Registro de decisões arquiteturais

Decisões abaixo são direções preliminares aprovadas conceitualmente, não prova de implementação.

| ID | Decisão | Justificativa |
|---|---|---|
| ADR-001 | Monólito modular | Menor operação e acoplamento distribuído |
| ADR-002 | Um PostgreSQL | Modelo relacional e histórico consistente |
| ADR-003 | Next.js + NestJS + Prisma, preliminares | Aderência à experiência tecnológica existente |
| ADR-004 | Arquivos privados compatíveis com S3 | Proteger exames/receitas e não depender de arquivos locais |
| ADR-005 | Pessoas separadas de contas | Pessoas acompanhadas não precisam de login |
| ADR-006 | Autorizações por pessoa/contexto | Restringir colaboradora a dados da Vovó |
| ADR-007 | Prescrição como anexo + horários estruturados | Mínimo preenchimento e lembretes úteis |
| ADR-008 | Estrelas automáticas por participação | Reduzir passos e retirar aprovação manual |
| ADR-009 | Histórico derivado dos registros de origem | Evitar duplicação e recadastro |
| ADR-010 | PDF sob demanda | Evitar duplicação de dados sensíveis |
| ADR-011 | Sem push/esteira de agentes neste repositório inicial | Separação entre concepção de produto e automação |

## A validar

- Mecanismo de autenticação e invalidação de sessões.
- Frequências especiais de medicamentos e regras de programação.
- Confiabilidade e canais dos lembretes em dispositivos reais.
- Contratos exatos da API, restrições e política de dados.
- Necessidade de PWA ou alternativa móvel adicional.
