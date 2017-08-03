import pathToRegexp from 'path-to-regexp';
import * as searchService from '../services/search';
import { sysconfig } from '../systems';

export default {

  namespace: 'search',

  state: {
    results: [],
    aggs: [],
    filters: {},

    query: null,
    offset: 0,
    sortKey: 'contrib',
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      pageSize: 20,
      total: null,
    },

    isMotion: localStorage.getItem('antdAdminUserIsMotion') === 'true',
    loading: false, // TODO remove loading, use global loading compoennt.

    seminars: [], // TODO move out.
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location, query) => {
        // if (location.pathname === '/') {
        //   dispatch({ type: 'getSeminars', payload: { offset: 0, size: 5 } });
        // }
        let match = pathToRegexp('/(uni)?search/:query/:offset/:size').exec(location.pathname);
        if (match) {
          const keyword = decodeURIComponent(match[2]);
          const offset = parseInt(match[3], 10);
          const size = parseInt(match[4], 10);
          // update fillings.
          dispatch({ type: 'setParams', payload: { query: keyword, offset, size } });
          console.log('Success::::sdfsdf ', keyword);
          dispatch({ type: 'app/setQueryInHeaderIfExist', payload: { query: keyword } });

          // Accept query: eb = expertBaseID.
          // const filters = {};
          // if (location.query) {
          //   if (location.query.eb) {
          //     sysconfig.ExpertBases.map((expertBase) => {
          //       if (expertBase.id === location.query.eb) {
          //         filters.eb = expertBase;
          //         return false;
          //       }
          //       return true;
          //     });
          //   }
          // }

          // dispatch({ type: 'app/setQuery', query: keyword });
          // dispatch({ type: 'searchPerson', payload: { query: keyword, offset, size, filters } });
          // dispatch({
          //   type: 'searchPersonAgg',
          //   payload: { query: keyword, offset, size, filters },
          // });
          // return;
        }
      });
    },
  },

  effects: {
    * searchPerson({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const { query, offset, size, filters, sort } = payload;
      const { data } = yield call(searchService.searchPerson, query, offset, size, filters, sort);
      yield put({ type: 'updateFilters', payload: { filters } });
      yield put({ type: 'updateSortKey', payload: { sort } });
      yield put({ type: 'searchPersonSuccess', payload: { data, query } });
    },
    * searchPersonAgg({ payload }, { call, put }) {
      const { query, offset, size, filters } = payload;
      const { data } = yield call(searchService.searchPersonAgg, query, offset, size, filters);
      yield put({ type: 'searchPersonAggSuccess', payload: { data } });
    },
    * getSeminars({ payload }, { call, put }) {
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
      return { ...state, filters };
    },

    updateSortKey(state, { payload: { key } }) {
      // console.log('reducers, update sort key : ', key);
      return { ...state, sortKey: key || '' };
    },

    searchPersonSuccess(state, { payload: { data, query } }) {
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
