import pathToRegexp from 'path-to-regexp';
import * as pubsService from '../services/publication';

export default {

  namespace: 'publications',
  sizePerPageByAll: 100,

  state: {
    test: 'sldkjflsjdf',
    personId: '',
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
      console.log('>>> setup');
      // load personId from URL. TODO config this to pass through props.
      history.listen((location) => {
        // TODO 这里简直太写死了。要改的通用点。但是好处是可以和profileAPI同时请求。
        const match = pathToRegexp('/person/:id').exec(location.pathname);
        if (match) {
          const pid = decodeURIComponent(match[1]);
          dispatch({ type: 'getPublications', payload: { personId: pid, offset: 0, size: 15 } });
        }
      });
    },
  },

  effects: {
    *getPublications({ payload }, { call, put }) {
      console.log('>>> Effects GetPublications. payload is ;', payload);
      const { personId, offset, size } = payload;
      const data = yield call(pubsService.getPubsList, { personId, offset, size });
      yield put({ type: 'getPublicationSuccess', payload: { data } });
    },
  },

  reducers: {
    getPublicationSuccess(state, { payload: { data } }) {
      // console.log('>>> Reducers: getPublicationSuccess', data.data);
      return { ...state, results: data.data };
    },
  },

};
