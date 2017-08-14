/**
 *  Created by BoGao on 2017-07-15;
 */
import { registerModel } from '../utils';

export default {

  RelationGraphPage: app => ({
    path: '/relation-graph-page',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        // registerModel(app, require('./models/vis/vis-research-interest'));
        cb(null, require('./relation-graph/RelationGraphPage'));
      }, 'NormalPages');
    },
  }),

  KnowledgeGraph: app => ({
    path: '/knowledge-graph',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../models/knowledge-graph'));
        cb(null, require('./knowledge-graph/KnowledgeGraphPage'));
      }, 'NormalPages');
    },
  }),

  RanksHelp: () => ({
    path: '/help',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('./help'));
      }, 'NormalPages');
    },
  }),

};

