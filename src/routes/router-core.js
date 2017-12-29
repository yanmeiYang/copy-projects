/**
 *  Created by BoGao on 2017-07-15;
 *  Refactored by BoGao on 2017-09-07; dva@2.0 react-router-4
 */
export default {

  IndexPage: {
    path: '/',
    models: () => [import('models/search-suggest')],
    component: () => import('routes/IndexPage'),
  },

  // Last one, without path.
  Error404: {
    component: () => import('routes/error'),
  },

  // Other routes.

  RelationGraphPage: {
    path: '/relation-graph-page',
    models: () => [import('models/vis/vis-research-interest')],
    component: () => import('routes/relation-graph/RelationGraphPage'),
  },

  KnowledgeGraph: {
    path: '/knowledge-graph',
    models: () => [import('models/knowledge-graph')],
    component: () => import('routes/knowledge-graph/KnowledgeGraphPage'),
  },

  RanksHelp: {
    path: '/help',
    component: () => import('./help'),
  },

};

