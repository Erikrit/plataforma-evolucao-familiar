import type { NextConfig } from "next";

const configuracao: NextConfig = {
  reactStrictMode: true,
  // Permite build QG em pasta alternativa quando `.next` está travado pelo next:dev.
  ...(process.env.PEF_NEXT_DIST_DIR
    ? { distDir: process.env.PEF_NEXT_DIST_DIR }
    : {}),
  eslint: {
    // Lint roda via `npm run lint` na raiz (QG-1).
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks", "@mantine/notifications"],
  },
};

export default configuracao;
