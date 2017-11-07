/**
 * Created by yangyanmei on 17/11/5.
 */
import { sysconfig } from 'systems';
import * as searchService from 'services/search';

export default {

  namespace: 'exportExperts',

  state: {},

  subscriptions: {
    setup() {
    },
  },

  effects: {
    * searchPerson({ payload }, { call, all }) {
      const { query, filters, sort, exportSize } = payload;
      let searchResults = [];
      for (let i = 0; i < exportSize; i += 100) {
        const top = yield call(searchService.searchPerson, query, i, 100, filters, sort);
        if (top.success) {
          if (top.data && top.data.items) {
            searchResults = searchResults.concat(top.data.items);
          }
        } else if (top.data && top.data.result) {
          searchResults = searchResults.concat(top.data.result);
        }
      }
      if (searchResults.length > 0) {
        return searchResults;
      } else {
        throw new Error('Result Not Available');
      }
    },
  },

  reducers: {},

};
