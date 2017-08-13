/**
 *  Created by BoGao on 2017-07-15;
 */
import { registerModel } from '../../utils';

export default {

  // TobIndex: app => ({
  //   path: '2b',
  //   getComponent(nextState, cb) {
  //     require.ensure([], (require) => {
  //       // registerModel(app, require('../../models/auth'));
  //       cb(null, require('./login/'));
  //     }, 'tob');
  //   },
  // }),

  Login2b: app => ({
    path: 'login',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../../models/auth'));
        cb(null, require('./login/'));
      }, 'tob');
    },
  }),

  EmailTemplate: app => ({
    path: 'email-template',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../../models/2b/2bmodel'));
        cb(null, require('./emailTemplate'));
      }, 'tob');
    },
  }),


};

