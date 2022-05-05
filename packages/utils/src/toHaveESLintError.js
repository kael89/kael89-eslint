const { lintText } = require('./lintText');

async function toHaveESLintError(receivedText, eslint, ruleId, options = {}) {
  const { severity, message, filePath } = options;
  const { fatalErrorCount, messages } = await lintText(eslint, receivedText, { filePath });

  if (fatalErrorCount > 0) {
    const { message: fatalError } = messages.find(({ fatal }) => fatal);
    throw new Error(`Fatal ESLint error: ${fatalError}`);
  }

  const buildResultMessage = (expectedMessage, receivedMessage) => {
    const matcherHint = this.utils.matcherHint(
      'toHaveESLintError',
      'received',
      Object.keys(trimLastUndefinedEntries({ ruleId, severity, message })).join(', '),
      { isNot: this.isNot },
    );

    const resultMessage = [
      matcherHint,
      '',
      ...[expectedMessage, receivedMessage].filter(x => !!x),
      'Received code:',
      this.utils.RECEIVED_COLOR(receivedText),
    ].join('\n');

    return () => resultMessage;
  };

  // Use the first matching error
  const received = messages.find(msg => msg.ruleId === ruleId);
  if (!received) {
    return {
      message: buildResultMessage(
        `Expected ESLint error for rule ${this.utils.printExpected(ruleId)}`,
      ),
      pass: false,
    };
  }

  if (message !== undefined && message !== received.message) {
    try {
      // eslint-disable-next-line jest/no-standalone-expect
      expect(received.message).toMatch(message);
    } catch (error) {
      return {
        message: buildResultMessage(
          `Expected message: ${this.utils.printExpected(message)}`,
          `Received message: ${this.utils.printReceived(received.message)}`,
        ),
        pass: false,
      };
    }
  }

  if (severity !== undefined && severity !== received.severity) {
    return {
      message: buildResultMessage(
        `Expected severity: ${this.utils.printExpected(severity)}`,
        `Received severity: ${this.utils.printReceived(received.severity)}`,
      ),
      pass: false,
    };
  }

  return {
    message: buildResultMessage(
      `Expected no ESLint error for rule ${this.utils.printReceived(ruleId)}`,
      `Received error: ${this.utils.printReceived(received.message)}`,
    ),
    pass: true,
  };
}

const trimLastUndefinedEntries = object => {
  const values = Object.values(object);
  let rightLimit = values.length - 1;
  while (values[rightLimit] === undefined) {
    rightLimit--;
  }

  return Object.fromEntries(Object.entries(object).slice(0, rightLimit + 1));
};

module.exports = { toHaveESLintError };
