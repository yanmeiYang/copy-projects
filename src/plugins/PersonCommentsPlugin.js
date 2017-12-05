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
    router: [
      'eb.ExpertBaseExpertsPage', 'eb.ExpertBaseExpertsPageWithPager',
      'search.UniSearch',
    ],
    modules: [registerModules],
    // TODO hook system.
    // TODO next-api plugins.
    // TODO Holes config.
  },
];

export default (config) => {
  // TODO use config to select which plugin is enabled.
  return pluginsConfigs;
};
