import React, { Component, PureComponent, PropTypes } from 'react';
import { routerRedux, Link } from 'dva/router';
import { connect } from 'dva';
import { isEqual } from 'lodash';
import { FormattedMessage as FM, FormattedDate as FD } from 'react-intl';
import queryString from 'query-string';
import classnames from 'classnames';
import { Tabs, Pagination } from 'antd';
import { Spinner } from 'components';
import { PersonList, ExportPersonBtn } from 'components/person';
import { SearchFilter, SearchSorts, KgSearchBox, SearchKnowledge } from 'components/search';
import { sysconfig } from 'systems';
import { Auth } from 'hoc';
import { KnowledgeGraphSearchHelper } from '../knowledge-graph';
import styles from './SearchComponent.less';

// TODO Extract Search Filter into new Component.
// TODO Combine search and uniSearch into one.

@connect(({ app, search, loading }) => ({ app, search, loading }))
@Auth
export default class SearchComponent extends Component {
  static displayName = 'SearchComponent';

  static contextTypes = {};

  static propTypes = {
    // className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    className: PropTypes.string,
    disableFilter: PropTypes.bool,
    disableExpertBaseFilter: PropTypes.bool,
    sorts: PropTypes.array, // pass through
    onSearchBarSearch: PropTypes.func,
    showSearchBox: PropTypes.bool, // has search box?
  };

