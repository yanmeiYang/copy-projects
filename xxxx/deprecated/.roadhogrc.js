// not used by roadhog

const path = require('path');
const { defines } = require('./src/define.js');
const { version } = require('./package.json')

const svgSpriteDirs = [
  path.resolve(__dirname, 'src/svg/'),
  require.resolve('antd').replace(/index\.js$/, ''),
];

console.log('*****************************  Rendering .roadhogrc.js',);

export default {
  define: defines,
  entry: 'src/index.js',
  theme: "./theme.config.js",
  publicPath: `/${version}/`,
  outputPath: `./dist/${version}`,

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
  // "publicPath": "/",
  // "outputPath": "./dist",
  // "extraPostCSSPlugins": [],
  // "sass": false,
  // "hash": true,

  "extraBabelPlugins": [
    "trandddsform-runtime", "transform-decorators-legacy",
    ["import", { "libraryName": "antd", "style": true }],
  ],
  "env": {
    "development": {
      "extraBabelPlugins": [
        "dva-hmr",
        ["import", { "libraryName": "antd", "style": true }],
      ]
    },
    "production": {
      "extraBabelPlugins": [
        ["import", { "libraryName": "antd", "style": true }],
      ]
    }
  },

}


// Config
// Configs don't support
// extraBabelPresets and extraBabelPlugins (use babel instead)
// multipage
// autoprefixer ( use browsers instead)
// dllPlugin
// svgSpriteLoaderDirs
// library
// libraryTarget
// cssModulesExclude
// Config changes
// entry
// New Configs
// babel
// copy
// commons
// browserslist
// extraResolveModules
