/**
 * Created by yangyanmei on 17/6/16.
 */
import { routerRedux } from 'dva/router';
import pathToRegexp from 'path-to-regexp';
import { config } from '../../utils';
import * as seminarService from '../../services/seminar';
import { sysconfig } from 'systems';

export default {
  namespace: 'statistics',
  state: {
    activity: [],
    author: [],
    seminarsByOrgAndCat: [],
    sizePerPage: 20,
    loading: false,
    getSeminarOffset: 0,
    getSeminarSize: 10,
  },
  subscriptions: {
    setup() {
    },
  },

  effects: {
    *getStatsOfCcfActivities({ payload }, { call, put }) {
      const { data } = yield call(seminarService.getStatsOfCcfActivities);
      yield put({ type: 'getStatsOfCcfActivitiesSuccess', payload: data });
    },
    *getSeminarsByOrgAndCat({ offset, size, payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const { data } = yield call(seminarService.getSeminar, offset, size,
        { src: sysconfig.SOURCE, ...payload });
      yield put({ type: 'getSeminarsByOrgAndCatSuccess', data, offset, size });
    },
  },
  reducers: {
    getStatsOfCcfActivitiesSuccess(state, { payload: data }) {
      return { ...state, activity: data.stats.activity, author: data.stats.author };
    },

    getSeminarsByOrgAndCatSuccess(state, { data, size }) {
      return { ...state, seminarsByOrgAndCat: data, loading: false, getSeminarSize: state.getSeminarSize + size };
    },

    showLoading(state) {
      return {
        ...state,
        loading: true,
      };
    },
  },
};
