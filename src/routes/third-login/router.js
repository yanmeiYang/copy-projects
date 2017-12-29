/**
 * Created by ranyanchuan on 2017/8/18.
 */
export default {
  ThirdLogin: {
    path: '/auth',
    models: () => [import('models/auth')],
    component: () => import('./'),
  },
};

