/**
 *  Created by BoGao on 2017-07-14;
 */
import App from './routes/app';
import App2b from './routes/app2b';
import { registerModel } from './utils';
import ExpertMapRouters from './routes/expert-map/router';
import SearchRouters from './routes/search/router';
import PersonRouters from './routes/person/router';
import UserRouters from './routes/user/router';
import AdminRouters from './routes/admin/router';
import TrendPredictionRouters from './routes/trend-prediction/router';
import TobRouters from './routes/2b/router';

import OtherRouters from './routes/router';

const core = {

  IndexPage2b: (app, childRoutes) => ({
    path: '/2b',
    component: App2b,
    getIndexRoute(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('./models/login'));
        cb(null, { component: require('./routes/2b/login') });
      }, 'indexPage2b');
    },
    childRoutes,
  }),

  IndexPage: (app, childRoutes) => ({
    path: '/',
    component: App,
    getIndexRoute(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('./models/search-suggest'));
        cb(null, { component: require('./routes/IndexPage') });
      }, 'indexPage');
    },
    childRoutes,
  }),

  Default404: () => ({
    path: '*',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('./routes/error/'));
      }, 'error');
    },
  }),

  ...ExpertMapRouters,
  ...SearchRouters,
  ...PersonRouters,
  ...UserRouters,
  ...AdminRouters,
  ...require('./routes/seminar/router'),
  ...require('./routes/auth/auth-router'),
  ...TrendPredictionRouters,
  ...TobRouters,

  ...OtherRouters,

};

module.exports = { registerModel, core };
