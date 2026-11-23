import type { MetadataRoute } from "next";

export default function manifesto(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Plataforma de Evolução Familiar",
    short_name: "Evolução Familiar",
    lang: "pt-BR",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f6f8fc",
    theme_color: "#f6f8fc",
    icons: [
      { src: "/icones/app-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icones/app-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icones/app-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
