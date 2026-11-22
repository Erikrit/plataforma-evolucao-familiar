import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { ModuloApp } from "./modulo-app";
import { LIMITE_JSON_BODY_ANEXO } from "./anexos/limites-anexo";

async function bootstrap() {
  const aplicativo =
    await NestFactory.create<NestExpressApplication>(ModuloApp);
  // Base64 de documentos fictícios/clínicos ultrapassa o padrão ~100kb (DEF-E3-ANEXO).
  aplicativo.useBodyParser("json", { limit: LIMITE_JSON_BODY_ANEXO });
  aplicativo.enableCors({
    origin: process.env.WEB_ORIGIN ?? "http://localhost:3000",
    credentials: true,
  });
  const porta = Number(process.env.API_PORT ?? 3001);
  await aplicativo.listen(porta);
}

void bootstrap();
