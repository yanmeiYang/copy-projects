/**
 *  Created by BoGao on 2017-07-14;
 *  Refactored by BoGao on 2017-09-07; dva@2.0 react-router-4
 */
export default {

  AnnotatePersonProfile: {
    path: '/data-annotation/profile/:id',
    models: () => [
       import('models/person'),
    ],
    component: () => import('routes/data-annotation/AnnotatePersonProfile'),
  },

};
