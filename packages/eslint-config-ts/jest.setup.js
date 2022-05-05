const { toHaveESLintError } = require('@kael89/eslint-utils');

expect.extend({
  toHaveESLintError,
});

beforeEach(() => {
  expect.hasAssertions();
});
