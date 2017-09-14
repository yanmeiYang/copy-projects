import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { routerRedux, Link, withRouter } from 'dva/router';
import { sysconfig } from 'systems';
import { Auth } from 'hoc';
import classnames from 'classnames';
import { createURL } from 'utils';
import SearchComponent from 'routes/search/SearchComponent';
import styles from './ExpertBaseExpertsPage.less';

@connect(({ app, search, expertBase, loading }) => ({ app, search, expertBase, loading }))
@withRouter
@Auth
export default class ExpertBaseExpertsPage extends Component {
  constructor(props) {
    super(props);
    this.TheOnlyExpertBaseID = sysconfig.ExpertBase;
  }

  componentWillMount() {
    const { dispatch, match } = this.props;
    const { offset, size, id } = match.params;
    let query = match.params.query;
    query = query === '-' ? '' : query;

    console.log('000', { query, offset, size, id });

    // this.props.dispatch({
    //   type: 'expertBase/getExpertDetailList',
    //   payload: { id: this.TheOnlyExpertBaseID, offset: 0, size: 200 },
    // });
    dispatch({
      type: 'app/layout',
      payload: {
        headerSearchBox: {
          query,
          onSearch: this.onSearch,
          btnText: 'Search expert base',
          searchPlaceholder: 'Input expert name',
        },
        // showFooter: false,
      },
    });
    // Set query to null, and set eb to the only eb. TODO bugs
    dispatch({
      type: 'search/updateFiltersAndQuery', payload: {
        query, filters: { eb: { id: sysconfig.ExpertBase, name: '我的专家库' } },
      },
    });
  }

  // addExpertDetailInfo = (dataId) => {
  //   const id = dataId;
  //   this.props.dispatch(routerRedux.push({ pathname: `/add-expert-detail/${id}` })); // TODO
  // };

  onSearch = (data) => {
    const { match, dispatch } = this.props;
    const pathname = createURL(match.path, match.params, {
      query: data.query || '-',
      offset: data.offset || 0,
      size: data.size || sysconfig.MainListSize,
    });
    dispatch(routerRedux.push({ pathname }));
  };

  // Not used
  searchExpertByName = (value) => {
    this.setState({ flag: true });
    const id = this.TheOnlyExpertBaseID;
    if (value) {
      this.props.dispatch({
        type: 'expertBase/searchExpertItem',
        payload: { id, name: value },
      });
    } else {
      this.props.dispatch({
        type: 'expertBase/getExpertDetailList',
        payload: { id, offset: 0, size: 100 },
      });
    }
  };

  ebSorts = ['time', 'h_index', 'activity', 'rising_star', 'n_citation', 'n_pubs'];

  render() {
    const { query } = this.props.search;
    let seeAllURL = '';
    if (query) {
      const { match } = this.props;
      seeAllURL = createURL(match.path, match.params, {
        query: '-', offset: 0, size: sysconfig.MainListSize,
      });
    }

    return (
      <div className={classnames('content-inner', styles.page)}>
        <h1 className={styles.pageTitle}>
          我的专家库
          {seeAllURL &&
          <div className={styles.seeAll}>
            <Link to={seeAllURL}>查看全部专家</Link>
          </div>
          }
        </h1>
        <SearchComponent // Example: include all props.
          className={styles.SearchBorder} // additional className
          sorts={query ? null : this.ebSorts}
          defaultSortType="time"
          onSearchBarSearch={this.onSearchBarSearch}
          showSearchBox={this.props.app.headerSearchBox ? false : true}
          disableFilter={!query}
          disableExpertBaseFilter
          disableSearchKnowledge
        />
      </div>

    );
  }
}

