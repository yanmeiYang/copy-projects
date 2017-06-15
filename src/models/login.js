import { routerRedux } from 'dva/router';
import { login } from '../services/login';
import { queryURL } from '../utils';

export default {
  namespace: 'login',
  state: {
    token: null,
    loginLoading: false,
  },

  subscriptions: {
    // setup({ dispatch }) {
    //   dispatch({ type: 'loadToken' });
    // },
  },

  effects: {
    *login({
      payload,
    }, { put, call }) {
      yield put({ type: 'showLoginLoading' });
      const { data } = yield call(login, payload);
      yield put({ type: 'hideLoginLoading' });
      if (data.status) {
        localStorage.setItem('token', data.token);
        console.log(data);
        const from = queryURL('from');
        yield put({ type: 'app/query' });
        yield put({ type: 'app/getCurrentUserInfo' });
        if (from) {
          yield put(routerRedux.push(from));
        } else {
          yield put(routerRedux.push('/'));
        }
      } else {
        throw data;
      }
    },
  },
  reducers: {

    showLoginLoading(state) {
      return {
        ...state,
        loginLoading: true,
      };
    },
    hideLoginLoading(state) {
      return {
        ...state,
        loginLoading: false,
      };
    },
  },
};
