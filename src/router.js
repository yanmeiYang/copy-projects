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
import SeminarRouters from './routes/seminar/router';
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

  // // roadhog.dll.js, ignore this file in product mode.
  // RoadhogDllJsPlaceHolder: {
  //   path: 'roadhog.dll.js',
  //   component: require('./components/widgets/RoadhogDllJsPlaceHolder'),
  // },

  ...ExpertMapRouters,
  ...SearchRouters,
  ...PersonRouters,
  ...UserRouters,
  ...AdminRouters,
  ...SeminarRouters,
  ...TrendPredictionRouters,
  ...TobRouters,

  ...OtherRouters,

};

module.exports = { registerModel, core };

// ---------- below are not used -----------------

// 现在不用这个方法。用上面...的方法.
// function importRoutes(routes) {
//   if (!routes || routes.length === 0) {
//     console.warn('Import empty routes file:', routes);
//   } else {
//     Object.keys(routes).map((key) => {
//       if (core[key]) {
//         console.error('Route already exists, use another name! ', key);
//       } else {
//         core[key] = routes[key];
//       }
//       return null;
//     });
//   }
// }

// Import Modules' routes here.
// importRoutes(require('./routes/expert-map/router'));
// importRoutes(require('./routes/search/router'));


// deprecated.
const Routers = function ({ history, app }) {
  const routes = [
    // Experimental Labs
    {
      path: '/lab/Admin',
      component: App,
      getIndexRoute(nextState, cb) {
        require.ensure([], (require) => {
          registerModel(app, require('./models/vis/vis-research-interest'));
          cb(null, require('./routes/lab/Admin'));
        }, 'lab/admin');
      },
    },
    {
      path: '/lab/knowledge-graph-widget',
      component: App,
      getIndexRoute(nextState, cb) {
        require.ensure([], (require) => {
          registerModel(app, require('./models/vis/vis-research-interest'));
          cb(null, require('./routes/lab/KnoledgeGraphWidget'));
        }, 'knowledge-graph');
      },
    },
    {
      path: '/hidden/testpage',
      component: App,
      getIndexRoute(nextState, cb) {
        require.ensure([], (require) => {
          registerModel(app, require('./models/testpage'));
          cb(null, require('./routes/hidden/testpage'));
        }, 'testpage');
      },
    },

  ];
};
