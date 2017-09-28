/** Created by Bo Gao on 2017-06-07 */
import * as trendService from '../services/trend-prediction-service';

const cache = {};

export default {

  namespace: 'topicTrend',

  state: {
    trendInfo: {},
  },


  subscriptions: {},

  effects: {
    * searchTrendByMention({ payload }, { call, put }) {
      const { query } = payload;
      const data = yield call(trendService.searchTrendByMention, query);
      yield put({ type: 'trendSuccess', payload: { data } });
    },

  },

  reducers: {
    trendSuccess(state, { payload: { data } }) {
      return { ...state, trendInfo: data.data.data };
    },

  },
};
