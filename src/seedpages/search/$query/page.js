import React, { Component } from 'react';
// import { withRouter } from 'dva/router';
import { connect, Page, routerRedux, withRouter } from 'engine';
import { classnames } from 'utils';
import * as strings from 'utils/strings'; // TODO merge into utils.
import { Layout } from 'components/layout';
import { sysconfig } from 'systems';
import { theme, applyTheme } from 'themes';
import { Auth } from 'hoc';
import SearchComponent from 'components/searchpage/SearchComponent';
import styles from './page.less';

const tc = applyTheme(styles);

@Page()
@connect(({ app, search, loading, location }) => ({ app, search, loading, location }))
@Auth @withRouter
export default class SearchPage extends Component {
  constructor(props) {
    super(props);

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

  // Smart Search Assistant.
  componentWillMount() {
    this.props.dispatch({
      type: 'search/setAssistantDataMeta',
      payload: { isNotAffactedByAssistant: true, isSearchAbbr: true },
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.search.query !== this.props.search.query) {
      console.log('COMPARE:', nextProps.search.query, this.props.search.query);
      this.props.dispatch({
        type: 'search/setAssistantDataMeta',
        payload: { isNotAffactedByAssistant: true, isSearchAbbr: true },
      });
    }
  }

  // hook
  onSearchBarSearch = (data) => {
    console.log('Enter query is ', data);
    const newOffset = data.offset || 0;
    const newSize = data.size || sysconfig.MainListSize;
    const encodedQuery = strings.encodeAdvancedQuery(data.query) || '-';
    const pathname = `/${sysconfig.SearchPagePrefix}/${encodedQuery}/${newOffset}/${newSize}`;
    this.dispatch(routerRedux.push(pathname));
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
