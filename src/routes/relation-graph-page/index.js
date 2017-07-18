/* eslint-disable no-const-assign */
/*
 * created by BoGAo on 2017-07-10.
 */
import React from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import styles from './index.less';
import RelationGraph from '../relation-graph/RelationGraph';
import { sysconfig } from '../../systems';
import SearchBox from '../../components/SearchBox';


class RelationGraphPage extends React.Component {
  state = {
    currentQuery: 'data mining',
  }
  onSearch = ({ query }) => {
    this.setState({ currentQuery: query });
    // dispatch(routerRedux.push({
    //   pathname: `/${sysconfig.SearchPagePrefix}/${query}/0/30`,
    // }
    // ));
  };

  render() {
    return (
      <div>
        <div className={styles.normal}>
          <h1>关系图</h1>

          <SearchBox
            size="large" btnText="搜索" style={{ width: 680 }}
            // keyword={this.query}
            onSearch={this.onSearch}
          />
          <h2>{this.state.currentQuery}</h2>
          <div className={styles.overBox}>

            <RelationGraph query={this.state.currentQuery} />

          </div>
        </div>
      </div>
    );
  }
}


export default connect(({}) => ({}))(RelationGraphPage);
