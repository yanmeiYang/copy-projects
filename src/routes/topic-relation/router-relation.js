/**
 *  Created by LuoGan on 2017-11-25;
 */
export default {
  RelationPage: {
    path: '/topic-relation',
    models: () => [import('models/expert-map')],
    component: () => import('./'),
  },
};
