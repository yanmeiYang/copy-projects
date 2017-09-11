import * as expertBaseService from 'services/expert-base';

const JOINBYDOT = '.';

export default {

  namespace: 'personComments',

  state: {
    tobProfileMap: {},
  },

  subscriptions: {},

  effects: {
    * getTobProfileList({ payload }, { call, put }) {  // eslint-disable-line
      const { persons } = payload;
      const ids = [];
      for (const person of persons) {
        ids.push(person.id);
      }
      const { data } = yield call(expertBaseService.getToBProfile, ids.join(JOINBYDOT));
      yield put({ type: 'commentToMap', payload: { data } });
    },
  },

  reducers: {
    commentToMap(state, { payload: { data } }) {
      const tempComments = new Map();
      for (const tobProfile of data.data) {
        tempComments.set(tobProfile.aid, tobProfile);
      }
      return { ...state, tobProfileMap: tempComments };
    },
  },

};
