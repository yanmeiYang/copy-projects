/**
 *  Created by BoGao on 2017-07-15;
 *  Refactored by BoGao on 2017-09-07; dva@2.0 react-router-4
 */
export default {
  IndexPage2b: {
    path: '/2b',
    models: () => [import('models/auth')],
    component: () => import('routes/2b/2bIndex'),
  },

  Login2b: {
    path: '/2b/login',
    models: () => [import('models/auth')],
    component: () => import('routes/2b/login'),
  },

  EmailTemplate: {
    path: '/2b/email-template',
    models: () => [import('models/2b/2bmodel')],
    component: () => import('routes/2b/emailTemplate'),
  },

};

