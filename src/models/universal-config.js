/**
 * Bo Gao on 2017-06-12
 */
import pathToRegexp from 'path-to-regexp';
import * as uconfigService from 'services/common/universal-config';

export default {
  namespace: 'universalConfig',

  state: {
    source: '', // If don't set, service will get value from config.
    category: '',
    key: '',
    data: [],

    // 一组 categories, 用来支撑一个页面中多tab切换的功能。 原来的 tabList: [],
    categories: [],

    // TODO 通用化
    orgList: [],
    valueType: '',
    loading: false, // TODO DVA-LOADING 到底怎么用？
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      // dispatch({ type: 'setTestData', payload: {} });
    },
  },

  effects: {
    // --------------------------------------
    // 操作cateories， 也就是groups
    // --------------------------------------

    // 根据一个category，获取所有下面的数据，并且作为另一个一个列表的KEY.
    // categoryTemplate - support {key}, {id}，{value}
    * getCategoryGroup({ payload }, { call, put }) {
      const { groupCategory, categoryTemplate } = payload;
      // callback data.
      const data = yield call(uconfigService.listByCategory, groupCategory);
      if (data && data.data && data.data.data) {
        const categories = [];
        data.data.data.map((item) => {
          const newCategory = categoryTemplate
            .replace('{id}', item.id)
            .replace('{key}', item.key)
            .replace('{value}', item.value);
          categories.push({ id: item.id, name: item.key, category: newCategory });
          // console.log('data is: ', item, 'key is : ', newCategory);
          return true;
        });
        yield put({ type: 'setCategories', payload: { categories } });
      }
    },

    // Add category groups; refresh after add.
    * addCategoryGroup({ payload }, { call, put }) {
      const { category, key, val, categoryTemplate } = payload;
      // TODO yu 这个api添加成功后没有返回ID。
      const data = yield call(uconfigService.setByKey, category, key, val);
      if (data.data && data.data.status === true) {
      } else {
        console.error('addKeyAndValue Error: ', data);
      }
      // reload list;
      yield put({
        type: 'getCategoryGroup',
        payload: { groupCategory: category, categoryTemplate },
      });
    },

    // TODO yu need delete by id. now delete key by key.
    * deleteCategoryGroup({ payload }, { call, put }) {
      const { category, key } = payload;
      const data = yield call(uconfigService.deleteByKey, category, key);
      if (process.env.NODE_ENV !== 'production') {
        // TODO check returned results.
        console.log('delete category group: result is: ', data);
      }
      yield put({ type: 'deleteCategoryGroupSuccess', payload: { key } });
    },

    // TODO
    * updateCategoryGroup({ payload }, { call, put }) {
      const { category, key, newKey } = payload;
      const data = yield call(uconfigService.updateByKey, category, key, newKey);
      if (data.data && data.data.status === true) {
        yield put({ type: 'updateCategoryGroupSuccess', payload: { key, newKey } });
      } else {
        console.error('updateByKey Error: ', data);
      }
    },

    // --------------------------------------
    // 操作某个Category下面的List
    // --------------------------------------

    // 取出一个category 下面所有的 key,value 列表。
    * setCategory({ payload }, { call, put }) {
      // empty list ?????
      yield put({ type: 'setData', payload: { data: { data: {} } } });
      yield put({ type: 'showLoading' });
      const { category } = payload;
      const data = yield call(uconfigService.listByCategory, category);
      yield put({ type: 'setCategorySuccess', payload: { category } });
      yield put({ type: 'setData', payload: { data } });
    },

    // TODO change this just like getCategoryGroup
    * getOrgCategory({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const { category } = payload;
      const data = yield call(uconfigService.listByCategory, category);
      yield put({ type: 'setCategorySuccess', payload: { category } });
      yield put({ type: 'setOrgList', payload: { data } });
    },

    * addKeyAndValue({ payload }, { call, put }) {
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

    * deleteByKey({ payload }, { call, put }) {
      const { category, key } = payload;
      const data = yield call(uconfigService.deleteByKey, category, key);
      if (data.data && data.data.status === true) {
        // do nothing....
      } else {
        console.error('deleteByKey Error: ', data);
      }
      yield put({ type: 'deleteByKeySuccess', payload: { key } });
    },

    * updateByKey({ payload }, { call, put }) {
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
    // --------------------------------------
    // 操作cateories， 也就是groups
    // --------------------------------------
    setCategories(state, { payload: { categories } }) {
      return { ...state, categories };
    },

    deleteCategoryGroupSuccess(state, { payload: { key } }) {
      return { ...state, categories: state.categories.filter(group => group.name !== key) };
    },

    updateCategoryGroupSuccess(state, { payload: { key, newKey } }) {
      const categories = state.categories.map((group) => {
        return group.name === key ? { ...group, name: newKey } : group;
      });
      return { ...state, categories };
    },

    // --------------------------------------
    // 操作某个Category下面的List
    // --------------------------------------
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
      // TODO 谁说sate里面一定有data的？
      for (let i = 0; i < state.data.length; i++) {
        if (state.data[i].value.key === key) {
          // TODO yanmei 不可以修改state, 弄一个新的然后return.
          state.data[i].value.key = newKey;
        }
      }
      return { ...state, data: state.data };
    },

    /* update person profile info. */
    // TODO handel error.
    getPersonSuccess(state, { payload: { data } }) {
      return { ...state, profile: data.data };
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
  for (let i = 0; i < data.length; i += 1) {
    if (data[i].value.key === targetKey) {
      idx = i;
      break;
    }
  }
  return idx;
}
