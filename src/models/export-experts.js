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
    * searchPerson({ payload }, { call, put, all }) {
      const { query, filters, sort } = payload;
      // const data = yield call(searchService.searchPerson, query, filters, sort);

      const { top100, top200, top300, top400, top500 } = yield all({
        top100: call(searchService.searchPerson, query, 0, 100, filters, sort),
        top200: call(searchService.searchPerson, query, 100, 100, filters, sort),
        top300: call(searchService.searchPerson, query, 200, 100, filters, sort),
        top400: call(searchService.searchPerson, query, 300, 100, filters, sort),
        top500: call(searchService.searchPerson, query, 400, 100, filters, sort),
      });

      if (top100.data && top100.data.result && top200.data && top200.data.result
        && top300.data && top300.data.result && top400.data && top400.data.result
        && top500.data && top500.data.result) {
        return top100.data.result.concat(top200.data.result).concat(top300.data.result).concat(top400.data.result).concat(top500.data.result);
      } else {
        throw new Error('Result Not Available');
      }
    },
  },

  reducers: {},

};
