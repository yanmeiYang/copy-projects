/**
 *  Created by BoGao on 2017-07-14;
 */
import { registerModel } from '../../utils';

export default {

  ExpertMap: app => ({
    path: 'expert-map',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../../models/expert-map'));
        cb(null, require('./ExpertMapPage'));
      }, 'map');
    },
  }),

  ExpertMapGoogle: app => ({
    path: 'expert-googlemap',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../../models/expert-map'));
        cb(null, require('./ExpertGoogleMapPage')); // What the
      }, 'map-google');
    },
  }),

  ExpertTrajectoryPage: app => ({
    path: 'expert-trajectory',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../../models/expert-trajectory'));
        cb(null, require('../expert-trajectory/ExpertTrajectoryPage'));
      }, 'expert-trajectory');
    },
  }),

  ExpertHeatmapPage: app => ({
    path: 'expert-heatmap',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../../models/expert-trajectory'));
        cb(null, require('../expert-trajectory/ExpertHeatmapPage'));
      }, 'expert-heatmap');
    },
  }),

  ExpertMapDispatch: app => ({
    path: 'expert-map-dispatch',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../../models/expert-map'));
        cb(null, require('../expert-map/expert-map-dispatch'));
      }, 'map-dispatch');
    },
  }),
};
