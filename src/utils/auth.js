/* eslint-disable no-extend-native */
// import AES from 'crypto-js/aes';
import { router, routerRedux } from 'engine';
import { sysconfig } from 'systems';
import { queryURL } from './index';

const debug = require('debug')('aminer:engine');

// import config from './config';
const AES_KEY = 'deng-dili-dengleng-dideng';
const LS_TOKEN_KEY = `token_${sysconfig.SYSTEM}`;
const LS_USER_KEY = `user_${sysconfig.SYSTEM}`;

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

// get token from localStorage.
function getLocalToken() {
  return localStorage.getItem(LS_TOKEN_KEY);
}

function saveLocalToken(token) {
  localStorage.setItem(LS_TOKEN_KEY, token);
}

function saveLocalTokenSystem(system, token) {
  localStorage.setItem(`token_${system}`, token);
}

/**
 *
 * @param dispatch or put
 */
function dispatchToLogin(dispatch) {
  debug('AUTH :::: dispatchToLogin');
  const from = getLoginFromURL();
  if (process.env.NODE_ENV !== 'production') {
    console.log('Dispatch to Login Page from ', from);
  }
  if (sysconfig.AuthLoginUsingThird) {
    debug('AUTH :::: redirect to 3rd page: %s', sysconfig.AuthLoginUsingThirdPage);
    window.location.href = sysconfig.AuthLoginUsingThirdPage;
  } else {
    // TODO umi jump add parameter.
    const path = { pathname: sysconfig.Auth_LoginPage };
    debug('AUTH :::: redirect to %o', path);
    if (dispatch) { // 分为两种router来调用.
      if (from) {
        // path.query = { from };
        path.search = `?from=${encodeURL(from)}`
      }
      dispatch(routerRedux.push(path))
    } else {
      if (from) {
        path.query = { from };
      }
      router.push(path);
    }
  }
}

// no one call this?
function dispatchAfterLogin() {
  const from = queryURL('from') || '/';

  debug('AUTH :::: dispatchAfterLogin to %s.', from);

  if (process.env.NODE_ENV !== 'production') {
    console.log('Login Success, Dispatch to ', decodeURIComponent(from));
  }
  let redirect = decodeURIComponent(from);
  if (redirect.endsWith('.html')) {
    redirect = redirect.replace('.html', '');
  }
  // dispatch ? dispatch(routerRedux.push({ pathname: path })) : router.push(path);
  router.push(redirect);
}

/**
 *
 * @param dispatch
 */
function redirectToLogin() {
  // TODO no-server
  const location = window.location;
  let from = location.pathname;
  if (location.pathname === '/') {
    from = '/';
  }
  window.location = `${location.origin}${sysconfig.Auth_LoginPage}?from=${from}`;
}

const getLocalUser = () => {
  // 过期时间为7天
  const key = LS_USER_KEY;
  const exp = 1000 * 60 * 60 * 24 * 7;
  const data = localStorage.getItem(key);
  if (data) {
    const dataObj = JSON.parse(data);
    if (new Date().getTime() - dataObj.time > exp) {
      removeLocalAuth();
      console.log('信息过期');
    } else {
      return dataObj;
    }
  } else {
    return '';
  }
};

const saveLocalAuth = (value, roles) => {
  const key = LS_USER_KEY;
  const curTime = new Date().getTime();
  localStorage.setItem(key, JSON.stringify({ data: value, roles, time: curTime }));
};

function createEmptyRoles() {
  return {
    god: false, // 神级管理员，是跨system的存在。可以管理2b后台。
    admin: false, // system 的系统管理员，也叫超级管理员。一个system内的最高权限。
    authed: false, // 认证用户，有某个system的权限。
    systems: [], // TODO 标记这个用户有哪些system的访问权限。
    role: [], // 具体细节的role.
    authority: [], // 目前ccf在用。
    forbid: false, // 禁用用户。
  };
}

const parseRoles = (user) => {
  const roles = createEmptyRoles();
  if (user.role && user.role.length > 0) {
    user.role.map((r) => {
      // is god is root in aminer roles.
      if (r === 'root') {
        roles.god = true;
      }
      // root, ccf_超级管理员,
      if (r === 'root' || r === `${sysconfig.SOURCE}_超级管理员`) {
        roles.admin = true;
      }

      // is authed
      if (r === sysconfig.SOURCE) {
        roles.authed = true;
      }

      // is forbid
      if (r === `${sysconfig.SOURCE}_forbid`) {
        roles.forbid = true;
      }

      // ccf only -- Need an example
      if (r.split('_').length === 2) {
        roles.role.push(r.split('_')[1]);
      }

      // ccf only -- Need an example
      if (r.split('_').length === 3) {
        roles.authority.push(r.split('_')[2]);
      }
      return false;
    });
  }

  // 不可以这样，不然同一个账号可以登录搜索的系统 ???
  if (user.src === sysconfig.SOURCE) {
    roles.authed = true;
  }
  if (sysconfig.UserAuthSystem === 'aminer' && user.src === 'aminer') {
    roles.authed = true;
  }
  // special
  if (user.email === 'elivoa@gmail.com' || user.email === 'hd_yangym@sina.com') {
    roles.god = true;
  }
  return roles;
};

