import React from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Col } from 'antd';
import styles from './index.less';
import SearchBox from '../../components/SearchBox';

function IndexPage({ dispatch, search }) {
  const { seminars, rosters } = search;
  let commonSearch = [ '大数据', '机器学习', '社交媒体', '深度学习', '数据挖掘', '健康医疗', '计算机网络', '人机交互', '人工智能'];
  let organization = [ '高性能计算机协会', '计算机安全协会', '普通计算协会', '高性能计算机协会1', '计算机安全协会1', '普通计算协会1', '高性能计算机协会2', '计算机安全协会2', '普通计算协会2'];

  function onSearch({ query }) {
    dispatch(routerRedux.push({
      pathname: `/search/${query}/0/30`,
    }));
  }
  return (
    <div>
      <div className={styles.normal}>
        <h1>云智库搜索</h1>
        <SearchBox size="large" style={{ width: 500 }} onSearch={onSearch} />
        {/*常用搜索*/}
        <p className={styles.commonSearch}>
          {
            commonSearch.map((query,index) => {
              return (
                <span>
                  <Link to={`/search/${query}/0/30`} key={query}>{query}</Link>
                  <span>{ ( index === commonSearch.length - 1 ) ? '' : ', '}</span>
                </span>
              )
            })
          }
        </p>
      </div>

      <div className={styles.container}>
        {/*协会组织*/}
        <Col span={10}>
          <div className={styles.headline}>
            <h2>协会组织</h2>
          </div>
          <ul className={styles.orgList}>
            {
              organization.map((org) => {
                return (<li key={org}>{org}</li>);
              })
            }
          </ul>
          {/*{*/}
            {/*rosters.map((roster) => {*/}
              {/*return (<p key={roster.id}>{roster.title}</p>);*/}
            {/*})*/}
          {/*}*/}
        </Col>
        <Col span={14}>
          <div className={styles.headline}>
            <h2>协会活动</h2>
          </div>
          {
            seminars.map((seminar) => {
              return (<p key={seminar.id}>{seminar.title}</p>);
            })
          }
        </Col>
      </div>
    </div>
  );
}


export default connect(({ search }) => ({ search }))(IndexPage);
