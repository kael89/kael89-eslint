module.exports = {
  extends: ['plugin:jest/recommended', 'plugin:jest-formatting/recommended'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'jest/consistent-test-it': ['warn', { fn: 'it' }],
    'jest/expect-expect': 'off',
    'jest/no-alias-methods': 'warn',
    'jest/no-commented-out-tests': 'off',
    'jest/prefer-comparison-matcher': 'warn',
    'jest/prefer-equality-matcher': 'warn',
  },
};
