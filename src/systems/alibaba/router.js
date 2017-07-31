import React from 'react';
import { Router } from 'dva/router';
import { registerModel } from '../../utils';
import FullRouter from '../full-router';

const Routers = function ({ history, app }) {
  const routes = FullRouter(app, [
    // System specified routes config.
  ]);

  return <Router history={history} routes={routes} />;
};

export default Routers;
