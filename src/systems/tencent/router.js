/**
 * Created by BoGao on 2017/7/15.
 */
import React from 'react';
import { Router } from 'dva/router';
import { core } from '../../router';

const Routers = function ({ history, app }) {
  const routes = [
    core.IndexPage(app, [

      // search
      // core.ExpertSearch(app),
      core.UniSearch(app),
      core.Experts(app),

      // person
      // core.Person(app),

      // user & auth.
      core.Login(app),
      core.Register(app),
      core.User(app),
      core.ForgotPassword(app),
      core.ResetPassword(app),

      // Admin(Specified by ccf)
      // core.AdminUsers(app),
      // core.AdminSystemConfig(app),
      // core.AdminSystemConfigWithCategory(app),

      // Activity / Seminar
      // core.Seminar(app),
      // core.SeminarWithId(app),
      // core.SeminarMy(app),
      // core.SeminarPost(app),
      // core.SeminarRating(app),
      // core.Statistic(app),

      // expert map
      core.ExpertMap(app),
      // core.ExpertMapGoogle(app),

      // Relation-Graph
      core.RelationGraphPage(app),

      // KnowledgeGraph
      core.KnowledgeGraph(app),

      // System Default.
      core.Default404(app),
    ]),
  ];

  return <Router history={history} routes={routes} />;
};

export default Routers;
