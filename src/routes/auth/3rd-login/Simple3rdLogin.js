/**
 * Created by GaoBo on 2017/12/21.
 */
import React, { Component } from 'react';
// import browserHistory from 'react-router/lib/browserHistory';
import { connect } from 'dva';
// import { sysconfig } from 'systems';
// import * as authUtil from 'utils/auth';
import queryString from 'query-string';
import { routerRedux } from 'dva/router';

// Token of elivoa scei_超级管理员
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyLTlBdk94XC9BV0JEVHVTXC9QQ29RdmZaWEd1QndES3VWNDVlS2UzOUt6cmtnVDUybVdyTG9qZjM5QW9oZUJneElkc3RLYmhBdWV6V3pZM1hKZklDMUV3dWV0RmdaZ1VDYkdHclZiOTVMM2tmZ21TcGc9PSIsInVpZCI6IjVhMjdjMDlkOWVkNWRiZTA2ZGQyNDIyNSIsInNyYyI6InNjZWkiLCJpc3MiOiJhcGkuYW1pbmVyLm9yZyIsImV4cCI6MTUxNjUwNTIzOSwiaWF0IjoxNTEzOTEzMjM5LCJqdGkiOiJhZGRhYzc2YTRkZmVjYmJhOWQ5OWMxMDVhNzA4MjZmMDljMmVkNWNiODQzZjUxOGRkMDg2NTRlNDZhMDhkNDQwMjI0ZjU5NzkwY2E0ZGZmMjc4MjM1ZTY1YjE1OWVkN2QyNjU2MTA2OGExMTc1MGNjNWJhM2RlYzVkODJlYTkxMzNiMDY2Mjg0NjEwNmU2NTQ4OWQxYTJlOGIyNmRhMDI4NzEyOGI0NWMxMDBiZjBkMTE0MjI3MGI2ODEzMzU2MzUxNWY1NTE2Yjk1YWM3NTIxYzQ0OGI3MzUyOTdiNTFkOTVkZTcxNzgyMmQwYTk0NjAyZmZhZjI2MjgzZTYzY2RiIiwiZW1haWwiOiJlbGl2b2FAZ21haWwuY29tIn0.XlEnpBs4G-aZBsvQp-EMwyXDzrps38ri1g1Xm0ReY_Q';
const DEBUG_LOG = true;

// Example:
// http://localhost:8000/login/s3?n=%E9%99%B6%E6%B4%B5&a=15251664207&o=%E5%8C%97%E4%BA%AC%E8%8D%9F%E8%B6%A3%E4%BF%A1%E6%81%AF%E6%8A%80%E6%9C%AF%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8&pos=%E7%BB%8F%E7%90%86&p=15251664207&id=25
// 说明：
//  1. n 是姓名
//  2. a 是账号
//  3. o 是单位
//  4. pos 是职位
//  5. p 是电话
//  6. id 是系统编号
//  7. role 为角色类型，用来控制权限.
//  8. c 为校验参数，对上面信息做一个简单的校验，避免恶意访问。
@connect(({ app, auth }) => ({ app, auth }))
export default class Simple3rdLogin extends Component {
  state = {
    // email: '',
    // password: '',
    // first_name: '',
    // gender: 1,
    // last_name: '',
    // sub: true,
    // role: '',
    // position: 1,
    // isRegister: false,

    step: '', // [empty | init, check_pass, failed, success ]
    redirectUrl: '',
  };

