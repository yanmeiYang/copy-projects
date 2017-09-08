/**
 * Created by zhanglimin on 17/9/1.
 */
import * as expertBaseService from '../../services/expert-base';

export default {
  namespace: 'expertBase',

  state: {
    results: [],
    detailResults: [],
    addStatus: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/expert-base') {
          dispatch({
            type: 'getExpert',
            payload: { offset: 0, size: 20 },
          });
        }
        // if (location.pathname === '/expert-base-list') {
        //   dispatch({
        //     type: 'expertBase/getExpertDetailList',
        //     payload: { key, offset: 0, size: 20 },
        //   });
        // }
      });
    },
  },
  effects: {
    * getExpert({ payload }, { call, put }) {
      const { offset, size } = payload;
      const { data } = yield call(expertBaseService.getExpert, offset, size);
      yield put({ type: 'getExpertSuccess', payload: { data } });
    },
    * addExpert({ payload }, { call, put }) {
      const { title, desc } = payload;
      const pub = payload.public;
      const { data } = yield call(expertBaseService.addExpertBase, { title, desc, pub });
      yield put({ type: 'addExpertSuccess', payload: { data } });
    },
    * deleteExpert({ payload }, { call, put }) {
      const { key } = payload;
      // const { id } = payload;
      const { data } = yield call(expertBaseService.deleteByKey, key);
      if (data.status) {
        yield put({ type: 'deleteExpertSuccess', payload });
      } else {
        console.log('数据操作失败！');
      }
    },
    * getExpertDetailList({ payload }, { call, put }) {
      const { id, offset, size } = payload;
      const { data } = yield call(expertBaseService.getExpertDetail, id, offset, size);
      yield put({ type: 'getExpertDetailSuccess', payload: { data } });
    },
    * addExpertDetail({ payload }, { call, put }) {
      const { data } = yield call(expertBaseService.addExpertDetailInfo, { payload });
      console.log('znemehuishi', payload);
      yield put({ type: 'addExpertDetailSuccess', payload: { data } });
    },
    * searchExpertItem({ payload }, { call, put }) {
      const { data } = yield call(expertBaseService.searchExpert, { payload });
      yield put({
        type: 'searchExpertSuccess', payload: { data },
      })
      ;
    },

  },
  reducers: {
    getExpertSuccess(state, { payload: { data } }) {
      return { ...state, results: data, loading: true };
    },
    getExpertDetailSuccess(state, { payload: { data } }) {
      return { ...state, detailResults: data, loading: true };
    },
    addExpertSuccess(state, { payload: { data } }) {
      return { ...state, loading: true };
    },
    deleteExpertSuccess(state, { payload }) {
      const data = state.results.data.filter(item => item.id !== payload.key);
      const newState = { ...state };
      newState.results.data = data;
      return { ...state, newState };
    },
    addExpertDetailSuccess(state, { payload: { data } }) {
      return { ...state, addStatus: data, loading: true };
    },
    searchExpertSuccess(state, { payload: { data } }) {
      return { ...state, detailResults: data, loading: true };
    },
  },
};

