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

    * addExpertToEB({ payload }, { call, put }) {
      const { data } = yield call(expertBaseService.addExpertToEB, { payload });
      if (data.status) {
        yield put({ type: 'addExpertToEBSuccess', payload: { data } });
      } else {
        throw new Error('添加智库失败');
      }
    },

    * searchExpertItem({ payload }, { call, put }) {
      const { data } = yield call(expertBaseService.searchExpert, { payload });
      yield put({
        type: 'searchExpertSuccess', payload: { data },
      })
      ;
    },

    * invokeRoster({ payload }, { call, put }) {
      const { data } = yield call(expertBaseService.rosterManage, { payload });
      yield put({ type: 'invokeRosterSuccess', payload: { data } });
    },

    * removeExpertItem({ payload }, { call, put }) {
      const { pid, rid } = payload;
      const { data } = yield call(expertBaseService.removeByPid, { pid, rid });
      console.log('00000', data);
      if (data.status) {
        yield put({ type: 'removeSuccess', payload });
      }
    },

  },
  reducers: {
    getExpertSuccess(state, { payload: { data } }) {
      return { ...state, results: data };
    },

    getExpertDetailSuccess(state, { payload: { data } }) {
      return { ...state, detailResults: data };
    },

    invokeRosterSuccess(state, { payload: { data } }) {
      return { ...state }; // TODO ???????
    },

    addExpertSuccess(state, { payload: { data } }) {
      return { ...state, };
    },

    deleteExpertSuccess(state, { payload }) {
      const data = state.results.data.filter(item => item.id !== payload.key);
      const newState = { ...state };
      newState.results.data = data;
      return { ...state, newState };
    },

    removeSuccess(state, { payload }) {
      console.log('--------------state.detailResults', state);
      const data = state.detailResults.result.filter(item => item.id !== payload.pid);
      const newState = { ...state };
      newState.detailResults.result = data;
      return newState;
    },

    addExpertToEBSuccess(state, { payload: { data } }) {
      return { ...state, addStatus: false };
    },

    searchExpertSuccess(state, { payload: { data } }) {
      return { ...state, detailResults: data };
    },
  },
};

