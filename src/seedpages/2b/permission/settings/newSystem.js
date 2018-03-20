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
import styles from './newSystem.less';

const TabPane = Tabs.TabPane;
export default class newSystem extends Component {
  state = {};

  componentWillMount = () => {
    const location = window.location;
    console.log('----------', location.pathname);
  };

  render() {

    return (
      <Layout searchZone={[]} showNavigator={false}>
        <div className={styles.newSystem}>
          <LeftTabZone currentKey="settings" />
          <div className={styles.rightZone}>
            <TobZone currentKey="newSystem"/>
            <h1> new system</h1>
          </div>
        </div>
      </Layout>
    );
  }
}
