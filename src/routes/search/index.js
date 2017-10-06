import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Tabs, Tag, Pagination, Spin } from 'antd';
import styles from './SearchComponent.less';
import { PersonList } from '../../components/person';
import { sysconfig } from '../../systems';
import ExportPersonBtn from '../../components/person/export-person';
import { KgSearchBox, SearchFilter } from '../../components/search';

const TabPane = Tabs.TabPane;

const searchSorts = [
  { label: '相关度', key: 'relevance' },
  { label: '学术成就', key: 'h_index' },
  { label: '学术活跃度', key: 'activity' },
  { label: '领域新星', key: 'rising_star' },
  { label: '学会贡献', key: 'activity-ranking-contrib' },

];

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
              <KgSearchBox
                size="large" style={{ width: 500 }} btnText="搜索"
                query={query} onSearch={onSearch}
              />
            </div>
          </div>

          <SearchFilter
            filters={filters}
            aggs={aggs}
            onFilterChange={onFilterChange}
            onExpertBaseChange={onExpertBaseChange}
            disableExpertBaseFilter={!sysconfig.SHOW_ExpertBase}
          />

        </div>

        <div className="rightZone">
          {/* <KnowledgeGraphSearchHelper query={query} lang="cn" /> */}
          {sysconfig.Enable_Export &&
          <ExportPersonBtn {...filters} results={results} />
          }
        </div>
      </div>

      <Spin spinning={loading} size="large">
        <div className={styles.personWrap}>

          <Tabs
            defaultActiveKey="relevance"
            onChange={onOrderChange}
            size="small"
          >
            {searchSorts.map((sortItem) => {
              const icon = sortItem.key === 'this.state.sortType' ?
                <i className="fa fa-sort-amount-desc" /> : '';
              const tab = <span>{sortItem.label} {icon}</span>;
              return <TabPane tab={tab} key={sortItem.key} />;
            })}
          </Tabs>

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
