// import Routers from '../router-all';
//
// export default Routers;
import core from 'routes/router-core';
import person from 'routes/person/router-person';
import user from 'routes/user/router-user';
import auth from 'routes/auth/router-auth';
import admin from 'routes/admin/router-admin';
import map from 'routes/expert-map/router-map';
import reco from 'routes/reco/router-reco';

import { RouterRegistry2b, RouterJSXFunc } from '../router-registry';

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

const Routers = ({ history, app }) => {
  return RouterJSXFunc(history, app, routes);
};

export default Routers;
