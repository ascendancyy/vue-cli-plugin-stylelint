/* eslint
  no-param-reassign: ["error", {
    "props": true,
    "ignorePropertyModificationsFor": ["args"]
  }],
  no-console: "off"
*/

const { execSync } = require('child_process');
const chalk = require('chalk');
const stylelint = require('stylelint');
const CodeframeFormatter = require('stylelint-codeframe-formatter');


// helpers ==========================
function camelize(str) {
  return str.replace(/-(\w)/g, (_, c) => (
    c ?
      c.toUpperCase() :
      ''
  ));
}

function normalizeConfig(args) {
  const config = {};
  Object.keys(args).forEach((key) => {
    if (key !== '_') {
      config[camelize(key)] = args[key];
    }
  });
  return config;
}

function format(label, msg) {
  let lines = msg.split('\n');
  lines = lines.map((line, idx) => (
    idx === 0 ?
      `${label} ${line}` :
      line.padStart(chalk.reset(label).length)
  ));

  return lines.join('\n');
}
// ==================================


module.exports = async function lint(api, args = {}) {
  if (args.options) {
    execSync('stylelint --help', { stdio: 'inherit' });
    return;
  }

  const cwd = api.resolve('.');

  const files = args._ && args._.length ? args._ : ['src/**/*.{vue,htm,html,css,sss,less,scss}'];
  if (args['no-fix']) {
    args.fix = false;
    delete args['no-fix'];
  }

  const { formatter } = args;
  if (
    formatter &&
    typeof formatter === 'string' &&
    !(['json', 'string', 'verbose'].includes(formatter))
  ) {
    try {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      args.formatter = require(formatter);
    } catch (e) {
      delete args.formatter;
      console.log(format(
        chalk`{bgYellow.black  WARN }`,
        chalk`${e.toString()}\n{yellow Using codeframe formatter}`,
      ));
    }
  }

  const options = Object.assign({}, {
    configBasedir: cwd,
    fix: true,
    files,
    formatter: CodeframeFormatter,
  }, normalizeConfig(args));

  try {
    const { errored, results, output: formattedOutput } = await stylelint.lint(options);
    if (!errored) {
      if (!args.silent) {
        const hasWarnings = results.some((result) => {
          if (result.ignored) {
            return null;
          }
          return result.warnings.some(warning => warning.severity === 'warning');
        });
        if (hasWarnings) {
          console.log(formattedOutput);
        } else {
          console.log(format(
            chalk`{bgGreen.black  DONE }`,
            `No stylelint errors found!${options.fix ? chalk` {blue (autofix enabled)}` : ''}`,
          ));
        }
      }
    } else {
      console.log(formattedOutput);
      process.exit(1);
    }
  } catch (err) {
    console.log(format(
      chalk`{bgRed.black  ERROR }`,
      err.stack.slice(' Error:'.length),
    ));
    process.exit(1);
  }
};
