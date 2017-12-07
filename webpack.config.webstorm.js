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
      hoc: `${__dirname}/src/hoc`,
      public: `${__dirname}/src/public`,
      components: `${__dirname}/src/components`,
      plugins: `${__dirname}/src/plugins`,
      routes: `${__dirname}/src/routes`,
      models: `${__dirname}/src/models`,
      services: `${__dirname}/src/services`,
      utils: `${__dirname}/src/utils`,
      config: `${__dirname}/src/utils/config`,
      systems: `${__dirname}/src/systems`,
      themes: `${__dirname}/src/themes`,
      hooks: `${__dirname}/src/hooks`,
      enums: `${__dirname}/src/utils/enums`,
    },
  },
};

