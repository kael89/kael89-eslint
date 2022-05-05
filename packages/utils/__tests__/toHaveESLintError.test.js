const { ESLint } = require('eslint');

const { RuleSeverity } = require('../src/RuleSeverity');
const { toHaveESLintError: baseToHaveESLintError } = require('../src/toHaveESLintError');

describe('toHaveESLintError', () => {
  const assertMatcherResultEquals = (received, expected) => {
    const { message, pass } = expected;
    expect(received).toStrictEqual({ message: expect.any(Function), pass });
    expect(received.message()).toBe(message);
  };

  const mockExpect = {
    utils: {
      printExpected: text => `__EXPECTED[${text}]`,
      printReceived: text => `__RECEIVED[${text}]`,
      matcherHint: text => `__MATCHER_HINT[${text}]`,
      RECEIVED_COLOR: text => `__RECEIVED_COLOR[${text}]`,
    },
  };

  const toHaveESLintError = baseToHaveESLintError.bind(mockExpect);

  const CAMELCASE_ERROR_CASE = {
    eslint: new ESLint({
      useEslintrc: false,
      baseConfig: {
        parserOptions: {
          ecmaVersion: 6,
        },
        rules: {
          camelcase: 'error',
        },
      },
    }),
    code: 'let snake_case;',
    expectedResults: {
      message: [
        mockExpect.utils.matcherHint('toHaveESLintError'),
        '',
        `Expected no ESLint error for rule ${mockExpect.utils.printReceived('camelcase')}`,
        `Received error: ${mockExpect.utils.printReceived(
          "Identifier 'snake_case' is not in camel case.",
        )}`,
        'Received code:',
        `${mockExpect.utils.RECEIVED_COLOR('let snake_case;')}`,
      ].join('\n'),
      pass: true,
    },
  };

  it('`options` is not required', async () => {
    const eslint = new ESLint({ useEslintrc: false, baseConfig: {} });
    const receivedPromise = toHaveESLintError('var x;', eslint, 'test-rule-id');

    await expect(receivedPromise).resolves.toEqual(expect.anything());
  });

  it('throws an error if ESLint reports a fatal error', async () => {
    const eslint = new ESLint({ useEslintrc: false, baseConfig: {} });
    const receivedPromise = toHaveESLintError('var class;', eslint, 'test-rule-id');
    const expectedError = new Error(
      "Fatal ESLint error: Parsing error: The keyword 'class' is reserved",
    );

    await expect(receivedPromise).rejects.toEqual(expectedError);
  });

  it('pass: an error for the specified rule is found', async () => {
    const received = await toHaveESLintError(
      CAMELCASE_ERROR_CASE.code,
      CAMELCASE_ERROR_CASE.eslint,
      'camelcase',
    );

    assertMatcherResultEquals(received, CAMELCASE_ERROR_CASE.expectedResults);
  });

  it('pass: an error for the specified rule and severity is found', async () => {
    const received = await toHaveESLintError(
      CAMELCASE_ERROR_CASE.code,
      CAMELCASE_ERROR_CASE.eslint,
      'camelcase',
      {
        severity: RuleSeverity.Error,
      },
    );

    assertMatcherResultEquals(received, CAMELCASE_ERROR_CASE.expectedResults);
  });

  it('pass: an error for the specified rule and message is found', async () => {
    const received = await toHaveESLintError(
      CAMELCASE_ERROR_CASE.code,
      CAMELCASE_ERROR_CASE.eslint,
      'camelcase',
      {
        message: "Identifier 'snake_case' is not in camel case.",
      },
    );

    assertMatcherResultEquals(received, CAMELCASE_ERROR_CASE.expectedResults);
  });

  it('no pass: an error for the specified rule is not reported', async () => {
    const code = 'console.log(x);';
    const received = await toHaveESLintError(code, CAMELCASE_ERROR_CASE.eslint, 'camelcase');

    const expected = {
      message: [
        mockExpect.utils.matcherHint('toHaveESLintError'),
        '',
        `Expected ESLint error for rule ${mockExpect.utils.printExpected('camelcase')}`,
        'Received code:',
        mockExpect.utils.RECEIVED_COLOR(code),
      ].join('\n'),
      pass: false,
    };

    assertMatcherResultEquals(received, expected);
  });

  it('no pass: the severity of the specified rule is wrong', async () => {
    const received = await toHaveESLintError(
      CAMELCASE_ERROR_CASE.code,
      CAMELCASE_ERROR_CASE.eslint,
      'camelcase',
      {
        severity: RuleSeverity.Warning,
      },
    );

    const expected = {
      message: [
        mockExpect.utils.matcherHint('toHaveESLintError'),
        '',
        `Expected severity: ${mockExpect.utils.printExpected(RuleSeverity.Warning)}`,
        `Received severity: ${mockExpect.utils.printReceived(RuleSeverity.Error)}`,
        'Received code:',
        mockExpect.utils.RECEIVED_COLOR(CAMELCASE_ERROR_CASE.code),
      ].join('\n'),
      pass: false,
    };

    assertMatcherResultEquals(received, expected);
  });

  it('no pass: the specified error message is wrong', async () => {
    const received = await toHaveESLintError(
      CAMELCASE_ERROR_CASE.code,
      CAMELCASE_ERROR_CASE.eslint,
      'camelcase',
      {
        message: 'Test message',
      },
    );

    const expected = {
      message: [
        mockExpect.utils.matcherHint('toHaveESLintError'),
        '',
        `Expected message: ${mockExpect.utils.printExpected('Test message')}`,
        `Received message: ${mockExpect.utils.printReceived(
          "Identifier 'snake_case' is not in camel case.",
        )}`,
        'Received code:',
        mockExpect.utils.RECEIVED_COLOR(CAMELCASE_ERROR_CASE.code),
      ].join('\n'),
      pass: false,
    };

    assertMatcherResultEquals(received, expected);
  });
});
