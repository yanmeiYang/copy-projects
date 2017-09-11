/**
 * Created by zhanglimin on 17/9/1.
 */
export default {
  ExpertBase: {
    path: '/eb',
    models: () => [import('models/expert-base/expert-base')],
    component: () => import('routes/expert-base/ExpertBaseHome'),
  },

  ExpertBaseExpertsPage: {
    path: '/eb/:id', // TODO 添加权限验证.
    models: () => [import('models/expert-base/expert-base'),
      import('models/person-comments')],
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
  // ExpertProfileInfo: {
  //   path: '/profile-info/:id', //
  //   getComponent(nextState, cb) {
  //     require.ensure([], (require) => {
  //       registerModel(app, require('../../models/expert-base/expert'));
  //       cb(null, require('./profile-info'));
  //     }, 'expertBase');
  //   },
  // },


  // AddExpertBase: {
  //   path: '/add-expert-base',
  //   getComponent(nextState, cb) {
  //     require.ensure([], (require) => {
  //       registerModel(app, require('../../models/expert-base/expert'));
  //       cb(null, require('./add-expert-base'));
  //     }, 'expertBase');
  //   },
  // },
  // ExpertDetailList: {
  //   path: '/expert-base-list',
  //   getComponent(nextState, cb) {
  //     require.ensure([], (require) => {
  //       registerModel(app, require('../../models/expert-base/expert'));
  //       cb(null, require('./expert-base-list'));
  //     }, 'expertBase');
  //   },
  // },
  // AddExpertDetail: {
  //   path: '/add-expert-detail/:id',
  //   getComponent(nextState, cb) {
  //     require.ensure([], (require) => {
  //       registerModel(app, require('../../models/expert-base/expert'));
  //       cb(null, require('./add-expert-detail'));
  //     }, 'expertBase');
  //   },
  // },
  // ExpertProfileInfo: {
  //   path: '/profile-info/:id',
  //   getComponent(nextState, cb) {
  //     require.ensure([], (require) => {
  //       registerModel(app, require('../../models/expert-base/expert'));
  //       cb(null, require('./profile-info'));
  //     }, 'expertBase');
  //   },
  // },
};

