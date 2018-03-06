/**
 *  Created by BoGao on 2017-07-15;
 *  Refactored by BoGao on 2017-09-07; dva@2.0 react-router-4
 */
export default {
  Org: {
    path: '/expertbase',
    models: () => [import('models/managementOrg/magOrgModels')],
    component: () => import('routes/managementOrg/orglist'),
  },
};

