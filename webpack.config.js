/* eslint-disable no-param-reassign */

const HtmlWebpackPlugin = require('html-webpack-plugin');
// const HtmlWebpackTemplate = require('html-webpack-template');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const webpack = require('webpack');
const buildrc = require('./.buildrc');

const debug = true;

// TODO 分成3个不同的build， 一个是production模式，一个是dev模式，另一个是基础的。

module.exports = (webpackConfig, env) => {

  const production = env === 'production';

  // Alias
  webpackConfig.resolve.alias = buildrc.webpack.alias;

  webpackConfig.devtool = 'inline-source-map';

  //   webpackConfig.output.filename = '[name].[hash:8].js';
  //   webpackConfig.output.chunkFilename = '[name].[hash:8].js';

  webpackConfig.plugins = webpackConfig.plugins.concat([
    // 为了将public放到src下面
    new CopyWebpackPlugin([{
      from: 'src/public',
      to: production ? '../' : webpackConfig.output.outputPath,
    }]),
    // 生成index.html
    new HtmlWebpackPlugin({
      template: `${__dirname}/src/entry.ejs`,
      filename: production ? '../index.html' : 'index.html',
      minify: production ? {
        collapseWhitespace: true,
      } : null,
      hash: true,
      // headScripts: production ? null : ['/roadhog.dll.js'], // 禁用了dll模式.
    }),
  ]);

  // replace html loader
  // if (webpackConfig.module) {
  //   const newRules = [];
  //   webpackConfig.module.rules.map((item) => {
  //     const test = String(item.test);
  //     if (test === '/\\.html$/') {
  //     }
  //     if (item.loader && item.loader.indexOf('/url-loader/index.js') !== -1) {
  //     }
  //     newRules.push(item);
  //
  //     // test ....
  //     if (test === '/\\.html$/') {
  //       if (item.loader) {
  //         item.loader = 'htmsdfsdfsl';
  //       }
  //     }
  //     if (test) {
  //       return item;
  //     }
  //   });
  //   webpackConfig.module.rules = newRules;
  // }

  if (webpackConfig.module) {
    // 必须使用html的loader。 TODO test 这个是必须的么？
    webpackConfig.module.rules.map((item) => {
      if (String(item.test) === '/\\.html/') {
        if (item.loader) {
          item.loader = 'html';
        }
      }
      // ejs使用url-loader，不然会变成base64
      if (item.loader && item.loader.indexOf('/url-loader/index.js') !== -1) {
        item.exclude.push(/\.ejs$/);
      }
      return item;
    });
  }

  if (production) {
    if (webpackConfig.module) {
      // Class name Hash
      webpackConfig.module.rules.map((item) => {
        const test = String(item.test);
        if (test === '/\\.less$/' || test === '/\\.css/') {
          item.use.filter(iitem => iitem.loader === 'css')[0]
            .options.localIdentName = '[hash:base64:5]';
        }
        return item;
      });
    }

    webpackConfig.plugins.push(new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }));
  }

  if (debug) {
    debugPrintConfig(webpackConfig, env);
  }

  return webpackConfig;
};

// TODO print all available values.
const debugPrintConfig = (webpackConfig, env) => {
  console.log('-------------------- env is -----------------------');
  console.dir(env, { depth: null });
  console.log('\n\n------------------- Webpack config is ------------------------\n\n');
  console.dir(webpackConfig, { depth: null });
  if (true) {
    return;
  }

  console.log('\n\n------------------- config.modules.rules is ------------------------\n\n');
  console.log('> rule:', webpackConfig.module && webpackConfig.module.rules);
  let i = 0;
  console.log('\n\n------------------- config.modules.rules details is ------------------------\n\n');
  for (const rule of (webpackConfig.module && webpackConfig.module.rules) || []) {
    i += 1;
    console.log('\n> rule:', i, rule.test);
    if (rule.include) {
      console.log('  include:', rule.include);
    }
    if (rule.exclude) {
      console.log('  exclude:', rule.exclude);
    }
    if (rule.enforce) {
      console.log('  enforce:', rule.enforce);
    }
    console.log('  rule.use:');
    for (const use of (rule && rule.use) || []) {
      console.log('    use:', use);
      if (use && use.options) {
        // console.log('-------------------------------------------');
        // console.log('    options is:', use.options);
        // console.log('    options is:', Object.keys(use.options));
        // console.log('-------------------------------------------');
        Object.keys(use.options).forEach((key) => {
          console.log('      -option:', key, use.options[key]);
        });
      }
    }
  }
  console.log('-------------------------------------------');
};
