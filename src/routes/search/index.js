import React from 'react';
import { routerRedux, Link } from 'dva/router';
import { connect } from 'dva';
import { Tabs, Icon, Tag, Pagination, Spin } from 'antd';
import SearchBox from '../../components/SearchBox';
import styles from './index.less';

const TabPane = Tabs.TabPane;

const Search = ({ dispatch, search }) => {
  const { results, pagination, query, aggs, loading } = search;
  const { pageSize, total, current } = pagination;

  console.log(current);

  function onSearch({ keyword, offset, size }) {
    const newOffset = offset || 0;
    const newSize = size || 30;
    dispatch(routerRedux.push({
      pathname: `/search/${keyword}/${newOffset}/${newSize}`,
    }));
  }

  function onPageChange(page, pageSize) {
    console.log('Page: ', page, pageSize);
    onSearch({
      keyword: query,
      offset: (page - 1) * pageSize,
      size: pageSize,
    });
  }

  return (
    <div className="content-inner">
      <div className={styles.top}>
        {/*<div>*/}
          {/*<span>分类筛选</span>*/}
        {/*</div>*/}
        <div className={styles.searchWrap}>
          {/*<h3>云智库搜索</h3>*/}
          <SearchBox size="large" style={{ width: 500 }} btnText="智库搜索" onSearch={onSearch} />
        </div>
      </div>
      <div className={styles.filterWrap}>
        <div className={styles.filter}>
          {
            aggs.map((agg) => {
              return (<div className={styles.filterRow} key={agg.type}>
                <span className={styles.filterTitle}>{agg.label}:</span>
                <ul className={styles.filterItems}>
                  {
                    agg.item.map((item) => {
                      return (<Tag className={styles.filterItem}>
                        {item.label} (<span className={styles.filterCount}>{item.count}</span>)
                      </Tag>);
                    })
                  }
                </ul>
              </div>);
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
                  <img src={`${result.avatar}`} alt="头像" />
                </div>
                <div className={styles.right}>
                  <div className={styles.nameWrap}>
                    <h3>{name1}</h3>
                    { name2 ? <h4>{`(${name2})`}</h4> : '' }
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
