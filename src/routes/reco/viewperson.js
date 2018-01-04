import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Layout } from 'routes';
import { applyTheme } from 'themes';
import { Button } from 'antd';
import styles from './report.less';

const tc = applyTheme(styles);

export default class ViewPerson extends Component {
  state = {};

  componentDidMount() {
    // TODO @xiaobei: 在这里发送请求,根据taskID
    // this.props.dispatch()
  }

  render() {
    return (
      <Layout searchZone={[]} contentClass={tc(['indexPage'])} showNavigator={false}>
        <Link to="/reports"><Button>返回报告页</Button></Link>
      </Layout>
    );
  }
}
