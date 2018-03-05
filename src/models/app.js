import { parse } from 'qs';
import { message as antdMessage } from 'antd';
import { Map } from 'immutable';
import { routerRedux } from 'engine';
import { queryURL } from 'utils';
import * as debug from 'utils/debug';
import * as auth from 'utils/auth';
import * as authService from 'services/auth';
import { sysconfig } from 'systems';
import { defineMessages } from 'react-intl';
import { mergeLibs } from 'utils/requirejs';
// const { prefix } = config;

const messages = defineMessages({
  errorMessage401: {
    id: 'message.error.login.401',
    defaultMessage: 'User name or password not match!',
  },
});

// TODO use immutablejs to speedup this file.
export default {
  namespace: 'app',

  state: Map({
    token: auth.getLocalToken(),
    user: null,

    // { admin: false, ccf_user: false, role: [], authority: [] },
    roles: auth.createEmptyRoles(), // TODO immutable it

    feedbackStatus: null, // TODO immutable TODO move out.

    // ------------- organize this ---------------------

    isAdvancedSearch: false,

    headerResources: null, // { key: [<helmet_component>] }
  }),

  subscriptions: {
    setup({ dispatch }) {
      // 刷新页面第一次调用。
      auth.ensureUserAuthFromAppModel(dispatch);

      // 这里的DEBUG内容，只有开发模式时才生效。
      if (process.env.NODE_ENV !== 'production') {
        dispatch({ type: 'initDebug', debug });
      }
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
          const from = queryURL('from') || sysconfig.DefaultUrlAfterLogin;
          const decodedFrom = auth.decodeFrom(from);
          if (process.env.NODE_ENV !== 'production') {
            console.log('Login Success, Dispatch to ', decodedFrom);
          }
          // yield put(router.push({ pathname: decodedFrom }));
          yield put(routerRedux.push(decodedFrom));

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
        const fromURL = auth.encodeURL(auth.getLoginFromURL());
        console.log('\n\n------------------------Logout::::', auth.getLoginFromURL());
        yield put(routerRedux.push({
          pathname: sysconfig.Auth_LoginPage,
          search: `?from=${fromURL}`,
        }));
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
      if (payload) {
        return state.withMutations((map) => {
          Object.keys(payload).forEach(key => {
            map.set(key, payload[key]);
          });
        });
      }
      return payload;
    },

    initDebug(state, { debug }) {
      return state.set('debug', debug);
    },

    setDebug(state, { payload }) {
      // console.log('>>>>>>>>>>', payload);
      let newDebug = { ...(state.get('debug') || {}), ...payload };
      // console.log('>>>>>>>>>>', newDebug);
      return state.set('debug', newDebug);
    },

    // 第二个参数Role是腾讯再用
    getMeSuccess(state, { payload: user, role }) {
      // TODO special for tencent. make it not so special.
      const roles = auth.parseRoles(user);
      if (role) { // tencent在用
        if (roles.role.length > 0 && !roles.role.includes(role)) {
          roles.role[0] = role;
        }
      }
      auth.saveLocalAuth(user, roles);
      return state.set('user', user).set('roles', roles);
    },

    alreadyLoggedIn(state, { user, roles }) {
      return state.set('user', user).set('roles', roles);
    },

    emptyAuthInfo(state) {
      return state.deleteAll(['user', 'roles', 'token']);
    },

    logoutSuccess(state) {
      auth.removeLocalAuth();
      return state.deleteAll(['user', 'roles', 'token']);
    },

    layout(state, { payload }) {
      if (payload) {
        return state.withMutations((map) => {
          Object.keys(payload).forEach(key => {
            map.set(key, payload[key]);
          });
        });
      }
      return payload;
    },

    requireResource(state, { res }) {
      const headerResources = state.get('headerResources');
      // TODO other resource not in res.
      const { changed, res: mergedHeaderResources } = mergeLibs(headerResources, res);
      const newState = changed
        ? state.set('headerResources', mergedHeaderResources)
        : state;

      console.log('>>>>9999999', changed, mergedHeaderResources);
      console.log('>>>>9999999', newState);
      return newState
    },

    toggleAdvancedSearch(state) {
      return state.set('isAdvancedSearch', !state.get('isAdvancedSearch'));
    },

    changeToAdvancedSearch(state) {
      return state.set('isAdvancedSearch', true);
    },

    changeToSimpleSearch(state) {
      return state.set('isAdvancedSearch', false);
    },

    feedbackSuccess(state, { payload }) {
      return state.set('feedbackStatus', payload.success);
    },
  },
};
