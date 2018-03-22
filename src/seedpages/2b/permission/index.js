import React, { Component } from 'react';
import { connect } from 'engine';
import { withRouter } from 'dva/router';
import { Layout } from 'components/layout';
import LeftTabZone from './components/LeftTabZone'
import TobZone from './settings/components/TopZone'
import Schema from 'components/mgr/schema.js';
import styles from './index.less';

@withRouter
export default class Permission extends Component {

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
