/**
 *  Created by BoGao on 2017-07-14;
 */
import { registerModel } from '../../utils';

export default {

  Login: app => ({
    path: 'login',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../../models/login'));
        cb(null, require('../login/'));
      }, 'auth');
    },
  }),

  Register: app => ({
    path: '/registered',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../../models/common/universal-config'));
        registerModel(app, require('../../models/auth/auth'));
        cb(null, require('../admin/signup'));
      }, 'auth');
    },
  }),

  User: app => ({
    path: 'user/:id',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../../models/user/detail'));
        cb(null, require('./detail/'));
      }, 'user');
    },
  }),

  ForgotPassword: app => ({
    path: '/forgot-password',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../../models/auth/auth'));
        cb(null, require('../admin/forgot-password/'));
      }, 'user');
    },
  }),

  ResetPassword: app => ({
    path: '/reset-password',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../../models/auth/auth'));
        cb(null, require('../admin/reset-password/'));
      }, 'user');
    },
  }),

  Retrieve: app => ({
    path: '/retrieve',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../../models/auth/auth'));
        cb(null, require('../admin/retrieve/'));
      }, 'user');
    },
  }),

  UserInfo: app => ({
    path: '/user-info',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../../models/auth/auth'));
        cb(null, require('./user-info/'));
      }, 'user');
    },
  }),

};

