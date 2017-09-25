import { parse } from 'qs';
import { routerRedux } from 'dva/router';
import { config, queryURL } from '../utils';
import * as auth from '../utils/auth';
import * as authService from '../services/auth';
import { sysconfig } from '../systems';

const { prefix } = config;
// TODO remove unnecessary.
export default {
  namespace: 'app',
  state: {
    // User/auth token related. TODO move to auth module.
    user: {},
    token: auth.getLocalToken(),
    roles: auth.createEmptyRoles(), // { admin: false, ccf_user: false, role: [], authority: [] },
    loading: false,

    // layout switches.
    headerSearchBox: null, // Header search box parameters.
    showFooter: true,

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
      const { data } = yield call(authService.getCurrentUserInfo, parse(payload));
      if (data) {
        yield put({ type: 'getMeSuccess', payload: data });
      }
    },

    * login({ payload }, { put, call }) {
      const { data } = yield call(authService.login, payload);
      if (data.status) {
        auth.saveLocalToken(data.token);
        // update me info.
        const getMeData = yield call(authService.getCurrentUserInfo);
        if (getMeData && getMeData.data) {
          yield put({ type: 'getMeSuccess', payload: getMeData.data });
          yield put({ type: 'auth/hideLoading' });
          // yield auth.dispatchAfterLogin(put);
          const from = queryURL('from') || '/';
          if (process.env.NODE_ENV !== 'production') {
            console.log('Login Success, Dispatch to ', decodeURIComponent(from));
          }
          yield put(routerRedux.push({ pathname: decodeURIComponent(from) }));

          console.log('--------------------------------------- done');
          // yield put(routerRedux.push({ pathname: '/' }));// temp
        }
      } else {
        console.error('Login error:', data);
        yield put({ type: 'auth/loginError', data });
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

    hideHeaderSearch(state) {
      return { ...state, headerSearchBox: undefined };
    },

    setQueryInHeaderIfExist(state, { payload }) {
      const { query } = payload;
      if (state.headerSearchBox) {
        const newState = state;
        newState.headerSearchBox.query = query;
        return newState;
      } else {
        return state;
      }
    },

    clearQueryInHeaderIfExist(state) {
      if (state.headerSearchBox) {
        const newState = state;
        newState.headerSearchBox.query = ' ';
        return newState;
      } else {
        return state;
      }
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
