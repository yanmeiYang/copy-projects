/* eslint-disable react/no-unused-prop-types,react/require-default-props */
/**
 *  Created by BoGao on 2017-08-14;
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { message as MSG } from 'antd';

// TODO add property norepeat="3", don't repeat in 3s.
export default class Message extends PureComponent {
  componentDidUpdate(prevProps) {
    const { message } = this.props;
    if (message && message !== prevProps.message) {
      // MSG.error(message); // TODO React 16 and antd
      return false;
    }
    return false;
  }

  render() {
    return null;
  }
}

Message.propTypes = {
  errorMessage: PropTypes.string,
};
