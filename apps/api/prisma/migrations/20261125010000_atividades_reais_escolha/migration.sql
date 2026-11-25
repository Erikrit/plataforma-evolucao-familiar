-- Atividades Reais (DEV-JOG-P02/P03): candidatas sob demanda, exposição e retirada.
ALTER TABLE "sugestao_desafio_pessoa" ADD COLUMN "candidata" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "sugestao_desafio_pessoa" ADD COLUMN "exposta" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "sugestao_desafio_pessoa" ADD COLUMN "retirada_sem_participacao" BOOLEAN NOT NULL DEFAULT false;

-- Tratamento legado: sugestões antigas não escolhidas não ficam candidatas ativas;
-- contam como já expostas para priorizar inéditas nas próximas ofertas.
UPDATE "sugestao_desafio_pessoa"
SET "exposta" = true,
    "candidata" = false
WHERE "escolhida" = false;

UPDATE "sugestao_desafio_pessoa"
SET "exposta" = true,
    "candidata" = false
WHERE "escolhida" = true;

CREATE INDEX "sugestao_desafio_pessoa_pessoa_id_candidata_idx" ON "sugestao_desafio_pessoa"("pessoa_id", "candidata");
