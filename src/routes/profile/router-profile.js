/**
 * Created by yangyanmei on 17/10/17.
 */
export default {
  ProfileMerge: {
    path: '/profile/merge/:name',
    models: () => [
      import('models/search'),
      import('models/merge'),
    ],
    component: () => import('./ProfileMergePage'),
  },

};
