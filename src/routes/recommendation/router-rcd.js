/**
 *  Created by BoGao on 2017-07-14;
 *  Refactored by BoGao on 2017-09-07; dva@2.0 react-router-4
 */
export default {

  RecommendationHome: {
    path: '/rcd',
    models: () => [import('models/recommendation/recommendation')],
    component: () => import('./RecommendationPage'),
  },

  ProjectPage: {
    path: '/rcd/projects/:id',
    models: () => [import('models/recommendation/recommendation')],
    component: () => import('./projects/ProjectPage'),
  },

  ProjectTaskPage: {
    path: '/rcd/project/tasks/:id',
    models: () => [import('models/recommendation/recommendation')],
    component: () => import('./projects/ProjectTaskPage'),
  },

};
