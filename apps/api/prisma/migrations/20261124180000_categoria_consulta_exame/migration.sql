-- UX-01: categoria opcional em registros legados; obrigatória na criação via API.
ALTER TABLE "consulta" ADD COLUMN "categoria" TEXT;
ALTER TABLE "exame" ADD COLUMN "categoria" TEXT;
