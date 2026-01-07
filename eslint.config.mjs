// ESLint config optimized for automation testing
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      // Essential TypeScript rules
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // Code quality rules (DRY and KISS principles)
      'no-duplicate-imports': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: 'error',
      curly: 'error',
      'no-empty': ['warn', { allowEmptyCatch: true }],

      // Automation-friendly rules
      'no-console': 'off', // Allow console for debugging
      'no-debugger': 'error',
      complexity: ['warn', 20],
      'max-lines-per-function': ['warn', 150],
      'no-magic-numbers': [
        'warn',
        {
          ignore: [
            0, 1, -1, 2, 3, 4, 5, 7, 10, 36, 100, 200, 201, 400, 401, 403, 404, 500, 1000, 2000,
            3000, 5000, 10000, 30000,
          ],
          ignoreArrayIndexes: true,
          ignoreDefaultValues: true,
        },
      ],
    },
  },
  {
    // Page Objects and Components - more permissive for UI complexity
    files: ['**/po/**/*.ts', '**/components/**/*.ts'],
    rules: {
      complexity: 'off',
      'max-lines-per-function': 'off',
      'no-console': 'off',
      'no-empty': 'off', // Allow empty catch blocks for robust UI detection
    },
  },
  {
    // Test files - most permissive for test readability
    files: ['**/*.spec.ts', '**/*.test.ts', '**/tests/**/*.ts'],
    rules: {
      'no-console': 'off',
      'max-lines-per-function': 'off',
      complexity: 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-magic-numbers': 'off',
      'no-empty': 'off',
      // Prevent test.only to avoid accidentally committing focused tests
      'no-restricted-properties': [
        'error',
        {
          object: 'test',
          property: 'only',
          message: 'test.only is not allowed. Remove .only before committing.',
        },
        {
          object: 'describe',
          property: 'only',
          message: 'describe.only is not allowed. Remove .only before committing.',
        },
      ],
    },
  },
  {
    ignores: [
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
      'allure-results/**',
      'allure-report/**',
      'reports/**',
      'scripts/**',
      'coverage/**',
      'dist/**',
      'build/**',
      '.vscode/**',
      '.idea/**',
      '*.config.js',
      '*.config.mjs',
      '*.config.ts',
      'test-results.json',
      '**/*.log',
      '.env',
      '.env.*',
      '**/*.tmp',
      '**/*.temp',
      '.cache/**',
    ],
  },
];
