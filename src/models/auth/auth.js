/**
 * Created by yangyanmei on 17/6/29.
 */
import { routerRedux } from 'dva/router';
import pathToRegexp from 'path-to-regexp';
import * as authService from '../../services/auth';

export default {
  namespace: 'auth',
  state: { validEmail: true, listUsers: [], loading: false },
  subscriptions: {},
  effects: {
    *createUser({ payload }, { call, put }){
      const { email, first_name, gender, last_name, position, sub, role, authority_region, authority } = payload;
      const { data } = yield call(authService.createUser, email, first_name, gender, last_name, position, sub);
      yield  put({ type: 'createUserSuccess', payload: data });
      const uid = data.uid;
      yield call(authService.invoke, uid, 'ccf');
      yield call(authService.invoke, uid, role);
      if (authority) {
        yield call(authService.invoke, uid, authority);
      }
      if (authority_region) {
        yield call(authService.invoke, uid, authority_region);
      }
    },
    *checkEmail({ payload }, { call, put }){
      const { data } = yield call(authService.checkEmail, payload);
      yield put({ type: 'checkEmailSuccess', payload: data.status })
    },

    *listUsersByRole({ payload }, { call, put }){
      yield put({ type: 'showLoading' });
      const { role, offset, size } = payload;
      const { data } = yield call(authService.listUsersByRole, role, offset, size);
      yield put({ type: 'getListUserByRoleSuccess', payload: data });

    },
  },
  reducers: {
    createUserSuccess(state, { payload: { data } }){
      //TODO 注册成功以后的提示信息
      return { ...state }
    },
    checkEmailSuccess(state, { payload }){
      return { ...state, validEmail: payload }
    },

    getListUserByRoleSuccess(state, { payload: { data } }){
      for (const key in data) {
        data[key].new_role = '';
        for (const r in data[key].role) {
          const role = data[key].role[r];
          if (role.indexOf('ccf_') >= 0) {
            if (role.split('_').length === 2) {
              data[key].new_role = role.split('_')[1];
            }
            if (role.split('_').length === 3) {
              data[key].authority = role.split('_')[2];
            }
          }
        }
      }
      return { ...state, listUsers: data, loading: false }
    },

    showLoading(state) {
      return {
        ...state,
        loading: true,
      };
    },
  }

}
