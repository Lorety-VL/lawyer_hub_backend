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
				e: true,
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
];