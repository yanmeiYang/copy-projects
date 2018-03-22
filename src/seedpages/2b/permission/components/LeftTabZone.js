import React, { Component } from 'react';
import { AvailableSystems } from 'systems';
import { connect, routerRedux } from 'engine';
import { Tabs } from 'antd';


const TabPane = Tabs.TabPane;
@connect(({ app }) => ({ app }))
export default class LeftTabZone extends Component {
  state = {
    tab: 'settings',
  };

  componentWillMount() {
    this.setState({ tab: this.props.currentKey || 'settings' })
  }

  onChangeSystem(key) {
    console.log('leftkey', key)
    let pathname = `/2b/permission/system/:${key}`;

    if (key === 'settings') {
      pathname = '/2b/permission/settings';
    }
    this.props.dispatch(routerRedux.push({ pathname }));
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
