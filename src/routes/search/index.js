import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Tabs, Tag, Pagination, Spin } from 'antd';
import SearchBox from '../../components/SearchBox';
import styles from './index.less';
import { PersonList } from '../../components/person';

const TabPane = Tabs.TabPane;
const { CheckableTag } = Tag;

const Search = ({ dispatch, search }) => {
  const { results, pagination, query, aggs, loading, filters } = search;
  const { pageSize, total, current } = pagination;

  //  TODO move to config file.
  const expertBases = [
    {
      id: '592f8af69ed5db8bb68d713b',
      name: '会士(F)',
      nperson: 79,
    },
    {
      id: '58ddbc229ed5db001ceac2a4',
      name: '杰出会员(D)',
      nperson: 182,
    },
    {
      id: '592f6d219ed5dbf59c1b76d4',
      name: '高级会员(S)',
      nperson: 2246,
    },
    {
      id: '58e462db9ed5db3b45bad77e',
      name: '杰出会员(D)-2',
      nperson: 6,
    },
    {
      id: '593a6dab9ed5db23ccac5689',
      name: '高级会员(S)-2',
      nperson: 610,
    },
  ]

  function onFilterChange(key, value, checked) {
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

  function onExpertBaseChange(id, name) {
    onFilterChange('eb', { id, name }, true);// Special Filter;
  }

  function onSearch(data) {
    const newOffset = data.offset || 0;
    const newSize = data.size || 30;
    dispatch(routerRedux.push({
      pathname: `/search/${data.query}/${newOffset}/${newSize}`,
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
      <div className={styles.top}>
        <div className={styles.searchWrap}>
          <SearchBox size="large" style={{ width: 500 }} btnText="专家搜索" keyword={query} onSearch={onSearch} />
        </div>
      </div>
      <div className={styles.filterWrap}>

        <div className={styles.filter}>

          {expertBases &&
          <div className={styles.filterRow}>
            <span className={styles.filterTitle}>级别:</span>
            <ul className={styles.filterItems}>
              {
                expertBases.map((ep) => {
                  return (
                    <CheckableTag
                      key={ep.id}
                      className={styles.filterItem}
                      checked={filters.eb && (filters.eb.id === ep.id)}
                      onChange={() => onExpertBaseChange(ep.id, ep.name)}
                    >
                      {ep.name} {/* TODO Show Numbers */}
                    </CheckableTag>
                  );
                })
              }
            </ul>
          </div>
          }

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
          </div>
          }
          {
            aggs.map((agg) => {
              if (filters[agg.label]) {
                return '';
              } else {
                return (
                  <div className={styles.filterRow} key={agg.type}>
                    <span className={styles.filterTitle}>{agg.label}:</span>
                    <ul className={styles.filterItems}>
                      {
                        agg.item.map((item) => {
                          return (
                            <CheckableTag
                              key={`${item.label}_${agg.label}`}
                              className={styles.filterItem}
                              checked={filters[agg.label] === item.label}
                              onChange={checked => onFilterChange(agg.label, item.label, checked)}
                            >
                              {item.label} (<span className={styles.filterCount}>{item.count}</span>)
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
          <TabPane tab={filterDisplay('学会贡献')} key="contrib" />
          <TabPane tab={filterDisplay('学术成就')} key="h_index" />
          <TabPane tab={filterDisplay('学术活跃度')} key="activity" />
          <TabPane tab={filterDisplay('领域新星')} key="rising_star" />
        </Tabs>
      </div>

      <Spin spinning={loading}>
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
