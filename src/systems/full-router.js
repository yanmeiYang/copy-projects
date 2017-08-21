/**
 *  Created by BoGao on 2017-07-15;
 */
import { core } from '../router';

/**
 * 提供Aminer2b系统全部可用的Routes.
 *
 * @param history
 * @param app
 * @returns {XML}
 * @constructor
 */
const router2b = (app, defaultChildRoutes) => {
  const childRoutes = defaultChildRoutes || [];
  const routers2b = [
    core.IndexPage2b(app, [
      core.Login2b(app),
      core.EmailTemplate(app),
      ...childRoutes,
    ]),
  ];
  return routers2b;
};

const fullRouter = (app, defaultChildRoutes) => {
  const childRoutes = defaultChildRoutes || [];
  const allRouters = [
    ...router2b(app),
    core.IndexPage(app, [
      // search
      core.ExpertSearch(app),
      core.UniSearch(app),
      core.Experts(app),

      // person
      core.Person(app),

      // user & auth.
      core.Login(app),
      core.Register(app),
      core.User(app),
      core.ForgotPassword(app),
      core.ResetPassword(app),
      core.Retrieve(app),
      core.UserInfo(app),

      // Admin(Specified by ccf) TODO some are only used by ccf, move out.
      core.AdminUsers(app),
      core.AdminSystemConfig(app),
      core.AdminAddUserRolesByOrg(app),
      core.AdminContributionType(app),
      core.AdminActivityType(app),
      core.AdminSystemConfigWithCategory(app),
      core.AdminSystemOrgCategory(app),

      // Activity / Seminar
      core.Seminar(app),
      core.SeminarWithId(app),
      core.SeminarMy(app),
      core.SeminarPost(app),
      core.SeminarRating(app),
      core.Statistic(app),
      core.StatisticDetail(app),
      core.SeminarByEdit(app),

      // expert map
      core.ExpertMap(app),
      core.ExpertMapGoogle(app),
      core.ExpertTrajectoryPage(app),

      // Relation-Graph, KnowledgeGraph, TrendPrediction, etc...
      core.RelationGraphPage(app),
      core.KnowledgeGraph(app),
      core.TrendPredictionPage(app),
      core.RanksHelp(app),

      // 2b profile
      core.TobProfile(app),

      // Your pages should be registered here.

      ...childRoutes,

      // System Default.
      core.Default404(app), // must be last one.
    ]),
  ];
  return allRouters;
};

module.exports = { fullRouter, router2b };
