/**
 * Created by yangyanmei on 17/6/29.
 */
import { routerRedux } from 'dva/router';
import { config } from '../../utils';
import * as authService from '../../services/auth';

export default {
  namespace: 'auth',
  state: { validEmail: true, listUsers: [], loading: false, isUpdateForgotPw: false },
  subscriptions: {
    // setup({ dispatch, history }) {
    //   history.listen((location, query) => {
    //     if (location.pathname === '/admin/users') {
    //       dispatch({ type: 'listUsersByRole', payload: { role: 'ccf', offset: 0, size: 10 } });
    //     }
    //   });
    // },
  },
  effects: {
    *createUser({ payload }, { call, put }) {
      const { email, first_name, gender, last_name, position, sub, role, src } = payload;
      const { data } =
        yield call(authService.createUser, email, first_name, gender, last_name, position, sub, src);
      yield put({ type: 'createUserSuccess', payload: data });
      const uid = data.uid;
      yield call(authService.invoke, uid, config.source);
      const arr = role.split('_');
      if (arr.length === 3) {
        yield call(authService.invoke, uid, `ccf_authority${arr[2]}`);
      } else if (arr.length === 2) {
        yield call(authService.invoke, uid, `ccf_${arr[1]}`);
      }
      // for (const value of role) {
      //   yield call(authService.invoke, uid, value.id);
      // }
      // yield call(authService.invoke, uid, role);
      // if (authority) {
      //   yield call(authService.invoke, uid, authority);
      // }
      // if (payload.authority_region) {
      //   yield call(authService.invoke, uid, payload.authority_region);
      // }
    },

    *addRoleByUid({ payload }, { call, put }) {
      const { uid, role } = payload;
      yield call(authService.invoke, uid, role);
      const { data } = yield call(authService.listUsersByRole, 'ccf', 0, 100);
      yield put({ type: 'getListUserByRoleSuccess', payload: data });
    },

    *delRoleByUid({ payload }, { call }) {
      const { uid, role } = payload;
      yield call(authService.revoke, uid, role);
    },

    *checkEmail({ payload }, { call, put }) {
      const { data } = yield call(authService.checkEmail, config.source, payload.email);
      yield put({ type: 'checkEmailSuccess', payload: data.status });
    },

    *listUsersByRole({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const { role, offset, size } = payload;
      const { data } = yield call(authService.listUsersByRole, role, offset, size);
      yield put({ type: 'getListUserByRoleSuccess', payload: data });
    },

    *forgotPassword({ payload }, { call, put }) {
      const { data } = yield call(authService.forgot, payload);
      yield put({ type: 'forgotPasswordSuccess', data });
    },

    *retrievePw({ payload }, { call, put }) {
      const { data } = yield call(authService.retrieve, payload);
      if (data.status) {
        localStorage.setItem('token', data.token);
        yield put(routerRedux.push('/'));
      } else {
        throw data;
      }
    },
  },
  reducers: {
    createUserSuccess(state) {
      // TODO 注册成功以后的提示信息
      return { ...state };
    },
    checkEmailSuccess(state, { payload }) {
      return { ...state, validEmail: payload };
    },

    forgotPasswordSuccess(state, { data }) {
      return { ...state, isUpdateForgotPw: data.status };
    },
    getListUserByRoleSuccess(state, { payload: { data } }) {
      for (const [key, value] of data.entries()) {
        value.new_role = {};
        for (const role of data[key].role.values()) {
          if (role.indexOf('ccf_') >= 0) {
            if (role.split('_').length === 2) {
              value.new_role = role.split('_')[1];
            }
            if (role.split('_').length === 3) {
              value.authority = role.split('_')[2];
            }
          }
        }
      }
      return { ...state, listUsers: data, loading: false };
    },

    showLoading(state) {
      return {
        ...state,
        loading: true,
      };
    },
  },

};
