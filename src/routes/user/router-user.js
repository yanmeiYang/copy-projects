/**
 *  Created by BoGao on 2017-07-14;
 *  Refactored by BoGao on 2017-09-07; dva@2.0 react-router-4
 */
export default {

  Register: {
    path: '/registered',
    models: () => [
      import('models/common/universal-config'),
      import('models/auth/auth'),
    ],
    component: () => import('./signup'),
  },

  User: {
    path: '/user/:id',
    models: () => [import('models/user/detail')],
    component: () => import('./detail/'),
  },

  ForgotPassword: {
    path: '/forgot-password',
    models: () => [import('models/auth/auth')],
    component: () => import('./forgot-password/'),
  },

  ResetPassword: {
    path: '/reset-password',
    models: () => [import('models/auth/auth')],
    component: () => import('./reset-password/'),
  },

  Retrieve: {
    path: '/retrieve',
    models: () => [import('models/auth/auth')],
    component: () => import('./retrieve/'),
  },

  UserInfo: {
    path: '/user-info',
    models: () => [import('models/auth/auth')],
    component: () => import('./user-info/'),
  },

};

