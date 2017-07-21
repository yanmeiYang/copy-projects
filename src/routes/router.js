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
        cb(null, require('./relation-graph-page'));
      }, 'NormalPages');
    },
  }),

  KnowledgeGraph: app => ({
    path: '/knowledge-graph',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../models/knowledge-graph'));
        cb(null, require('./KnowledgeGraphPage'));
      }, 'NormalPages');
    },
  }),

};

