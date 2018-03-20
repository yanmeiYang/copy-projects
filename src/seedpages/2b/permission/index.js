import React, { Component } from 'react';
import { connect } from 'engine';
import { Layout } from 'components/layout';
import LeftTabZone from './components/LeftTabZone'
import styles from './index.less';

export default class Permission extends Component {
  state = {};
  
  render() {

    return (
      <Layout searchZone={[]} showNavigator={false}>
        <LeftTabZone />
      </Layout>
    );
  }
}
