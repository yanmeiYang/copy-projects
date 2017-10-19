/**
 * Created by yangyanmei on 17/10/17.
 */
import pathToRegexp from 'path-to-regexp';
import * as personService from '../services/person';

// TODO Change this, copied from search.js.

export default {

  namespace: 'merge',

  state: {
    checkedPerson: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      // history.listen((location) => {
      // });
    },
  },

  effects: {},

  reducers: {
    updateCheckedPerson(state, { payload: { data, checkStatus } }) {
      if (checkStatus) {
        state.checkedPerson.push(data);
      } else if (!checkStatus) {
        state.checkedPerson.remove(data);
      }
      return { ...state, checkedPerson: state.checkedPerson };
    },
  },

};
