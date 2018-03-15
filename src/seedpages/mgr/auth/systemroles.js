import React, { Component } from 'react';
import { routerRedux, withRouter,connect } from 'engine';
import { Layout } from 'components/layout';
import { sysconfig } from 'systems';
import classnames from 'classnames';
// import { Auth } from 'hoc';
import Privilege from './index';
import { getPrivileges } from 'services/mgr';


// TODO Combine search and uniSearch into one.
@connect(({ app, loading, mgr }) => ({ app, loading, mgr }))
// @Auth
@withRouter
export default class SystemRoles extends Component {
  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
  }

  componentDidMount() {
    this.props.dispatch({ type: 'mgr/getPrivileges', payload: { roles: ['user'] } });
  }

  render() {
    return (
      <Layout showNavigator searchZone={[]} onSearch={this.onSearchBarSearch}>
        <Privilege />
      </Layout>
    );
  }
}
