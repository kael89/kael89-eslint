/* eslint-disable jest/valid-title */

const assert = require('assert');
const { ESLint } = require('eslint');

const { lintText, RuleSeverity } = require('@kael89/eslint-utils');

const { ruleTestCases } = require('./ruleTestCases');

describe('Tests for rules in our ESLint config', () => {
  const eslint = new ESLint({
    useEslintrc: false,
    baseConfig: {
      extends: './index.js',
    },
  });

  const severityToDescription = {
    [RuleSeverity.Off]: 'no error',
    [RuleSeverity.Warning]: 'warning',
    [RuleSeverity.Error]: 'error',
  };

  it('no rule definition should be missing', async () => {
    const { messages } = await lintText(eslint, 'console.log("test")');

    // Workaround to avoid "has no assertions" error if messages.length is 0
    expect(true).toBe(true);
    messages.forEach(({ message }) => {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(message).not.toEqual(/^Definition for rule .* was not found.$/);
    });
  });

  Object.entries(ruleTestCases).forEach(([ruleId, testCasesForRule]) => {
    describe(ruleId, () => {
      assert.ok(testCasesForRule, `Test cases for '${ruleId}' are empty`);
      const { severity, valid = [], invalid = [] } = testCasesForRule;
      const severityDescription = severityToDescription[severity];

      for (const { name, code, filePath } of valid) {
        it(`no error: ${name}`, async () => {
          await expect(code).not.toHaveESLintError(eslint, ruleId, { filePath });
        });
      }

      for (const { name, code, message, filePath } of invalid) {
        it(`${severityDescription}: ${name}`, async () => {
          await expect(code).toHaveESLintError(eslint, ruleId, { severity, message, filePath });
        });
      }
    });
  });
});
