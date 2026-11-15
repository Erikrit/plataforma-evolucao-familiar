import type { Pessoa, Usuario } from "@prisma/client";

export type UsuarioAutenticado = Usuario & { pessoa: Pessoa };

export type RequisicaoComUsuario = {
  usuario?: UsuarioAutenticado;
};
