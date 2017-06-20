import { routerRedux } from 'dva/router';
import { parse } from 'qs';
import { getCurrentUserInfo, logout } from '../services/app';
import { config } from '../utils';

const { prefix } = config;

export default {
  namespace: 'app',
  state: {
    user: {},
    menuPopoverVisible: false,
    siderFold: localStorage.getItem(`${prefix}siderFold`) === 'true',
    darkTheme: localStorage.getItem(`${prefix}darkTheme`) === 'true',
    token: localStorage.getItem('token'),
    isNavbar: false, // document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(localStorage.getItem(`${prefix}navOpenKeys`)) || [],
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
    *getCurrentUserInfo({ payload }, { call, put }) {
      if (localStorage.getItem('token')) {
        const { data } = yield call(getCurrentUserInfo, parse(payload));
        if (data) {
          yield put({
            type: 'getCurrentUserInfoSuccess',
            payload: data,
          });
          if (location.pathname === '/login') {
            yield put(routerRedux.push('/'));
          }
        }
      } else if (location.pathname !== '/login') {
        let from = location.pathname;
        if (location.pathname === '/') {
          from = '/';
        }
        // window.location = `${location.origin}/login?from=${from}`;
      }
    },

    *logout({
              payload,
            }, { call, put }) {
      const data = yield call(logout, parse(payload));
      if (data.success) {
        yield put({ type: 'getCurrentUserInfo' });
      } else {
        throw (data);
      }
    },

    *changeNavbar({ payload }, { put, select }) {
      const { app } = yield (select(_ => _));
      const isNavbar = false; // document.body.clientWidth < 769
      if (isNavbar !== app.isNavbar) {
        yield put({ type: 'handleNavbar', payload: isNavbar })
      }
    },

  },

  reducers: {
    getCurrentUserInfoSuccess(state, { payload: user }) {
      return {
        ...state,
        user,
      };
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
  },
}
