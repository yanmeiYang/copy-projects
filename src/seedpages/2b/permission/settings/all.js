/**
 * Created by yangyanmei on 18/3/20.
 */
import React, { Component } from 'react';
import { connect } from 'engine';
import { Layout } from 'components/layout';
import { sysconfig, getAllSystemConfigs, AvailableSystems } from 'systems';
import TobZone from './components/TopZone';
import Schema from '../../../mgr/auth/schema.js';

export default class All extends Component {
  render() {

    return (
      <div>
        <TobZone />
        <Schema />
      </div>
    );
  }
}