function isAuthed(roles) {
  return roles && (roles.god || roles.admin || roles.authed) && !roles.forbid;
}

function isGod(roles) {
  return roles && roles.god;
}

function isSuperAdmin(roles) {
  return roles && (roles.god || roles.admin) && !roles.forbid;
}

function isExactSuperAdmin(roles) {
  return roles && roles.admin;
}

function hasPrivilegeOfCurrentSystem(roles) {
  return roles && roles.authed;
}

function hasPrivilegeOfSystem(roles, role) {
  return roles && roles.systems.find(role);
}

function removeLocalAuth() {
  localStorage.removeItem(LS_USER_KEY);
  localStorage.removeItem(LS_TOKEN_KEY);
}

function ensureUserAuthFromAppModel(dispatch) {
  if (!getLocalToken()) {
    dispatch({ type: 'emptyAuthInfo' });
    return; // do nothing if there are no token in localStorage.
  }
  // 刷新URL第一次访问肯定不会执行这段。url变化之后，比较一下token是否一致，如果一致，跳过检查其他的。
  const userMessage = getLocalUser();
  if (userMessage !== '' && userMessage !== null && userMessage !== undefined) {
    dispatch({
      type: 'alreadyLoggedIn',
      user: userMessage.data,
      roles: userMessage.roles,
    });
    // if (!userMessage.roles.role.includes(sysconfig.SOURCE)) {
    //   yield call(authService.invoke, userMessage.data.id, sysconfig.SOURCE);
    // }
  }
  // no user in localStorage.
  // 上一步：getLocalToken有可能会把过期的token也一起清空。所以要再判断一次。
  const token = getLocalToken();
  if (token) {
    // TODO dispatch getMe sync???
    dispatch({ type: 'getMe' });
  } else {
    dispatch({ type: 'emptyAuthInfo' });
  }
}

function afterLogin(dispatch) {
  if (!getLocalToken()) {
    dispatch({ type: 'emptyAuthInfo' });
    return; // do nothing if there are no token in localStorage.
  }
  // 刷新URL第一次访问肯定不会执行这段。url变化之后，比较一下token是否一致，如果一致，跳过检查其他的。
  const userMessage = getLocalUser();
  if (userMessage !== '' && userMessage !== null && userMessage !== undefined) {
    dispatch({
      type: 'alreadyLoggedIn',
      user: userMessage.data,
      roles: userMessage.roles,
    });
    // if (!userMessage.roles.role.includes(sysconfig.SOURCE)) {
    //   yield call(authService.invoke, userMessage.data.id, sysconfig.SOURCE);
    // }
  }
  // no user in localStorage.
  // 上一步：getLocalToken有可能会把过期的token也一起清空。所以要再判断一次。
  const token = getLocalToken();
  if (token) {
    // TODO dispatch getMe sync???
    dispatch({ type: 'getMe' });
  } else {
    dispatch({ type: 'emptyAuthInfo' });
  }
}

// 暂时不支持夸域名的login重定向。
function getLoginFromURL() {
  // NOTE can't used in node environment.
  const location = window.location;

  let from = location.pathname;
  if (from === '/' || from === sysconfig.Auth_LoginPage) {
    from = '';
  } else {
    from = `${location.pathname}${location.search}`;
  }

  return from;
}

function encodeURL(url) {
  return encodeURIComponent(url)
}

function decodeFrom(from) {
  let redirect = decodeURIComponent(from);
  // 这两句看起来现在没有用了。是老版本的umi的fix。
  if (redirect.endsWith('.html')) {
    redirect = redirect.replace('.html', '');
  }
  return redirect;
}

export {
  isLogin,
  createEmptyRoles,
  dispatchToLogin,
  dispatchAfterLogin,

  redirectToLogin,
  getLocalToken,
  getLocalUser,
  saveLocalAuth,
  saveLocalToken,
  saveLocalTokenSystem,
  removeLocalAuth,
  parseRoles,

  isAuthed,
  isGod,
  isSuperAdmin,
  isExactSuperAdmin,

  hasPrivilegeOfCurrentSystem,
  hasPrivilegeOfSystem,

  ensureUserAuthFromAppModel,
  getLoginFromURL,
  decodeFrom, encodeURL,
};
