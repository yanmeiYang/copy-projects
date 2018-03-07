/**
 *
 */
import React, { Component } from 'react';
import { connect } from 'engine';
import { Layout } from 'components/layout';
import { Auth } from 'hoc';
import { theme, applyTheme } from 'themes';
import ProjectList from './components/ProjectList';

@connect(({ app }) => ({ app }))
@Auth
export default class RecoIndex extends Component {
  render() {
    return (
      <Layout searchZone={[]} showNavigator={false}>
        <ProjectList />
      </Layout>
    );
  }
}
