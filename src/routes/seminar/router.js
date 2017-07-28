/**
 *  Created by BoGao on 2017-07-15;
 */
import { registerModel } from '../../utils';

export default {

  Seminar: app => ({
    path: 'seminar',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../../models/common/universal-config'));
        registerModel(app, require('../../models/seminar'));
        cb(null, require('./'));
      }, 'seminar');
    },
  }),

  SeminarWithId: app => ({
    path: 'seminar/:id',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../../models/seminar'));
        cb(null, require('./detailSeminar'));
      }, 'seminar');
    },
  }),

  SeminarMy: app => ({
    path: 'seminar-my',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../../models/common/universal-config'));
        registerModel(app, require('../../models/seminar'));
        cb(null, require('./mySeminars'));
      }, 'seminar');
    },
  }),

  SeminarPost: app => ({
    path: 'seminar-post',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../../models/seminar'));
        cb(null, require('./addSeminar'));
      }, 'seminar');
    },
  }),

  SeminarRating: app => ({
    path: 'seminar/expert-rating/:id',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../../models/seminar'));
        cb(null, require('./expertRatingPage'));
      }, 'seminar');
    },
  }),

  // TODO change to seminar statistics.
  Statistic: app => ({
    path: 'statistics',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../../models/seminar'));
        registerModel(app, require('../../models/statistics/statistics'));
        cb(null, require('../statistics'));
      }, 'seminar');
    },
  }),

  StatisticDetail: app => ({
    path: 'statistics/detail',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../../models/seminar'));
        registerModel(app, require('../../models/statistics/statistics'));
        cb(null, require('../statistics/detail'));
      }, 'seminar');
    },
  }),


};

