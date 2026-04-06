const tseslint = require("typescript-eslint");
const base = require("./base");

/** @type {import("typescript-eslint").Config} */
const config = tseslint.config(
  ...base,
  {
    rules: {
      // Next.js의 Image, Link 컴포넌트 사용 권장
      "@next/next/no-html-link-for-pages": "error",
    },
  }
);

module.exports = config;
