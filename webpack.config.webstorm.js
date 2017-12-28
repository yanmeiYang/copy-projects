// This file is for Webstorm. Not used in build or dev.

const path = require('path');
const buildrc = require('./.buildrc');

module.exports = {
  entry: path.resolve(__dirname, './index'),
  stats: {
    // assets: true,
    // colors: true,
    // chunks: true,
  },
  resolve: {
    alias: buildrc.webpack.alias,
  },
};

