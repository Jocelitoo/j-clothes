module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es8: true,
  },
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:prettier/recommended', // Integração com Prettier
    'prettier', // Evita conflitos entre ESLint e Prettier
  ],
  ignorePatterns: ['.eslintrc.cjs'],
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
  },
  rules: {
    'no-unused-vars': 'error',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },
};
