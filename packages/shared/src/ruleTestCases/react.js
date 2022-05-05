const { RuleSeverity } = require('@kael89/eslint-utils');

/**
 * Data structure inspired by https://eslint.org/docs/developer-guide/nodejs-api#ruletester
 */
const reactTestCases = {
  'react-hooks/exhaustive-deps': {
    severity: RuleSeverity.Error,
    valid: [
      {
        name: 'no dependencies used, no dependency array',
        code: `
          const CustomComponent = () => {
            useEffect(() => {
              console.log();
            });
          };
        `,
      },
      {
        name: 'no dependencies used, empty dependency array',
        code: `
          const CustomComponent = () => {
            useEffect(() => {
              console.log();
            }, []);
          };
        `,
      },
      {
        name: 'dependencies are used, no dependency array',
        code: `
          const CustomComponent = ({ text }) => {
            useEffect(() => {
              console.log(text);
            });
          };
        `,
      },
      {
        name: 'all dependencies are listed in the dependency array',
        code: `
          const CustomComponent = ({ text }) => {
            useEffect(() => {
              console.log(text);
            }, [text]);
          };
        `,
      },
    ],
    invalid: [
      {
        name: 'dependencies are used, empty dependency array',
        code: `
          const CustomComponent = ({ text }) => {
            useEffect(() => {
              console.log(text);
            }, []);
          };
        `,
        message:
          "React Hook useEffect has a missing dependency: 'text'. Either include it or remove the dependency array.",
      },
      {
        name: 'some dependencies are not listed in the dependency array',
        code: `
          const CustomComponent = ({ text, name }) => {
            useEffect(() => {
              console.log(text, name);
            }, [text]);
          };
        `,
        message:
          "React Hook useEffect has a missing dependency: 'name'. Either include it or remove the dependency array.",
      },
    ],
  },
  'react-hooks/rules-of-hooks': {
    severity: RuleSeverity.Error,
    valid: [
      {
        name: 'React hook called from component',
        code: `
          const CustomComponent = () => {
            useEffect(() => {});
          };
        `,
      },
      {
        name: 'React hook called from custom hook',
        code: `
          const useHook = () => {
            useEffect(() => {});
          };
        `,
      },
    ],
    invalid: [
      {
        name: 'React hook not called from component or custom hook',
        code: `
          const foo = () => {
            useEffect(() => {});
          };
        `,
        message:
          'React Hook "useEffect" is called in function "foo" that is neither a React function component nor a custom React Hook function. React component names must start with an uppercase letter. React Hook names must start with the word "use".',
      },
    ],
  },
  'react/function-component-definition': {
    valid: [
      {
        name: 'arrow function component',
        code: 'const Component = () => <div/>',
      },
    ],
  },
  'react/jsx-boolean-value': {
    severity: RuleSeverity.Error,
    valid: [
      {
        name: '`true` value is not used',
        code: '<Component isEnabled></Component>',
      },
      {
        name: '`false` value is used',
        code: '<Component isEnabled={false}></Component>',
      },
    ],
    invalid: [
      {
        name: '`true` value is used',
        code: '<Component isEnabled={true}></Component>',
      },
    ],
  },
  'react/jsx-no-duplicate-props': {
    severity: RuleSeverity.Error,
    valid: [
      {
        name: 'props are unique',
        code: '<Component alpha="a" beta="b" />',
      },
    ],
    invalid: [
      {
        name: 'props is duplicated (same case)',
        code: '<Component alpha="a" alpha="a" />',
      },
      {
        name: 'props is duplicated (different case)',
        code: '<Component alpha="a" Alpha="a" />',
      },
    ],
  },
  'react/jsx-no-literals': {
    valid: [
      {
        name: 'Unwrapped string',
        code: '<div>test</div>',
      },
      {
        name: 'Wrapped string',
        code: "<div>{'test'}</div>",
      },
    ],
  },
  'react/jsx-props-no-spreading': {
    valid: [
      {
        name: 'props spreading',
        code: 'const AllowPropsSpreading = props => <a {...props}>link</a>;',
      },
    ],
  },
  'react/jsx-uses-vars': {
    valid: [
      {
        name: 'component is assigned to a variable which is used',
        code: `
          const Alpha = () => <div />;

          const Beta = () => <div><Alpha /></div>
        `,
      },
    ],
  },
  'react/no-danger': {
    severity: RuleSeverity.Warning,
    valid: [
      {
        name: 'no dangerous props',
        code: '<div>Hello World</div>',
      },
    ],
    invalid: [
      {
        name: 'dangerous prop',
        code: '<div dangerouslySetInnerHTML={{ __html: "Hello World" }} />',
      },
    ],
  },
  'react/no-deprecated': {
    severity: RuleSeverity.Error,
    valid: [
      {
        name: 'no deprecated methods are used',
        code: `
          class Component extends React.Component {
            render() {}
          }
        `,
      },
    ],
    invalid: [
      {
        name: 'componentWillMount()',
        code: `
          class Component extends React.Component {
            componentWillMount() {}
          }
        `,
      },
      {
        name: 'componentWillReceiveProps()',
        code: `
          class Component extends React.Component {
            componentWillReceiveProps() {}
          }
        `,
      },
      {
        name: 'componentWillUpdate()',
        code: `
        class Component extends React.Component {
            componentWillUpdate() {}
          }
        `,
      },
    ],
  },
  'react/no-invalid-html-attribute': {
    severity: RuleSeverity.Error,
    valid: [
      {
        name: 'valid html attribute',
        code: 'const Component = () => <a rel="noreferrer" />',
      },
    ],
    invalid: [
      {
        name: 'invalid html attribute',
        code: 'const Component = () => <a rel="invalid" />',
      },
    ],
  },
  'react/no-unused-class-component-methods': {
    severity: RuleSeverity.Error,
    valid: [
      {
        name: 'all methods are used',
        code: `
          class Hello extends React.Component {
            getContent() {
              return "text";
            }

            render() {
              return <div>{this.getContent()}</div>;
            }
          }
        `,
      },
    ],
    invalid: [
      {
        name: 'a method is unused',
        code: `
          class Hello extends React.Component {
            getContent() {
              return "text";
            }

            render() {
              return <div />;
            }
          }
        `,
      },
    ],
  },
  'react/react-in-jsx-scope': {
    severity: RuleSeverity.Error,
    valid: [
      {
        name: 'React is imported in the component',
        code: `
        import React from 'react';

        const Component = () => <h1>Text</h1>
      `,
      },
    ],
    invalid: [
      {
        name: 'React is not imported in the component',
        code: 'const Component = () => <h1>Text</h1>',
      },
    ],
  },
};

module.exports = { reactTestCases };
