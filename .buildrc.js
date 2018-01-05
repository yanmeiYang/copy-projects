/**
 * Created by GaoBo on 2017/12/26.
 *
 * This file contains configs when developing and building the system.
 */
module.exports = {
  webpack: {
    alias: {
      pages: `${__dirname}/pages`,

      // TODO umi 需要重新来
      public: `${__dirname}/public`,
      system: `${__dirname}/src/system`,
      src: `${__dirname}/src`,
      core: `${__dirname}/src/core`,
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
      hoc: `${__dirname}/src/hoc`,
      hooks: `${__dirname}/src/hooks`,
      enums: `${__dirname}/src/utils/enums`,
      assets: `${__dirname}/src/assets`,
    },
  },
};
