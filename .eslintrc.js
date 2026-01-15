module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  env: {
    node: true,
    es2020: true,
    jest: true,
  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'coverage/',
    'playwright-report/',
    '*.html',  // Skip HTML files in src/
  ],
  rules: {
    // TypeScript handles these
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

    // Allow any for Google Apps Script interop
    '@typescript-eslint/no-explicit-any': 'warn',

    // Consistent code style
    'semi': ['error', 'always'],
    'quotes': ['error', 'single', { avoidEscape: true }],
    'comma-dangle': ['error', 'always-multiline'],

    // Allow console in Apps Script
    'no-console': 'off',

    // Allow empty functions for mocks
    '@typescript-eslint/no-empty-function': 'off',
  },
  overrides: [
    {
      // Google Apps Script files (.gs)
      files: ['src/**/*.gs'],
      rules: {
        // GS files may use different conventions
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      // Test files
      files: ['tests/**/*.ts', 'tests/**/*.js'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
};
