import React, { Component } from 'react';
import { Layout } from 'components/layout';
import { AvailableSystems } from 'systems';
import { Tabs } from 'antd';


const TabPane = Tabs.TabPane;
export default class LeftTabZone extends Component {
  state = {
    tab: '设置',
  };

  onChangeSystem(key) {
    console.log('key', key)
    this.setState({ tab: key });
  }

  render() {

    return (
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
    );
  }
}
