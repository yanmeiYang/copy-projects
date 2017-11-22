import React, { Component } from 'react';
import { routerRedux, withRouter } from 'dva/router';
import { connect } from 'dva';
import * as strings from 'utils/strings';
import { Layout } from 'routes';
import { sysconfig } from 'systems';
import { theme, applyTheme } from 'themes';
import classnames from 'classnames';
import { Auth } from 'hoc';
import SearchComponent from 'routes/search/SearchComponent';
import styles from './SearchPage.less';

const tc = applyTheme(styles);

// TODO Combine search and uniSearch into one.

@connect(({ app, search, loading }) => ({ app, search, loading }))
@Auth
@withRouter
export default class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
    // Select default Expert Base.
    const { filters } = props.search;
    if (filters && !filters.eb) {
      filters.eb = {
        id: sysconfig.DEFAULT_EXPERT_BASE,
        name: sysconfig.DEFAULT_EXPERT_BASE_NAME,
      };
    }
  }

  state = {
    sortType: 'relevance',
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.search.query !== this.props.search.query) {
      console.log('COMPARE:', nextProps.search.query, this.props.search.query);
    }
  }

  // hook
  onSearchBarSearch = (data) => {
    console.log('Enter query is ', data);
    const newOffset = data.offset || 0;
    const newSize = data.size || sysconfig.MainListSize;
    const encodedQuery = strings.encodeAdvancedQuery(data.query) || '-';
    const pathname = `/${sysconfig.SearchPagePrefix}/${encodedQuery}/${newOffset}/${newSize}`;
    console.log('=========== encode query is: ', pathname);
    this.dispatch(routerRedux.push({ pathname }));
    // ?eb=${filters.eb}TODO
    // this.doSearchUseProps(); // another approach;
  };

  render() {
    const { filters } = this.props.search;
    const { query } = this.props.match.params;
    const expertBaseId = filters && filters.eb && filters.eb.id;
    return (
      <Layout contentClass={tc(['searchPage'])} onSearch={this.onSearchBarSearch}
              query={query}>
        <SearchComponent // Example: include all props.
          className={styles.SearchBorder} // additional className
          sorts={sysconfig.Search_SortOptions}
          expertBaseId={expertBaseId}
          onSearchBarSearch={this.onSearchBarSearch}
          showSearchBox={false}
          disableFilter={sysconfig.Search_DisableFilter}
          disableExpertBaseFilter={sysconfig.Search_DisableExpertBaseFilter}
          disableSmartSuggest={!sysconfig.Search_EnableSmartSuggest}
          // disableSearchKnowledge={sysconfig.Search_DisableSearchKnowledge}
          rightZoneFuncs={theme.SearchComponent_RightZone}
          fixedExpertBase={sysconfig.Search_FixedExpertBase}
        />
      </Layout>
    );
  }
}
