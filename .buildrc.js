/**
 * Created by GaoBo on 2017/12/26.
 *
 * This file contains configs when developing and building the system.
 */
module.exports = {
  webpack: {
    alias: {
      pages: `${__dirname}/src/pages`,
      components: `${__dirname}/src/components`,
      models: `${__dirname}/src/models`,
      core: `${__dirname}/src/core`,
      services: `${__dirname}/src/services`,
      plugins: `${__dirname}/src/plugins`,
      utils: `${__dirname}/src/utils`,
      public: `${__dirname}/public`,
      locales: `${__dirname}/src/locales`,

      systems: `${__dirname}/src/systems`,
      themes: `${__dirname}/src/themes`,
      '@': `${__dirname}/src`,

      'dva': 'dva-no-router',

      // TODO umi 需要重新来
      // system: `${__dirname}/src/system`,
      //
      // routes: `${__dirname}/src/routes`, // CSR ReactRouter routes.
      // config: `${__dirname}/src/utils/config`,
      // hoc: `${__dirname}/src/hoc`,
      // hooks: `${__dirname}/src/hooks`,
      // enums: `${__dirname}/src/utils/enums`,
      // assets: `${__dirname}/src/assets`,
    },
  },
};
