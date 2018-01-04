export default {
  Reports: {
    path: '/reports/:id',
    models: () => [import('models/reco/recoModels')],
    component: () => import('routes/reco/reports'),
  },
  ProjectList: {
    path: '/project',
    models: () => [import('models/reco/recoModels')],
    component: () => import('routes/reco/projectList'),
  },
  CreateProject: {
    path: '/createproject',
    models: () => [import('models/reco/recoModels')],
    component: () => import('routes/reco/createProject'),
  },
  ViewPerson: {
    path: '/viewperson/:id',
    component: () => import('routes/reco/viewperson'),
  },
  EditProject: {
    path: '/editproject/:id',
    models: () => [import('models/reco/recoModels')],
    component: () => import('routes/reco/editProject'),
  },
  SendEmail: {
    path: '/sendemail/:id',
    models: () => [import('models/reco/recoModels')],
    component: () => import('routes/reco/sendEmail'),
  },
  SendTest: {
    path: '/sendtest/:id',
    models: () => [import('models/reco/recoModels')],
    component: () => import('routes/reco/sendTest'),
  },
};

