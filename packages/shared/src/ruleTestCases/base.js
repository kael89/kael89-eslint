const { RuleSeverity } = require('@kael89/eslint-utils');

/**
 * Data structure inspired by https://eslint.org/docs/developer-guide/nodejs-api#ruletester
 */
const baseTestCases = {
  'class-methods-use-this': {
    valid: [
      {
        name: 'class using `this`',
        code: `
          class Class {
            bar() {}
          }
        `,
      },
    ],
  },
  curly: {
    severity: RuleSeverity.Error,
    valid: [
      {
        name: 'curly braces are used',
        code: `
          if (true) {
            console.log('true');
          }
        `,
      },
    ],
    invalid: [
      {
        name: 'curly braces are not used',
        code: "if (true) console.log('true');",
        message: "Expected { after 'if' condition.",
      },
    ],
  },
  'func-names': {
    severity: RuleSeverity.Warning,
    valid: [
      {
        name: 'named function',
        code: `
          const foo = {
            bar: function bar() {}
          }
        `,
      },
      {
        name: 'function name can be inferred',
        code: `
          const foo = {
            bar: function () {}
          }
        `,
      },
    ],
    invalid: [
      {
        name: 'function name cannot be inferred',
        code: 'Foo.prototype.bar = function() {};',
        message: 'Unexpected unnamed function.',
      },
    ],
  },
  'import/no-default-export': {
    severity: RuleSeverity.Warning,
    valid: [
      {
        name: 'named export',
        code: 'export const func = () => {};',
      },
    ],
    invalid: [
      {
        name: 'export default expression',
        code: 'export default () => {};',
        message: 'Prefer named exports.',
      },
      {
        name: 'export default variable',
        code: `
          const foo = () => {};
          export default foo;
        `,
        message: 'Prefer named exports.',
      },
      {
        name: 'export variable as default',
        code: `
          const foo = () => {};
          export { foo as default };
        `,
        message: 'Do not alias `foo` as `default`. Just export `foo` itself instead.',
      },
    ],
  },
  'import/prefer-default-export': {
    valid: [
      {
        name: 'named export',
        code: 'export const func = () => {};',
      },
    ],
  },
  'max-classes-per-file': {
    valid: [
      {
        name: 'allows multiple classes in the same file',
        code: `
          class Foo {};

          class Bar{};
        `,
      },
    ],
  },
  'no-await-in-loop': {
    valid: [
      {
        name: 'allows `await` in loops',
        code: `
          const foo = async () => {
            for (let i = 0; i < 10; i++) {
              await test();
            }
          };
        `,
      },
    ],
  },
  'no-continue': {
    valid: [
      {
        name: '`continue` is used',
        code: `
          for (let i = 0; i < 1; i++) {
            if (i > 1) {
              continue;
            }
          }
        `,
      },
    ],
  },
  'no-plusplus': {
    valid: [
      {
        name: '++ is used',
        code: `
        for (let i = 0; i < 1; i++) {
          if (i > 1) {
            continue;
          }
        }
      `,
      },
      {
        name: '-- is used',
        code: 'for (let i = 1; i > 0; i--) {}',
      },
    ],
  },
  'no-restricted-globals': {
    valid: [
      {
        name: 'isNaN()',
        code: 'isNaN(1);',
      },
      {
        name: 'isFinite()',
        code: 'isFinite(1);',
      },
    ],
  },
  'no-restricted-syntax': {
    severity: RuleSeverity.Error,
    valid: [
      {
        name: 'for-of loop',
        code: `for (const item of [1, 2]) {}`,
      },
    ],
    invalid: [
      {
        name: 'for-in loop',
        code: 'for (const key in {}) {}',
        message: 'for..in loops iterate over the entire prototype chain',
      },
      {
        name: 'labeled statement',
        code: `
          loop1:
          for (let i = 0; i < 5; i++) {
            if (i === 1) {
              continue loop1;
            }
            str = str + i;
          }
        `,
        message: 'Labels are a form of GOTO',
      },
    ],
  },
  'no-use-before-define': {
    valid: [
      {
        name: 'value is used before it is defined',
        code: `
          const main = () => dependency();
          const dependency = () => {};
        `,
      },
    ],
  },
  radix: {
    valid: [
      {
        name: '`parseInt()` is called with no radix',
        code: `const int = parseInt('10');`,
      },
    ],
  },
  'simple-import-sort/imports': {
    severity: RuleSeverity.Warning,
    valid: [
      {
        name: 'sorted external imports',
        code: `
          import ESLint from 'eslint';
          import React from 'react';
        `,
      },
      {
        name: 'sorted internal imports',
        code: `
          import zed from '../../zeb';
          import zebra from '../../zebra';
          import beat from '../bear';
          import cat from '../cat';
          import ant from './ant';
        `,
      },
      {
        name: 'sorted external and internal imports',
        code: `
          import ESLint from 'eslint';
          import React from 'react';

          import zed from '../../zeb';
          import ant from './ant';
        `,
      },
      {
        name: 'sorted destructured external imports',
        code: `import { ESLint, RuleTester } from '../eslint';`,
      },
      {
        name: 'sorted destructured internal imports',
        code: `import { cat, PAW, Paw, paws} from '../cat';`,
      },
    ],
    invalid: [
      {
        name: 'no blank line between external and internal imports',
        code: `
          import ESLint from 'eslint';
          import zebra from './zebra';
        `,
        message: 'sort these imports',
      },
      {
        name: 'internal imports before external',
        code: `
          import ant from './ant';

          import ESLint from 'eslint';
        `,
        message: 'sort these imports',
      },
      {
        name: 'unsorted external imports',
        code: `
          import React from 'react';
          import ESLint from 'eslint';
        `,
        message: 'sort these imports',
      },
      {
        name: 'unsorted internal imports',
        code: `
        import ant from './ant';
          import zed from '../../zeb';
        `,
        message: 'sort these imports',
      },
      {
        name: 'unsorted destructured external imports',
        code: `import { RuleTester, ESLint } from '../eslint';`,
        message: 'sort these imports',
      },
      {
        name: 'unsorted destructured internal imports',
        // "PAW" should be placed before "Paw" (uppercase before lowercase)
        code: `import { cat, Paw, PAW, paws} from '../cat';`,
        message: 'sort these imports',
      },
    ],
  },
};

module.exports = { baseTestCases };
