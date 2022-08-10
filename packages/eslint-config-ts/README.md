# @kael89/eslint-config-ts

_ESLint configuration for TypeScript projects_

This the base [ESLint](https://eslint.org/) configuration I use in personal TypeScript projects:

- ✔ Extends the popular [Airbnb Style Guide](https://github.com/airbnb/javascript)
- ✔ Uses [Prettier](https://prettier.io/) for code formatting
- ✔ Provides additional linting for [React](https://reactjs.org/)

## Installation

1. Install the package and its peer dependencies:

```bash
yarn add -D @kael89/eslint-config-ts eslint prettier
```

2. Extend this package in your [ESLint configuration](https://eslint.org/docs/user-guide/configuring):

```json
{
  "eslintConfig": {
    "extends": "@kael89/ts"
  }
}
```

**Note:** If you are using the [new JSX transform](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html) from React 17, use `react/jsx-runtime` to disable some relevant rules. See [eslint-plugin-react](https://www.npmjs.com/package/eslint-plugin-react):

```json
{
  "eslintConfig": {
    "extends": ["@kael89/ts", "plugin:react/jsx-runtime"]
  }
}
```

## Gotchas

### Non standard tsconfig.json paths

If you use a TS configuration file other than the default (`tsconfig.json` under the project's root), you need to specify its path:

```json
{
  "eslintConfig": {
    "parserOptions": {
      "project": "./packages/my-ts-package/tsconfig.dev.json"
    }
  }
}
```

### React >= 17

If you are using the [new JSX transform](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html) from React 17, extend `react/jsx-runtime` in your eslint config (add "plugin:react/jsx-runtime" to "extends") to disable the relevant rules. See [eslint-plugin-react](https://www.npmjs.com/package/eslint-plugin-react) for more information.

### Extraneous dependencies in tests

[import/no-extraneous-dependencies](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-extraneous-dependencies.md) will complain if dependencies used in tests are specified as `devDependencies`. This is a false positive, and we can use the following configuration to avoid it:

```json
{
  "rules": {
    "import/no-extraneous-dependencies": [
      "error",
      {
        "devDependencies": ["**/__tests__/**"],
        "packageDir": [".", "../../"]
      }
    ]
  }
}
```

- `devDependencies`: a pattern that matches our test files
- `packageDir`: a list of paths where `package.json` files will be loaded from (optional)

The exact configuration will depend on your setup.

> **Tip**: If you are using VSCode to open a **monorepo**, you may get better linting results for rules that need to scan the project upwards if you load it as a [multi-root workspace](https://code.visualstudio.com/docs/editor/workspaces#_multiroot-workspaces). You can then use `"packageDir": [".", "../../"]` in your eslint config to load dependencies from both the current workspace and the root `package.json`.

### @typescript-eslint/indent issue

If you get the following error:

> Configuration for rule "@typescript-eslint/indent" is invalid

it is a known [eslint-config-airbnb-typescript issue](https://github.com/iamturns/eslint-config-airbnb-typescript/issues/98#issuecomment-665317214), see that link for possible solutions.
