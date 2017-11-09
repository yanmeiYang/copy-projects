/*
   Used in kgSearchBox.
 */
import * as suggestService from 'services/search-suggest';
import { takeLatest } from './helper';

export default {
  namespace: 'searchSuggest',

  state: {},

  subscriptions: {
    // setup({ dispatch, history }) {
    //   history.listen((location, query) => {
    //   });
    // },
  },

  effects: {
    suggest: [function* ({ payload }, { call, put }) {
      const { query } = payload;
      const data = yield call(suggestService.suggest, query);
      // yield put({ type: 'searchPersonSuccess', payload: { data } });
      return data;
    }, takeLatest],
  },

  reducers: {
    // searchPersonSuccess(state, { payload: { data } }) {
    //   const { result, total } = data;
    //   const current = Math.floor(state.offset / state.pagination.pageSize) + 1;
    //   return {
    //     ...state,
    //     results: result,
    //     pagination: { pageSize: state.pagination.pageSize, total, current },
    //     loading: false,
    //   };
    // },
  },

};
