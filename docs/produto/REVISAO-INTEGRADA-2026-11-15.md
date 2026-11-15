# Revisão integrada do produto e do estado do repositório — 2026-11-15

**Base de referência:** `feature/modulo1` @ `2c015c530736e9a1f3b51756f144487246e8c043`.  
**Escopo desta revisão:** somente documentos do produto e arquitetura funcional. Nenhum código, configuração da esteira, merge ou deploy foi alterado.

## O que foi realmente observado

| Área | Estado comprovado pela inspeção |
|---|---|
| Bootstrap | Next.js, NestJS, Prisma, Docker Compose, PostgreSQL e estrutura básica presentes |
| API | Login/sessão provisória e listagem/criação de pessoa por família |
| Interface | Formulário de login, formulário de cadastro com nome e listagem de pessoas |
| Banco | Familia, Pessoa, Usuario, SessaoProvisoria |
| Prova de testes | Arquivo de evidência FF-02 afirma typecheck/lint/build/smoke PASS; **não reexecutado nesta revisão** |
| Permissões contextuais | Não há modelo/guard específico por pessoa e módulo nas fontes lidas |
| Módulos 02/03/04 | Ainda não há implementação funcional observada |

## Inconsistências encontradas e tratadas

1. Documentos de status e README afirmavam que não havia código. **Corrigido** para implementação parcial com evidência do FF-01/FF-02.
2. Módulos 03/04 continham resumos obsoletos e marcados como especificação pendente. **Substituídos** por especificações v1.1 completas, **aprovadas funcionalmente em 2026-11-15**.
3. Documento Mestre ainda falava em planejamento semanal e opção "não realizou" para Laurinha. **Atualizado** para "guardar para depois" e somente "Concluiu"/"Participou".
4. Arquitetura conceitual ainda previa `desafio_planejado` com calendário e painéis separados. **Alinhada** à simplificação proposta.
5. A ausência de autorização contextual na implementação não estava clara para consumidores da documentação. **Registrado** como pendência crítica.

## Pendências críticas e recomendações sem alterar código

- **Segurança antes de dados reais:** `painel-fundacao.tsx` guarda token no `localStorage` e pré-preenche `admin@pef.local`/`admin-local`; `ServicoSessao` usa `SessaoProvisoria` e token retornado ao cliente. Isolar como protótipo, não publicar em ambiente real; selecionar autenticação segura e sessão adequadas.
- **Autorização por pessoa:** `ServicoPessoas.garantirFamiliaDoUsuario` valida somente a família da sessão. O modelo de dados ainda não contém autorizações por pessoa/contexto. Antes de compartilhar dados privados, impedir acesso de colaboradora aos dados da Laurinha, inclusive através de endpoints diretos, listagens e agregados.
- **Logout:** a tela remove sessão do `localStorage` sem chamar `DELETE /sessoes`; a sessão do servidor pode permanecer válida até expirar. Ajustar antes de produção.
- **Cadastro repetido:** a evidência FF-02 lista múltiplas Vovós e Laurinhas após execuções de smoke; não bloquear nomes iguais automaticamente, mas tratar testes/seed e evitar duplicidades acidentais ao cadastrar.
- **Branch pública:** repositório está público. Não incluir receitas, exames, dados reais de crianças, segredos ou arquivos de configuração contendo credenciais em qualquer branch.

Não se trata de falha de aceite completo do módulo 01: ele ainda está em implementação. **Não declarar Fundação Familiar pronta** com base apenas no FF-02.

## Decisões funcionais aprovadas em 2026-11-15

- Módulo 03 v1.1: nome mínimo; dificuldade simples predefinida; guardar para depois; resultado somente Concluiu/Participou; sem cadastro de não realização.
- Estrelas v1.1 **confirmadas**: simples 5/3, média 10/5, desafiadora 15/8 (Concluiu/Participou). Valores históricos preservados.
- Módulo 04 v1.1: histórico individual + resumo contextual; poucos destaques na home; PDF como ação do resumo.

## Preservação dos princípios

- **Evolução familiar:** conteúdos específicos das pessoas; nenhuma avaliação clínica de estrelas.
- **Esforço mínimo:** os módulos não exigem relatórios, justificativas de não realização, observações ou categorias obrigatórias.
- **Organização sem cobrança:** guardados não vencem, registros ausentes não são interpretados como fracasso, resumos não criam ranking.
- **Privacidade:** apresentação, filtros, indicadores e PDFs devem respeitar a mesma autorização da fonte original.

## Regra de mudança

As propostas funcionais v1.1 foram **aprovadas pelo responsável do produto**. A aprovação de produto **não equivale a implementação concluída** nem integra automaticamente a branch de trabalho `feature/modulo1`: a incorporação documental segue revisão/merge separado.
