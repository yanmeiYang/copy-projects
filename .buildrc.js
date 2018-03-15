/**
 * Created by GaoBo on 2017/12/26.
 *
 * This file contains configs when developing and building the system.
 */
module.exports = {
  webpack: {
    alias: {
      // pages: `${__dirname}/src/pages`, // 不能直接引用pages目录下的东西，都是生成的。
      components: `${__dirname}/src/components`,
      models: `${__dirname}/src/models`,
      core: `${__dirname}/src/core`,
      engine: `${__dirname}/src/engine`,
      services: `${__dirname}/src/services`,
      plugin: `${__dirname}/src/plugin`,
      utils: `${__dirname}/src/utils`,
      helper: `${__dirname}/src/helper`,
      public: `${__dirname}/public`,
      locales: `${__dirname}/src/locales`,

      systems: `${__dirname}/src/systems`,
      themes: `${__dirname}/src/themes`,
      hoc: `${__dirname}/src/hoc`,
      '@': `${__dirname}/src`,

      'dva': 'dva-no-router',

      // TODO umi 需要重新来
      // system: `${__dirname}/src/system`,
      //
      // routes: `${__dirname}/src/routes`, // CSR ReactRouter routes.
      // config: `${__dirname}/src/utils/config`,
      // hooks: `${__dirname}/src/hooks`,
      // enums: `${__dirname}/src/utils/enums`,
      // assets: `${__dirname}/src/assets`,
    },
  },
};

//
// "jsx-a11y/no-static-element-interactions": [0],
//   "jsx-a11y/no-noninteractive-element-interactions": [0],
//   "jsx-a11y/click-events-have-key-events": [0],
//   "comma-dangle": ["error", {
//   "arrays": "always-multiline",
//   "objects": "always-multiline",
//   "imports": "always-multiline",
//   "exports": "always-multiline",
//   "functions": "ignore"
// }],
//   "function-paren-newline": [0],
//   "no-restricted-globals": [0],
