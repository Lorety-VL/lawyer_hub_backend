import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ...js.configs.recommended,
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.nodeBuiltin,
        ...globals.node,
      },
      ecmaVersion: 'latest',
    },
    rules: {
      'no-console': 'off',
      'no-unused-vars': 'warn',
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
    },
  },
  {
    files: ['**/migrations/*.cjs'],
    rules: {
      'no-unused-vars': 'off',
      'camelcase': 'off',
      'max-len': 'off',
      'no-console': 'off',
      'quotes': ['warn', 'single'], 
      'semi': ['warn', 'always']
    }
  }
];