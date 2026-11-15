import type { NextConfig } from "next";

const configuracao: NextConfig = {
  reactStrictMode: true,
  eslint: {
    // Lint roda via `npm run lint` na raiz (QG-1).
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks", "@mantine/notifications"],
  },
};

export default configuracao;
