import React, { Component } from 'react';
import { connect, routerRedux } from 'engine';
import { Tabs } from 'antd';
import { Layout } from 'components/layout';
import LeftTabZone from '../../components/LeftTabZone';
import RightTabZone from './components/RightTabZone';
import Schema from 'components/mgr/schema';
import styles from './privilege.less';


const TabPane = Tabs.TabPane;
const panes = [
  { title: 'SystemRole', key: 'privilege' },
  { title: 'Roles', key: 'roles' },
  { title: 'Users', key: 'users' },
];
@connect(({ app }) => ({ app }))
export default class Privilege extends Component {
  state = {
    tab: 'privilege',
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
      <Layout searchZone={[]} showNavigator={false}>
        <div className={styles.permissionTabBox}>
          <LeftTabZone />

          <div className={styles.rightZone}>
            <RightTabZone  />
            <Schema />
          </div>
        </div>
      </Layout>
    );
  }
}
