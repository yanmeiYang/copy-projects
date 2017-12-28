/**
 * Created by ranyanchuan on 2017/8/18.
 */
export default {
  CrossReport: {
    path: '/cross/report/:id',
    models: () => [import('models/cross-heat')],
    component: () => import('routes/cross-heat/report'),
  },
  CrossHeat: {
    path: '/cross/heat/:id',
    models: () => [import('models/cross-heat')],
    component: () => import('routes/cross-heat/heat'),
  },
  CrossTaskList: {
    path: '/cross/taskList',
    models: () => [import('models/cross-heat')],
    component: () => import('routes/cross-heat/taskList'),
  },
  CrossIndex: {
    path: '/cross/index',
    models: () => [import('models/cross-heat')],
    component: () => import('routes/cross-heat/index'),
  },

  CrossStartTask: {
    path: '/cross/startTask',
    models: () => [import('models/cross-heat')],
    component: () => import('routes/cross-heat/startTask'),
  },

  CrossReportExport: {
    path: '/cross/reportExport/:id',
    models: () => [import('models/cross-heat')],
    component: () => import('routes/cross-heat/reportExport'),
  },
};
