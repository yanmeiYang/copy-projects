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
          registerModel(app, require('./models/search-suggest'));
          cb(null, { component: require('./routes/IndexPage') });
        }, 'indexPage');
      },
      childRoutes: [
        {
          path: 'search/:query/:offset/:size',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/search'));
              registerModel(app, require('./models/expert-map'));
              cb(null, require('./routes/search/'));
            }, 'search');
          },
        },
        {
          path: 'uniSearch/:query/:offset/:size',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/search'));
              registerModel(app, require('./models/search-suggest'));
              registerModel(app, require('./models/expert-map'));
              cb(null, require('./routes/uniSearch/'));
            }, 'search');
          },
        },
        {
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
            require.ensure([], (require) => {
              registerModel(app, require('./models/seminar'));
              cb(null, require('./routes/seminar/'));
            }, 'seminar');
          },
        }, {
          path: 'seminar-my',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/seminar'));
              cb(null, require('./routes/seminar/mySeminars/'));
            }, 'mySeminar');
          },
        },
        {
          path: 'seminarpost',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/seminar'));
              cb(null, require('./routes/seminar/addSeminar'));
            }, 'addSeminar');
          },
        }, {
          path: 'seminar/expert-rating/:id',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/seminar'));
              cb(null, require('./routes/seminar/expertRatingPage'));
            }, 'expertRating');
          },
        },
        {
          path: 'seminar/:id',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/seminar'));
              cb(null, require('./routes/seminar/detailSeminar'));
            }, 'detailSeminar');
          },
        }, {
          path: 'statistics',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/seminar'));
              registerModel(app, require('./models/statistics/statistics'));
              cb(null, require('./routes/statistics'));
            }, 'statistics');
          },
        },
        {
          path: 'person/:id',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/seminar'));// 跨命名空间调用有在依赖注册时有先后顺序
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
              cb(null, require('./routes/expert-map/'));
            }, 'expert-map');
          },
        },
        {
          path: 'expert-googlemap',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/expert-map'));
              cb(null, require('./routes/expert-map/'));
            }, 'expert-googlemap');
          },
        },
        {
          path: '/registered',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/common/universal-config'));
              registerModel(app, require('./models/auth/auth'));
              cb(null, require('./routes/admin/signup'));
            }, 'registered');
          },
        },
      ],
    },
    {
      path: '/admin',
      component: App,
      getIndexRoute(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, { component: require('./routes/IndexPage') });
        }, 'indexPage');
      },
    },
    {
      path: '/admin/users',
      component: App,
      getIndexRoute(nextState, cb) {
        require.ensure([], (require) => {
          registerModel(app, require('./models/common/universal-config'));
          registerModel(app, require('./models/auth/auth'));
          cb(null, { component: require('./routes/admin/user-list') });
        }, 'users');
      },
    },
    {
      path: '/admin/system-config',
      component: App,
      getIndexRoute(nextState, cb) {
        require.ensure([], (require) => {
          registerModel(app, require('./models/admin/system-config'));
          registerModel(app, require('./models/common/universal-config'));
          cb(null, { component: require('./routes/admin/system-config') });
        }, 'admin');
      },
      childRoutes: [
        {
          path: '/admin/system-config/:category',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/admin/system-config'));
              registerModel(app, require('./models/common/universal-config'));
              cb(null, require('./routes/admin/system-config'));
            }, 'admin');
          },
        },
      ],
    },
    {
      path: '/technical-committees',
      component: App,
      getIndexRoute(nextState, cb) {
        require.ensure([], (require) => {
          registerModel(app, require('./models/common/universal-config'));
          cb(null, { component: require('./routes/technical-committees') });
        }, 'technicalCommittees');
      },
    },

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
      path: '/relation-graph-page',
      component: App,
      getIndexRoute(nextState, cb) {
        require.ensure([], (require) => {
          // registerModel(app, require('./models/vis/vis-research-interest'));
          cb(null, { component: require('./routes/relation-graph-page') });
        }, 'relation-graph');
      },
    },
    {
      path: '/knowledge-graph',
      component: App,
      getIndexRoute(nextState, cb) {
        require.ensure([], (require) => {
          registerModel(app, require('./models/vis/vis-research-interest'));
          cb(null, { component: require('./routes/KnowledgeGraphPage') });
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
    {
      path: '/forgotpassword',
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          registerModel(app, require('./models/auth/auth'));
          cb(null, require('./routes/admin/forgot-password/'));
        }, 'forgotPassword');
      },
    },
    {
      path: '/reset-password',
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          registerModel(app, require('./models/auth/auth'));
          cb(null, require('./routes/admin/reset-password/'));
        }, 'resetPassword');
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
  ];

  return <Router history={history} routes={routes} />;
};

export default Routers;
