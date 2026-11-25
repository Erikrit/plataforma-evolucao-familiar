# Quando substituir

Substituir somente na borda do sistema: serviço externo, relógio, aleatoriedade e, às vezes, sistema de arquivos. Para banco, preferir um banco de teste real: constraints e transações fazem parte do comportamento.

Módulos próprios e colaboradores internos participam do teste de verdade.

## Desenhar para substituir

1. **Receber a dependência**, em vez de criá-la dentro:

```typescript
class ServicoCobranca {
  constructor(private readonly pagamentos: Pagamentos) {}
}
```

No Nest, `overrideProvider` troca só o adaptador externo.

2. **Operações específicas** no lugar de um `buscar(url, opcoes)` genérico: cada substituto devolve uma forma, sem condicional no preparo do teste.

```typescript
interface Pagamentos {
  cobrar(valor: number): Promise<Recibo>;
  estornar(id: string): Promise<void>;
}
```

Se o teste pede muitos substitutos, o módulo provavelmente é raso: ver `desenho-modulos`.
