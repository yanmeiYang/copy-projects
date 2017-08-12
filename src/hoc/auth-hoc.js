/* eslint-disable react/no-multi-comp */

import React from 'react';
import { routerRedux } from 'dva/router';
import { sysconfig } from '../systems';
import { isLogin } from '../utils/auth';

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
      if (!sysconfig.Auth_AllowAnonymousAccess) {
        // this.props.app.user.lo
        this.isLogin = isLogin(this.props.app && this.props.app.user);
        if (!this.isLogin) {
          let from = location.pathname;
          if (location.pathname === '/') {
            from = '/';
          }
          this.props.dispatch(routerRedux.push({
            pathname: sysconfig.Auth_LoginPage,
            data: { from },
          }));
          // window.location = `${location.origin}/login?from=${from}`;
        }
      }
    };


    componentDidMount() {
      console.log('Auth: it is only an example');
    }

    render() {
      if (sysconfig.Auth_AllowAnonymousAccess || this.isLogin) {
        return <ComponentClass {...this.props} />;
      } else {
        return null;
      }
    }
  };
}

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
