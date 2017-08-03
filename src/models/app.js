import { routerRedux } from 'dva/router';
import { parse } from 'qs';
import { getCurrentUserInfo, logout } from '../services/app';
import { config, setLocalStorage, getLocalStorage } from '../utils';
import * as authService from '../services/auth';

const { prefix } = config;
const LocalStorage = localStorage;

export default {
  namespace: 'app',
  state: {
    // query: '', // query shared in different pages.

    // User/auth token related.
    user: {},
    token: LocalStorage.getItem('token'),
    // TODO parse roles string into this object.
    roles: { admin: false, ccf_user: false, role: [], authority: [] },


    // layout switches.
    headerSearchBox: null, // Header search box parameters.
    showFooter: true,

    // Layout related, not used.
    menuPopoverVisible: false,
    siderFold: LocalStorage.getItem(`${prefix}siderFold`) === 'true',
    darkTheme: LocalStorage.getItem(`${prefix}darkTheme`) === 'true',
    isNavbar: false, // document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(LocalStorage.getItem(`${prefix}navOpenKeys`)) || [],
  },

  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'getCurrentUserInfo' });
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
    * getCurrentUserInfo({ payload }, { call, put }) {
      if (LocalStorage.getItem('token')) {
        const userMessage = getLocalStorage('user');
        // TODO 每次打开新URL都要访问一次。想办法缓存一下。
        if (userMessage !== '' && userMessage !== null && userMessage !== undefined) {
          yield put({
            type: 'alreadyLoggedIn',
            user: userMessage.data,
            roles: userMessage.roles,
          });
          // if (!userMessage.roles.role.includes(config.source)) {
          //   yield call(authService.invoke, userMessage.data.id, config.source);
          // }
        } else {
          const { data } = yield call(getCurrentUserInfo, parse(payload));
          if (data) {
            yield put({ type: 'getCurrentUserInfoSuccess', payload: data });
            if (location.pathname === '/login') {
              yield put(routerRedux.push('/'));
            }
          }
        }
      } else if (location.pathname !== '/login') {
        // let from = location.pathname;
        // if (location.pathname === '/') {
        //   from = '/';
        // }
        // window.location = `${location.origin}/login?from=${from}`;
      }
    },

    * logout({ payload }, { call, put }) {
      const data = yield call(logout);
      if (data.data.status) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        yield put({ type: 'logoutSuccess' });
        yield put({ type: 'getCurrentUserInfo' });
        window.location.href = '/login';
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
    getCurrentUserInfoSuccess(state, { payload: user }) {
      const roles = { admin: false, ccf_user: false, role: [], authority: [] };
      for (const r of user.role) {
        if (r === 'root' || r === `${config.source}_超级管理员`) {
          roles.admin = true;
        }
        if (r === 'ccf') {
          roles.ccf_user = true;
        }
        if (r.split('_').length === 2) {
          roles.role.push(r.split('_')[1]);
        }
        if (r.split('_').length === 3) {
          roles.authority.push(r.split('_')[2]);
        }
      }
      setLocalStorage('user', user, roles);
      return {
        ...state,
        user,
        roles,
      };
    },

    alreadyLoggedIn(state, { user, roles }) {
      return { ...state, user, roles };
    },

    switchSider(state) {
      LocalStorage.setItem(`${prefix}siderFold`, !state.siderFold);
      return {
        ...state,
        siderFold: !state.siderFold,
      };
    },

    switchTheme(state) {
      LocalStorage.setItem(`${prefix}darkTheme`, !state.darkTheme);
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
    // setQuery(state, { query }) {
    //   return { ...state, query };
    // },


    logoutSuccess(state, { payload }) {
      return { ...state, token: LocalStorage.getItem('token'), user: {} };
    },
  },
};
