import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Tabs, Tag, Pagination, Spin, Button } from 'antd';
import styles from './uni-search.less';
import { PersonList } from '../../components/person';
import ExpertMap from '../expert-map/expert-map';
import { sysconfig } from '../../systems';
import { KnowledgeGraphSearchHelper } from '../knowledge-graph';
import { classnames } from '../../utils';
import ExportPersonBtn from '../../components/person/export-person';
import RelationGraph from '../relation-graph/RelationGraph';
import { KgSearchBox } from '../../components/search';
import { Spinner } from '../../components';

const TabPane = Tabs.TabPane;
const { CheckableTag } = Tag;
const expertBases = sysconfig.ExpertBases;

const labelMap = { 'H-Index': 'h指数', Language: '语言', Location: '国家' };

function showChineseLabel(enLabel) {
  if (sysconfig.Language === 'cn') {
    const cnLabel = labelMap[enLabel];
    return !cnLabel ? enLabel : cnLabel;
  } else {
    return enLabel;
  }
}

const labelMap2 = { 'h-index': 'h指数', language: '语言', nationality: '国家' };

function showChineseLabel2(enLabel) {
  if (sysconfig.Language === 'cn') {
    const cnLabel = labelMap2[enLabel];
    return !cnLabel ? enLabel : cnLabel;
  } else {
    return enLabel;
  }
}

