/**
 * Created by yangyanmei on 17/10/17.
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import { theme, applyTheme } from 'themes';
import { hole, createURL } from 'utils';
import { Auth } from 'hoc';
import { Layout } from 'routes';
import ProfileMerge from 'routes/profile/ProfileMerge';
import styles from './ProfileMergePage.less';

const tc = applyTheme(styles);
@connect(({ app, merge, loading, search }) => ({ app, merge, loading, search }))
@withRouter
@Auth
export default class ProfileMergePage extends Component {
  state = {
    name: '',
    id: '',
    current: 1,
    query: '',
  };

  componentWillMount() {
    const { match } = this.props;
    const { name, id } = match.params;
    this.setState({ name, id });
    this.props.dispatch({ type: 'merge/emptyCheckedPersons' });
    this.doSearchUseProps(); // Init search.
  }

  // // keep every thing, just call search;
  doSearchUseProps = () => {
    const { offset, pagination } = this.props.merge;
    const query = `||${this.props.match.params.name}`;
    const { pageSize } = pagination;
    this.setState({ query });
    this.doSearch(query, offset, pageSize);
  };
  //
  doSearch = (query, offset, size) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'merge/searchPerson',
      payload: {
        query,
        offset,
        size,
        personId: this.props.match.params.id,
      },
    });
  };

  onSearchBarSearch = (data) => {
    this.setState({ query: data.query });
    const { pageSize } = this.props.merge.pagination;
    const offset = (this.state.current - 1) * pageSize;
    this.doSearch(data.query, offset, pageSize);
  };

  onPageChange = (page) => {
    const { pageSize } = this.props.merge.pagination;
    this.setState({ current: page });
    const offset = (page - 1) * pageSize;
    const query = this.state.query;
    this.doSearch(query, offset, pageSize);
  };

  render() {
    const { name, id, current } = this.state;
    const { results, pagination } = this.props.merge;
    const { pageSize, total } = pagination;
    const expertBaseId = 'aminer';
    const load = this.props.loading.effects['merge/searchPerson'];
    return (
      <Layout contentClass={tc(['profileMergePage'])} onSearch={this.onSearchBarSearch}
              query={name} showNavigator={false} fixAdvancedSearch>
        <ProfileMerge load={load} results={results}
                      expertBaseId={expertBaseId} user={this.props.app.user}
                      currentPersonId={id}
                      onPageChange={this.onPageChange}
                      current={current} pageSize={pageSize} total={total} />
      </Layout>
    );
  }
}

