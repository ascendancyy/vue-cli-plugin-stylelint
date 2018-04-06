# @ascendancyy/vue-cli-plugin-stylelint

> stylelint plugin for vue-cli

## Injected commands

- **`vue-cli-service lint:style`**

  ```
  Usage: vue-cli-service lint:style [options] [...files]

  Options:

    --no-fix           do not auto-fix errors
    --options          list additional stylelint cli options
  ```

  Lints and fixes files. If no specific files are given, it lints all vue files, html files, and stylesheets in `src`.

## Configuration (stylelint.config.js, .stylelintrc[.*])

Lint on (re)build with `stylelint-webpack-plugin` can be enabled with the `lintStyleOnBuild` option in `vue.config.js`:

``` js
module.exports = {
  // ...
  pluginOptions: {
    lintStyleOnBuild: true
  }
}
```

## Installing in an already created project

```
npm install -D @ascendancyy/vue-cli-plugin-stylelint
vue invoke @ascendancyy/vue-cli-plugin-stylelint
```

> There is also a shorthand to invoke the plugin  
> `vue invoke @ascendancyy/stylelint`

## webpack-chain Injections

- `config.plugin('stylelint')`
- `config.plugin('stylelint').use('stylelint-webpack-plugin')`
- `config.plugin('friendly-errors').tap(/* Adds additional transformer and formatter */)`