/*
 * http://localhost:8000/search/%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD/0/30?view=relation
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

    this.dispatch({
      type: 'app/layout',
      payload: {
        headerSearchBox: {
          onSearch: (data) => {
            const newOffset = data.offset || 0;
            const newSize = data.size || 30;
            this.dispatch(routerRedux.push({
              pathname: `/${sysconfig.SearchPagePrefix}/${data.query}/${newOffset}/${newSize}?`, //eb=${filters.eb}TODO
            }));
          },
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

// const Search = ({ app, search, dispatch }) => {


  onFilterChange = (key, value, checked) => {
    const { filters, query } = this.props.search;

    // if onExpertBaseChanged, all filters is cleared.
    if (checked) {
      filters[key] = value;
    } else if (filters[key]) {
      delete filters[key];
    }
    this.dispatch({ type: 'search/updateFilters', payload: { filters } });
    this.dispatch({
      type: 'search/searchPerson',
      payload: { query, offset: 0, size: 30, filters },
    });
    this.dispatch({
      type: 'search/searchPersonAgg',
      payload: { query, offset: 0, size: 30, filters },
    });
  };

// ExpertBase filter 'eb' is a special filter.
// On expert base changed, all other filters should be cleared.
// sort method is not cleared.
  onExpertBaseChange = (id, name) => {
    const { filters, query } = this.props.search;
    // delete all other filters.
    Object.keys(filters).forEach((f) => {
      delete filters[f];
    });
    this.onFilterChange('eb', { id, name }, true);// Special Filter;
  };
//
// onSearch = (data) => {
//   const newOffset = data.offset || 0;
//   const newSize = data.size || 30;
//   this.dispatch(routerRedux.push({
//     pathname: `/search/${data.query}/${newOffset}/${newSize}`,
//   }));
// }

  onPageChange = (page) => {
    const { pagination, query } = this.props.search;
    const { pageSize, total, current } = pagination;
    this.onSearch({
      query,
      offset: (page - 1) * pageSize,
      size: pageSize,
    });
    // ReactDOM.findDOMNode(this.refs.wrap).scrollTo(0, 0);
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

  onViewTabChange = (key) => {
    const { query } = this.props.search;
    this.setState({ currentTab: key });
    this.props.dispatch(routerRedux.push({
      pathname: `/${sysconfig.SearchPagePrefix}/${query}/0/30?view=${key}`,
    }));
  };

  filterDisplay = (name) => {
    return <span>{name} <i className="fa fa-sort-amount-desc" /></span>;
  };

  render() {
    const { results, pagination, query, aggs, loading, filters } = this.props.search;
    const { pageSize, total, current } = pagination;

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
          <TabPane tab={this.filterDisplay('相关度')} key="relevance" />
          <TabPane tab={this.filterDisplay('H-index')} key="h_index" />
          <TabPane tab={this.filterDisplay('学术活跃度')} key="activity" />
          <TabPane tab={this.filterDisplay('领域新星')} key="rising_star" />
          <TabPane tab={this.filterDisplay('引用数')} key="citation" />
          <TabPane tab={this.filterDisplay('论文数')} key="num_pubs" />
        </Tabs>

        <PersonList persons={results} />

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
    );

    this.state.view['map-view'] = (
      <div className={styles.mapView}>
        <div className={styles.map}>
          <ExpertMap query={this.props.search.query} />
        </div>
        {/*<div className={styles.quickLinks}>*/}
        {/* <a>一些快速链接！</a><br />*/}
        {/* <a>一些快速链接！</a><br />*/}
        {/* <a>一些快速链接！</a><br />*/}
        {/* <a>一些快速链接！</a><br />*/}
        {/* <a>一些快速链接！</a><br />*/}
        {/*</div>*/}
      </div>
    );

    this.state.view['relation-view'] = (
      <div>
        <RelationGraph query={this.props.search.query} />
      </div>
    );

    console.log('refresh page');

    return (
      <div className="content-inner">

        <div className={styles.topZone}>
          <div className="searchZone">

            {/* Filter */}
            <div className={styles.filterWrap}>
              <div className={styles.filter}>

                {sysconfig.SHOW_ExpertBase && expertBases &&
                <div className={classnames(styles.filterRow, styles.range)}>
                  <span className={styles.filterTitle}>搜索范围:</span>
                  <ul className={styles.filterItems}>
                    {
                      expertBases.map((ep) => {
                        const props = {
                          key: ep.id,
                          className: styles.filterItem,
                          onChange: () => this.onExpertBaseChange(ep.id, ep.name),
                          checked: filters.eb && (filters.eb.id === ep.id),
                        };
                        return (
                          <CheckableTag {...props}>{ep.name} {/* TODO Show Numbers */}</CheckableTag>
                        );
                      })
                    }
                  </ul>
                </div>}

                {filters && Object.keys(filters).length > 0 &&
                <div className={styles.filterRow}>
                  <span className={styles.filterTitle}>过滤条件:</span>
                  <ul className={styles.filterItems}>
                    {
                      Object.keys(filters).map((key) => {
                        const label = key === 'eb' ? filters[key].name : `${showChineseLabel2(key)}: ${filters[key]}`;// special
                        // console.log('- - ', label);
                        return (
                          <Tag
                            className={styles.filterItem}
                            key={key}
                            closable
                            afterClose={() => this.onFilterChange(key, filters[key], false)}
                            color="blue"
                          >{label}</Tag>
                        );
                      })
                    }
                  </ul>
                </div>}

                {
                  aggs.map((agg) => {
                    if (agg.label === sysconfig.SearchFilterExclude) { // skip gender
                      return '';
                    }
                    if (filters[agg.type]) {
                      return '';
                    } else {
                      // if agg is empty
                      if (!agg.item || agg.item.length === 0) {
                        return '';
                      }
                      const cnLabel = showChineseLabel(agg.label);
                      return (
                        <div className={styles.filterRow} key={agg.type}>
                          <span className={styles.filterTitle}>{cnLabel}:</span>
                          <ul className={styles.filterItems}>
                            {agg.item.slice(0, 12).map((item) => {
                              return (
                                <CheckableTag
                                  key={`${item.label}_${agg.label}`}
                                  className={styles.filterItem}
                                  checked={filters[agg.label] === item.label}
                                  onChange={checked => this.onFilterChange(agg.type, item.label, checked)}
                                >
                                  {item.label}
                                  (<span className={styles.filterCount}>{item.count}</span>)
                                </CheckableTag>
                              );
                            })
                            }
                          </ul>
                        </div>
                      );
                    }
                  })
                }

              </div>

            </div>
          </div>

          <div className="rightZone">
            <KnowledgeGraphSearchHelper query={query} />
          </div>
        </div>

        {/* 这里可是添加TAB */}

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

        <Spin spinning={loading} size="large">
          <div className={styles.view}>
            {this.state.view[this.state.currentTab]}
          </div>
        </Spin>
      </div>
    );
  }
}


export default connect(({ app, search, loading }) => ({ app, search, loading }))(UniSearch);
