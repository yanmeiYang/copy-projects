import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Tabs, Tag, Pagination } from 'antd';
import styles from './uni-search.less';
import { PersonList } from '../../components/person';
import { Spinner } from '../../components';
import { sysconfig } from '../../systems';
import { KnowledgeGraphSearchHelper } from '../knowledge-graph';
import { SearchFilter } from '../../components/search';
import ExportPersonBtn from '../../components/person/export-person';
// import ExpertMap from '../expert-map/expert-map';
// import RelationGraph from '../relation-graph/RelationGraph';
// import { KgSearchBox } from '../../components/search';

// TODO Extract Search Filter into new Component.
// TODO Combine search and uniSearch into one.
const TabPane = Tabs.TabPane;

const searchSorts = [
  { label: '综合排序', key: 'relevance' },
  { label: 'H-index', key: 'h_index' },
  { label: '学术活跃度', key: 'activity' },
  { label: '领域新星', key: 'rising_star' },
  { label: '引用数', key: 'citation' },
  { label: '论文数', key: 'num_pubs' },
];

/**
 * UniSearch Page
 * http://localhost:8000/search/%83...%BD/0/30?view=relation
 */
class UniSearch extends React.PureComponent {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
    this.query = this.props.location.query;

    // Select default Expert Base.
    const { filters } = this.props.search;
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
    this.state.currentTab = this.query.view ? `${this.query.view}` : 'list-view';
    const { query } = this.props.search;
    this.dispatch({
      type: 'app/layout',
      payload: {
        headerSearchBox: {
          query,
          onSearch: (data) => {
            const newOffset = data.offset || 0;
            const newSize = data.size || 30;
            this.dispatch(routerRedux.push({
              pathname: `/${sysconfig.SearchPagePrefix}/${data.query}/${newOffset}/${newSize}?`, //eb=${filters.eb}TODO
            }));
          },
          // query: 'sdflkj',
        },
      },
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    // console.log("should component update?");
    // if (nextProps.profile && this.props.profile) {
    //   if (nextProps.profile.id === this.props.profile.id) {
    //     return false;
    //   }
    // }
    return true;
  }

  onFilterChange = (key, value, checked) => {
    const { filters, query } = this.props.search;

    // if onExpertBaseChanged, all filters is cleared.
    if (checked) {
      filters[key] = value;
    } else if (filters[key]) {
      delete filters[key];
    }
    this.doSearch(query, 0, 20, filters, '');
  };

  onViewTabChange = (key) => {
    const { query } = this.props.search;
    this.setState({ currentTab: key });
    this.props.dispatch(routerRedux.push({
      pathname: `/${sysconfig.SearchPagePrefix}/${query}/0/30?view=${key}`,
    }));
  };

  onOrderChange = (e) => {
    const { filters, query } = this.props.search;
    this.setState({ sortType: e });
    this.dispatch({ type: 'search/updateSortKey', payload: { key: e } });
    this.dispatch({
      type: 'search/searchPerson',
      payload: { query, offset: 0, size: 30, filters, sort: e },
    });
  };

  onPageChange = (page) => {
    const { query, filters, sort, pagination } = this.props.search;
    const { pageSize } = pagination;
    this.doSearch(query, (page - 1) * pageSize, pageSize, filters, sort);
    // ReactDOM.findDOMNode(this.refs.wrap).scrollTo(0, 0);
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

  doSearch = (query, offset, size, filters, sort) => {
    this.dispatch({
      type: 'search/searchPerson',
      payload: { query, offset, size, filters, sort },
    });
    this.dispatch({
      type: 'search/searchPersonAgg',
      payload: { query, offset, size, filters, sort },
    });
  };

  render() {
    const { results, pagination, query, aggs, filters } = this.props.search;
    const { pageSize, total, current } = pagination;
    const load = this.props.loading.models.search;

    // Deprecated search result tab.
    const exportArea = sysconfig.Enable_Export ? <ExportPersonBtn /> : '';
    const wantedTabs = sysconfig.UniSearch_Tabs;
    const avaliableTabs = {
      list: { key: 'list', label: '列表视图', icon: 'fa-list' },
      map: { key: 'map', label: '地图视图', icon: 'fa-map-marker' },
      relation: { key: 'relation', label: '关系视图', icon: 'fa-users' },
    };

    this.state.view['list-view'] = (
      <div>
        <Tabs
          defaultActiveKey={this.state.sortType}
          onChange={this.onOrderChange}
          size="small"
        >
          {searchSorts.map((sortItem) => {
            const icon = sortItem.key === this.state.sortType ?
              <i className="fa fa-sort-amount-desc" /> : '';
            const tab = <span>{sortItem.label} {icon}</span>;
            return <TabPane tab={tab} key={sortItem.key} />;
          })}
        </Tabs>

        <div>
          <Spinner loading={load} />

          <PersonList persons={results} personLabel={sysconfig.Person_PersonLabelBlock} />

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

    DEBUGLog && console.log('refresh pagesdf', load);
    // DEBUGLog('refresh pagesdf', load); // TODO define a function.

    // TODO extract filter into component.
    return (
      <div className="content-inner">

        <div className={styles.topZone}>
          <div className="searchZone">
            <SearchFilter
              filters={filters}
              aggs={aggs}
              onFilterChange={this.onFilterChange}
              onExpertBaseChange={this.onExpertBaseChange}
            />
          </div>

          <div className="rightZone">
            <KnowledgeGraphSearchHelper query={query} />
          </div>
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


export default connect(({ app, search, loading }) => ({ app, search, loading }))(UniSearch);
