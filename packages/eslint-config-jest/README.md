# @kael89/eslint-config-jest

_ESLint configuration for projects using `jest`_

This the base [ESLint](https://eslint.org/) configuration I use in personal projects that use `jest`.

## Installation

1. Install the package and its peer dependencies:

```bash
yarn add -D @kael89/eslint-config-jest eslint prettier
```

2. Extend this package in your [ESLint configuration](https://eslint.org/docs/user-guide/configuring):

```json
{
  "eslintConfig": {
    "extends": "@kael89/jest"
  }
}
```
