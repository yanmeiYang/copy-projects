/* eslint-disable react/no-unused-prop-types,react/require-default-props */
/**
 *  Created by BoGao on 2017-08-14;
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

export default class TobButton extends PureComponent {
  state = {};

  render() {
    return (
      <div>
        <Icon type="appstore-o" className="noTextIcon"
              style={{ fontSize: 16 }} />
      </div>
    );
  }
}

