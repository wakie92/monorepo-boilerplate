module.exports = {
  'apps/web/**/*.{js,ts,tsx}': [() => 'pnpm run tscheck:web', () => 'pnpm run eslint-check:web'],
  'apps/native/**/*.{js,ts,tsx}': [
    () => 'pnpm run tscheck:native',
    () => 'pnpm run eslint-check:native',
  ],
  'packages/core/**/*.{js,ts,tsx}': [
    () => 'pnpm run tscheck:packages-core',
    () => 'pnpm run eslint-check:packages-core',
  ],
  '**/*.{js,css,json,md,ts,tsx}': 'prettier --write',
  'apps/web/src/**/styled.{ts,js}': 'stylelint',
  'apps/web/src/styles/styledComponents/**/*.ts': 'stylelint',
  'apps/native/src/**/styled.{ts,js}': 'stylelint',
  'apps/native/src/styles/styledComponents/**/*.ts': 'stylelint',
};
