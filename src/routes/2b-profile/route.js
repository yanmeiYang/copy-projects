/**
 * Created by yangyanmei on 17/8/21.
 */
import { registerModel } from '../../utils';

export default {

  TobProfile: app => ({
    path: '/tobprofile',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('./index'));
      }, '2bProfile');
    },
  }),
};

