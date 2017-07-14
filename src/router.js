/**
 *  Created by BoGao on 2017-07-14;
 */
import App from './routes/app';
import { registerModel } from './utils';
import ExpertMapRouters from './routes/expert-map/router';
import SearchRouters from './routes/search/router';
import PersonRouters from './routes/person/router';
import UserRouters from './routes/user/router';
import AdminRouters from './routes/admin/router';
import SeminarRouters from './routes/seminar/router';
import OtherRouters from './routes/router';

const core = {

  IndexPage: (app, childRoutes) => ({
    path: '/',
    component: App,
    getIndexRoute(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('./models/search'));
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
  ...SeminarRouters,
  ...OtherRouters,

};

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
          cb(null, { component: require('./routes/lab/Admin') });
        }, 'lab/admin');
      },
    },
    {
      path: '/lab/knowledge-graph-widget',
      component: App,
      getIndexRoute(nextState, cb) {
        require.ensure([], (require) => {
          registerModel(app, require('./models/vis/vis-research-interest'));
          cb(null, { component: require('./routes/lab/KnoledgeGraphWidget') });
        }, 'knowledge-graph');
      },
    },
    {
      path: '/hidden/testpage',
      component: App,
      getIndexRoute(nextState, cb) {
        require.ensure([], (require) => {
          registerModel(app, require('./models/testpage'));
          cb(null, { component: require('./routes/hidden/testpage') });
        }, 'testpage');
      },
    },

  ];
};

// export default Routers;
module.exports = {
  registerModel, core,
};

// const registerModel = (app, model) => {
//   if (!(app._models.filter(m => m.namespace === model.namespace).length === 1)) {
//     app.model(model);
//   }
// };
