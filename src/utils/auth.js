/* eslint-disable no-extend-native */
import { routerRedux } from 'dva/router';
import AES from 'crypto-js/aes';
import { sysconfig } from 'systems';
import { queryURL } from './index';

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

/**
 *
 * @param dispatch or put
 */
function dispatchToLogin(dispatch) {
  const from = getLoginFromURL();
  if (process.env.NODE_ENV !== 'production') {
    console.log('Dispatch to Login Page from ', from);
  }
  dispatch(routerRedux.push({
    pathname: sysconfig.Auth_LoginPage,
    query: { from },
  }));
}

function dispatchAfterLogin(put) {
  const from = queryURL('from') || '/';
  if (process.env.NODE_ENV !== 'production') {
    console.log('Login Success, Dispatch to ', decodeURIComponent(from));
  }
  put(routerRedux.push({ pathname: decodeURIComponent(from) }));
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

function getLoginFromURL() {
  let from = location.pathname;
  if (from === '/' || from === sysconfig.Auth_LoginPage) {
    from = '';
  }
  return from;
}

module.exports = {
  isLogin,
  createEmptyRoles,
  dispatchToLogin,
  dispatchAfterLogin,

  redirectToLogin,
  getLocalToken,
  getLocalUser,
  saveLocalAuth,
  saveLocalToken,
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
};
