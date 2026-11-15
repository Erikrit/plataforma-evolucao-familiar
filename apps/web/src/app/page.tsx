import { PainelFundacao } from "@/componentes/painel-fundacao";

export default function PaginaInicial() {
  return (
    <main>
      <h1>Plataforma de Evolução Familiar</h1>
      <p>
        Fundação Familiar · FF-02 — cadastro de pessoa com nome e sessão
        provisória do administrador.
      </p>
      <PainelFundacao />
    </main>
  );
}
