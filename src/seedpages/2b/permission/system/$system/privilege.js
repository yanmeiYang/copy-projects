import React, { Component } from 'react';
import { connect, routerRedux } from 'engine';
import { Tabs } from 'antd';
import { Layout } from 'components/layout';
import LeftTabZone from '../../components/LeftTabZone';
import RightTabZone from './components/RightTabZone';
import { withRouter } from 'dva/router';
import Schema from 'components/mgr/schema';
import styles from './privilege.less';

@connect(({ app }) => ({ app }))
@withRouter
export default class Privilege extends Component {

  componentWillMount() {
    const { match } = this.props;
    const { system } = match.params;
    this.leftCurrentKey = system;
  }

  render() {
    return (
      <Layout searchZone={[]} showNavigator={false}>
        <div className={styles.permissionTabBox}>
          <LeftTabZone currentKey={this.leftCurrentKey} />

          <div className={styles.rightZone}>
            <RightTabZone currentKey="privilege" />
            <Schema />
          </div>
        </div>
      </Layout>
    );
  }
}
