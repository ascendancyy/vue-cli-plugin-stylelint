/* eslint-disable global-require */

const lint = require('./lint');

module.exports = (api, projectOptions) => {
  const { loadModule } = require('@vue/cli-shared-utils');
  const cwd = api.resolve('.');
  const StyleLintPlugin = loadModule('stylelint-webpack-plugin', cwd, true) || require('stylelint-webpack-plugin');
  const CodeframeFormatter = loadModule('stylelint-codeframe-formatter', cwd, true) || require('stylelint-codeframe-formatter');
  const { pluginOptions: { lintStyleOnBuild, stylelint } } = projectOptions;
  if (lintStyleOnBuild) {
    api.chainWebpack((webpackConfig) => {
      /* eslint-disable indent */
      webpackConfig
        .plugin('stylelint')
          .use(StyleLintPlugin, [Object.assign({
            failOnError: lintStyleOnBuild === 'error',
            files: ['src/**/*.{vue,htm,html,css,sss,less,scss}'],
            formatter: CodeframeFormatter,
          }, stylelint)])
          .end()
        .plugin('friendly-errors')
          .tap(([options]) => {
            ['Transformers', 'Formatters'].forEach((name) => {
              const optKey = `additional${name}`;
              let plugins;
              if (Array.isArray(options[optKey])) {
                plugins = options[optKey];
              } else {
                plugins = [];
                Object.assign(options, { [optKey]: plugins });
              }

              let plugin;
              try {
                const pluginName = name.toLowerCase().slice(0, -1);
                // eslint-disable-next-line global-require
                plugin = require('./stylelintError')[pluginName];
              } catch (e) {
                return;
              }

              plugin && plugins.push(plugin);
            });
            return [options];
          });
      /* eslint-enable indent */
    });
  }

  api.registerCommand('lint:style', {
    description: 'lint and fix source files',
    usage: 'vue-cli-service lint:style [options] [...files]',
    options: {
      '--no-fix': 'do not fix errors',
      '--options': 'display stylelint options',
    },
    details: 'Autofixing is an experimental feature, see https://stylelint.io/user-guide/cli/#autofixing-errors',
  }, (args) => { lint(api, args, stylelint); });
};
