import React, { Component } from 'react';
import { routerRedux, withRouter } from 'dva/router';
import { connect } from 'dva';
import * as strings from 'utils/strings';
import { Layout } from 'routes';
import { sysconfig } from 'systems';
import { theme, applyTheme } from 'themes';
import { Auth } from 'hoc';
import styles from './AnnotatePersonProfile.less';

const tc = applyTheme(styles);

// TODO Combine search and uniSearch into one.

@connect(({ app }) => ({ app }))
@Auth
@withRouter
export default class AnnotatePersonProfile extends Component {
  constructor(props) {
    super(props);
  }

  state = {};

  componentWillReceiveProps(nextProps) {
  }

  // hook
  onSearchBarSearch = (data) => {
    console.log('test ... ');
  };

  render() {
    const { query } = this.props.match.params;
    return (
      <Layout contentClass={tc(['.annotatePersonProfile'])} onSearch={this.onSearchBarSearch}
              query={query}>
        lskdf;akjsd;flkjas;ld
      </Layout>
    );
  }
}
