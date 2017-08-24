/**
 * Created by ranyanchuan on 2017/8/18.
 */
import { registerModel } from '../../utils';

export default {

  ThirdLogin: app => ({
    path: 'auth',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../../models/auth/auth'));
        cb(null, require('./'));
      }, 'thirdLogin');
    },
  }),

};

