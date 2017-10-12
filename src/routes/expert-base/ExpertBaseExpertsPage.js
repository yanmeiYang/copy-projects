import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { routerRedux, Link, withRouter } from 'dva/router';
import { sysconfig } from 'systems';
import { theme, applyTheme } from 'themes';
import { Auth } from 'hoc';
import { Layout } from 'routes';
import classnames from 'classnames';
import { FormattedMessage as FM } from 'react-intl';
import { createURL } from 'utils';
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
    const { query } = this.props.search;
    let seeAllURL = '';
    if (query) {
      const { match } = this.props;
      seeAllURL = createURL(match.path, match.params, {
        query: '-', offset: 0, size: sysconfig.MainListSize,
      });
    }

    const PageTitle = theme.ExpertBaseExpertsPage_Title
      || <FM defaultMessage="我的专家库" id="page.ExpertBaseExpertsPage.MyExperts" />;
    return (
      <Layout contentClass={tc(['expertBase'])} onSearch={this.onSearchBarSearch}
              query={query} advancedSearch>
        <h1 className={styles.pageTitle}>

          {PageTitle}

          {seeAllURL &&
          <div className={styles.seeAll}>
            <Link to={seeAllURL}>
              <FM defaultMessage="查看全部专家" id="page.ExpertBaseExpertsPage.SeeAllExperts" />
            </Link>
          </div>
          }
        </h1>

        <SearchComponent // Example: include all props.
          className={styles.SearchBorder} // additional className
          sorts={query ? null : this.ebSorts}
          defaultSortType="time"
          onSearchBarSearch={this.onSearchBarSearch}
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

