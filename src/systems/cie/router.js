import React from 'react';
import { Router } from 'dva/router';
import { fullRouter } from '../full-router';

const Routers = function ({ history, app }) {
  const routes = fullRouter(app, []);
  return <Router history={history} routes={routes} />;
};

export default Routers;
