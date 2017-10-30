import core from 'routes/router-core';
import search from 'routes/search/router-search';
import expertBase from 'routes/expert-base/router-eb';
import person from 'routes/person/router-person';
import user from 'routes/user/router-user';
import auth from 'routes/auth/router-auth';
import admin from 'routes/admin/router-admin';
import rcd from 'routes/recommendation/router-rcd';
import map from 'routes/expert-map/router-map';
import trend_new from 'routes/trend/router-trend';
import seminar from 'routes/seminar/router-seminar';

import { RouterRegistry, RouterRegistry2b, RouterJSXFunc } from '../router-registry';

const routes = [
  ...RouterRegistry2b,
  // ...RouterRegistry,
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

  // expertBase.ExpertBase,
  // expertBase.ExpertBaseExpertsPage,
  // expertBase.ExpertBaseExpertsPageWithPager,
  // expertBase.AddExpertBase,
  // expertBase.AddExpertDetail,
  // expertBase.ExpertProfileInfo,

  // Admin(Specified by ccf) TODO some are only used by ccf, move out.
  admin.AdminUsers,
  // admin.AdminSystemConfig,
  // admin.AdminAddUserRolesByOrg,
  // admin.AdminContributionType,
  // admin.AdminActivityType,
  // admin.AdminSystemConfigWithCategory,
  // admin.AdminSystemOrgCategory,

  // Recommendation/rcd
  // rcd.RecommendationHome,
  // rcd.ProjectPage,
  // rcd.ProjectTaskPage,

  // Activity / Seminar
  // seminar.Seminar,
  // seminar.SeminarWithId,
  // seminar.SeminarMy,
  // seminar.SeminarPost,
  // seminar.SeminarRating,
  // seminar.Statistic,
  // seminar.StatisticDetail,
  // seminar.SeminarByEdit,

  // expert map
  map.ExpertMap,
  map.ExpertMapGoogle,
  map.ExpertTrajectoryPage,
  map.ExpertHeatmapPage,

  // Relation-Graph, KnowledgeGraph, TrendPrediction, etc...
  // core.RelationGraphPage, // TODO BUG
  // core.KnowledgeGraph, // TODO BUG
  // core.RanksHelp,

  // trend.TrendPredictionPage,

  // 2b profile
  // core.TobProfile(app),
  // core.Addition(app),

  // System Default.
  core.Error404, // must be last one.
];

const Routers = ({ history, app }) => {
  return RouterJSXFunc(history, app, routes);
};

export default Routers;
