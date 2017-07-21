const path = require('path');
const defines = require('./src/define.js');

const svgSpriteDirs = [
  path.resolve(__dirname, 'src/svg/'),
  require.resolve('antd').replace(/index\.js$/, ''),
];

export default {
  "define": defines(),

  entry: 'src/index.js',
  svgSpriteLoaderDirs: svgSpriteDirs,

  "theme": "./theme.config.js",

  // disableCSSModules: false,
  // "publicPath": "/",
  // "outputPath": "./dist",
  // "extraPostCSSPlugins": [],
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
        ["import", { "libraryName": "antd", "style": true }]
      ]
    },
    "production": {
      "extraBabelPlugins": [
        "transform-runtime",
        ["import", { "libraryName": "antd", "style": true }]
      ]
    }
  },

  // externals: {
  //   react: 'React',
  //   lodash: {
  //     commonjs: "lodash",
  //     amd: "lodash",
  //     root: "_" // indicates global variable
  //   },
  // },

  // "proxy": {
  //   "/api": {
  //     "target": "http://jsonplaceholder.typicode.com/",
  //     "changeOrigin": true,
  //     "pathRewrite": { "^/api": "" }
  //   }
  // },


}
