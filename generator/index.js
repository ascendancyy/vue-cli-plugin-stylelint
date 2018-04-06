const chalk = require('chalk');
const lint = require('../lint');

module.exports = (api, options) => {
  const { overwriteConfig } = options;
  if (overwriteConfig === 'abort') {
    api.exitLog(chalk`{yellow Plugin setup successfully cancelled}`, 'warn');
    return;
  }

  let { lintStyleOn = [] } = options;
  if (typeof lintStyleOn === 'string') {
    lintStyleOn = lintStyleOn.split(',');
  }

  const pkg = {
    scripts: {
      'lint:style': 'vue-cli-service lint:style',
    },
    devDependencies: {},
    vue: {
      pluginOptions: {
        lintStyleOnBuild: lintStyleOn.includes('build'),
      },
    },
  };

  const { config = 'stylelint-config-standard' } = options;
  if (config === 'stylelint-config-standard') {
    Object.assign(pkg.devDependencies, {
      'stylelint-config-standard': '^18.2.0',
    });
  } else if (config === 'stylelint-config-primer') {
    Object.assign(pkg.devDependencies, {
      'stylelint-config-primer': '^2.2.5',
    });
  } else if (config === '@ascendancyy/stylelint-config-kanbaru') {
    Object.assign(pkg.devDependencies, {
      '@ascendancyy/stylelint-config-kanbaru': '^1.0.1',
    });
  }

  if (lintStyleOn.includes('commit')) {
    Object.assign(pkg.devDependencies, {
      'lint-staged': '^6.0.0',
    });
    pkg.gitHooks = {
      'pre-commit': 'lint-staged',
    };
    pkg['lint-staged'] = {
      '*.{vue,htm,html,css,sss,less,scss}': ['vue-cli-service lint:style', 'git add'],
    };
  }

  api.render('./template', { config: options.config });
  api.extendPackage(pkg);

  api.onCreateComplete(() => lint(api, { silent: true }));
};
