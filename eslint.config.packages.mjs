import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const base = require("@repo/eslint-config/base");

const packageFiles = [
  "packages/**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}",
  "commitlint.config.js",
  "eslint.config.packages.mjs",
];

/** @type {import("eslint").Linter.Config[]} */
const config = base.map((entry) => {
  const ignoreOnly =
    entry.ignores?.length &&
    !entry.files &&
    !entry.rules &&
    !entry.plugins &&
    !entry.languageOptions;

  if (ignoreOnly) {
    return {
      ...entry,
      ignores: [...entry.ignores, "apps/**", ".next/**", ".expo/**", "packages/eslint-config/**"],
    };
  }

  return {
    ...entry,
    files: packageFiles,
  };
});

export default config;
