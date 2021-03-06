/* eslint-disable camelcase */
/**
 * Created by BoGao on 2018-08-13.
 */
import { sysconfig } from 'systems';
import * as authService from 'services/auth';
import * as uconfigService from 'services/common/universal-config';
import * as expertBaseService from 'services/expert-base';

export default {
  namespace: 'auth',
  state: {
    validEmail: null,
    listUsers: [],
    loading: false,
    isUpdateForgotPw: false,
    message: null, // used in message.
    retrieve: {},
    userRoles: [],
    errorMessage: '',
  },

  subscriptions: {},

  effects: {
    * createUser({ payload }, { call, put }) {
      const { email, first_name, gender, last_name, position, sub, password, role, ghost } = payload;
      try {
        const { data } = yield call(authService.createUser, email, first_name, gender,
          last_name, position, sub, password);
        if (data.status) {
          const uid = data.uid;
          yield call(authService.invoke, uid, sysconfig.SOURCE);
          if (sysconfig.ShowRegisteredRole) {
            const arr = role.split('_');
            if (arr.length === 2) {
              yield call(authService.invoke, uid, `${arr[0]}`);
              yield call(authService.invoke, uid, `authority_${arr[1]}`);
            } else if (arr.length === 1) {
              yield call(authService.invoke, uid, `${arr[0]}`);
            }
          }

          // Add Hooks.
          // const hooks = sysconfig.RegisterUserHooks || [];
          // for (const hook of hooks) {
          //   if (hook) {
          //     hook();
          //   }
          // }
          const ids = sysconfig.Register_AddPrivilegesToExpertBaseIDs;
          if (ids && ids.length > 0) {
            for (const id of ids) {
              console.log('================================ dAdd privileges to eb: ', id, first_name);
              const { data } = yield call(
                expertBaseService.rosterManage,
                {
                  payload: {
                    id,
                    name: `${first_name} ${last_name}`,
                    email: `${email}@${sysconfig.SOURCE}`,
                    perm: 3,
                  },
                },
              );
            }
          }

          if (!ghost) {
            yield put({ type: 'createUserSuccess', payload: data });
          } else {
            return data;
          }
        }
      } catch (err) {
        return err;
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

    * create3rdUser({ payload }, { call, put }) {
      const { email, first_name, gender, last_name, position, sub, password, role, token } = payload;
      const { data } = yield call(authService.createUser, email, first_name, gender, last_name, position, sub, password);
      yield put({ type: 'createUserSuccess', payload: data });
      if (data.status) {
        const uid = data.uid;
        yield call(authService.invoke, uid, sysconfig.SOURCE, token);
        yield call(authService.invoke, uid, role, token);
        return true;
      }
    },
    * addForbidByUid({ payload }, { call, put }) {
      const { uid, role } = payload;
      const data = yield call(authService.invoke, uid, role);
      if (data.data.status) {
        yield put({ type: 'addForbidSuccess', payload });
      }
    },

    * addRoleByUid({ payload }, { call, put }) {
      const { uid, role } = payload;
      yield call(authService.invoke, uid, role);
      const { data } = yield call(authService.listUsersByRole, 0, 100);
      yield put({ type: 'getListUserByRoleSuccess', payload: data });
    },

    * delRoleByUid({ payload }, { call, put }) {
      const { uid, role } = payload;
      const data = yield call(authService.revoke, uid, role);
      if (data.data.status) {
        yield put({ type: 'delRoleSuccess', payload });
      }
    },

    * checkEmail({ payload }, { call, put }) {
      const { email, source } = payload;
      const src = source || sysconfig.SOURCE;
      const { data } = yield call(authService.checkEmail, src, email);
      yield put({ type: 'checkEmailSuccess', payload: data.status });
      // return a value to support promise.
      if (data && data.status) {
        return true;
      }
    },

    * listUsersByRole({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const { role, offset, size } = payload;
      const { data } = yield call(authService.listUsersByRole, offset, size);
      yield put({ type: 'getListUserByRoleSuccess', payload: data });
    },

    * forgotPassword({ payload }, { call, put }) {
      const { data } = yield call(authService.forgot, payload);
      yield put({ type: 'forgotPasswordSuccess', data });
    },

    * retrievePw({ payload }, { call, put }) {
      const { data } = yield call(authService.retrieve, payload);
      if (data.status) {
        yield put({ type: 'retrievePsSuccess', data });
      } else {
        throw data;
      }
    },

    * updateProfile({ payload }, { call, put }) {
      const { uid, name } = payload;
      const { data } = yield call(authService.updateProfile, uid, name);
    },

    * addOrgCategory({ payload }, { call, put }) {
      const { category, key, val } = payload;
      yield call(uconfigService.setByKey, category, key, val);
    },

    // 获取注册用户列表
    * getCategoryByUserRoles({ payload }, { call, put }) {
      const { category, source } = payload;
      const data = yield call(uconfigService.listByCategory, category, source);
      yield put({ type: 'setData', payload: { data } });
    },
  },

  reducers: {
    createUserSuccess(state) {
      // TODO 注册成功以后的提示信息
      return { ...state };
    },
    delRoleSuccess(state, { payload }) {
      const { uid } = payload;
      const listUsers = [];
      state.listUsers.map((item) => {
        if (item.id === uid) {
          const role = item.role.filter(term => term !== `${sysconfig.SOURCE}_forbid`);
          item.role = role;
        }
        listUsers.push(item);
        return true;
      });
      return { ...state, listUsers };
    },

    addForbidSuccess(state, { payload }) {
      const { uid } = payload;
      const listUsers = [];
      state.listUsers.map((item) => {
        if (item.id === uid) {
          item.role.push(`${sysconfig.SOURCE}_forbid`);
        }
        listUsers.push(item);
        return true;
      });
      return { ...state, listUsers };
    },

    checkEmailSuccess(state, { payload }) {
      return { ...state, validEmail: payload };
    },

    forgotPasswordSuccess(state, { data }) {
      return { ...state, isUpdateForgotPw: data.status, message: data.message };
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

    retrievePsSuccess(state, { data }) {
      return { ...state, retrieve: data };
    },

    setData(state, { payload: { data } }) {
      const newData = [];
      if (data.data.data) {
        for (const item in data.data.data) {
          if (item) {
            newData.push({ key: item, value: data.data.data[item] });
          }
        }
      }
      return { ...state, userRoles: newData, loading: false };
    },

    // bogao
    setMessage(state, { payload: { message } }) {
      return { ...state, errorMessage: message };
    },

    loginError(state, data) {
      return { ...state, errorMessage: data.data, loading: false };
    },

    showLoading(state) {
      return { ...state, loading: true };
    },

    hideLoading(state) {
      return { ...state, loading: false };
    },
  },

};

