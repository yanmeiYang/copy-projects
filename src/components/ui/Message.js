/* eslint-disable react/no-unused-prop-types,react/require-default-props */
/**
 *  Created by BoGao on 2017-08-14;
 */
import React, { PureComponent, PropTypes } from 'react';
import { message } from 'antd';

// TODO add property norepeat="3", don't repeat in 3s.
export default class Message extends PureComponent {
  state = {
    errorMessage: '',
  };

  shouldComponentUpdate(nextProps) {
    if (nextProps.message && nextProps.message !== this.props.message) {
      message.error(nextProps.message);
      return false;
    }
    return false;
  }

  render() {
    return <span />;
  }
}

Message.propTypes = {
  errorMessage: PropTypes.string,
};
