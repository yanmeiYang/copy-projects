import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Tabs, Tag, Pagination, Spin } from 'antd';
import SearchBox from '../../components/SearchBox';
import styles from './index.less';
import { PersonList } from '../../components/person';
import { sysconfig } from '../../systems';
import { KnowledgeGraphSearchHelper } from '../knowledge-graph';
import { classnames } from '../../utils';
import ExportPersonBtn from '../../components/person/export-person';

const TabPane = Tabs.TabPane;
const { CheckableTag } = Tag;

const labelMap = { 'H-Index': 'h指数', Language: '语言', Location: '国家' };
function showChineseLabel(enLabel) {
  const cnLabel = labelMap[enLabel];
  return !cnLabel ? enLabel : cnLabel;
}

const Search = ({ dispatch, search }) => {
  const { results, pagination, query, aggs, loading, filters } = search;
  const { pageSize, total, current } = pagination;

  const expertBases = sysconfig.ExpertBases;

  // Select default Expert Base.
  if (filters && !filters.eb) {
    filters.eb = { id: sysconfig.DEFAULT_EXPERT_BASE, name: 'CCF 会员' };
  }

  function onFilterChange(key, value, checked) {
    // if onExpertBaseChanged, all filters is cleared.
    if (checked) {
      filters[key] = value;
    } else if (filters[key]) {
      delete filters[key];
    }
    dispatch({ type: 'search/updateFilters', payload: { filters } });
    dispatch({
      type: 'search/searchPerson',
      payload: { query, offset: 0, size: 30, filters },
    });
    dispatch({
      type: 'search/searchPersonAgg',
      payload: { query, offset: 0, size: 30, filters },
    });
  }

  // ExpertBase filter 'eb' is a special filter.
  // On expert base changed, all other filters should be cleared.
  // sort method is not cleared.
  function onExpertBaseChange(id, name) {
    // delete all other filters.
    Object.keys(filters).forEach((f) => {
      delete filters[f];
    });
    onFilterChange('eb', { id, name }, true);// Special Filter;
  }

  function onSearch(data) {
    if (!data.query) {
      return false;
    }
    // delete all other filters.
    // Object.keys(filters).forEach((f) => {
    //   if (f !== 'eb') { // 保留智库，其余filter都清空。
    //     delete filters[f];
    //   }
    // });
    const urlQuery = {};
    if (filters.eb) {
      urlQuery.eb = filters.eb.id;
    }
    // redirect to search.
    const newOffset = data.offset || 0;
    const newSize = data.size || 30;
    dispatch(routerRedux.push({
      pathname: `/search/${data.query}/${newOffset}/${newSize}`,
      query: urlQuery,
    }));
  }

  function onPageChange(page) {
    onSearch({
      query,
      offset: (page - 1) * pageSize,
      size: pageSize,
    });
    // ReactDOM.findDOMNode(this.refs.wrap).scrollTo(0, 0);
  }

  function filterDisplay(name) {
    return <span>{name} <i className="fa fa-sort-amount-desc" /></span>;
  }

  function onOrderChange(e) {
    dispatch({ type: 'search/updateSortKey', payload: { key: e } });
    dispatch({
      type: 'search/searchPerson',
      payload: { query, offset: 0, size: 30, filters, sort: e },
    });
  }

  return (
    <div className="content-inner">

      <div className={styles.topZone}>
        <div className="searchZone">
          {/* 搜索框 */}
          <div className={styles.top}>
            <div className={styles.searchWrap}>
              <SearchBox size="large" style={{ width: 680 }} btnText="搜索" keyword={query}
                         onSearch={onSearch} />
            </div>
          </div>

          {/* Filter */}
          <div className={styles.filterWrap}>
            <div className={styles.filter}>

              {expertBases &&
              <div className={classnames(styles.filterRow, styles.range)}>
                <span className={styles.filterTitle}>搜索范围:</span>
                <ul className={styles.filterItems}>
                  {
                    expertBases.map((ep) => {
                      const props = {
                        key: ep.id,
                        className: styles.filterItem,
                        onChange: () => onExpertBaseChange(ep.id, ep.name),
                        checked: filters.eb && (filters.eb.id === ep.id),
                      }
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
                      const label = key === 'eb' ? filters[key].name : `${key}: ${filters[key]}`;
                      return (
                        <Tag
                          className={styles.filterItem}
                          key={key}
                          closable
                          afterClose={() => onFilterChange(key, filters[key], false)}
                          color="blue"
                        >{label}</Tag>
                      );
                    })
                  }
                </ul>
              </div>}

              {
                aggs.map((agg) => {
                  if (agg.label === 'Gender') {
                    return '';
                  }
                  if (filters[agg.label]) {
                    return '';
                  } else {
                    const cnLabel = showChineseLabel(agg.label);
                    return (
                      <div className={styles.filterRow} key={agg.type}>
                        <span className={styles.filterTitle}>{cnLabel}:</span>
                        <ul className={styles.filterItems}>
                          {
                            agg.item.map((item) => {
                              return (
                                <CheckableTag
                                  key={`${item.label}_${agg.label}`}
                                  className={styles.filterItem}
                                  checked={filters[agg.label] === item.label}
                                  onChange={checked => onFilterChange(agg.type, item.label, checked)}
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
            <Tabs defaultActiveKey="relevance" onChange={onOrderChange}>
              <TabPane tab={filterDisplay('相关度')} key="relevance" />
              <TabPane tab={filterDisplay('学术成就')} key="h_index" />
              <TabPane tab={filterDisplay('学术活跃度')} key="activity" />
              <TabPane tab={filterDisplay('领域新星')} key="rising_star" />
              <TabPane tab={filterDisplay('学会贡献')} key="contrib" />
            </Tabs>
          </div>
        </div>

        <div className="rightZone">
          <KnowledgeGraphSearchHelper query={query} lang="cn" />
          <ExportPersonBtn {...filters} results={results}/>
        </div>
      </div>

      <Spin spinning={loading} size="large">
        <div className={styles.personWrap}>
          <PersonList persons={results} />

          <div className={styles.paginationWrap}>
            <Pagination
              showQuickJumper
              current={current}
              defaultCurrent={1}
              defaultPageSize={pageSize}
              total={total}
              onChange={onPageChange}
            />
          </div>
        </div>
      </Spin>
    </div>
  );
};


export default connect(({ search, loading }) => ({ search, loading }))(Search);
