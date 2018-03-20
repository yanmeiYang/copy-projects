import React, { Component } from 'react';
import { connect } from 'engine';
import { Tabs } from 'antd';
// import styles from './page.less';

const TabPane = Tabs.TabPane;
const tabMenu = ['systemRole', 'roles', 'users']
export default class Permission extends Component {
  state = {
    tab: 'ces',
  };

  onChangeSystem(key) {
    console.log('key', key)
    this.setState({ tab: key });
    // this.props.switchSystem(key);
  }

  render() {

    return (
      <Tabs
        activeKey={this.state.tab}
        tabPosition="left"
        onTabClick={this.onChangeSystem.bind(this)}
      >
        {tabMenu &&
        tabMenu.map((item) => {
          return <TabPane tab={item} key={item} />;
        })
        }
      </Tabs>
    );
  }
}
