const path = require('path');
const { defines } = require('./src/define.js');
// const { version } = require('./package.json')

const svgSpriteDirs = [
  path.resolve(__dirname, 'src/svg/'),
  require.resolve('antd').replace(/index\.js$/, ''),
];

export default {
  "define": defines,

  entry: 'src/index.js',
  svgSpriteLoaderDirs: svgSpriteDirs,
  theme: "./theme.config.js",

  // "proxy": {
  //   "/api/v1/weather": {
  //     "target": "https://api.seniverse.com/",
  //     "changeOrigin": true,
  //     "pathRewrite": { "^/api/v1/weather": "/v3/weather" }
  //   },
  //   "/api": {
  //     "target": "https://api.aminer.org/",r
  //     "changeOrigin": true,
  //     "pathRewrite": { "^/tapi": "" }
  //   }
  // },

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
    ["import", { "libraryName": "antd", "style": true }],
  ],
  "env": {
    "development": {
      "extraBabelPlugins": [
        "dva-hmr",
        "transform-runtime",
        "transform-decorators-legacy",
        ["import", { "libraryName": "antd", "style": true }],
      ]
    },
    "production": {
      "extraBabelPlugins": [
        "transform-runtime",
        "transform-decorators-legacy",
        ["import", { "libraryName": "antd", "style": true }],
      ]
    }
  },

  dllPlugin: {
    exclude: ["babel-runtime", "roadhog", "cross-env"],
    include: ["dva/router", "dva/saga", "dva/fetch"]
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
