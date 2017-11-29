/**
 * Created by BoGao on 2017/10/6.
 */
import core from 'routes/router-core';
import expertBase from 'routes/expert-base/router-eb';
import trend_new from 'routes/trend/router-trend';
import { RouterRegistry, RouterRegistry2b, RouterJSXFunc } from '../router-registry';

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

const Routers = ({ history, app }) => {
  return RouterJSXFunc(history, app, routes);
};

export default Routers;
