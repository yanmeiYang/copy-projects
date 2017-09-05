/**
 * Created by zhanglimin on 17/9/1.
 */

import { registerModel } from '../../utils';

export default {
  ExpertBase: app => ({
    path: '/expert-base',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../../models/expert-base/expert'));
        cb(null, require('./index'));
      }, 'expertBase');
    },
  }),
  AddExpertBase: app => ({
    path: '/add-expert-base',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../../models/expert-base/expert'));
        cb(null, require('./add-expert-base'));
      }, 'expertBase');
    },
  }),
  ExpertDetailList: app => ({
    path: '/expert-base-list/:id',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../../models/expert-base/expert'));
        cb(null, require('./expert-base-list'));
      }, 'expertBase');
    },
  }),
  AddExpertDetail: app => ({
    path: '/add-expert-detail/:id',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../../models/expert-base/expert'));
        cb(null, require('./add-expert-detail'));
      }, 'expertBase');
    },
  }),
  ExpertProfileInfo: app => ({
    path: '/profile-info/:id',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../../models/expert-base/expert'));
        cb(null, require('./profile-info'));
      }, 'expertBase');
    },
  }),
};

