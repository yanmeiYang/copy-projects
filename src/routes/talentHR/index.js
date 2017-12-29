import React, { Component } from 'react';
import { routerRedux, Link } from 'dva/router';
import { Layout } from 'routes';
import { theme, applyTheme } from 'themes';
import TalentSearch from './talentSearch/talentSearch'
import styles from './index.less';

const tc = applyTheme(styles);

// @connect(({ app }) => ({ app }))
// @Auth
export default class TalentHR extends Component {
  static displayName = 'talentHR';

  render() {
    return (
      <Layout searchZone={[]} contentClass={tc(['indexPage'])} showNavigator={false}>
        <TalentSearch style={{ height: '36' }} />
      </Layout>
    );
  }
}
