import { Controller, Get, ServiceUnavailableException } from "@nestjs/common";
import { ServicoPrisma } from "../prisma/servico-prisma";

@Controller("saude")
export class ControladorSaude {
  constructor(private readonly prisma: ServicoPrisma) {}

  @Get()
  async verificar() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: "ok",
        api: "ok",
        banco: "ok",
        incremento: process.env.PEF_INCREMENTO ?? "FF-02",
      };
    } catch {
      throw new ServiceUnavailableException({
        status: "degradado",
        api: "ok",
        banco: "indisponivel",
        incremento: process.env.PEF_INCREMENTO ?? "FF-02",
      });
    }
  }
}
