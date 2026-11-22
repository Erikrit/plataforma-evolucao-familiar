# Roteiro de homologação humana — DEM-E1-ENTRADA-20261121

**Critério humano:** E1-ENT-08  
**Pré-requisito técnico:** QG-1/QG-2/QG-3 e verifier PASS nesta demanda  
**Ambiente:** aplicação local (`apps/web` + `apps/api`), janela anônima  
**Dispositivos:** celular e desktop

## Preparação

1. Abrir janela anônima (sem sessão anterior).
2. Confirmar API e web locais no ar.
3. Não usar atalho `/f/oliveira` como caminho principal.

## Percurso feliz (raiz)

1. Abrir `/`.
2. Ver boas-vindas com **Criar minha família** e **Acessar minha família**.
3. Não deve haver link fixo para Oliveira ou outra família de teste.
4. Escolher **Criar minha família** → `/f/criar`.
5. Preencher nome da família (diferente de “Oliveira”), seu nome, e-mail novo e senha (≥ 8).
6. Conferir sugestão/prévia do endereço; ajustar se quiser.
7. Concluir cadastro.
8. Confirmação deve mostrar a URL completa do ambiente (`…/f/{slug}/entrar`), sem senha e sem “e-mail enviado/verificado”.
9. **Copiar endereço** (ou copiar manualmente se a área de transferência falhar).
10. **Acessar minha família** → tela de login da família criada.
11. Entrar com e-mail/senha → abrir gestão familiar.
12. Confirmar que o espaço está vazio de dados de outras famílias.

## Percurso feliz (`/f`)

1. Nova janela anônima em `/f`.
2. Repetir o mesmo fluxo de criar → copiar/acessar → login → gestão.
3. Os dois pontos de entrada devem ser equivalentes em utilidade.

## Segunda família e isolamento

1. Criar outra família com nome eventualmente igual ao da primeira, mas endereço diferente.
2. Entrar na segunda e confirmar isolamento.
3. Com sessão da família A, abrir URL da família B: sem dados de A nem de B; orientação de acesso.

## Falhas esperadas

| Tentativa | Esperado |
|---|---|
| Endereço já usado | Recusa; campos corretos preservados; alternativa sugerida quando couber |
| E-mail já usado | Recusa sem tomar conta existente |
| Segmento `criar` (ou reservado) como endereço | Recusa clara |
| Identificador inválido em Acessar | Mensagem útil; opção de voltar às boas-vindas |
| URL `/f/{slug}` inexistente em `/entrar` | Orientação para boas-vindas ou criar |
| API indisponível no cadastro | Não mostrar criação como concluída |
| Duplo clique / retry após sucesso | Sem duplicar família/conta |

## Regressão rápida

1. Login contextual da família criada funciona.
2. Convite/ativação (se exercitado) permanece no contexto da família de origem.
3. Navegação pós-login mantém `/f/{slug}/…`.

## Registro do aceite

- [ ] Desktop — percurso raiz OK  
- [ ] Desktop — percurso `/f` OK  
- [ ] Celular — percurso raiz ou `/f` OK  
- [ ] Isolamento de duas famílias OK  
- [ ] Falhas de rede/colisão sem falso sucesso OK  
- [ ] Sem dependência de e-mail enviado OK  

**Resultado:** APROVADA / REPROVADA  
**Data / responsável:**  
**Observações:**  
