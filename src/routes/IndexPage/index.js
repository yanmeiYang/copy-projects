import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from './index.less';
import SearchBox from '../../components/SearchBox';

function IndexPage({ dispatch, search }) {
  const { seminars } = search;
  console.log(seminars);
  function onSearch({ query }) {
    dispatch(routerRedux.push({
      pathname: `/search/${query}/0/30`,
    }));
  }
  return (
    <div className={styles.normal}>
      <h1>云智库搜索</h1>
      <SearchBox size="large" style={{ width: 500 }} onSearch={onSearch} />
      <div>
        {
          seminars.map((seminar) => {
            return (<p key={seminar.id}>{seminar.title}</p>);
          })
        }
      </div>
    </div>
  );
}


export default connect(({ search }) => ({ search }))(IndexPage);
