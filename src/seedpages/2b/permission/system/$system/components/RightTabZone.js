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
    tab: 'privilege',
  };

  onChangeSystem = (key) => {
    this.setState({ tab: key });
    const location = window.location;
    let pathname = null
    const currentUrl = location.pathname.split('system/');
    const currentSystem = currentUrl[1].split('/');
    console.log('location', currentUrl)
    pathname = `${currentUrl[0]}${currentSystem}/${key}`;
    console.log('this.props', pathname)
    this.props.dispatch(routerRedux.push({
      pathname,
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
          return <TabPane tab={pane.title} key={pane.key}>dddddddd</TabPane>;
        })
        }
      </Tabs>
    );
  }
}
