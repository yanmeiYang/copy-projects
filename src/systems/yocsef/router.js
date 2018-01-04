/**
 * Created by yangyanmei on 17/11/15.
 */
import React from 'react';
import { ConnectedRouter } from 'components/core';
import { RouterRegistry2b } from '../router-manager-registry';

import core from 'routes/router-core';
import search from 'routes/search/router-search';
import user from 'routes/user/router-user';
import auth from 'routes/auth/router-auth';
import expertBase from 'routes/expert-base/router-eb';
import router2bprofile from 'routes/2b-profile/router-2bprofile';

const routes = [
  ...RouterRegistry2b,
  // ...RouterRegistry,
  core.IndexPage,

  // search
  search.UniSearch,

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

  // 2b profile
  router2bprofile.TobProfile,
  router2bprofile.Addition,

  // System Default.
  core.Error404, // must be last one.
];

export default ({ history, app }) => {
  return <ConnectedRouter {...{ history, app, routes }} />;
};
