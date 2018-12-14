const generateWithPlugin = require('@vue/cli-test-utils/generateWithPlugin');

test('default', async () => {
  const { pkg } = await generateWithPlugin({
    id: '@ascendancyy/vue-cli-plugin-stylelint',
    apply: require('../generator'),
    options: {},
  });

  expect(pkg.scripts['lint:style']).toBeTruthy();
  expect(pkg.devDependencies).toHaveProperty('stylelint-config-standard');
});

test('standard', async () => {
  const { pkg } = await generateWithPlugin({
    id: '@ascendancyy/vue-cli-plugin-stylelint',
    apply: require('../generator'),
    options: {
      config: 'stylelint-config-standard',
    },
  });

  expect(pkg.scripts['lint:style']).toBeTruthy();
  expect(pkg.devDependencies).toHaveProperty('stylelint-config-standard');
});

test('primer', async () => {
  const { pkg } = await generateWithPlugin({
    id: '@ascendancyy/vue-cli-plugin-stylelint',
    apply: require('../generator'),
    options: {
      config: 'stylelint-config-primer',
    },
  });

  expect(pkg.scripts['lint:style']).toBeTruthy();
  expect(pkg.devDependencies).toHaveProperty('stylelint-config-primer');
});

test('kanbaru', async () => {
  const { pkg } = await generateWithPlugin({
    id: '@ascendancyy/vue-cli-plugin-stylelint',
    apply: require('../generator'),
    options: {
      config: '@ascendancyy/stylelint-config-kanbaru',
    },
  });

  expect(pkg.scripts['lint:style']).toBeTruthy();
  expect(pkg.devDependencies).toHaveProperty('@ascendancyy/stylelint-config-kanbaru');
});

test('lint on save', async () => {
  const { pkg } = await generateWithPlugin({
    id: '@ascendancyy/vue-cli-plugin-stylelint',
    apply: require('../generator'),
    options: {
      lintStyleOn: 'build',
    },
  });
  expect(pkg.vue.pluginOptions).toEqual({ lintStyleOnBuild: true, stylelint: {} });
});

test('lint on commit', async () => {
  const { pkg } = await generateWithPlugin({
    id: '@ascendancyy/vue-cli-plugin-stylelint',
    apply: require('../generator'),
    options: {
      lintStyleOn: 'commit',
    },
  });
  expect(pkg.gitHooks['pre-commit']).toBe('lint-staged');
  expect(pkg.devDependencies).toHaveProperty('lint-staged');
  expect(pkg['lint-staged']).toEqual({
    '*.{vue,htm,html,css,sss,less,scss}': ['vue-cli-service lint:style', 'git add'],
  });
  expect(pkg.vue.pluginOptions).toEqual({ lintStyleOnBuild: false, stylelint: {} });
});

test('cancel', async () => {
  const { pkg } = await generateWithPlugin({
    id: '@ascendancyy/vue-cli-plugin-stylelint',
    apply: require('../generator'),
    options: {
      overwriteConfig: 'abort',
    },
  });

  expect(pkg).toEqual({
    scripts: undefined,
    devDependencies: undefined,
    vue: undefined,
  });
});
