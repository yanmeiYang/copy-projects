import pathToRegexp from 'path-to-regexp'
import * as searchService from '../services/search';

export default {

  namespace: 'search',

  state: {
    results: [],
    offset: 0,
    query: null,
    seminars: [],
    isMotion: localStorage.getItem('antdAdminUserIsMotion') === 'true',
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      pageSize: 30,
      total: null,
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      history.listen((location) => {
        console.log(location);
        if (location.pathname === '/') {
          dispatch({ type: 'getSeminars', payload: { offset: 0, size: 10 } });
        }
        const match = pathToRegexp('/search/:query/:offset/:size').exec(location.pathname);
        if (match) {
          const query = decodeURIComponent(match[1]);
          const offset = parseInt(match[2], 10);
          const size = parseInt(match[3], 10);
          dispatch({ type: 'searchPerson', payload: { query, offset, size } });
          dispatch({ type: 'setParams', payload: { query, offset, size } });
        }
      });
    },
  },

  effects: {
    *searchPerson({ payload }, { call, put }) {  // eslint-disable-line
      const { query, offset, size } = payload;
      const { data } = yield call(searchService.searchPerson, query, offset, size);
      yield put({ type: 'searchPersonSuccess', payload: { data } });
    },
    *getSeminars({ payload }, { call, put }) {
      const { offset, size } = payload;
      const { data } = yield call(searchService.getSeminars, offset, size);
      yield put({ type: 'getSeminarsSuccess', payload: { data } });
    },
  },

  reducers: {
    setParams(state, { payload: { query, offset, size } }) {
      return { ...state, query, offset, pagination: { pageSize: size } };
    },

    searchPersonSuccess(state, { payload: { data } }) {
      const { result, total } = data;
      const current = Math.floor(state.offset / state.pagination.pageSize) + 1;
      console.log(result, total, current);
      return { ...state, results: result,  pagination: { total, current } };
    },

    getSeminarsSuccess(state, { payload: { data } }) {
      return { ...state, seminars: data };
    },
  },

};
