/**
 *  Created by BoGao on 2017-08-23;
 */
import pathToRegexp from 'path-to-regexp';
import * as rcdService from '../../services/rcd-service';

export default {
  namespace: 'recommendation',

  state: {
    orgs: [],

    // personId: '',

    // pubListInfo: {},
    // resultsByYear: [],
    // resultsByCitation: [],
    // loading: false,

    // not used yet
    // results: [],
    // offset: 0,
    // query: null,
    // isMotion: localStorage.getItem('antdAdminUserIsMotion') === 'true',
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
    setup({ dispatch, history }) {
      // history.listen((location, query) => {
      //   let match = pathToRegexp('/(uni)?search/:query/:offset/:size').exec(location.pathname);
      //   if (match) {
      //     const keyword = decodeURIComponent(match[2]);
      //     const offset = parseInt(match[3], 10);
      //     const size = parseInt(match[4], 10);
      //     // update fillings.
      //     dispatch({ type: 'emptyResults' });
      //     dispatch({ type: 'updateUrlParams', payload: { query: keyword, offset, size } });
      //     // console.log('Success::::sdfsdf ', keyword);
      //     dispatch({ type: 'app/setQueryInHeaderIfExist', payload: { query: keyword } });
      //   }
      // });
    },
  },

  effects: {
    * getAllOrgs({ payload }, { call, put }) {
      const { offset, size } = payload;
      const data = yield call(rcdService.getAllOrgs, offset, size);
      console.log('data:', data);
      if (data && data.data && data.data.status) {
        yield put({ type: 'getAllOrgsSuccess', payload: { data: data.data } });
      } else {
        // TODO 要在这里做错误处理么?
        console.error('Error:', data.status);
      }
    },

    // * getPublications({ payload }, { call, put }) {
    //   yield put({ type: 'showLoading' });
    //
    //   // console.log('>>> Effects GetPublications. payload is ;', payload);
    //   const { personId, orderBy, year, citedTab, offset, size } = payload;
    //
    //   // 复杂逻辑
    //   let data = {};
    //   if (orderBy === 'byYear') {
    //     if (year === 'all') { // all
    //       data = yield call(pubsService.getPubsAll, { personId, offset, size });
    //     } else if (year === 'recent' || year === '' || year === 0) { // default
    //       data = yield call(pubsService.getPubsById, { personId, offset, size });
    //     } else {
    //       data = yield call(pubsService.getPubsByYear, { personId, year, offset, size });
    //     }
    //   } else if (orderBy === 'byCitation') {
    //     if (citedTab === 'all') { // all
    //       data = yield call(pubsService.getPubsCiteAll, { personId, offset, size });
    //     } else if (citedTab === 'top' || !citedTab) { // default
    //       data = yield call(pubsService.getPubsMostPo, { personId, offset, size });
    //     } else {
    //       const splits = citedTab.split('-');
    //       if (splits.length === 3) {
    //         const nc_lo = splits[0];
    //         const nc_hi = splits[1];
    //         const size = splits[2];
    //         data = yield call(pubsService.getPubsByCite, {
    //           personId,
    //           offset,
    //           nc_lo,
    //           nc_hi,
    //           size
    //         });
    //       } else {
    //         console.log('ERROR parsing citedTab', citedTab);
    //       }
    //     }
    //   }
    //   yield put({ type: 'getPublicationSuccess', payload: { orderBy, data } });
    // },
  },

  reducers: {
    getAllOrgsSuccess(state, { payload: { data } }) {
      return { ...state, orgs: data.data };
    },

    // getPublicationSuccess(state, { payload: { orderBy, data } }) {
    //   if (orderBy === 'byYear') {
    //     return { ...state, resultsByYear: data.data, loading: false };
    //   } else if (orderBy === 'byCitation') {
    //     return { ...state, resultsByCitation: data.data, loading: false };
    //   }
    // },
    //
    // showLoading(state) {
    //   return { ...state, loading: true };
    // },
    //
    // hideLoading(state) {
    //   return { ...state, loading: false };
    // },
  },

};
