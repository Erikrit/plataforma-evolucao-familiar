import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ModuloApp } from "./modulo-app";

async function bootstrap() {
  const aplicativo = await NestFactory.create(ModuloApp);
  aplicativo.enableCors({
    origin: process.env.WEB_ORIGIN ?? "http://localhost:3000",
  });
  const porta = Number(process.env.API_PORT ?? 3001);
  await aplicativo.listen(porta);
}

void bootstrap();
