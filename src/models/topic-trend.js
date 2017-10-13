import * as trendService from '../services/trend-prediction-service';

export default {

  namespace: 'topicTrend',

  state: {
    paper: {},
  },


  subscriptions: {},

  effects: {
    * searchPubById({ payload }, { call, put }) { //暂时没有被用到
      const { query } = payload;
      const data = yield call(trendService.searchPubById, query);
      yield put({ type: 'searchPubByIdSuccess', payload: { data } });
    },
  },

  reducers: {
    searchPubByIdSuccess(state, { payload: { data } }) {
      return { ...state, trendInfo: data };
    },
  },
};
