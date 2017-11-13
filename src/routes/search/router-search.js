/**
 *  Created by BoGao on 2017-07-14;
 *  Refactored by BoGao on 2017-09-07; dva@2.0 react-router-4
 */
export default {

  // 原来是CCF的Search，现在改成用GraphQL的CCF Search。
  ExpertSearch: {
    path: '/search/:query/:offset/:size',
    models: () => [
      import('models/search'),
      import('models/expert-map'),
    ],
    component: () => import('routes/search'),
  },

  // TODO dynamic load models using sysconfig.
  UniSearch: {
    path: '/uniSearch/:query/:offset/:size',
    models: () => [
      import('models/search'),
      import('models/expert-base/expert-base'),
      import('models/person-comments'),
      import('models/common/common-labels'),
      import('models/search-suggest'),
      import('models/export-experts'),
      import('models/search-venue'),
    ],
    component: () => import('routes/search/SearchPage'),
  },

  // ExpertSearch: app => ({
  //   path: 'search/:query/:offset/:size',
  //   getComponent(nextState, cb) {
  //     require.ensure([], (require) => {
  //       registerModel(app, require('../../models/search'));
  //       registerModel(app, require('../../models/expert-map'));
  //       cb(null, require('./'));
  //     }, 'search');
  //   },
  // }),
  //
  // UniSearch: app => ({
  //   path: 'uniSearch/:query/:offset/:size',
  //   getComponent(nextState, cb) {
  //     require.ensure([], (require) => {
  //       registerModel(app, require('../../models/search'));
  //       registerModel(app, require('../../models/knowledge-graph'));
  //       registerModel(app, require('../../models/expert-base/expert'));
  //       cb(null, require('./uni-search'));
  //     }, 'search');
  //   },
  // }),
  //
  //
  // // show experts, deprecated.
  // Experts: app => ({
  //   path: 'experts/:offset/:size',
  //   getComponent(nextState, cb) {
  //     require.ensure([], (require) => {
  //       registerModel(app, require('../../models/search'));
  //       cb(null, require('./'));
  //     }, 'search');
  //   },
  // }),

};
