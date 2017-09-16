import React, { Component } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { FormattedMessage as FM, FormattedDate as FD } from 'react-intl';
import { Layout } from 'routes';
import { sysconfig, applyTheme } from 'systems';
import classnames from 'classnames';
import { Auth } from 'hoc';
import SearchComponent from 'routes/search/SearchComponent';
import styles from './SearchPage.less';

const { theme } = sysconfig;
const tc = applyTheme(styles);

// TODO Combine search and uniSearch into one.

@connect(({ app, search, loading }) => ({ app, search, loading }))
@Auth
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

  componentWillMount() {
    const { dispatch } = this.props;
    const { query } = this.props.search;
    if (sysconfig.SearchBarInHeader) {
      dispatch({
        type: 'app/layout',
        payload: {
          headerSearchBox: { query, onSearch: this.onSearchBarSearch },
        },
      });
    }
    // console.log('nnmn^O^ $ ^O^nMn...... ');
  }

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
    this.dispatch(routerRedux.push({
      pathname: `/${sysconfig.SearchPagePrefix}/${data.query}/${newOffset}/${newSize}?`, // eb=${filters.eb}TODO
    }));
    // this.doSearchUseProps(); // another approach;
  };

  render() {
    const { filters } = this.props.search;
    const expertBaseId = filters && filters.eb && filters.eb.id;
    return (
      <Layout contentClass={tc(['searchPage'])}>
        <SearchComponent // Example: include all props.
          className={styles.SearchBorder} // additional className
          sorts={sysconfig.Search_SortOptions}
          expertBaseId={expertBaseId}
          onSearchBarSearch={this.onSearchBarSearch}
          showSearchBox={this.props.app.headerSearchBox ? false : true}
          disableFilter={sysconfig.Search_DisableFilter}
          disableExpertBaseFilter={sysconfig.Search_DisableExpertBaseFilter}
          disableSearchKnowledge={sysconfig.Search_DisableSearchKnowledge}
          fixedExpertBase={sysconfig.Search_FixedExpertBase}
        />
      </Layout>
    );
  }
}
