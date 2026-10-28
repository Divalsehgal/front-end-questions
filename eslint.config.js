// @ts-check
import js from '@eslint/js';
import vitest from '@vitest/eslint-plugin';
import prettier from 'eslint-config-prettier';
import importX from 'eslint-plugin-import-x';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import regexp from 'eslint-plugin-regexp';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/**
 * Code fixtures shown verbatim to users (machine-coding solutions, drill starters, output
 * snippets). Their length, console usage and style are part of the content, so the size and
 * style rules below would distort them. Correctness is enforced by the content test gate
 * (src/content/content.test.ts): solutions must pass, starters must fail, snippets must run.
 */
const FIXTURES = ['src/content/subjects/**/files/**'];

export default tseslint.config(
  { ignores: ['dist/**', 'dist-ssr/**', 'coverage/**', 'node_modules/**', 'index.js', ...FIXTURES] },

  js.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,

  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: { ...globals.browser },
    },
    plugins: { 'import-x': importX, unicorn, regexp },
    settings: {
      'import-x/resolver': { typescript: true, node: true },
    },
    rules: {
      // TypeScript
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      // Type aliases and interfaces are both fine; don't churn existing code.
      '@typescript-eslint/consistent-type-definitions': 'off',
      eqeqeq: ['error', 'smart'],
      'prefer-const': 'error',
      'no-var': 'error',
      'no-console': ['warn', { allow: ['error', 'warn'] }],
      'require-await': 'error',

      // Modern built-ins (mirrors SonarCloud's code-smell rules).
      'unicorn/prefer-number-properties': 'error',
      'unicorn/prefer-string-replace-all': 'error',
      'unicorn/prefer-code-point': 'error',
      'unicorn/no-new-array': 'error',
      'unicorn/new-for-builtins': 'error',
      'unicorn/prefer-at': 'error',
      'unicorn/prefer-string-raw': 'error',
      'no-nested-ternary': 'error', // SonarCloud S3358

      // Regexes that backtrack super-linearly on hostile input (mirrors SonarCloud S5852).
      'regexp/no-super-linear-backtracking': 'error',
      'regexp/no-super-linear-move': 'error',

      // Imports
      'import-x/no-duplicates': 'error',
      'import-x/first': 'error',
      'import-x/newline-after-import': 'error',
      'import-x/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type'],
          'newlines-between': 'never',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      // Size and complexity: keep modules and functions small enough to review.
      'max-lines': ['error', { max: 250, skipBlankLines: false, skipComments: false }],
      'max-lines-per-function': ['warn', { max: 80, skipBlankLines: true, skipComments: true }],
      complexity: ['warn', 15],
      'max-depth': ['warn', 4],
    },
  },

  // Promises must be awaited, handled or explicitly ignored with `void` (mirrors SonarCloud S6544).
  // The only type-aware rule, so only it pays for the TypeScript program.
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: { parserOptions: { project: ['./tsconfig.json', './tsconfig.test.json'], tsconfigRootDir: import.meta.dirname } },
    rules: { '@typescript-eslint/no-floating-promises': 'error' },
  },

  // React + accessibility (WCAG) for components.
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { react, 'jsx-a11y': jsxA11y },
    settings: { react: { version: 'detect' } },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...react.configs.flat['jsx-runtime'].rules,
      ...jsxA11y.flatConfigs.recommended.rules,
      'react/prop-types': 'off',
      'react/self-closing-comp': 'error',
      'react/jsx-no-useless-fragment': 'error',
      'react/jsx-key': ['error', { checkFragmentShorthand: true }],
      'react/jsx-child-element-spacing': 'error',
      // Mirror SonarCloud S6479: keys come from content, not list position.
      'react/no-array-index-key': 'error',
    },
  },
  reactHooks.configs.flat['recommended-latest'],

  // Tests: describe/it blocks are naturally long.
  {
    files: ['src/**/*.test.{ts,tsx}', 'src/test/**'],
    languageOptions: { globals: { ...globals.node } },
    plugins: { vitest },
    rules: {
      'vitest/expect-expect': 'error',
      'vitest/prefer-to-have-length': 'error', // SonarCloud S5906
      'max-lines-per-function': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      // Empty functions/classes are common fixtures for formatter and harness tests.
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-extraneous-class': 'off',
      // Mocks of async APIs are written `async` on purpose, so a throw becomes a rejection.
      'require-await': 'off',
    },
  },

  // App code never imports the whole question bank: it would put every subject in each page's
  // initial JS. Subjects load on demand through src/content/loader.ts.
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/**/*.test.{ts,tsx}', 'src/test/**', 'src/entry-server.tsx', 'src/content/bank.ts', 'src/content/subjects/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: [{ regex: '(^|/)(content/)?(bank|subjects)$', message: 'Load subjects on demand via src/content/loader.ts.' }] },
      ],
    },
  },

  // Node-side config files.
  {
    files: ['*.{js,ts,mjs,cjs}', 'scripts/**', 'vite-plugins/**'],
    languageOptions: { globals: { ...globals.node } },
  },

  // Must stay last: turns off every rule that conflicts with Prettier.
  prettier,
);
