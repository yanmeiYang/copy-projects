/**
 * Created by GaoBo on 2017/12/26.
 *
 * This file contains configs when developing and building the system.
 */

module.exports = {
  webpack: {
    alias: {
      system: `${__dirname}/src/system`,
      src: `${__dirname}/src`,
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
      assets: `${__dirname}/src/assets`,
    },
  },
};
