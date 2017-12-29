/**
 * Created by GaoBo on 2017/12/26.
 *
 * Config files for roadhog@2.0 / af-webpack.
 */
const theme = require('./theme.config');
// const { version } = require('./package.json');
// const path = require('path');

// require('./bin/generate-system'); // TODO SSR

// TODO debug mode  /  production mode

// noinspection WebpackConfigHighlighting
module.exports = {
  theme: theme(),

  // entry: 'src/index.js',
  // entry: {
  //   index: './src/index.js',
  // },

  // publicPath: `/${version}/`,
  // outputPath: path.resolve(__dirname, `./dist/${version}`),

  // devtool: '#source-map',


  proxy: {
    "/api": {
      "target": "http://jsonplaceholder.typicode.com/",
      "changeOrigin": true,
      "pathRewrite": { "^/api": "" }
    }
  },

  // "externals": {
  //   "react": "window.React",
  //   "react-dom": "window.ReactDOM"
  // },

  "extraBabelPlugins": [
    // "add-module-exports", // 不好使呀这东西
    "@babel/plugin-transform-runtime",
    // "eslint-disable",
    // "transform-decorators-legacy",
    ["import", { "libraryName": "antd", "style": true }]
  ],
  "env": {
    "development": {
      "extraBabelPlugins": [
        "dva-hmr"
      ]
    }
  }
};
