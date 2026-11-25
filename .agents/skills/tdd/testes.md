# Testes bons e ruins

Os exemplos usam TypeScript; a sintaxe segue o runner do projeto.

## Costura HTTP (API Nest)

Subir o módulo real e falar por HTTP. Verificar pela interface, não pelo banco.

```typescript
it("item criado aparece na consulta", async () => {
  const criado = await request(app.getHttpServer()).post("/itens").send({ nome: "Item Teste" });
  const lida = await request(app.getHttpServer()).get(`/itens/${criado.body.id}`);
  expect(lida.status).toBe(200);
  expect(lida.body.nome).toBe("Item Teste");
});
```

Ruim: consultar o ORM para conferir o `POST`; espiar chamadas do serviço interno.

Autorização se testa com dois atores: o que pode e o que não pode, incluindo acesso direto pelo identificador.

## Costura de tela (React)

Interagir como a pessoa usuária, por papel e nome acessível.

```tsx
it("informa quando a lista está vazia", async () => {
  render(<Lista itens={[]} />);
  expect(screen.getByText("Nada por aqui ainda")).toBeVisible();
});
```

Ruim: conferir estado interno, classe CSS ou quantidade de renderizações.

## Função pura

```typescript
it("soma os itens", () => {
  expect(total([{ preco: 10 }, { preco: 5 }])).toBe(15);
});
```

Ruim: calcular o esperado com o mesmo `reduce` da implementação.

## Isolamento

- Cada teste cria seus dados fictícios e independe de ordem.
- Banco de teste separado do de desenvolvimento.
- Tempo e aleatoriedade fixados quando influenciam o resultado.
