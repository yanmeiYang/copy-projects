/* eslint-disable react/no-multi-comp */

import React from 'react';
import { sysconfig } from '../systems';
import { isLogin, dispatchToLogin } from '../utils/auth';

function hoc(ComponentClass) {
  return class HOC extends React.Component {
    componentDidMount() {
      console.log('hoc: it is only an example');
      console.log('component: ', ComponentClass, this.props);
    }

    render() {
      return <ComponentClass {...this.props} />;
    }
  };
}

/**
 * 会根据 sysconfig.Auth_AllowAnonymousAccess 的值来判断是否进行登录权限判断。
 * @param ComponentClass
 * @returns {AuthHoc}
 * @constructor
 */
function Auth(ComponentClass) {
  return class AuthHoc extends React.Component {
    componentWillMount = () => {
      if (!sysconfig.Auth_AllowAnonymousAccess) { // 当不允许匿名登录时
        this.authenticated = false;
        // 必须是登录用户.
        this.isLogin = isLogin(this.props.app && this.props.app.user);
        if (!this.isLogin) {
          dispatchToLogin(this.props.dispatch);
        }
        // 必须有当前系统的角色.

        // Final authenticated.
        this.authenticated = this.isLogin;
      }
    };

    render() {
      if (sysconfig.Auth_AllowAnonymousAccess || this.authenticated) {
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
  return class RequireLoginHoc extends React.Component {
    componentDidMount() {
      console.log('hoc: it is only an example');
      console.log('component: ', ComponentClass, this.props);
    }

    render() {
      return <ComponentClass {...this.props} />;
    }
  };
}

module.exports = { hoc, Auth, RequireLogin };
