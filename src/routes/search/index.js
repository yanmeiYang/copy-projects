import React from 'react';
import { routerRedux, Link } from 'dva/router';
import { connect } from 'dva';
import { Tabs, Icon, Tag, Pagination, Spin } from 'antd';
import SearchBox from '../../components/SearchBox';
import styles from './index.less';

const TabPane = Tabs.TabPane;
const { CheckableTag } = Tag;

const Search = ({ dispatch, search }) => {
  const { results, pagination, query, aggs, loading, filters } = search;
  const { pageSize, total, current } = pagination;


  function onFilterChange(key, value, checked) {
    if (checked) {
      filters[key] = value;
    } else if (filters[key]) {
      delete filters[key];
    }
    dispatch({
      type: 'search/updateFilters',
      payload: { filters },
    });
    dispatch({
      type: 'search/searchPerson',
      payload: {
        query,
        offset: 0,
        size: 30,
        filters,
      },
    });
    dispatch({
      type: 'search/searchPersonAgg',
      payload: {
        query,
        offset: 0,
        size: 30,
        filters,
      },
    });
  }


  function onSearch({ keyword, offset, size }) {
    const newOffset = offset || 0;
    const newSize = size || 30;
    dispatch(routerRedux.push({
      pathname: `/search/${keyword}/${newOffset}/${newSize}`,
    }));
  }

  function onPageChange(page) {
    onSearch({
      keyword: query,
      offset: (page - 1) * pageSize,
      size: pageSize,
    });
  }

  return (
    <div className="content-inner">
      <div className={styles.top}>
        <div className={styles.searchWrap}>
          <SearchBox size="large" style={{ width: 500 }} btnText="智库搜索" keyword={query} onSearch={onSearch} />
        </div>
      </div>
      <div className={styles.filterWrap}>
        <div className={styles.filter}>
          {filters && Object.keys(filters).length > 0 &&
            <div className={styles.filterRow}>
              <span className={styles.filterTitle}>过滤条件:</span>
              <ul className={styles.filterItems}>
                {
                  Object.keys(filters).map((key) => {
                    return (<Tag
                      className={styles.filterItem}
                      key={key}
                      closable
                      afterClose={() => onFilterChange(key, filters[key], false)}
                      color="blue"
                    >
                      {`${key}: ${filters[key]}`}
                    </Tag>);
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
          {/*<div className={styles.filterRow}>*/}
            {/*<span>标签:</span>*/}
          {/*</div>*/}
          {/*<div className={styles.filterRow}>*/}
            {/*<span>级别:</span>*/}
          {/*</div>*/}
          {/*<div className={styles.filterRow}>*/}
            {/*<span>搜索:</span>*/}
          {/*</div>*/}
        </div>
        <Tabs defaultActiveKey="contrib" >
          <TabPane tab="贡献度" key="contrib" />
          <TabPane tab="h-index" key="h_index" />
          <TabPane tab="活跃度" key="activity" />
          <TabPane tab="领域新星" key="rising" />
          <TabPane tab="引用数" key="citation" />
          <TabPane tab="论文数" key="num_pubs" />
        </Tabs>
      </div>
      <Spin spinning={loading}>
        <div className={styles.personWrap}>

          {
            results.map((result) => {
              const name1 = result.name_zh ? result.name_zh : result.name;
              const name2 = result.name_zh ? result.name : null;
              const position = result.pos && result.pos.length > 0 ? result.pos[0].n : null;
              const aff = result.contact && result.contact.affiliation ?
                result.contact.affiliation : null;
              const address = result.contact && result.contact.address ?
                result.contact.address : null;
              return (<div className={styles.person} key={result.id}>
                <div className={styles.left}>
                  <Link to={`/person/${result.id}`}><img src={`${result.avatar}`} alt="头像" /></Link>
                </div>
                <div className={styles.right}>
                  <div className={styles.nameWrap}>
                    <Link to={`/person/${result.id}`}>
                      <h3>{name1}</h3>
                      { name2 ? <h4>{`(${name2})`}</h4> : '' }
                    </Link>
                  </div>
                  <div className={styles.statWrap}>
                    <div className={styles.item}>
                      <span className={styles.label}>h-index:</span>
                      <span>{result.indices.h_index}</span>
                    </div>
                    <span className={styles.split}>|</span>
                    <div className={styles.item}>
                      <span className={styles.label}>论文数:</span>
                      <span>{result.indices.num_pubs}</span>
                    </div>
                    <span className={styles.split}>|</span>
                    <div className={styles.item}>
                      <span className={styles.label}>引用数:</span>
                      <span>{result.indices.num_citation}</span>
                    </div>
                  </div>
                  <div className={styles.infoWrap}>
                    {position ? (<p className={styles.infoItem}>
                      <Icon type="idcard" />
                      { position }
                    </p>) : ''}
                    {aff ? (<p className={styles.infoItem}>
                      <Icon type="home" />
                      { aff }
                    </p>) : ''}
                    {address ? (<p className={styles.infoItem}>
                      <Icon type="environment" />
                      { address }
                    </p>) : ''}
                  </div>
                  <div className={styles.tagWrap}>
                    {result.tags.map((tag) => {
                      return (<Link to={`/search/${tag.t}/0/30`}><Tag key={Math.random()} className={styles.tag}>{tag.t}</Tag></Link>);
                    })}
                  </div>
                </div>
              </div>);
            })
          }
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
