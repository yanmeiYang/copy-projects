/**
 *  Created by BoGao on 2017-07-17;
 */
import { registerModel } from '../../utils';

export default {

  TrendPredictionPage: app => ({
    path: 'trend-prediction',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        // registerModel(app, require('../../models/expert-map'));
        cb(null, require('./'));
      }, 'trend-prediction');
    },
  }),

};
