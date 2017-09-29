import * as searchService from 'services/search';
import * as trendService from '../services/trend-prediction-service';

export default {

  namespace: 'topicTrend',

  state: {
    trendInfo: {},
    relatedPapers: {},
    relatedExperts: {},
    mostCitedPapers:{},
  },


  subscriptions: {},

  effects: {
    * searchTrendByMention({ payload }, { call, put }) {
      const { query } = payload;
      const data = yield call(trendService.searchTrendByMention, query);
      yield put({ type: 'trendSuccess', payload: { data } });
    },

    * searchExpert({ payload }, { call, put }) {
      const { query, offset, size, sort } = payload;
      const data = yield call(trendService.searchPersons, { query, offset, size, sort });
      yield put({ type: 'expertsSuccess', payload: { data } });
    },

    * searchPapers({ payload }, { call, put }) {
      const { query, offset, size, sort } = payload;
      const { data } = yield call(searchService.searchPublications, { query, offset, size, sort });
      yield put({ type: 'papersSuccess', payload: { data } });
    },

    * mostcitedpapers({ payload }, { call, put }) {
      const { query, offset, size, sort } = payload;
      const { data } = yield call(searchService.searchPublications, { query, offset, size, sort });
      yield put({ type: 'mostcitedpapersSuccess', payload: { data } });
    },
  },

  reducers: {
    trendSuccess(state, { payload: { data } }) {
      return { ...state, trendInfo: data.data.data };
    },

    expertsSuccess(state, { payload: { data } }) {
      return { ...state, relatedExperts: data.data };
    },

    papersSuccess(state, { payload: { data } }) {
      return { ...state, relatedPapers: data };
    },

    mostcitedpapersSuccess(state, { payload: { data } }) {
      return { ...state, mostCitedPapers: data };
    },
  },
};
