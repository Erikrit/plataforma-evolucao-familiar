# Roteiro de homologação humana — EST-03

**Demanda:** `ESTABILIZACAO-PRE-USO-20261122`  
**Incremento:** EST-03 (Histórico, Resumo, PDF, documentos privados, E4 residual)  
**Base técnica:** `develop` (após commit EST-03) · evidência `evidencia-est-03-20261122.json`  
**Dados:** apenas fictícios. Não usar dados familiares reais.

## Objetivo

Confirmar na interface o que os smokes já cobriram: isolamento, paridade prévia/PDF sem anexos embutidos, e que a colaboradora não vê indício de documento privado. Revalidar o percurso residual da Biblioteca (E4) sem expandir catálogo.

## Pré-condições

- Duas famílias de teste (A e B), cada uma com administrador.
- Família A: pessoa-alvo com exame + anexo fictício (~PDF pequeno); responsável de cuidados; colaboradora de cuidados só na pessoa-alvo; segunda pessoa sem autorização da colaboradora.
- Conta de Desenvolvimento autorizada na pessoa-alvo se for revalidar Biblioteca.

## Percurso 1 — Isolamento e documentos

1. Como responsável A: abrir **Histórico** da pessoa-alvo → exame aparece; baixar anexo se a UI oferecer.
2. Como responsável A: abrir **Resumo** → prévia → exportar PDF → conferir menção ao exame **sem** conteúdo do arquivo embutido; aviso de anexos não incluídos.
3. Como admin da família B: tentar Histórico/Resumo/anexo da pessoa A → deve falhar (não encontrado / sem acesso).
4. Como colaboradora A: Histórico da pessoa-alvo mostra o exame **sem** link/indicação de documento; Resumo não destaca documento disponível; exportar PDF negado; download do anexo negado.
5. Como colaboradora A: Histórico da outra pessoa da mesma família → negado.

## Percurso 2 — E4 residual (Biblioteca)

1. Entrar em **Desenvolvimento → Biblioteca → Atividades reais**.
2. Conferir Explorar / sugestões / Renovar (feedback visível) / escolher / participar.
3. Confirmar que participação aparece no Histórico e que estrelas seguem só o fluxo presencial.
4. Não avaliar expansão de catálogo nem jogos digitais além do já homologado na E5 R2.

## Registro

| Item | Resultado (APROVADO / PARCIAL / REPROVADO) | Nota |
|---|---|---|
| Isolamento famílias/pessoas | | |
| Prévia ≈ PDF sem anexos | | |
| Colaboradora sem metadado de anexo | | |
| E4 residual (Biblioteca) | | |

**Não** declarar publicação para uso real neste roteiro. EST-04 e critérios de bloqueio operacionais permanecem.
