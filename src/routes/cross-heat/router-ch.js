/**
 * Created by ranyanchuan on 2017/8/18.
 */
export default {
  Cross: {
    path: '/cross',
    models: () => [import('models/cross-heat')],
    component: () => import('routes/cross-heat/cross'),
  },
  Heat: {
    path: '/heat/:id',
    models: () => [import('models/cross-heat')],
    component: () => import('routes/cross-heat/heat'),
  },
  crossHeatList: {
    path: '/heat/querys',
    models: () => [import('models/cross-heat')],
    component: () => import('routes/cross-heat/crossHeatList'),
  },
  crossIndex: {
    path: '/cross/index',
    models: () => [import('models/cross-heat')],
    component: () => import('routes/cross-heat/index'),
  },
};
