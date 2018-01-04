import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { hole } from 'utils';
import { Layout } from 'routes';
import { sysconfig } from 'systems';
import { theme, applyTheme } from 'themes';
import { classnames } from 'utils/index';
import ProjectList from './projectList'
const tc = applyTheme(styles);
@connect(({ app }) => ({ app }))
@Auth

export default class Reco extends Component {
  static displayName = 'reco';

  render() {
    return (
      <Layout searchZone={[]} contentClass={tc(['indexPage'])} showNavigator={false}>
        <ProjectList />
      </Layout>
    );
  }
}
