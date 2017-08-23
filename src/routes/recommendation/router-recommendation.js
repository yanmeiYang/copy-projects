/**
 *  Created by BoGao on 2017-07-14;
 */
import { registerModel } from '../../utils';

export default {

  RecommendationHome: app => ({
    path: 'rcd',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        // registerModel(app, require('../../models/expert-map'));
        cb(null, require('./RecommendationPage'));
      }, 'recommendation');
    },
  }),

  // ExpertMapGoogle: app => ({
  //   path: 'expert-googlemap',
  //   getComponent(nextState, cb) {
  //     require.ensure([], (require) => {
  //       registerModel(app, require('../../models/expert-map'));
  //       cb(null, require('../expert-map/expert-googlemap'));
  //     }, 'map-google');
  //   },
  // }),
  //
  // ExpertTrajectoryPage: app => ({
  //   path: 'expert-trajectory',
  //   getComponent(nextState, cb) {
  //     require.ensure([], (require) => {
  //       registerModel(app, require('../../models/expert-trajectory'));
  //       cb(null, require('../expert-trajectory/ExpertTrajectoryPage'));
  //     }, 'expert-trajectory');
  //   },
  // }),
  //
  // ExpertHeatmapPage: app => ({
  //   path: 'expert-heatmap',
  //   getComponent(nextState, cb) {
  //     require.ensure([], (require) => {
  //       registerModel(app, require('../../models/expert-trajectory'));
  //       cb(null, require('../expert-trajectory/ExpertHeatmapPage'));
  //     }, 'expert-heatmap');
  //   },
  // }),


};
