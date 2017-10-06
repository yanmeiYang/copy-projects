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
    models: () => [import('models/cross-heat'), import('models/knowledge-graph')],
    component: () => import('routes/cross-heat/heat'),
  },
};
