module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  env: {
    node: true,
    browser: true,
  },
  parserOptions: {
    project: 'tsconfig.json',
  },
  rules: {
    semi: ['error', 'never'],
    'import/prefer-default-export': 'off',
    'import/no-cycle': 'off',
    'class-methods-use-this': 'off',
    'no-case-declarations': 'off'
  },
  extends: [
    'airbnb-typescript/base',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
}
