/**
 *  Created by BoGao on 2017-06-15;
 *  测试页面
 */
import pathToRegexp from 'path-to-regexp';
import * as pubsService from '../services/publication';

export default {

  namespace: 'testpage',
  sizePerPageByAll: 100,

  state: {
    personId: '',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // history.listen((location) => {
      // const match = pathToRegexp('/person/:id').exec(location.pathname);
      // if (match) {
      //   const pid = decodeURIComponent(match[1]);
      //   // 不在初始化的时候就调用读取方法。而是在检测到参数变化的时候再去调用。
      //dispatch({ type: 'getPublications', payload: { personId: pid, offset: 0, size: 15 } });
      // }
      // });
    },
  },

  effects: {
    *getPublistInfo({ payload }, { call, put }) {
      const { personId } = payload;
      const data = yield call(pubsService.getPubListInfo, { personId });
      yield put({ type: 'updatePubListInfo', payload: { data } });
    },

    *getPublications({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      // console.log('>>> Effects GetPublications. payload is ;', payload);
      const { personId, orderBy, year, citedTab, offset, size } = payload;

      // 复杂逻辑
      let data = {};
      if (orderBy === 'byYear') {
        if (year === 'all') { // all
          data = yield call(pubsService.getPubsAll, { personId, offset, size });
        } else if (year === 'recent' || year === '' || year === 0) { // default
          data = yield call(pubsService.getPubsById, { personId, offset, size });
        } else {
          data = yield call(pubsService.getPubsByYear, { personId, year, offset, size });
        }
      } else if (orderBy === 'byCitation') {
        if (citedTab === 'all') { // all
          data = yield call(pubsService.getPubsCiteAll, { personId, offset, size });
        } else if (citedTab === 'top' || !citedTab) { // default
          data = yield call(pubsService.getPubsMostPo, { personId, offset, size });
        } else {
          const splits = citedTab.split('-');
          if (splits.length === 3) {
            const nc_lo = splits[0];
            const nc_hi = splits[1];
            const size = splits[2];
            data = yield call(pubsService.getPubsByCite, { personId, offset, nc_lo, nc_hi, size });
          } else {
            console.log('ERROR parsing citedTab', citedTab);
          }
        }
      }
      yield put({ type: 'getPublicationSuccess', payload: { orderBy, data } });
    },
  },

  reducers: {
    updatePubListInfo(state, { payload: { data } }) {
      return { ...state, pubListInfo: data.data };
    },

    getPublicationSuccess(state, { payload: { orderBy, data } }) {
      if (orderBy === 'byYear') {
        return { ...state, resultsByYear: data.data, loading: false };
      } else if (orderBy === 'byCitation') {
        return { ...state, resultsByCitation: data.data, loading: false };
      }
    },

    showLoading(state) {
      return { ...state, loading: true };
    },

    hideLoading(state) {
      return { ...state, loading: false };
    },
  },


};