/* eslint-disable react/no-unused-prop-types */
/**
 *  Created by BoGao on 2017-08-14;
 */
import React from 'react';
import { message } from 'antd';
import PropTypes from 'prop-types';
// TODO add property norepeat="3", don't repeat in 3s.
export default class Message extends React.PureComponent {
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
