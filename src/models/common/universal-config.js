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
    tabList: [],
    key: '',
    data: [],
    orgList: [],
    valueType: '',
    loading: false, // TODO DVA-LOADING 到底怎么用？
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      dispatch({ type: 'setTestData', payload: {} });
    },
  },

  effects: {
    *setCategory({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const { category } = payload;
      const data = yield call(uconfigService.listByCategory, category);
      yield put({ type: 'setCategorySuccess', payload: { category } });
      yield put({ type: 'setData', payload: { data } });
    },
    *setTabList({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const { category } = payload;
      const data = yield call(uconfigService.listByCategory, category);
      yield put({ type: 'setTabListSuccess', payload: { data } });
      if (data.data.data.length > 0) {
        const ct = `orglist_${data.data.data[0].id}`;
        const dt = yield call(uconfigService.listByCategory, ct);
        yield put({ type: 'setCategorySuccess', payload: { category: ct } });
        yield put({ type: 'setData', payload: { data: dt } });
      }
    },

    *getOrgCategory({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const { category } = payload;
      const data = yield call(uconfigService.listByCategory, category);
      yield put({ type: 'setCategorySuccess', payload: { category } });
      yield put({ type: 'setOrgList', payload: { data } });
    },

    *addKeyAndValue({ payload }, { call, put }) {
      // yield put({ type: 'showLoading' });
      const { category, key, val } = payload;
      const data = yield call(uconfigService.setByKey, category, key, val);
      console.log(data);
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
      if (data.data && data.data.status === true) {
        // do nothing....
      } else {
        console.error('deleteByKey Error: ', data);
      }
      yield put({ type: 'deleteByKeySuccess', payload: { key } });
    },
    *updateByKey({ payload }, { call, put }) {
      const { category, key, newKey } = payload;
      const data = yield call(uconfigService.updateByKey, category, key, newKey);
      if (data.data && data.data.status === true) {
        yield put({ type: 'updateByKeySuccess', payload: { key, newKey } });
      } else {
        console.error('updateByKey Error: ', data);
      }
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

    setOrgList(state, { payload: { data } }) {
      const newData = [];
      if (data.data.data) {
        for (const item in data.data.data) {
          if (item) {
            newData.push({ key: item, value: data.data.data[item] });
          }
        }
      }
      return { ...state, orgList: newData, loading: false };
    },

    updateData(state, { payload: { key, val } }) {
      // TODO 这里编辑会有问题,报bug.
      // const idx = findUniversalConfig(state.data, key);
      // if (idx === -1) {
      //   newData = [...state.data, { key, value: val }];
      // } else {
      //   newData = state.data;
      //   if (newData && newData[idx] && newData[idx].key === key) {
      //     newData[idx].value = val;
      //   }
      // }
      const idx = findIndexByKey(state.data, key);
      if (idx === -1) {
        let newData = [];
        const value = { key, value: val, category: state.category };
        newData = [...state.data, { key: state.data.length + 1, value }];
        return { ...state, data: newData };
      } else {
        return { ...state };
      }
    },

    deleteByKeySuccess(state, { payload: { key } }) {
      const idx = findIndexByKey(state.data, key);
      state.data.splice(idx, 1);
      return { ...state, data: state.data };
    },

    updateByKeySuccess(state, { payload: { key, newKey } }) {
      for (let i = 0; i < state.data.length; i++) {
        if (state.data[i].value.key === key) {
          state.data[i].value.key = newKey;
        }
      }
      return { ...state, data: state.data };
    },

    setTabListSuccess(state, { payload: { data } }) {
      const tabList = [];
      if (data.data.data) {
        for (const item in data.data.data) {
          if (item) {
            const category = `orglist_${data.data.data[item].id}`;
            tabList.push({ name: data.data.data[item].key, category });
          }
        }
      }
      return { ...state, tabList };
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

// function findUniversalConfig(data, targetKey) {
//   let idx = -1;
//   if (data) {
//     data.find((item, index) => {
//       if (item && item.key === targetKey) {
//         idx = index;
//         return true;
//       }
//       return false;
//     });
//   }
//   return idx;
// }
// 获取满足条件的数组下标
function findIndexByKey(data, targetKey) {
  let idx = -1;
  for (let i = 0; i < data.length; i++) {
    if (data[i].value.key === targetKey) {
      idx = i;
      break;
    }
  }
  return idx;
}
