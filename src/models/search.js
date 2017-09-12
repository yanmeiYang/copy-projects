import { sysconfig } from 'systems';
import pathToRegexp from 'path-to-regexp';
import queryString from 'query-string';
import * as searchService from 'services/search';
import * as translateService from 'services/translate';
import * as topicService from 'services/topic';

export default {

  namespace: 'search',

  state: {
    results: [],
    topic: {},
    aggs: [],
    filters: {},
    query: null,

    // use translate search?
    useTranslateSearch: sysconfig.Search_DefaultTranslateSearch,
    translatedQuery: '',

    offset: 0,
    sortKey: '',
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      pageSize: 20,
      total: null,
    },

    isMotion: localStorage.getItem('antdAdminUserIsMotion') === 'true',

    seminars: [], // TODO move out.
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname, search }) => {
        // const query = queryString.parse(search);
        // console.log('0998', query);

        let match = pathToRegexp('/(uni)?search/:query/:offset/:size').exec(pathname);
        if (match) {
          const keyword = decodeURIComponent(match[2]);
          const offset = parseInt(match[3], 10);
          const size = parseInt(match[4], 10);
          // dispatch({ type: 'emptyResults' });
          dispatch({ type: 'updateUrlParams', payload: { query: keyword, offset, size } });
          dispatch({ type: 'app/setQueryInHeaderIfExist', payload: { query: keyword } });
        }

        //
        match = pathToRegexp('/eb/:id/:query/:offset/:size').exec(pathname);
        if (match) {
          const q = decodeURIComponent(match[2]);
          const keyword = q === '-' ? '' : q;
          const offset = parseInt(match[3], 10);
          const size = parseInt(match[4], 10);
          dispatch({ type: 'updateUrlParams', payload: { query: keyword, offset, size } });
          dispatch({ type: 'app/setQueryInHeaderIfExist', payload: { query: keyword } });
        }

      });
    },
  },

  effects: {
    * searchPerson({ payload }, { call, put, select }) {
      const { query, offset, size, filters, sort, total } = payload;
      const noTotalFilters = {};
      for (const [key, item] of Object.entries(filters)) {
        if (typeof item === 'string') {
          noTotalFilters[key] = item.split('#')[0];
        } else {
          noTotalFilters[key] = item;
        }
      }
      const useTranslateSearch = yield select(state => state.search.useTranslateSearch);
      const { data } = yield call(searchService.searchPerson,
        query, offset, size, noTotalFilters, sort, useTranslateSearch);
      yield put({ type: 'updateFilters', payload: { filters } });
      yield put({ type: 'updateSortKey', payload: { sort } });
      yield put({ type: 'searchPersonSuccess', payload: { data, query, total } });
    },

    * translateSearch({ payload }, { call, put, select }) {
      // yield put({ type: 'clearTranslateSearch' });
      const useTranslateSearch = yield select(state => state.search.useTranslateSearch);
      // console.log("==================", useTranslateSearch);
      if (useTranslateSearch) {
        const { query } = payload;
        const { data } = yield call(translateService.translateTerm, query);
        console.log('||translateSearch', payload, '>>', data);
        if (data && data.status) {
          const q = query.trim().toLowerCase();
          const en = data.en && data.en.trim().toLowerCase();
          // console.log('>>>> query', q, ' == ', en);
          if (q !== en) {
            yield put({ type: 'translateSearchSuccess', payload: { data } });
          }
        }
      }
    },

    * searchPersonAgg({ payload }, { call, put, select }) {
      const { query, offset, size, filters } = payload;
      const noTotalFilters = {};
      for (const [key, item] of Object.entries(filters)) {
        if (typeof item === 'string') {
          noTotalFilters[key] = item.split('#')[0];
        } else {
          noTotalFilters[key] = item;
        }
      }
      const useTranslateSearch = yield select(state => state.search.useTranslateSearch);
      const { data } = yield call(searchService.searchPersonAgg, query, offset, size, noTotalFilters, useTranslateSearch);
      yield put({ type: 'searchPersonAggSuccess', payload: { data } });
    },

    * getSeminars({ payload }, { call, put }) {
      const { offset, size } = payload;
      const { data } = yield call(searchService.getSeminars, offset, size);
      yield put({ type: 'getSeminarsSuccess', payload: { data } });
    },

    * getTopicByMention({ payload }, { call, put }) {
      const { mention } = payload;
      const { data } = yield call(topicService.getTopicByMention, mention);
      yield put({ type: 'getTopicByMentionSuccess', payload: { data } });
    },

  },

  reducers: {
    updateUrlParams(state, { payload: { query, offset, size } }) {
      if (state.query !== query) {
        const filters = state.filters.eb
          ? { eb: state.filters.eb }
          : {
            eb: {
              id: sysconfig.DEFAULT_EXPERT_BASE,
              name: sysconfig.DEFAULT_EXPERT_BASE_NAME,
            },
          };
        return { ...state, query, offset, filters, pagination: { pageSize: size } };
      }
      return { ...state, query, offset, pagination: { pageSize: size } };
    },

    updateFilters(state, { payload: { filters } }) {
      return { ...state, filters };
    },

    updateFiltersAndQuery(state, { payload: { query, filters } }) {
      return { ...state, query, filters };
    },

    updateSortKey(state, { payload: { key } }) {
      // console.log('reducers, update sort key : ', key);
      return { ...state, sortKey: key || '' };
    },

    searchPersonSuccess(state, { payload: { data, query, total } }) {
      const { result } = data;
      const currentTotal = total || data.total;
      const current = Math.floor(state.offset / state.pagination.pageSize) + 1;
      return {
        ...state,
        results: result,
        pagination: { pageSize: state.pagination.pageSize, total: currentTotal, current },
      };
    },

    emptyResults(state) {
      return { ...state, results: [] };
    },

    searchPersonAggSuccess(state, { payload: { data } }) {
      const { aggs } = data;
      return { ...state, aggs };
    },

    getSeminarsSuccess(state, { payload: { data } }) {
      return { ...state, seminars: data };
    },

    translateSearchSuccess(state, { payload: { data } }) {
      return { ...state, translatedQuery: data.en };
    },

    setTranslateSearch(state, { payload: { useTranslate } }) {
      return { ...state, useTranslateSearch: useTranslate };
    },

    clearTranslateSearch(state) {
      return { ...state, useTranslateSearch: true, translatedQuery: '' };
    },

    getTopicByMentionSuccess(state, { payload: { data } }) {
      return { ...state, topic: data.data };
    },

  },

};
