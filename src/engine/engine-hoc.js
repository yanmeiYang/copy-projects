/* eslint-disable react/no-multi-comp */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import { sysconfig } from 'systems';
// import * as authUtil from 'utils/auth';
// import { reflect } from 'utils';
// import * as debug from 'utils/debug';
import { Form } from 'antd';

/**
 * 会根据 sysconfig.Auth_AllowAnonymousAccess 的值来判断是否进行登录权限判断。
 * @param ComponentClass
 * @returns {AuthHoc}
 * @constructor
 */
function formCreate(ComponentClass) {
  class formCreateHoc extends Component {
    render() {
      return React.createElement(Form.create()(ComponentClass))
    }
  }

  return formCreateHoc;
}


export { formCreate };
