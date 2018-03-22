import * as mgrService from 'services/mgr';

export default {
  namespace: 'mgr',
  state: {
    status: null,
    emailContent: null,
  },
  subscriptions: {},
  effects: {
    * getGlobalSchema({ payload }, { call, put }) {
      console.log('dddddddddddeeedddd',)
      const data = yield call(mgrService.getSchema, payload);
      yield put({ type: 'getGlobalSchemaSuccess', payload: { data } });
    },
    * getMineRolesAndPrivileges({ payload }, { call, put }) {
      const data = yield call(mgrService.getMineRolesAndPrivileges, payload);
      yield put({ type: 'getMineRolesAndPrivilegesSuccess', payload: { data } });
    },
    * getPrivileges({ payload }, { call, put }) {
      const data = yield call(mgrService.getPrivileges, payload);
      yield put({ type: 'getPrivilegesSuccess', payload: { data } });
    },

  },
  reducers: {
    getGlobalSchemaSuccess(state, { payload: { data } }) {
      return { ...state, globalSchema: data.data };
    },
    getMineRolesAndPrivilegesSuccess(state, { payload: { data } }) {
      return { ...state, MineRolesAndPrivileges: data.data };
    },
    getPrivilegesSuccess(state, { payload: { data } }) {
      return { ...state, Privileges: data.data };
    },
  },

};
