// This file is for Webstorm. Not used in build or dev.

const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, './index'),
  stats: {
    // assets: true,
    // colors: true,
    // chunks: true,
  },
  resolve: {
    // Copied from webpack.config.js
    alias: {
      components: `${__dirname}/src/components`,
      utils: `${__dirname}/src/utils`,
      config: `${__dirname}/src/utils/config`,
      enums: `${__dirname}/src/utils/enums`,
      services: `${__dirname}/src/services`,
      models: `${__dirname}/src/models`,
      routes: `${__dirname}/src/routes`,
      themes: `${__dirname}/src/themes`,
      systems: `${__dirname}/src/systems`,
      hoc: `${__dirname}/src/hoc`,
    },
  },
};

