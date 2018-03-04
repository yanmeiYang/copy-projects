/**
 * Created by Bo Gao on 2017-07-19
 */
// import pathToRegexp from 'path-to-regexp';
import * as searchService from '../services/search';
import * as kgService from '../services/knoledge-graph-service';

export default {

  namespace: 'knowledgeGraph',

  state: {
    // page state
    query: '',

    // second state
    kgdata: null,
    kgindex: null,
    kgFetcher: null,

    node: null,

    // third state
    experts: null,
    publications: null,
    fullNode: null, // TODO

    popupErrorMessage: '',
  },

  subscriptions: {
    // setup({ dispatch, history }) {
    //   history.listen((location) => {
    //     const match = pathToRegexp('/person/:id').exec(location.pathname);
    //     if (match) {
    //       const pid = decodeURIComponent(match[1]);
    //       // 不在初始化的时候就调用读取方法。而是在检测到参数变化的时候再去调用。
    //       dispatch({ type: 'getPublications', payload: { personId: pid, offset: 0, size: 15 } });
    //     }
    //   });
    // },
  },

  effects: {
    * kgFind({ payload }, { call, put }) {
      // console.log("enter kfFind, with query:", payload);
      const { query, rich, dp, dc, ns, nc } = payload;
      try {
        const data = yield call(kgService.kgFind, query, rich, dp, dc, ns, nc);
        yield put({ type: 'kgFindSuccess', payload: { data } });
      } catch (e) {
        console.error('---- Catch Error: ---- ', e);
        yield put({
          type: 'kgNotFound',
          payload: { message: `'${query}' Not Found ${e || ''}` },
        });
      }
    },

    * searchPubs({ payload }, { call, put }) {
      const { query, offset, size, sort } = payload;
      const { data } = yield call(searchService.searchPublications,
        { query, offset, size, sort });
      yield put({ type: 'searchPubsSuccess', payload: { data } });
    },

    * searchExperts({ payload }, { call, put }) {
      const { query, offset, size, sort } = payload;
      const { data } = yield call(searchService.searchPersonGlobal,
        query, offset, size, null, sort);
      yield put({ type: 'searchExpertsSuccess', payload: { data } });
    },
  },

  reducers: {
    setState(state, { payload }) {
      return { ...state, ...payload };
    },

    resetInfoBlock(state) {
      return { ...state, experts: null, publications: null, fullNode: '' };
    },

    resetExpertsAndPublications(state) {
      return { ...state, experts: null, publications: null };
    },

    kgFindSuccess(state, { payload }) {
      const data = payload.data && payload.data.data;
      const kgindex = kgService.indexingKGData(data);
      const kgFetcher = kgService.kgFetcher(data, kgindex);
      // console.log('success findKG, return date is ', data);
      // console.log('indexing it: ', kgindex);
      return { ...state, kgdata: data, kgindex, kgFetcher };
    },

    kgNotFound(state, { payload }) {
      console.log('message:', payload.message);
      return { ...state, popupErrorMessage: payload.message };
    },

    searchPubsSuccess(state, { payload }) {
      const { data } = payload;
      // console.log('search publications: ', data);
      return { ...state, publications: data.result };
    },

    searchExpertsSuccess(state, { payload }) {
      const { data } = payload;
      // console.log('search experts: ', data);
      return { ...state, experts: data.result };
    },

  },
};
