import pathToRegexp from 'path-to-regexp';
import * as pubsService from '../services/publication';

export default {

  namespace: 'publications',
  sizePerPageByAll: 100,

  state: {
    personId: '',
    // Note: 这里可以改成Map.
    resultsByYear: [],
    resultsByCitation: [],

    // not used yet
    results: [],
    offset: 0,
    query: null,
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
      // load personId from URL. TODO config this to pass through props.
      history.listen((location) => {
        // TODO 这里简直太写死了。要改的通用点。但是好处是可以和profileAPI同时请求。
        const match = pathToRegexp('/person/:id').exec(location.pathname);
        if (match) {
          const pid = decodeURIComponent(match[1]);
          // 不在初始化的时候就调用读取方法。而是在检测到参数变化的时候再去调用。
          //dispatch({ type: 'getPublications', payload: { personId: pid, offset: 0, size: 15 } });
        }
      });
    },
  },

  effects: {
    *getPublications({ payload }, { call, put }) {
      console.log('>>> Effects GetPublications. payload is ;', payload);
      const { personId, offset, size, orderBy } = payload;

      // 复杂逻辑
      let data = {};
      if (orderBy === 'byYear') {
        data = yield call(pubsService.getPubsById, { personId, offset, size });
      } else if (orderBy === 'byCitation') {
        data = yield call(pubsService.getPubsMostPo, { personId, offset, size });
      }
      yield put({ type: 'getPublicationSuccess', payload: { orderBy, data } });
    },
  },

  reducers: {
    getPublicationSuccess(state, { payload: { orderBy, data } }) {
      if (orderBy === 'byYear') {
        return { ...state, resultsByYear: data.data };
      } else if (orderBy === 'byCitation') {
        return { ...state, resultsByCitation: data.data };
      }
    },
  },

};
