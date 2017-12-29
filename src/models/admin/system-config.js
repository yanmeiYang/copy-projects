/**
 * Bo Gao on 2017-06-09
 */
import pathToRegexp from 'path-to-regexp';

export default {
  namespace: 'adminSystemConfig',

  state: {
    category: '',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const match = pathToRegexp('/admin/system-config/:category').exec(location.pathname);
        if (match) {
          const category = decodeURIComponent(match[1]);
          dispatch({ type: 'setParams', payload: { category } });
        }
      });
    },
  },

  effects: {
    // *getPerson({ payload }, { call, put }) {  // eslint-disable-line
    //   // console.log('effects: getPerson', payload);
    //   const { personId } = payload;
    //   const data = yield call(personService.getPerson, personId);
    //   yield put({ type: 'getPersonSuccess', payload: { data } });
    // },
  },

  reducers: {
    setParams(state, { payload: { category } }) {
      return { ...state, category };
    },

    /* update person profile info. */
    // TODO handel error.
    // getPersonSuccess(state, { payload: { data } }) {
    //   // console.log('reducers:getPersonSuccess', data.data);
    //   return { ...state, profile: data.data };
    // },
  },

};
