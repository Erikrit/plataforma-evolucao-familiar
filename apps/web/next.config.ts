import type { NextConfig } from "next";

const configuracao: NextConfig = {
  reactStrictMode: true,
  eslint: {
    // Lint roda via `npm run lint` na raiz (QG-1).
    ignoreDuringBuilds: true,
  },
};

export default configuracao;
