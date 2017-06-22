/**
 * Bo Gao on 2017-06-12
 */
import pathToRegexp from 'path-to-regexp';
import * as uconfigService from '../../services/universal-config';

export default {

  namespace: 'universalConfig',

  state: {
    source: '', // If don't set, service will get value from config.
    category: '',
    key: '',
    data: [],
    valueType: '',
    loading: false, // TODO DVA-LOADING 到底怎么用？
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      dispatch({ type: 'setTestData', payload: {} });
    }
  },

  effects: {
    *setCategory({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const { category } = payload;
      const data = yield call(uconfigService.listByCategory, category);
      yield put({ type: 'setCategorySuccess', payload: { category } });
      yield put({ type: 'setData', payload: { data } });
    },

    *addKeyAndValue({ payload }, { call, put }) {
      // yield put({ type: 'showLoading' });
      const { category, key, val } = payload;
      const data = yield call(uconfigService.setByKey, category, key, val);
      if (data.data && data.data.status === true) {
        // do nothing....
      } else {
        console.error('addKeyAndValue Error: ', data);
      }
      yield put({ type: 'updateData', payload: { key, val } });
    },

    *deleteByKey({ payload }, { call, put }) {
      const { category, key } = payload;
      const data = yield call(uconfigService.deleteByKey, category, key);
      console.log('data: ', data);
      if (data.data && data.data.status === true) {
        // do nothing....
      } else {
        console.error('deleteByKey Error: ', data);
      }
      yield put({ type: 'deleteByKeySuccess', payload: { key } });
    },

  },

  reducers: {
    setCategorySuccess(state, { payload: { category } }) {
      return { ...state, category };
    },

    setData(state, { payload: { data } }) {
      const newData = [];
      if (data.data.data) {
        for (const item in data.data.data) {
          if (item) {
            newData.push({ key: item, value: data.data.data[item] });
          }
        }
      }
      return { ...state, data: newData, loading: false };
    },

    updateData(state, { payload: { key, val } }) {
      // TODO 这里编辑会有问题,报bug.
      let newData = [];
      const idx = findUniversalConfig(state.data, key);
      if (idx === -1) {
        newData = [...state.data, { key, value: val }];
      } else {
        newData = state.data;
        if (newData && newData[idx] && newData[idx].key === key) {
          newData[idx].value = val;
        }
      }
      return { ...state, data: newData };
    },

    deleteByKeySuccess(state, { payload: { key } }) {
      const idx = findUniversalConfig(state.data, key);
      state.data.splice(idx, 1);
      return { ...state, data: state.data };
    },


    /* update person profile info. */
    // TODO handel error.
    getPersonSuccess(state, { payload: { data } }) {
      return { ...state, profile: data.data };
    },

    setTestData(state, { payload: {} }) {
      return { ...state, data: [{ key: 'key', value: 'value' }] };
    },

    showLoading(state) {
      return { ...state, loading: true };
    },
    hideLoading(state) {
      return { ...state, loading: false };
    },
  },

};

function findUniversalConfig(data, targetKey) {
  let idx = -1;
  if (data) {
    data.find((item, index) => {
      if (item && item.key === targetKey) {
        idx = index;
        return true;
      }
      return false;
    });
  }
  return idx;
};
