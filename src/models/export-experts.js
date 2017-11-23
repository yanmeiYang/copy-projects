/**
 * Created by yangyanmei on 17/11/5.
 */
import { sysconfig } from 'systems';
import * as searchService from 'services/search';
import bridge from 'utils/next-bridge';

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
        const params = { query, offset: i, size: 100, filters, sort };
        const top = yield call(searchService.searchPerson, params);
        if (top.data && top.data.succeed) {
          searchResults = searchResults.concat(top.data.items);
        } else if (top.data && top.data.result) {
          const nextResult = bridge.toNextPersons(top.data.result);
          searchResults = searchResults.concat(nextResult);
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
