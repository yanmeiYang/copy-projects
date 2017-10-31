/**
 * Bo Gao on 2017-10-27
 */
export default {
  namespace: 'commonLabels',

  state: {
    tags: null,
  },

  subscriptions: {},

  effects: {
    * loadTagsBatch({ payload }, { call, put }) {
      // const { groupCategory, categoryTemplate } = payload;
      // callback data.
      // const data = yield call(uconfigService.listByCategory, groupCategory);
      // if (data && data.data && data.data.data) {
      //   const categories = [];
      //   data.data.data.map((item) => {
      //     const newCategory = categoryTemplate
      //       .replace('{id}', item.id)
      //       .replace('{key}', item.key)
      //       .replace('{value}', item.value);
      //     categories.push({ id: item.id, name: item.key, category: newCategory });
      //     console.log('data is: ', item, 'key is : ', newCategory);
      // return true;
      // });
      // yield put({ type: 'setCategories', payload: { categories } });
      // }
    },

  },

  reducers: {},

};
