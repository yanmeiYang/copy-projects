import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import * as hole from 'utils/hole';

// @connect()
export default class Hole extends Component {

  static propTypes = {
    fill: PropTypes.array,
    defaults: PropTypes.array,
    param: PropTypes.object,
    config: PropTypes.object,
    // other configs.
  };

  static defaultProps = {};

  render() {
    const { fill, defaults, param, config, children } = this.props;
    if (!param) {
      // fill模式
      return hole.fill(fill, defaults);
    } else {
      // fillFunc模式
      return hole.fillFuncs(fill, defaults, param, config);
    }
  }
}
