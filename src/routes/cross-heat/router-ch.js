/**
 * Created by ranyanchuan on 2017/8/18.
 */
export default {
  Cross: {
    path: '/cross',
    models: () => [import('models/cross-heat')],
    component: () => import('routes/cross-heat/cross'),
  },
};
