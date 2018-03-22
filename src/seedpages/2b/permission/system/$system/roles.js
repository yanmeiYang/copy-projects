import React, { Component } from 'react';
import { connect, routerRedux } from 'engine';
import { Tabs } from 'antd';


const TabPane = Tabs.TabPane;
const panes = [
  { title: 'SystemRole', key: 'privilege' },
  { title: 'Roles', key: 'roles' },
  { title: 'Users', key: 'users' },
];
@connect(({ app }) => ({ app }))
export default class RightTabZone extends Component {
  state = {
    tab: 'roles',
  };

  onChangeSystem = (key) => {
    this.setState({ tab: key });
    const location = window.location;
    const currentUrl = `${location.pathname}/${key}`;
    this.props.dispatch(routerRedux.push({
      pathname: currentUrl,
    }));
  };

  render() {

    return (
      <Tabs
        activeKey={this.state.tab}
        tabPosition="top"
        onTabClick={this.onChangeSystem.bind(this)}
      >
        {panes &&
        panes.map((pane) => {
          return <TabPane tab={pane.title} key={pane.key}>roles</TabPane>;
        })
        }
      </Tabs>
    );
  }
}
