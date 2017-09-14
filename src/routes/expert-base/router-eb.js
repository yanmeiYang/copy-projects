/**
 * Created by zhanglimin on 17/9/1.
 */
export default {
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
      import('models/person-comments'),
    ],
    component: () => import('./ExpertBaseExpertsPage'),
  },

  ExpertBaseExpertsPageWithPager: {
    path: '/eb/:id/:query/:offset/:size',
    models: () => [
      import('models/search'),
      import('models/expert-base/expert-base'),
      import('models/person-comments'),
    ],
    component: () => import('./ExpertBaseExpertsPage'),
  },

  AddExpertBase: {
    path: '/add-expert-base', // TODO /eb/add
    models: () => [import('models/expert-base/expert-base')],
    component: () => import('routes/expert-base/add-expert-base'),
  },
  AddExpertDetail: {
    path: '/add-expert-detail/:id', // TODO /eb/add-detail/:id
    models: () => [import('models/expert-base/expert-base')],
    component: () => import('./add-expert-detail'),
  },
};

