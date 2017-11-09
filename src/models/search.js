/* eslint-disable prefer-destructuring,no-unused-expressions */
import { sysconfig } from 'systems';
import { notification } from 'antd';
import pathToRegexp from 'path-to-regexp';
import queryString from 'query-string';
import * as searchService from 'services/search';
import * as translateService from 'services/translate';
import * as topicService from 'services/topic';
import bridge from 'utils/next-bridge';
import { takeLatest } from './helper';

export default {

  namespace: 'search',

  state: {
    results: null,
    topic: null, // search 右边的 topic
    aggs: [],
    filters: {},
    query: null,

    // use translate search?
    useTranslateSearch: sysconfig.Search_DefaultTranslateSearch,
    translatedLanguage: 0, // 1 en to zh; 2 zh to en;
    translatedText: '',

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
        // TODO dont't use this method to get query, use in component method.
        let match = pathToRegexp('/(uni)?search/:query/:offset/:size').exec(pathname);
        if (match) {
          const keyword = decodeURIComponent(match[2]);
          const offset = parseInt(match[3], 10);
          const size = parseInt(match[4], 10);
          // dispatch({ type: 'emptyResults' });
          dispatch({ type: 'updateUrlParams', payload: { query: keyword, offset, size } });
        }

        //
        match = pathToRegexp('/eb/:id/:query/:offset/:size').exec(pathname);
        if (match) {
          const q = decodeURIComponent(match[2]);
          const keyword = q === '-' ? '' : q;
          const offset = parseInt(match[3], 10);
          const size = parseInt(match[4], 10);
          dispatch({ type: 'updateUrlParams', payload: { query: keyword, offset, size } });
        }

      });
    },
  },

  effects: {
    // 搜索全球专家时，使用old service。
    // 使用智库搜索，并且排序算法不是contribute的时候，使用新的搜索API。
    searchPerson: [function* ({ payload }, { call, put, select }) {
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

      const data = yield call(
        searchService.searchPerson,
        query, offset, size, noTotalFilters, Sort, useTranslateSearch,
      );

      if (process.env.NODE_ENV !== 'production') {
        console.log('data:::', data);
        if (data && data.data && data.data.queryEscaped) {
          console.warn('DEVELOPMENT ONLY MESSAGE: Query中有非法字符，已经过滤。详情：宋驰没告诉我!',);
          notification.open({
            message: 'DEVELOPMENT ONLY MESSAGE',
            description: 'Query中有非法字符，已经过滤。详情：宋驰没告诉我!',
          });
        }
      }

      if (data.data && data.data.succeed) {
        // console.log('>>>>>> ---==== to next API');
        const personIds = data.data.items && data.data.items.map(item => item && item.id);
        if (personIds) {
          const activityScores = yield call(
            searchService.getActivityScoresByPersonIds,
            personIds.join('.'),
          );
          if (activityScores.success && activityScores.data && activityScores.data.indices &&
            activityScores.data.indices.length > 0) {
            data.data.items && data.data.items.map((item, index) => {
              const activityRankingContrib =
                activityScores.data.indices[index].filter(scores => scores.key === 'contrib');
              data.data.items[index].indices.activityRankingContrib =
                activityRankingContrib.length > 0 ? activityRankingContrib[0].score : 0;
              return '';
            });
          }
        }
        yield put({ type: 'nextSearchPersonSuccess', payload: { data: data.data, query } });
      } else if (data.data && data.data.result) {
        yield put({ type: 'searchPersonSuccess', payload: { data: data.data, query, total } });
      } else {
        throw new Error('Result Not Available');
      }
    }, takeLatest],

    * translateSearch({ payload }, { call, put, select }) {
      // yield put({ type: 'clearTranslateSearch' });
      const useTranslateSearch = yield select(state => state.search.useTranslateSearch);
      if (useTranslateSearch) {
        const { query } = payload;
        const { data } = yield call(translateService.translateTerm, query);
        console.log('||translateSearch', payload, '>>', data);
        if (data && data.status) {
          const q = query.trim().toLowerCase();
          const en = data.en && data.en.trim().toLowerCase();
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

    searchPersonSuccess(state, { payload: { data, query, total } }) {
      if (!data) {
        return state;
      }
      const { result } = data;
      const currentTotal = total || data.total;
      const current = Math.floor(state.offset / state.pagination.pageSize) + 1;
      // console.log('::', toNextPersons(result));
      return {
        ...state,
        results: query === '-' ? null : bridge.toNextPersons(result),
        pagination: { pageSize: state.pagination.pageSize, total: currentTotal, current },
      };
    },

    nextSearchPersonSuccess(state, { payload: { data, query } }) {
      if (!data) {
        return state;
      }
      const { succeed, message, total, offset, size, items, aggregation } = data;
      if (!succeed) {
        throw new Error(message);
      }
      const current = Math.floor(state.offset / state.pagination.pageSize) + 1;
      const { translatedLanguage, translatedText } = data;
      const newState = {
        ...state,
        results: query === '-' ? null : items,
        pagination: { pageSize: state.pagination.pageSize, total, current },
        aggs: aggregation,
        translatedLanguage,
        translatedText,
      };
      return newState;
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
      return { ...state, translatedText: data.en };
    },

    setTranslateSearch(state, { payload: { useTranslate } }) {
      return { ...state, useTranslateSearch: useTranslate };
    },

    clearTranslateSearch(state) {
      return { ...state, useTranslateSearch: true, translatedText: '' };
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
