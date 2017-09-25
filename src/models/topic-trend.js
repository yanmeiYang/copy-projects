/** Created by Bo Gao on 2017-06-07 */
import * as trendService from '../services/trend-prediction-service';

const cache = {};

export default {

  namespace: 'topicTrend',

  state: {
    personId: '',
    personInfo: {},
    geoData: {},
    // for rightInfoZone,
    rightInfoType: 'global', // global, person, cluster
    infoZoneIds: '', // ids as string splitted by ',' or one id.;
    clusterPersons: [],
  },


  subscriptions: {},

  effects: {
    * searchTrendByMention({ payload }, { call, put }) {
      console.log('&&&&&&&&&&&&&&&&&&&&&');
      const { query } = payload;
      const data = yield call(trendService.searchTrendByMention, query);
      yield put({ type: 'trendSuccess', payload: { data } });
    },

  },

  reducers: {
    getPersonInfoSuccess(state, { payload: { data } }) {
      return { ...state, personInfo: data.data };
    },

  },
};
