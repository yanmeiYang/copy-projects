import { applyPluginModules } from 'themes';

const routerConfig = {
  ExpertBase: {
    path: '/eb',
    models: () => [import('models/expert-base/expert-base')],
    component: () => import('routes/expert-base/ExpertBaseHome'),
  },

  ExpertBaseExpertsPage: { // deprecated and make this redirect.
    path: '/eb/:id', // TODO 添加权限验证.
    models: () => [
      import('models/search'),
      import('models/expert-base/expert-base'),
    ],
    component: () => import('./ExpertBaseExpertsPage'),
  },

  ExpertBaseExpertsPageWithPager: {
    path: '/eb/:id/:query/:offset/:size',
    models: () => [
      import('models/search'),
      import('models/expert-base/expert-base'),
    ],
    component: () => import('./ExpertBaseExpertsPage'),
  },

  AddExpertBase: {
    path: '/add-expert-base', // TODO /eb/add
    models: () => {
      console.log('...........................in model',);
      return [import('models/expert-base/expert-base')];
    },
    component: () => import('routes/expert-base/add-expert-base'),
  },

  AddExpertDetail: {
    path: '/add-expert-detail/:id', // TODO /eb/add-detail/:id
    models: () => [import('models/expert-base/expert-base')],
    component: () => import('./add-expert-detail'),
  },
};


// export default routerConfig;
export default applyPluginModules('eb', routerConfig);
