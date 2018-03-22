import React, { Component } from 'react';
import { connect } from 'engine';
import { Layout } from 'components/layout';
import LeftTabZone from './components/LeftTabZone'
import TobZone from './settings/components/TopZone'
import Schema from '../../mgr/auth/schema.js';
import styles from './index.less';

export default class Permission extends Component {
  state = {};

  render() {

    return (
      <Layout searchZone={[]} showNavigator={false}>
        <div className={styles.all}>
          <LeftTabZone currentKey="settings" />
          <div>
            <TobZone currentKey="all"/>
            <Schema />
          </div>
        </div>
      </Layout>
    );
  }
}
