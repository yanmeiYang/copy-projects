/**
 * Created by yangyanmei on 18/3/20.
 */
import React, { Component } from 'react';
import { connect } from 'engine';
import { Layout } from 'components/layout';
import { sysconfig, getAllSystemConfigs, AvailableSystems } from 'systems';
import { Tabs } from 'antd';
import All from './all.js';

const TabPane = Tabs.TabPane;
export default class Settings extends Component {
  state = {};

  render() {

    return (
      <All />
    );
  }
}
