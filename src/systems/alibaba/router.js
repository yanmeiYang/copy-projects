import React from 'react';
import { Router } from 'dva/router';
import { router2b } from '../full-router';
import { registerModel } from '../../utils';
// import FullRouter from '../full-router';
import { core } from '../../router';

const Routers = function ({ history, app }) {
  const routes = [
    ...router2b(app, []),
    core.IndexPage(app, [

      // search
      // core.ExpertSearch(app), // deprecated.
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

      // Admin(Specified by ccf)
      core.AdminUsers(app),
      core.AdminSystemConfig(app),
      core.AdminAddUserRolesByOrg(app),
      core.AdminContributionType(app),
      core.AdminActivityType(app),
      core.AdminSystemConfigWithCategory(app),
      core.AdminSystemOrgCategory(app),

      // Activity / Seminar
      // core.Seminar(app),
      // core.SeminarWithId(app),
      // core.SeminarMy(app),
      // core.SeminarPost(app),
      // core.SeminarRating(app),
      // core.Statistic(app),
      // core.StatisticDetail(app),
      // core.SeminarByEdit(app),

      // expert map
      core.ExpertMap(app),
      core.ExpertMapGoogle(app),
      core.ExpertMapDispatch(app),
      // core.ExpertTrajectoryPage(app),

      // Relation-Graph, KnowledgeGraph, TrendPrediction, etc...
      // core.RelationGraphPage(app),
      // core.KnowledgeGraph(app),
      // core.TrendPredictionPage(app),

      // System Default.
      core.Default404(app),
    ]),
  ];
  return <Router history={history} routes={routes} />;
};

export default Routers;
