-- DEV-CAT-M1-CONTEUDO, ticket 01: ficha padrão das Atividades Reais (M03 §15, régua "Atividade real").
-- Campos estruturados preenchidos pela carga oficial a partir do catálogo versionado.
ALTER TABLE "desafio"
  ADD COLUMN "passos" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "variacao_facil" TEXT,
  ADD COLUMN "variacao_dificil" TEXT,
  ADD COLUMN "adaptacao_sentado" TEXT,
  ADD COLUMN "seguranca" JSONB,
  ADD COLUMN "lugar" TEXT,
  ADD COLUMN "pessoas_min" INTEGER,
  ADD COLUMN "pessoas_max" INTEGER;

ALTER TABLE "desafio"
  ADD CONSTRAINT "desafio_lugar_check" CHECK ("lugar" IS NULL OR "lugar" IN ('dentro_de_casa', 'area_externa', 'ambos')),
  ADD CONSTRAINT "desafio_pessoas_check" CHECK (
    ("pessoas_min" IS NULL OR "pessoas_min" >= 1)
    AND ("pessoas_min" IS NULL OR "pessoas_max" IS NULL OR "pessoas_min" <= "pessoas_max")
  ),
  ADD CONSTRAINT "desafio_passos_check" CHECK (cardinality("passos") <= 3);

-- `adaptacoes` e `supervisao` eram texto livre só do catálogo (personalizadas não os gravam).
-- Passam a ser as variações, a adaptação para brincar sentado e a segurança por faixa;
-- o texto anterior continua no histórico do Git do catálogo versionado.
ALTER TABLE "desafio" DROP COLUMN "adaptacoes", DROP COLUMN "supervisao";
