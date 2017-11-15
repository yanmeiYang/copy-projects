/**
 * Created by BoGao on 2017/7/15.
 */
import core from 'routes/router-core';
import search from 'routes/search/router-search';
import expertBase from 'routes/expert-base/router-eb';
import person from 'routes/person/router-person';
import user from 'routes/user/router-user';
import auth from 'routes/auth/router-auth';
import admin from 'routes/admin/router-admin';
import rcd from 'routes/recommendation/router-rcd';
import map from 'routes/expert-map/router-map';
import router2bprofile from 'routes/2b-profile/router-2bprofile';
import tencent from 'routes/third-login/router';
import crossHeat from 'routes/cross-heat/router-ch';

import { RouterRegistry, RouterRegistry2b, RouterJSXFunc } from '../router-registry';

const routes = [
  ...RouterRegistry2b,
  // ...RouterRegistry,
  core.IndexPage,

  // search
  // search.ExpertSearch,
  search.UniSearch,
  //   core.Experts(app),

  // person
  // person.Person,

  // user & auth.
  auth.Login,
  user.Register,
  user.User,
  user.ForgotPassword,
  user.ResetPassword,
  user.Retrieve,
  user.UserInfo,

  // Admin(Specified by ccf) TODO some are only used by ccf, move out.
  admin.AdminUsers,

  // expert map
  map.ExpertMap,
  map.ExpertTrajectoryPage,
  map.ExpertHeatmapPage,

  // Relation-Graph, KnowledgeGraph, TrendPrediction, etc...
  core.RelationGraphPage, // TODO BUG
  core.KnowledgeGraph, // TODO BUG
  core.RanksHelp,

  // 2b profile
  router2bprofile.TobProfile,
  router2bprofile.Addition,

  tencent.ThirdLogin,
  crossHeat.Cross,

  // System Default.
  core.Error404, // must be last one.
];

const Routers = ({ history, app }) => {
  return RouterJSXFunc(history, app, routes);
};

export default Routers;
