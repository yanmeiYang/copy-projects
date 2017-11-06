import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { routerRedux, Link, withRouter } from 'dva/router';
import { sysconfig } from 'systems';
import { theme, applyTheme } from 'themes';
import { hole, createURL } from 'utils';
import { query } from 'services/user';
import * as strings from 'utils/strings';
import { Auth } from 'hoc';
import { Layout } from 'routes';
import { FormattedMessage as FM } from 'react-intl';
import SearchComponent from 'routes/search/SearchComponent';
import styles from './ExpertBaseExpertsPage.less';

const tc = applyTheme(styles);

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
    let { query } = match.params;
    query = query === '-' ? '' : query;

    console.log('000000--', { query, offset, size, id });

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

  onSearchBarSearch = (data) => {
    const { match, dispatch } = this.props;
    const pathname = createURL(match.path, match.params, {
      query: data.query || '-',
      offset: data.offset || 0,
      size: data.size || sysconfig.MainListSize,
    });
    dispatch(routerRedux.push({ pathname }));
  };

  ebSorts = ['time', 'h_index', 'activity', 'rising_star', 'n_citation', 'n_pubs'];

  render() {
    const { query, pagination, sortKey } = this.props.search;
    let seeAllURL = '';
    if (query) {
      const { match } = this.props;
      seeAllURL = createURL(match.path, match.params, {
        query: '-', offset: 0, size: sysconfig.MainListSize,
      });
    }

    const total = pagination && (pagination.total || 0);
    const { term, name, org } = strings.destructQueryString(query);
    const zoneData = { total, term, name, org };

    return (
      <Layout contentClass={tc(['expertBase'])} onSearch={this.onSearchBarSearch}
              query={query} fixAdvancedSearch>

        {theme.ExpertBaseExpertsPage_TitleZone && theme.ExpertBaseExpertsPage_TitleZone.length > 0 &&
        <h1 className={styles.pageTitle}>

          {hole.fill(theme.ExpertBaseExpertsPage_TitleZone, [
            <FM key={10} defaultMessage="我的专家库" id="page.ExpertBaseExpertsPage.MyExperts" />,
          ])}

          {theme.ExpertBaseExpertsPage_Title_SHOW_SeeAll_Link && seeAllURL &&
          <div className={styles.seeAll}>
            <Link to={seeAllURL}>
              <FM key={10} defaultMessage="查看全部专家"
                  id="page.ExpertBaseExpertsPage.SeeAllExperts" />
            </Link>
          </div>
          }
        </h1>}

        <div className={styles.message}>
          {hole.fillFuncs(theme.ExpertBaseExpertsPage_MessageZone, [
            (payload) => {
              const querySegments = [];
              if (payload.term) {
                querySegments.push(payload.term);
              }
              if (payload.name) {
                querySegments.push(payload.name);
              }
              if (payload.org) {
                querySegments.push(payload.org);
              }
              const queryString = querySegments.join(', ');

              return (
                <div key={100}>
                  {payload.total} Experts in ACM Fellow.
                  {queryString && <span> related to "{queryString}".</span>}
                </div>
              );
            },
          ], zoneData)}
        </div>

        <SearchComponent // Example: include all props.
          className={styles.SearchBorder} // additional className
          sorts={query ? null : this.ebSorts}
          defaultSortType={sortKey}
          onSearchBarSearch={this.onSearchBarSearch}
          expertBaseId={sysconfig.ExpertBase}
          // showSearchBox={this.props.app.headerSearchBox ? false : true}
          showSearchBox={false}
          disableFilter={!query}
          disableExpertBaseFilter
          disableSearchKnowledge
        />
      </Layout>
    );
  }
}

