// these prompts are used if the plugin is late-installed into an existing
// project and invoked by `vue invoke`.

const inquirer = require('inquirer');
const { chalk, hasGit } = require('@vue/cli-shared-utils');
const { hasStylelintConfig } = require('./utils');

const questions = [
  {
    name: 'config',
    type: 'list',
    message: 'Pick a stylelint config:',
    default: 0,
    when: ({ overwriteConfig }) => (overwriteConfig ? overwriteConfig !== 'abort' : true),
    choices: [
      {
        name: 'Standard',
        value: 'stylelint-config-standard',
        short: 'Standard',
      }, {
        name: 'Primer',
        value: 'stylelint-config-primer',
        short: 'Primer',
      },
      new inquirer.Separator(),
      {
        name: 'Kanbaru',
        value: '@ascendancyy/stylelint-config-kanbaru',
        short: 'Kanbaru',
      },
    ],
  }, {
    name: 'lintStyleOn',
    type: 'checkbox',
    message: 'Pick additional stylelint features:',
    when: ({ overwriteConfig }) => (overwriteConfig ? overwriteConfig !== 'abort' : true),
    choices: [
      {
        name: 'Lint on build',
        value: 'build',
      }, {
        name: `Lint and fix on commit ${hasGit() ? '' : chalk`{red  (requires Git)}`}`,
        value: 'commit',
      },
    ],
  },
];

const cwd = process.cwd();
if (hasStylelintConfig(cwd)) {
  questions.unshift({
    name: 'overwriteConfig',
    type: 'expand',
    message: 'Existing stylelint config found:',
    choices: [
      {
        key: 'y',
        name: 'Overwrite',
        value: 'overwrite',
      }, {
        key: 'x',
        name: 'Cancel setup (Plugin generator will be invoked, but will not make changes)',
        value: 'abort',
      },
    ],
  });
}

module.exports = questions;
