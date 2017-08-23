const path = require('path');
const { defines } = require('./src/define.js');

const svgSpriteDirs = [
  path.resolve(__dirname, 'src/svg/'),
  require.resolve('antd').replace(/index\.js$/, ''),
];

export default {
  "define": defines,

  entry: 'src/index.js',
  svgSpriteLoaderDirs: svgSpriteDirs,

  "theme": "./theme.config.js",

  // "proxy": {
  //   "/api": {
  //     "target": "https://trajectory.aminer.org/",
  //     "changeOrigin": true,
  //     "pathRewrite": { "^/tapi": "" }
  //   }
  // },

  // NOTE: access: request('/tapi/trajecotry/go')

  // disableCSSModules: false,
  // "cssModulesExclude": [],
  // "publicPath": "/",
  // "outputPath": "./dist",
  // "extraPostCSSPlugins": [],
  // "sass": false,
  "hash": true,
  // "autoprefixer": null,
  // "library": null,
  // "libraryTarget": "var",
  // "multipage": false,

  "extraBabelPlugins": [
    "transform-runtime",
    ["import", { "libraryName": "antd", "style": true }]
  ],
  "env": {
    "development": {
      "extraBabelPlugins": [
        "dva-hmr",
        "transform-runtime",
        "transform-decorators-legacy",
        ["import", { "libraryName": "antd", "style": true }]
      ]
    },
    "production": {
      "extraBabelPlugins": [
        "transform-runtime",
        "transform-decorators-legacy",
        ["import", { "libraryName": "antd", "style": true }]
      ]
    }
  },

  "dllPlugin": {
    "exclude": [
      "babel-runtime",
      "antd",
      // "dva",
      // "dva/router",
      // "dva/saga",
    ],
    "include": [
      // "dva/router",
      // "dva/saga",
      // "dva/fetch",
      // "lodash"
    ]
  },

  // externals: {
  //   react: 'react',
  //   // lodash: {
  //   //   commonjs: "lodash",
  //   //   amd: "lodash",
  //   //   root: "_" // indicates global variable
  //   // },
  //   // 'react-dom': 'react-dom',
  //   // 'react-helmet': 'react-helmet',
  //   // 'react-router': 'react-router',
  // },

}
