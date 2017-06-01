import pathToRegexp from 'path-to-regexp'
import * as searchService from '../services/search';

export default {

  namespace: 'search',

  state: {
    results: [],
    offset: 0,
    query: null,
    seminars: [],
    aggs: [],
    loading: false,
    filters: {},
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
        if (location.pathname === '/') {
          dispatch({ type: 'getSeminars', payload: { offset: 0, size: 5 } });
        }
        const match = pathToRegexp('/search/:query/:offset/:size').exec(location.pathname);
        if (match) {
          const query = decodeURIComponent(match[1]);
          const offset = parseInt(match[2], 10);
          const size = parseInt(match[3], 10);
          dispatch({ type: 'searchPerson', payload: { query, offset, size } });
          dispatch({ type: 'setParams', payload: { query, offset, size } });
          dispatch({ type: 'searchPersonAgg', payload: { query, offset, size } });
        }
      });
    },
  },

  effects: {
    *searchPerson({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'showLoading' });
      const { query, offset, size, filters } = payload;
      const { data } = yield call(searchService.searchPerson, query, offset, size, filters);
      yield put({ type: 'searchPersonSuccess', payload: { data } });
    },
    *searchPersonAgg({ payload }, { call, put }) {
      const { query, offset, size, filters } = payload;
      const { data } = yield call(searchService.searchPersonAgg, query, offset, size, filters);
      yield put({ type: 'searchPersonAggSuccess', payload: { data } });
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

    updateFilters(state, { payload: { filters } }) {
      const newFilters = { ...filters };
      // filters.forEach((f) => {
      //   newFilters.push(f);
      // });
      return { ...state, filters: newFilters };
    },

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

    searchPersonAggSuccess(state, { payload: { data } }) {
      const { aggs } = data;
      return { ...state, aggs };
    },

    getSeminarsSuccess(state, { payload: { data } }) {
      return { ...state, seminars: data };
    },

    showLoading(state) {
      console.log('show loading');
      return {
        ...state,
        loading: true,
      };
    },
    hideLoading(state) {
      return {
        ...state,
        loading: false,
      };
    },

  },

};
