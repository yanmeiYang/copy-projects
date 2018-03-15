import React, { Component } from 'react';
import { connect,routerRedux, withRouter } from 'engine';
// import * as strings from 'utils/strings';
import { Layout } from 'components/layout';
import { sysconfig } from 'systems';
// import classnames from 'classnames';
// import { Auth } from 'hoc';
import Privilege from './index';
// import styles from './personalrole.less';

// TODO Combine search and uniSearch into one.
@connect(({ app, loading, mgr }) => ({ app, loading, mgr }))
// @Auth
@withRouter
export default class PersonalRole extends Component {
  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
  }

  componentDidMount() {
    this.props.dispatch({ type: 'mgr/getMineRolesAndPrivileges', payload: {} });
  }

  render() {
    const { mgr } = this.props;
    const roles = mgr && mgr.MineRolesAndPrivileges && mgr.MineRolesAndPrivileges.items;
    return (
      <Layout showNavigator searchZone={[]} onSearch={this.onSearchBarSearch}>
        <Privilege role={roles} />
      </Layout>
    );
  }
}
