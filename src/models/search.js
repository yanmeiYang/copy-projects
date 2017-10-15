/* eslint-disable prefer-destructuring */
import { sysconfig } from 'systems';
import pathToRegexp from 'path-to-regexp';
import queryString from 'query-string';
import * as searchService from 'services/search';
import * as translateService from 'services/translate';
import * as topicService from 'services/topic';
import bridge from 'utils/next-bridge';

export default {

  namespace: 'search',

  state: {
    results: [],
    topic: null, // search 右边的 topic
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
      pageSize: sysconfig.MainListSize,
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
    // 搜索全球专家时，使用old service。
    // 使用智库搜索，并且排序算法不是contribute的时候，使用新的搜索API。
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
      // fix sort key
      const Sort = fixSortKey(sort, query);

      const useTranslateSearch = yield select(state => state.search.useTranslateSearch);

      // 分界线
      yield put({ type: 'updateSortKey', payload: { key: Sort } });
      yield put({ type: 'updateFilters', payload: { filters } });

      const data = yield call(searchService.searchPerson,
        query, offset, size, noTotalFilters, Sort, useTranslateSearch);

      if (data.succeed) {
        // console.log('>>>>------ to next API');
        yield put({ type: 'nextSearchPersonSuccess', payload: { data } });
      } else if (data.data && data.data.result) {
        // console.log('>>>>------ to old API');
        yield put({ type: 'searchPersonSuccess', payload: { data: data.data, query, total } });
      } else {
        throw new Error('Result Not Available');
      }
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
      const { query, offset, size, filters, sort } = payload;
      const noTotalFilters = {};
      for (const [key, item] of Object.entries(filters)) {
        if (typeof item === 'string') {
          noTotalFilters[key] = item.split('#')[0];
        } else {
          noTotalFilters[key] = item;
        }
      }
      const useTranslateSearch = yield select(state => state.search.useTranslateSearch);
      const sr = yield call(searchService.searchPersonAgg,
        query, offset, size, noTotalFilters, useTranslateSearch, sort);
      if (sr) {
        const { data } = sr;
        yield put({ type: 'searchPersonAggSuccess', payload: { data } });
      }
    },

    * getSeminars({ payload }, { call, put }) {
      const { offset, size } = payload;
      const { data } = yield call(searchService.getSeminars, offset, size);
      yield put({ type: 'getSeminarsSuccess', payload: { data } });
    },

    * getTopicByMention({ payload }, { call, put }) {
      try {
        const { mention } = payload;
        const { data } = yield call(topicService.getTopicByMention, mention);
        yield put({ type: 'getTopicByMentionSuccess', payload: { data } });
      } catch (err) {
        console.error(err);
      }
    },

  },

  reducers: {
    updateUrlParams(state, { payload: { query, offset, size } }) {
      const newState = { ...state, query, offset };
      if (state.query !== query) {
        newState.filters = newState.filters || {};
        if (!newState.filters.eb) {
          newState.filters.eb = {
            id: sysconfig.DEFAULT_EXPERT_BASE,
            name: sysconfig.DEFAULT_EXPERT_BASE_NAME,
          };
        }

        newState.pagination = newState.pagination || {
          current: 1,
          pageSize: sysconfig.MainListSize,
          total: null,
        };
        newState.pagination.pageSize = size;
      }
      return newState;
    },

    updateFilters(state, { payload: { filters } }) {
      return { ...state, filters };
    },

    updateFiltersAndQuery(state, { payload: { query, filters } }) {
      return { ...state, query, filters };
    },

    updateSortKey(state, { payload: { key } }) {
      return { ...state, sortKey: key };
    },

    searchPersonSuccess(state, { payload: { data, total } }) {
      if (!data) {
        return state;
      }
      const { result } = data;
      const currentTotal = total || data.total;
      const current = Math.floor(state.offset / state.pagination.pageSize) + 1;
      // console.log('::', toNextPersons(result));
      return {
        ...state,
        results: bridge.toNextPersons(result),
        pagination: { pageSize: state.pagination.pageSize, total: currentTotal, current },
      };
    },

    nextSearchPersonSuccess(state, { payload: { data } }) {
      if (!data) {
        return state;
      }
      const { succeed, message, total, offset, size, items, aggregation } = data;
      if (!succeed) {
        throw new Error(message);
      }
      const current = Math.floor(state.offset / state.pagination.pageSize) + 1;
      console.log('++++++++++++++++(aggregation)', aggregation);
      console.log('----------------(items)', items);
      return {
        ...state,
        results: items,
        pagination: { pageSize: state.pagination.pageSize, total, current },
        aggs: aggregation,
      };
    },

    emptyResults(state) {
      return { ...state, results: [] };
    },

    removePersonFromSearchResultsById(state, { payload: { pid } }) {
      const originalResults = [];
      for (const value of state.results) {
        if (value.id !== pid) {
          originalResults.push(value);
        }
      }
      return { ...state, results: originalResults };
    },

    searchPersonAggSuccess(state, { payload: { data } }) {
      if (!data) {
        return state;
      }
      console.log('**************', data);
      const aggs = bridge.toNextAggregation(data.aggs);
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

function fixSortKey(sort, query) {
  if (query) {
    // search, default is relevance;
    if (!sort || sort === 'time') {
      return 'relevance';
    }
  } else {
    // List all experts in query. use time as default sort.
    if (!sort || sort === 'relevance') {
      return 'time';
    }
  }
  return sort;
}
