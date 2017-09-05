/**
 *  Created by BoGao on 2017-07-14;
 */
import { registerModel } from '../../utils';

export default {

  ExpertSearch: app => ({
    path: 'search/:query/:offset/:size',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../../models/search'));
        registerModel(app, require('../../models/expert-map'));
        cb(null, require('./'));
      }, 'search');
    },
  }),

  UniSearch: app => ({
    path: 'uniSearch/:query/:offset/:size',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../../models/search'));
        registerModel(app, require('../../models/knowledge-graph'));
        registerModel(app, require('../../models/expert-base/expert'));
        cb(null, require('./uni-search'));
      }, 'search');
    },
  }),


  // show experts, deprecated.
  Experts: app => ({
    path: 'experts/:offset/:size',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../../models/search'));
        cb(null, require('./'));
      }, 'search');
    },
  }),

};
