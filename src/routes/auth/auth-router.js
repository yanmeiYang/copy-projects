/**
 *  Created by BoGao on 2017-08-13;
 */
import { registerModel } from '../../utils';

export default {

  Login: app => ({
    path: 'login',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../../models/auth'));
        cb(null, require('../login'));
      }, 'auth');
    },
  }),

};

