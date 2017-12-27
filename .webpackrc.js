/**
 * Created by GaoBo on 2017/12/26.
 *
 * Config files for roadhog@2.0 / af-webpack.
 */
// TODO framework: use themes like this. system independent.
const theme = require('./theme.config');
const { version } = require('./package.json');
const path = require('path');

console.log("*** Use .webpackrc.js");

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

  devtool: '#source-map',


  // proxy: {
  //   "/api": {
  //     "target": "http://jsonplaceholder.typicode.com/",
  //     "changeOrigin": true,
  //     "pathRewrite": { "^/api": "" }
  //   }
  // },

  // "externals": {
  //   "react": "window.React",
  //   "react-dom": "window.ReactDOM"
  // },

  "extraBabelPlugins": [
    "@babel/plugin-transform-runtime",
    "eslint-disable",
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


//   "@primary-color": "#dc6aaA",
//     "@link-color": "#dc6aac",
//     "@border-radius-base": "2px",
//     "@font-size-base": "16px",
//     "@line-height-base": "1.2"
