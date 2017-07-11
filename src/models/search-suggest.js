import pathToRegexp from 'path-to-regexp';
import * as searchService from '../services/search';
import { sysconfig } from '../systems';

export default {

  namespace: 'searchSuggest',

  state: {
    test: 'sdf',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location, query) => {
      });
    },
  },

  effects: {
    *searchPerson({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const { query, offset, size, filters, sort } = payload;
      const { data } = yield call(searchService.searchPerson, query, offset, size, filters, sort);
      yield put({ type: 'searchPersonSuccess', payload: { data } });
    },
  },

  reducers: {
    searchPersonSuccess(state, { payload: { data } }) {
      const { result, total } = data;
      const current = Math.floor(state.offset / state.pagination.pageSize) + 1;
      return {
        ...state,
        results: result,
        pagination: { pageSize: state.pagination.pageSize, total, current },
        loading: false,
      };
    },
  },

};
