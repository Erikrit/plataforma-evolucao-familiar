/**
 * Cena do Barquinho no rio em PixiJS (teste técnico do 2D, ticket 10).
 * Importado só por `import()` ao abrir o jogo: não entra no download das outras telas.
 */
import { Application, Container, Graphics } from "pixi.js";
import { CORES_BARQUINHO as COR, geometria, type MontarCena } from "./cena-barquinho";

export const montarCenaPixi: MontarCena = async (cena) => {
  const { controlador } = cena;
  const { fase, movimentoReduzido } = controlador;
  const geo = geometria(cena);
  const c = geo.celula;
  const app = new Application();
  await app.init({
    width: cena.largura,
    height: cena.altura,
    background: COR.agua,
    resolution: Math.min(window.devicePixelRatio || 1, 2),
    autoDensity: true,
    antialias: true,
    preference: "webgl",
  });
  cena.alvo.appendChild(app.canvas);

  const mundo = new Container();
  app.stage.addChild(mundo);
  mundo.addChild(new Graphics().rect(0, 0, cena.largura, geo.alturaRio).fill(COR.agua));

  let ondas: Graphics | null = null;
  if (!movimentoReduzido) {
    ondas = new Graphics();
    for (let l = -1; l < fase.rio.length; l += 1) {
      for (let k = 0; k < geo.colunas; k += 2) {
        ondas.rect((k + ((l & 1) ? 0.6 : 0.1)) * c, (l + 0.5) * c, c * 0.4, c * 0.06);
      }
    }
    ondas.fill({ color: COR.aguaClara, alpha: 0.6 });
    mundo.addChild(ondas);
  }

  const rio = new Graphics();
  const folhas = new Map<string, Graphics>();
  fase.rio.forEach((linha, l) => {
    [...linha].forEach((valor, k) => {
      const x = k * c;
      const y = l * c;
      if (valor === "#") {
        rio.rect(x, y, c + 1, c + 1).fill(COR.margem);
        rio.circle(x + c * 0.3, y + c * 0.35, c * 0.12).fill(COR.margemEscura);
      } else if (valor === "o") {
        rio.circle(x + c / 2, y + c / 2, c * 0.4).fill(COR.pedra);
        rio.circle(x + c * 0.4, y + c * 0.4, c * 0.15).fill(COR.pedraClara);
      } else if (valor === "f") {
        const folha = new Graphics().ellipse(0, 0, c * 0.25, c * 0.14).fill(COR.folha);
        folha.position.set(x + c / 2, y + c / 2);
        folhas.set(`${l}/${k}`, folha);
      }
    });
  });
  for (let k = 0; k < geo.colunas; k += 1) {
    rio.rect(k * c, geo.ultima * c, c, c * 0.25).fill(k % 2 ? COR.chegada : COR.vela);
  }
  mundo.addChild(rio, ...folhas.values());

  const barco = new Graphics()
    .roundRect(-c * 0.22, -c * 0.38, c * 0.44, c * 0.76, c * 0.18)
    .fill(COR.casco)
    .stroke({ width: Math.max(1, c * 0.04), color: COR.contorno })
    .poly([0, -c * 0.3, c * 0.2, c * 0.15, -c * 0.05, c * 0.15])
    .fill(COR.vela);
  mundo.addChild(barco);

  let colunaVisual = controlador.estado.coluna;
  let tempo = 0;
  let desenhou = false;
  app.ticker.add((ticker) => {
    const delta = ticker.deltaMS;
    controlador.passo(delta);
    const estado = controlador.estado;
    colunaVisual = movimentoReduzido
      ? estado.coluna
      : colunaVisual + (estado.coluna - colunaVisual) * Math.min(1, delta / 90);
    barco.position.set((colunaVisual + 0.5) * c, (estado.linha + 0.5) * c);
    mundo.y = -geo.camera(estado.linha);
    if (ondas) {
      tempo += delta;
      ondas.y = ((tempo / 1000) * fase.correnteza * c * 0.6) % (c * 2);
    }
    for (const chave of estado.folhas) {
      const folha = folhas.get(chave);
      if (folha) folha.visible = false;
    }
    if (!desenhou) {
      desenhou = true;
      cena.aoPrimeiroQuadro();
    }
  });

  return { destruir: () => app.destroy(true, { children: true }) };
};
