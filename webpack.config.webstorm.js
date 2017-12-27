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
    // Copied from webpack.config.js
    // alias: {
    //   core: `${__dirname}/src/core`,
    //   pages: `${__dirname}/src/pages`, // nextjs SSR
    //   components: `${__dirname}/src/components`,
    //   routes: `${__dirname}/src/routes`, // CSR ReactRouter routes.
    //   models: `${__dirname}/src/models`,
    //   services: `${__dirname}/src/services`,
    //   utils: `${__dirname}/src/utils`,
    //   plugins: `${__dirname}/src/plugins`,
    //   config: `${__dirname}/src/utils/config`,
    //   systems: `${__dirname}/src/systems`,
    //   themes: `${__dirname}/src/themes`,
    //   public: `${__dirname}/src/public`,
    //   hoc: `${__dirname}/src/hoc`,
    //   hooks: `${__dirname}/src/hooks`,
    //   enums: `${__dirname}/src/utils/enums`,
    // },
  },
};

