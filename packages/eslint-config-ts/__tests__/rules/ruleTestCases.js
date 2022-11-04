const assert = require('assert');

const { ruleTestCases: sharedTestCases } = require('@kael89/eslint-shared');
const { RuleSeverity } = require('@kael89/eslint-utils');

const { PLACEHOLDER_FILE_TS, PLACEHOLDER_FILE_TSX } = require('./constants');

/**
 * Data structure inspired by https://eslint.org/docs/developer-guide/nodejs-api#ruletester
 */
const baseTestCases = {
  '@typescript-eslint/explicit-member-accessibility': {
    severity: RuleSeverity.Error,
    valid: [
      {
        name: 'all methods have access modifiers',
        code: `
          class Foo {
            public bar() {};

            protected baz() {};

            private buzz() {};
          }
        `,
      },
      {
        name: 'constructor with no access modifier',
        code: `
          class Foo {
            constructor() {};
          }
        `,
      },
      {
        name: 'non public constructor with access modifier',
        code: `
          class Foo {
            private constructor() {};
          }
        `,
      },
    ],
    invalid: [
      {
        name: 'some methods have no access modifier',
        code: `
          class Foo {
            public bar() {};

            baz() {};
          }
        `,
        message: 'Missing accessibility modifier on method definition baz.',
      },
      {
        name: 'all methods have no access modifier',
        code: `
          class Foo {
            bar() {};

            baz() {};
          }
        `,
        message: 'Missing accessibility modifier on method definition bar.',
      },
      {
        name: 'public constructor with access modifier',
        code: `
          class Foo {
            public constructor() {};
          }
        `,
        message: 'Public accessibility modifier on method definition constructor.',
      },
    ],
  },
  '@typescript-eslint/lines-between-class-members': {
    valid: [
      {
        name: 'empty line between class members',
        code: `
          class Foo {
            private readonly bar: string;

            private readonly baz: string;
          }
        `,
      },
      {
        name: 'no empty line between class members',
        code: `
          class Foo {
            private readonly bar: string;
            private readonly baz: string;
          }
        `,
      },
    ],
  },
  '@typescript-eslint/no-non-null-assertion': {
    valid: [
      {
        name: '!. used to access an object property',
        code: 'const x = foo!.bar;',
      },
      {
        name: '!. used to destructure object property',
        code: 'const { field } = foo!;',
      },
    ],
  },
  '@typescript-eslint/no-unused-vars': {
    severity: RuleSeverity.Error,
    valid: [
      {
        name: 'var is used',
        code: `
          let x = 0;
          process.exit(x);
        `,
      },
    ],
    invalid: [
      {
        name: 'var is unused',
        code: 'let x;',
        message: `'x' is defined but never used`,
      },
    ],
  },
  'class-methods-use-this': sharedTestCases['class-methods-use-this'],
  curly: sharedTestCases.curly,
  'func-names': sharedTestCases['func-names'],
  'import/no-default-export': sharedTestCases['import/no-default-export'],
  'import/prefer-default-export': sharedTestCases['import/prefer-default-export'],
  'max-classes-per-file': sharedTestCases['max-classes-per-file'],
  'no-await-in-loop': sharedTestCases['no-await-in-loop'],
  'no-continue': sharedTestCases['no-continue'],
  'no-plusplus': sharedTestCases['no-plusplus'],
  'no-restricted-globals': sharedTestCases['no-restricted-globals'],
  // Rule is enforced by @typescript-eslint/no-unused-vars
  'no-unused-vars': {
    valid: [
      {
        name: 'var is used',
        code: `
          let x = 0;
          process.exit(x);
        `,
      },
      {
        name: 'var is unused',
        code: 'let x;',
      },
    ],
  },
  'no-restricted-syntax': sharedTestCases['no-restricted-syntax'],
  'no-use-before-define': sharedTestCases['no-use-before-define'],
  radix: sharedTestCases.radix,
  'react-hooks/exhaustive-deps': sharedTestCases['react-hooks/exhaustive-deps'],
  'react-hooks/rules-of-hooks': sharedTestCases['react-hooks/rules-of-hooks'],
  'react/function-component-definition': sharedTestCases['react/function-component-definition'],
  'react/jsx-boolean-value': sharedTestCases['react/jsx-boolean-value'],
  'react/jsx-no-duplicate-props': sharedTestCases['react/jsx-no-duplicate-props'],
  'react/jsx-no-literals': sharedTestCases['react/jsx-no-literals'],
  'react/jsx-props-no-spreading': sharedTestCases['react/jsx-props-no-spreading'],
  'react/jsx-uses-vars': sharedTestCases['react/jsx-uses-vars'],
  'react/no-danger': sharedTestCases['react/no-danger'],
  'react/no-deprecated': sharedTestCases['react/no-deprecated'],
  'react/no-invalid-html-attribute': sharedTestCases['react/no-invalid-html-attribute'],
  'react/no-unused-class-component-methods':
    sharedTestCases['react/no-unused-class-component-methods'],
  'react/prop-types': {
    valid: [
      {
        name: 'prop types are provided',
        code: `
          const CustomComponent = ({ text }) => <a>{text}</a>;

          CustomComponent.propTypes = {
            text: PropTypes.string.isRequired,
          };
        `,
      },
      {
        name: 'prop types are missing',
        code: `const CustomComponent = ({ text }) => <a>{text}</a>;`,
      },
    ],
  },
  'react/react-in-jsx-scope': sharedTestCases['react/react-in-jsx-scope'],
  'react/require-default-props': {
    valid: [
      {
        name: 'default values are provided for not required props',
        code: `
          const CustomComponent = ({ text }) => <a>{text}</a>;

          CustomComponent.propTypes = {
            text: PropTypes.string,
          };

          CustomComponent.defaultProps = {
            text: '',
          };
        `,
      },
      {
        name: 'default props are not provided for not required props',
        code: `
          const CustomComponent = ({ text }) => <a>{text}</a>;

          CustomComponent.propTypes = {
            text: PropTypes.string,
          };
      `,
        message:
          'propType "text" is not required, but has no corresponding defaultProps declaration.',
      },
      {
        name: 'default values are provided for required props',
        code: `
          const CustomComponent = ({ text }) => <a>{text}</a>;

          CustomComponent.propTypes = {
            text: PropTypes.string.isRequired,
          };

          CustomComponent.defaultProps = {
            text: '',
          };
        `,
        message: 'propType "text" is required and should not have a defaultProps declaration.',
      },
    ],
  },
  'simple-import-sort/imports': sharedTestCases['simple-import-sort/imports'],
};

/**
 * The TS parser that we use (`@typescript-eslint/eslint-plugin`) can only lint code snippets when
 * a `filePath` is specified. This function adds a placeholder (empty) file path in every rule
 * test case that lacks one in order to enable TS linting.
 */
const fillEmptyFilePathsWithPlaceholders = ruleTests => {
  const newEntries = Object.entries(ruleTests).map(([ruleId, ruleTest]) => {
    const newRuleTest = { ...ruleTest };

    const filePath = ruleId.startsWith('react/') ? PLACEHOLDER_FILE_TSX : PLACEHOLDER_FILE_TS;
    if (newRuleTest.valid) {
      newRuleTest.valid = newRuleTest.valid.map(testCase => ({ filePath, ...testCase }));
    }
    if (newRuleTest.invalid) {
      newRuleTest.invalid = newRuleTest.invalid.map(testCase => ({
        filePath,
        ...testCase,
      }));
    }

    return [ruleId, newRuleTest];
  });

  return Object.fromEntries(newEntries);
};

module.exports = {
  ruleTestCases: fillEmptyFilePathsWithPlaceholders(baseTestCases),
};
