# Módulo 01 — Fundação Familiar

**Versão:** especificação funcional v1.0  
**Status:** preparada para validação e desenvolvimento, sem implementação.

## 1. Objetivo

Cadastrar pessoas, organizar vínculos e responsabilidades, conceder acessos seguros e oferecer uma página inicial simples e centrada em pessoas.

## 2. Conceitos

- **Família:** espaço organizador; inicialmente apenas uma família.
- **Pessoa:** integrante ou colaborador externo, com ou sem login.
- **Conta:** credencial para acessar a plataforma.
- **Participação/vínculo:** relação com a família; não é permissão.
- **Autorização:** alcance permitido para usuário, pessoa acompanhada e módulo.

## 3. Funcionalidades

### FUN-01 — Adicionar pessoa

Nome é suficiente para cadastro inicial. Data de nascimento, vínculo e foto podem ser adicionados depois conforme necessidade. Não exigir conta.

### FUN-02 — Perfil individual

Exibir dados básicos e entradas para áreas autorizadas; completar dados progressivamente.

### FUN-03 — Convites

Somente administrador inicial convida no MVP. Vincular conta a pessoa existente ou nova pessoa externa; selecionar responsabilidade e pessoa-alvo. Convite com validade e controle de uso.

### FUN-04 — Autorizações

Perfis predefinidos: administrador, responsável por cuidados, responsável por desenvolvimento, colaboradora de cuidados, participante limitado. Responsabilidades acumuláveis e restritas a contextos. Revogação imediata das operações e sessões afetadas; histórico preservado.

### FUN-05 — Página inicial

Cartões de pessoas visíveis conforme autorização, com breve resumo relevante, navegação por pessoa e UX mobile-first. Não incluir lista universal de tarefas.

## 4. Fluxos

1. **Cadastro:** administrador → adicionar pessoa → nome → vínculo opcional → salvar → cartão de pessoa.
2. **Convite colaboradora:** administrador → pessoa externa → contato → responsabilidade de cuidados + Vovó → enviar → ativar → visualizar só contexto autorizado.
3. **Revogação:** administrador → acesso → revogar → novas operações bloqueadas imediatamente; registros anteriores permanecem.
4. **Navegação:** autenticar → cartões permitidos → pessoa → áreas autorizadas.

## 5. Regras

| ID | Regra |
|---|---|
| FAM-R01 | Pessoa pode existir sem login |
| FAM-R02 | Apenas administrador inicial envia convites |
| FAM-R03 | Parentesco não concede autorização automática |
| FAM-R04 | Usuário pode acumular responsabilidades |
| FAM-R05 | Acesso depende de família, pessoa-alvo e operação |
| FAM-R06 | Colaboradora externa só acessa dados autorizados |
| FAM-R07 | Revogação invalida sessões afetadas |
| FAM-R08 | Remover acesso não apaga histórico |
| FAM-R09 | Campos opcionais não impedem cadastro |
| FAM-R10 | Cartões e conteúdos são filtrados por autorização |
| FAM-R11 | Backend valida todas as operações protegidas |
| FAM-R12 | Dados de famílias diferentes permanecem isolados |

## 6. Permissões de referência

- Administrador: pessoas, convites e autorizações; acesso a informações sensíveis sujeito às autorizações e regras de privacidade.
- Mikaela: desenvolvimento da Laurinha, conforme autorização.
- Colaboradora: rotina autorizada da Vovó; não acessar Laurinha, nem modificar prescrição.
- Laurinha: não precisa possuir conta.
- Vovó: acesso próprio opcional, preservando autonomia.

## 7. Casos excepcionais

Convite expirado ou já utilizado; nomes parecidos; conta revogada durante sessão; tentativa de abrir URL sem autorização; alteração de responsabilidade; pessoa sem login. Mostrar mensagens claras e preservar informações, sem ampliar formulários.

## 8. Critérios de aceitação

- [ ] Cadastrar Vovó apenas com nome.
- [ ] Cadastrar Laurinha sem conta.
- [ ] Convidar colaboradora externa com autorização somente para Vovó.
- [ ] Negar acesso à Laurinha, inclusive URL direta, para colaboradora.
- [ ] Acumular responsabilidades em usuário autorizado.
- [ ] Revogar acesso e sessão sem apagar históricos.
- [ ] Mostrar somente cartões permitidos.
- [ ] Funcionar em telas de celular.
- [ ] Não solicitar dados sem necessidade funcional.
- [ ] Impedir vazamento de dados entre famílias.

## 9. Integrações

Fornece identidade, família, pessoa, conta, autorizações e dados resumidos para os módulos de cuidados, desenvolvimento e acompanhamento. Não implementa medicamentos nem desafios.

## 10. Fora do escopo

Árvore genealógica, chat, Kanban, agenda genérica, controle financeiro/trabalhista, configurador complexo de permissões, SaaS comercial.

**Princípio de aceite:** cadastro e acesso devem exigir o mínimo de esforço, preservando segurança e autonomia.
