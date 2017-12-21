/**
 * Created by GaoBo on 2017/12/21.
 */
import React, { Component } from 'react';
// import browserHistory from 'react-router/lib/browserHistory';
import { connect } from 'dva';
import { sysconfig } from 'systems';
import * as authUtil from 'utils/auth';
import queryString from 'query-string';
import { routerRedux } from 'dva/router';

const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyLUZLaE1WZjR5YjR0SmFTMVNXRzlRd0dOQnhRMlZmZnI3SWNBU2g1ajRIWWN1RXZtenFvbHQ4T05ZRUdSUzlIbnhBWVJMczhUT0VXK1dGQ3pueURcL0lJamVobzNLTkZHZHBET3B5OXpEamQyeStzZE9EaHdBMiIsImlzcyI6InBsYXktYW5ndWxhci1zaWxob3VldHRlIiwiZXhwIjoxNTA2MTQ5MjE1LCJpYXQiOjE1MDM1NTcyMTUsImp0aSI6IjhiZTAyZTNkMGFhNTIzN2JiNjhlZTE1MGMyNzVkMTRlN2JhZmJmOWFmOGQ4MmM2NmY1MDBjNzgzZWZlYzc5NzZlOTlmYTIxODc0ODRmNDVhMDU5NjRmZWI1ZGY1YjM5OWEwNWE1OWU1OGU1MmU5OGZjYmE5NzViZjAwY2YwYTVlMWI4ODk5NGJiNDM1YjRhYmYzNTE4ZmFmNzc4MDg0MTc2NTNhOWE2OTFjOGU5NGJiYWVhNGIwODc0MzAyNjljMDFkYWUzMzcwNTA4MmZiODc1NTBjMzEyYWUzMGM1ZTFiNjdlZjIwMTQ0YjkzMDljZTgwNjYxMGM2MTVhNDM0NWEifQ.xvAw1Dw_cGnUUtB1fukV1bFwhUuzV2rtQQRfvJ3hVaI';
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

    checkPass: true,
  };

  componentWillMount() {
    const { dispatch, location } = this.props;
    const { n, a, o, pos, p, id, role, c } = queryString.parse(location.search);

    // [STEP 1] 获取URL中的参数，接收到的用户. TODO 验证URL是否合法，是否被人串改.
    const receivedUser = {
      email: `${a}@scei.com`,
      password: this.passwdgen(a),
      first_name: n,
      last_name: n,
      position: pos,
      // TODO save phone.
    };
    if (DEBUG_LOG) {
      console.log('[STEP 1] Received user:', receivedUser);
    }

    // [STEP 2] 验证是否被人串改
    const checkPass = true; // TODO
    if (DEBUG_LOG) {
      console.log('[STEP 2] Checksum: Skip...');
    }
    if (!checkPass) {
      return;
    }

    // const email = receivedUser.email;
    const email = 'elivoa@gmail.com'; // DEBUG ONLY

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
            .then((success) => {
              console.log('create user result: ', success);
              // success TODO ........

            })
            .catch((err) => {
              if (DEBUG_LOG) {
                console.log('[STEP 4.1] Create user failed!', err);
              }
              return false;
            });
        } else {
          // 如果email存在，认为登录成功。
          const { password } = receivedUser; // '123123';
          dispatch({ type: 'app/login', payload: { email, password, role } });

          return this.redirectSuccess();
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

  redirectSuccess = () => {
    console.log('+++ success login, redirect 88 ');
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
    return (
      <div>{this.state.checkPass ? '正在验证...' : '登录验证失败!'}</div>
    );
  }
}
