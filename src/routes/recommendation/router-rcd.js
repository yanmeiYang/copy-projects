/**
 *  Created by BoGao on 2017-07-14;
 */
import { registerModel } from '../../utils';

export default {

  RecommendationHome: app => ({
    path: 'rcd',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../../models/recommendation/recommendation'));
        cb(null, require('./RecommendationPage'));
      }, 'recommendation');
    },
  }),

  ProjectPage: app => ({
    path: 'rcd/projects/:id',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../../models/recommendation/recommendation'));
        cb(null, require('./projects/ProjectPage'));
      }, 'recommendation');
    },
  }),

  ProjectTaskPage: app => ({
    path: 'rcd/project/tasks/:id',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../../models/recommendation/recommendation'));
        cb(null, require('./projects/ProjectTaskPage'));
      }, 'recommendation');
    },
  }),

  //
  // ExpertTrajectoryPage: app => ({
  //   path: 'expert-trajectory',
  //   getComponent(nextState, cb) {
  //     require.ensure([], (require) => {
  //       registerModel(app, require('../../models/expert-trajectory'));
  //       cb(null, require('../expert-trajectory/ExpertTrajectoryPage'));
  //     }, 'expert-trajectory');
  //   },
  // }),
  //
  // ExpertHeatmapPage: app => ({
  //   path: 'expert-heatmap',
  //   getComponent(nextState, cb) {
  //     require.ensure([], (require) => {
  //       registerModel(app, require('../../models/expert-trajectory'));
  //       cb(null, require('../expert-trajectory/ExpertHeatmapPage'));
  //     }, 'expert-heatmap');
  //   },
  // }),


};