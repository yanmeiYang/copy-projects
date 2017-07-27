/* eslint-disable no-param-reassign */

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackChunkHash = require('webpack-chunk-hash');

module.exports = function (config, env) {
  // if (config.module) {
  //   console.log('-------------------------------------------');
  //   console.log(config.plugins[3].definitions);
  //   console.log('-------------------------------------------');
  //   config.plugins.map((p) => {
  //     console.log('>', p);
  //   });
  //   console.log('-------------------------------------------');
  // }

  if (config.module) {
    // > npm run build

    // [1] roadhog 默认配置把非 特定格式 的文件都用 url-loader 去加载，
    // 但是 html-webpack-plugin 需要的 ejs 文件会变成 base64 编码，
    // 所以要把 ejs 格式加入 loader 白名单.
    config.module.rules[0].exclude.push(/\.ejs$/);
    // console.log('>>> ', config.plugins[3].definitions);
    if (env === 'production') {
      config.output.filename = '[name].[chunkhash:8].js';
      config.output.chunkFilename = '[name].[chunkhash:8].async.js';
      config.plugins[2] = new ExtractTextPlugin('[contenthash:12].css');
      config.plugins.push(
        new HtmlWebpackPlugin({
          template: 'ejs!src/index.ejs',
          inject: true,
          minify: { collapseWhitespace: true },
          production: true,
        }),
        new WebpackChunkHash({ algorithm: 'md5' }),
      );
    } else {
      // config.plugins.push(
      //   new HtmlWebpackPlugin({
      //     template: 'ejs!src/index.ejs',
      //     inject: true,
      //   }),
      // );
    }
  }
  // > npm run build:dll

  return config;
};
