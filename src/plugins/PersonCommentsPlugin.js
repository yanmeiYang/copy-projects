// This is aminer front-end plugin system.
// design and implemented by bo gao <bogao@tsinghua.edu.cn> at 2017-12-02

// Person Comments and common labels plugin.

const registerModules = () => [
  import('models/person-comments'),
  import('models/common/common-labels'),
];

const pluginsConfigs = [
  // {
  //   router: 'AddExpertBase', // required, string or array
  //   modules: [registerModules],
  // },
  {

    // 这个plugin会应用在以下router中。
    router: [
      'eb.ExpertBaseExpertsPage', 'eb.ExpertBaseExpertsPageWithPager',
      'search.UniSearch',
    ],

    // router中会自动加上下面的modules。
    modules: [registerModules],

    // additional api search parameters.
    api_search: {
      parameters: {
        aggregation: ['dims.systag'],
        haves: { systag: [] },
      },
    },

    // TODO hook system.
    // TODO next-api plugins.
    // TODO Holes config.
  },
];

export default (config) => {
  // TODO use config to select which plugin is enabled.
  return pluginsConfigs;
};
