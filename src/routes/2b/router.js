/**
 *  Created by BoGao on 2017-07-15;
 */
import { registerModel } from '../../utils';

export default {
  Login2b: app => ({
    path: 'login',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../../models/login'));
        cb(null, require('./login/'));
      }, 'tob');
    },
  }),
  EmailTemplate: app => ({
    path: 'email-template',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../../models/2b'));
        cb(null, require('./emailTemplate'));
      }, 'tob');
    },
  }),


};

