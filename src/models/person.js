import pathToRegexp from 'path-to-regexp';
import * as personService from '../services/person';

// TODO Change this, copied from search.js.

export default {

  namespace: 'person',

  state: {
    personId: '', // TODO how to find person's id? TODO pass id to this place.
    profile: {},

    results: [],
    offset: 0,
    query: null,
    isMotion: localStorage.getItem('antdAdminUserIsMotion') === 'true',
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      pageSize: 30,
      total: null,
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      history.listen((location) => {
        const match = pathToRegexp('/person/:id').exec(location.pathname);
        if (match) {
          const personId = decodeURIComponent(match[1]);
          // console.log('personId is :', personId);
          dispatch({ type: 'getPerson', payload: { personId } });
          // dispatch({ type: 'setParams', payload: { personId } });
        }
      });
    },
  },

  effects: {
    *getPerson({ payload }, { call, put }) {  // eslint-disable-line
      // console.log('effects: getPerson', payload);
      const { personId } = payload;
      const data = yield call(personService.getPerson, personId);
      console.log('sosososo', data)
      yield put({ type: 'getPersonSuccess', payload: { data } });
    },
  },

  reducers: {
    // setParams(state, { payload: { query, offset, size } }) {
    //   console.log('reducers:setParams ');
    //   return { ...state, query, offset, pagination: { pageSize: size } };
    // },

    /* update person profile info. */
    // TODO handel error.
    getPersonSuccess(state, { payload: { data } }) {
      // console.log('reducers:getPersonSuccess', data.data);
      return { ...state, profile: data.data };
    },
  },

};