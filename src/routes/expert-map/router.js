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
        cb(null, require('./'));
      }, 'map');
    },
  }),

  ExpertMapGoogle: app => ({
    path: 'expert-googlemap',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../../models/expert-map'));
        cb(null, require('../expert-map/expert-googlemap'));
      }, 'map-google');
    },
  }),

  ExpertTrajectoryPage: app => ({
    path: 'expert-trajectory',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        // registerModel(app, require('../../models/expert-map'));
        cb(null, require('../expert-trajectory/ExpertTrajectoryPage'));
      }, 'map');
    },
  }),


};
