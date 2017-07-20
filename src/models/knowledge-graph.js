/**
 * Created by Bo Gao on 2017-07-19
 */
// import pathToRegexp from 'path-to-regexp';
import * as personService from '../services/person';
import * as searchService from '../services/search';
import * as kgService from '../services/knoledge-graph-service';

export default {

  namespace: 'knowledgeGraph',

  state: {
    query: '',
    kgdata: {},
    kgindex: {},
    kgFetcher: null,
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
      const data = yield call(kgService.kgFind, query, rich, dp, dc, ns, nc);
      yield put({ type: 'kfFindSuccess', payload: { data } });
    },
  },

  reducers: {
    setState(state, { payload }) {
      return { ...state, ...payload };
    },

    kfFindSuccess(state, { payload }) {
      const data = payload.data && payload.data.data;
      const kgindex = kgService.indexingKGData(data);
      const kgFetcher = kgService.kgFetcher(data, kgindex);
      // console.log('success findKG, return date is ', data);
      console.log('indexing it: ', kgindex);
      return { ...state, kgdata: data, kgindex, kgFetcher };
    },

  },
};
