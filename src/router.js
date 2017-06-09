import React from 'react';
import { Router } from 'dva/router';
import App from './routes/app';

// const registerModel = (app, model) => {
//   if (!(app._models.filter(m => m.namespace === model.namespace).length === 1)) {
//     app.model(model);
//   }
// };
const cached = {};
function registerModel(app, model) {
  if (!cached[model.namespace]) {
    app.model(model);
    cached[model.namespace] = 1;
  }
}

const Routers = function ({ history, app }) {
  const routes = [
    {
      path: '/',
      component: App,
      getIndexRoute(nextState, cb) {
        require.ensure([], (require) => {
          registerModel(app, require('./models/search'));
          cb(null, { component: require('./routes/IndexPage') });
        }, 'indexPage');
      },
      childRoutes: [
        {
          path: 'search/:query/:offset/:size',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/search'));
              cb(null, require('./routes/search/'));
            }, 'search');
          },
        }, {
          path: 'experts/:offset/:size',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/search'));
              cb(null, require('./routes/search/'));
            }, 'search');
          },
        }, {
          path: 'user/:id',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/user/detail'));
              cb(null, require('./routes/user/detail/'));
            }, 'user-detail');
          },
        }, {
          path: 'login',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/login'));
              cb(null, require('./routes/login/'));
            }, 'login');
          },
        }, {
          path: 'seminar',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/seminar'));
              cb(null, require('./routes/seminar/'));
            }, 'seminar');
          },
        },
        {
          path: 'seminarpost',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/seminar'));
              cb(null, require('./routes/seminar/addSeminar'));
            }, 'addSeminar');
          },
        }, {
          path: 'seminar/:id',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/seminar'));
              cb(null, require('./routes/seminar/detailSeminar'));
            }, 'detailSeminar');
          },
        },
        {
          path: 'person/:id',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/person'));
              registerModel(app, require('./models/publications'));
              registerModel(app, require('./models/vis/vis-research-interest'));
              cb(null, require('./routes/person'));
            }, 'persons');
          },
        },
        {
          path: 'expert-map',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/expert-map'));
              cb(null, require('./routes/expert-map'));
            }, 'expert-map');
          },
        },
        {
          path: '/admin',
          component: App,
          getIndexRoute(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/vis/vis-research-interest'));
              cb(null, { component: require('./routes/Admin') });
            }, 'admin');
          },
        },
        {
          path: '*',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/error/'));
            }, 'error');
          },
        },
      ],
    },
    {
      path: '/dashboard',
      component: App,
      getIndexRoute(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/dashboard'));
          cb(null, { component: require('./routes/dashboard/') });
        }, 'dashboard');
      },
      childRoutes: [
        {
          path: '',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/dashboard'));
              cb(null, require('./routes/dashboard/'));
            }, 'dashboard');
          },
        }, {
          path: 'user',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/user'));
              cb(null, require('./routes/user/'));
            }, 'user');
          },
        }, {
          path: 'user/:id',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/user/detail'));
              cb(null, require('./routes/user/detail/'));
            }, 'user-detail');
          },
        }, {
          path: 'login',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/login'));
              cb(null, require('./routes/login/'));
            }, 'login');
          },
        }, {
          path: 'request',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/request/'));
            }, 'request');
          },
        }, {
          path: 'UIElement/iconfont',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/UIElement/iconfont/'));
            }, 'UIElement-iconfont');
          },
        }, {
          path: 'UIElement/search',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/UIElement/search/'));
            }, 'UIElement-search');
          },
        }, {
          path: 'UIElement/dropOption',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/UIElement/dropOption/'));
            }, 'UIElement-dropOption');
          },
        }, {
          path: 'UIElement/layer',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/UIElement/layer/'));
            }, 'UIElement-layer');
          },
        }, {
          path: 'UIElement/dataTable',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/UIElement/dataTable/'));
            }, 'UIElement-dataTable');
          },
        }, {
          path: 'UIElement/editor',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/UIElement/editor/'));
            }, 'UIElement-editor');
          },
        }, {
          path: 'chart/lineChart',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/chart/lineChart/'))
            }, 'chart-lineChart')
          },
        }, {
          path: 'chart/barChart',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/chart/barChart/'))
            }, 'chart-barChart')
          },
        }, {
          path: 'chart/areaChart',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/chart/areaChart/'));
            }, 'chart-areaChart');
          },
        }, {
          path: '*',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/error/'));
            }, 'error');
          },
        },
      ],
    },
  ]

  return <Router history={history} routes={routes} />;
}

export default Routers;
