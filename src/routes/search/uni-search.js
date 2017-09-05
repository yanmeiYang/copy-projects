import React from 'react';
import { routerRedux, Link } from 'dva/router';
import { connect } from 'dva';
import { isEqual } from 'lodash';
import { FormattedMessage as FM, FormattedDate as FD } from 'react-intl';
import classnames from 'classnames';
import { Tabs, Pagination } from 'antd';
import styles from './uni-search.less';
import { PersonList } from '../../components/person';
import { Spinner } from '../../components';
import { sysconfig } from '../../systems';
import { KnowledgeGraphSearchHelper } from '../knowledge-graph';
import { SearchFilter, KgSearchBox } from '../../components/search';
import ExportPersonBtn from '../../components/person/export-person';
import { Auth } from '../../hoc';

// TODO Extract Search Filter into new Component.
// TODO Combine search and uniSearch into one.
const TabPane = Tabs.TabPane;

const defaultSearchSorts = ['relevance', 'h_index',
  'activity', 'rising_star', 'citation', 'num_pubs'];

/**
 * UniSearch Page
 * http://localhost:8000/search/%83...%BD/0/20?view=relation
 */
@connect(({ app, search, loading }) => ({ app, search, loading }))
@Auth
export default class UniSearch extends React.PureComponent {
  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
    this.searchSorts = sysconfig.Search_SortOptions || defaultSearchSorts;
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
    currentTab: 'list-view',
    view: {},
  };

  componentWillMount() {
    this.query = this.props.location.query;
    this.state.currentTab = this.query.view ? `${this.query.view}` : 'list-view';
    const { query } = this.props.search;

    if (sysconfig.SearchBarInHeader) {
      this.dispatch({
        type: 'app/layout',
        payload: {
          headerSearchBox: { query, onSearch: this.onSearchBarSearch },
        },
      });
    }
    this.doSearchUseProps(); // Init search.
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.search.query !== this.props.search.query) {
      console.log('COMPARE:', nextProps.search.query, this.props.search.query);
    }
  }

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
      // console.log('>>>>> ', search.query, search.offset, search.pagination);
      this.doSearchUseProps();
      window.scrollTo(0, 0); // go top
    }
  }

  onSearchBarSearch = (data) => {
    console.log('Enter query is ', data);
    const newOffset = data.offset || 0;
    const newSize = data.size || sysconfig.MainListSize;
    this.dispatch(routerRedux.push({
      pathname: `/${sysconfig.SearchPagePrefix}/${data.query}/${newOffset}/${newSize}?`, // eb=${filters.eb}TODO
    }));
    // this.doSearchUseProps(); // another approach;
  };

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

  onViewTabChange = (key) => {
    const { query } = this.props.search;
    this.setState({ currentTab: key });
    const pageSize = sysconfig.MainListSize;
    this.props.dispatch(routerRedux.push({
      pathname: `/${sysconfig.SearchPagePrefix}/${query}/0/${pageSize}?view=${key}`,
    }));
  };

  onOrderChange = (e) => {
    const { filters, query } = this.props.search;
    this.setState({ sortType: e });
    this.dispatch({ type: 'search/updateSortKey', payload: { key: e } });
    this.dispatch({
      type: 'search/searchPerson',
      payload: { query, offset: 0, size: sysconfig.MainListSize, filters, sort: e },
    });
  };

  // TODO spiner fade too earlier when navi by url.
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
    if (!dontRefreshUrl) {
      this.dispatch(routerRedux.push({
        pathname: `/${sysconfig.SearchPagePrefix}/${query}/0/${size}`,
      }));
    }
  };


  render() {
    const { results, pagination, query, aggs, filters } = this.props.search;
    const { pageSize, total, current } = pagination;
    const load = this.props.loading.effects['search/searchPerson'];
    const operations = (
      <ExportPersonBtn
        query={query} pageSize={pageSize} current={current}
        filters={filters} sort={this.state.sortType} />
    );
    // Deprecated search result tab.

    // const exportArea = sysconfig.Enable_Export ? <ExportPersonBtn /> : '';
    // const wantedTabs = sysconfig.UniSearch_Tabs;
    // const avaliableTabs = {
    //   list: { key: 'list', label: '列表视图', icon: 'fa-list' },
    //   map: { key: 'map', label: '地图视图', icon: 'fa-map-marker' },
    //   relation: { key: 'relation', label: '关系视图', icon: 'fa-users' },
    // };

    this.state.view['list-view'] = (
      <div>
        <Tabs
          defaultActiveKey={this.state.sortType}
          onChange={this.onOrderChange}
          size="small"
          className={styles.maxWidth}
          tabBarExtraContent={operations}
        >
          {this.searchSorts.map((sortItem) => {
            const icon = sortItem === this.state.sortType ?
              <i className="fa fa-sort-amount-desc" /> : '';
            const tab = (
              <span>
                <FM id={`com.search.sort.label.${sortItem}`}
                    defaultMessage={sortItem} /> {icon}
              </span>
            );
            return <TabPane tab={tab} key={sortItem} />;
          })}
        </Tabs>

        <div>
          <Spinner loading={load} />
          <PersonList persons={results} personLabel={sysconfig.Person_PersonLabelBlock}
                      personRightButton={sysconfig.Person_PersonRightButton} />
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
      </div>
    );

    /*
     this.state.view['map-view'] = (
     <div className={styles.mapView}>
     <ExpertMap query={this.props.search.query} />
     </div>
     );

     this.state.view['relation-view'] = (
     <div>
     <RelationGraph query={this.props.search.query} />
     </div>
     );
     */

    // DEBUGLog && console.log('DEV-ONLY:refresh pagesdf', load);
    const { headerSearchBox } = this.props.app;
    const { useTranslateSearch, translatedQuery } = this.props.search;
    return (
      <div className={classnames('content-inner', styles.page)}>

        <div className={styles.topZone}>
          <div className={styles.searchZone}>

            {/* 搜索框 */}
            {!headerSearchBox &&
            <div className={styles.top}>
              <div className={styles.searchWrap}>
                <KgSearchBox
                  size="large" style={{ width: 500 }}
                  query={query} onSearch={this.onSearchBarSearch}
                />
              </div>
            </div>
            }

            {/* Translate Search */}
            {useTranslateSearch && translatedQuery &&
            <div className="message">
              <FM defaultMessage="We also search '{enQuery}' for you."
                  id="search.translateSearchMessage.1"
                  values={{ enQuery: translatedQuery }}
              />&nbsp;
              <Link onClick={this.doTranslateSearch.bind(this, false)}>
                <FM defaultMessage="Search '{cnQuery}' only."
                    id="search.translateSearchMessage.2"
                    values={{ cnQuery: query }} />
              </Link>
            </div>}

            {!useTranslateSearch && translatedQuery &&
            <div className="message">
              <Link onClick={this.doTranslateSearch.bind(this, true)}>
                <FM defaultMessage="You can also search with both '{enQuery}' and '{cnQuery}'."
                    id="search.translateSearchMessage.reverse"
                    values={{ enQuery: translatedQuery, cnQuery: query }}
                />
              </Link>
            </div>}

            {/* Filter */}
            <SearchFilter filters={filters} aggs={aggs}
                          onFilterChange={this.onFilterChange}
                          onExpertBaseChange={this.onExpertBaseChange}
            />
          </div>

          {/*{sysconfig.Search_EnableKnowledgeGraphHelper &&*/}
          {/*<div className={styles.rightZone}>*/}
            {/*<KnowledgeGraphSearchHelper query={query} />*/}
          {/*</div>*/}
          {/*}*/}

        </div>

        {/* 这里可是添加TAB */}
        {/*
         <div className={styles.viewTab}>
         <Tabs
         onChange={this.onViewTabChange}
         type="card"
         tabBarExtraContent={exportArea}
         defaultActiveKey={this.state.currentTab}
         >
         {wantedTabs && wantedTabs.map((key) => {
         const tab = avaliableTabs[key];
         const tabJsx = (<p>
         <i className={`fa ${tab.icon} fa-fw`} aria-hidden="true" />
         {tab.label}
         </p>);
         return tab ? (<TabPane tab={tabJsx} key={`${tab.key}-view`} />) : '';
         })}
         </Tabs>
         </div>
         */}

        <div className={styles.view}>
          {/* <Spinner loading={load} /> */}
          {this.state.view[this.state.currentTab]}
        </div>
      </div>
    );
  }
}
