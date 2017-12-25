export default {
  TalentHr: {
    path: '/talent',
    // models: () => [import('models/search-suggest')],
    component: () => import('routes/talentHR'),
  },
  TalentSearchPage: {
    path: '/talent/search/:offset/:size/',
    models: () => [
      import('models/search'),
      import('models/expert-base/expert-base'),
      import('models/person-comments'),
      import('models/common/common-labels'),
      import('models/common/common-follow'),
      import('models/search-suggest'),
      import('models/search-venue'),
    ],
    component: () => import('routes/talentHR/talentSearch/talentSearchPage'),
  },
};

