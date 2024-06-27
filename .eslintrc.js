const { join } = require('path');

module.exports = {
  root: true,
  extends: '@arcblock/eslint-config-ts',
  parserOptions: {
    project: [join(__dirname, 'tsconfig.eslint.json'), join(__dirname, 'tsconfig.json')],
  },
  rules: {
    'react/require-default-props': 'off',
    'react/button-has-type': 'off',
    'import/prefer-default-export': 'off',
    'no-restricted-exports': 'off',
    '@typescript-eslint/indent': 'off',
    'no-restricted-syntax': 'off',
  },
};
