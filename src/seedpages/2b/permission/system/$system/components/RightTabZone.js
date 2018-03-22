import React, { Component } from 'react';
import { connect, routerRedux } from 'engine';
import { Tabs } from 'antd';
import { withRouter } from 'dva/router';
import { createURL, queryString } from 'utils';

const TabPane = Tabs.TabPane;
const panes = [
  { title: 'SystemRole', key: 'privilege' },
  { title: 'Roles', key: 'roles' },
  { title: 'Users', key: 'users' },
];
@connect(({ app }) => ({ app }))
@withRouter
export default class RightTabZone extends Component {

  componentWillMount() {
    this.currentKey = this.props.currentKey || 'privilege';
  }

  onChangeSystem = (key) => {
    const { match } = this.props;
    // const currentUrl = createURL(match.path, match.params);
    // console.log('match.path, match.params',match.path, match.params);
    // // this.props.dispatch(routerRedux.push({
    // //   pathname: `${currentUrl}${key}`,
    // // }));

    let pathname = null;

    const currentUrl = match.path.split(':system/');
    // if (currentUrl.length > 1) {
    //   pathname = `${currentUrl[0]}${match.params.system}/${key}`
    // } else {
    //   pathname = `${location.pathname}/settings/${key}`
    // }
    //
    this.props.dispatch(routerRedux.push({
      pathname: `${currentUrl[0]}${match.params.system}/${key}`,
    }));

  };

  render() {

    return (
      <Tabs
        activeKey={this.currentKey}
        tabPosition="top"
        onTabClick={this.onChangeSystem.bind(this)}
      >
        {panes &&
        panes.map((pane) => {
          return <TabPane tab={pane.title} key={pane.key} />;
        })
        }
      </Tabs>
    );
  }
}
