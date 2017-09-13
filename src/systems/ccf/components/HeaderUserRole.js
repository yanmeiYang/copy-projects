/**
 * Created by BoGao on 2017/7/15.
 */
import React from 'react';
import { Link } from 'dva/router';
// import styles from './HeaderUserRole.less';
import * as seminarService from 'services/seminar';

class IndexInfoBox extends React.PureComponent {
  render() {
    const roles = [];
    return (
      <p className={roles.authority[0] !== undefined ? "styles.isAuthority" : ''}>
        <span>{roles.role[0]}</span>
        {roles.authority[0] !== undefined &&
        <span>
          <br />
          <span>{seminarService.getValueByJoint(roles.authority[0])}</span>
        </span>}
      </p>
    );
  }
}

export default IndexInfoBox;
