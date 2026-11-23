-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "familia" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "criada_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "familia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pessoa" (
    "id" TEXT NOT NULL,
    "familia_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "data_nascimento" TIMESTAMP(3),
    "vinculo" TEXT,
    "criada_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pessoa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progresso_fase_jogo" (
    "familia_id" TEXT NOT NULL,
    "pessoa_id" TEXT NOT NULL,
    "jogo_id" TEXT NOT NULL,
    "fase" INTEGER NOT NULL,
    "primeira_exploracao_em" TIMESTAMP(3) NOT NULL,
    "versao_primeira_exploracao" INTEGER NOT NULL,
    "ultima_abertura_em" TIMESTAMP(3) NOT NULL,
    "versao_ultima_abertura" INTEGER NOT NULL,
    "concluida_em" TIMESTAMP(3),
    "versao_conclusao" INTEGER,
    "chave_conclusao" TEXT,
    "nome_na_conclusao" TEXT,
    "categoria_na_conclusao" TEXT,

    CONSTRAINT "progresso_fase_jogo_pkey" PRIMARY KEY ("familia_id","pessoa_id","jogo_id","fase")
);

-- CreateTable
CREATE TABLE "jogo_digital" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "instrucoes" TEXT NOT NULL,
    "tipo_mecanica" TEXT NOT NULL,
    "versao" INTEGER NOT NULL DEFAULT 1,
    "faixa_etaria_min" INTEGER,
    "faixa_etaria_max" INTEGER,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "publicado_em" TIMESTAMP(3),
    "ordem_editorial" INTEGER NOT NULL DEFAULT 0,
    "capa_ref" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jogo_digital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fase_jogo_digital" (
    "jogo_id" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "objetivo" TEXT NOT NULL,
    "dificuldade" TEXT NOT NULL,
    "configuracao" JSONB NOT NULL,
    "versao" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "fase_jogo_digital_pkey" PRIMARY KEY ("jogo_id","numero")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id" TEXT NOT NULL,
    "pessoa_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessao_provisoria" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "expira_em" TIMESTAMP(3) NOT NULL,
    "criada_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessao_provisoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "autorizacao" (
    "id" TEXT NOT NULL,
    "familia_id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "pessoa_alvo_id" TEXT,
    "responsabilidade" TEXT NOT NULL,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "concedida_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revogada_em" TIMESTAMP(3),

    CONSTRAINT "autorizacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "convite" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "familia_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nome_convidado" TEXT,
    "responsabilidade" TEXT,
    "pessoa_alvo_id" TEXT,
    "pessoa_conta_id" TEXT,
    "criado_por_id" TEXT NOT NULL,
    "expira_em" TIMESTAMP(3) NOT NULL,
    "usado_em" TIMESTAMP(3),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "convite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anexo" (
    "id" TEXT NOT NULL,
    "familia_id" TEXT NOT NULL,
    "pessoa_id" TEXT,
    "chave_privada" TEXT NOT NULL,
    "nome_arquivo" TEXT NOT NULL,
    "mime_tipo" TEXT NOT NULL,
    "tamanho_bytes" INTEGER NOT NULL,
    "conteudo_base64" TEXT,
    "criado_por_id" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revogado_em" TIMESTAMP(3),

    CONSTRAINT "anexo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medicamento" (
    "id" TEXT NOT NULL,
    "pessoa_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "instrucoes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'rascunho',
    "criado_por_id" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ativado_em" TIMESTAMP(3),
    "suspenso_em" TIMESTAMP(3),
    "encerrado_em" TIMESTAMP(3),

    CONSTRAINT "medicamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medicamento_anexo" (
    "medicamento_id" TEXT NOT NULL,
    "anexo_id" TEXT NOT NULL,

    CONSTRAINT "medicamento_anexo_pkey" PRIMARY KEY ("medicamento_id","anexo_id")
);

-- CreateTable
CREATE TABLE "programacao_medicamento" (
    "id" TEXT NOT NULL,
    "medicamento_id" TEXT NOT NULL,
    "horarios" JSONB NOT NULL,
    "frequencia" TEXT NOT NULL DEFAULT 'diaria',
    "primeiro_horario" TEXT,
    "doses_por_dia" INTEGER,
    "duracao_tipo" TEXT NOT NULL DEFAULT 'continua',
    "duracao_dias" INTEGER,
    "horarios_conferidos" BOOLEAN NOT NULL DEFAULT false,
    "intervalo_horas" INTEGER,
    "vigencia_inicio" TIMESTAMP(3) NOT NULL,
    "vigencia_fim" TIMESTAMP(3),
    "criado_por_id" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "programacao_medicamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registro_dose" (
    "id" TEXT NOT NULL,
    "medicamento_id" TEXT NOT NULL,
    "ocorrencia_chave" TEXT NOT NULL,
    "situacao" TEXT NOT NULL,
    "horario_efetivo" TIMESTAMP(3),
    "registrado_por_id" TEXT NOT NULL,
    "registrado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "versao_ativa" BOOLEAN NOT NULL DEFAULT true,
    "substitui_id" TEXT,

    CONSTRAINT "registro_dose_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consulta" (
    "id" TEXT NOT NULL,
    "pessoa_id" TEXT NOT NULL,
    "data_hora" TIMESTAMP(3) NOT NULL,
    "especialidade_ou_descricao" TEXT NOT NULL,
    "profissional" TEXT,
    "local" TEXT,
    "observacao" TEXT,
    "status" TEXT NOT NULL DEFAULT 'agendada',
    "criado_por_id" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consulta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exame" (
    "id" TEXT NOT NULL,
    "pessoa_id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "data" TIMESTAMP(3),
    "consulta_id" TEXT,
    "anexo_id" TEXT,
    "criado_por_id" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registro_atividade" (
    "id" TEXT NOT NULL,
    "pessoa_id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "concluida_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observacao" TEXT,
    "registrado_por_id" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registro_atividade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "desafio" (
    "id" TEXT NOT NULL,
    "familia_id" TEXT,
    "nome" TEXT NOT NULL,
    "instrucao" TEXT,
    "categoria" TEXT,
    "dificuldade" TEXT NOT NULL DEFAULT 'simples',
    "materiais" TEXT,
    "duracao_minutos" INTEGER,
    "faixa_etaria_min" INTEGER,
    "faixa_etaria_max" INTEGER,
    "origem_conteudo" TEXT,
    "versao_conteudo" INTEGER NOT NULL DEFAULT 1,
    "adaptacoes" TEXT,
    "supervisao" TEXT,
    "origem" TEXT NOT NULL DEFAULT 'catalogo',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_por_id" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "desafio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sugestao_desafio_pessoa" (
    "id" TEXT NOT NULL,
    "pessoa_id" TEXT NOT NULL,
    "desafio_id" TEXT NOT NULL,
    "escolhida" BOOLEAN NOT NULL DEFAULT false,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_por_id" TEXT,

    CONSTRAINT "sugestao_desafio_pessoa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "desafio_guardado" (
    "id" TEXT NOT NULL,
    "pessoa_id" TEXT NOT NULL,
    "desafio_id" TEXT NOT NULL,
    "guardado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "desafio_guardado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disponibilidade_desafio" (
    "id" TEXT NOT NULL,
    "pessoa_id" TEXT NOT NULL,
    "desafio_id" TEXT NOT NULL,
    "disponivel_para_nova_participacao" BOOLEAN NOT NULL,
    "atualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_por_id" TEXT,

    CONSTRAINT "disponibilidade_desafio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participacao_desafio" (
    "id" TEXT NOT NULL,
    "pessoa_id" TEXT NOT NULL,
    "desafio_id" TEXT NOT NULL,
    "resultado" TEXT NOT NULL,
    "observacao" TEXT,
    "execucao_chave" TEXT NOT NULL,
    "dificuldade_aplicada" TEXT NOT NULL,
    "estrelas_concedidas" INTEGER NOT NULL,
    "versao_conteudo_aplicada" INTEGER,
    "nome_aplicado" TEXT,
    "instrucao_aplicada" TEXT,
    "categoria_aplicada" TEXT,
    "registrado_por_id" TEXT NOT NULL,
    "registrado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "versao_ativa" BOOLEAN NOT NULL DEFAULT true,
    "substitui_id" TEXT,

    CONSTRAINT "participacao_desafio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movimento_estrelas" (
    "id" TEXT NOT NULL,
    "pessoa_id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "saldo_apos" INTEGER NOT NULL,
    "participacao_id" TEXT,
    "resgate_id" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movimento_estrelas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recompensa" (
    "id" TEXT NOT NULL,
    "pessoa_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "custo" INTEGER NOT NULL,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "disponivel_para_resgate" BOOLEAN NOT NULL DEFAULT true,
    "geracao_disponibilidade" INTEGER NOT NULL DEFAULT 0,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recompensa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resgate_recompensa" (
    "id" TEXT NOT NULL,
    "recompensa_id" TEXT NOT NULL,
    "pessoa_id" TEXT NOT NULL,
    "custo_aplicado" INTEGER NOT NULL,
    "geracao_disponibilidade" INTEGER NOT NULL DEFAULT 0,
    "solicitacao_chave" TEXT,
    "resgatado_por_id" TEXT NOT NULL,
    "resgatado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resgate_recompensa_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "familia_slug_key" ON "familia"("slug");

-- CreateIndex
CREATE INDEX "pessoa_familia_id_idx" ON "pessoa"("familia_id");

-- CreateIndex
CREATE INDEX "progresso_fase_jogo_familia_id_pessoa_id_concluida_em_idx" ON "progresso_fase_jogo"("familia_id", "pessoa_id", "concluida_em");

-- CreateIndex
CREATE INDEX "jogo_digital_ativo_categoria_idx" ON "jogo_digital"("ativo", "categoria");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_pessoa_id_key" ON "usuario"("pessoa_id");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sessao_provisoria_token_key" ON "sessao_provisoria"("token");

-- CreateIndex
CREATE INDEX "sessao_provisoria_usuario_id_idx" ON "sessao_provisoria"("usuario_id");

-- CreateIndex
CREATE INDEX "autorizacao_familia_id_usuario_id_idx" ON "autorizacao"("familia_id", "usuario_id");

-- CreateIndex
CREATE INDEX "autorizacao_usuario_id_ativa_idx" ON "autorizacao"("usuario_id", "ativa");

-- CreateIndex
CREATE UNIQUE INDEX "convite_token_key" ON "convite"("token");

-- CreateIndex
CREATE INDEX "convite_familia_id_idx" ON "convite"("familia_id");

-- CreateIndex
CREATE UNIQUE INDEX "anexo_chave_privada_key" ON "anexo"("chave_privada");

-- CreateIndex
CREATE INDEX "anexo_familia_id_idx" ON "anexo"("familia_id");

-- CreateIndex
CREATE INDEX "medicamento_pessoa_id_status_idx" ON "medicamento"("pessoa_id", "status");

-- CreateIndex
CREATE INDEX "programacao_medicamento_medicamento_id_vigencia_inicio_idx" ON "programacao_medicamento"("medicamento_id", "vigencia_inicio");

-- CreateIndex
CREATE INDEX "registro_dose_medicamento_id_ocorrencia_chave_idx" ON "registro_dose"("medicamento_id", "ocorrencia_chave");

-- CreateIndex
CREATE INDEX "registro_dose_ocorrencia_chave_versao_ativa_idx" ON "registro_dose"("ocorrencia_chave", "versao_ativa");

-- CreateIndex
CREATE INDEX "consulta_pessoa_id_data_hora_idx" ON "consulta"("pessoa_id", "data_hora");

-- CreateIndex
CREATE INDEX "exame_pessoa_id_idx" ON "exame"("pessoa_id");

-- CreateIndex
CREATE INDEX "registro_atividade_pessoa_id_concluida_em_idx" ON "registro_atividade"("pessoa_id", "concluida_em");

-- CreateIndex
CREATE INDEX "desafio_familia_id_ativo_idx" ON "desafio"("familia_id", "ativo");

-- CreateIndex
CREATE INDEX "desafio_origem_ativo_idx" ON "desafio"("origem", "ativo");

-- CreateIndex
CREATE INDEX "desafio_categoria_idx" ON "desafio"("categoria");

-- CreateIndex
CREATE INDEX "sugestao_desafio_pessoa_pessoa_id_escolhida_idx" ON "sugestao_desafio_pessoa"("pessoa_id", "escolhida");

-- CreateIndex
CREATE UNIQUE INDEX "sugestao_desafio_pessoa_pessoa_id_desafio_id_key" ON "sugestao_desafio_pessoa"("pessoa_id", "desafio_id");

-- CreateIndex
CREATE INDEX "desafio_guardado_pessoa_id_idx" ON "desafio_guardado"("pessoa_id");

-- CreateIndex
CREATE UNIQUE INDEX "desafio_guardado_pessoa_id_desafio_id_key" ON "desafio_guardado"("pessoa_id", "desafio_id");

-- CreateIndex
CREATE INDEX "disponibilidade_desafio_pessoa_id_disponivel_para_nova_part_idx" ON "disponibilidade_desafio"("pessoa_id", "disponivel_para_nova_participacao");

-- CreateIndex
CREATE UNIQUE INDEX "disponibilidade_desafio_pessoa_id_desafio_id_key" ON "disponibilidade_desafio"("pessoa_id", "desafio_id");

-- CreateIndex
CREATE INDEX "participacao_desafio_pessoa_id_registrado_em_idx" ON "participacao_desafio"("pessoa_id", "registrado_em");

-- CreateIndex
CREATE INDEX "participacao_desafio_desafio_id_idx" ON "participacao_desafio"("desafio_id");

-- CreateIndex
CREATE UNIQUE INDEX "participacao_desafio_execucao_chave_key" ON "participacao_desafio"("execucao_chave");

-- CreateIndex
CREATE INDEX "movimento_estrelas_pessoa_id_criado_em_idx" ON "movimento_estrelas"("pessoa_id", "criado_em");

-- CreateIndex
CREATE INDEX "recompensa_pessoa_id_ativa_idx" ON "recompensa"("pessoa_id", "ativa");

-- CreateIndex
CREATE INDEX "recompensa_pessoa_id_disponivel_para_resgate_idx" ON "recompensa"("pessoa_id", "disponivel_para_resgate");

-- CreateIndex
CREATE UNIQUE INDEX "resgate_recompensa_solicitacao_chave_key" ON "resgate_recompensa"("solicitacao_chave");

-- CreateIndex
CREATE INDEX "resgate_recompensa_pessoa_id_resgatado_em_idx" ON "resgate_recompensa"("pessoa_id", "resgatado_em");

-- CreateIndex
CREATE UNIQUE INDEX "resgate_recompensa_recompensa_id_geracao_disponibilidade_key" ON "resgate_recompensa"("recompensa_id", "geracao_disponibilidade");

-- AddForeignKey
ALTER TABLE "pessoa" ADD CONSTRAINT "pessoa_familia_id_fkey" FOREIGN KEY ("familia_id") REFERENCES "familia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progresso_fase_jogo" ADD CONSTRAINT "progresso_fase_jogo_familia_id_fkey" FOREIGN KEY ("familia_id") REFERENCES "familia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progresso_fase_jogo" ADD CONSTRAINT "progresso_fase_jogo_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fase_jogo_digital" ADD CONSTRAINT "fase_jogo_digital_jogo_id_fkey" FOREIGN KEY ("jogo_id") REFERENCES "jogo_digital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessao_provisoria" ADD CONSTRAINT "sessao_provisoria_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "autorizacao" ADD CONSTRAINT "autorizacao_familia_id_fkey" FOREIGN KEY ("familia_id") REFERENCES "familia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "autorizacao" ADD CONSTRAINT "autorizacao_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "autorizacao" ADD CONSTRAINT "autorizacao_pessoa_alvo_id_fkey" FOREIGN KEY ("pessoa_alvo_id") REFERENCES "pessoa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "convite" ADD CONSTRAINT "convite_familia_id_fkey" FOREIGN KEY ("familia_id") REFERENCES "familia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "convite" ADD CONSTRAINT "convite_pessoa_alvo_id_fkey" FOREIGN KEY ("pessoa_alvo_id") REFERENCES "pessoa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "convite" ADD CONSTRAINT "convite_pessoa_conta_id_fkey" FOREIGN KEY ("pessoa_conta_id") REFERENCES "pessoa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "convite" ADD CONSTRAINT "convite_criado_por_id_fkey" FOREIGN KEY ("criado_por_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anexo" ADD CONSTRAINT "anexo_familia_id_fkey" FOREIGN KEY ("familia_id") REFERENCES "familia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anexo" ADD CONSTRAINT "anexo_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "pessoa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anexo" ADD CONSTRAINT "anexo_criado_por_id_fkey" FOREIGN KEY ("criado_por_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicamento" ADD CONSTRAINT "medicamento_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicamento_anexo" ADD CONSTRAINT "medicamento_anexo_medicamento_id_fkey" FOREIGN KEY ("medicamento_id") REFERENCES "medicamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicamento_anexo" ADD CONSTRAINT "medicamento_anexo_anexo_id_fkey" FOREIGN KEY ("anexo_id") REFERENCES "anexo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programacao_medicamento" ADD CONSTRAINT "programacao_medicamento_medicamento_id_fkey" FOREIGN KEY ("medicamento_id") REFERENCES "medicamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registro_dose" ADD CONSTRAINT "registro_dose_medicamento_id_fkey" FOREIGN KEY ("medicamento_id") REFERENCES "medicamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registro_dose" ADD CONSTRAINT "registro_dose_substitui_id_fkey" FOREIGN KEY ("substitui_id") REFERENCES "registro_dose"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consulta" ADD CONSTRAINT "consulta_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exame" ADD CONSTRAINT "exame_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exame" ADD CONSTRAINT "exame_consulta_id_fkey" FOREIGN KEY ("consulta_id") REFERENCES "consulta"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exame" ADD CONSTRAINT "exame_anexo_id_fkey" FOREIGN KEY ("anexo_id") REFERENCES "anexo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registro_atividade" ADD CONSTRAINT "registro_atividade_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "desafio" ADD CONSTRAINT "desafio_familia_id_fkey" FOREIGN KEY ("familia_id") REFERENCES "familia"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "desafio" ADD CONSTRAINT "desafio_criado_por_id_fkey" FOREIGN KEY ("criado_por_id") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sugestao_desafio_pessoa" ADD CONSTRAINT "sugestao_desafio_pessoa_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sugestao_desafio_pessoa" ADD CONSTRAINT "sugestao_desafio_pessoa_desafio_id_fkey" FOREIGN KEY ("desafio_id") REFERENCES "desafio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sugestao_desafio_pessoa" ADD CONSTRAINT "sugestao_desafio_pessoa_atualizado_por_id_fkey" FOREIGN KEY ("atualizado_por_id") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "desafio_guardado" ADD CONSTRAINT "desafio_guardado_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "desafio_guardado" ADD CONSTRAINT "desafio_guardado_desafio_id_fkey" FOREIGN KEY ("desafio_id") REFERENCES "desafio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disponibilidade_desafio" ADD CONSTRAINT "disponibilidade_desafio_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disponibilidade_desafio" ADD CONSTRAINT "disponibilidade_desafio_desafio_id_fkey" FOREIGN KEY ("desafio_id") REFERENCES "desafio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disponibilidade_desafio" ADD CONSTRAINT "disponibilidade_desafio_atualizado_por_id_fkey" FOREIGN KEY ("atualizado_por_id") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participacao_desafio" ADD CONSTRAINT "participacao_desafio_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participacao_desafio" ADD CONSTRAINT "participacao_desafio_desafio_id_fkey" FOREIGN KEY ("desafio_id") REFERENCES "desafio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participacao_desafio" ADD CONSTRAINT "participacao_desafio_registrado_por_id_fkey" FOREIGN KEY ("registrado_por_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participacao_desafio" ADD CONSTRAINT "participacao_desafio_substitui_id_fkey" FOREIGN KEY ("substitui_id") REFERENCES "participacao_desafio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimento_estrelas" ADD CONSTRAINT "movimento_estrelas_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimento_estrelas" ADD CONSTRAINT "movimento_estrelas_participacao_id_fkey" FOREIGN KEY ("participacao_id") REFERENCES "participacao_desafio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimento_estrelas" ADD CONSTRAINT "movimento_estrelas_resgate_id_fkey" FOREIGN KEY ("resgate_id") REFERENCES "resgate_recompensa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recompensa" ADD CONSTRAINT "recompensa_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resgate_recompensa" ADD CONSTRAINT "resgate_recompensa_recompensa_id_fkey" FOREIGN KEY ("recompensa_id") REFERENCES "recompensa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resgate_recompensa" ADD CONSTRAINT "resgate_recompensa_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resgate_recompensa" ADD CONSTRAINT "resgate_recompensa_resgatado_por_id_fkey" FOREIGN KEY ("resgatado_por_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
