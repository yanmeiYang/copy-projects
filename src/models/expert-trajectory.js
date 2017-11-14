/** Created by Bo Gao on 2017-06-07 */
import pathToRegexp from 'path-to-regexp';
import * as pubsService from 'services/publication';
import * as personService from 'services/person';
import * as searchService from 'services/search';
import * as traDataFindService from 'services/expert-trajectory-service';

export default {

  namespace: 'expertTrajectory',

  state: {
    trajData: {},
    results: [],
    heatData: {},
  },

  subscriptions: {},

  effects: {
    * searchPerson({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const { query, offset, size } = payload;
      const { data } = yield call(searchService.searchPerson, query, offset, size);
      yield put({ type: 'searchPersonSuccess', payload: { data, query } });
    },

    * findTrajById({ payload }, { call, put }) {
      const { personId, start, end } = payload; //注意是两边的名字要一致，否则错误
      const data = yield call(traDataFindService.findTrajPerson, personId, start, end);
      yield put({ type: 'findTrajByIdSuccess', payload: { data } });
    },

    * findTrajsByRosterId({ payload }, { call, put }) {
      const { rosterId, start, end, size } = payload;
      const data = yield call(traDataFindService.findTrajsHeat, rosterId, start, end, size);
      yield put({ type: 'findTrajsByRosterIdSuccess', payload: { data } });
    },
  },

  reducers: {
    findTrajByIdSuccess(state, { payload: { data } }) {
      return { ...state, trajData: data };
    },


    findTrajsByRosterIdSuccess(state, { payload: { data } }) {
      return { ...state, heatData: data };
    },

    searchPersonSuccess(state, { payload: { data } }) { // state?
      const { result } = data;
      return {
        ...state,
        results: result,
        loading: false,
      };
    },
  },
};
