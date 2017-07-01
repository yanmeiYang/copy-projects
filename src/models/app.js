import { routerRedux } from 'dva/router';
import { parse } from 'qs';
import { getCurrentUserInfo, logout } from '../services/app';
import { config } from '../utils';

const { prefix } = config;
const LocalStorage = localStorage;

export default {
  namespace: 'app',
  state: {
    user: {},
    token: LocalStorage.getItem('token'),
    roles: { admin: true, ccf_user: true },// TODO parse roles string into this object.
    menuPopoverVisible: false,
    siderFold: LocalStorage.getItem(`${prefix}siderFold`) === 'true',
    darkTheme: LocalStorage.getItem(`${prefix}darkTheme`) === 'true',
    isNavbar: false, // document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(LocalStorage.getItem(`${prefix}navOpenKeys`)) || [],
    hasHeadSearchBox: false,
    onHeaderSearch: null,
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
      if (LocalStorage.getItem('token')) {
        // TODO 每次打开新URL都要访问一次。想办法缓存一下。
        const { data } = yield call(getCurrentUserInfo, parse(payload));
        if (data) {
          yield put({ type: 'getCurrentUserInfoSuccess', payload: data });
          if (location.pathname === '/login') {
            yield put(routerRedux.push('/'));
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

    *logout({ payload }, { call, put }) {
      const { data } = yield call(logout);
      if (data.status) {
        localStorage.removeItem('token');
        yield put({ type: 'logoutSuccess' });
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


    logoutSuccess(state, { payload }){
      return { ...state, token: LocalStorage.getItem('token'), user: {} }
    },
  },
};
