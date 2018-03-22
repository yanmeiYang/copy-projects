import React, { Component } from 'react';
import { connect, routerRedux } from 'engine';
import { Tabs } from 'antd';
import { createURL, queryString } from 'utils';
import { withRouter } from 'dva/router';
import { Layout } from 'components/layout';
import LeftTabZone from '../../components/LeftTabZone';
import RightTabZone from './components/RightTabZone';
import styles from './roles.less';

@connect(({ app }) => ({ app }))
@withRouter
export default class Roles extends Component {

  componentWillMount() {
    const { match } = this.props;
    const { system } = match.params;
    this.leftCurrentKey = system;
  }

  render() {

    return (
      <Layout searchZone={[]} showNavigator={false}>
        <div className={styles.rolesBlock}>
          <LeftTabZone currentKey={this.leftCurrentKey} />

          <div className={styles.rightZone}>
            <RightTabZone currentKey="roles" />
            <div> roles</div>
            {/*<Schema />*/}
          </div>
        </div>
      </Layout>
    );
  }
}
