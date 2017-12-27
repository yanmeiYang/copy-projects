/**
 * Created by ranyanchuan on 2017/8/18.
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import CryptoJS from 'crypto-js';
import * as authUtil from 'utils/auth';

const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyLUZLaE1WZjR5YjR0SmFTMVNXRzlRd0dOQnhRMlZmZnI3SWNBU2g1ajRIWWN1RXZtenFvbHQ4T05ZRUdSUzlIbnhBWVJMczhUT0VXK1dGQ3pueURcL0lJamVobzNLTkZHZHBET3B5OXpEamQyeStzZE9EaHdBMiIsImlzcyI6InBsYXktYW5ndWxhci1zaWxob3VldHRlIiwiZXhwIjoxNTA2MTQ5MjE1LCJpYXQiOjE1MDM1NTcyMTUsImp0aSI6IjhiZTAyZTNkMGFhNTIzN2JiNjhlZTE1MGMyNzVkMTRlN2JhZmJmOWFmOGQ4MmM2NmY1MDBjNzgzZWZlYzc5NzZlOTlmYTIxODc0ODRmNDVhMDU5NjRmZWI1ZGY1YjM5OWEwNWE1OWU1OGU1MmU5OGZjYmE5NzViZjAwY2YwYTVlMWI4ODk5NGJiNDM1YjRhYmYzNTE4ZmFmNzc4MDg0MTc2NTNhOWE2OTFjOGU5NGJiYWVhNGIwODc0MzAyNjljMDFkYWUzMzcwNTA4MmZiODc1NTBjMzEyYWUzMGM1ZTFiNjdlZjIwMTQ0YjkzMDljZTgwNjYxMGM2MTVhNDM0NWEifQ.xvAw1Dw_cGnUUtB1fukV1bFwhUuzV2rtQQRfvJ3hVaI';

class Tencent3rd extends Component {
  state = {
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

  componentWillMount() {
    // http://localhost:8000/auth?userid=tencent123&role=1&src=tencent&code=eyJjdCI6IllzREhIVExvOXV6Z3NBbVEzXC9vaEl6cDhLTW81NkQxWVwvNk5pVlpFcVBWaldWUndGbzhhMVVJY0NrVW9tZ0ZmZCIsIml2IjoiY2QyZWUyZmY1YmQ0YzllNTVjNTMzMDJkMjI0MTkzMGYiLCJzIjoiNDg4NDNlY2U2MTgxNDhiOCJ9
    const params = window.location.search.substring(1).split('&');
    const roleDict = {
      0: '普通用户',
      1: '管理员',
    };


    //  599a589c9ed5dbd3ad7969fc
    const uID = params[0].split('=')[1];
    const uRole = params[1].split('=')[1];
    const uSrc = params[2].split('=')[1];

    const CryptoJSAesJson = {
      parse: (jsonStr) => {
        const j = JSON.parse(jsonStr);
        const cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext: CryptoJS.enc.Base64.parse(j.ct) });
        if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv);
        if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s);
        return cipherParams;
      },
    };

    const code = params[3].split('=')[1];
    const encrypted = window.atob(code);
    const de = CryptoJS.AES.decrypt(encrypted, 'aminer&tencent', { format: CryptoJSAesJson })
    const deString = de.toString(CryptoJS.enc.Utf8);
    const decrypted = JSON.parse(deString);
    const dParams = decrypted.split('&');
    const dID = dParams[0].split('=')[1];
    const dRole = dParams[1].split('=')[1];
    const dSrc = dParams[2].split('=')[1];

    if (uID === dID && uRole === dRole && uSrc === dSrc) {
      const email = `${dID}@tc.com`;
      const password = dID;
      this.setState({ email, password, role: roleDict[dRole] });
      this.props.dispatch({
        type: 'auth/checkEmail',
        payload: { email },
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.validEmail !== this.props.auth.validEmail) {
      if (nextProps.auth.validEmail) {
        const data = { ...this.state, token };
        this.props.dispatch({
          type: 'auth/create3rdUser',
          payload: data,
        });
      }
    }
  }

  componentWillUpdate(nextProps, nextState) {
    // console.log('nextProps', nextProps.auth.validEmail);

    if (nextProps.auth.validEmail === false) {
      if (authUtil.getLocalToken() !== true && authUtil.getLocalUser().email !== this.state.email) {
        this.props.dispatch({
          type: 'app/login',
          payload: {
            email: this.state.email,
            password: this.state.password,
            role: this.state.role,
          },
        });
      }
    }
  }

  // 解密
  render() {
    if (authUtil.getLocalToken() && authUtil.getLocalUser().email === this.state.email) {
      window.location.href = '/';
      // browserHistory.push('/');
    }
    // window.location.href = '/';
    return (<div />);
  }
}


export default connect(({ app, auth }) => ({ app, auth }))(Tencent3rd);
