#!/usr/bin/env ts-node

const chalk = require('chalk');
const { execSync } = require('child_process');
const fsPromises = require('fs/promises');
const glob = require('glob');
const { relative } = require('path');

const IGNORE_FILE = '.gitignore';
const PACKAGE_ROOT = 'packages';

const run = async () => {
  const lintTargets = await findLintTargets();

  let failedTargets = 0;
  lintTargets.forEach(lintTarget => {
    logInfo(`\nLinting ${lintTarget.name}...`);
    const newErrors = lint(lintTarget);
    if (newErrors.length > 0) {
      failedTargets++;
    }
  });

  if (failedTargets > 0) {
    const locationStr = failedTargets === 1 ? 'targets' : 'targets';
    logError(`\nLinting failed for ${failedTargets} ${locationStr}`);
  }
};

const findLintTargets = async () => {
  const rootFolderIgnores = await parseIgnoreFile(IGNORE_FILE);
  rootFolderIgnores.push(PACKAGE_ROOT);

  const rootLintTargets = glob.sync('*/', { ignore: rootFolderIgnores }).map(folder => ({
    name: `<root>/${folder}`,
    lintRoot: '.',
    path: `./${folder}`,
  }));

  const packageLintTargets = await Promise.all(
    glob.sync(`${PACKAGE_ROOT}/*/package.json`).map(async filePath => {
      const contents = await readFile(filePath);
      const { name } = JSON.parse(contents);
      const path = filePath.replace(/\/package.json$/, '');

      return {
        name,
        lintRoot: path,
        path,
      };
    }),
  );

  return [...rootLintTargets, ...packageLintTargets];
};

/**
 * @returns An array of glob ignore patterns listed in the specified file
 */
const parseIgnoreFile = async path => {
  const contents = await readFile(path);
  // Note: negations (patterns starting with "!") are ignored since this messes up with `glob`
  return contents.split('\n').filter(x => x && !x.startsWith('!'));
};

const lint = ({ lintRoot, path }) => {
  const errors = [];

  const runCommand = command => {
    try {
      execSync(command, { cwd: lintRoot, stdio: 'inherit' });
    } catch (error) {
      logError(`${error.message}\n`);
      errors.push(error);
    }
  };
  const joinPaths = (...pathParts) => pathParts.filter(x => x).join('/');

  const toLintRoot = relative(lintRoot, path);
  const toProjectRoot = relative(lintRoot, process.cwd());

  const lintPattern = joinPaths(toLintRoot, '**/*.{js,jsx}');
  const ignorePath = joinPaths(toProjectRoot, IGNORE_FILE);

  runCommand(`eslint '${lintPattern}' --ignore-path '${ignorePath}'`);

  return errors;
};

const readFile = async path => fsPromises.readFile(path, { encoding: 'utf-8' });

const logInfo = message => console.info(chalk.blueBright(message));

const logError = message => console.error(chalk.red(message));

run()
  .then(() => {
    process.exit(0);
  })
  .catch(err => {
    logError(err);
    process.exit(1);
  });
