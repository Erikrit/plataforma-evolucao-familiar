# Formatos

## Termo

Seguir a forma do glossário existente. Sem precedente:

```markdown
**Termo** (`PROPOSTA`): o que é, em uma linha. Fonte: <documento §seção>.
_Evitar_: sinônimo, sinônimo
```

- Definir o que é, com outros termos do glossário em negrito.
- Só conceitos próprios do domínio; conceito geral de programação fica fora.
- O glossário não contém detalhe de implementação, spec nem rascunho.

## ADR

```markdown
## ADR-NNN — <título da decisão>

**Status:** PROPOSTA

<1 a 3 frases: contexto, decisão e porquê.>
```

Acrescentar alternativas e consequências só quando ajudam o leitor futuro. Numerar a partir da última existente.

Cabem em ADR: forma da arquitetura, integração entre contextos, tecnologia custosa de trocar, fronteiras explícitas, desvio deliberado do óbvio, restrição invisível no código e alternativa rejeitada que alguém voltaria a propor.
