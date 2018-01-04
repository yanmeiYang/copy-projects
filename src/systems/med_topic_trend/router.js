/**
 * Created by BoGao on 2017/10/6.
 */
import React from 'react';
import { ConnectedRouter } from 'components/core';
import { RouterRegistry2b } from '../router-manager-registry';

import core from 'routes/router-core';
import expertBase from 'routes/expert-base/router-eb';
import trend_new from 'routes/trend/router-trend';

const routes = [
  ...RouterRegistry2b,
  //首页,uniSearch页路由,当前状态关闭
  // core.IndexPage,
  // search.UniSearch,
  expertBase.ExpertBase,
  expertBase.ExpertBaseExpertsPage,
  expertBase.ExpertBaseExpertsPageWithPager,
  trend_new.TrendPage,
  core.Error404, // must be last one.
];

export default ({ history, app }) => {
  return <ConnectedRouter {...{ history, app, routes }} />;
};
