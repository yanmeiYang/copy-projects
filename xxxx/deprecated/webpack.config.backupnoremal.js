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
  const buildDllMode = webpackConfig.module ? false : true;
  if (debug) {
    console.log('-------------------------------------------');
    console.log('>> env: ', env);
    console.log('>> build:dll mode : ', buildDllMode);
    console.log('>> config:\n', webpackConfig);
    console.log('>> =====================:\n', webpackConfig.plugins[4]);
    console.log('-------------------------------------------');
  }
  // Filename Hash
  if (!buildDllMode) {
    webpackConfig.output.filename = '[name].[hash:8].js';
    webpackConfig.output.chunkFilename = '[name].[hash:8].js';
  }

  if (!production) {
    // webpackConfig.devtool = 'inline-source-map';
  }

  if (production) {
    if (webpackConfig.module) {
      // Class name Hash
      webpackConfig.module.rules.map((item) => {
        if (String(item.test) === '/\\.less$/' ||
          String(item.test) === '/\\.css/') {
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

  if (!buildDllMode) {
    webpackConfig.plugins = webpackConfig.plugins.concat([
      new CopyWebpackPlugin([{
        from: 'src/public',
        to: production ? '../' : webpackConfig.output.outputPath,
      }]),
    ]);
  }

  webpackConfig.plugins = webpackConfig.plugins.concat([
    // new CopyWebpackPlugin([
    //   {
    //     from: 'src/public',
    //     to: production ? '../' : webpackConfig.output.outputPath,
    //   },
    // ]),
    new HtmlWebpackPlugin({
      template: `${__dirname}/src/entry.ejs`,
      filename: production ? '../index.html' : 'index.html',
      minify: production ? {
        collapseWhitespace: true,
      } : null,
      hash: true,
      headScripts: production ? null : ['/roadhog.dll.js'],
    }),
  ]);

  //
  // // console.log('````````````````````````````````', HtmlWebpackTemplate)
  // webpackConfig.plugins = webpackConfig.plugins.concat([
  //   new HtmlWebpackPlugin({
  //     hash: true,
  //     mobile: true,
  //     title: '',
  //     inject: false,
  //     appMountId: 'root',
  //     template: `!!ejs-loader!${HtmlWebpackTemplate}`,
  //     filename: production ? '../dist/index.html' : 'index.html',
  //     minify: {
  //       collapseWhitespace: true,
  //     },
  //     scripts: production ? null : ['/roadhog.dll.js'],
  //     meta: [
  //       {
  //         name: 'description',
  //         content: 'AMiner to Business.',
  //       }, {
  //         name: 'viewport',
  //         content: 'width=device-width, initial-scale=1.0',
  //       },
  //     ],
  //   }),
  // ]);

  // Alias
  webpackConfig.resolve.alias = buildrc.webpack.alias;
  // {
  // core: `${__dirname}/src/core`,
  // pages: `${__dirname}/src/pages`, // nextjs SSR
  // components: `${__dirname}/src/components`,
  // routes: `${__dirname}/src/routes`, // CSR ReactRouter routes.
  // models: `${__dirname}/src/models`,
  // services: `${__dirname}/src/services`,
  // utils: `${__dirname}/src/utils`,
  // plugins: `${__dirname}/src/plugins`,
  // config: `${__dirname}/src/utils/config`,
  // systems: `${__dirname}/src/systems`,
  // themes: `${__dirname}/src/themes`,
  // public: `${__dirname}/src/public`,
  // hoc: `${__dirname}/src/hoc`,
  // hooks: `${__dirname}/src/hooks`,
  // enums: `${__dirname}/src/utils/enums`,
  // };

  if (debug) {
    console.log('-------------------------------------------');
    console.log('>> config:\n', webpackConfig);
    console.log('>> =====================:\n', webpackConfig.plugins[4]);
    console.log('-------------------------------------------');
  }
  return webpackConfig;
};