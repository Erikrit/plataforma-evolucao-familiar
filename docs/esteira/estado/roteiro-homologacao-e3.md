# Roteiro de homologação humana — DEM-E3-EXAMES-RESUMO

**Demanda:** DEM-E3-EXAMES-RESUMO-20261122  
**Critério humano:** E3-HOM  
**Escopo:** download de exames (sem visualizador interno) + Resumo por área/período + prévia/PDF.  
**Ambiente:** app local (`apps/web` + `apps/api`), celular e desktop.  
**Dados:** apenas fictícios.

## Antes de começar

1. API e web locais no ar.
2. Conta com autorização de Cuidados (responsável) sobre a pessoa de teste.
3. Conta colaboradora (sem anexos/exportação) e, se possível, admin sem capacidade clínica.
4. Um exame com PDF e outro com imagem (ou um de cada); um exame sem anexo.

## Percurso — exames (E3-EX)

| # | Passo | Esperado |
|---|---|---|
| 1 | Abrir Consultas e exames da pessoa | Lista com exames; detalhe mostra pessoa, descrição e data conhecida |
| 2 | Abrir exame **com** documento (autorizado) | Botão **Baixar arquivo**; texto de que o dispositivo pode abrir o arquivo; sem tela de leitura interna |
| 3 | Baixar no celular e no desktop | Arquivo com nome/formato corretos; detalhe do exame permanece; abertura pelo app do dispositivo (não prometida como automática) |
| 4 | Exame **sem** anexo | Texto neutro; sem botão vazio |
| 5 | Conta sem permissão de anexo | Sem botão de baixar; sem sucesso fictício |
| 6 | Falha de rede / sessão encerrada | Mensagem útil e **Tentar novamente** quando couber; sem “baixado” antes do arquivo |

## Percurso — Resumo (E3-RES)

| # | Passo | Esperado |
|---|---|---|
| 1 | Abrir **Resumo** da pessoa | Uma única entrada; período no topo (7/30/personalizado) |
| 2 | Ver blocos | Só Cuidados e/ou Desenvolvimento autorizados; vazio no período com mensagem neutra |
| 3 | Conferir Cuidados | Doses previstas / tomadas / não tomadas / sem confirmação; consultas, exames (data ou registro; documento disponível no app, sem interpretação) |
| 4 | Conferir Desenvolvimento | Experiências, categorias, estrelas e observações existentes; sem ranking |
| 5 | Usar links de origem | Ir a Cuidados / Consultas e exames / Desenvolvimento e voltar sem redigitar o período |
| 6 | Trocar período ou pessoa | Conteúdo anterior some; sem vazamento entre pessoas/famílias |
| 7 | Preparar PDF → conferir → Baixar | Prévia alinhada à tela; anexos **não** embutidos; colaboradora sem exportação |

## Critérios a marcar

- [ ] E3-EX-01..05 (humano + técnico)
- [ ] E3-RES-01..05
- [ ] E3-HOM — baixar exame no celular e compreender o período sem redigitar informação

## Fora do aceite

Visualizador embutido, zoom/paginação próprios, OCR/IA, interpretação clínica, URL pública permanente, commit/push/deploy nesta homologação.
