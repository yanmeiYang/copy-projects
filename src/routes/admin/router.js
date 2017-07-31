/**
 *  Created by BoGao on 2017-07-15;
 */
import { registerModel } from '../../utils';

export default {

  AdminUsers: app => ({
    path: 'admin/users',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../../models/common/universal-config'));
        registerModel(app, require('../../models/auth/auth'));
        cb(null, require('./user-list'));
      }, 'admin');
    },
  }),

  AdminAddUserRolesByOrg: app => ({
    path: 'admin/system-config/user_roles',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../../models/common/universal-config'));
        registerModel(app, require('../../models/auth/auth'));
        cb(null, require('./add-user-roles'));
      }, 'admin');
    },
  }),

  AdminSystemConfig: app => ({
    path: '/admin/system-config',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../../models/admin/system-config'));
        registerModel(app, require('../../models/common/universal-config'));
        cb(null, require('./system-config'));
      }, 'admin');
    },
  }),
  AdminContributionType: app => ({
    path: '/admin/system-config/contribution_type',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../../models/admin/system-config'));
        registerModel(app, require('../../models/common/universal-config'));
        cb(null, require('./contribution-type'));
      }, 'admin');
    },
  }),
  AdminActivityType: app => ({
    path: '/admin/system-config/orgcategory',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../../models/admin/system-config'));
        registerModel(app, require('../../models/common/universal-config'));
        cb(null, require('./activity-type'));
      }, 'admin');
    },
  }),

  AdminSystemConfigWithCategory: app => ({
    path: '/admin/system-config/:category',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../../models/admin/system-config'));
        registerModel(app, require('../../models/common/universal-config'));
        cb(null, require('./system-config'));
      }, 'admin');
    },
  }),

  AdminSystemOrgCategory: app => ({
    path: '/admin/category-list',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../../models/admin/system-config'));
        registerModel(app, require('../../models/common/universal-config'));
        cb(null, require('./org-category'));
      }, 'admin');
    },
  }),




};

