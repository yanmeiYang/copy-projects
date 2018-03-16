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

module.exports = {

  // entry: 'src/index.js',

  theme: theme(),
  alias: buildrc.webpack.alias,

  publicPath: production ? `/static/` : '',
  // publicPath: `/${version}/`,

  // devtool: production ? false : 'cheap-module-eval-source-map',

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

  extraBabelPlugins: [
    "transform-decorators-legacy",
    ["import", { libraryName: "antd", style: true }]
  ],

  env: {
    development: {
      extraBabelPlugins: ["dva-hmr"],
      copy: [
        {
          from: "public",
          to: "static"
        }
      ]
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
  //   // {
  //   //   async: 'most',
  //   //   children: true,
  //   //   minChunks: 2,
  //   // },
  //   {
  //     names: ['lodash', 'antd'],
  //     async: 'lodash',
  //     // children: true,
  //     minChunks(module, count) {
  //       console.log('module is : ', module, count);
  //       return 1;
  //       // if (pageCount <= 2) {
  //       //   return count >= pageCount;
  //       // }
  //       // return count >= pageCount * 0.5;
  //     },
  //   },
  // ],

  // 有时候链接不好用，所以禁用这个。
  externals: {
    "react": "window.React",
    "react-dom": "window.ReactDOM",
  },

  ignoreMomentLocale: true,

  // copy: [],

};
