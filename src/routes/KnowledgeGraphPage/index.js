/*
 * created by BoGAo on 2017-06-27.
 */
import React from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import styles from './index.less';
import SearchBox from '../../components/SearchBox';
import { KnowledgeGraphTextTree } from '../knowledge-graph';
import { sysconfig } from '../../systems';

function KnowledgeGraphPage({ dispatch }) {

  function onSearch({ query }) {
    dispatch(routerRedux.push({
      pathname: `/${sysconfig.SearchPagePrefix}/${query}/0/30`,
    }));
  }

  return (
    <div>
      <div className={styles.normal}>
        <h1>知识图谱</h1>
        <div className={styles.overBox}>
          <KnowledgeGraphTextTree
            query="__ALL"
            lang="en"
            onItemClick={(name, level, node) => {
              console.log('click', name, level, node);
            }}
          />
        </div>
      </div>
    </div>
  )
    ;
}


export default connect(({}) => ({}))(KnowledgeGraphPage);
