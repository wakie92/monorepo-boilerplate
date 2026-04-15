import { FlatCompat } from "@eslint/eslintrc";
import nextConfig from "@repo/eslint-config/next";

const compat = new FlatCompat();

const config = [
  {
    ignores: [
      "eslint.config.mjs",
      "next-env.d.ts",
      "**/apps/web/next-env.d.ts",
      ".next/**",
      "node_modules/**",
    ],
  },
  ...nextConfig,
  // eslint-config-next는 아직 flat config 미지원 → compat 레이어로 wrapping
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      "@next/next/no-html-link-for-pages": "off",
    },
  },
];

export default config;
