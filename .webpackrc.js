/**
 * Created by GaoBo on 2017/12/26.
 *
 * Config files for roadhog@2.0 / af-webpack.
 */
const theme = require('./theme.config');
const buildrc = require('./.buildrc');
const path = require('path');
// const { version } = require('./package.json');

// do some other startup before webpack.
require('./bin/generate-system');

// TODO debug mode  /  production mode
const production = (process.env.NODE_ENV === 'production');

// TODO umi
module.exports = {

  // entry: 'src/index.js',

  theme: theme(),
  alias: buildrc.webpack.alias,

  // publicPath: `/${version}/`,
  // publicPath: `/`,
  // outputPath: path.resolve(__dirname, `./dist`),
  // outputPath: path.resolve(__dirname, `./dist/${version}`),

  // devtool: production ? false : 'cheap-module-eval-source-map',

  extraBabelPlugins: [
    "transform-decorators-legacy",
    ["import", { libraryName: "antd", style: true }]
  ],

  env: {
    development: {
      extraBabelPlugins: ["dva-hmr"]
    }
  },


  // html: {
  //   template: "./src/index.ejs",
  //   // hash: production,
  //   title: "AMiner 2b Project",
  // },
  // hash: production,

  // proxy: {
  //   "/api": {
  //     "target": "http://jsonplaceholder.typicode.com/",
  //     "changeOrigin": true,
  //     "pathRewrite": { "^/api": "" }
  //   }
  // },

  // commons: [
  //   {
  //     async: '__common',
  //     children: true,
  //     minChunks(module, count) {
  //       if (pageCount <= 2) {
  //         return count >= pageCount;
  //       }
  //       return count >= pageCount * 0.5;
  //     },
  //   },
  // ],

  // externals: {
  //   "react": "window.React",
  //   "react-dom": "window.ReactDOM",
  // },

  // ignoreMomentLocale: true,

  // copy: [],

};
