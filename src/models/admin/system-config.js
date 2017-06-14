/**
 * Bo Gao on 2017-06-09
 */
import pathToRegexp from 'path-to-regexp';
import * as personService from '../../services/person';

export default {

  namespace: 'adminSystemConfig',

  state: {
    personId: '',
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
    setup({ dispatch, history }) {
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
