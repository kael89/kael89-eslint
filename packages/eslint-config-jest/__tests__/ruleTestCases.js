const { RuleSeverity } = require('@kael89/eslint-utils');

/**
 * Data structure inspired by https://eslint.org/docs/developer-guide/nodejs-api#ruletester
 */
const ruleTestCases = {
  'jest/consistent-test-it': {
    severity: RuleSeverity.Warning,
    valid: [
      {
        name: 'only `it` blocks are used',
        code: `
          it('top level test case', () => {});

          describe('describe block', () => {
            it('nested test case', () => {})
          });
        `,
      },
    ],
    invalid: [
      {
        name: '`test` blocks are used',
        code: `
          test('top level test case', () => {});

          describe('describe block', () => {
            test('nested test case', () => {})
          });
        `,
        message: "Prefer using 'it' instead of 'test'",
      },
      {
        name: '`it` and `test` blocks are used',
        code: `
          test('top level test case', () => {});

          describe('describe block', () => {
            it('nested test case', () => {})
          });
        `,
        message: "Prefer using 'it' instead of 'test'",
      },
    ],
  },
  'jest/expect-expect': {
    valid: [
      {
        name: '`expect` is used in a test',
        code: `
          it('test case', () => {
            expect(true).toBe(true);
          })
        `,
      },
      {
        name: '`expect` is not used in a test',
        code: `
          it('test case', () => {})
        `,
      },
    ],
  },
  'jest/no-alias-methods': {
    severity: RuleSeverity.Warning,
    valid: [
      {
        name: 'alias is not used',
        code: 'expect(a).toHaveBeenCalled();',
      },
    ],
    invalid: [
      {
        name: 'alias is used',
        code: 'expect(a).toBeCalled();',
        message: 'Replace toBeCalled() with its canonical name of toHaveBeenCalled()',
      },
    ],
  },
  'jest/no-commented-out-tests': {
    valid: [
      {
        name: 'not commented out test',
        code: "it('test case', () => {});",
      },
      {
        name: 'commented out test',
        code: "// it('test case', () => {});",
      },
    ],
  },
  'jest/prefer-comparison-matcher': {
    severity: RuleSeverity.Warning,
    valid: [
      {
        name: 'toBeGreaterThan() is used',
        code: 'expect(x).toBeGreaterThan(5);',
      },
      {
        name: 'toBeLessThanOrEqual() is used',
        code: 'expect(x).not.toBeLessThanOrEqual(7);',
      },
      {
        name: 'toBeLessThanOrEqual() is used',
        code: 'expect(x).toBeLessThanOrEqual(y);',
      },
    ],
    invalid: [
      {
        name: 'toBe() is used for arithmetical comparison',
        code: 'expect(x > 5).toBe(true);',
      },
      {
        name: 'toEqual() is used for arithmetical comparison',
        code: 'expect(x < 7).not.toEqual(true);',
      },
      {
        name: 'toStrictEqual() is used for arithmetical comparison',
        code: 'expect(x <= y).toStrictEqual(true);',
      },
    ],
  },
  'jest/prefer-equality-matcher': {
    severity: RuleSeverity.Warning,
    valid: [
      {
        name: 'toBe() is used to compare value directly',
        code: 'expect(x).toBe(5);',
      },
      {
        name: 'toEqual() is used to compare value directly',
        code: "expect(name).not.toEqual('Carl');",
      },
      {
        name: 'toStrictEqual() is used to compare value directly',
        code: 'expect(myObj).toStrictEqual(thatObj);',
      },
    ],
    invalid: [
      {
        name: 'toBe(true) is used instead of direct value comparison',
        code: 'expect(x === 5).toBe(true);',
      },
      {
        name: 'toEqual(true) is used instead of direct value comparison',
        code: "expect(name === 'Carl').not.toEqual(true);",
      },
      {
        name: 'toStrictEqual(true) is used instead of direct value comparison',
        code: 'expect(myObj !== thatObj).toStrictEqual(true);',
      },
    ],
  },
};

module.exports = { ruleTestCases };
