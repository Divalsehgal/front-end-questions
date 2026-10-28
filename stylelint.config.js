/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard-scss', 'stylelint-config-recess-order'],
  ignoreFiles: ['dist/**', 'coverage/**', 'node_modules/**', 'src/content/subjects/**/files/**'],
  rules: {
    // Colours come from design tokens; raw hex is only allowed where tokens are defined (see overrides).
    'color-no-hex': true,
    'declaration-no-important': true,
    'max-nesting-depth': 3,
    // Tailwind v4 at-rules used by src/index.css.
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': [
      true,
      { ignoreAtRules: ['theme', 'custom-variant', 'apply', 'tailwind', 'utility', 'variant', 'source', 'plugin', 'config', 'reference'] },
    ],
    // Remote font import uses url() so Tailwind's import resolver leaves it alone.
    'import-notation': null,
    // Font family names in tokens keep their real casing (SFMono-Regular, Menlo).
    'value-keyword-case': ['lower', { ignoreProperties: [/^--font/] }],
    // CSS modules: :global/:local and `composes`.
    'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['global', 'local', 'export'] }],
    'property-no-unknown': [true, { ignoreProperties: ['composes', 'compose-with'] }],
    // Font stacks quote family names (e.g. 'Inter').
    'font-family-name-quotes': 'always-where-recommended',
  },
  overrides: [
    {
      // camelCase so CSS module classes read as `styles.fooBar`.
      files: ['**/*.module.scss', '**/*.module.css'],
      rules: {
        'selector-class-pattern': ['^[a-z][a-zA-Z0-9]*$', { message: (s) => `Expected class "${s}" to be camelCase (CSS modules)` }],
      },
    },
    {
      // Token sources are the only place raw colour values may live.
      files: ['src/styles/tokens/**', 'src/index.css'],
      rules: { 'color-no-hex': null },
    },
  ],
};
