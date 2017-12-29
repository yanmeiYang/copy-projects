/**
 * Created by yangyanmei on 17/8/21.
 */
export default {

  TobProfile: {
    path: '/tobprofile',
    models: () => [import('models/2b-profile/2b-profile')],
    component: () => import('./'),
  },

  Addition: {
    path: '/addition',
    models: () => [import('models/2b-profile/2b-profile')],
    component: () => import('./additionProfile'),
  },

};
