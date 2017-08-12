/* eslint-disable no-extend-native */
import { routerRedux } from 'dva/router';
import { sysconfig } from '../systems';
import { cloneDeep } from 'lodash';
import config from './config';

/**
 * user in app model.
 * @param user
 */
function isLogin(user) {
  if (user && user.id) {
    return true;
  }
  return false;
}

/**
 *
 * @param dispatch
 */
function dispatchToLogin(dispatch) {
  let from = location.pathname;
  if (location.pathname === '/') {
    from = '/';
  }

  dispatch(routerRedux.push({
    pathname: sysconfig.Auth_LoginPage,
    data: { from },
  }));
}

/**
 *
 * @param dispatch
 */
function redirectToLogin() {
  let from = location.pathname;
  if (location.pathname === '/') {
    from = '/';
  }
  window.location = `${location.origin}${sysconfig.Auth_LoginPage}?from=${from}`;
}

module.exports = { isLogin, dispatchToLogin, redirectToLogin };
