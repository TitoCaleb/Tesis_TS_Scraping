module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json', './.eslinttsconfig.json'],
  },
  plugins: ['@typescript-eslint', 'jest', 'import'],
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:jest/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
  ],
  settings: {
    'import/resolver': {
      node: true,
      typescript: true,
    },
  },
  rules: {
    'linebreak-style': ['error', 'unix'],
    'class-methods-use-this': 'off',
    'sort-imports': ['error', { ignoreDeclarationSort: true }],
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/order': [
      'error',
      { alphabetize: { order: 'asc' }, 'newlines-between': 'never' },
    ],
    'no-unused-vars': 'off', // or "@typescript-eslint/no-unused-vars": "off",
  },
  overrides: [
    {
      files: ['*.ts'],
      rules: {},
    },
  ],
};
