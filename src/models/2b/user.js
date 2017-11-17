// import { routerRedux } from 'dva/router';
import { sysconfig } from 'systems';
import * as authService from 'services/auth';
import * as expertBaseService from 'services/expert-base';
import { takeLatest } from '../helper';

export default {
  namespace: 'user',
  state: {
    validEmail: null,
    listUsers: [],
    loading: false,
    isUpdateForgotPw: false,
    message: null,
    retrieve: {},
    userRoles: [],
    errorMessage: '',
    source: '',
  },
  subscriptions: {},
  effects: {
    * createUser({ payload }, { call, put }) {
      const { email, first_name, gender,
        last_name, position, sub, password, role, source } = payload;
      const { data } = yield call(
        authService.createUser,
        email, first_name, gender, last_name, position, sub, password, source,
        );
      yield put({ type: 'createUserSuccess', payload: data });
      if (data.status) {
        const { uid } = data;
        yield call(authService.invoke, uid, source);
        if (sysconfig.ShowRegisteredRole) {
          const arr = role.split('_');
          if (arr.length === 2) {
            yield call(authService.invoke, uid, `${arr[0]}`);
            yield call(authService.invoke, uid, `authority_${arr[1]}`);
          } else if (arr.length === 1) {
            yield call(authService.invoke, uid, `${arr[0]}`);
          }
        }
        const ids = sysconfig.Register_AddPrivilegesToExpertBaseIDs;
        if (ids && ids.length > 0) {
          for (const id of ids) {
            const { data } = yield call(
              expertBaseService.rosterManage,
              {
                payload:
                  {
                    id,
                    name: `${ first_name } ${last_name}`,
                    email: `${email}@${sysconfig.SOURCE}`,
                    perm: 3,
                  },
              },
            );
          }
        }
      }
    },
    listUsersByRole: [function* ({ payload }, { call, put }) {
      const { offset, size, source } = payload;
      const { data } = yield call(authService.listUsersByRole, offset, size, source);
      yield put({ type: 'getListUserByRoleSuccess', payload: data });
    }, takeLatest],
  },
  reducers: {
    createUserSuccess(state) {
      // TODO 注册成功以后的提示信息
      return { ...state };
    },
    getListUserByRoleSuccess(state, { payload: { data } }) {
      for (const [key, value] of data.entries()) {
        value.new_role = {};
        for (const role of data[key].role.values()) {
          if (role.indexOf(`${sysconfig.SOURCE}_`) >= 0) {
            if (role.split('_').length === 2 && role.split('_')[1] !== 'forbid') {
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
  },
};