  static defaultProps = {
    disableFilter: false,
    disableExpertBaseFilter: false,
  };


  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;// TODO remove
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
    this.doSearchUseProps(); // Init search.
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.search.query !== this.props.search.query) {
  //     console.log('COMPARE:', nextProps.search.query, this.props.search.query);
  //   }
  // }

  // shouldComponentUpdate(nextProps, nextState) {
  // }

  // URL改变引起的props变化，在这里刷新搜索。其余的action导致的数据更新都在action后面调用了search方法。
  componentDidUpdate(prevProps, prevState) {
    const search = this.props.search;
    const prevSearch = prevProps.search;
    if (search.query !== prevSearch.query
      || search.offset !== prevSearch.offset
      || !isEqual(search.pagination.pageSize, prevSearch.pagination.pageSize)
    ) {
      this.doSearchUseProps();
      window.scrollTo(0, 0); // go top
    }
  }

  // will reset pager and sort.
  onFilterChange = (key, value, checked, total) => {
    const { filters, query } = this.props.search;

    // if onExpertBaseChanged, all filters is cleared.
    if (checked) {
      filters[key] = total ? `${value}#${total}` : value;
    } else if (filters[key]) {
      delete filters[key];
    }
    this.doSearch(query, 0, sysconfig.MainListSize, filters, '');
  };

  // onViewTabChange = (key) => {
  //   const { query } = this.props.search;
  //   this.setState({ currentTab: key });
  //   const pageSize = sysconfig.MainListSize;
  //   this.props.dispatch(routerRedux.push({
  //     pathname: `/${sysconfig.SearchPagePrefix}/${query}/0/${pageSize}?view=${key}`,
  //   }));
  // };

  onOrderChange = (e) => {
    const { filters, query } = this.props.search;
    this.setState({ sortType: e });
    this.dispatch({ type: 'search/updateSortKey', payload: { key: e } });
    this.dispatch({
      type: 'search/searchPerson',
      payload: { query, offset: 0, size: sysconfig.MainListSize, filters, sort: e },
    });
  };

  onPageChange = (page) => {
    const { query, pagination } = this.props.search;
    const { pageSize } = pagination;
    this.dispatch(routerRedux.push({
      pathname: `/${sysconfig.SearchPagePrefix}/${query}/${(page - 1) * pageSize}/${pageSize}`,
    }));
  };

  // ExpertBase filter 'eb' is a special filter.
  // On expert base changed, all other filters should be cleared.
  // sort method is not cleared.
  onExpertBaseChange = (id, name) => {
    const { filters } = this.props.search;
    // delete all other filters.
    Object.keys(filters).forEach((f) => {
      delete filters[f];
    });
    this.onFilterChange('eb', { id, name }, true);// Special Filter;
  };

  // keep every thing, just call search;
  doSearchUseProps = () => {
    const { query, offset, pagination, filters, sortKey } = this.props.search;
    const { pageSize, total, current } = pagination;
    this.doSearch(query, offset, pageSize, filters, sortKey, true);
  };

  doTranslateSearch = (useTranslate) => {
    this.dispatch({ type: 'search/setTranslateSearch', payload: { useTranslate } });
    this.doSearchUseProps();
  };

  doSearch = (query, offset, size, filters, sort, dontRefreshUrl) => {
    let filtersLength = 0;
    for (const item of Object.values(filters)) {
      if (typeof item === 'string') {
        filtersLength = item.split('#')[1];
      }
    }
    this.dispatch({ type: 'search/translateSearch', payload: { query } });
    this.dispatch({
      type: 'search/searchPerson',
      payload: { query, offset, size, filters, sort, total: parseInt(filtersLength) },
    });
    this.dispatch({
      type: 'search/searchPersonAgg',
      payload: { query, offset, size, filters, sort },
    });
    this.dispatch({
      type: 'search/getTopicByMention',
      payload: {
        mention: query,
      },
    });
    if (!dontRefreshUrl) {
      this.dispatch(routerRedux.push({
        pathname: `/${sysconfig.SearchPagePrefix}/${query}/0/${size}`,
      }));
    }
  };


  render() {
    const { disableExpertBaseFilter, disableFilter } = this.props;
    const { className, sorts } = this.props;
    const { sortType } = this.state;

    // .........
    const { results, pagination, query, aggs, filters, topic } = this.props.search;
    const { pageSize, total, current } = pagination;
    const load = this.props.loading.effects['search/searchPerson'];

    const expertBase = (filters && filters.eb && filters.eb.id) || 'aminer';

    const SearchSortsRightZone = !sysconfig.Enable_Export ? [] : [() => (
      <ExportPersonBtn
        query={query} pageSize={pageSize} current={current}
        filters={filters} sort={sortType}
      />
    )];
    // console.log('|||||||||||||||||||||||||||||', SearchSortsRightZone);

    // TODO move translate search out.
    const { useTranslateSearch, translatedQuery } = this.props.search;
    return (
      <div className={classnames(styles.component, className)}>

        <div className={styles.topZone}>
          <div className={styles.searchZone}>

            {/* 搜索框 */}
            {this.props.showSearchBox &&
            <div className={styles.top}>
              <div className={styles.searchWrap}>
                <KgSearchBox
                  size="large" style={{ width: 500 }}
                  query={query} onSearch={this.props.onSearchBarSearch}
                />
              </div>
            </div>
            }

            {sysconfig.Search_EnableTranslateSearch &&
            <div className="message">
              {/* Translate Search */}
              {useTranslateSearch && translatedQuery &&
              <div>
                <FM defaultMessage="We also search '{enQuery}' for you."
                    id="search.translateSearchMessage.1"
                    values={{ enQuery: translatedQuery }}
                />&nbsp;
                <Link onClick={this.doTranslateSearch.bind(this, false)}>
                  <FM defaultMessage="Search '{cnQuery}' only."
                      id="search.translateSearchMessage.2"
                      values={{ cnQuery: query }} />
                </Link>
              </div>
              }

              {!useTranslateSearch && translatedQuery &&
              <Link onClick={this.doTranslateSearch.bind(this, true)}>
                <FM defaultMessage="You can also search with both '{enQuery}' and '{cnQuery}'."
                    id="search.translateSearchMessage.reverse"
                    values={{ enQuery: translatedQuery, cnQuery: query }}
                />
              </Link>
              }
            </div>
            }

            {/* ---- Filter ---- */}
            {!disableFilter &&
            <SearchFilter
              filters={filters} aggs={aggs}
              onFilterChange={this.onFilterChange}
              onExpertBaseChange={this.onExpertBaseChange}
              disableExpertBaseFilter={disableExpertBaseFilter}
            />}

          </div>

        </div>

        <div className={styles.view}>

          {/* Sort */}
          <SearchSorts
            sorts={sorts}
            sortType={this.state.sortType}
            rightZone={SearchSortsRightZone}
            onOrderChange={this.onOrderChange}
          />

          <Spinner loading={load} />
          <div className={styles.personAndKg}>
            <div>
              <PersonList
                persons={results}
                user={this.props.app.user}
                titleRightBlock={sysconfig.PersonList_TitleRightBlock}
                rightZoneFuncs={sysconfig.PersonList_RightZone}
                bottomZoneFuncs={sysconfig.PersonList_BottomZone}
                didMountHooks={sysconfig.PersonList_DidMountHooks}
                UpdateHooks={sysconfig.PersonList_UpdateHooks}
              />
              <div className={styles.paginationWrap}>
                <Pagination
                  showQuickJumper
                  current={current}
                  defaultCurrent={1}
                  defaultPageSize={pageSize}
                  total={total}
                  onChange={this.onPageChange}
                />
              </div>
            </div>
            {topic.label && topic.label.toLowerCase() !== 'null' &&
            <SearchKnowledge topic={topic} />}
          </div>
        </div>

      </div>
    );
  }
}
