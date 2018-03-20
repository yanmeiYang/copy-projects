/**
 * Created by yangyanmei on 18/3/20.
 */
import React, { Component } from 'react';
import { connect } from 'engine';
import { Tabs } from 'antd';
import { routerRedux, Link, withRouter } from 'dva/router';

@connect(({ app }) => ({ app }))
export default class TobZone extends Component {
  state = {};



  onChangeSystem(key) {
    this.setState({ tab: key });
    const location = window.location;
    let pathname = null;

    const currentUrl = location.pathname.split('settings/');
    if (currentUrl.length>1){
      pathname = `${currentUrl[0]}settings/${key}`
    } else {
      pathname = `${location.pathname}/${key}`
    }

    this.props.dispatch(routerRedux.push({
      pathname,
    }));
  }

  render() {

    return (
      <Tabs
        tabPosition="top"
        onTabClick={this.onChangeSystem.bind(this)}
        defaultActiveKey="all"
      >
        <Tabs.TabPane tab="All" key="all" />
        <Tabs.TabPane tab="New System" key="newSystem" />
        <Tabs.TabPane tab="User Role" key="userRole" />
      </Tabs>
    );
  }
}
