import { parse } from 'qs';
import { message as antdMessage } from 'antd';
import { Map } from 'immutable';
import { router } from 'core';
import { config, queryURL } from 'utils';
import * as debug from 'utils/debug';
import { mergeLibs } from 'utils/requirejs';
import * as auth from 'utils/auth';
import * as authService from 'services/auth';
import { sysconfig } from 'systems';
import { defineMessages, injectIntl } from 'react-intl';

const { prefix } = config;

const messages = defineMessages({
  errorMessage401: {
    id: 'message.error.login.401',
    defaultMessage: 'User name or password not match!',
  },
});

// TODO use immutablejs to speedup this file.
export default {
  namespace: 'app',

  state: {
    token: auth.getLocalToken(),
    user: null, // immutable user.

    // { admin: false, ccf_user: false, role: [], authority: [] },
    roles: auth.createEmptyRoles(), // TODO immutable it

    feedbackStatus: null, // TODO immutable TODO move out.

    // ------------- organize this ---------------------

    isAdvancedSearch: false,

    headerResources: null, // { key: [<helmet_component>] }
  },

  subscriptions: {
    setup({ dispatch }) {
      // 刷新页面第一次调用。
      auth.ensureUserAuthFromAppModel(dispatch);

      // 这里的DEBUG内容，只有开发模式时才生效。
      if (process.env.NODE_ENV !== 'production') {
        dispatch({ type: 'set', payload: { debug } });
      }
    },
  },

  effects: {
    // make sure app.user is filled.
    * getMe({ payload }, { call, put }) {
      const { success, data } = yield call(authService.getCurrentUserInfo, parse(payload));
      if (success && data) {
        yield put({ type: 'getMeSuccess', payload: data });
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>', data);
      }
    },

    // params: src, restrictRoot, backdoor.
    * login({ payload }, { put, call }) {
      // first call login.
      const { restrictRoot, backdoor, ...params } = payload;
      const { src, role } = params;
      let authData;
      try {
        const { success, data } = yield call(authService.login, params);
        authData = data;
      } catch (err) {
        const { success, statusCode, message } = err;
        if (!success && statusCode > 400 && statusCode < 500) {
          antdMessage.error('用户名或密码错误'); // TODO @alice i18n
          yield put({ type: 'auth/loginError', data: message });
        } else {
          throw err;
        }
      }

      // then get me.
      if (authData && authData.status) {
        if (src) {
          auth.saveLocalTokenSystem(src, authData.token);
        }
        auth.saveLocalToken(authData.token);

        const getMeParam = {};
        if (backdoor) {
          getMeParam.token = authData.token;
        }

        // TODO if(restrictRoot){ ... }
        // update me info.
        let getMeData;
        try {
          getMeData = yield call(authService.getCurrentUserInfo, getMeParam);
        } catch (err) {
          const { success, statusCode, message } = err;
          if (!success && statusCode > 400 && statusCode < 500) {
            antdMessage.error('认证失败!'); // TODO
            yield put({ type: 'auth/loginError', data: message });
          } else {
            throw err;
          }
        }
        if (getMeData && getMeData.data) {
          yield put({ type: 'getMeSuccess', payload: getMeData.data, role });
          yield put({ type: 'auth/hideLoading' });
          // yield auth.dispatchAfterLogin(put);
          const from = queryURL('from') || '/';
          if (process.env.NODE_ENV !== 'production') {
            console.log('Login Success, Dispatch to ', decodeURIComponent(from));
          }
          // TODO umi router
          router.push(decodeURIComponent(from));
          // yield put(router.push({ pathname: decodeURIComponent(from) }));
          return true; // login success
        }
      } else {
        console.error('Login error:', authData);
        yield put({ type: 'auth/loginError', authData });
      }
    },

    * logout({ payload }, { call, put }) {
      // 先logout，再调用api.
      const token = auth.getLocalToken();
      yield put({ type: 'logoutSuccess' });
      // yield auth.dispatchToLogin(put); // don't work

      if (sysconfig.AuthLoginUsingThird) {
        window.location.href = sysconfig.AuthLoginUsingThirdPage;
      } else {
        // TODO umi router.
        router.push(sysconfig.Auth_LoginPage);
        // yield put(routerRedux.push({
        //   pathname: sysconfig.Auth_LoginPage,
        //   query: { from: auth.getLoginFromURL() },
        // }));
      }

      // last call api.
      const data = yield call(authService.logout, token);
      if (data.data.status) {
        if (process.env.NODE_ENV !== 'production') {
          console.log('Logout successful');
        }
      } else {
        throw (data);
      }
    },

    // TODO umi make this a component, with models along or no model.
    * setFeedback({ payload }, { call, put }) {
      const { email, content, user, url } = payload;
      console.log('', email, content, user);
      const subject = `[${sysconfig.SOURCE}] ${content.slice(0, 50)}`;
      const body = `<div>${content}
<br><br>Email:&nbsp;&nbsp;&nbsp;${email || ''}<br>URL:&nbsp;&nbsp;&nbsp;${url}<br>System:&nbsp;&nbsp;&nbsp;${sysconfig.SOURCE}
<br>userID:&nbsp;&nbsp;&nbsp;${user.id}<br>userName:&nbsp;&nbsp;${user.display_name}<br>userEmail:&nbsp;&nbsp;${user.email}
<br>userRole:&nbsp;&nbsp;${user.role}<br>time:&nbsp;&nbsp;&nbsp;${new Date()}</div>`;

      const data = yield call(authService.setFeedback, {
        subject: subject.replace(/[\r\n]/g, ' '),
        body,
      });

      yield put({ type: 'feedbackSuccess', payload: data });
    },
  },

  reducers: {
    set(state, { payload }) {
      return { ...state, ...payload };
    },

    setDebug(state, { payload }) {
      return { ...state, debug: { ...state.debug, ...payload } };
    },

    getMeSuccess(state, { payload: user, role }) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>', user, role);
      const roles = auth.parseRoles(user);
      if (role) { // tencent在用
        if (roles.role.length > 0 && !roles.role.includes(role)) {
          roles.role[0] = role;
        }
      }
      auth.saveLocalAuth(user, roles);
      return { ...state, user, roles };
    },

    layout(state, { payload }) {
      return { ...state, ...payload };
    },

    // ---------- below delete later -----------

    emptyAuthInfo(state) {
      return { ...state, user: undefined, roles: undefined, token: undefined };
    },

    alreadyLoggedIn(state, { user, roles }) {
      return { ...state, user, roles };
    },

    toggleAdvancedSearch(state) {
      return { ...state, isAdvancedSearch: !state.isAdvancedSearch };
    },

    changeToAdvancedSearch(state) {
      return { ...state, isAdvancedSearch: true };
    },

    changeToSimpleSearch(state) {
      return { ...state, isAdvancedSearch: false };
    },

    logoutSuccess(state) {
      auth.removeLocalAuth();
      return { ...state, user: {}, token: null, roles: auth.createEmptyRoles() };
    },

    feedbackSuccess(state, { payload }) {
      return { ...state, feedbackStatus: payload.success };
    },
  },
};
