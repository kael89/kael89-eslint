This folder contains empty files whose paths are used by the tests. Because of [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/) limitations, when using the [Node.js API](https://eslint.org/docs/developer-guide/nodejs-api/) with that plugin, we need the following:

- A [TypeScript config](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) file
- Code snippets to be linted must use the [filePath](https://eslint.org/docs/developer-guide/nodejs-api#-eslintlinttextcode-options) option
- The referenced filepaths **must exist**, even if the code to be linted is provided directly and not loaded from those files
