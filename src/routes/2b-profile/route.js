/**
 * Created by yangyanmei on 17/8/21.
 */
import { registerModel } from '../../utils';

export default {

  TobProfile: app => ({
    path: '/tobprofile',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../../models/2b-profile/2b-profile'));
        cb(null, require('./index'));
        // cb(null, require('./editableTable'));
      }, '2bProfile');
    },
  }),
  Addition: app => ({
    path: '/addition',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../../models/2b-profile/2b-profile'));
        cb(null, require('./additionProfile'));
      }, '2bProfile');
    },
  }),
};

