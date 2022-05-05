/* eslint-disable jest/consistent-test-it */
/* eslint-disable jest/no-disabled-tests */

const chalk = require('chalk');
const { execSync } = require('child_process');

const UTILS_PACKAGE = '@kael89/eslint-utils';

const ExitCode = {
  Success: 0,
  Failure: 1,
};

const test = () => {
  try {
    testPackage(UTILS_PACKAGE);
  } catch (error) {
    logError(
      `Tests for the '${UTILS_PACKAGE}' package failed. Bailing since this package contains dependencies for other tests in this monorepo.`,
    );
    process.exit(ExitCode.Failure);
  }

  const packages = [
    '@kael89/eslint-config-jest',
    '@kael89/eslint-config-js',
    '@kael89/eslint-config-ts',
  ];

  const errors = [];
  packages.forEach(pkg => {
    try {
      testPackage(pkg);
      console.log();
    } catch (error) {
      errors.push(error);
    }
  });

  const exitCode = errors.length > 0 ? ExitCode.Failure : ExitCode.Success;
  process.exit(exitCode);
};

const testPackage = pkg => {
  console.log(chalk.blueBright(`\n* Running tests for ${pkg}`));
  execSync(`yarn workspace ${pkg} test`, { stdio: 'inherit' });
};

const logError = message => {
  console.error(chalk.red(message));
};

test();
