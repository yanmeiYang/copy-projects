/**
 * Created by yutao on 2017/9/3.
 */
export default {
  DataCleaningClustering: app => ({
    path: 'clustering',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('./clustering/'));
        }, 'clustering');
    },
  }),
};
