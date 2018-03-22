import React, { Component } from 'react';
import { AvailableSystems } from 'systems';
import { Tabs } from 'antd';


const TabPane = Tabs.TabPane;
export default class LeftTabZone extends Component {
  state = {
    tab: 'settings',
  };
  componentWillMount(){
    this.setState({tab: this.props.currentKey || 'settings'})
  }

  onChangeSystem(key) {
    console.log('leftkey', key)
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