  componentWillMount() {
    const { dispatch, location } = this.props;
    const { n, a, o, pos, p, id, role, c, src } = queryString.parse(location.search);
    this.setState({ redirectUrl: src || '/' });
    if (false) {
      console.log(o, pos, p, id, c);
    }

    // [STEP 1] 获取URL中的参数，接收到的用户. TODO 验证URL是否合法，是否被人串改.
    const receivedUser = {
      email: `${a}@scei.com`,
      password: this.passwdgen(a),
      first_name: '',
      last_name: n,
      // position: pos,
      // TODO save phone.
    };
    if (DEBUG_LOG) {
      console.log('[STEP 1] Received user:', receivedUser);
    }

    // [STEP 2] 验证是否被人串改
    let checkPass = true; // TODO
    if (a && a.length > 3) {
      checkPass = true;
    } else {
      checkPass = false;
    }
    if (DEBUG_LOG) {
      console.log('[STEP 2] Checksum: Skip...');
    }

    if (!checkPass) {
      this.setState({ step: 'check_failed' });
      return;
    }

    this.setState({ step: 'check_pass' });

    const { email } = receivedUser;
    // const email = 'elivoa@gmail.com'; // DEBUG ONLY

    // [STEP 3] 是否已经登录，如果已经登录，验证ID是否一样。
    // 如果一样，则直接通过。如果不一样。则使用新的重新验证。
    const { user } = this.props.app;
    if (DEBUG_LOG) {
      console.log('[STEP 3] Login user: ', user);
    }
    if (user && user.email === email) {
      if (DEBUG_LOG) {
        console.log('[STEP 3.1] User matched!');
      }
      return this.redirectSuccess();
    } else {
      // TODO 删除登录信息，登出
    }


    // [STEP 4] 已有用户登录失败，想办法重新登录.
    dispatch({ type: 'auth/checkEmail', payload: { email } })
      .then((success) => {
        // 如果邮件没有被占用，那么创建一个账号。
        if (success) {
          if (DEBUG_LOG) {
            console.log('[STEP 4.1] Email not used, can create user!');
          }
          const newUser = { ...this.createEmptyUser(), ...receivedUser };
          if (DEBUG_LOG) {
            console.log('[STEP 4.1] Create user: ', newUser);
          }
          dispatch({ type: 'auth/create3rdUser', payload: { ...newUser, token } })
            .then((createUserSuccess) => {
              console.log('create user result: ', createUserSuccess);
              // success TODO ........ 这块流程还可以优化呀呀呀。再看看。
              // 创建成功，去登录.
              return this.goLogin(email, receivedUser.password, role);
            })
            .catch((err) => {
              if (DEBUG_LOG) {
                console.log('[STEP 4.1] Create user failed!', err);
              }
              this.setState({ step: 'check_failed' });
              return false;
            });
        } else {
          // 如果email存在，认为，使用账号登录。然后跳转。
          const { password } = receivedUser; // '123123';
          return this.goLogin(email, password, role);
        }
      });
  }

  createEmptyUser = () => {
    return {
      email: '',
      password: '',
      first_name: '',
      gender: 1,
      last_name: '',
      sub: true,
      role: '',
      position: 1,
      isRegister: false,
    };
  };

  passwdgen = id => `data${id}mining`;

  goLogin = (email, password, role) => {
    this.props.dispatch({ type: 'app/login', payload: { email, password, role } })
      .then((success) => {
        if (success) {
          this.redirectSuccess();
        } else {
          this.setState({ step: 'check_failed' });
        }
      })
      .catch((err) => {
        this.setState({ step: 'check_failed' });
      });
  };

  redirectSuccess = () => {
    const { redirectUrl } = this.state;
    console.log('+++ success login, redirect 88 ');
    this.props.dispatch(routerRedux.push({ pathname: redirectUrl }));
  };

  // componentWillUpdate(nextProps, nextState) {
  //   if (nextProps.auth.validEmail === false) {
  //     if (authUtil.getLocalToken() !== true && authUtil.getLocalUser().email !== this.state.email) {
  //       const { email, password, role } = this.state;
  //       const { dispatch } = this.props;
  //       this.props.dispatch({ type: 'app/login', payload: { email, password, role } });
  //     }
  //   }
  // }
  //
  // componentDidUpdate(prevProps, prevState) {
  //   if (authUtil.getLocalToken() && authUtil.getLocalUser().email === this.state.email) {
  //     createCross = () => {
  //       this.props.dispatch(routerRedux.push({
  //         pathname: '/cross/startTask',
  //       }));
  //     };
  //   }
  // }

  render() {
    let message;
    switch (this.state.step) {
      case 'check_pass':
        message = '验证成功';
        break;
      case 'check_failed':
        message = '登录验证失败!';
        break;
      case 'success':
        message = '登录验证成功! ';
        break;
      default:
        message = '正在验证...';
    }
    return (
      <div>{message}</div>
    );
  }
}
