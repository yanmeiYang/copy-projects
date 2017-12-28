/**
 *  Created by BoGao on 2017-07-15;
 *  Refactored by BoGao on 2017-09-07; dva@2.0 react-router-4
 *
 *  提供Aminer2b系统全部可用的Routes.
 */

import themes from 'themes'; // Must in first line.

import React from 'react';

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
import trend_new from 'routes/trend/router-trend';
import seminar from 'routes/seminar/router-seminar';
import tencent from 'routes/third-login/router';
import router2bprofile from 'routes/2b-profile/router-2bprofile';
import profile from 'routes/profile/router-profile';
import crossHeat from 'routes/cross-heat/router-ch';
import dataAnnotation from 'routes/data-annotation/router-da';
// import reco from 'routes/reco/router-reco';
import talentHr from 'routes/talentHR/router-talentHR';
import topicRelation from 'routes/topic-relation/router-relation';
import toolsCompare from 'routes/tools-compare/router-toolscompare';

if (process.env.NODE_ENV !== 'production' && themes) {
  console.log('Registered plugins: ', themes.plugins);
}

// Full Routers
const RouterRegistry = [
  core.IndexPage,
  // toolsCompare is goint to be added
  toolsCompare.ComparePage,
  // search
  search.ExpertSearch,
  search.UniSearch,
  //   core.Experts(app),

  // person
  person.Person,
  person.PersonPage,

  // reco
  // reco.Reports,
  // reco.ProjectList,
  // reco.ViewPerson,
  // reco.CreateProject,

  // talentHR
  talentHr.TalentHr,
  talentHr.TalentSearchPage,

  // auth.
  auth.Login,
  // auth.Simple3rdLogin, // disabled by default.

  // user
  user.Register,
  user.User,
  user.ForgotPassword,
  user.ResetPassword,
  user.Retrieve,
  user.UserInfo,
  user.BatchRegister,

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
  seminar.SeminarPostNew,

  // expert map
  map.ExpertMap,
  map.ExpertTrajectoryPage,
  map.ExpertHeatmapPage,

  // Relation-Graph, KnowledgeGraph, TrendPrediction, etc...
  core.RelationGraphPage, // TODO BUG
  core.KnowledgeGraph, // TODO BUG
  core.RanksHelp,

  trend_new.TrendPage,

  // 2b profile
  router2bprofile.TobProfile,
  router2bprofile.Addition,

  // profile
  profile.ProfileMerge,

  tencent.ThirdLogin,
  crossHeat.CrossReport,
  crossHeat.CrossTaskList,
  crossHeat.CrossIndex,
  crossHeat.CrossStartTask,
  crossHeat.CrossReportExport,

  // Data Annotation
  dataAnnotation.AnnotatePersonProfile,

  topicRelation.RelationPage,

  // System Default.
  core.Error404, // must be last one.

];

const RouterRegistry2b = [
  route2b.IndexPage2b,
  route2b.Login2b,
  route2b.EmailTemplate,
  route2b.UserCreate,
];

const RouterJSXFunc = (history, app, routes, RootComponent) => {
  // return <Router history={history} routes={routes} />;
  if (process.env.NODE_ENV !== 'production') {
    // console.log('Load Routes: ', routes);
  }

};


export { RouterRegistry, RouterRegistry2b, RouterJSXFunc };
