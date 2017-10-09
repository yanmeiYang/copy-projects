/**
 *  Created by BoGao on 2017-07-15;
 *  Refactored by BoGao on 2017-09-07; dva@2.0 react-router-4
 *
 *  提供Aminer2b系统全部可用的Routes.
 */
import React from 'react';
import dynamic from 'dva/dynamic';
import { Loader } from 'components/ui';
import { Router, Switch, Route, Redirect, routerRedux } from 'dva/router';

import route2b from 'routes/2b/router-2b';
import core from 'routes/router-core';
import search from 'routes/search/router-search';
import expertBase from 'routes/expert-base/router-eb';
import person from 'routes/person/router-person';
import user from 'routes/user/router-user';
import auth from 'routes/auth/router-auth';
import admin from 'routes/admin/router-admin';
import rcd from 'routes/recommendation/router-rcd';
import map from 'routes/expert-map/router-map';
import trend from 'routes/trend-prediction/router-trend';
import trend_new from 'routes/trend/router-trend';
import seminar from 'routes/seminar/router-seminar';
import tencent from 'routes/third-login/router';
import router2bprofile from 'routes/2b-profile/router-2bprofile';
import crossHeat from 'routes/cross-heat/router-ch';


const { ConnectedRouter } = routerRedux;

// Full Routers
const RouterRegistry = [
  core.IndexPage,

  // search
  search.ExpertSearch,
  search.UniSearch,
  //   core.Experts(app),

  // person
  person.Person,

  // user & auth.
  auth.Login,
  user.Register,
  user.User,
  user.ForgotPassword,
  user.ResetPassword,
  user.Retrieve,
  user.UserInfo,

  expertBase.ExpertBase,
  expertBase.ExpertBaseExpertsPage,
  expertBase.ExpertBaseExpertsPageWithPager,
  expertBase.AddExpertBase,
  expertBase.AddExpertDetail,
  // expertBase.ExpertProfileInfo,

  // Admin(Specified by ccf) TODO some are only used by ccf, move out.
  admin.AdminUsers,
  admin.AdminSystemConfig,
  admin.AdminAddUserRolesByOrg,
  admin.AdminContributionType,
  admin.AdminActivityType,
  admin.AdminSystemConfigWithCategory,
  admin.AdminSystemOrgCategory,

  // Recommendation/rcd
  rcd.RecommendationHome,
  rcd.ProjectPage,
  rcd.ProjectTaskPage,

  // Activity / Seminar
  seminar.Seminar,
  seminar.SeminarWithId,
  seminar.SeminarMy,
  seminar.SeminarPost,
  seminar.SeminarRating,
  seminar.Statistic,
  seminar.StatisticDetail,
  seminar.SeminarByEdit,

  // expert map
  map.ExpertMap,
  map.ExpertMapGoogle,
  map.ExpertTrajectoryPage,
  map.ExpertHeatmapPage,
  map.ExpertMapDispatch,

  // Relation-Graph, KnowledgeGraph, TrendPrediction, etc...
  core.RelationGraphPage, // TODO BUG
  core.KnowledgeGraph, // TODO BUG
  core.RanksHelp,

  trend.TrendPredictionPage,
  trend_new.TrendPage,

  // 2b profile
  router2bprofile.TobProfile,
  router2bprofile.Addition,

  tencent.ThirdLogin,
  crossHeat.Cross,

  // System Default.
  core.Error404, // must be last one.

];

const RouterRegistry2b = [
  route2b.IndexPage2b,
  route2b.Login2b,
  route2b.EmailTemplate,
];

const RouterJSXFunc = (history, app, routes, RootComponent) => {
  // return <Router history={history} routes={routes} />;
  if (process.env.NODE_ENV !== 'production') {
    // console.log('Load Routes: ', routes);
  }

  return (
    <ConnectedRouter history={history}>
      {/* v2.0 不使用 RootComponent，在page中引入Root */}
      {/*<RootComponent>*/}
      <Switch>
        {/* <Route exact path="/" render={() => (<Redirect to="/dashboard" />)} /> */}
        {routes.map(({ path, noExact, ...dynamics }, index) => {
          const dupKey = `${index}_`;

          if (false && process.env.NODE_ENV !== 'production') {
            console.log(
              '%cRegister Routes: %s %s',
              'color:red;background-color:rgb(255,251,130)',
              !noExact ? '[exact]' : '', path);
          }

          // for Error404 <Route component={error} />
          if (!path) {
            return <Route key={dupKey} component={dynamic({ app, ...dynamics })} />;
            // return <Route key={dupKey} component={error} />;
          }

          // common routes.
          return (
            <Route key={dupKey} exact={!noExact} path={path} component={dynamic({
              app,
              LoadingComponent: ({ productId }) => (<Loader spinning />), // TODO that this?
              ...dynamics,
            })} />
          );
        })}
        {/*<Route component={error} />*/}
      </Switch>
      {/*</RootComponent>*/}
    </ConnectedRouter>
  );
};


module.exports = { RouterRegistry, RouterRegistry2b, RouterJSXFunc };
