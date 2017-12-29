/**
 *  Created by BoGao on 2017-08-13;
 *  Refactored by BoGao on 2017-09-07; dva@2.0 react-router-4
 */
export default {

  Login: {
    path: '/login',
    models: () => [import('models/auth')],
    component: () => import('./login'),
  },

  Simple3rdLogin: {
    path: '/login/s3',
    models: () => [import('models/auth')],
    component: () => import('routes/auth/3rd-login/Simple3rdLogin'),
  },

};
