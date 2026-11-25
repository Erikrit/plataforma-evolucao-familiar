---
name: homologar
description: Separa verificação automática da humana e gera o roteiro de homologação.
argument-hint: "demanda a homologar"
disable-model-invocation: true
---

# Homologar

1. **Reunir critérios** da demanda e da fonte oficial, por ID. Concluído quando cada um está classificado como automático, humano ou fora do alcance local.
2. **Automático.** Chamar `portao-qualidade` no perfil de homologação e copiar os status do JSON. Concluído quando as checagens críticas constam nele.
3. **Humano.** Gerar roteiro com [roteiro.md](roteiro.md); cada item começa em `PENDING_HUMAN`.
4. **Verificar o relatório** com o subagente `verificador`.
5. **Receber retornos.** Registrar quem, quando, aparelho e resultado. Só esse retorno muda o status do item. Reprovação vira demanda pela `triagem`.
6. **Gravar** resumo no estado e, se houve transição material, no registro.

Concluída quando todo critério tem status e evidência ou pendência nomeada, e nenhum item humano foi dado como feito sem retorno humano.

## Saída

```markdown
## Homologação
- demandaId:
- automático: [{ criterio, status, evidencia }]
- humano: [{ criterio, status, retorno }]
- fora do alcance local:
- achados → demandas propostas:
- próxima ação:
```
