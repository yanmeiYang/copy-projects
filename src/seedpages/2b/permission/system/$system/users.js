import React, { Component } from 'react';
import { connect, routerRedux } from 'engine';
import { Layout } from 'components/layout';
import RightTabZone from './components/RightTabZone';
import LeftTabZone from '../../components/LeftTabZone';
import styles from './users.less';

@connect(({ app }) => ({ app }))
export default class Users extends Component {

  componentWillMount() {
    const { match } = this.props;
    const { system } = match.params;
    this.leftCurrentKey = system;
  }

  render() {

    return (
      <Layout searchZone={[]} showNavigator={false}>
        <div className={styles.usersBlock}>
          <LeftTabZone currentKey={this.leftCurrentKey} />

          <div className={styles.rightZone}>
            <RightTabZone currentKey="users" />
            <div> users</div>
            {/*<Schema />*/}
          </div>
        </div>
      </Layout>
    );
  }
}
