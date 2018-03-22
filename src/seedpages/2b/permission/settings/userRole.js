/**
 * Created by yangyanmei on 18/3/20.
 */
import React, { Component } from 'react';
import { connect } from 'engine';
import { Layout } from 'components/layout';
import { sysconfig, getAllSystemConfigs, AvailableSystems } from 'systems';
import { Tabs } from 'antd';
import TobZone from './components/TopZone';
import LeftTabZone from '../components/LeftTabZone';
import styles from './userRole.less';

const TabPane = Tabs.TabPane;
export default class newSystem extends Component {
  state = {};

  componentWillMount = () => {
    const location = window.location;
  };

  render() {

    return (
      <Layout searchZone={[]} showNavigator={false}>
        <div className={styles.userRole}>
          <LeftTabZone currentKey="settings" />
          <div className={styles.rightZone}>
            <TobZone currentKey="userRole"/>
            <h1> user role</h1>
          </div>
        </div>
      </Layout>
    );
  }
}
