-- DEV-CAT-M1, ticket 03 (ADR-017 item 1): trilha editorial da fase, sem mudar a chave do progresso.
ALTER TABLE "fase_jogo_digital" ADD COLUMN "trilha" TEXT;

UPDATE "fase_jogo_digital"
SET "trilha" = CASE
  WHEN "numero" <= 5 THEN 'pequenos'
  WHEN "numero" <= 10 THEN 'medios'
  ELSE 'grandes'
END;

ALTER TABLE "fase_jogo_digital" ALTER COLUMN "trilha" SET NOT NULL;

ALTER TABLE "fase_jogo_digital"
  ADD CONSTRAINT "fase_jogo_digital_trilha_check"
  CHECK ("numero" BETWEEN 1 AND 15 AND "trilha" = CASE
    WHEN "numero" <= 5 THEN 'pequenos'
    WHEN "numero" <= 10 THEN 'medios'
    ELSE 'grandes'
  END);
