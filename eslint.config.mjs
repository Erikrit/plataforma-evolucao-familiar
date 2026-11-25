import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/.next-qg*/**",
      "**/coverage/**",
      "tmp/**",
      "docs/**",
      ".cursor/**",
      ".codex/**",
      ".claude/**",
      "scripts/**",
      "apps/**/scripts/**",
      "apps/**/prisma/**",
      "apps/web/next-env.d.ts",
      "**/*.cjs",
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["apps/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
);
