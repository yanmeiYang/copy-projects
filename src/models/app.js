import { parse } from 'qs';
import { message as antdMessage } from 'antd';
import { routerRedux } from 'dva/router';
import { config, queryURL } from 'utils';
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

export default {
  namespace: 'app',
  state: {
    user: {},
    token: auth.getLocalToken(),
    roles: auth.createEmptyRoles(), // { admin: false, ccf_user: false, role: [], authority: [] },
    loading: false, // TODO what's this?

    isAdvancedSearch: false,

    // Layout related, not used. TODO remove them.
    menuPopoverVisible: false,
    siderFold: localStorage.getItem(`${prefix}siderFold`) === 'true',
    darkTheme: localStorage.getItem(`${prefix}darkTheme`) === 'true',
    isNavbar: false, // document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(localStorage.getItem(`${prefix}navOpenKeys`)) || [],

  },

  subscriptions: {
    setup({ dispatch }) {
      // 刷新页面第一次调用。
      auth.ensureUserAuthFromAppModel(dispatch);

      // TODO remove this.
      let tid;
      window.onresize = () => {
        clearTimeout(tid);
        tid = setTimeout(() => {
          dispatch({ type: 'changeNavbar' });
        }, 300);
      };
    },
  },

  effects: {
    // make sure app.user is filled.
    * getMe({ payload }, { call, put }) {
      const { success, data } = yield call(authService.getCurrentUserInfo, parse(payload));
      if (success && data) {
        yield put({ type: 'getMeSuccess', payload: data });
      }
    },

    // params: src, restrictRoot, backdoor.
    * login({ payload }, { put, call }) {
      // first call login.
      const { restrictRoot, backdoor, ...params } = payload;
      const { src } = params;
      let authData;
      try {
        const { success, data } = yield call(authService.login, params);
        authData = data;
      } catch (err) {
        const { success, statusCode, message } = err;
        if (!success && statusCode > 400 && statusCode < 500) {
          antdMessage.error('用户名和密码错误'); // TODO
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
          yield put({ type: 'getMeSuccess', payload: getMeData.data });
          yield put({ type: 'auth/hideLoading' });
          // yield auth.dispatchAfterLogin(put);
          const from = queryURL('from') || '/';
          if (process.env.NODE_ENV !== 'production') {
            console.log('Login Success, Dispatch to ', decodeURIComponent(from));
          }
          yield put(routerRedux.push({ pathname: decodeURIComponent(from) }));
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

      yield put(routerRedux.push({
        pathname: sysconfig.Auth_LoginPage,
        query: { from: auth.getLoginFromURL() },
      }));

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

    * changeNavbar({ payload }, { put, select }) {
      const { app } = yield (select(_ => _));
      const isNavbar = false; // document.body.clientWidth < 769
      if (isNavbar !== app.isNavbar) {
        yield put({ type: 'handleNavbar', payload: isNavbar });
      }
    },
  },

  reducers: {
    getMeSuccess(state, { payload: user }) {
      const roles = auth.parseRoles(user);
      auth.saveLocalAuth(user, roles);
      return { ...state, user, roles };
    },

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

    switchSider(state) {
      localStorage.setItem(`${prefix}siderFold`, !state.siderFold);
      return {
        ...state,
        siderFold: !state.siderFold,
      };
    },

    switchTheme(state) {
      localStorage.setItem(`${prefix}darkTheme`, !state.darkTheme);
      return {
        ...state,
        darkTheme: !state.darkTheme,
      };
    },

    switchMenuPopver(state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      };
    },

    handleNavbar(state, { payload }) {
      return {
        ...state,
        isNavbar: payload,
      };
    },

    handleNavOpenKeys(state, { payload: navOpenKeys }) {
      return {
        ...state,
        ...navOpenKeys,
      };
    },

    layout(state, { payload }) {
      return { ...state, ...payload };
    },

    logoutSuccess(state) {
      auth.removeLocalAuth();
      return { ...state, user: {}, token: null, roles: auth.createEmptyRoles() };
    },

    showLoading(state) {
      return { ...state, loading: true };
    },

    hideLoading(state) {
      return { ...state, loading: false };
    },

  },
};
