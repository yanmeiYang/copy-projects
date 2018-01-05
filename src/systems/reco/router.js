import React from 'react';
import { ConnectedRouter } from 'components/core';
import { RouterRegistry2b } from '../router-manager-registry';

import core from 'routes/router-core';
import person from 'routes/person/router-person';
import user from 'routes/user/router-user';
import auth from 'routes/auth/router-auth';
import admin from 'routes/admin/router-admin';
import map from 'routes/expert-map/router-map';
import reco from 'routes/reco/router-reco';

const routes = [
  ...RouterRegistry2b,

  core.IndexPage,
  reco.Reports,
  reco.ProjectList,
  reco.ViewPerson,
  reco.CreateProject,
  reco.EditProject,
  reco.SendEmail,
  reco.SendTest,
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

  admin.AdminUsers,

  map.ExpertMap,
  map.ExpertTrajectoryPage,
  map.ExpertHeatmapPage,
  core.Error404, // must be last one.
];

export default ({ history, app }) => {
  return <ConnectedRouter {...{ history, app, routes }} />;
};

