import React from 'react';
import { Router } from 'dva/router';
import { registerModel } from '../../utils';
import FullRouter from '../full-router';

const Routers = function ({ history, app }) {
  const routes = [
    ...FullRouter(app),

    {
      path: '/technical-committees',
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          registerModel(app, require('../../models/common/universal-config'));
          cb(null, require('../../routes/technical-committees'));
        }, 'ccf');
      },
    },

  ];

  return <Router history={history} routes={routes} />;
};

export default Routers;
