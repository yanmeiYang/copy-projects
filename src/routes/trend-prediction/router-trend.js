/**
 *  Created by BoGao on 2017-07-17;
 *  Refactored by BoGao on 2017-09-07; dva@2.0 react-router-4
 */
export default {
  TrendPredictionPage: {
    path: '/trend-prediction',
    models: () => [import('models/expert-map')],
    component: () => import('./'),
  },
};
