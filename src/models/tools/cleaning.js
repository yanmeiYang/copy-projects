import * as toolsService from '../../services/tools';

export default {

  namespace: 'dataCleaning',

  state: {
    clustering: {},
  },

  effects: {
    * loadClusteringData({ payload }, { call, put }) {
      const data = yield call(toolsService.getClustering);
      yield put({ type: 'loadClusteringSuccess', payload: { data } });
    },
  },

  reducers: {
    loadClusteringSuccess(state, { payload: { data } }) {
      return { ...state, clustering: data };
    },
  },
};
