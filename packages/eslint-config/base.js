const tseslint = require("typescript-eslint");
const eslintConfigPrettier = require("eslint-config-prettier");

const recommended = tseslint.configs.recommended;
const recommendedScoped = recommended.map((entry, index) =>
  index === recommended.length - 1 && entry.files == null
    ? { ...entry, files: ["**/*.{ts,mts,cts,tsx}"] }
    : entry
);

/** @type {import("typescript-eslint").Config} */
const config = tseslint.config(
  {
    ignores: ["dist/**", ".turbo/**", "node_modules/**"],
  },
  ...recommendedScoped,
  eslintConfigPrettier,
  {
    files: ["**/*.{ts,mts,cts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
    },
  }
);

module.exports = config;
