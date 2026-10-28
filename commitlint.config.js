/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Allow longer, descriptive subjects (matches existing history).
    'header-max-length': [2, 'always', 120],
  },
};
