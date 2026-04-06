import { FlatCompat } from "@eslint/eslintrc";
import nextConfig from "@repo/eslint-config/next";

const compat = new FlatCompat();

const config = [
  ...nextConfig,
  // eslint-config-next는 아직 flat config 미지원 → compat 레이어로 wrapping
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [".next/**", "node_modules/**"],
  },
];

export default config;
