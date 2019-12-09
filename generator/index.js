const { chalk } = require('@vue/cli-shared-utils');
const lint = require('../lint');

module.exports = (api, options = {}) => {
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
    devDependencies: {
      stylelint: '^9.0.0',
      'stylelint-codeframe-formatter': '^1.0.4',
      'stylelint-webpack-plugin': '^1.1.2',
    },
    vue: {
      pluginOptions: {
        lintStyleOnBuild: lintStyleOn.includes('build'),
        stylelint: {},
      },
    },
    stylelint: {
      root: true,
    },
  };

  const { config = 'stylelint-config-standard' } = options;
  if (typeof config === 'string' || Array.isArray(config)) {
    pkg.stylelint.extends = config;
    if (typeof config === 'string') {
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
    }
  } else {
    Object.assign(pkg.stylelint, config);
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

  api.render('./template');
  api.addConfigTransform('stylelint', {
    file: {
      js: ['.stylelintrc.js', 'stylelint.config.js'],
      json: ['.stylelintrc', '.stylelintrc.json'],
      yaml: ['.stylelintrc.yaml', '.stylelintrc.yml'],
    },
  });
  api.extendPackage(pkg);

  api.onCreateComplete(async () => { await lint(api, { silent: true }); });
};
