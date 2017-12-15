/* eslint-disable prefer-destructuring,no-unused-expressions */
import { sysconfig } from 'systems';
import { notification } from 'antd';
import pathToRegexp from 'path-to-regexp';
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
    aggs: [], // Aggregation
    filters: {},
    query: null,

    searchSuggests: null,

    // use translate search? TODO replace with Intelligence Search.
    useTranslateSearch: sysconfig.Search_EnableTranslateSearch &&
    !sysconfig.Search_EnableSmartSuggest && sysconfig.Search_DefaultTranslateSearch,
    translatedLanguage: 0, // 1 en to zh; 2 zh to en;
    translatedText: '',

    // Intelligence search assistants. TODO change to assistantMeta, assistantData
    assistantDataMeta: {}, // {advquery: texts: [...]}
    assistantData: null,
    isNotAffactedByAssistant: true, // 标记没有点过翻译。点了就变成false了。碰过就不能用intell_search了。

    // flags
    isNewAPI: false,

    // pager
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
      history.listen(({ pathname, search, select }) => {
        // TODO dont't use this method to get query, use in component method.
        let match = pathToRegexp('/(uni)?search/:query/:offset/:size').exec(pathname);
        if (match) {
          const keyword = decodeURIComponent(match[2]);
          const offset = parseInt(match[3], 10);
          const size = parseInt(match[4], 10);
          // dispatch({ type: 'emptyResults' });
          dispatch({ type: 'smartClearAssistantMeta', payload: { query: keyword } });
          dispatch({ type: 'updateUrlParams', payload: { query: keyword, offset, size } });
          // dispatch({ type: 'clearSearchAssistant' });
        }

        //
        match = pathToRegexp('/eb/:id/:query/:offset/:size').exec(pathname);
        if (match) {
          const q = decodeURIComponent(match[2]);
          const keyword = q === '-' ? '' : q;
          const offset = parseInt(match[3], 10);
          const size = parseInt(match[4], 10);
          dispatch({ type: 'updateUrlParams', payload: { query: keyword, offset, size } });
          // dispatch({ type: 'clearSearchAssistant' });
        }

      });
    },
  },

  effects: {
    // 搜索全球专家时，使用old service。
    // 使用智库搜索，并且排序算法不是contribute的时候，使用新的搜索API。
    searchPerson: [function* ({ payload }, { call, put, select }) {
      const { query, offset, size, filters, sort, total, ghost } = payload;
      const noTotalFilters = {};
      for (const [key, item] of Object.entries(filters)) {
        if (typeof item === 'string') {
          noTotalFilters[key] = item.split('#')[0];
        } else {
          noTotalFilters[key] = item;
        }
      }

      // fix sort key
      const Sort = fixSortKey(sort, query); // Fix default sort key.

      // TODO replace this.
      const useTranslateSearch = yield select(state => state.search.useTranslateSearch);
      const intelligenceSearchMeta = yield select(state => state.search.intelligenceSearchMeta);
      const assistantDataMeta = yield select(state => state.search.assistantDataMeta);
      const isNotAffactedByAssistant = yield select(state => state.search.isNotAffactedByAssistant);

      // 分界线
      yield put({ type: 'updateSortKey', payload: { key: Sort } });
      yield put({ type: 'updateFilters', payload: { filters } });

      const { searchInGlobalExperts, searchInSomeExpertBase } = searchService.getBools(filters);

      // TODO call standalone assistant search for old api.
      let assistantQuery = '';
      if (sysconfig.Search_EnableSmartSuggest && !ghost &&
        (searchInGlobalExperts ||
          (searchInSomeExpertBase && !sysconfig.USE_NEXT_EXPERT_BASE_SEARCH))
      ) {
        // TODO 第一次搜索出现的bug。
        if (assistantDataMeta && assistantDataMeta.advquery && assistantDataMeta.advquery.texts
          && assistantDataMeta.advquery.texts.length > 0) {
          const queries = assistantDataMeta.advquery.texts.map(term => term && `(| ${term.text})`);
          queries.push(`(| ${query})`);
          assistantQuery = queries.join(' ');
          console.log('Note: expand query is:', assistantQuery);

          // 不是第一次使用辅助系统，调用非阻塞的assistant。
          yield put({ type: 'onlySearchAssistant', payload: { query, assistantDataMeta } });
        } else {
          // 第一次query使用辅助系统，老API需要默认带上第一个query，所以这里阻塞，先等结果回来再搜索。
          const data = yield call(searchService.onlySearchAssistant, {
            query,
            assistantDataMeta,
          });
          if (data.data && data.data.succeed) {
            const { intellResults } = data.data;
            yield put({ type: 'getAssistantDataSuccess', payload: { data: intellResults } });
            const queries = [query];
            let hasExpands = false;
            if (intellResults && intellResults.expands && intellResults.expands.length > 0) {
              queries.push(intellResults.expands[0].word);
              hasExpands = true;
              // assistantQuery = `(| ${query}) (| ${intellResults.expands[0].word})`;
            }
            if (intellResults && intellResults.transText && isNotAffactedByAssistant && !hasExpands) {
              queries.push(intellResults.transText);
              // assistantQuery += ` (| ${intellResults.transText})`;
            }
            if (queries.length > 1) {
              assistantQuery = queries.map(item => `(| ${item})`).join(' ');
            }
            console.log('Note: first expand query is:', assistantQuery);
          }
        }
      }

      // 调用 搜索 .
      const params = {
        query, offset, size, filters: noTotalFilters, sort: Sort, intelligenceSearchMeta,
        assistantDataMeta, assistantQuery, isNotAffactedByAssistant,
        useTranslateSearch, // TODO remove
      };

      const data = yield call(searchService.searchPerson, params);

      if (process.env.NODE_ENV !== 'production') {
        if (data && data.data && data.data.queryEscaped) {
          console.warn('DEVELOPMENT ONLY MESSAGE: Query中有非法字符，已经过滤。详情：宋驰没告诉我!');
          notification.open({
            message: 'DEVELOPMENT ONLY MESSAGE',
            description: 'Query中有非法字符，已经过滤。详情：宋驰没告诉我!',
          });
        }
      }

      if (data.data && data.data.succeed) {
        // console.log('>>>>>> ---==== to next API');
        // TODO 修复新API下没有CCF 贡献度值这样的东西。但是：这些东西不应该放这里。。。。。。。
        if (sysconfig.SOURCE === 'ccf') {
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
                  activityScores.data.indices[index].filter(scores => scores.key === 'compre');
                if (data.data.items[index].indices) {
                  data.data.items[index].indices.activityRankingContrib =
                    activityRankingContrib.length > 0 ? activityRankingContrib[0].score : 0;
                }
                return '';
              });
            }
          }
        }

        if (ghost) { // called by others. export.
          return data.data;
        }
        const { intellResults } = data.data;
        yield put({ type: 'nextSearchPersonSuccess', payload: { data: data.data, query } });
        yield put({ type: 'getAssistantDataSuccess', payload: { data: intellResults } });
      } else if (data.data && data.data.result) {
        if (ghost) {
          return data.data;
        } else {
          yield put({ type: 'searchPersonSuccess', payload: { data: data.data, query, total } });
        }
      } else {
        throw new Error('Result Not Available');
      }
    }, takeLatest],

    * onlySearchAssistant({ payload }, { call, put }) {
      const { query, assistantDataMeta } = payload;
      const data = yield call(searchService.onlySearchAssistant, { query, assistantDataMeta });
      if (data.data && data.data.succeed) {
        const { intellResults } = data.data;
        yield put({ type: 'getAssistantDataSuccess', payload: { data: intellResults } });
      }
    },

    * translateSearch({ payload }, { call, put, select }) {
      // yield put({ type: 'clearTranslateSearch' });
      const useTranslateSearch = yield select(state => state.search.useTranslateSearch);
      if (useTranslateSearch) {
        const { query } = payload;
        if (query) {
          try {
            const { data } = yield call(translateService.translateTerm, query);
            if (data && data.status) {
              const q = query.trim().toLowerCase();
              const en = data.en && data.en.trim().toLowerCase();
              if (q !== en) {
                yield put({ type: 'translateSearchSuccess', payload: { data } });
              }
            }
          } catch (err) {
            console.log(err);
          }
        }
      }
    },

    searchPersonAgg: [function* ({ payload }, { call, put, select }) {
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
      const intelligenceSearchMeta = yield select(state => state.search.intelligenceSearchMeta);
      const assistantDataMeta = yield select(state => state.search.assistantDataMeta);
      const isNotAffactedByAssistant = yield select(state => state.search.isNotAffactedByAssistant);

      const assistantQuery = findAssistantQuery({ ghost: false, filters, assistantDataMeta, query});

      const params = {
        query, offset, size, filters: noTotalFilters, sort,
        assistantDataMeta, assistantQuery, useTranslateSearch, // TODO remove
      };
      const sr = yield call(searchService.searchPersonAgg, params);
      if (sr) {
        const { data } = sr;
        yield put({ type: 'searchPersonAggSuccess', payload: { data } });
      }
    }, takeLatest],


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
        newState.translatedText = '';
      }
      return newState;
    },

    updateFiltersAndQuery(state, { payload: { query, filters } }) {
      return { ...state, query, filters };
    },

    updateFilters(state, { payload: { filters } }) {
      return { ...state, filters };
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
      const aggs = bridge.toNextAggregation(data.aggs);
      return { ...state, aggs };
    },

    getSeminarsSuccess(state, { payload: { data } }) {
      return { ...state, seminars: data };
    },

    translateSearchSuccess(state, { payload: { data } }) {
      let translatedLanguage = 0;
      if (data.en) {
        translatedLanguage = 2;
      } else if (data.zh) {
        translatedLanguage = 1;
      }
      return { ...state, translatedText: data.en || data.zh, translatedLanguage };
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

    /*
     * Search Assistant related reducers.
     */

    setAssistantDataMeta(state, { payload: { texts } }) {
      return {
        ...state,
        assistantDataMeta: { advquery: { texts } },
        isNotAffactedByAssistant: false,
      };
    },

    clearAssistantDataMeta(state) {
      return { ...state, assistantDataMeta: {} };
    },

    getAssistantDataSuccess(state, { payload: { data } }) {
      return { ...state, assistantData: data };
    },

    clearSearchAssistant(state) {
      return { ...state, assistantDataMeta: null, assistantData: null };
    },

    smartClearAssistantMeta(state, { payload: { query } }) {
      if (state.query !== query) {
        return { ...state, assistantDataMeta: null, assistantData: null  };
      }
      return state;
    },

    // clearSearchAssistantKG(state) {
    //   const { kgHypernym, kgHyponym, ...assistantData } = state.assistantData;
    //   return { ...state, assistantData };
    // },

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

function findAssistantQuery(params) {
  const { ghost, filters, assistantDataMeta, query } = params;
  const { searchInGlobalExperts, searchInSomeExpertBase } = searchService.getBools(filters);

  // TODO call standalone assistant search for old api.
  let assistantQuery = '';
  if (sysconfig.Search_EnableSmartSuggest && !ghost &&
    (searchInGlobalExperts ||
      (searchInSomeExpertBase && !sysconfig.USE_NEXT_EXPERT_BASE_SEARCH))
  ) {
    // TODO 第一次搜索出现的bug。
    if (assistantDataMeta && assistantDataMeta.advquery && assistantDataMeta.advquery.texts
      && assistantDataMeta.advquery.texts.length > 0) {
      const queries = assistantDataMeta.advquery.texts.map(term => term && `(| ${term.text})`);
      queries.push(`(| ${query})`);
      assistantQuery = queries.join(' ');
      console.log('Note: expand query is:', assistantQuery);
    } else {
      // FIXME: here is a bug.
    }
  }
  return assistantQuery;
}
