/**
 * Created by yangyanmei on 17/5/26.
 */
import * as seminarService from '../services/seminar';

export default {
  namespace: 'seminar',

  state: {
    results: [],
    isMotion: localStorage.getItem('antdAdminUserIsMotion') === 'true',
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1,
      pageSize: 30,
      total: null,
    },
  },

  subscriptions: {
    setup({ dispatch, history }){
      history.listen((location) => {
        console.log(location);
        if (location.pathname === '/seminar') {
          dispatch({ type: 'getSeminar', payload: { offset: 0, size: 20 } });
        }
      });

    },
  },

  effects: {
    *getSeminar({ payload }, { call, put }){
      const { offset, size } = payload;
      const { data } = yield call(seminarService.getSeminar, offset, size);
      yield put({ type: 'getSeminarsSuccess', payload: { data } });
    },

  },

  reducers: {
    getSeminarsSuccess(state, { payload: { data } }){
      return { ...state, results: data };
    },
  },

}
