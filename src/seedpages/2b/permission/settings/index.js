/**
 * Created by yangyanmei on 18/3/20.
 */
import React, { Component } from 'react';
import { connect } from 'engine';
import { Layout } from 'components/layout';
import { sysconfig, getAllSystemConfigs, AvailableSystems } from 'systems';
import { Tabs } from 'antd';
import styles from './page.less';

const TabPane = Tabs.TabPane;
// AvailableSystems.splice(0, 1, '设置');
export default class Settings extends Component {
  state = {
    tab: '设置',
  };

  onChangeSystem(key) {
    console.log('key',key)
    this.setState({ tab: key });
    // this.props.switchSystem(key);
  }

  render() {

    return (
      <Tabs
        activeKey={this.state.tab}
        tabPosition="top"
        onTabClick={this.onChangeSystem.bind(this)}
      >
        <TabPane tab="设置" key="settings" />
      </Tabs>
    );
  }
}
