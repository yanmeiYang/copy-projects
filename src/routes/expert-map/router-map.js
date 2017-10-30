/**
 *  Created by BoGao on 2017-07-14;
 *  Refactored by BoGao on 2017-09-07; dva@2.0 react-router-4
 */
export default {
  ExpertMap: {
    path: '/expert-map',
    models: () => [import('models/expert-map')],
    component: () => import('./ExpertMapPage'),
  },

  ExpertMapGoogle: {
    path: '/expert-googlemap',
    models: () => [import('models/expert-map')],
    component: () => import('./ExpertGoogleMapPage'),
  },

  ExpertTrajectoryPage: {
    path: '/expert-trajectory',
    models: () => [import('models/expert-trajectory')],
    component: () => import('routes/expert-trajectory/ExpertTrajectoryPage'),
  },

  ExpertHeatmapPage: {
    path: '/expert-heatmap',
    models: () => [import('models/expert-trajectory')],
    component: () => import('routes/expert-trajectory/ExpertHeatmapPage'),
  },

  // ExpertMapDispatch: {
  //   path: '/dispatch-expert-map',
  //   models: () => [import('models/expert-map')],
  //   component: () => import('./expert-map-dispatch'),
  // },
};
