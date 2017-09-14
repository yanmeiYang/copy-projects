/* eslint-disable react/no-multi-comp */
import React, { Component, PureComponent, PropTypes } from 'react';
import { sysconfig } from '../systems';
import * as authUtil from '../utils/auth';
import { reflect } from '../utils';
import debug from '../utils/debug';

const ENABLED = sysconfig.GLOBAL_ENABLE_HOC;

/**
 * 会根据 sysconfig.Auth_AllowAnonymousAccess 的值来判断是否进行登录权限判断。
 * @param ComponentClass
 * @returns {AuthHoc}
 * @constructor
 */
function Auth(ComponentClass) {
  return class AuthHoc extends Component {
    componentWillMount = () => {
      if (!ENABLED) {
        return false;
      }

      if (process.env.NODE_ENV !== 'production') {
        if (debug.LogHOC) {
          console.log('%c@@HOC: @Auth on %s', 'color:orange',
            reflect.GetComponentName(ComponentClass));
        }
      }

      if (!sysconfig.Auth_AllowAnonymousAccess) { // 当不允许匿名登录时
        if (!this.props.app) {
          console.warn('Must connect `app` models when use @Auth! in component: ',
            reflect.GetComponentName(ComponentClass));
          console.error(ComponentClass);
        } else {
          const { user, roles } = this.props.app;
          this.isLogin = authUtil.isLogin(user); // 必须是登录用户.
          this.isAuthed = authUtil.isAuthed(roles); // 必须有当前系统的角色.
        }
        this.authenticated = this.isLogin && this.isAuthed;
        if (!this.authenticated) {
          authUtil.dispatchToLogin(this.props.dispatch);
        }
      }
    };

    render() {
      if (!ENABLED || sysconfig.Auth_AllowAnonymousAccess || this.authenticated) {
        return <ComponentClass {...this.props} />;
      } else {
        return null;
      }
    }
  };
}

/**
 * 忽略 sysconfig.Auth_AllowAnonymousAccess， 严格按照要求验证。
 * @param ComponentClass
 * @returns {RequireLoginHoc}
 * @constructor
 */
function RequireLogin(ComponentClass) {
  return class RequireLoginHoc extends Component {
    componentWillMount = () => {
      if (!ENABLED) {
        return false;
      }
      if (!this.props.app) {
        console.warn('Must connect `app` models when use @Auth! in component: ', ComponentClass.displayName);
        return false;
      }
      const { user, roles } = this.props.app;
      this.isLogin = authUtil.isLogin(user); // 必须是登录用户.
      this.isAuthed = authUtil.isAuthed(roles); // 必须有当前系统的角色.

      this.authenticated = this.isLogin && this.isAuthed;
      if (!this.authenticated) {
        authUtil.dispatchToLogin(this.props.dispatch);
      }
    };

    render() {
      if (!ENABLED || this.authenticated) {
        return <ComponentClass {...this.props} />;
      } else {
        return null;
      }
    }
  };
}

function RequireAdmin(ComponentClass) {
  return class RequireAdminHoc extends Component {
    componentWillMount = () => {
      if (!ENABLED) {
        return false;
      }
      if (!this.props.app) {
        console.warn('Must connect `app` models when use @Auth! in component: ', ComponentClass.displayName);
        return false;
      }
      const { user, roles } = this.props.app;
      this.authenticated = authUtil.isLogin(user) && authUtil.isSuperAdmin(roles);
      if (!this.authenticated) {
        authUtil.dispatchToLogin(this.props.dispatch);
      }
    };

    render() {
      if (!ENABLED || this.authenticated) {
        return <ComponentClass {...this.props} />;
      } else {
        return null;
      }
    }
  };
}

function RequireGod(ComponentClass) {
  return class RequireGodHoc extends Component {
    componentWillMount = () => {
      if (!ENABLED) {
        return false;
      }
      if (!this.props.app) {
        console.warn('Must connect `app` models when use @Auth! in component: ', ComponentClass.displayName);
        return false;
      }
      const { user, roles } = this.props.app;
      this.authenticated = authUtil.isLogin(user) && authUtil.isGod(roles);
      if (!this.authenticated) {
        authUtil.dispatchToLogin(this.props.dispatch);
      }
    };

    render() {
      if (!ENABLED || this.authenticated) {
        return <ComponentClass {...this.props} />;
      } else {
        return null;
      }
    }
  };
}

module.exports = { Auth, RequireLogin, RequireAdmin, RequireGod };
