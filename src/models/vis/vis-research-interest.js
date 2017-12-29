/**
 *  File Created by BoGao on 2017-06-04;
 *  Moved form aminer-web, on 2017-06-04;
 */
import * as personService from '../../services/person';

export default {

  namespace: 'visResearchInterest',
  sizePerPageByAll: 100,

  state: {
    data: [],
  },

  subscriptions: {
    // setup({ dispatch, history }) {},
  },

  effects: {
    *getInterestVisData({ payload }, { call, put }) {
      const { personId } = payload;
      const data = yield call(personService.getInterestVisData, personId);
      // console.log('Person Interest Data is ', data);
      yield put({ type: 'getInterestVisDataSuccess', payload: { data } });
    },
  },

  reducers: {
    getInterestVisDataSuccess(state, { payload: { data } }) {
      return { ...state, data: data.data };
    },
  },


};
