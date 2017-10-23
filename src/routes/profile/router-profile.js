/**
 * Created by yangyanmei on 17/10/17.
 */
export default {
  ProfileMerge: {
    path: '/profile/merge/:id/:name',
    models: () => [
      import('models/merge'),
    ],
    component: () => import('./ProfileMergePage'),
  },

};
