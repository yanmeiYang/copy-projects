/**
 * Created by GaoBo on 2017/12/26.
 *
 * This file contains configs when developing and building the system.
 */
const path = require('path');


module.exports = {

  webpack: {
    alias: {
      core: `${__dirname}/src/core`,
      pages: `${__dirname}/src/pages`, // nextjs SSR
      components: `${__dirname}/src/components`,
      routes: `${__dirname}/src/routes`, // CSR ReactRouter routes.
      models: `${__dirname}/src/models`,
      services: `${__dirname}/src/services`,
      utils: `${__dirname}/src/utils`,
      plugins: `${__dirname}/src/plugins`,
      config: `${__dirname}/src/utils/config`,
      systems: `${__dirname}/src/systems`,
      themes: `${__dirname}/src/themes`,
      locales: `${__dirname}/src/locales`,
      public: `${__dirname}/src/public`,
      hoc: `${__dirname}/src/hoc`,
      hooks: `${__dirname}/src/hooks`,
      enums: `${__dirname}/src/utils/enums`,
    },
  },
};

// package.json

// git+https://github.com/elivoa/roadhog.git#2.0
// "roadhog": "^2.0.0-rc.1",
// /Users/bogao/develop/aminer/fork/roadhog
