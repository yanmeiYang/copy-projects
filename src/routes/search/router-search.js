/**
 *  Created by BoGao on 2017-07-14;
 *  Refactored by BoGao on 2017-09-07; dva@2.0 react-router-4
 */
export default {

  // Deprecated
  ExpertSearch: {
    path: '/search/:query/:offset/:size',
    models: () => [
      import('models/search'),
      import('models/expert-map'),
    ],
    component: () => import('routes/search'),
  },

  // TODO dynamic load models using plugin.
  UniSearch: {
    path: '/uniSearch/:query/:offset/:size',
    models: () => [
      import('models/search'),
      import('models/expert-base/expert-base'),
      import('models/person-comments'),
      import('models/common/common-labels'),
      import('models/search-suggest'),
      import('models/search-venue'),
    ],
    component: () => import('routes/search/SearchPage'),
  },

};
