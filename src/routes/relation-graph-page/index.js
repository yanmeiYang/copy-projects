/*
 * created by BoGAo on 2017-07-10.
 */
import React from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import styles from './index.less';
import RelationGraph from '../relation-graph/RelationGraph';
import { sysconfig } from '../../systems';

function RelationGraphPage({ dispatch }) {

  function onSearch({ query }) {
    dispatch(routerRedux.push({
      pathname: `/${sysconfig.SearchPagePrefix}/${query}/0/30`,
    }));
  }

  return (
    <div>
      <div className={styles.normal}>
        <h1>关系图</h1>
        <div className={styles.overBox}>

          <RelationGraph />

        </div>
      </div>
    </div>
  )
    ;
}


export default connect(({}) => ({}))(RelationGraphPage);
