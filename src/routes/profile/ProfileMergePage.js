/**
 * Created by yangyanmei on 17/10/17.
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link, withRouter } from 'dva/router';
import { sysconfig } from 'systems';
import { theme, applyTheme } from 'themes';
import * as strings from 'utils/strings';
import { hole, createURL } from 'utils';
import { Auth } from 'hoc';
import { Layout } from 'routes';
import { FormattedMessage as FM } from 'react-intl';
import SearchComponent from 'routes/search/SearchComponent';
import ProfileMerge from 'routes/profile/ProfileMerge';
import { query } from 'services/user';
import styles from './ProfileMergePage.less';

const tc = applyTheme(styles);
@connect(({ app, search }) => ({ app, search }))
@withRouter
@Auth
export default class ProfileMergePage extends Component {
  state = {
    name: '',
  };

  componentWillMount() {
    const { match } = this.props;
    const { name } = match.params;
    this.setState({ name });
    this.props.dispatch({
      type: 'search/searchPerson',
      payload: {
        query: name,
        offset: 0,
        size: 10,
        filters: { id: 'aminer', name: '全球专家' },
        sort: [],
      },
    });
  }

  onSearchBarSearch = (data) => {
    const { match, dispatch } = this.props;
    const pathname = createURL(match.path, match.params, {
      query: data.query || '-',
      offset: data.offset || 0,
      size: data.size || sysconfig.MainListSize,
    });
    dispatch(routerRedux.push({ pathname }));
  };

  render() {
    const { name } = this.state;
    const { results } = this.props.search;
    const expertBaseId = 'aminer';
    return (
      <Layout contentClass={tc(['profileMerge'])} onSearch={this.onSearchBarSearch}
              query={name} showNavigator={false}>
        <ProfileMerge results={results} expertBaseId={expertBaseId} user={this.props.app.user} />
      </Layout>
    );
  }
}

