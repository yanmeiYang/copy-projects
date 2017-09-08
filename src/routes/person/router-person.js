/**
 *  Created by BoGao on 2017-07-14;
 *  Refactored by BoGao on 2017-09-07; dva@2.0 react-router-4
 */
export default {
  Person: {
    path: '/person/:id',
    models: () => [
      import('models/seminar'),
      import('models/person'),
      import('models/publications'),
      import('models/vis/vis-research-interest'),
    ],
    component: () => import('./'),
  },
};
