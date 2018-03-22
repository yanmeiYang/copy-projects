import React, { Component } from 'react';
import { Layout } from 'components/layout';
import LeftTabZone from '../../components/LeftTabZone';
import RightTabZone from './components/RightTabZone';
import styles from './privilege.less';

export default class Permission extends Component {
  state = {};

  render() {

    return (
      <Layout searchZone={[]} showNavigator={false}>
        <div className={styles.permissionTabBox}>
          <LeftTabZone />
          <RightTabZone />
        </div>
      </Layout>
    );
  }
}
