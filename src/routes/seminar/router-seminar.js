/**
 *  Created by BoGao on 2017-07-15;
 *  Refactored by BoGao on 2017-09-07; dva@2.0 react-router-4
 */
export default {

  Seminar: {
    path: '/seminar',
    models: () => [
      import('models/common/universal-config'),
      import('models/seminar'),
    ],
    component: () => import('./'),
  },

  SeminarWithId: {
    path: '/seminar/:id',
    models: () => [import('models/seminar')],
    component: () => import('./detailSeminar'),
  },

  SeminarMy: {
    path: '/seminar-my',
    models: () => [
      import('models/common/universal-config'),
      import('models/seminar'),
    ],
    component: () => import('./mySeminars'),
  },

  SeminarPost: {
    path: '/seminar-post',
    models: () => [
      import('models/person'),
      import('models/seminar'),
    ],
    component: () => import('./addSeminar'),
  },

  SeminarByEdit: {
    path: '/seminar-edit/:id',
    models: () => [
      import('models/person'),
      import('models/seminar'),
    ],
    component: () => import('./editSeminar'),
  },

  SeminarRating: {
    path: '/seminar/expert-rating/:id',
    models: () => [
      import('models/seminar'),
    ],
    component: () => import('./expertRatingPage'),
  },

  // TODO change to seminar statistics.
  Statistic: {
    path: '/statistics',
    models: () => [
      import('models/seminar'),
      import('models/statistics/statistics'),
    ],
    component: () => import('../statistics'),
  },

  StatisticDetail: {
    path: '/statistics/detail',
    models: () => [
      import('models/seminar'),
      import('models/statistics/statistics'),
    ],
    component: () => import('../statistics/detail'),
  },

};
