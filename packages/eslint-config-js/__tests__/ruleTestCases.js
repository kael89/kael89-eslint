const { ruleTestCases: sharedTestCases } = require('@kael89/eslint-shared');
const { RuleSeverity } = require('@kael89/eslint-utils');

/**
 * Data structure inspired by https://eslint.org/docs/developer-guide/nodejs-api#ruletester
 */
const ruleTestCases = {
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
  'no-restricted-syntax': sharedTestCases['no-restricted-syntax'],
  'no-unused-vars': {
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
  'no-use-before-define': sharedTestCases['no-use-before-define'],
  radix: sharedTestCases.radix,
  'react-hooks/exhaustive-deps': sharedTestCases['react-hooks/exhaustive-deps'],
  'react-hooks/rules-of-hooks': sharedTestCases['react-hooks/rules-of-hooks'],
  'react/function-component-definition': sharedTestCases['react/function-component-definition'],
  'react/forbid-prop-types': {
    severity: RuleSeverity.Warning,
    valid: [
      {
        name: 'object prop type',
        code: `
        const Heading = ({ data }) => <h1>{data.text}</h1>;

        Heading.propTypes = {
          data: PropTypes.object,
        };
      `,
      },
    ],
    invalid: [
      {
        name: 'any prop type',
        code: `
          const Heading = ({ text }) => <h1>{text}</h1>;

          Heading.propTypes = {
            text: PropTypes.any,
          };
        `,
        message: 'Prop type "any" is forbidden',
      },
    ],
  },
  'react/jsx-boolean-value': sharedTestCases['react/jsx-boolean-value'],
  'react/jsx-filename-extension': {
    severity: RuleSeverity.Error,
    valid: [
      {
        name: 'React component in .jsx file',
        code: `const Heading = () => <h1>Title</h1>;`,
        filePath: 'Heading.jsx',
      },
    ],
    invalid: [
      {
        name: 'React component in .js file',
        code: `const Heading = () => <h1>Title</h1>;`,
        filePath: 'Heading.js',
        message: "JSX not allowed in files with extension '.js'",
      },
    ],
  },
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
    severity: RuleSeverity.Error,
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
    ],
    invalid: [
      {
        name: 'prop types are missing',
        code: `const CustomComponent = ({ text }) => <a>{text}</a>;`,
        message: "'text' is missing in props validation",
      },
    ],
  },
  'react/react-in-jsx-scope': sharedTestCases['react/react-in-jsx-scope'],
  'react/require-default-props': {
    severity: RuleSeverity.Error,
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
    ],
    invalid: [
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

module.exports = { ruleTestCases };
