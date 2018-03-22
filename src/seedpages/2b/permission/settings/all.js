/**
 * Created by yangyanmei on 18/3/20.
 */
import React, { Component } from 'react';
import { connect } from 'engine';
import { Layout } from 'components/layout';
import { sysconfig, getAllSystemConfigs, AvailableSystems } from 'systems';
import TobZone from './components/TopZone';
import LeftTabZone from '../components/LeftTabZone';
import Schema from '../../../mgr/auth/schema.js';
import styles from './all.less';

export default class All extends Component {

  componentWillMount = () => {
    const location = window.location;
  };

  render() {

    return (
      <Layout searchZone={[]} showNavigator={false}>
        <div className={styles.all}>
          <LeftTabZone currentKey="settings" />
          <div className={styles.rightZone}>
            <TobZone currentKey="all"/>
            <Schema />
          </div>
        </div>
      </Layout>
    );
  }
}
