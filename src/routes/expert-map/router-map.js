/**
 *  Created by BoGao on 2017-07-14;
 *  Refactored by BoGao on 2017-09-07; dva@2.0 react-router-4
 */
import { applyPluginModules } from 'themes';

const routerConfig = {
  ExpertMap: {
    path: '/expert-map',
    models: () => [
      import('models/expert-map'),
      import('models/expert-trajectory'),
    ],
    component: () => import('./ExpertMapPage'),
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

};


export default routerConfig;
// export default applyPluginModules(routerConfig);
