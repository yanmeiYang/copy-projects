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
export default class All extends Component {
  state = {
    tab: 'ces',
  };

  onChangeSystem(key) {
    console.log('key',key)
    this.setState({ tab: key });
    // this.props.switchSystem(key);
  }

  render() {

    return (
      <Layout searchZone={[]} showNavigator={false}>
        <Tabs
          activeKey={this.state.tab}
          tabPosition="left"
          onTabClick={this.onChangeSystem.bind(this)}
        >
          <TabPane tab="设置" key="settings" />

          {AvailableSystems &&
          AvailableSystems.map((sys) => {
            return <TabPane tab={sys === 'aminer' ? '' : sys} key={sys} />;
          })
          }
        </Tabs>
      </Layout>
    );
  }
}
