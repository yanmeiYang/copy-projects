/**
 * Created by yangyanmei on 18/3/20.
 */
import React, { Component } from 'react';
import { connect } from 'engine';
import { Layout } from 'components/layout';
import { sysconfig, getAllSystemConfigs, AvailableSystems } from 'systems';
import { Tabs } from 'antd';
import TobZone from './components/TopZone';
import styles from './page.less';

const TabPane = Tabs.TabPane;
export default class UserRoles extends Component {
  state = {};

  render() {

    return (
      <div>
        <TobZone />
        <h1> user roles </h1>
      </div>

    );
  }
}
